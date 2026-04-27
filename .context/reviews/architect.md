# Architect Review — RPF Cycle 7/100

**Date:** 2026-04-26
**Cycle:** 7/100 of review-plan-fix loop
**Lens:** architectural / design risk, coupling, layering, schema lifecycle, deploy-script architecture
**Files inventoried (review-relevant):** `deploy-docker.sh`, `drizzle/pg/0020_drop_judge_workers_secret_token.sql`, `drizzle/pg/0021_lethal_black_tom.sql`, `drizzle/pg/meta/_journal.json`, `src/lib/db/schema.pg.ts`, `src/lib/judge/auth.ts`, `src/app/api/v1/contests/[assignmentId]/analytics/route.ts`, `src/components/exam/anti-cheat-monitor.tsx`, `src/lib/security/env.ts`, `src/proxy.ts`, `AGENTS.md`, `.env.example`, `.env.production.example`, `tests/unit/api/contests-analytics-route.test.ts`, `tests/unit/db/schema-parity.test.ts`.

---

## Cycle-6 carry-over verification

All cycle-6 plan tasks are confirmed RESOLVED at HEAD:

- **Task A (AGG6-1, 4-agent convergence):** `deploy-docker.sh:570-596` now contains a Step 5b "Pre-drop secret_token backfill" psql block that runs BEFORE `drizzle-kit push`. The DO-block is idempotent (information_schema guard) and matches the hash semantics of `src/lib/judge/auth.ts:21-23` (`encode(sha256(secret_token::bytea), 'hex')`). Verified comment block at lines 544-569 explains the architecture decision.
- **Task B (AGG6-2, 4-agent convergence):** `AGENTS.md:349,359,362` now contains a "Database migration recovery (DRIZZLE_PUSH_FORCE)" section. `.env.example:30-31` and `.env.production.example:19-20` both contain the commented `DRIZZLE_PUSH_FORCE=0` reference. `deploy-docker.sh:651` warn message references the AGENTS.md section.
- **Task C (AGG6-15, housekeeping):** Cycle-5 plan moved to `plans/done/`.

The cycle-6 MEDIUM cluster (security + correctness + data-loss) is fully resolved at HEAD. No regression detected.

---

## ARCH7-1: [LOW, NEW] Step 5b psql backfill and Step 6 push pull from `.env.production` — duplicate "PG_PASS lookup + docker run --rm postgres:18-alpine -e PGPASSWORD" boilerplate appears 4 times (lines 576-595, 635-645, 659-670, 675-683)

**Severity:** LOW (architectural / code-smell — duplicated infra boilerplate in deploy script)
**Confidence:** HIGH

**Evidence:**
The deploy-docker.sh script now has FOUR near-identical psql/node container invocations on adjacent lines:

1. Step 5b backfill (`deploy-docker.sh:576-595`) — psql container with PG_PASS lookup.
2. Step 6 drizzle-kit push (`deploy-docker.sh:635-645`) — node container with PG_PASS lookup.
3. Step 6b "Schema repairs" psql (`deploy-docker.sh:659-670`) — psql container with PG_PASS lookup.
4. Step 6c ANALYZE psql (`deploy-docker.sh:675-683`) — psql container with PG_PASS lookup.

All four use the same pattern:
```
remote "PG_PASS=\$(grep '^POSTGRES_PASSWORD=' ${REMOTE_DIR}/.env.production | cut -d= -f2-) && \
    export POSTGRES_PASSWORD=\"\${PG_PASS}\" && \
    export PGPASSWORD=\"\${PG_PASS}\" && \
    docker run --rm \
    --network ${NETWORK_NAME} \
    -e POSTGRES_PASSWORD -e PGPASSWORD \
    postgres:18-alpine ..."
```

**Why it's a problem:** Each step duplicates the credential-loading + docker-run-network boilerplate. If the postgres image bumps to 19, or the env file moves, or the network detection changes (cycle-6 introduced `NETWORK_NAME=$(remote "docker network ls --format '{{.Name}}' | grep judgekit | head -1")`), the operator must remember to update all four locations. This is the classic "shotgun surgery" code smell.

**Failure scenario (latent):** Operator bumps postgres to 19 in step 5b but forgets step 6b — the schema repairs step then runs against a postgres-18 client connecting to the (now upgraded) postgres-19 server. Most cases this still works (libpq is forward-compatible) but introduces a silent compatibility risk.

**Fix (small, defensive):**
1. Extract a shell function `run_psql() { ... }` that wraps the docker-run-with-credentials boilerplate. Step 5b, step 6b, and step 6c can all become single-line invocations: `run_psql <<'SQL' ... SQL`.
2. Optionally extract `run_node_drizzle()` for step 6's node-container variant.

This is non-blocking. Defer to a future deploy-script refactor cycle. Recording for tracking.

**Exit criteria:** All four containers parameterize the postgres image version + network detection in one location.

---

## ARCH7-2: [LOW, NEW carried from AGG6-3] `0021_lethal_black_tom.sql` adds `tags.updated_at` as nullable, but the schema declares it with `.$defaultFn(() => new Date())` — drizzle-kit does NOT translate `$defaultFn` to SQL `DEFAULT`

**Severity:** LOW (cycle-6 deferred AGG6-3 reaffirmed at cycle-7)
**Confidence:** HIGH

**Evidence:**
- `src/lib/db/schema.pg.ts:1056-1057`: `updatedAt: timestamp("updated_at", { withTimezone: true }).$defaultFn(() => new Date())` — runtime-only default; drizzle-kit does NOT translate `$defaultFn` to `DEFAULT` in DDL.
- `drizzle/pg/0021_lethal_black_tom.sql:1`: `ALTER TABLE "tags" ADD COLUMN "updated_at" timestamp with time zone;` — no DEFAULT, no NOT NULL.
- All 18 other `updated_at` columns in `schema.pg.ts` are `.notNull()` (pattern: `index("dt_updated_at_idx").on(table.updatedAt)` confirms convention at line 875).
- Verified ZERO consumers of `tag.updatedAt` in `src/` via grep — consistent with cycle-6 deferral reasoning. The deferred status is reaffirmed.

**Why it's still worth tracking:** Cycle-6 deferred this as "no current consumer" — true at HEAD. But the inconsistency means a future feature (e.g., tag-management list page sorted by recency, or audit trail) that adds `tag.updatedAt` access will encounter NULLs on every existing tag row, requiring a defensive `?? createdAt` fallback. Better to fix the schema once than scatter fallback logic.

**Fix (when picked up):**
1. Add a follow-up migration `0022_tags_updated_at_notnull.sql`:
   ```sql
   UPDATE tags SET updated_at = created_at WHERE updated_at IS NULL;
   ALTER TABLE tags ALTER COLUMN updated_at SET DEFAULT now();
   ALTER TABLE tags ALTER COLUMN updated_at SET NOT NULL;
   ```
2. Update `schema.pg.ts:1056-1057` to add `.notNull()`.
3. Re-snapshot via `npx drizzle-kit generate` (verifies _journal + meta stay in sync).

**Exit criteria:** `tags.updated_at` is `NOT NULL` with a sensible default, mirroring the other 18 `updated_at` columns.

**Carried-deferred status:** Defer this cycle (no consumer yet). Re-open when the first consumer is added, OR when a dedicated schema-consistency cleanup cycle runs.

---

## ARCH7-3: [LOW, NEW] `analyticsCache.dispose` synchronous-only contract is implicit; a future caller of `analyticsCache.set()` from inside an async error path may not realize the dispose hook fires synchronously BEFORE the new value is committed

**Severity:** LOW (architectural — implicit invariant in shared module)
**Confidence:** MEDIUM

**Evidence:**
- `route.ts:34-47`: The LRU cache declares `dispose: (_value, key) => { _lastRefreshFailureAt.delete(key); }`. The dispose hook fires for the OLD value before SET commits.
- `route.ts:88-95` (`refreshAnalyticsCacheInBackground` catch-block): Comment correctly notes `analyticsCache.set()` MUST NOT be called in the catch path because dispose would synchronously delete the cooldown timestamp before the catch's set fires.
- A future contributor reading the module might miss this subtle invariant. The comment at lines 88-94 partially documents it, but the dispose declaration at line 37 doesn't cross-reference the rule.

**Why it's a problem:** The current code is correct. But the invariant ("never call `analyticsCache.set` from inside the failure-cooldown set path") lives only in the catch-block comment. A refactor that splits the function or reuses the cache for a different purpose could violate it.

**Fix (defensive, small):**
1. Add a short JSDoc above `analyticsCache` (line 34) that names the invariant: "INVARIANT: analyticsCache.set MUST NOT be called from any code path that also writes to _lastRefreshFailureAt for the same key. The dispose hook will overwrite the cooldown."
2. Optionally introduce a wrapper function `setCacheWithCooldownClear(key, entry)` and `setCooldownAfterFailure(key)` that prevents the bad pattern from compiling.

**Exit criteria:** The dispose-cooldown coupling is documented at the cache declaration, not just inside one consumer.

**Carried-deferred status:** Defer this cycle (current code correct; defensive doc improvement).

---

## ARCH7-4: [LOW, NEW] `getAuthSessionCookieName()` and `getAuthSessionCookieNames()` co-exist in `env.ts` with subtly different contracts — single-callee returns one name based on HTTPS context, dual-callee returns both names regardless of context

**Severity:** LOW (architectural — two near-identical APIs, slight cognitive load)
**Confidence:** HIGH

**Evidence:**
- `src/lib/security/env.ts:166-170` (`getAuthSessionCookieName`): returns ONE cookie name (secure or non-secure) depending on `shouldUseSecureSessionCookie()`.
- `src/lib/security/env.ts:172-180` (`getAuthSessionCookieNames`): returns BOTH (`{ name, secureName }`), to support clearing both variants on logout.
- `src/proxy.ts:7,87-97`: imports `getAuthSessionCookieNames`, uses it for clear-both semantics.
- Cycle-48 AGG-3 (which led to this addition) is now confirmed FIXED at HEAD.

**Why it's worth flagging:** The two functions have subtly similar names (`Name` vs `Names`) and slightly different contracts. A new caller that wants "the current cookie name for an authenticated user" might see `getAuthSessionCookieNames` first, get back `{ name, secureName }`, and pick `name` thinking it's the active one. But on HTTPS deployments, the active cookie is `secureName`, not `name`.

**Failure scenario:** A future feature reads cookies with `getAuthSessionCookieNames().name`, expecting the active session cookie. On HTTPS deployments, the secure cookie is the actual one set by the auth flow; the unsecured `name` is stale legacy. Result: silent session lookup failure that returns `null` even though the user is logged in.

**Fix:** Add a JSDoc note clarifying the use case for each function:
- `getAuthSessionCookieName`: "Returns the SINGLE active cookie name for the current security context. Use this for reading the active session cookie."
- `getAuthSessionCookieNames`: "Returns BOTH cookie names for cleanup operations. Do not use for reading the active session — use getAuthSessionCookieName instead."

**Exit criteria:** Each function's JSDoc explicitly distinguishes the read-vs-cleanup use cases.

**Carried-deferred status:** Defer this cycle (current callers are correct). Pick up opportunistically when this file is otherwise edited.

---

## Cross-cycle re-validation (cycles 1-6 carried-deferred items)

All carried-deferred items from `_aggregate-cycle-48.md` and the cycle-6 deferred table are re-confirmed deferrable at HEAD:

| Cycle | Carried-deferred | Status at HEAD |
|-------|------------------|----------------|
| 6 | AGG6-3 (tags.updated_at nullable inconsistency) | Still defer — zero consumers (re-flagged here as ARCH7-2) |
| 6 | AGG6-4 (0021 filename) | Still defer — drizzle-kit rename risk |
| 6 | AGG6-5 (cycle-5 dispose test name) | Still defer — cosmetic |
| 6 | AGG6-6 (`setCooldown.valueMs` rename) | Still defer — cosmetic naming (also flagged this cycle by code-reviewer CR7-1) |
| 6 | AGG6-7 through AGG6-20 | All still defer per cycle-6 reasoning |

No regressions detected.

---

## Summary

**Cycle-7 NEW findings:** 0 HIGH, 0 MEDIUM, 4 LOW (all defensible defers).
**Cycle-6 carry-over:** All 3 implemented tasks remain in place.
**Architectural verdict:** No HIGH or MEDIUM architectural risks at HEAD. The cycle-6 fixes hold. The four LOW findings are all defensible defers — current code is correct, the recommendations are defensive doc/refactor improvements.
