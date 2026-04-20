# Cycle 14 Perf Reviewer Report

**Base commit:** 74d403a6
**Reviewer:** perf-reviewer
**Scope:** Performance, concurrency, CPU/memory, UI responsiveness

---

## CR14-PR1 — [MEDIUM] `recordRateLimitFailure` and `recordRateLimitFailureMulti` each start their own transaction for every failed attempt — no batching

- **Confidence:** MEDIUM
- **Files:** `src/lib/security/rate-limit.ts:195-232, 234-269`
- **Evidence:** `recordRateLimitFailure` calls `execTransaction` for a single key. `recordRateLimitFailureMulti` iterates keys inside one transaction (good), but `changePassword` uses the single-key version. Under high failed-login volumes, each failure starts a separate transaction. The `consumeRateLimitAttemptMulti` already batches multi-key operations, but `recordRateLimitFailure` does not have a multi-key variant that matches the `consumeRateLimitAttemptMulti` pattern.
- **Suggested fix:** Already deferred as D24. If `changePassword` switches to `consumeRateLimitAttemptMulti` (as suggested by code-reviewer), this becomes moot for that path.

## CR14-PR2 — [LOW] SSE stale connection eviction is O(n) — iterates entire `connectionInfoMap` every cleanup tick

- **Confidence:** MEDIUM
- **Files:** `src/app/api/v1/submissions/[id]/events/route.ts:82-91`
- **Evidence:** The cleanup timer iterates the entire `connectionInfoMap` every 60 seconds to find stale entries. With `MAX_TRACKED_CONNECTIONS = 1000`, this is at most 1000 iterations per minute — negligible. However, if the max is increased significantly, this becomes O(n) per tick. The eviction in `addConnection` (lines 44-55) is also O(n) for finding the oldest entry.
- **Suggested fix:** Low priority. If connection counts scale significantly, use a sorted data structure (e.g., a min-heap by `createdAt`).

## CR14-PR3 — [LOW] `getConfiguredSettings()` is called inside `getRateLimitConfig()` on every rate-limit operation — but has 60s cache

- **Confidence:** LOW
- **Files:** `src/lib/security/rate-limit.ts:8-15`, `src/lib/system-settings-config.ts:158-181`
- **Evidence:** Every call to `getRateLimitConfig()` calls `getConfiguredSettings()`, which has a 60s in-memory cache. So this is effectively cached already. The 60s TTL is appropriate for settings that rarely change. No action needed, noting for completeness.

## Final Sweep

- Dashboard layout 5+ DB queries: already deferred (D7).
- JWT callback DB query on every request: already deferred (D2).
- Capabilities cache has 60s TTL with deduplication of concurrent loads — acceptable.
- System settings cache has 60s TTL with background refresh — acceptable.
- SSE shared poll timer batches all active submission IDs in a single DB query — efficient.
- Rate limiter sidecar pre-check avoids DB round-trip for already-blocked keys — efficient.
