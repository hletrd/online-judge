# Code Quality Review -- Review-Plan-Fix Cycle 5

**Reviewer:** code-reviewer
**Base commit:** 4c2769b2
**Scope:** Full `src/` TypeScript/TSX, API routes, lib modules

## Findings

### F1 -- Group assignment export has no row limit (OOM risk, carried from cycle 4 AGG-3)
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts:50`
- **Description:** `getAssignmentStatusRows(assignmentId)` returns all student rows without a limit. The function queries all enrolled students and their per-problem aggregates via raw SQL. For a large group, this loads unbounded data into memory. While the contest export was fixed with `MAX_EXPORT_ENTRIES = 10_000`, this export route was not capped.
- **Concrete failure:** A group with 5,000+ students each having submissions for 10+ problems generates 50,000+ aggregate rows in memory.
- **Suggested fix:** Add a `MAX_EXPORT_ROWS` cap (e.g., 10,000) after the `getAssignmentStatusRows` call, similar to contest export.

### F2 -- Anti-cheat GET uses dual queries instead of COUNT(*) OVER()
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:158-180`
- **Description:** The anti-cheat GET route issues two separate queries: one for paginated data and one for the total count. This is the same dual-query pattern that was fixed for chat-logs (cycle 3 CHAT-LOG-01), rankings, and admin routes using COUNT(*) OVER(). The anti-cheat route was not migrated.
- **Concrete failure:** Under concurrent load, the total count can drift from the actual number of rows returned, leading to inaccurate pagination metadata.
- **Suggested fix:** Use COUNT(*) OVER() in the data query and extract the total from the first row.

### F3 -- Problems GET route uses dual count + data queries (both branches)
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/problems/route.ts:27-60` and `:77-108`
- **Description:** Both the admin and non-admin branches of the problems GET route issue separate `count(*)` and data queries. Same dual-query pattern as F2.
- **Suggested fix:** Use COUNT(*) OVER() in both branches.

### F4 -- Users GET route uses dual count + data queries
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/users/route.ts:38-49`
- **Description:** Same dual-query pattern as F2/F3.
- **Suggested fix:** Use COUNT(*) OVER().

### F5 -- Submissions GET route uses dual count + data + optional summary queries
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/route.ts:111-159`
- **Description:** The offset-based pagination path in submissions GET issues up to 3 separate queries: a count query (line 111), a data query (line 116), and an optional summary query (line 137). The count + data is the same dual-query pattern. When `includeSummary=1`, a third GROUP BY query is issued. The summary query could be merged with the count query since both scan the same WHERE clause.
- **Suggested fix:** Use COUNT(*) OVER() for the data query. The summary query is independent enough to remain separate but could be merged with the count for efficiency.

### F6 -- Tags route still uses manual `getApiUser` pattern
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/tags/route.ts:11-14`
- **Description:** The tags GET route uses `getApiUser` directly instead of `createApiHandler`. This was noted in cycle 4 (AGG-12) but not yet fixed. The route lacks CSRF handling (acceptable for GET-only) but also lacks rate limiting and consistent error handling.
- **Suggested fix:** Migrate to `createApiHandler`.

### F7 -- `getAssignmentStatusRows` has no limit on enrolled students query
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/lib/assignments/submissions.ts:513-523`
- **Description:** The `enrolledStudents` query fetches all enrolled students without limit. Combined with F1, this means the export route can load arbitrarily large student lists. The per-problem SQL aggregation query (lines 550-598) is efficient (uses GROUP BY), but the in-memory processing of `enrolledStudents` + `problemAggRows` to build the response is O(students * problems).
- **Suggested fix:** Add a cap on enrolledStudents within `getAssignmentStatusRows`, or cap at the export route level.
