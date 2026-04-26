# Document-Specialist Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Scope:** documentation accuracy, code/doc mismatches, plan hygiene, README convention compliance

## Findings

### DOC4-1: [MEDIUM, deferred] AGENTS.md vs `password.ts` policy mismatch (carried)

**Severity:** MEDIUM | **Confidence:** HIGH | **Files:** `AGENTS.md:516-521`, `src/lib/security/password.ts:45,50,59`

Carried from cycle 3 AGG3-5. AGENTS.md says password validation MUST only check minimum length; code enforces dictionary + similarity. Requires user/PM decision before any reconciliation.

**Fix (deferred):** No change this cycle. Carried.

**Exit criterion:** User decision on which side to reconcile.

---

### DOC4-2: [LOW] `plans/open/` archival convention now documented but new plans still accumulate

**Severity:** LOW | **Confidence:** HIGH | **Files:** `plans/open/README.md`, `plans/open/`

Cycle 3 archived 76 completed plans and added the convention to `plans/open/README.md` (commit `d0751786`). After that, cycle 3's plan was added (`2026-04-27-rpf-cycle-3-review-remediation.md`), and cycle 4 will add another. The pattern is now: each cycle adds 1 new plan and (per the convention) archives the previous cycle's plan when complete.

Currently `plans/open/` contains: workspace-migration plan + master backlogs (4 files) + the cycle-3 plan (now done, will be moved this cycle). After cycle 4 completes, `plans/open/` will contain: workspace-migration + 4 master backlogs + cycle-4 plan = ~6 files. Healthy.

**Action this cycle:** As part of the cycle-4 plan execution, archive `plans/open/2026-04-27-rpf-cycle-3-review-remediation.md` to `plans/done/`. (Already done in this cycle's first commit batch.)

**Exit criterion:** Cycle-3 plan moved to `plans/done/`. Verified above.

---

### DOC4-3: [LOW] Doc comment on `_lastRefreshFailureAt` mentions "the lifecycle" but the relevant `dispose` hook is below it

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:21-31`

The doc comment above `_lastRefreshFailureAt` reads:
> Bound to the same lifecycle as `analyticsCache` via the `dispose` hook below

This is correct, but a reader scanning the file top-down sees the doc comment first and the `dispose` implementation 14 lines later. The comment refers to "below" without a line anchor. Easy to miss.

**Fix:** Add `(see line ~37)` or move the cooldown declaration below the `analyticsCache` declaration so the spatial relationship is clearer:
```ts
const analyticsCache = new LRUCache<string, CacheEntry>({
  max: 100,
  ttl: CACHE_TTL_MS,
  dispose: (...) => { _lastRefreshFailureAt.delete(key); },
});
const _lastRefreshFailureAt = new Map<string, number>();
```

But: that requires the cooldown to be declared *after* it's referenced in `dispose`, which works only because `dispose` runs at call time. Cleaner: move the comment.

**Exit criterion:** N/A this cycle (cosmetic).

---

### DOC4-4: [INFO] `__test_internals` JSDoc is good but unenforceable

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:82-91`

The JSDoc clearly states "Production code MUST NOT depend on this export." This is good documentation. As CR4-1 / ARCH4-1 / CRIT4-1 noted, this is policy-not-mechanism. The doc is fine as-is; if cycle 4 fixes the env-gating (per ARCH4-1), the doc should be updated to say "this export is only available when NODE_ENV === 'test'."

**No action this cycle** unless ARCH4-1 fix lands; in that case, update the JSDoc concurrently.

---

### DOC4-5: [LOW] CLAUDE.md "Korean letter-spacing" directive is project-specific and well-respected

**File:** `CLAUDE.md:14-16`

Spot-checked the recent changes for `tracking-*` or `letter-spacing` on Korean text: none found. The privacy notice dialog uses no tracking utilities. The compliance posture is healthy.

**No action.**

---

### DOC4-6: [INFO] Cycle plan structure is consistent

The cycle-3 plan (`plans/open/2026-04-27-rpf-cycle-3-review-remediation.md`, now archived) follows the established structure: status legend, summary, tasks with exit criteria, deferred items table with severity/confidence/reason/exit-criterion columns, repo-policy compliance section, gate plan. The cycle-4 plan should follow the same template.

**No action — informational.**

---

## Workspace-to-Public Migration Doc Trail

The directive at `user-injected/workspace-to-public-migration.md` is well-documented (constraints, current state, desired outcome, considerations). The standing plan at `plans/open/2026-04-19-workspace-to-public-migration.md` tracks ongoing work. Cycle 4 review surfaces no new concrete migration candidate (DES4-3); the directive remains accurate and current.

**No action.**

---

## Confidence Summary

- DOC4-1: HIGH (carried-deferred per repo policy).
- DOC4-2: HIGH (housekeeping; will be addressed by cycle 4 plan).
- DOC4-3: MEDIUM (cosmetic).
- DOC4-4: HIGH (informational; conditional update).
- DOC4-5: HIGH (compliance affirmed).
- DOC4-6: HIGH (informational).
