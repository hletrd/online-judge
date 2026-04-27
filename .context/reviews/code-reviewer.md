# Code Reviewer — RPF Cycle 7/100

**Date:** 2026-04-26
**Cycle:** 7/100
**Lens:** code quality, logic, SOLID, maintainability, naming, dead code, type discipline

---

## Cycle-6 carry-over verification

All cycle-6 plan tasks confirmed at HEAD:
- Task A: `deploy-docker.sh:570-596` Step 5b backfill psql block — present.
- Task B: AGENTS.md / .env.example documentation — present.
- Task C: cycle-5 plan archived — verified.

Cycle-6 carried-deferred items reverified:
- CR6-1 (`setCooldown.valueMs` ambiguous name) — still ambiguous at `route.ts:117,125`. Carried.
- CR6-2 (`__test_internals` block-vs-expression body) — still inconsistent at `route.ts:121-130`. Carried.
- CR6-3 (`0021_lethal_black_tom.sql` filename) — still auto-generated. Carried.
- CR6-4 (`deploy-docker.sh:596` regex broadness) — unchanged. Carried.

---

## CR7-1: [LOW, NEW] `_lastRefreshFailureAt` map mutation in two places without a single owner — the LRU dispose hook deletes, the catch-block sets, and a comment in the catch-block is the only documentation of the dispose-vs-set ordering

**Severity:** LOW (maintainability — invariant lives only in comments)
**Confidence:** HIGH

**Evidence:**
- `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:32`: `const _lastRefreshFailureAt = new Map<string, number>();` declared at module scope.
- Mutation site 1: `route.ts:45` (`dispose` hook): `_lastRefreshFailureAt.delete(key)`.
- Mutation site 2: `route.ts:84` (success path): `_lastRefreshFailureAt.delete(cacheKey)`.
- Mutation site 3: `route.ts:95` (catch path): `_lastRefreshFailureAt.set(cacheKey, Date.now())`.
- The catch-path comment at lines 88-94 documents that `analyticsCache.set()` must not be called from this branch because the dispose hook would synchronously fire and delete the cooldown timestamp. This is a real invariant.

**Why it's a problem:** The map's correctness depends on a non-trivial invariant ("never call analyticsCache.set + _lastRefreshFailureAt.set in sequence for the same key without an intervening tick"). The invariant lives in a comment block 60 lines below the map declaration. A reader who only looks at line 32 sees a plain Map with no constraints.

**Fix (small, optional):**
1. Wrap the map in an object with explicit methods that encode the invariant:
   ```ts
   const refreshFailureCooldown = {
     has: (key: string) => _lastRefreshFailureAt.has(key),
     get: (key: string) => _lastRefreshFailureAt.get(key) ?? 0,
     setFailureAt: (key: string, timestampMs: number) => _lastRefreshFailureAt.set(key, timestampMs),
     clear: (key: string) => _lastRefreshFailureAt.delete(key),
   };
   ```
2. Move the dispose hook's call into `refreshFailureCooldown.clear(key)` so all three mutation sites go through the named API.
3. The wrapper makes the invariant searchable (one grep for `setFailureAt` finds the producer).

**Exit criteria:** Mutation sites for `_lastRefreshFailureAt` go through a named API; the invariant has a single owner.

**Carried-deferred status:** Defer (current code correct, refactor is cosmetic improvement).

---

## CR7-2: [LOW, NEW] `performFlush` uses sequential `await sendEvent()` in a `for` loop — semantics intentional (rate-limit friendly) but the choice is undocumented

**Severity:** LOW (clarity — intentional design choice not commented)
**Confidence:** HIGH

**Evidence:**
- `src/components/exam/anti-cheat-monitor.tsx:67-80` (`performFlush`):
  ```ts
  for (const event of pending) {
    const ok = await sendEvent(event);
    if (!ok && event.retries < MAX_RETRIES) {
      remaining.push({ ...event, retries: event.retries + 1 });
    }
  }
  ```
- The events are sent ONE AT A TIME, not via `Promise.all([...].map(sendEvent))`. With a typical pending queue of 5-200 events, this serializes 5-200 sequential HTTP round-trips.

**Why it's a problem (or not):** The choice is correct — the rate-limit guard at `route.ts` would reject parallel bursts, and a serial flush avoids overwhelming the server. But there's no comment explaining the rationale. A well-meaning refactor to `Promise.all` would silently break the rate-limit contract.

**Fix:** Add a one-line comment above the `for` loop:
```ts
// Send sequentially (NOT Promise.all) to respect server rate-limit on
// /api/v1/contests/[assignmentId]/anti-cheat. With MAX_RETRIES=3 and
// localStorage cap of 200 events, worst-case latency is ~200 sequential
// HTTP round-trips, but parallel send would 429-storm the server.
```

**Exit criteria:** The intentional serial-send design is documented at the call site.

**Carried-deferred status:** Defer (current code correct, comment improvement only).

---

## CR7-3: [LOW, NEW] `__test_internals.cacheDelete` exposes `analyticsCache.delete()` to tests — but the success-path on `refreshAnalyticsCacheInBackground` does NOT call `cacheDelete`, instead it calls `analyticsCache.set()` then `_lastRefreshFailureAt.delete(cacheKey)` — the test-only API surface name is ambiguous

**Severity:** LOW (test API naming)
**Confidence:** MEDIUM

**Evidence:**
- `route.ts:118`: `cacheDelete: (key: string) => boolean;` — exposes `analyticsCache.delete`.
- `route.ts:128`: `cacheDelete: (key: string): boolean => analyticsCache.delete(key)` — implementation.
- The name `cacheDelete` suggests "delete from the analytics cache". But a test reader might wonder: does this also clear the cooldown? (Yes, via the dispose hook.) That side-effect is non-obvious from the name.

**Why it's a problem:** A test that calls `__test_internals.cacheDelete(ASSIGNMENT_ID)` thinking it ONLY deletes the cache entry is also clearing the cooldown timestamp. If the test had set a cooldown via `setCooldown` and then called `cacheDelete`, the cooldown would be gone — surprising.

**Fix (cosmetic):**
1. Rename to `evictCacheAndCooldown` or `clearCacheEntry` (the latter is shorter; the dispose-side-effect is documented in the JSDoc above the cache declaration).
2. Or add a JSDoc to the `cacheDelete` field: `/** Delete the cache entry for this key; the dispose hook will also clear any cooldown timestamp. */`.

**Exit criteria:** The test API name or doc reflects the dispose side-effect.

**Carried-deferred status:** Defer (test API stable, no consumer issue).

---

## CR7-4: [LOW, NEW] `bytesToBase64` and `bytesToHex` in `src/proxy.ts:31-41` use inconsistent iteration patterns

**Severity:** LOW (cosmetic / DRY)
**Confidence:** HIGH

**Evidence:**
- `src/proxy.ts:31-37`:
  ```ts
  function bytesToBase64(bytes: Uint8Array) {
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }
  ```
- `src/proxy.ts:39-41`:
  ```ts
  function bytesToHex(bytes: Uint8Array) {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  ```
- Both functions are stateless byte-level transformers; they could share an internal mapper.

**Why it's a problem:** None significant. The `bytesToBase64` form has O(n) string growth (each += allocates a new string in older V8 — though modern V8 handles this fine). `Array.from(bytes, (b) => String.fromCharCode(b)).join("")` would be more consistent stylistically.

**Fix (cosmetic):** Rewrite `bytesToBase64` using the same `Array.from` pattern as `bytesToHex`.

**Exit criteria:** Both functions use the same iteration style.

**Carried-deferred status:** Defer (current code correct, cosmetic improvement).

---

## CR7-5: [LOW, NEW] `clearAuthSessionCookies` writes `secureName` cookie unconditionally with `secure: true` — but on HTTP-only deployments the browser will silently drop this cookie (no error, just a no-op clear)

**Severity:** LOW (defensive / dev-experience — already known per cycle-3 deferred item AGG3-6/SEC3-1)
**Confidence:** HIGH

**Evidence:**
- `src/proxy.ts:94`: `response.cookies.set(secureName, "", { maxAge: 0, path: "/", secure: true });`
- On HTTP (non-localhost dev), the browser drops `Set-Cookie` directives with `secure` attribute. Result: the secure cookie is never cleared, but it also was never set on HTTP, so the no-op is correct.
- Per cycle-6 deferred AGG3-6/SEC3-1: "production HTTPS guaranteed; dev nuisance only".

**Why it's a problem:** None at production. The deferred item from cycle 3 remains accurate. No new finding here — recording for completeness.

**Carried-deferred status:** Defer per cycle-3 reasoning.

---

## Summary

**Cycle-7 NEW findings:** 0 HIGH, 0 MEDIUM, 5 LOW (all carried-deferable).
**Cycle-6 carry-over status:** All 4 cycle-6 cosmetic items remain unchanged.
**Verdict:** Code quality at HEAD is high. No fresh issues that require implementation this cycle. All findings are cosmetic / defensive doc improvements.
