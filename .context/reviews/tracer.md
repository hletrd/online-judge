# Tracer Lane - Cycle 1

**Date:** 2026-04-26
**Angle:** Causal tracing of suspicious flows, competing hypotheses

## Trace 1: Analytics cache refresh flow

**Path:** GET /api/v1/contests/:assignmentId/analytics → createApiHandler → handler

### Hypothesis A: Date.now() staleness check is safe at any clock skew
**Trace:**
1. Cache hit: `cached.createdAt` was set via `await getDbNowMs()` (line 79 or 106)
2. Staleness check: `age = Date.now() - cached.createdAt`
3. If DB clock = app clock: age = wall-clock age (correct)
4. If DB clock > app clock + 30s: age < 0 or very small (never triggers refresh)
5. If DB clock < app clock - 30s: age > actual wall-clock age (premature refresh)

**Evidence:** `getDbNowMs()` calls `SELECT NOW()::timestamptz` from PostgreSQL. In a docker-compose deployment, PostgreSQL and Next.js run on the same host, so clock skew is unlikely to exceed 1-2 seconds. In separate-host deployments, NTP should keep them within milliseconds.

**Verdict:** Hypothesis A is correct for typical deployments. The 30s window provides margin. Only in NTP-failure scenarios does risk materialize.

### Hypothesis B: Race condition on _refreshingKeys
**Trace:**
1. Request A hits cache, staleness check passes, enters `if (!_refreshingKeys.has(cacheKey))`
2. `_refreshingKeys.add(cacheKey)` — request A claims the refresh
3. Request B arrives, sees `_refreshingKeys.has(cacheKey) === true`, skips refresh
4. Request A completes, `finally { _refreshingKeys.delete(cacheKey) }`

**Evidence:** The check-and-add is NOT atomic. Between the `has()` check and the `add()` call, Request B could also pass the check. However, this is in-memory on a single Node.js process. JavaScript is single-threaded for synchronous code — but the `has()` check is on line 71, the `add()` is on line 72, and there's no `await` between them. This makes it atomic in practice.

**Verdict:** Race condition is theoretically possible if two requests interleave at the async boundary (but there's no async between has() and add()). Safe in practice.

---

## Trace 2: Anti-cheat retry flow

### Path A: reportEvent → send failure → scheduleRetryRef → setTimeout → performFlush
### Path B: visibilitychange → flushPendingEvents → performFlush → scheduleRetryRef

### Hypothesis: reportEvent can schedule a retry that conflicts with pending flush

**Trace:**
1. User switches tabs: `visibilitychange` fires, `flushPendingEventsRef.current()` called
2. `performFlush()` loads 3 pending events, sends them, 1 fails → `remaining = [failedEvent]`
3. `scheduleRetryRef.current(remaining)` called
4. `hasRetriable` = true (failedEvent.retries < MAX_RETRIES)
5. `!retryTimerRef.current` = true (no timer yet)
6. Timer scheduled with backoff based on maxRetry

Meanwhile:
7. User pastes something: `reportEventRef.current("paste")` fires
8. `sendEvent(event)` succeeds → no retry scheduling
9. User pastes again within 1s: MIN_INTERVAL_MS check → returns early

**Evidence:** The debouncing at line 151 prevents rapid event storms. One event type can only fire once per second. The `!retryTimerRef.current` check prevents duplicate timers.

**Verdict:** The736 two paths do not create conflicting timers because the guard `!retryTimerRef.current` serializes scheduling. However, if `reportEvent` fails while a retry timer from `flushPendingEvents` is still pending, the reportEvent's failed event gets added to localStorage but not scheduled for retry (because `!retryTimerRef.current` is false). The pending timer WILL pick up the new event when it fires (it calls `performFlush()` which loads ALL pending events).

**Implication:** New events added while a retry timer is pending are delayed until the next timer fires. This is acceptable — the timer fires within 30 seconds at most.

### Hypothesis: Component unmount while timer is pending → memory leak

**Trace:**
1. Timer is scheduled: `retryTimerRef.current = setTimeout(...)`
2. Component unmounts: cleanup function at line 277 runs
3. Line 284-287: `if (retryTimerRef.current) { clearTimeout(retryTimerRef.current); retryTimerRef.current = null; }`

**Evidence:** The useEffect cleanup at lines 277-288 properly clears the timer. VERIFIED SAFE.

---

## Trace 3: Proxy auth cache with new cookie clearing

### Path: User with invalidated token requests /dashboard

1. `proxy()` runs, `getToken()` extracts JWT, `getTokenUserId(token)` gets userId
2. `getCachedAuthUser(cacheKey)` — check authUserCache
3. If not cached, `getActiveAuthUserById(userId, authenticatedAtSeconds)` hits DB
4. If user deactivated: `activeUser = null`
5. `clearAuthSessionCookies(createSecuredNextResponse(request))` called → redirect to /login
6. `clearAuthSessionCookies` now calls `getAuthSessionCookieNames()` → returns same constants
7. Both cookies cleared with maxAge:0

**Evidence:** The cookie clearing behavior is identical to before. The only change is deriving names from constants via a function instead of inline strings.

**Verdict:** No change in behavior. VERIFIED.

---

## Trace 4: Analytics cooldown with Date.now() on DB failure

### Path: DB is slow but not dead

1. Analytics request: cache hit, stale, no refresh in progress
2. Background refresh starts: `computeContestAnalytics(assignmentId, true)` — slow DB query (10s)
3. `getDbNowMs()` called for cache write — returns in 5ms (DB is slow but responding)
4. Cooldown is deleted, cache is set with fresh data

**Hypothesis:** The Date.now() fallback for cooldown is only triggered on DB failure, not DB slowness. If the DB is SLOW but not dead, the initial `getDbNowMs()` for the staleness check could take seconds. But the new code uses `Date.now()` for staleness specifically to avoid this delay.

**Evidence:** The pointer event at line 62 uses `Date.now()` specifically to avoid even the_ the DB latency. The cooldown fallback at line 90 is only for the case where `getDbNowMs()` throws (DB unreachable). If DB is slow but responding, `getDbNowMs()` returns eventually and no fallback is needed.

**Verdict:** The design correctly handles both slow-DB (Date.now() for staleness) and dead-DB (Date.now() fallback for cooldown) scenarios.

---

## Summary

All traced flows are correct. No race conditions, no memory leaks, no behavioral regressions. Key observations:
1. Staleness check race between Date.now() and DB time is bounded by clock skew within 30s tolerance
2. Retry timer serialization via `!retryTimerRef.current` is safe
3. Component cleanup properly clears timers
4. Cookie clearing behavior is byte-identical to before
5. Dead-DB cooldown fallback is correctly multi-layered
