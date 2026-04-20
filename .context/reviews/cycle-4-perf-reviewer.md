# Cycle 4 Performance Review

**Reviewer:** perf-reviewer
**Base commit:** 5086ec22

## Findings

### F1 — Contest export loads all ranking entries without limit (OOM risk)
- **Severity:** HIGH
- **Confidence:** HIGH
- **File:** `src/app/api/v1/contests/[assignmentId]/export/route.ts:67`
- **Description:** `computeContestRanking(assignmentId)` returns all entries in memory. For a large contest (5,000+ participants with 20+ problems each), this loads thousands of rows with per-problem breakdowns into memory, then serializes to CSV/JSON. This is the same OOM class as the admin submissions export fixed in cycle 3.
- **Concrete failure:** A contest with 5,000 participants and 20 problems would create ~100,000 problem-level entries in memory.
- **Suggested fix:** Add a hard cap (e.g., 10,000 entries) or implement streaming.

### F2 — Submissions GET route uses dual queries (count + data) instead of COUNT(*) OVER()
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/route.ts:111-134`
- **Description:** The offset-based pagination path runs two separate queries — one for `count(*)` and one for the data page. This is the same dual-query pattern that was fixed for rankings (RANK-01) and chat-logs (CHAT-LOG-01) using `COUNT(*) OVER()`.
- **Suggested fix:** Use `COUNT(*) OVER()` window function in a single query.

### F3 — Group assignment export `getAssignmentStatusRows` may be unbounded
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts:64`
- **Description:** The function `getAssignmentStatusRows` returns all student rows without pagination. For groups with thousands of students, this could be memory-intensive.
- **Suggested fix:** Verify that `getAssignmentStatusRows` has reasonable performance for large groups; add a row limit if needed.

### F4 — SSE shared poll timer uses `inArray` with potentially thousands of submission IDs
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:141-172`
- **Description:** The shared poll tick queries all active submission IDs in a single `inArray` query. Under high load (500 concurrent SSE connections), this could generate a large `IN (...)` clause. PostgreSQL handles this well up to ~1000 items, but beyond that, query planning can degrade.
- **Suggested fix:** Batch the query into chunks of 500 IDs if `submissionIds.length > 500`.

### F5 — Anti-cheat heartbeat gap detection fetches up to 5000 rows in memory
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:191-200`
- **Description:** The heartbeat gap detection queries the 5000 most recent heartbeat events and reverses them in memory. For very long contests, this is a reasonable cap, but the in-memory processing could be replaced with a SQL window function for better efficiency.
- **Suggested fix:** Consider using a SQL `LAG()` window function to detect gaps directly in the query, avoiding the need to fetch and reverse rows in application code.
