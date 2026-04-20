# Cycle 22 Debugger Review

**Date:** 2026-04-20
**Base commit:** 717a5553

---

## F1: `ensure_env_secret` writes random hex for AUTH_TRUST_HOST and COMPILER_RUNNER_URL [HIGH/HIGH]

**Files:** `deploy-docker.sh:254-286`
**Description:** On a fresh remote where `.env.production` doesn't exist yet, the flow is:
1. `deploy-docker.sh` generates a local `.env.production` with `AUTH_TRUST_HOST=true` (line 222)
2. rsync excludes `.env*` (line 299), so the local file is NOT transferred
3. The remote has no `.env.production` yet, so line 335-339 transfers it
4. Later, `ensure_env_secret AUTH_TRUST_HOST true` runs (line 277)
5. Since the key IS in the file (from step 3), the function returns early at line 258

So on a FRESH deploy, the function returns early because the local `.env.production` already has `AUTH_TRUST_HOST=true`. The bug only manifests if the remote `.env.production` exists but is MISSING the key -- which can happen after manual edits or upgrades.

However, for COMPILER_RUNNER_URL: this key is NOT in the auto-generated `.env.production` template (lines 217-236). So on a fresh deploy where `INCLUDE_WORKER=false`, the remote file won't have this key, and `ensure_env_secret COMPILER_RUNNER_URL "http://host.docker.internal:3001"` will generate a random hex value. This IS a real bug that will break the compiler runner on fresh algo deployments.

**Fix:** Add literal value support to the function. Create `ensure_env_literal` that writes a specific value instead of generating a random one.
**Confidence:** HIGH

## F2: Control discussions page has double auth check that can lock out moderators [MEDIUM/MEDIUM]

**Files:** `src/app/(control)/layout.tsx:20-30`, `src/app/(control)/control/discussions/page.tsx:39-41`
**Description:** The layout requires `users.view || system.settings || submissions.view_all || groups.view_all || assignments.view_status`. A user with ONLY `community.moderate` (but none of the above capabilities) will be redirected to `/dashboard` before reaching the discussions page. This means a community moderator who isn't an instructor cannot access the moderation tools at `/control/discussions`.
**Fix:** Add `community.moderate` to the layout's access check, or restructure the route.
**Confidence:** MEDIUM
