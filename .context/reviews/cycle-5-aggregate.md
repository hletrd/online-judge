# Cycle 5 Aggregate Review

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Review artifacts:** cycle-5-code-reviewer.md, cycle-5-security-reviewer.md, cycle-5-perf-reviewer.md, cycle-5-architect.md, cycle-5-critic.md, cycle-5-debugger.md, cycle-5-verifier.md, cycle-5-test-engineer.md, cycle-5-tracer.md, cycle-5-designer.md, cycle-5-document-specialist.md

## Deduped Findings (sorted by severity then signal)

### AGG-1: Systemic clock-skew risk — 6 API routes/lib functions use `new Date()` for security-relevant temporal comparisons [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-1), security-reviewer (SEC-1 through SEC-6), architect (ARCH-1), critic (CRI-1), verifier (V-1), tracer (TR-1), test-engineer (TE-3, TE-4)
**Files:**
- `src/lib/api/api-key-auth.ts:86`
- `src/lib/assignments/exam-sessions.ts:49-56`
- `src/lib/assignments/access-codes.ts:128-130`
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:62-68`
- `src/app/api/v1/submissions/route.ts:295`
- `src/app/api/v1/submissions/[id]/rejudge/route.ts:79`

**Description:** The recruit page was fixed in cycle 27 to use `getDbNow()` for temporal comparisons, but the same pattern persists in 6 additional locations that make security-relevant decisions. Each uses `new Date()` (app server clock) instead of DB server time for comparisons against DB-stored timestamps. This is the same class of vulnerability (clock-skew inconsistency between app server and DB server) that was fixed for the recruit page.

**Concrete failure scenarios:**
1. **API key auth (SEC-1):** An expired API key could still authenticate if the app clock is behind the DB clock.
2. **Exam sessions (SEC-2):** A student could start an exam after the deadline has passed per DB time. The personal deadline would also be based on app-server time, creating an inconsistency.
3. **Access codes (SEC-3):** A student could redeem an access code after the contest has closed per DB time.
4. **Anti-cheat (SEC-4):** Clock drift could allow anti-cheat events outside the contest window.
5. **Submissions (SEC-5):** A submission could be accepted after the exam deadline per DB time.
6. **Rejudge (SEC-6):** Audit log flag for "contest finished" could be incorrect. Low impact — audit only.

**Fix:** Use `getDbNow()` (or equivalent DB-sourced time) for all temporal comparisons in API routes and server actions that make security-relevant decisions. For routes inside transactions, consider `SELECT NOW()` within the same transaction for consistency.

**Cross-agent signal:** 7 of 11 agents flagged this independently — very high signal.

---

### AGG-2: `getDbNow()` silently falls back to `new Date()` when DB query returns null [MEDIUM/MEDIUM]

**Flagged by:** critic (CRI-2), debugger (DBG-1), tracer (TR-2), verifier (V-2), document-specialist (DOC-1)
**File:** `src/lib/db-time.ts:16`

**Description:** `return row?.now ?? new Date()` silently falls back to app-server time when the DB query fails. This defeats the purpose of the utility — it was created to avoid clock skew, but the fallback provides exactly the skewed time it was designed to prevent. Additionally, this masks DB connectivity issues, making debugging harder.

**Concrete failure scenario:** A transient DB issue causes `rawQueryOne` to return null. `getDbNow()` returns `new Date()` (potentially skewed). All temporal comparisons using this value are now incorrect, and no error is logged or thrown.

**Fix:** Throw an error when `rawQueryOne` returns null instead of silently falling back. Update the JSDoc to document this behavior.

**Cross-agent signal:** 5 of 11 agents flagged this — high signal.

---

### AGG-3: SSE `user!.id` non-null assertion persists despite cycle 27 "fix" [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-2), critic (CRI-3), debugger (DBG-2), verifier (V-3)
**File:** `src/app/api/v1/submissions/[id]/events/route.ts:315`

**Description:** The cycle 27 fix (AGG-3/M2) moved `viewerId` capture before the `sendTerminalResult` closure but kept the `!` non-null assertion. The `!` bypasses TypeScript null safety. The proper fix is to capture `const viewerId = user.id` at the top level of the GET function (after the null check on line 194), where TypeScript narrows `user` to non-null.

**Fix:** Move `const viewerId = user.id` to after line 194 (`if (!user) return unauthorized()`), where TypeScript narrows `user` to non-null. Remove `const viewerId = user!.id;` on line 315.

**Cross-agent signal:** 4 of 11 agents flagged this — medium signal.

---

### AGG-4: Client-side `toLocaleString()` without locale produces inconsistent formatting [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-3), designer (DES-1, DES-2)
**Files:**
- `src/components/contest/participant-anti-cheat-timeline.tsx:149`
- `src/components/contest/anti-cheat-dashboard.tsx:256`
- `src/app/(dashboard)/dashboard/admin/plugins/chat-logs/chat-logs-client.tsx:110`
- `src/app/(dashboard)/dashboard/admin/plugins/chat-logs/chat-logs-client.tsx:154`
- `src/components/contest/recruiting-invitations-panel.tsx:252`

**Description:** These client components use `toLocaleString()` or `toLocaleDateString()` without specifying a locale. For an i18n app supporting Korean and English, this produces inconsistent formatting. These are admin-only views so the user impact is lower than the recruit page fix from cycle 27.

**Fix:** Pass the current locale from next-intl to `toLocaleString(locale)` or use `formatDateTimeInTimeZone` from `@/lib/datetime`.

**Cross-agent signal:** 2 of 11 agents flagged this.

---

### AGG-5: No test coverage for `escapeLikePattern` utility [MEDIUM/HIGH]

**Flagged by:** test-engineer (TE-1)
**File:** `src/lib/db/like.ts`

**Description:** The `escapeLikePattern` utility is used across 20+ files but has no dedicated unit test. This is the central LIKE escape function — if it breaks, it breaks every search feature. The function is small and pure, making it trivial to test.

**Fix:** Add unit tests for `escapeLikePattern` covering normal strings, `%`, `_`, `\`, and combined patterns.

**Cross-agent signal:** 1 agent but high confidence.

---

### AGG-6: Doc-code mismatch in access-codes.ts — comment claims "transaction-consistent time" but uses `new Date()` [LOW/MEDIUM]

**Flagged by:** document-specialist (DOC-2)
**File:** `src/lib/assignments/access-codes.ts:127`

**Description:** Line 127 comment says "Block join after contest deadline (using transaction-consistent time)" but line 128 uses `new Date()`, which is app-server time, not transaction-consistent time.

**Fix:** Either update the comment to accurately describe the behavior, or fix the code to use DB-sourced time (preferred, aligns with AGG-1).

**Cross-agent signal:** 1 agent but high confidence.

---

### AGG-7: `getDbNow()` is only usable in React server component contexts due to `React.cache()` [LOW/MEDIUM]

**Flagged by:** architect (ARCH-2)
**File:** `src/lib/db-time.ts:14`

**Description:** `getDbNow()` uses `React.cache()` which only works within React server render contexts. It cannot be used in `authenticateApiKey()` (called from API route middleware) or other non-React contexts.

**Fix:** Add a `getDbNowUncached()` helper that calls `rawQueryOne("SELECT NOW()")` directly for use in non-React contexts.

**Cross-agent signal:** 1 agent, medium confidence.

---

### AGG-8: No test coverage for `getDbNow` utility, API key expiry, or exam session deadlines [LOW/MEDIUM]

**Flagged by:** test-engineer (TE-2, TE-3, TE-4)
**Files:** `src/lib/db-time.ts`, `src/lib/api/api-key-auth.ts:86`, `src/lib/assignments/exam-sessions.ts:49-56`

**Description:** No tests exist for the `getDbNow` utility itself, the API key expiry behavior, or the exam session deadline enforcement boundary conditions.

**Fix:** Add targeted tests for each.

**Cross-agent signal:** 1 agent, medium confidence.

---

### AGG-9: `getContestsForUser` SQL uses `NOW()` in ORDER BY but JS uses `new Date()` for status [LOW/LOW]

**Flagged by:** perf-reviewer (PERF-2)
**Files:** `src/lib/assignments/contests.ts:113-116`, `src/lib/assignments/public-contests.ts:30`

**Description:** Minor inconsistency — SQL uses DB time for ordering while JS uses app-server time for status determination.

**Fix:** Very low priority. Pass DB time to `getContestStatus()` for consistency.

**Cross-agent signal:** 1 agent, low confidence.

---

### AGG-10: SSE cleanup timer race during hot-reload (development only) [LOW/LOW]

**Flagged by:** debugger (DBG-3)
**File:** `src/app/api/v1/submissions/[id]/events/route.ts:81-95`

**Description:** Brief window during Next.js hot-reload where no cleanup timer is running. Development-only issue.

**Fix:** No action required for production.

**Cross-agent signal:** 1 agent, low confidence.

---

## Carried Forward from Cycle 27

### AGG-27-4 (DEFER-1): Inconsistent use of `createApiHandler` across 22 route handlers [LOW/MEDIUM]

Still deferred. Exit criterion: when a security fix to the auth pattern needs to be applied to both `createApiHandler` and the 22 manual routes.

### AGG-27-5 (DEFER-2): SSE connection tracking eviction optimization [LOW/LOW]

Still deferred. Exit criterion: when `MAX_TRACKED_CONNECTIONS` is significantly increased or profiling shows the eviction loop is a bottleneck.

### AGG-27-7 (DEFER-3): SSE connection cleanup test coverage [LOW/LOW]

Still deferred. Exit criterion: when the SSE module is refactored or when integration test infrastructure is added for streaming routes.

---

## Verified Safe / No Regression Found

- Auth flow is robust with Argon2id, timing-safe dummy hash, rate limiting, and proper token invalidation.
- No `dangerouslySetInnerHTML` without sanitization.
- No `as any`, `@ts-ignore`, or `@ts-expect-error`.
- Only 2 eslint-disable directives, both with justification comments.
- No silently swallowed catch blocks.
- All LIKE/ILIKE queries use `escapeLikePattern` from `@/lib/db/like` with `ESCAPE '\\'`.
- Environment variables are properly validated in production.
- CSRF protection is in place for server actions.
- Rate limiting has two-tier strategy preventing TOCTOU races.
- Recruiting token flow uses atomic SQL transactions for claim validation.
- Korean letter-spacing remediation is comprehensive.
- Previous cycle-27 fixes confirmed working (recruit test, ESLint config, React.cache, tracking comments).

## Agent Failures

None. All review perspectives completed successfully.
