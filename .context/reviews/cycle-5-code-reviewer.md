# Code Reviewer — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** code-reviewer

## Findings

### CR-1: Systemic clock-skew risk — 6 API routes/lib functions use `new Date()` for security-relevant temporal comparisons [MEDIUM/HIGH]

**Files:**
- `src/app/api/v1/submissions/[id]/rejudge/route.ts:79`
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:62-68`
- `src/lib/assignments/exam-sessions.ts:49-56`
- `src/lib/assignments/access-codes.ts:128-130`
- `src/app/api/v1/submissions/route.ts:295`
- `src/lib/api/api-key-auth.ts:86`

**Description:** The recruit page was fixed in cycle 27 to use `getDbNow()` for temporal comparisons, but the same pattern persists in 6 additional locations that make security-relevant decisions. Each uses `new Date()` (app server clock) instead of DB server time for comparisons against DB-stored timestamps.

**Concrete failure scenarios:**
1. **Rejudge route (line 79):** `new Date() > assignment.deadline` — Clock drift could log rejudge as "contest already finished" when it is not, or vice versa.
2. **Anti-cheat route (lines 62-68):** `now < assignment.startsAt` and `now > assignment.deadline` — Clock drift could allow anti-cheat event submission before contest starts or after it ends.
3. **Exam sessions (lines 49-56):** `now < assignment.startsAt` and `now >= assignment.deadline` — A student could start an exam session when the deadline has actually passed per the DB.
4. **Access codes (lines 128-130):** `effectiveClose < now` — A student could redeem an access code after the contest has closed per the DB.
5. **Submissions route (line 295):** `lt(examSessions.personalDeadline, new Date())` — A submission could be accepted after the exam deadline per the DB.
6. **API key auth (line 86):** `candidate.expiresAt < new Date()` — An expired API key could still authenticate, or a valid key could be rejected.

**Fix:** Use `getDbNow()` (or equivalent DB-sourced time) for all temporal comparisons in API routes and server actions that make security-relevant decisions.

**Confidence:** HIGH

---

### CR-2: `user!.id` non-null assertion still present in SSE events route [LOW/MEDIUM]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:315`

**Description:** The cycle 27 "fix" for the non-null assertion moved the `viewerId` capture but kept the `!` operator. The `!` bypasses TypeScript null safety. The proper fix is to capture `const viewerId = user.id` at the top level of the GET function (after the null check on line 194), where TypeScript narrows `user` to non-null. This value would then be available via closure to `start()` and `sendTerminalResult()`.

**Fix:** Move `const viewerId = user.id` to after line 194 (`if (!user) return unauthorized()`), where TypeScript narrows `user` to non-null. Remove `const viewerId = user!.id;` on line 315.

**Confidence:** MEDIUM

---

### CR-3: Locale-agnostic `toLocaleString()` in client components [LOW/MEDIUM]

**Files:**
- `src/components/contest/participant-anti-cheat-timeline.tsx:149`
- `src/components/contest/anti-cheat-dashboard.tsx:256`
- `src/app/(dashboard)/dashboard/admin/plugins/chat-logs/chat-logs-client.tsx:110`
- `src/app/(dashboard)/dashboard/admin/plugins/chat-logs/chat-logs-client.tsx:154`

**Description:** These client components use `toLocaleString()` without specifying a locale, relying on the browser's default. For an i18n app supporting Korean and English, this produces inconsistent formatting. These are admin-only views so user impact is lower than the recruit page fix from cycle 27.

**Fix:** Pass the current locale from next-intl to `toLocaleString(locale)` or use `formatDateTimeInTimeZone` from `@/lib/datetime`.

**Confidence:** MEDIUM

---

## Verified Safe

- All LIKE/ILIKE queries use `escapeLikePattern` from `@/lib/db/like` with `ESCAPE '\\'` clause.
- No `as any`, `@ts-ignore`, or `@ts-expect-error` in the codebase.
- Only 2 eslint-disable directives, both with justification comments.
- No silently swallowed catch blocks.
- `dangerouslySetInnerHTML` used only with sanitization (`sanitizeHtml`, `safeJsonForScript`).
- Console usage limited to error boundaries and code templates.
- `React.cache()` used correctly for `getDbNow` and `getCachedInvitation`.
