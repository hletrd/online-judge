# Test Engineer Review — RPF Cycle 7/100

**Date:** 2026-04-26
**Cycle:** 7/100
**Lens:** test coverage gaps, test-determinism, flaky tests, TDD opportunities, regression coverage

---

## Cycle-6 carry-over verification

All cycle-6 plan tasks confirmed at HEAD; gates green:
- `npm run test:unit` — 304 test files, 2234 tests, 0 failures (verified at cycle start, 31s).
- `npm run lint` — 0 errors, 14 unchanged warnings (untracked dev .mjs scripts).
- `npm run build` — exit 0.

Cycle-6 carried-deferred test items reverified:
- TE6-1 (0020 backfill idempotency integration test) — still no integration test against Postgres. Carried.
- TE6-2 (cycle-5 dispose test name) — still describes mechanism not invariant. Carried.
- TE6-3 (`setCooldown` rename test impact) — still 2 callers. Carried.
- TE6-4 (0021 schema-parity test coverage) — schema-parity test only checks "table has columns" generally. Resolved (the 4-test general suite implicitly covers tags.updated_at).

---

## TE7-1: [LOW, NEW] No test pins the cycle-6 Step 5b backfill SQL semantics — specifically, that `encode(sha256(secret_token::bytea), 'hex')` matches `Node createHash('sha256').update(token).digest('hex')`

**Severity:** LOW (no integration test infra, but a unit test could pin the JS side)
**Confidence:** HIGH

**Evidence:**
- `deploy-docker.sh:586-591` (Step 5b backfill DO-block) uses `encode(sha256(secret_token::bytea), 'hex')`.
- `src/lib/judge/auth.ts:21-23` `hashToken()` uses `createHash('sha256').update(token).digest('hex')`.
- Both should produce the same SHA-256 hex of the UTF-8 byte sequence. But there's no test that pins this equivalence.

**Why it's a problem:** A future change to either side (e.g., changing the JS hash to base64, or changing the SQL to use a different encoding) silently breaks the backfill — workers would have hashes in the DB that don't match what the code produces, locking them out.

**Fix (small unit test):** Add a test in `tests/unit/judge/auth.test.ts` that:
1. Computes `hashToken("test-token-value")` via Node.
2. Compares to a hard-coded expected SHA-256 hex of `"test-token-value"`.
3. Documents that the SQL form `encode(sha256('test-token-value'::bytea), 'hex')` MUST produce the same hex.

**Exit criteria:** A test asserts the JS `hashToken()` output matches a known-good SHA-256 hex.

**Carried-deferred status:** Plan for cycle-7 implementation if affordable; otherwise defer.

---

## TE7-2: [LOW, NEW] `tests/unit/api/contests-analytics-route.test.ts` line 257-265 (cycle-5 dispose test) tests the dispose-clears-cooldown invariant, but does not test the SUCCESS-PATH explicit `_lastRefreshFailureAt.delete(cacheKey)` (route.ts:84)

**Severity:** LOW (coverage gap — success path lacks regression test)
**Confidence:** HIGH

**Evidence:**
- `route.ts:84` calls `_lastRefreshFailureAt.delete(cacheKey)` after `analyticsCache.set(...)` in the success path.
- The dispose hook ALSO clears the same key on overwrite. So the explicit delete is redundant on overwrite, but necessary on first-set.
- Test coverage: cycle-5's dispose test pins the dispose-on-cache-eviction behavior. But it doesn't pin "successful refresh clears prior cooldown".

**Failure scenario (regression):** A future refactor moves the cache.set without preserving the explicit delete. The success path no longer clears the cooldown. A subsequent failure would see "cooldown still active from 5 minutes ago" and skip the refresh.

**Fix:** Add a test that sets a cooldown, triggers a successful refresh, and asserts the cooldown is cleared.

**Exit criteria:** Success-path cooldown clearing has a regression test.

**Carried-deferred status:** Plan for cycle-7 if test infrastructure supports easy mocking.

---

## TE7-3: [LOW, NEW] `anti-cheat-monitor.tsx` `performFlush` (cycle-44 extraction) lacks a dedicated unit test

**Severity:** LOW (test coverage — extraction lacks dedicated test)
**Confidence:** MEDIUM

**Evidence:**
- `anti-cheat-monitor.tsx:67-80` defines `performFlush` as a useCallback.
- Existing tests (if any) test the wrapping behavior.

**Fix (when picked up):** Add a unit test for `performFlush` that mocks `loadPendingEvents` / `savePendingEvents` / `sendEvent` and asserts the load-send-save cycle.

**Exit criteria:** `performFlush` has a dedicated unit test.

**Carried-deferred status:** Defer (functionally covered).

---

## TE7-4: [LOW, NEW] `tests/unit/db/schema-parity.test.ts` only has 4 generic tests — no per-table assertion that a SPECIFIC column exists with a SPECIFIC type

**Severity:** LOW (test depth — generic vs specific assertions)
**Confidence:** HIGH

**Evidence:**
- `tests/unit/db/schema-parity.test.ts` (53 lines, 4 `it(...)` blocks): "should export at least one table", "every table should have a non-empty name", "every table should have at least one column", "no two tables should share the same runtime name".
- No assertion like "tags table has updated_at column with type timestamp".

**Why it's worth tracking:** The schema is the contract. A test that pins specific columns/types would catch silent schema drift.

**Fix (low priority):** Add specific column-existence assertions for critical tables.

**Exit criteria:** Critical tables have specific column assertions.

**Carried-deferred status:** Defer (test depth improvement; not a regression).

---

## TE7-5: [LOW, NEW] No test pins the dispose-coupling between `analyticsCache` and `_lastRefreshFailureAt` for the "first set" case (no prior cache entry, so dispose does NOT fire on the .set call)

**Severity:** LOW (coverage — dispose-side-effect on first set)
**Confidence:** HIGH

**Evidence:**
- `route.ts:82-84`: `analyticsCache.set(cacheKey, ...)` then `_lastRefreshFailureAt.delete(cacheKey)`.
- On FIRST set (no prior entry), dispose doesn't fire. The explicit delete is necessary.
- On overwrite, dispose fires, then explicit delete is redundant.
- No test pins the "first set" path explicitly.

**Fix:** Add a test that:
1. Verifies the cache is empty for a key.
2. Sets a cooldown via `setCooldown`.
3. Calls a function that does `analyticsCache.set` (first time for this key).
4. Asserts the cooldown IS cleared (because of the explicit delete, not via dispose).

**Exit criteria:** First-set delete-cooldown behavior has a regression test.

**Carried-deferred status:** Defer (overlaps with TE7-2; pick up together).

---

## Summary

**Cycle-7 NEW findings:** 0 HIGH, 0 MEDIUM, 5 LOW (TE7-1 / TE7-2 plannable; others deferable).
**Cycle-6 carry-over status:** TE6-4 RESOLVED at verification. Others carried.
**Test verdict:** Test suite is healthy at HEAD (2234 passing). Coverage gaps are mostly coverage-depth issues.
