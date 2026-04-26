# Architect Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Cycle:** 4/100 of review-plan-fix loop
**Scope:** repository architecture, layering, coupling, encapsulation, module boundaries

## Inventory of Architectural Surfaces

- **Server routes:** `src/app/api/v1/**` (Next 16 route handlers, organized by resource)
- **Middleware:** `src/proxy.ts` (auth + locale + CSP + cookie clearing)
- **Edge libs:** `src/lib/security/env.ts`, `src/lib/auth/**`, `src/lib/api/**`
- **Server-only libs:** `src/lib/db/**`, `src/lib/judge/**`, `src/lib/assignments/**`
- **Client components:** `src/components/exam/anti-cheat-monitor.tsx`, etc.
- **Domain services:** judge worker (Rust), rate-limiter (Rust), code-similarity (Rust)

## Findings

### ARCH4-1: [LOW] `__test_internals` exported alongside route handler exposes module-private state

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:92-101`

The `__test_internals` named export gives test suites access to `_lastRefreshFailureAt`/`analyticsCache` mutators. While the JSDoc warns "Production code MUST NOT depend on this export," nothing enforces this at the type system or build boundary. A future contributor importing the route module from non-test code could call `__test_internals.cacheClear()` and silently destabilize behavior.

**Failure scenario:** A future feature route imports the analytics route module directly (rather than via `fetch`) and accidentally references `__test_internals`. Cache invalidation behavior diverges from documented behavior, hard to debug.

**Fix:** Two acceptable options:
1. Gate the export behind `if (process.env.NODE_ENV === "test")` so it's literally `undefined` in production builds.
2. Move test helpers into a sibling `route.test-helpers.ts` file and import via test alias only.

Option (1) is one-line and matches the existing pattern of behavior-driven exports. Option (2) is more disciplined but requires test imports to change.

**Exit criterion:** `__test_internals` is undefined at runtime when `NODE_ENV !== "test"`, OR is moved to a sibling test-helpers module.

---

### ARCH4-2: [LOW] Route module owns two coupled lifecycle structures by convention only

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:19,32,34-47`

`_refreshingKeys: Set<string>`, `_lastRefreshFailureAt: Map<string, number>`, and `analyticsCache: LRUCache` all share the same key space (`assignmentId`) but their shared lifecycle is enforced via the `dispose` hook only for the `_lastRefreshFailureAt` map. `_refreshingKeys` is cleared via the `finally` block of `refreshAnalyticsCacheInBackground`, which is independent of cache eviction — if a refresh somehow never resolves (e.g., compute hangs), the key would stay in `_refreshingKeys` forever.

**Failure scenario:** `computeContestAnalytics` deadlocks (unlikely but not impossible — DB connection pool starvation, infinite loop in a corner case). The `finally` block never runs, so `_refreshingKeys.has(cacheKey)` stays `true` forever, blocking all future background refreshes for that key and forever serving stale data.

**Fix (defensive):** Either:
1. Add a watchdog `setTimeout` inside `refreshAnalyticsCacheInBackground` that force-deletes the key from `_refreshingKeys` after some upper bound (e.g., 30s).
2. Encapsulate all three structures into a single `AnalyticsCache` class so the coupling is enforced by the type rather than convention.

Option (1) is cheaper. Option (2) is the architecturally cleanest path but bigger surface. Given this is theoretical and the actual `computeContestAnalytics` path uses awaited DB calls with reasonable timeouts, this is LOW.

**Exit criterion:** `_refreshingKeys` cannot stay populated indefinitely if a refresh task never settles.

---

### ARCH4-3: [LOW] Anti-cheat monitor's retry scheduling indirection is tasteful but adds layers

**Severity:** LOW | **Confidence:** LOW | **File:** `src/components/exam/anti-cheat-monitor.tsx:128-155`

The `scheduleRetryRef` indirection (a ref containing a function that gets re-assigned in a `useEffect`) is correct and avoids stale closures, but adds one level of indirection that future readers may struggle with. The single source of truth for retry scheduling is now `scheduleRetryRef.current`, set in a `useEffect`. Two unrelated callbacks (`flushPendingEvents`, `reportEvent`) call into it.

This is not a bug; it's a tradeoff. Three callers + retry-timer self-call all funnel through one function. Alternative: extract the queue logic into a custom hook `usePendingEventQueue(assignmentId, sendEvent)` that returns `{ enqueue, flush }`. That would give clearer encapsulation.

**Fix (optional refactor):** Extract `usePendingEventQueue` hook. Defer until file complexity grows further.

**Exit criterion:** N/A this cycle (deferred).

---

### ARCH4-4: [INFO] Layered structure remains healthy

The repo continues to have a clean separation:
- `src/app/**` route handlers compose `createApiHandler` + service modules
- `src/lib/api/**` provides the cross-cutting handler/response/auth abstractions
- `src/lib/security/env.ts` is the single source for cookie-name + auth-secret constants
- The client-only `anti-cheat-monitor.tsx` does not leak server logic
- Edge runtime concerns (no `Buffer`) are handled in `src/proxy.ts`

No layering violations or cross-tier imports detected this cycle.

---

## Carried-deferred (no new architectural angle)

- Anti-cheat monitor file size (335 lines) is borderline for splitting; deferred per cycle 3 AGG3-9 unless adding a feature that pushes past 400 lines.
- AGENTS.md vs `password.ts` policy mismatch (AGG3-5) is a doc/code reconciliation issue, not an architecture issue. Deferred.

## Confidence Summary

- ARCH4-1: HIGH (literal observation of unguarded export).
- ARCH4-2: MEDIUM (theoretical hang scenario; current code paths bounded).
- ARCH4-3: LOW (subjective — indirection critique is taste-driven).
- ARCH4-4: HIGH (informational — no action).
