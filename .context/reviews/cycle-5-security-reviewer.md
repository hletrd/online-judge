# Security Reviewer — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** security-reviewer

## Findings

### SEC-1: API key expiry check uses `new Date()` instead of DB-sourced time [MEDIUM/HIGH]

**File:** `src/lib/api/api-key-auth.ts:86`

**Description:** `candidate.expiresAt < new Date()` compares the DB-stored `expiresAt` timestamp against the app server's clock. If the app server clock drifts relative to the DB server, an expired API key could still authenticate (if app clock is behind) or a valid key could be rejected (if app clock is ahead).

This is the same class of vulnerability fixed in the recruit page (cycle 27, commit 6f6f4750), but it persists in the API key authentication path, which is more security-critical because it controls programmatic access.

**Concrete failure scenario:** An API key that expired at 2026-04-20 12:00:00 UTC (per DB time) could still be used if the app server clock is at 2026-04-20 11:55:00 UTC. This grants unauthorized access to the API.

**Fix:** Use `getDbNow()` for the expiry comparison. Note: `authenticateApiKey` is not a React server component, so `React.cache()` may not deduplicate correctly. Consider passing DB time as a parameter or calling `rawQueryOne("SELECT NOW()")` directly.

**Confidence:** HIGH

---

### SEC-2: Exam session creation uses `new Date()` for deadline enforcement [MEDIUM/HIGH]

**File:** `src/lib/assignments/exam-sessions.ts:49-56`

**Description:** `const now = new Date()` is used to check if the assignment has started (`now < assignment.startsAt`) and if the deadline has passed (`now >= assignment.deadline`). This runs inside a transaction but uses app-server time, not DB-transaction-consistent time. If the app server clock drifts, a student could start an exam after the deadline has passed per the DB.

Additionally, the `personalDeadline` is calculated from `now.getTime() + durationMs` (line 78), meaning the personal deadline is based on app-server time. This creates an inconsistency where the personal deadline stored in the DB is not relative to DB time.

**Concrete failure scenario:** A contest deadline is 2026-04-20 18:00:00 UTC (per DB). App server clock is 2 minutes behind. A student starts an exam at 17:58 UTC (app time) = 18:00 UTC (DB time). The `now >= assignment.deadline` check passes (17:58 < 18:00), but the contest is actually closed per DB time. The student gets a personal deadline of 17:58 + duration, effectively getting extra time.

**Fix:** Use `SELECT NOW()` within the same transaction for temporal comparisons and personal deadline calculation.

**Confidence:** HIGH

---

### SEC-3: Access code redemption uses `new Date()` for deadline check [MEDIUM/MEDIUM]

**File:** `src/lib/assignments/access-codes.ts:128-130`

**Description:** `const now = new Date()` is used inside a transaction to check if the contest deadline has passed. The comment says "using transaction-consistent time" but the time is actually from the app server, not from the transaction. Clock drift allows redemption after the contest has closed.

**Concrete failure scenario:** App server clock is 5 minutes behind DB. Contest deadline is 12:00 UTC (DB). At 12:03 UTC (DB) = 11:58 UTC (app), a student redeems an access code and joins a closed contest.

**Fix:** Use `SELECT NOW()` within the same transaction for the deadline comparison.

**Confidence:** MEDIUM

---

### SEC-4: Anti-cheat route uses `new Date()` for contest boundary checks [MEDIUM/MEDIUM]

**File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:62-68`

**Description:** `const now = new Date()` is used to check if the contest has started and if it has ended. Clock drift could allow anti-cheat events to be submitted outside the contest window, or block legitimate events during the contest.

**Concrete failure scenario:** App server clock is ahead of DB. Anti-cheat route returns "contestEnded" while the contest is still running per DB time, preventing legitimate anti-cheat event logging for the last few minutes.

**Fix:** Use `getDbNow()` for temporal comparisons.

**Confidence:** MEDIUM

---

### SEC-5: Submission creation uses `new Date()` for exam deadline check [LOW/MEDIUM]

**File:** `src/app/api/v1/submissions/route.ts:295`

**Description:** `lt(examSessions.personalDeadline, new Date())` is used inside a transaction to check if an exam session has expired. Since this is a SQL comparison (Drizzle generates `personal_deadline < '2026-04-20...'`), the `new Date()` value is sent as a parameter to PostgreSQL. This means the comparison is actually done in the DB engine, not in the app server. However, the timestamp value itself is from the app server clock, so clock drift still affects the comparison.

**Concrete failure scenario:** If app server clock is ahead, `new Date()` produces a future timestamp, causing the comparison `personalDeadline < futureTime` to be true more often, rejecting valid submissions.

**Fix:** Use a DB-sourced timestamp in the query parameter instead of `new Date()`.

**Confidence:** MEDIUM

---

### SEC-6: Rejudge route uses `new Date()` for contest-finished audit flag [LOW/LOW]

**File:** `src/app/api/v1/submissions/[id]/rejudge/route.ts:79`

**Description:** `new Date() > assignment.deadline` is used for audit logging only (adding a warning that the contest was already finished). This does not block or allow the rejudge operation itself — it only affects the audit log message. The clock skew impact is limited to an incorrect audit log flag.

**Fix:** Low priority. Use `getDbNow()` for consistency, but the security impact is minimal.

**Confidence:** LOW

---

## Verified Safe

- All LIKE/ILIKE queries use `escapeLikePattern` with `ESCAPE '\\'` — no LIKE injection.
- `dangerouslySetInnerHTML` only used with `sanitizeHtml()` (DOMPurify) and `safeJsonForScript()`.
- API key encryption uses AES-256-GCM with HKDF-derived keys and proper IV/auth tag handling.
- CSRF protection is comprehensive (X-Requested-With, Origin, Sec-Fetch-Site).
- Rate limiting covers all endpoints with per-user and global limits.
- Recruiting token validation uses atomic SQL transactions with `SELECT FOR UPDATE`.
- Auth flow uses Argon2id, timing-safe dummy hash, and proper token invalidation.
