# Test Engineer Review -- Review-Plan-Fix Cycle 5

**Reviewer:** test-engineer
**Base commit:** 4c2769b2

## Findings

### F1 -- No tests for group assignment export route
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts`
- **Description:** This export route has no test coverage. The unbounded data loading (F1 from code-reviewer) and the CSV generation logic would have been caught by basic tests. There is a test file `tests/unit/api/group-assignment-export-implementation.test.ts` but it tests the underlying data function, not the route itself.
- **Concrete failure:** The CSV output format, BOM inclusion, content-disposition header, and auth checks are all untested.
- **Suggested fix:** Add route-level tests covering: auth check, CSV format, BOM presence, content-disposition, empty group, large group.

### F2 -- No tests for submissions GET offset pagination path
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/route.ts`
- **Description:** The submissions GET route has both cursor-based and offset-based pagination, but there are no tests for the offset path specifically. The dual-query pattern (F5 from code-reviewer) and the includeSummary flag are untested.
- **Suggested fix:** Add tests for offset pagination, includeSummary flag, and verify pagination metadata accuracy.

### F3 -- No tests for PublicHeader authenticated dropdown
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx`
- **Description:** The newly added authenticated dropdown (Phase 2 of workspace migration) has no component tests. The dropdown renders different items based on user role (student/instructor/admin), but this logic is untested. The mobile menu rendering of dropdown items is also untested.
- **Concrete failure:** A regression in `getDropdownItems` could remove admin-only items or show instructor items to students without detection.
- **Suggested fix:** Add component tests for `getDropdownItems` covering all role variants, and test the PublicHeader rendering in both desktop and mobile modes.

### F4 -- Pagination tests only cover `parsePagination`, not route integration
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `tests/unit/pagination.test.ts`
- **Description:** The pagination utility has unit tests, but there are no integration tests verifying that API routes correctly pass pagination parameters to the database and return accurate total counts. The dual-query vs COUNT(*) OVER() discrepancy would not be caught by utility-level tests alone.
- **Suggested fix:** Add API-level tests for at least one paginated route (e.g., problems or users) that verify pagination metadata accuracy.

### F5 -- Missing tests for leaderboard live rank and participant timeline (carried from cycle 21 plan M3/M4)
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **Description:** These tests were planned in the cycle 21 remediation plan (items M3 and M4) but never implemented. The `computeSingleUserLiveRank` and `getParticipantTimeline` functions have no test coverage.
- **Suggested fix:** Implement the tests as described in the cycle 21 plan.
