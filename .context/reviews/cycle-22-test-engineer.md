# Cycle 22 Test Engineer Review

**Date:** 2026-04-20
**Base commit:** 717a5553

---

## F1: No test for `ensure_env_secret` literal value behavior [MEDIUM/HIGH]

**Files:** `deploy-docker.sh:254-286`
**Description:** The `ensure_env_secret` function has no test coverage. Its misuse for literal values (AUTH_TRUST_HOST=true, COMPILER_RUNNER_URL=url) is a correctness bug that has persisted across multiple cycles. A shellcheck or bash unit test could catch this.
**Fix:** Add a test in `tests/unit/infra/` that validates the deploy script's env handling, or at minimum add a shellcheck directive to validate the function parameters.
**Confidence:** MEDIUM

## F2: No E2E test for route consolidation redirects [MEDIUM/MEDIUM]

**Files:** Phase 4 migration plan
**Description:** When `/dashboard/rankings`, `/dashboard/languages`, and `/dashboard/compiler` are redirected to their public counterparts, there should be E2E tests verifying the redirects work correctly and that authenticated users see the enhanced view. Currently there are no such tests.
**Fix:** Add redirect tests to the E2E suite after implementing Phase 4.
**Confidence:** MEDIUM
