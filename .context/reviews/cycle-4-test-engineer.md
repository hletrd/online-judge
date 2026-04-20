# Cycle 4 Test Engineer Review

**Reviewer:** test-engineer
**Base commit:** 5086ec22

## Findings

### F1 — No tests for contest export route
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/contests/[assignmentId]/export/route.ts`
- **Description:** The contest export endpoint has no test coverage. It handles CSV and JSON export formats, anonymization, and anti-cheat event counts. The unbounded data loading (F1 in perf-reviewer) and inconsistent CSV escaping (F2 in code-reviewer) would have been caught by tests.
- **Suggested fix:** Add API mock tests for: CSV format, JSON format, anonymization, anti-cheat event counts, IP address handling.

### F2 — No tests for group assignment export route
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts`
- **Description:** The group assignment export endpoint has no test coverage. It uses a different auth pattern (`getApiUser` instead of `createApiHandler`) and a local `escapeCsvField`.
- **Suggested fix:** Add API mock tests for: CSV export, auth checks, student status data.

### F3 — No tests for `parsePagination` utility
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/lib/api/pagination.ts`
- **Description:** The `parsePagination` utility is used by dozens of routes but has no dedicated unit tests. While the bare `parseInt` pattern works correctly today (via `||` fallback), tests would guard against regressions if the implementation changes.
- **Suggested fix:** Add unit tests covering: default values, NaN inputs, zero/negative inputs, over-limit inputs, missing parameters.

### F4 — No tests for deploy-worker.sh behavior
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `scripts/deploy-worker.sh`
- **Description:** The worker deploy script has no integration or smoke tests. The `.env` overwrite issue (user-injected TODO #2) would have been caught by a basic deploy test.
- **Suggested fix:** Add a dry-run mode to the script and test it in CI.
