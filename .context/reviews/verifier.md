# Verifier Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** verifier
**Base commit:** 54cb92ed

## Evidence-Based Correctness Check

This review validates that the stated behavior of each recently-fixed item matches the actual code.

## Verified Fixes (All Pass)

1. **`validateAssignmentSubmission` uses `getDbNowUncached()`** — Line 210: `const now = isAdminLevel ? 0 : (await getDbNowUncached()).getTime();` Line 216: `if (startsAt && startsAt > now)` Line 224: `if (effectiveCloseAt && effectiveCloseAt < now)` Line 272: `if (examSession.personalDeadline && examSession.personalDeadline.valueOf() < now)`. PASS — all three deadline comparisons now use DB time. The admin bypass (setting `now = 0`) correctly short-circuits all deadline checks.

2. **Non-null assertions replaced in client components** — Verified the following files no longer have `!.get()` or `!.id` patterns in the recent diff: submission-detail-client.tsx, problem-set-form.tsx, role-editor-dialog.tsx. PASS.

3. **Mock added for `getDbNowUncached` in submissions unit tests** — Confirmed from commit `fd39f76d`. PASS.

## New Findings

### V-1: Contests page `Map.get()!` pattern — verified present but guarded by construction [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/contests/page.tsx:109,178`

**Description:** The `statusMap` is constructed on line 104-106 from the same `contests` array that is filtered on line 108-110. Since the map is built from the same source array, `statusMap.get(c.id)` will always return a value. However, the `!` assertion is fragile — if the code is refactored to filter the contests array before building the map, the assertion would silently break.

Evidence: Line 104: `const statusMap = new Map(contests.map((c) => [c.id, getContestStatus(c, now)]));` — each contest ID in `contests` is present in `statusMap`.

**Fix:** Replace with `statusMap.get(c.id) ?? "closed"` for robustness.

**Confidence:** Medium — the current code is safe by construction but fragile.
