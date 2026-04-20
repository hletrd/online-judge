# Code Reviewer — Cycle 7 Deep Review

**Date:** 2026-04-20
**Scope:** Full repository, focus on code quality, logic, SOLID, maintainability

---

## Inventory of reviewed files

All `src/` TypeScript/TSX files (~428 files, ~85K lines), API routes, shared libs, components, auth/security, DB layer, Rust workers (spot-checked). Focus on new and modified files since last review plus cross-cutting concerns.

---

## Findings

### HIGH 1 — `tokenInvalidatedAt` set via `new Date()` in 10+ locations creates session-revocation clock-skew window

**Confidence:** HIGH
**Files:**
- `src/app/api/v1/users/[id]/route.ts:164,185,218,260,466`
- `src/lib/actions/user-management.ts:114,308`
- `src/lib/actions/change-password.ts:75`
- `src/lib/assignments/recruiting-invitations.ts:242,359`

**Problem:** When an admin deactivates a user, changes a user's role, resets a password, or a recruiter resets a candidate's password, `tokenInvalidatedAt` is set to `new Date()` (app-server time). The `isTokenInvalidated()` function compares `tokenInvalidatedAt.getTime()` against `authenticatedAtSeconds` from the JWT. The proxy (line 246) fetches the DB-sourced `tokenInvalidatedAt` and compares it against the JWT's `authenticatedAt` (set via app-server time at login). If the app server clock drifts relative to the DB server clock, the invalidation timestamp becomes unreliable.

**Concrete failure scenario:**
1. App server clock is 5 seconds behind DB server.
2. Admin deactivates user. `tokenInvalidatedAt` = `new Date()` = app-server T=200 (DB time T=205).
3. A JWT was issued when the app server was at T=100 (DB time T=105). `authenticatedAtSeconds` = 100.
4. Proxy checks: `authenticatedAtSeconds` (100) < `tokenInvalidatedAt` (200) = invalidated. Works.
5. BUT if the app server clock jumps forward between JWT issuance and invalidation (e.g., NTP correction), the `authenticatedAtSeconds` in the JWT could be AHEAD of `tokenInvalidatedAt`, causing `isTokenInvalidated` to return `false` for a session that should be revoked.

**Suggested fix:** Replace all `tokenInvalidatedAt: new Date()` with `tokenInvalidatedAt: await getDbNowUncached()` to align the invalidation timestamp with the DB clock.

---

### HIGH 2 — Public contest detail page uses `new Date()` instead of DB time for contest status

**Confidence:** HIGH
**Files:**
- `src/lib/assignments/public-contests.ts:30,124`

**Problem:** Both `getPublicContests()` (line 30) and `getPublicContestById()` (line 124) pass `new Date()` to `getContestStatus()`. This determines whether a contest shows as "upcoming", "open", "in_progress", "expired", or "closed". If the app server clock drifts from the DB server clock, a contest that is actually closed could still show as "open" on the public page.

**Concrete failure scenario:**
1. Contest deadline is 5:00 PM (DB time).
2. App server clock is 30 seconds behind.
3. At 5:00:15 PM DB time, the public contests page still shows "open" because `new Date()` returns 4:59:45 PM.
4. User clicks "start exam" which then correctly uses DB time and fails, creating confusing UX.

**Suggested fix:** Replace `new Date()` with `await getDbNow()` in both functions.

---

### MEDIUM 1 — Anti-cheat event `createdAt` uses `new Date()` instead of DB time

**Confidence:** HIGH
**Files:**
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:110,128`

**Problem:** The anti-cheat event logging inserts `createdAt: new Date()` while the contest boundary check at lines 63-73 correctly uses `SELECT NOW()`. This creates inconsistent timestamps in the audit trail.

**Suggested fix:** Capture the DB server time (already fetched at line 63) and use it for `createdAt` in both event inserts.

---

### MEDIUM 2 — Invite route stores `redeemedAt` and `enrolledAt` using `new Date()`

**Confidence:** MEDIUM
**Files:**
- `src/app/api/v1/contests/[assignmentId]/invite/route.ts:103,115`

**Problem:** The invite route stores `redeemedAt: new Date()` and `enrolledAt: new Date()`. These stored timestamps may not match the DB server's clock.

**Suggested fix:** Use `await getDbNowUncached()` for these stored timestamps.

---

### MEDIUM 3 — Sidebar active-timed-assignments uses `new Date()` for contest status

**Confidence:** MEDIUM
**Files:**
- `src/lib/assignments/active-timed-assignments.ts:15,44`

**Problem:** `selectActiveTimedAssignments` defaults to `new Date()`. The sidebar could show a contest as active that has actually expired per DB time.

**Suggested fix:** Use `await getDbNow()` in `getActiveTimedAssignmentsForSidebar`.

---

### MEDIUM 4 — Rejudge route uses `new Date()` for contest-finished check in audit log

**Confidence:** LOW
**Files:**
- `src/app/api/v1/submissions/[id]/rejudge/route.ts:79`

**Problem:** `new Date() > assignment.deadline` comparison uses app-server time against DB-stored deadline. Only affects audit log warning.

**Suggested fix:** Use `await getDbNowUncached()` for the comparison.

---

### LOW 1 — Problem import button silently swallows JSON parse errors

**Confidence:** HIGH
**Files:**
- `src/app/(dashboard)/dashboard/problems/problem-import-button.tsx:23`

**Problem:** `JSON.parse(text)` is called on user-uploaded file content without a specific try/catch around the parse. The outer catch gives generic "importFailed" for all error types.

**Suggested fix:** Add a specific try/catch around `JSON.parse(text)` that returns a more specific error message.

---

### LOW 2 — Non-null assertions on Map.get() results

**Confidence:** MEDIUM
**Files:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignments/[assignmentId]/student/[userId]/page.tsx:131`
- `src/lib/assignments/submissions.ts:365`
- `src/lib/assignments/contest-scoring.ts:243`

**Problem:** Several locations use `map.get(key)!.push(...)` or `map.get(key)!.add(...)` with non-null assertions. Runtime TypeError if key is missing.

**Suggested fix:** Replace with safe access pattern.

---

## Final sweep

After the main review, I did a sweep for:
- Additional `new Date()` usage in security-relevant paths
- Non-null assertions on dynamic lookups
- Error handling gaps
- Missed files

No additional HIGH-severity findings beyond those listed above.
