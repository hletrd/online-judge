# Test Engineer Review — Cycle 2

**Base commit:** b91dac5b
**Reviewer:** test-engineer

## F1 — No test for NaN `Number()` query param in audit-logs and login-logs routes
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/app/api/v1/admin/audit-logs/route.ts:47-48`, `src/app/api/v1/admin/login-logs/route.ts:34-35`
- The tags route NaN bug was found and fixed in cycle 1, but the identical bug in audit-logs and login-logs has no test coverage. Non-numeric `page`/`limit` query params produce `NaN` which propagates through offset calculations.
- **Fix:** Add API route tests that send non-numeric `page` and `limit` params and assert they get valid responses (not 500 errors).

## F2 — No test for CSV export unbounded row count in admin log routes
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/app/api/v1/admin/audit-logs/route.ts:127-175`, `src/app/api/v1/admin/login-logs/route.ts:98-132`
- The CSV export path omits `limit`/`offset`, potentially returning millions of rows. There is no test verifying the CSV export path respects any row limit.
- **Fix:** Add tests for CSV export that verify row count is bounded.

## F3 — Practice page progress filter (Path B) has no performance/load test
- **Severity:** MEDIUM | **Confidence:** MEDIUM
- **File:** `src/app/(public)/practice/page.tsx:410-447`
- Path B loads all problem IDs into memory. There is no test verifying that this page performs acceptably with a large problem set.
- **Fix:** Add an integration test with a seeded large problem set (1000+ problems) and verify the page renders within a reasonable time budget.

## F4 — No test for SSE connection eviction behavior under load
- **Severity:** LOW | **Confidence:** MEDIUM
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:39-49`
- The `addConnection` function evicts the oldest entry when `connectionInfoMap` reaches `MAX_TRACKED_CONNECTIONS`. The `removeConnection` function decrements `userConnectionCounts` unconditionally, even for evicted entries. There is no test verifying this interaction under load.
- **Fix:** Add a unit test that simulates eviction and verifies per-user counts remain correct.

## F5 — Chat widget tool result truncation has no test
- **Severity:** LOW | **Confidence:** LOW
- **File:** `src/app/api/v1/plugins/chat-widget/chat/route.ts:425-434`
- Tool results are not truncated before being added to the message array. No test verifies behavior with very large tool results.
- **Fix:** Add a test that verifies tool results exceeding a reasonable size are truncated or handled gracefully.
