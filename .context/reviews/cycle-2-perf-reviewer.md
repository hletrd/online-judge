# Performance Review — Cycle 2

**Base commit:** b91dac5b
**Reviewer:** perf-reviewer

## F1 — Practice page Path B loads all problems into memory for progress filtering
- **Severity:** HIGH | **Confidence:** HIGH
- **File:** `src/app/(public)/practice/page.tsx:410-447`
- When a logged-in user applies a progress filter (solved/unsolved/attempted), the server fetches ALL matching problem IDs and ALL user submissions for those problems, then filters in JS memory. For a site with 10k+ problems and active users, this is a significant memory and DB load per page view.
- The base query `db.query.problems.findMany({ where: baseWhereClause, columns: { id: true, ... } })` fetches all rows even though only `id` is needed for the progress filter.
- **Fix:** Use a SQL CTE or window function to compute progress in the database, or at minimum limit the `allProblemRows` query to only fetch `id` column (remove `sequenceNumber`, `title`, `description`).

## F2 — Rankings page runs the full CTE twice (count + data)
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/app/(public)/rankings/page.tsx:115-172`
- The `first_accepts` CTE is computed twice: once in `rawQueryOne` for the count and once in `rawQueryAll` for the data. For large submission tables, this is expensive.
- **Fix:** Use a single query with `COUNT(*) OVER()` window function to get total and page data in one pass.

## F3 — SSE cleanup timer iterates entire connection map synchronously
- **Severity:** LOW | **Confidence:** MEDIUM
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:72-80`
- The `setInterval` cleanup callback iterates the entire `connectionInfoMap` synchronously on each tick. Under high connection counts (approaching `MAX_TRACKED_CONNECTIONS = 1000`), this could block the event loop.
- **Fix:** Use a time-indexed data structure or batch the cleanup (e.g., only check the oldest N entries per tick).

## F4 — `sanitizeSubmissionForViewer` makes a hidden DB query per call
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/lib/submissions/visibility.ts:90-96`
- Previously flagged (cycle 1 AGG-3). The JSDoc was added but the DB query remains. When called in a loop (e.g., listing multiple submissions), this creates N+1 queries.
- **Fix:** The `assignmentVisibility` parameter exists but is not always used by callers. Audit call sites to ensure they pass pre-fetched data in bulk contexts.

## F5 — Chat widget agent loop blocks HTTP connection for up to ~50 seconds
- **Severity:** MEDIUM | **Confidence:** MEDIUM
- **File:** `src/app/api/v1/plugins/chat-widget/chat/route.ts:386-436`
- The `for` loop with `MAX_TOOL_ITERATIONS = 5` can block for 10+ seconds per iteration. Under concurrent load, this consumes server resources (memory, DB connections).
- **Fix:** Stream intermediate results or offload to a background worker with SSE delivery.
