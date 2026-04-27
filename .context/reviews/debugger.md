# Debugger Review — RPF Cycle 7/100

**Date:** 2026-04-26
**Cycle:** 7/100
**Lens:** latent bugs, failure modes, regressions, error recovery, edge cases

---

## Cycle-6 carry-over verification

All cycle-6 plan tasks confirmed at HEAD; no regressions detected.

Specific re-verification of cycle-6 critical fix:
- `deploy-docker.sh` Step 5b backfill is idempotent and runs before drizzle-kit push (confirmed at lines 570-596).
- The hash semantics in step 5b match `src/lib/judge/auth.ts:21-23` (both produce `SHA-256` hex of UTF-8 bytes; `psql` uses `encode(sha256(secret_token::bytea), 'hex')`, Node uses `createHash('sha256').update(token).digest('hex')`).

---

## DBG7-1: [LOW, NEW] `deploy-docker.sh` Step 5b uses heredoc `<<'SQL'` with single-quoted delimiter — multi-layer escaping is correct but fragile

**Severity:** LOW (correctness verification, not a bug)
**Confidence:** HIGH

**Evidence:**
- `deploy-docker.sh:576-595`: Step 5b psql heredoc.
- Outer `remote "..."` is double-quoted; inner heredoc delimiter `<<'SQL'` is single-quoted. The local shell expands `${REMOTE_DIR}` and the escape-prefix sequences `\$(...)`, `\$\$`, `\$sql\$` while preserving the heredoc delimiter through the double-quote layer.
- Net effect: REMOTE bash sees a heredoc with no expansion; PL/pgSQL `$$ ... $$` and `$sql$ ... $sql$` delimiters are intact; psql executes correctly.

**Verification status:** Correct, but fragile — a future contributor reorganizing this block could break it.

**Fix:** Add a comment block documenting the escape-map:
```
# Escape map for the heredoc inside remote "..."
#   ${VAR}        → expands locally (REMOTE_DIR)
#   \${VAR}       → expands on remote (PG_PASS)
#   \$(...)       → command substitution on remote
#   \$\$          → PL/pgSQL $$ delimiter
#   \$sql\$       → PL/pgSQL named delimiter
#   <<'SQL'       → heredoc with no expansion (single-quoted delim)
```

**Exit criteria:** Escape semantics documented at the call site.

**Carried-deferred status:** Defer (current code correct, doc improvement only).

---

## DBG7-2: [LOW, NEW] `deploy-docker.sh:573` derives `NETWORK_NAME` via `docker network ls --format '{{.Name}}' | grep judgekit | head -1` — works for typical compose project but on a multi-project host could pick the wrong network

**Severity:** LOW (defensive — current behavior may be wrong on multi-project hosts)
**Confidence:** MEDIUM

**Evidence:**
- `deploy-docker.sh:573-574`:
  ```sh
  NETWORK_NAME=$(remote "docker network ls --format '{{.Name}}' | grep judgekit | head -1" 2>/dev/null)
  NETWORK_NAME="${NETWORK_NAME:-judgekit_default}"
  ```
- The fallback `${NETWORK_NAME:-judgekit_default}` is correct — if grep finds no matching network, `NETWORK_NAME` is empty and the fallback fires.
- BUT: `head -1` on multiple matches picks the FIRST one, alphabetical-ish but not deterministic.

**Failure scenario:** Operator runs deploy on a host with multiple judgekit-related networks (e.g., from a sibling deploy or stale compose project). `head -1` picks one arbitrarily. Step 5b backfill might attach to the wrong network, fail with `psql: error: connection to server at "db" (...): Name or service not known`, deploy aborts.

**Fix (defensive):**
1. Use `--filter "label=com.docker.compose.project=judgekit"` instead of grep — more robust to network-naming variations.
2. Or read the project name from `docker compose config --format json | jq -r .name`.

**Exit criteria:** NETWORK_NAME selection is deterministic across multi-project hosts.

**Carried-deferred status:** Defer (typical single-project deploy host is unaffected).

---

## DBG7-3: [LOW, NEW] `refreshAnalyticsCacheInBackground` uses `analyticsCache.set` then `_lastRefreshFailureAt.delete` in success path — but analyticsCache.set ALREADY triggers dispose (which deletes the cooldown). The explicit delete is redundant on overwrite

**Severity:** LOW (defensive redundancy / dead code)
**Confidence:** HIGH

**Evidence:**
- `route.ts:82-84` (success path):
  ```ts
  const fresh = await computeContestAnalytics(assignmentId, true);
  analyticsCache.set(cacheKey, { data: fresh, createdAt: await getDbNowMs() });
  _lastRefreshFailureAt.delete(cacheKey);  // line 84
  ```
- `route.ts:37-46` dispose hook clears the cooldown on entry eviction.
- When `analyticsCache.set` overwrites an existing entry, dispose fires for the OLD value — calling `_lastRefreshFailureAt.delete(key)` synchronously.
- Then line 84 explicitly does `_lastRefreshFailureAt.delete(cacheKey)` AGAIN. Redundant on overwrite, NECESSARY on first-set (no prior entry → no dispose fires).

**Why it's worth tracking:** The dual-nature of the delete is invisible to a casual reader.

**Fix (cosmetic):** Add a one-line comment above line 84:
```ts
// Explicit delete here covers the "first set" case (no prior value, no
// dispose fires). On overwrite, dispose has already cleared the cooldown.
_lastRefreshFailureAt.delete(cacheKey);
```

**Exit criteria:** Comment clarifies the dual nature of the delete.

**Carried-deferred status:** Defer (cosmetic, code is correct).

---

## DBG7-4: [LOW, NEW] `anti-cheat-monitor.tsx` `scheduleRetryRef` uses `useRef<(remaining: PendingEvent[]) => void>(() => {})` — initial value is a no-op until useEffect at line 109 runs; theoretical timing window during first render

**Severity:** LOW (theoretical — React rendering order normally handles this)
**Confidence:** LOW

**Evidence:**
- `anti-cheat-monitor.tsx:95`: `const scheduleRetryRef = useRef(() => {});` — initial no-op.
- `anti-cheat-monitor.tsx:109-122`: useEffect that REPLACES `scheduleRetryRef.current` with the real implementation.
- React's useEffect runs AFTER commit. If `flushPendingEvents` (called from line 164's useEffect) invokes `scheduleRetryRef.current(remaining)` and the effect at line 109 hasn't yet run for this render, the no-op fires.

**Verification of timing:** React useEffect ordering follows declaration order. Line 109 is declared BEFORE line 162. So line 109's effect runs first, replacing the ref. Subsequent useEffects see the real implementation. ✓ Safe.

**Conclusion:** Not a bug at HEAD. React's effect ordering protects this.

**Fix (defensive, optional):** Replace the no-op default with a dev-only warning to surface unexpected calls.

**Carried-deferred status:** Defer (current code correct, defensive improvement only).

---

## Summary

**Cycle-7 NEW findings:** 0 HIGH, 0 MEDIUM, 4 LOW (all carried-deferable, mostly defensive).
**Cycle-6 carry-over status:** All cycle-6 fixes hold; no latent bugs reintroduced.
**Debug verdict:** No latent bugs at HEAD. The cycle-6 deploy-docker.sh fix is correctly implemented — the multi-layer escaping is fragile but works.
