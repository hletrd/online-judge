# RPF Cycle 2 (loop cycle 2/100) — Debugger

**Date:** 2026-04-24
**HEAD:** fab30962
**Reviewer:** debugger

## Latent Bug Surface Analysis

### Failure Modes Examined

1. Compiler container orphan — cleanupOrphanedContainers() handles exited, created, dead, and stale running containers. MAX_CONTAINER_AGE_MS = 10 min. stopContainer() fire-and-forget with .unref(). Low risk.
2. SSE connection tracking drift — MAX_TRACKED_CONNECTIONS cap with O(n) eviction-by-age is known deferred (AGG-6, LOW/LOW). 60-second cleanup timer with unref() is correct.
3. Rate limiter circuit breaker — correct pattern. When sidecar is down, circuit opens and all requests fall through to DB.
4. Auth proxy cache negative results — Not cached (correct for security). 2-second TTL on positive cache is documented tradeoff.
5. Shutdown hook ordering — beforeExit for clean exits, SIGTERM/SIGINT for forced shutdowns. Low risk of data loss.
6. Chat widget streaming interruption — pathname effect aborts controller and resets state. isStreamingRef prevents stale-closure race. Correct.

### Edge Cases Examined

1. Empty rows in import batch — handled correctly (empty array, no insert).
2. NaN from Date.parse in container cleanup — Number.isNaN guard present.
3. getTokenUserId(token) returning null — if (!userId) return clearAuthToken(token) handles this.

## New Findings

**No new findings this cycle.**

## Confidence

HIGH — the codebase has good defensive programming.
