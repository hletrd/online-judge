# Cycle 18 Aggregate Review

**Date:** 2026-04-19
**Aggregated from:** code-reviewer, security-reviewer, perf-reviewer, architect, test-engineer, debugger, critic
**Base commit:** 7c1b65cc

---

## Deduped Findings

### AGG-1 — [MEDIUM] `getRecruitingAccessContext` is called 2-3 times per dashboard page load without caching — systemic N+1 DB queries

- **Severity:** MEDIUM (performance + architecture)
- **Confidence:** HIGH
- **Cross-agent agreement:** code-reviewer F1, perf-reviewer F1, architect F1, security-reviewer F2, critic
- **Files:** `src/lib/recruiting/access.ts:14-66`, called from 15+ pages/routes
- **Evidence:** `getRecruitingAccessContext()` performs two DB queries (recruitingInvitations + assignmentProblems) on every call. It is called from the dashboard layout AND from individual page components, meaning 4-6 DB queries per page load that return identical data. The function has no caching layer (unlike auth context which is cached via JWT session).
- **Failure scenario:** During a recruiting contest, 200 candidates refresh the contest page simultaneously. Each page load triggers 6 recruiting-context queries (2 per call x 3 calls). Total: 1,200 DB queries, of which 800 are redundant. This adds measurable latency to every dashboard page load for recruiting candidates.
- **Suggested fix:** Add React `cache()` wrapper to deduplicate calls within a single server render. This is the lightest-weight fix and doesn't require refactoring call sites. Alternatively, pass the context from layout to page via props.

### AGG-2 — [MEDIUM] `import-transfer.ts` streaming read accumulates full body in memory — OOM risk on constrained containers

- **Severity:** MEDIUM (reliability — potential OOM crash)
- **Confidence:** MEDIUM
- **Cross-agent agreement:** code-reviewer F2, debugger F1
- **Files:** `src/lib/db/import-transfer.ts:8-25`
- **Evidence:** `readStreamTextWithLimit` reads the entire stream into a `text` string variable using `text += decoder.decode(...)`. For a 100 MB upload with multi-byte characters, the `text` variable can grow to ~150-200 MB due to UTF-16 encoding. Combined with `JSON.parse(text)` creating another copy, peak heap usage reaches ~300 MB. The string concatenation also creates intermediate strings, adding GC pressure.
- **Failure scenario:** Admin uploads a 95 MB database export on a production server running in a 512 MB container. The upload processing consumes 300 MB, leaving only 212 MB for the running Next.js process. If other requests are being processed simultaneously, the container runs out of memory and the process is killed by the OOM killer.
- **Suggested fix:** For the `readUploadedJsonFileWithLimit` path, use `file.arrayBuffer()` first (since `file.size` is already checked), then decode and parse from the buffer. This avoids the string concatenation overhead. For the streaming path (`readJsonBodyWithLimit`), use `Uint8Array` accumulation instead of string concatenation, then decode once at the end.

### AGG-3 — [LOW] Admin backup/restore/migrate routes discard `needsRehash` — bcrypt hashes persist for admin-only users

- **Severity:** LOW (defense-in-depth — bcrypt-to-argon2 migration stalls for rare user profiles)
- **Confidence:** HIGH
- **Cross-agent agreement:** code-reviewer from existing cycle-18 review F2, security-reviewer F1
- **Files:** `src/app/api/v1/admin/backup/route.ts:62`, `src/app/api/v1/admin/restore/route.ts:56`, `src/app/api/v1/admin/migrate/export/route.ts:56`, `src/app/api/v1/admin/migrate/import/route.ts:58,143`
- **Evidence:** All four admin data-management routes destructure only `{ valid }` from `verifyPassword()`, discarding `needsRehash`. The recruiting-invitations path was fixed in cycle 17 (now rehashes). The `change-password.ts` path is correctly handled (new password is being set). These admin routes present a genuine (though low-impact) missed rehash opportunity.
- **Failure scenario:** An admin with a bcrypt hash who only authenticates via backup/restore operations (e.g., automated backup scripts using password auth) never has their hash upgraded to argon2id.
- **Suggested fix:** Add rehash logic after successful password verification in the backup and export routes (most frequently used). The restore and import routes are lower priority since they run infrequently.

### AGG-4 — [LOW] Admin data-management routes have duplicated request-handling logic — DRY violation

- **Severity:** LOW (maintainability — risk of divergence)
- **Confidence:** HIGH
- **Cross-agent agreement:** code-reviewer F3, architect F2, critic
- **Files:** `src/app/api/v1/admin/backup/route.ts`, `src/app/api/v1/admin/restore/route.ts`, `src/app/api/v1/admin/migrate/export/route.ts`, `src/app/api/v1/admin/migrate/import/route.ts`
- **Evidence:** All four routes share the same authentication/authorization pattern (getApiUser, CSRF check, capability check, rate limit, password verification). This pattern is repeated verbatim. The import route additionally duplicates logic between its form-data and JSON paths.
- **Failure scenario:** A security fix is applied to the backup route's auth pattern but the export route is missed, creating a bypass.
- **Suggested fix:** Extract common logic into a shared handler wrapper or middleware function.

### AGG-5 — [LOW] `updateRecruitingInvitation` uses JS-side `new Date()` for `updatedAt` — clock skew inconsistency

- **Severity:** LOW (correctness — timestamp ordering inconsistency)
- **Confidence:** MEDIUM
- **Cross-agent agreement:** debugger F2
- **Files:** `src/lib/assignments/recruiting-invitations.ts:193`
- **Evidence:** The `updateRecruitingInvitation` function sets `updatedAt: new Date()` in JavaScript. Other parts of the recruiting flow (e.g., `redeemRecruitingToken`'s SQL WHERE clause) use SQL `NOW()` for date comparisons. In distributed deployments, the app server clock can differ from the DB server clock, creating timestamps that are inconsistent with SQL-generated timestamps.
- **Failure scenario:** App server clock is 2 seconds ahead of DB server. An invitation is revoked with `updatedAt = T+2s` (JS time), while concurrent queries use DB time `T`. The temporal inconsistency could confuse time-based queries or audit log analysis.
- **Suggested fix:** Use SQL `NOW()` for `updatedAt` in update queries, or use `sql` template literals with `NOW()` default in the Drizzle schema.

### AGG-6 — [LOW] `db/cleanup.ts` is deprecated but cron endpoint still calls it — operational confusion

- **Severity:** LOW (operations — deprecation without migration path)
- **Confidence:** HIGH
- **Cross-agent agreement:** critic F1
- **Files:** `src/lib/db/cleanup.ts:17-19`, `src/app/api/internal/cleanup/route.ts:23`
- **Evidence:** `cleanupOldEvents()` is marked `@deprecated` and the comment says it is "superseded by the in-process pruners." However, the `/api/internal/cleanup` cron endpoint still calls it. Operators who read the deprecation notice may disable their cron jobs, but the endpoint is still functional and referenced by external cron configurations.
- **Failure scenario:** An operator reads the deprecation comment and removes their cron job, expecting the in-process pruners to handle cleanup. The in-process pruners run on 24-hour intervals, so there is no gap in coverage. However, if the operator's monitoring setup expects the cron endpoint to return success, the monitoring alert fires unnecessarily.
- **Suggested fix:** Add a deprecation log message to the cron endpoint when called, and/or redirect the cron endpoint to call the canonical pruners instead of `cleanupOldEvents()`.

### AGG-7 — [LOW] `contest-analytics.ts` student progression uses raw scores without late penalties — inconsistent with leaderboard

- **Severity:** LOW (UX — confusing score discrepancy)
- **Confidence:** HIGH
- **Cross-agent agreement:** code-reviewer F4
- **Files:** `src/lib/assignments/contest-analytics.ts:234-276`
- **Evidence:** The student progression chart computes scores using `rawScaledScore = score / 100 * points` without applying late penalties. The comment at line 234 acknowledges this. For IOI contests with late penalties, a student's progression total can exceed their leaderboard total.
- **Failure scenario:** In an IOI contest with a 20% late penalty, a student's progression chart shows 500 points (raw) but their leaderboard total shows 400 points (after penalty). The student is confused.
- **Suggested fix:** Apply the same late penalty logic used in `contest-scoring.ts` to the progression calculation. This can be done by computing adjusted scores in the SQL query instead of in JS.

### AGG-8 — [LOW] Internal cleanup endpoint has no rate limiting — only `CRON_SECRET` protects it

- **Severity:** LOW (security — no defense-in-depth if secret leaks)
- **Confidence:** MEDIUM
- **Cross-agent agreement:** security-reviewer F3
- **Files:** `src/app/api/internal/cleanup/route.ts:7-24`
- **Evidence:** The endpoint is protected only by Bearer token. If `CRON_SECRET` leaks, any client can call it without restriction. The endpoint performs expensive batched DELETEs.
- **Failure scenario:** `CRON_SECRET` is accidentally committed to a public repo. An attacker calls the cleanup endpoint in a tight loop, causing repeated batched DELETEs.
- **Suggested fix:** Add rate limiting via `consumeApiRateLimit(request, "internal:cleanup")` or restrict to internal IPs.

---

## Previously Deferred Items (Carried Forward)

| ID | Finding | Severity | Status |
|----|---------|----------|--------|
| A7 | Dual encryption key management | MEDIUM | Deferred — consolidation requires migration |
| A12 | Inconsistent auth/authorization patterns | MEDIUM | Deferred — existing routes work correctly |
| A2 | Rate limit eviction could delete SSE slots | MEDIUM | Deferred — unlikely with heartbeat refresh |
| A17 | JWT contains excessive UI preference data | LOW | Deferred — requires session restructure |
| A25 | Timing-unsafe bcrypt fallback | LOW | Deferred — bcrypt-to-argon2 migration in progress |
| A26 | Polling-based backpressure wait | LOW | Deferred — no production reports |
| L2(c13) | Anti-cheat LRU cache single-instance limitation | LOW | Deferred — already guarded by getUnsupportedRealtimeGuard |
| L5(c13) | Bulk create elevated roles warning | LOW | Deferred — server validates role assignments |
| D16 | `sanitizeSubmissionForViewer` unexpected DB query | LOW | Deferred — only called from one place, no N+1 risk |
| D17 | Exam session `new Date()` clock skew | LOW | Deferred — same as A19 |
| D18 | Contest replay top-10 limit | LOW | Deferred — likely intentional, requires design input |
| L6(c16) | `sanitizeSubmissionForViewer` N+1 risk for list endpoints | LOW | Deferred — re-open if added to list endpoints |
| AGG-7(c18-prev) | IOI tie sort non-deterministic within tied entries | LOW | Deferred — tied entries get same rank per IOI convention |
| AGG-8(c18-prev) | ROUND(score,2)=100 may miss edge-case ACs | LOW | Deferred — PostgreSQL ROUND is exact for decimal values |

## Agent Failures

None — all review angles completed successfully.
