# Debugger Review — Cycle 2

**Base commit:** b91dac5b
**Reviewer:** debugger

## F1 — `Number()` NaN propagation in admin log routes
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/app/api/v1/admin/audit-logs/route.ts:47`, `src/app/api/v1/admin/login-logs/route.ts:34`
- `Math.floor(Number("abc"))` = `NaN`, then `Math.max(1, NaN)` = `NaN`. The `page` variable becomes `NaN`, and `(page - 1) * limit` = `NaN`. This will likely cause a Drizzle ORM error or return zero results.
- **Concrete failure scenario:** Send `GET /api/v1/admin/audit-logs?page=abc` with admin credentials. Expected: page defaults to 1. Actual: NaN offset causes SQL error or empty result.
- **Fix:** Use `parseInt` with `||` fallback.

## F2 — SSE connection eviction decrements active user counts
- **Severity:** LOW | **Confidence:** MEDIUM
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:41-49,51-63`
- When `connectionInfoMap` exceeds `MAX_TRACKED_CONNECTIONS` (1000), `addConnection` evicts the oldest entry by calling `removeConnection`. `removeConnection` decrements `userConnectionCounts` for that entry. If the evicted connection is still active (its SSE stream is still running), the user's count is decremented even though the connection is still consuming resources.
- **Concrete failure scenario:** User A has 3 connections (limit is 3). Connection tracking evicts User A's oldest entry due to global cap. User A's count drops to 2, allowing a 4th connection. User A now has 4 active SSE streams, exceeding the per-user limit.
- **Fix:** Before evicting, check if the connection is still in `activeConnectionSet`. If so, skip eviction or increase the tracking cap.

## F3 — Practice page Path B `allProblemRows` fetches unnecessary columns
- **Severity:** LOW | **Confidence:** HIGH
- **File:** `src/app/(public)/practice/page.tsx:410-418`
- The query `db.query.problems.findMany({ columns: { id: true, sequenceNumber: true, title: true, description: true } })` fetches `title` and `description` but only uses `id` for progress filtering. This wastes memory and DB bandwidth for large problem sets.
- **Fix:** Only select `{ id: true }` in the initial query, then fetch full data only for the page slice.

## F4 — Rankings page `totalPages` variable shadowed
- **Severity:** LOW | **Confidence:** HIGH
- **File:** `src/app/(public)/rankings/page.tsx:134-135`
- `totalPages` is computed at line 134 from the count query, then `clampedPage` at line 135. However, the `totalPages` variable is used again at line 315 but is only computed inside the data query block. If the count and data queries return different results due to a race condition (submission between the two queries), pagination could be inconsistent.
- **Fix:** Compute `totalPages` once and reuse, or use a single query with window functions.
