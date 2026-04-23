# Test Engineer Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** test-engineer
**Base commit:** 54cb92ed

## Inventory of Files Reviewed

- `src/lib/assignments/submissions.ts` — Submission validation (testability)
- `src/lib/assignments/contest-scoring.ts` — Contest ranking (cache testability)
- `src/lib/assignments/contest-analytics.ts` — Contest analytics
- `src/lib/realtime/realtime-coordination.ts` — SSE coordination (testability)
- `src/app/api/v1/submissions/route.ts` — Submission creation
- `src/app/(dashboard)/dashboard/contests/page.tsx` — Contests page

## Previously Fixed Items (Verified)

- `getDbNowUncached` mocked in submissions unit tests (commit fd39f76d): PASS

## New Findings

### TE-1: Contests page `statusMap.get()!` pattern is not covered by null-guard tests [MEDIUM/LOW]

**File:** `src/app/(dashboard)/dashboard/contests/page.tsx:109,178`

**Description:** The `statusMap.get(c.id)!` pattern in the contests page has no null guard, meaning there is no test for what happens if the map lookup returns undefined. While the map is constructed from the same data source, this means any future refactoring that changes the map construction or filtering order could silently introduce a runtime error with no test coverage.

**Fix:** Replace with null-safe alternatives and add a test case for empty/missing status.

**Confidence:** Medium

---

### TE-2: `realtime-coordination.ts` functions use `Date.now()` making them untestable under simulated clock skew [MEDIUM/MEDIUM]

**File:** `src/lib/realtime/realtime-coordination.ts:88,148`

**Description:** Both `acquireSharedSseConnectionSlot` and `shouldRecordSharedHeartbeat` use `Date.now()` directly inside transactions, making it impossible to write deterministic tests for clock-skew scenarios. If these functions used `getDbNowUncached()`, tests could mock the DB time function to verify behavior under various clock-skew conditions.

**Fix:** Use `getDbNowUncached()` at the start of each transaction, consistent with the pattern already applied to `validateAssignmentSubmission`, the submission rate-limit, and the assignment PATCH route.

**Confidence:** Medium
