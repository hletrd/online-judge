# Critic Review — RPF Cycle 7/100

**Date:** 2026-04-26
**Cycle:** 7/100
**Lens:** multi-perspective skeptic — challenge assumptions, look for second-order effects, identify blind spots

---

## Cycle-6 carry-over verification

All cycle-6 fixes confirmed at HEAD. The 4-agent cluster (AGG6-1) addressed via Step 5b backfill in deploy-docker.sh; the documentation cluster (AGG6-2) addressed via AGENTS.md "Database migration recovery" section + .env.example commented entries.

---

## CRIT7-1: [LOW, NEW] The cycle-6 fix is asymmetric — Step 5b runs on EVERY deploy regardless of whether `secret_token` column even exists; this works correctly via information_schema guard, but adds a docker container startup + psql round-trip on EVERY deploy forever

**Severity:** LOW (operational efficiency / lifecycle)
**Confidence:** HIGH

**Evidence:**
- `deploy-docker.sh:570-596`: Step 5b spins up a `postgres:18-alpine` container, runs the DO-block, tears it down. Time cost: ~5-10s per deploy (image pull cached, container startup, psql connect, DO-block parse).
- The DO-block is correctly idempotent — when `secret_token` column doesn't exist, the `IF EXISTS` check makes the UPDATE a no-op.
- BUT: this Step 5b is a permanent fixture of the deploy script. Every future deploy (years from now, after `secret_token` column has been gone for ages) will continue to run this 5-10s no-op.

**Why it's worth tracking:** Cycle-6's fix prioritized correctness over cleanliness — correct call. But the fix should sunset eventually. After:
1. All production environments are confirmed to have applied the DROP COLUMN, AND
2. A reasonable retention period has passed (e.g., 6 months),
the Step 5b block can be removed. Otherwise, future maintainers will see a 5-10s deploy step whose purpose is opaque ("why do we backfill secret_token? oh, because of cycle 5...") forever.

**Fix:**
1. Add an inline comment in `deploy-docker.sh` Step 5b (around line 567-569 with the cycle-6 plan reference) noting the SUNSET CRITERION: "Remove this Step 5b after the secret_token column is gone from ALL environments AND a 6-month retention has passed."
2. Track it as a deferred TODO in plans/open/ with a calendar date for re-evaluation (e.g., 2026-10-26).

**Exit criteria:** Sunset criterion documented in deploy-docker.sh; deferred-TODO entry exists with re-evaluation date.

**Carried-deferred status:** Plan for cycle-7 minor implementation — adding a comment is small.

---

## CRIT7-2: [LOW, NEW] `AGENTS.md` cycle-6 documentation says "The Step 5b psql backfill ... runs on every deploy regardless of this flag" — but doesn't mention the SUNSET CRITERION (when this safety net can be removed)

**Severity:** LOW (documentation completeness)
**Confidence:** HIGH

**Evidence:**
- `AGENTS.md:359`: documents that Step 5b runs unconditionally.
- `AGENTS.md` does NOT mention when Step 5b can be removed.
- A future maintainer reading the AGENTS.md section will assume Step 5b is forever-load-bearing.

**Why it's a problem:** Same as CRIT7-1 from a doc angle. The documentation should track the operational lifecycle.

**Fix:** Add a "Sunset criteria" subsection under "Database migration recovery (DRIZZLE_PUSH_FORCE)" in AGENTS.md describing when Step 5b can be removed.

**Exit criteria:** AGENTS.md references the sunset criterion.

**Carried-deferred status:** Plan for cycle-7 alongside CRIT7-1.

---

## CRIT7-3: [LOW, NEW] `deploy-docker.sh` "additive PostgreSQL schema repairs" block at lines 658-670 still has the same architectural smell — these `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` statements are a band-aid for older PostgreSQL deployments that never received the corresponding drizzle migration

**Severity:** LOW (architectural — patch coupled to deploy strategy)
**Confidence:** HIGH

**Evidence:**
- `deploy-docker.sh:658-670`:
  ```sql
  ALTER TABLE problems ADD COLUMN IF NOT EXISTS default_language text;
  ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS default_language text;
  ```
- These columns ARE in `schema.pg.ts`. Drizzle-kit push should add them. So why is this band-aid here?

**Likely reason (verified by absence of explanation):** Old production DBs were deployed before drizzle-kit started tracking `default_language`. drizzle-kit push (vs migrate) compares schema-vs-DB and would synthesize the ADD COLUMN. So this block is either: (a) a pre-drizzle-kit-push leftover that's now redundant, or (b) a defensive belt for environments where drizzle-kit push silently no-ops.

**Failure scenario:** If drizzle-kit push DOES correctly add the columns, this block is dead code — adds 5-10s per deploy. If drizzle-kit push DOESN'T correctly add them, this block is silently load-bearing — and any future column added to `problems` or `system_settings` will need its own band-aid here too. There's no documented invariant either way.

**Fix:** Add a comment block explaining WHY these specific columns are pre-applied, and the criterion for adding/removing entries.

**Exit criteria:** The block has a documented purpose and add/remove criterion.

**Carried-deferred status:** Defer (operational, not blocking; pick up alongside future deploy-script refactor).

---

## CRIT7-4: [LOW, NEW] The cycle-6 plan's deferred table is comprehensive but `plans/open/` still contains the cycle-6 plan even though all tasks are `[x]` done — the plan should be archived this cycle per the README convention

**Severity:** LOW (process / housekeeping)
**Confidence:** HIGH

**Evidence:**
- `plans/open/2026-04-26-rpf-cycle-6-review-remediation.md` exists with all tasks `[x]` done (verified earlier in this cycle).
- `plans/open/README.md:36-39`: "Once **every** task in such a plan is `[x]` (or `[d]` with a recorded deferral exit criterion), the plan must be moved to `plans/done/` in the next cycle's housekeeping pass — typically by the cycle that follows it."

**Fix:** `git mv plans/open/2026-04-26-rpf-cycle-6-review-remediation.md plans/done/`

**Exit criteria:** Cycle-6 plan in `plans/done/`; `plans/open/` contains only standing plans + cycle-7 plan.

**Carried-deferred status:** Plan for cycle-7 housekeeping task.

---

## CRIT7-5: [LOW, NEW] User-injected `workspace-to-public-migration.md` says "the migration as originally scoped ... is substantially complete" but doesn't have a hard exit criterion; it remains a "placeholder for opportunistic edge cases"

**Severity:** LOW (process — long-running directive without explicit exit)
**Confidence:** HIGH

**Evidence:**
- `user-injected/workspace-to-public-migration.md:30-37`: "The migration as originally scoped ... is substantially complete. The directive remains open as a placeholder for opportunistic edge cases the per-cycle review may surface, but it does NOT need force-driven progress every cycle."
- User instructions for this cycle: "Long-term architectural directive: ... workspace-to-public page migration is HIGH priority, ongoing, incremental. Make progress in this cycle ONLY where the review surfaces a relevant opportunity; do NOT force unrelated migration work."

**Why it's worth tracking:** This cycle's review didn't surface a workspace-to-public migration opportunity. The directive is therefore correctly NOT actioned this cycle.

**Verification:** No new workspace-to-public migration issues found in this cycle's review (architect, code-reviewer, perf, security, test, designer, debugger, document-specialist, tracer, verifier, critic). The directive remains in monitoring mode.

**Fix:** No action — orchestrator instruction is honored.

**Carried-deferred status:** Resolved at verification. No migration work this cycle per surfacing rule.

---

## Summary

**Cycle-7 NEW findings:** 0 HIGH, 0 MEDIUM, 5 LOW (CRIT7-1 / CRIT7-2 / CRIT7-4 plannable; others deferable; CRIT7-5 resolved).
**Cycle-6 carry-over status:** All cycle-6 fixes hold. Documentation gaps remain around lifecycle/sunset criteria.
**Critical verdict:** No cross-cutting concerns at HEAD. The cycle-6 cluster fix is pragmatic but should track operational lifecycle. Most findings are housekeeping/process.
