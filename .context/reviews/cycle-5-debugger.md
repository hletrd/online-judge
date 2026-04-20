# Debugger — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** debugger

## Findings

### DBG-1: `getDbNow()` silent fallback masks DB connectivity failures [MEDIUM/MEDIUM]

**File:** `src/lib/db-time.ts:16`

**Description:** When `rawQueryOne` returns null (DB query failure), `getDbNow()` silently falls back to `new Date()`. This masks a potentially serious issue — if the DB is unreachable for time queries, it may also be unreachable for the subsequent data queries that depend on the time value. The fallback provides a false sense of correctness.

**Concrete failure scenario:** DB is under extreme load, `SELECT NOW()` times out, `rawQueryOne` returns null. `getDbNow()` returns `new Date()` (potentially skewed). The subsequent data query also fails, but the user sees an error from the data query, not from the time query. Debugging this requires correlating two separate failures.

**Fix:** Throw an error when `rawQueryOne` returns null, or at minimum log an error before falling back.

**Confidence:** MEDIUM

---

### DBG-2: SSE `viewerId` non-null assertion persists [LOW/MEDIUM]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:315`

**Description:** The `user!.id` non-null assertion from cycle 27 (AGG-3) was "fixed" but the `!` operator is still present. If `user` were to become null (e.g., after a refactoring), this would throw a runtime error instead of being caught at compile time.

**Fix:** Move `const viewerId = user.id` to after line 194 where TypeScript narrows `user` to non-null. Remove the `!`.

**Confidence:** MEDIUM

---

### DBG-3: Potential race in SSE cleanup timer initialization [LOW/LOW]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:81-95`

**Description:** The cleanup timer is initialized at module scope with `if (globalThis.__sseCleanupTimer) clearInterval(globalThis.__sseCleanupTimer)`. In Next.js hot-reload during development, this timer is re-created on every module re-evaluation. While the `clearInterval` prevents duplicate timers, there is a brief window between the `clearInterval` and the new `setInterval` where no cleanup is running.

**Concrete failure scenario:** In development only, during hot-reload, a connection that becomes stale in the brief window between timer re-creation would not be cleaned up until the next interval tick. This is not a production issue.

**Fix:** No action required for production. This is an acceptable development-mode tradeoff.

**Confidence:** LOW

---

## Verified Safe

- SSE connection tracking uses `Set` and `Map` correctly with proper cleanup on stream close.
- The `closed` flag in the SSE stream prevents double-close and use-after-close errors.
- The shared poll timer correctly stops when there are no subscribers.
- Error handling in the SSE stream is comprehensive with individual callback error isolation.
