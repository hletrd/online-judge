# User-Injected TODOs for Next Cycle

## 1. Move workspace-only pages to public with new top navbar layout (ONGOING)

**Priority: High**
**Status:** Phase 1 complete — workspace route group eliminated, My Discussions tab added to community. Continue with Phase 2: implement the unified top navbar layout and migrate remaining workspace-only pages.

See `plans/open/2026-04-19-workspace-to-public-migration.md` for the full migration plan and phase breakdown.

## 2. Fix rsync overwriting remote .env on worker server

**Priority: Medium**
**Status: RESOLVED (cycle 22)** — Verified that no rsync command in any deploy script overwrites the remote `.env`. `deploy-docker.sh` uses `--exclude='.env*'` (line 299). `deploy-worker.sh` uses `ensure_env_var()` (Python-based per-key update) instead of rsync and explicitly preserves remote-only keys (line 93 comment). `deploy-test-backends.sh` excludes `.env` and `.env.production` (lines 86-87). No action needed.

## 3. Deploy-docker.sh should handle COMPILER_RUNNER_URL for algo target

**Priority: Medium**
The deploy script failed because the remote `.env.production` was missing `COMPILER_RUNNER_URL=http://host.docker.internal:3001`. This should be auto-injected by the deploy script when `INCLUDE_WORKER=false` is set, similar to how `AUTH_TRUST_HOST` is handled.
