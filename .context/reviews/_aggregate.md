# Aggregate Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Cycle:** 4/100 of review-plan-fix loop
**Reviewers:** architect, code-reviewer, critic, debugger, designer, document-specialist, perf-reviewer, security-reviewer, test-engineer, tracer, verifier (11 lanes — designer covered as web frontend exists)
**Total findings:** 0 HIGH, 1 MEDIUM (carried-deferred), ~25 LOW (most carried-deferred or cosmetic), several INFO/verification notes
**Cross-agent agreement:** No HIGH-severity convergence this cycle. Cycles 1–3 closed the actionable items; cycle 4 is steady-state with one new actionable item: gate `__test_internals` behind `NODE_ENV === "test"`.

---

## Cross-Agent Convergence Map

| Topic | Agents flagging | Severity peak |
|-------|-----------------|---------------|
| `__test_internals` exported in production bundle | ARCH4-1, CR4-1, CRIT4-1, SEC4-2, VER4-2 | **LOW** (5 agents converged → high-signal) |
| `_refreshingKeys` could stay populated if refresh task never settles | ARCH4-2, CRIT4-2 | LOW |
| Privacy notice has no decline path (carried) | DES4-1, CRIT4-3 | LOW (carried-deferred) |
| AGENTS.md vs `password.ts` mismatch (carried) | DOC4-1, SEC4-3 | MEDIUM (carried-deferred — needs user/PM decision) |
| `__Secure-` cookie clear over HTTP no-op (carried) | SEC4-1 | LOW (carried-deferred) |
| Anti-cheat retry/backoff lacks direct timing tests (carried) | TE4-2 | LOW (carried-deferred) |
| `loadPendingEvents` has no length cap | CR4-2, PERF4-3, TE4-6 | LOW (3 agents convergence) |
| `dispose` hook semantics depend on documented contract | DBG4-1 | LOW |
| scheduleRetryRef.current outlives unmount | TRC4-1 | LOW (defensive) |

---

## Deduplicated Findings (sorted by severity / actionability)

### AGG4-1: [LOW, actionable, 5-agent convergence] Gate `__test_internals` behind NODE_ENV === "test"

**Sources:** ARCH4-1, CR4-1, CRIT4-1, SEC4-2, VER4-2 | **Confidence:** HIGH

`src/app/api/v1/contests/[assignmentId]/analytics/route.ts:92-101` exports `__test_internals` from the production module. The JSDoc warns "Production code MUST NOT depend on this export," but nothing enforces this. Five reviewers (architect, code-reviewer, critic, security-reviewer, verifier) all converged on the same risk surface from different angles:

- **Architect:** unguarded export breaks encapsulation; type system has no `internal` keyword.
- **Code-reviewer:** survives into production bundle; tree-shaking can't drop named exports.
- **Critic:** leaky abstraction — production module adapted to test, not the other way around.
- **Security-reviewer:** marginal attack-surface increase; if SSRF/RCE chain emerges, attacker could call `cacheClear()`.
- **Verifier:** also notes `cacheClear` is exposed but not even consumed by any test (YAGNI).

**Fix:** Two acceptable options:
1. Conditional export:
   ```ts
   export const __test_internals = process.env.NODE_ENV === "test"
     ? { hasCooldown, setCooldown, cacheDelete, cacheClear }
     : (undefined as never);
   ```
2. Move to sibling `route.test-helpers.ts` file imported only from tests.

Option (1) is one-line and matches the existing pattern. Option (2) requires test-import path change.

**Exit criteria:**
- `__test_internals` is `undefined` at runtime when `NODE_ENV !== "test"`.
- Existing dispose-hook test still passes.
- Update JSDoc to reflect the env-gate.

---

### AGG4-2: [LOW, actionable, 3-agent convergence] Cap `loadPendingEvents` array length

**Sources:** CR4-2, PERF4-3, TE4-6 | **Confidence:** MEDIUM

`src/components/exam/anti-cheat-monitor.tsx:41-51` `loadPendingEvents` reads localStorage, parses JSON, filters, and returns. No length cap. A malicious extension or browser bug could write a large array; on every visibility/online event, the entire list is iterated and re-saved.

**Fix:** Cap at a reasonable upper bound:
```ts
return parsed.filter(isValidPendingEvent).slice(0, 200);
```

Add a unit test asserting that loading 250 events returns only 200.

**Exit criteria:**
- `loadPendingEvents` returns at most 200 events.
- Unit test covers the cap (e.g., write 250 events to localStorage, load, assert length === 200).
- All gates green.

---

### AGG4-3: [LOW, actionable] Document defensive contract in `refreshAnalyticsCacheInBackground` catch block

**Sources:** DBG4-1 | **Confidence:** MEDIUM

`src/app/api/v1/contests/[assignmentId]/analytics/route.ts:72-79` catch block writes to `_lastRefreshFailureAt` but does NOT call `analyticsCache.set()`. The dispose hook would clear the just-set cooldown if a future change adds `analyticsCache.set` here. The doc comment near the dispose hook (line 38-46) already explains this, but a forward-looking comment in the catch block itself would prevent the regression.

**Fix:** Add a one-line comment in the catch block:
```ts
} catch (err) {
  // IMPORTANT: do NOT call analyticsCache.set() in this branch — it would
  // fire the dispose hook on the existing entry, which would delete the
  // cooldown timestamp we're about to set on line below.
  _lastRefreshFailureAt.set(cacheKey, Date.now());
  ...
}
```

**Exit criteria:**
- Comment present in the catch block warning future contributors.
- All gates green.

---

### AGG4-4 through AGG4-N: [LOW, deferred — cosmetic / optional]

The remaining ~20 LOW findings (cookie-name hoisting, underscore-prefix style, scheduleRetryRef cleanup on unmount, ShieldAlert icon swap, `cacheClear` removal from `__test_internals`, Korean privacy notice translation review, doc-comment line-anchor improvements, password.ts vs AGENTS.md mismatch, `__Secure-` over HTTP, anti-cheat retry timing tests, privacy notice decline path, anti-cheat file-size threshold, `_refreshingKeys` watchdog, etc.) are all either:

- **Carried-deferred** with prior cycle exit criteria still applicable.
- **Cosmetic** with no behavior impact (style nits, doc anchors, icon swaps).
- **Optional refactors** that require feature work or product direction.

See per-agent files for full enumeration. None are blocking. None are security-or-correctness items that the repo's own rules forbid deferring.

---

## Workspace-to-Public Migration Note

**Source:** `user-injected/workspace-to-public-migration.md`
**Confidence:** N/A (no review opportunity surfaced)

Cycle 4's recently-changed files (analytics route, anti-cheat monitor, env, proxy) do not include any page-level or routing changes. The designer review (DES4-3) suggests the next cycle pivot focus to `src/components/layout/app-sidebar.tsx` vs `src/lib/navigation/public-nav.ts` for migration candidates if no other findings surface there. **No cycle-4 migration task added** — the standing plan at `plans/open/2026-04-19-workspace-to-public-migration.md` continues to track that work.

---

## Verification Notes (no action — informational)

- `npm run lint`: 0 errors, 14 warnings (untracked `.mjs` dev scripts in repo root + `playwright.visual.config.ts` + `.context/tmp/uiux-audit.mjs`). Same warning set as cycle 3 — no new lint regressions.
- `npm run build`, `npm run test:unit`: not run pre-aggregate; will run during PROMPT 3 gate phase.
- All cycle-3 task exit criteria verified met (see `verifier.md` table).
- No security regressions; cycle-3 commits clean.
- Plans/open count: 7 files (workspace-migration + 4 master backlogs + cycle-3 plan + README; cycle-3 plan will be archived this cycle, cycle-4 plan added).

---

## Carried Deferred Items (cycle 3 → cycle 4, unchanged)

| Cycle 3 ID | Description | Reason for deferral |
|------------|-------------|---------------------|
| AGG3-5 / SEC3-3 | AGENTS.md vs `password.ts` mismatch | Needs user/PM decision |
| AGG3-6 / SEC3-1 | `__Secure-` cookie clear over HTTP no-op | Dev-only nuisance; production HTTPS guaranteed |
| AGG3-7 / TE3-2 | Anti-cheat retry/backoff lacks direct timing tests | Test setup non-trivial; defer to dedicated cycle |
| AGG3-8 / DES3-1 | Privacy notice has no decline path | UX/legal judgment call |
| AGG3-9 / ARCH3-2 | Anti-cheat at 335 lines | Refactor without behavior change; threshold 400 |
| AGG3-10 | Various cosmetic optional items | Each cosmetic; pick up opportunistically |
| AGG-10 (cycle 2) | Anti-cheat online event can race with retry timer | Server-idempotent; duplicate POSTs benign |
| AGG-4 (cycle 1) | Anti-cheat retry timer holds stale closure across `assignmentId` change | Component is keyed on `assignmentId` |
| DEFER-22..57 | Carried from cycles 38–48 | See `_aggregate-cycle-48.md` |

---

## No Agent Failures

All 11 lanes (architect, code-reviewer, critic, debugger, designer, document-specialist, perf-reviewer, security-reviewer, test-engineer, tracer, verifier) completed successfully. Aggregate written without retries. No designer-runtime lane attempted this cycle (sandbox lacks Postgres + Docker per cycle-3 history note); designer ran source-level review.

---

## Recommended Cycle-4 Plan Tasks

Based on the converging-and-actionable findings:

1. **Task A [LOW, 5-agent convergence]** — Gate `__test_internals` behind `NODE_ENV === "test"` (AGG4-1).
2. **Task B [LOW, 3-agent convergence]** — Cap `loadPendingEvents` length at 200 + add unit test (AGG4-2).
3. **Task C [LOW]** — Add defensive comment in `refreshAnalyticsCacheInBackground` catch block (AGG4-3).
4. **Housekeeping** — Archive cycle-3 plan from `plans/open/` to `plans/done/` (already pending in working tree).

All other items either carried-deferred or optional cosmetic. Cycle 4 is a small focused cycle, similar to cycle 3.

---

## Cross-Cycle Trend Observation

Cycles 1–4 show a clear convergence pattern: each cycle's findings are narrower and more cosmetic. This is healthy steady-state. Critic (CRIT4-4) suggests cycles 5+ either pivot to feature/migration work (workspace-to-public migration directive) or pause until codebase changes provide new review surface. The orchestrator's loop counter (4/100) implies 96 more cycles; whether that's the right cadence is a separate question for the user.
