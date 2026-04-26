# Critic Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Stance:** multi-perspective critique, looking for hidden assumptions, brittle patterns, weak invariants

## Findings

### CRIT4-1: [LOW] `__test_internals` is a leaky abstraction

**Severity:** LOW | **Confidence:** HIGH | **Files:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:92-101`, `tests/unit/api/contests-analytics-route.test.ts:230-248`

The route module now exports `__test_internals` to enable a single test (`evicts cooldown metadata when the cache entry is removed (dispose hook)`). This works but inverts the dependency: production code is now adapted to the test, not the other way around. Tests should either:

1. Drive observable behavior through the public API (call the route handler twice and observe state externally), OR
2. Reach in via a test-only module (sibling file with `// eslint-disable-next-line` or alias path).

The `__test_internals` export sits in the production module, advertised by name and documented as "test-only" — but the language has no `internal` keyword. Anyone with import access can use it.

**Hidden assumption:** Future contributors will read the JSDoc and resist using it. Reality: someone will eventually use it for a hot-fix and ship it.

**Fix:** Either gate behind `process.env.NODE_ENV === "test"` (one-line, ARCH4-1 / CR4-1 also flagged this) or move to `route.test-helpers.ts`.

**Exit criterion:** Production builds cannot access `__test_internals`.

---

### CRIT4-2: [LOW] `_refreshingKeys` correctness depends on the `finally` block always running

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:64-80`

The dedup guard `if (!_refreshingKeys.has(cacheKey) && ...)` correctness depends on `_refreshingKeys.delete(cacheKey)` running in the `finally` clause. If the `try`/`catch` body throws *synchronously* before `try` is entered (it cannot — but contributors don't always know that), or if a `Promise.race` ever externally cancels this task (it can't with current code, but `AbortController` could be added), the `finally` may not fire.

**Hidden assumption:** No one will ever wrap `refreshAnalyticsCacheInBackground` with a cancel-on-timeout abstraction.

**Failure scenario:** A future caller wraps the call in `Promise.race([refresh, abortPromise])`. The "winner" cancels the refresh promise. JS does not actually cancel the underlying work, but if the abort path involves `process.exit` or similar, the `finally` may not run before exit. Recovery requires an app restart.

**Fix:** Document the contract. Optionally add a watchdog timer (see ARCH4-2). Defer unless someone introduces cancellation.

**Exit criterion:** N/A this cycle.

---

### CRIT4-3: [LOW] Privacy notice is mandatory: no decline path

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/components/exam/anti-cheat-monitor.tsx:307-332`

The privacy notice dialog (carried deferred from cycle 2 AGG-12 / cycle 3 AGG3-8) has only an "Accept" button. The user cannot decline. They can close the tab, but that aborts the exam.

This is a UX/ethics concern as much as a code one. In some jurisdictions (GDPR, etc.), surveillance disclosures with no opt-out may be considered insufficient consent. Whether this is enforceable depends on the legal context (school/employer/etc. may have legitimate interest), but at minimum the UX should explain "if you decline, your exam is aborted" or offer a "Decline & exit" button that returns to the dashboard.

**Hidden assumption:** Test-takers have already implicitly consented by registering for the exam.

**Fix (deferred):** Carry as deferred — UX/legal judgment call. Reopen with explicit user direction.

**Exit criterion:** N/A this cycle (deferred per repo policy on UX judgment calls).

---

### CRIT4-4: [LOW] Cycle planning is converging on cosmetic-only items

**Severity:** LOW | **Confidence:** HIGH | **Observation across:** `.context/reviews/_aggregate-cycle-3.md`, `.context/reviews/_aggregate-cycle-2.md`

Cycles 1-3 closed the meaningful issues (analytics race, cookie clearing, cache lifecycle, performFlush extraction, IIFE refactor). Cycle 3 and 4 are at steady state: the remaining findings are LOW-severity stylistic items, optional refactors, and deferred-deferral chains. This is healthy — but the review-plan-fix loop is now spending cycles primarily to maintain hygiene rather than fix bugs. Suggest the next 5-10 cycles either:

1. Pivot to a feature/migration effort (e.g., the user-injected workspace-to-public migration directive).
2. Pause the loop until the codebase changes (so reviewers have new code to find issues in).

**Hidden assumption:** Each loop iteration finds proportional new value.

**Fix:** No code change. Note in the plan that cycles 4-10 should consider migration progress or pause.

**Exit criterion:** N/A — observational.

---

### CRIT4-5: [LOW] Cookie names hoisted to module-level constants would simplify proxy

See CR4-6. Same finding from a different perspective: the proxy reads cookie names through a function call layer, which is good for the linter and bad for the reader. A reader has to follow `getAuthSessionCookieNames()` → `env.ts:178` → constants to understand what cookies are being cleared. Two-level indirection.

**Fix:** Same as CR4-6 — hoist to module-level const. Cosmetic.

**Exit criterion:** N/A this cycle.

---

## Workspace-to-Public Migration Note

The user-injected directive at `user-injected/workspace-to-public-migration.md` requests incremental migration of dashboard-only pages to the public top navbar. **Cycle 4 review surfaces no specific page candidate** based on the file diff since cycle 3. The standing plan continues to track this work. Suggest next cycle's review specifically check `src/components/layout/app-sidebar.tsx` against `src/lib/navigation/public-nav.ts` for migration candidates if no other findings surface.

## Confidence Summary

- CRIT4-1: HIGH.
- CRIT4-2: MEDIUM (depends on hypothetical future contributor changes).
- CRIT4-3: HIGH (UX/legal — but already deferred).
- CRIT4-4: HIGH (observational).
- CRIT4-5: HIGH (cosmetic).
