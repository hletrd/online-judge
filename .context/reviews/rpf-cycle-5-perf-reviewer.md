# Performance Review -- Review-Plan-Fix Cycle 5

**Reviewer:** perf-reviewer
**Base commit:** 4c2769b2

## Findings

### F1 -- Group assignment export loads unbounded data (OOM risk)
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts:50`
- **Description:** `getAssignmentStatusRows` fetches all enrolled students and all per-problem aggregate rows without limit. For large groups, this creates O(students * problems) in-memory objects. The function builds maps from the aggregated rows and then iterates over all students to produce the final status data.
- **Concrete failure:** A group with 3,000 students and 10 problems generates 30,000+ aggregated rows in memory, plus the enrolledStudents array.
- **Suggested fix:** Add a MAX_EXPORT_ROWS cap, or stream the CSV output instead of building the entire response in memory.

### F2 -- Submissions GET offset pagination issues 2-3 queries per request
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/route.ts:111-159`
- **Description:** The offset-based path issues separate count + data + optional summary queries. Each is a full table scan with the same WHERE clause. Under high load (frequent polling by students), this triples query load. The cursor-based path (lines 50-100) is more efficient but not the default.
- **Concrete failure:** A class of 200 students all polling their submissions list at 5-second intervals generates 600 queries/second on the submissions table.
- **Suggested fix:** Use COUNT(*) OVER() for the data query. Consider making cursor-based pagination the default for the submissions API.

### F3 -- Anti-cheat heartbeat gap detection loads up to 5000 rows per request
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:190-199`
- **Description:** When a `userId` filter is provided, the route fetches up to 5000 heartbeat rows in DESC order and reverses them for gap detection. This was noted in cycle 4 as L4 (lazy gap detection), which was deferred. The current 5000-row cap bounds the memory impact, but the in-memory reverse + linear scan is still unnecessary when no one is looking at gap data.
- **Suggested fix:** Defer (already deferred as L4 in cycle 21 plan). The 5000-row cap mitigates OOM.

### F4 -- Multiple API routes still use dual count + data queries
- **Severity:** LOW
- **Confidence:** HIGH
- **Files:**
  - `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:158-180`
  - `src/app/api/v1/problems/route.ts:27-60, 77-108`
  - `src/app/api/v1/users/route.ts:38-49`
- **Description:** Same finding as code-reviewer F2-F4. These routes issue separate `count(*)` + data queries. Under concurrent load, the count can drift between the two queries, and each query is a full scan with the same WHERE clause.
- **Suggested fix:** Use COUNT(*) OVER() to collapse into a single query.

### F5 -- SSE shared poll timer queries all active submission IDs in a single `inArray` call
- **Severity:** LOW
- **Confidence:** LOW
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:141-151`
- **Description:** The shared poll tick fetches all active submission IDs with `inArray(submissions.id, submissionIds)`. With 500 concurrent SSE connections (the MAX_GLOBAL_SSE_CONNECTIONS cap), this generates a single query with up to 500 IDs in the IN clause. PostgreSQL handles this well for 500 values, but if the cap is raised significantly, this could become a bottleneck.
- **Suggested fix:** Document the design constraint that MAX_GLOBAL_SSE_CONNECTIONS should not exceed ~1000 without batching the inArray query.
