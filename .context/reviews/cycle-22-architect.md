# Cycle 22 Architect Review

**Date:** 2026-04-20
**Base commit:** 717a5553

---

## F1: Three-route-group split creates unnecessary layout duplication [MEDIUM/HIGH]

**Files:** `src/app/(control)/layout.tsx`, `src/app/(dashboard)/layout.tsx`, `src/app/(public)/layout.tsx`
**Description:** The app has three route groups (public, dashboard, control) each with their own layout, navigation, and i18n namespace. The control group only has 2 pages and its layout reimplements auth checking, capability resolution, and nav rendering that the dashboard layout already does. The control layout does NOT use PublicHeader (it uses ControlNav instead), which means it lacks the unified top navbar.
**Fix:** Merge the control route group into the dashboard layout. Discussion moderation can live under `/dashboard/admin/discussions` with a `community.moderate` capability gate. This eliminates a whole layout, nav component, and i18n namespace.
**Confidence:** HIGH

## F2: Dashboard duplicate routes violate DRY at the architectural level [MEDIUM/HIGH]

**Files:** `src/app/(dashboard)/dashboard/rankings/page.tsx`, `src/app/(dashboard)/dashboard/languages/page.tsx`, `src/app/(dashboard)/dashboard/compiler/page.tsx`
**Description:** Three dashboard pages have public counterparts that are feature-superset versions (more filters, better SEO, mobile layouts, JSON-LD). The dashboard versions add nothing that cannot be expressed through auth-aware rendering on the public pages. This violates DRY at the route level and forces users to navigate two different layouts for the same content.
**Fix:** Phase 4 route consolidation: redirect dashboard duplicates to public counterparts, add auth-aware enhancements to public pages (e.g., preferred language on playground, worker count on languages for admins).
**Confidence:** HIGH

## F3: `ensure_env_secret` function has semantic mismatch -- `true` is treated as a generator type [MEDIUM/HIGH]

**Files:** `deploy-docker.sh:254-271`
**Description:** The `ensure_env_secret` function signature is `ensure_env_secret(key, generator)` where `generator` is expected to be `"hex"` or `"base64"`. However, `AUTH_TRUST_HOST` is passed as `ensure_env_secret AUTH_TRUST_HOST true` (line 277), treating `true` as a generator type. Since `true` is neither `"hex"` nor `"base64"`, the function falls through to the default `openssl rand -hex 32` on fresh deploys. This means `AUTH_TRUST_HOST` gets a random hex value instead of `true` on first deploy -- which would break auth trust host validation. The COMPILER_RUNNER_URL handling has the same issue: `ensure_env_secret COMPILER_RUNNER_URL "${COMPILER_RUNNER_DEFAULT}"` passes a URL as the "generator" param.
**Fix:** Add a third parameter to `ensure_env_secret` for literal values, or create a separate `ensure_env_literal` function. The function should distinguish between "generate a random value" and "set a specific value."
**Confidence:** HIGH

## F4: PublicHeader `getDropdownItems` duplicates capability knowledge with AppSidebar [LOW/MEDIUM]

**Files:** `src/components/layout/public-header.tsx:68-95`, `src/components/layout/app-sidebar.tsx:202-219`
**Description:** Both `getDropdownItems` and `filterItems` independently define capability-to-item mappings. If a new capability is added or an item's gating changes, both must be updated. There is no shared mapping or test that validates consistency.
**Fix:** Extract a shared `nav-capability-map.ts` that defines which capabilities gate which nav items. Both components import from the same source.
**Confidence:** MEDIUM
