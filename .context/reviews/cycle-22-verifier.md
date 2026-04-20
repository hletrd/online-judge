# Cycle 22 Verifier Review

**Date:** 2026-04-20
**Base commit:** 717a5553

---

## F1: `ensure_env_secret` produces wrong value for AUTH_TRUST_HOST on fresh deploys [HIGH/HIGH]

**Files:** `deploy-docker.sh:254-286`
**Description:** Verified by reading the function body: when the remote `.env.production` does NOT have `AUTH_TRUST_HOST`, the function calls `openssl rand -hex 32` (because `true` is not `"base64"`). The result is a 64-char hex string, not `true`. The auth config checks `process.env.AUTH_TRUST_HOST === "true"`, so this would NOT set the trust host flag. Verified that the COMPILER_RUNNER_URL call has the same issue -- a URL string is passed as the "generator" parameter, producing a random hex value instead.
**Fix:** The function needs a third mode for literal values, or a separate `ensure_env_literal` function.
**Confidence:** HIGH

## F2: deploy-worker.sh does NOT overwrite remote .env -- user-injected TODO appears stale [MEDIUM/HIGH]

**Files:** `scripts/deploy-worker.sh:92-136`
**Description:** Verified: the worker deploy script uses `ensure_env_var()` (a different function from `ensure_env_secret()`) that individually updates keys in the existing `.env` file via Python. It does NOT use rsync and does NOT overwrite the entire file. The comment on line 93 explicitly states "Preserves any existing remote-only keys." The main `deploy-docker.sh` uses `--exclude='.env*'` on line 299. There is no rsync command that would overwrite a remote `.env` file.
**Fix:** Confirm with the user whether this TODO is stale or refers to a different workflow.
**Confidence:** HIGH

## F3: Public rankings page is a strict superset of dashboard rankings [MEDIUM/HIGH]

**Files:** `src/app/(public)/rankings/page.tsx` vs `src/app/(dashboard)/dashboard/rankings/page.tsx`
**Description:** Verified feature comparison:
- Public: period filter (all/week/month), tier badges, mobile card layout, JSON-LD, SEO metadata, configurable page size
- Dashboard: none of the above, just basic table with pagination
- Dashboard adds: auth redirect, recruiting mode check
The dashboard version is strictly inferior. The public page can add the recruiting mode check with auth-aware rendering.
**Confidence:** HIGH
