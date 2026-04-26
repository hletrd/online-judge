# Aggregate Review — RPF Cycle 3/100

**Date:** 2026-04-27
**Cycle:** 3/100 of review-plan-fix loop
**Reviewers:** architect, code-reviewer, critic, debugger, designer, document-specialist, perf-reviewer, security-reviewer, test-engineer, tracer, verifier (11 lanes — designer covered as web frontend exists)
**Total findings:** 0 HIGH, 5 MEDIUM, 25 LOW, plus several INFO/verification notes
**Cross-agent agreement:** No HIGH-severity convergence this cycle. Cycle 2 closed the previously-converging items (cookie clearing, analytics time domain, IIFE refactor, tests). Cycle 3 is a steady-state cycle.

---

## Cross-Agent Convergence Map

| Topic | Agents flagging | Severity peak |
|-------|-----------------|---------------|
| `_lastRefreshFailureAt` Map grows unbounded (no LRU eviction handler) | PERF3-2, CRIT3-2 (via cohesion gap), ARCH3-1 (via encapsulation gap) | **MEDIUM** |
| `getAuthSessionCookieNames` literal-value contract test (already exists in env.test.ts:418-419, 422-432) | TE3-1, DBG3-4 | resolved (false-positive — verified during planning pass) |
| `plans/open/` directory has 80+ unarchived plan files | CRIT3-1, DOC3-2 | LOW |
| AGENTS.md vs `password.ts` policy mismatch (carried) | DOC3-1, SEC3-3 | MEDIUM (deferred — needs user/PM decision) |
| `__Secure-` cookie clear over HTTP no-op (carried) | SEC3-1 (deferred from cycle 2 AGG-9) | LOW |
| Anti-cheat retry/backoff lacks direct timing tests (carried) | TE3-2 (deferred from cycle 2 AGG-13) | LOW |

---

## Deduplicated Findings (sorted by severity)

### AGG3-1: [MEDIUM] `_lastRefreshFailureAt` Map grows unbounded — no LRU eviction handler

**Sources:** PERF3-2, ARCH3-1 (encapsulation), CRIT3-2 (cohesion) | **Confidence:** MEDIUM

`src/app/api/v1/contests/[assignmentId]/analytics/route.ts:24` declares `const _lastRefreshFailureAt = new Map<string, number>()` at module scope. Entries are deleted on successful refresh (`_lastRefreshFailureAt.delete(cacheKey)` line 48), but never deleted when the LRU `analyticsCache` evicts a key (because it's a separate structure).

**Failure scenario:** Long-running app server that sees many distinct `assignmentId`s experiencing refresh failures. Over weeks, `_lastRefreshFailureAt.size` grows past the LRU's max=100, leaking memory. Slow leak (each entry is ~16 bytes), but unbounded.

**Fix:**
1. Pass an `lru-cache` `dispose` (or `onEvict`) handler to `analyticsCache` that removes the same key from `_lastRefreshFailureAt`. This couples the two structures' eviction.
2. Alternatively: replace the `Map` with another `LRUCache` of equal capacity. Simplest, but less precise (cooldown could survive even if the cache entry was evicted by capacity pressure unrelated to failure).

Approach (1) is cheaper and clearer. Add a comment noting both data structures share key-space.

**Exit criteria:**
- `analyticsCache` has a `dispose` (or `onEvict`) callback that calls `_lastRefreshFailureAt.delete(key)`.
- Unit test asserts that, after eviction, the key is no longer present in `_lastRefreshFailureAt`.

---

### AGG3-2: [resolved during planning] `getAuthSessionCookieNames` literal-value test already exists

**Sources:** TE3-1, DBG3-4 (initially flagged) | **Confidence:** HIGH (verified)

Initial review claimed the literal-value test was missing. Verification via `grep -n getAuthSessionCookieNames tests/unit/security/env.test.ts` found three existing tests at lines 415-419, 422-432, 434-440. The first asserts:
```ts
expect(names.name).toBe("authjs.session-token");
expect(names.secureName).toBe("__Secure-authjs.session-token");
```

This is sufficient to catch a refactor that swaps or renames a constant. **No action needed.** Lane reviewers (TE3-1, DBG3-4) were operating on a stale read; corrected during plan synthesis.

**Fix:** None. Note in plan that this is a verified false-positive.

---

### AGG3-3: [LOW] `plans/open/` has accumulated 80+ entries; archival lag

**Sources:** CRIT3-1, DOC3-2 | **Confidence:** HIGH

Many fully-implemented (`[x]`) plans remain under `plans/open/` instead of being moved to `plans/done/`. Discoverability suffers.

**Fix:** Single-commit housekeeping pass that:
1. Greps `plans/open/*.md` for files where every task line is `[x]` or `[d]` (no `[ ]` or `[~]`).
2. Moves those into `plans/done/` (already exists per repo structure).
3. Adds a one-line README convention in `plans/open/README.md` so future cycles archive consistently.

**Note:** Several earlier cycles attempted this; the pattern recurs because each cycle adds a new plan and only sometimes archives the one it implements. The README convention would close the loop.

**Exit criteria:**
- All plans with all-`[x]`-tasks under `plans/open/` are moved to `plans/done/` (this cycle, conservative scope).
- `plans/open/README.md` documents the convention.

---

### AGG3-4: [LOW] Add doc comment explaining test pattern (`vi.runAllTimersAsync` drains microtasks)

**Sources:** DBG3-2, TRC3-2 (informational) | **Confidence:** MEDIUM

The cycle-2 test "respects cooldown" relies on `await vi.runAllTimersAsync()` draining the detached `.catch` chain on the failed refresh. This works in Vitest 4.x but isn't obvious to readers.

**Fix:** Add a one-line comment to `tests/unit/api/contests-analytics-route.test.ts` near the cooldown test explaining that `vi.runAllTimersAsync()` drains both timers and pending microtasks.

**Exit criteria:** Test file has a comment near the cooldown assertion explaining the pattern.

---

### AGG3-5: [LOW] AGENTS.md vs `password.ts` mismatch (carried, requires user/PM decision)

**Sources:** DOC3-1, SEC3-3 (carried from cycle 2 AGG-11) | **Confidence:** MEDIUM (deferred)

AGENTS.md:516-521 says "Password validation MUST only check minimum length"; `src/lib/security/password.ts:45,50,59` enforces dictionary + similarity checks. Removing the checks weakens security; updating the doc changes the rule.

**Fix (deferred):** No change this cycle. Re-flag in plan with quoted policy.

---

### AGG3-6: [LOW] `__Secure-` cookie clear over HTTP is no-op (carried, deferred)

**Sources:** SEC3-1 (carried from cycle 2 AGG-9) | **Confidence:** MEDIUM (deferred)

`src/proxy.ts:94` sets `secure: true` unconditionally on the `__Secure-` cookie clear. Browser ignores `Secure` over HTTP, so dev environments won't clear the cookie. Production HTTPS-only — no impact.

**Fix (deferred):** No change. Reopen if a developer reports stuck `__Secure-` cookie in dev/non-HTTPS deployment.

---

### AGG3-7: [LOW] Anti-cheat retry/backoff lacks direct timing tests (carried, deferred)

**Sources:** TE3-2 (carried from cycle 2 AGG-13) | **Confidence:** LOW (deferred)

`src/components/exam/anti-cheat-monitor.tsx` exponential backoff has only indirect coverage. Testing requires `vi.useFakeTimers` + `apiFetch` mock + `localStorage` mock — non-trivial setup.

**Fix (deferred):** Pick up in a dedicated testing-focused cycle.

---

### AGG3-8: [LOW] Anti-cheat privacy notice has no decline path (carried, deferred)

**Sources:** DES3-1 (carried from cycle 2 AGG-12) | **Confidence:** LOW (deferred)

Privacy notice has only an "Accept" button. Declining requires closing the tab.

**Fix (deferred):** Defer; UX judgment call.

---

### AGG3-9: [LOW] Anti-cheat at 336 lines borders single-component complexity (carried, deferred)

**Sources:** ARCH3-2 (carried from cycle 2 AGG-14) | **Confidence:** MEDIUM (deferred)

Refactor would split into `useAntiCheatEventReporter`, `usePendingEventQueue`, `useAntiCheatListeners` hooks.

**Fix (deferred):** Reopen when a feature pushes the file past 400 lines.

---

### AGG3-10: [LOW] Optional cosmetic items (deferred)

- CR3-2 (`_refreshingKeys` / `_lastRefreshFailureAt` underscore convention) — cosmetic.
- DOC3-4 (extend `refreshAnalyticsCacheInBackground` doc with dedup-invariant note) — optional.
- TE3-3 (extend dedup test with cache-update assertion) — optional.
- TE3-5 (`any` types in test mock signature) — cosmetic.
- SEC3-2 (log `user.id` on background refresh failures) — optional.
- PERF3-1 (use `Date.now()` for `createdAt` to eliminate per-refresh DB call) — optional, requires revisiting cycle-2 hybrid decision.
- PERF3-3 (`getAuthSessionCookieNames` allocates new object per call) — negligible.

All deferrable; track with no-op exit criteria.

---

## Workspace-to-Public Migration Note

**Source:** `user-injected/workspace-to-public-migration.md`
**Confidence:** N/A (no review opportunity surfaced)

Cycle 3 review surfaced no new candidate page or navigation concern. Standing observations from prior cycles still apply (Submissions unification candidate; admin pages stay in workspace). Continue tracking under `plans/open/2026-04-19-workspace-to-public-migration.md`. **No cycle-3 migration task added.**

---

## Verification Notes (no action — informational)

- `npm run lint`: 0 errors, 14 warnings (untracked `.mjs` dev scripts in repo root + `.context/tmp/uiux-audit.mjs` + `playwright.visual.config.ts`).
- `npm run test:unit -- tests/unit/api/contests-analytics-route.test.ts`: 7/7 pass in 79ms.
- Build: presumed green per cycle-2 plan; will revalidate during gates.
- All cycle-2 task exit criteria verified met (see verifier.md table).
- No security regressions; cycle-2 commits clean.
- No UI/UX regressions; designer cycle is in pause-state.
- Plans/open count: ~80 files (substantial archival lag).

---

## Carried Deferred Items (cycle 2 → cycle 3, unchanged)

| Cycle 2 ID | Description | Reason for deferral |
|------------|-------------|---------------------|
| AGG-9 | `__Secure-` cookie clear over HTTP no-op | Dev-only nuisance; production HTTPS guaranteed |
| AGG-10 | Anti-cheat online event can race with retry timer | Server-idempotent; duplicate POSTs benign |
| AGG-11 | AGENTS.md vs password.ts mismatch | Requires user/PM decision |
| AGG-12 | Privacy notice has no decline path | UX judgment call |
| AGG-13 | Anti-cheat backoff lacks direct timing tests | Test setup non-trivial |
| AGG-14 | Anti-cheat at 332+ lines | Refactor without behavior change |
| Cycle 1 AGG-4 | Anti-cheat retry timer holds stale closure across `assignmentId` change | Component is keyed on `assignmentId` |
| DEFER-22..57 | Carried from cycles 38–48 | See `_aggregate-cycle-48.md` |

---

## No Agent Failures

All 11 lanes (architect, code-reviewer, critic, debugger, designer, document-specialist, perf-reviewer, security-reviewer, test-engineer, tracer, verifier) completed successfully. Aggregate written without retries.

---

## Recommended Cycle-3 Plan Tasks

Based on the converging-and-actionable findings (after AGG3-2 verified resolved during planning):

1. **Task A [MEDIUM]** — Fix `_lastRefreshFailureAt` unbounded growth via `lru-cache` dispose hook (AGG3-1).
2. **Task B [LOW]** — Archive ~70 completed plans from `plans/open/` to `plans/done/`; add archival convention to `plans/open/README.md` (AGG3-3).
3. **Task C [LOW]** — Add comment explaining `vi.runAllTimersAsync()` microtask drain in cooldown test (AGG3-4).

All other items either carried-deferred or optional cosmetic. Cycle 3 is a small focused cycle.
