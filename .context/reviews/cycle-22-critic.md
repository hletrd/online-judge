# Cycle 22 Critic Review

**Date:** 2026-04-20
**Base commit:** 717a5553

---

## F1: `ensure_env_secret` is misused for non-secret literal values -- broken on fresh deploys [HIGH/HIGH]

**Files:** `deploy-docker.sh:254-286`
**Description:** The function is designed to generate random secrets for missing keys. But `AUTH_TRUST_HOST=true` and `COMPILER_RUNNER_URL=http://host.docker.internal:3001` are NOT secrets -- they are configuration values with specific literal values. On a fresh remote where `.env.production` lacks these keys, the function generates random hex strings instead. This is a correctness bug, not just a style issue. It will break auth on fresh deploys.
**Confidence:** HIGH

## F2: Route consolidation (Phase 4) scope is well-defined but execution risk is understated [MEDIUM/MEDIUM]

**Files:** Migration plan `2026-04-19-workspace-to-public-migration.md`
**Description:** The plan lists 4 routes to merge (discussions already done, rankings/languages/compiler still pending). But the dashboard versions have subtle differences from their public counterparts: dashboard compiler passes `preferredLanguage`, dashboard rankings checks recruiting mode and redirects, dashboard languages shows worker count. Each of these needs careful auth-aware porting, not just a redirect.
**Confidence:** MEDIUM

## F3: Control route group is a maintenance orphan [MEDIUM/MEDIUM]

**Files:** `src/app/(control)/` directory
**Description:** The control group has its own layout, ControlNav component, and `controlShell` i18n namespace for only 2 pages. The home page is just a card grid linking to dashboard admin pages. This is navigation dead weight -- users must know to go to `/control` specifically, and it's not linked from the main navigation. It should be merged into the dashboard.
**Confidence:** MEDIUM
