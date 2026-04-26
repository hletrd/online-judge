# Performance Reviewer Lane - Cycle 1

**Date:** 2026-04-26
**Scope:** Performance analysis of 4 changed files and broader repo

## Findings

### Finding PERF-1: Analytics cache staleness optimization — improvement [HIGH/HIGH]

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:56-62`

Before: `const nowMs = await getDbNowMs()` on every cache-hit request (DB round-trip).
After: `const nowMs = Date.now()` (no DB round-trip).

This eliminates one DB query per cache-hit analytics request. For a contest with high traffic (e.g., 100+ students refreshing leaderboard), this saves 100+ DB queries per minute.

**Verified:** `getDbNowMs()` calls `getDbNowUncached()` which executes `SELECT NOW()::timestamptz AS now` (line 34 of db-time.ts). Each call is a full DB round-trip.

---

### Finding PERF-2: LRU Cache TTL already provides expiry; staleness check is optimization layer [LOW/HIGH]

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:13-17`

The `LRUCache` already has `ttl: CACHE_TTL_MS` (60s). The staleness-at-30s pattern is a CDN-style stale-while-revalidate: serve stale data while triggering async refresh. This is an appropriate performance pattern.

---

### Finding PERF-3: Anti-cheat retry uses exponential backoff — good [MEDIUM/HIGH]

**File:** `src/components/exam/anti-cheat-monitor.tsx:136-137`

Retry backoff: `Math.min(1000 * 2^retry, 30000)`. Maximum 30s delay. This prevents aggressive retry storms on transient failures while ensuring eventual consistency.

---

### Finding PERF-4: Anti-cheat event debouncing prevents spam [LOW/HIGH]

**File:** `src/components/exam/anti-cheat-monitor.tsx:149-152`

`MIN_INTERVAL_MS = 1000` — events of the same type within 1 second are suppressed. This prevents rapid-fire events (e.g., rapid tab switching) from flooding localStorage and the API.

---

### Finding PERF-5: Heartbeat every 30 seconds — reasonable [LOW/HIGH]

**File:** `src/components/exam/anti-cheat-monitor.tsx:26,199`

`HEARTBEAT_INTERVAL_MS = 30_000`. 30-second heartbeat is a reasonable balance between monitoring granularity and network load.

---

### Finding PERF-6: authUserCache in proxy uses FIFO eviction with cleanup [MEDIUM/HIGH]

**File:** `src/proxy.ts:64-85`

Cache cleanup runs lazily at 90% capacity, then FIFO evicts oldest if still full. TTL of 2 seconds (configurable via AUTH_CACHE_TTL_MS). This is a well-designed tradeoff between latency (no DB lookup per request) and staleness.

---

### Finding PERF-7: Proxy middleware runs on every matched request — no regressions [LOW/HIGH]

**File:** `src/proxy.ts:240-338`

The `clearAuthSessionCookies` function is now slightly different (calls `getAuthSessionCookieNames()` instead of inline strings) but the performance impact is negligible — it reads two constants from a module-level scope. No additional I/O, no DB queries, no network calls.

---

### Finding PERF-8: Unused dependency causes unnecessary re-render chain [LOW/LOW]

**File:** `src/components/exam/anti-cheat-monitor.tsx:172`

`reportEvent` has `flushPendingEvents` in deps but never calls it. When `flushPendingEvents` changes (which happens when `performFlush` changes), `reportEvent` is recreated and `reportEventRef.current` is reassigned. This triggers a minor, benign re-render via the useEffect at line 178.

**Impact:** Minimal. `reportEventRef` reassignment doesn't cause DOM reconciliation unless the ref is used as a hook dependency (which it's not — it's only read in event handlers). The `useEffect` at 178 only runs `reportEventRef.current = reportEvent` — no component state change.

---

## Summary

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| PERF-1 | Cache staleness optimization | HIGH | HIGH |
| PERF-2 | Stale-while-revalidate pattern | LOW | HIGH |
| PERF-3 | Exponential backoff retry | MEDIUM | HIGH |
| PERF-4 | Event debouncing | LOW | HIGH |
| PERF-5 | Heartbeat interval | LOW | HIGH |
| PERF-6 | Auth cache design | MEDIUM | HIGH |
| PERF-7 | Cookie name change — no perf impact | LOW | HIGH |
| PERF-8 | Unused dependency re-render | LOW | LOW |

Total: 0 performance regressions. 1 confirmed improvement (PERF-1). 1 minor concern (PERF-8).
