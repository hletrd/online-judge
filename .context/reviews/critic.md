# Critic Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** critic
**Base commit:** 54cb92ed

## Inventory of Files Reviewed

- All API routes and core libraries (cross-cutting concern analysis)
- Focus: clock-skew consistency, non-null assertion patterns, error handling, API design

## Previously Fixed Items (Verified)

- All cycle 45 fixes verified and intact:
  - `validateAssignmentSubmission` uses `getDbNowUncached()` for deadline enforcement
  - Non-null assertions replaced in client components
  - Mock added for `getDbNowUncached` in submissions unit tests

## New Findings

### CRI-1: Contests page still uses `Map.get()!` pattern — inconsistent with recent client-component fixes [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/contests/page.tsx:109,178`

**Description:** Cycle 45 replaced non-null assertions with null guards in multiple client components (submission detail, problem-set form, role editor). However, the contests page still has two `Map.get()!` instances. While this is a server component (not client), the pattern inconsistency is the same concern: new developers seeing `!` in one file may assume it's acceptable everywhere. The codebase is converging on explicit null-guard patterns.

**Fix:** Replace with null-safe alternatives (e.g., `statusMap.get(c.id) ?? "closed"`).

**Confidence:** Medium

---

### CRI-2: `realtime-coordination.ts` uses `Date.now()` in DB transactions — pattern inconsistency with clock-skew fixes [MEDIUM/MEDIUM]

**File:** `src/lib/realtime/realtime-coordination.ts:88,148`

**Description:** This is the same clock-skew class that was fixed in `validateAssignmentSubmission` (cycle 45), the assignment PATCH route (cycle 40), and the submission rate-limit (cycle 43). When `REALTIME_COORDINATION_BACKEND=postgresql` is configured, the `acquireSharedSseConnectionSlot` and `shouldRecordSharedHeartbeat` functions use `Date.now()` to compare against DB-stored timestamps inside a `pg_advisory_xact_lock` transaction. The codebase has converged on `getDbNowUncached()` for all DB-timestamp comparisons inside transactions.

**Fix:** Use `getDbNowUncached()` at the start of each transaction.

**Confidence:** Medium

---

### Positive Observations

- The `validateAssignmentSubmission` clock-skew fix is well-implemented with a clear comment explaining the rationale.
- The admin bypass (`isAdminLevel ? 0 : (await getDbNowUncached()).getTime()`) is a good design — admins skip the DB round-trip entirely since they bypass deadline checks.
- The recruiting invitation flow uses `getDbNowUncached()` consistently inside transactions.
- The anti-cheat route correctly uses `rawQueryOne("SELECT NOW()")` for contest boundary checks — this is the correct pattern for non-ORM queries.
