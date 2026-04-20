# Cycle 27 Performance Reviewer

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### PERF-1: SSE events route uses linear scan for eviction from connectionInfoMap [LOW/MEDIUM]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:44-55`
**Description:** When `connectionInfoMap.size >= MAX_TRACKED_CONNECTIONS`, the eviction loop iterates all entries to find the oldest. This is O(n) where n = MAX_TRACKED_CONNECTIONS (1000). Under extreme connection churn this could add latency to new connection setup.
**Failure scenario:** With 1000+ rapid connections, each new connection that triggers eviction requires scanning all 1000 entries.
**Fix:** Consider using a sorted data structure (e.g., a min-heap by createdAt) or simply evicting the first entry from the Map (insertion order in modern JS engines approximates age). The current approach is acceptable for the cap of 1000 entries.
**Confidence:** LOW

### PERF-2: Recruit page makes 3 separate DB queries that could be parallelized [LOW/LOW]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:112-185`
**Description:** After the cached invitation lookup, the page makes: (1) assignment query (line 112), (2) problem count query (line 178), (3) enabled languages query (line 184). Queries 2 and 3 are already parallelized via `Promise.all`, but query 1 runs before them sequentially. The assignment query could be parallelized with queries 2 and 3 if the assignmentId is already known from the invitation.
**Failure scenario:** Minor latency increase on recruit page loads since the 3 queries run in 2 sequential rounds instead of 1.
**Fix:** Restructure to run all 3 queries in a single `Promise.all` after the invitation lookup. Low priority since the page already uses React.cache for the invitation.
**Confidence:** LOW

## Verified Safe

- React.cache() deduplication eliminates the duplicate invitation DB query.
- SSE shared polling uses batch DB queries (single query for all active submission IDs).
- Judge claim uses atomic SQL CTE (single round-trip for lock + update + return).
- File uploads use streaming (no full-buffer accumulation for non-image files).
- Database export uses streaming response (no full dataset loaded into memory).
