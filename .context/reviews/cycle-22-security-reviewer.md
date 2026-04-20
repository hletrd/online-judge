# Cycle 22 Security Reviewer

**Date:** 2026-04-20
**Base commit:** 717a5553

---

## F1: `ensure_env_secret` writes random hex instead of `true` for AUTH_TRUST_HOST [HIGH/HIGH]

**Files:** `deploy-docker.sh:254-286`
**Description:** On a fresh remote deployment where `.env.production` does not contain `AUTH_TRUST_HOST`, the `ensure_env_secret AUTH_TRUST_HOST true` call writes a random 64-char hex string instead of the string `true`. This causes `validateTrustedAuthHost()` to receive a truthy but incorrect value. The actual impact depends on how the value is consumed -- if it's checked as a boolean (`!!process.env.AUTH_TRUST_HOST`), any non-empty string works. If it's checked as `=== "true"`, it breaks. Looking at the codebase, `AUTH_TRUST_HOST` is checked as `process.env.AUTH_TRUST_HOST === "true"` in the auth config, so a random hex string would make auth trust host NOT work, causing UntrustedHost errors on reverse proxy deployments.
**Fix:** Add literal value support to `ensure_env_secret` or use a separate function for non-secret env vars that need specific values.
**Confidence:** HIGH

## F2: COMPILER_RUNNER_URL auto-injection value is treated as generator type [MEDIUM/HIGH]

**Files:** `deploy-docker.sh:283-286`
**Description:** `ensure_env_secret COMPILER_RUNNER_URL "${COMPILER_RUNNER_DEFAULT}"` passes `http://host.docker.internal:3001` as the generator parameter. Since this doesn't match `"hex"` or `"base64"`, the function generates a random hex value on first deploy instead of the intended URL. The app would then fail to connect to the external judge worker.
**Fix:** Same as F1 -- the function needs to support literal value injection.
**Confidence:** HIGH

## F3: Control layout checks `canAccessControl` but control discussions page re-checks `canModerate` separately [LOW/MEDIUM]

**Files:** `src/app/(control)/layout.tsx:20-30`, `src/app/(control)/control/discussions/page.tsx:39-41`
**Description:** The control layout redirects users who lack admin/instructor capabilities. Then the discussions page separately checks `canModerateDiscussions`. The two checks use different capability sets: the layout checks `users.view`, `system.settings`, etc., while the discussions page checks `community.moderate`. A user with `community.moderate` but NOT `users.view` would be redirected from `/control` before reaching the discussions page.
**Fix:** Either add `community.moderate` to the layout's access check, or restructure so the discussions page is accessible independently.
**Confidence:** MEDIUM
