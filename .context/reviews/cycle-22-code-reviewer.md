# Cycle 22 Code Reviewer

**Date:** 2026-04-20
**Base commit:** 717a5553

---

## F1: `ensure_env_secret` writes value as `true` literal instead of boolean string [HIGH/HIGH]

**Files:** `deploy-docker.sh:277`
**Description:** `ensure_env_secret AUTH_TRUST_HOST true` passes `true` as the `$generator` parameter. Inside `ensure_env_secret()`, when the file does NOT have the key, it falls through to the `openssl rand -hex 32` generator (because `$generator` is `true` but only `base64` is checked). The actual value written is a random hex string, not the string `true`.
**Fix:** The function signature is `ensure_env_secret(key, generator)`. The `generator` param only supports `"hex"` and `"base64"` -- anything else still generates a random value. For `AUTH_TRUST_HOST=true`, the function needs a special case or a different approach. The current code is actually broken: on first deploy to a fresh remote, `AUTH_TRUST_HOST` gets a random hex value instead of `true`. The `ensure_env_secret` function needs a `literal` mode or should accept a direct value.
**Confidence:** HIGH

## F2: Dashboard rankings page requires auth but public rankings does not -- route consolidation opportunity [MEDIUM/HIGH]

**Files:** `src/app/(dashboard)/dashboard/rankings/page.tsx`, `src/app/(public)/rankings/page.tsx`
**Description:** The dashboard rankings page at `/dashboard/rankings` requires authentication (line 32: `if (!session?.user) redirect("/login")`) and shows the same data as the public rankings page at `/rankings`, but with fewer features (no period filter, no tier badges, no mobile cards, no JSON-LD). The public page is strictly superior. This is Phase 4 of the workspace-to-public migration.
**Fix:** Redirect `/dashboard/rankings` to `/rankings` and remove the dashboard page component. The public page already works for both authenticated and unauthenticated users.
**Confidence:** HIGH

## F3: Dashboard languages page is redundant with public languages page [MEDIUM/HIGH]

**Files:** `src/app/(dashboard)/dashboard/languages/page.tsx`, `src/app/(public)/languages/page.tsx`
**Description:** The dashboard languages page at `/dashboard/languages` shows the same language catalog data as the public languages page at `/languages`, but the public page has more columns (compile command, run command, grading environment details). The dashboard page adds worker count and "View Dashboard Overview" link but these are minor additions.
**Fix:** Redirect `/dashboard/languages` to `/languages` and remove the dashboard page. Add auth-aware rendering to the public page if the worker count stat is needed for admins.
**Confidence:** HIGH

## F4: Dashboard compiler page vs public playground -- duplicate functionality [MEDIUM/MEDIUM]

**Files:** `src/app/(dashboard)/dashboard/compiler/page.tsx`, `src/app/(public)/playground/page.tsx`
**Description:** Both pages render the same `CompilerClient` component. The dashboard version passes `preferredLanguage` from the session; the public version does not. The dashboard version has platform-mode restrictions; the public version does not. Both use the same `runEndpoint` default.
**Fix:** Merge by having the public playground pass `preferredLanguage` when the user is authenticated. Add platform-mode checking to the public page. Redirect `/dashboard/compiler` to `/playground`.
**Confidence:** MEDIUM

## F5: `deploy-worker.sh` does NOT overwrite remote `.env` -- user-injected TODO may be stale [MEDIUM/HIGH]

**Files:** `scripts/deploy-worker.sh:92-136`
**Description:** The user-injected TODO #2 says "The rsync in the manual worker deploy overwrites the worker's `.env` file. Need to add `--exclude='.env'` to the rsync command." However, examining `deploy-worker.sh`, it does NOT use rsync at all -- it uses `docker save | docker load` for the image, `scp` for the compose file, and an `ensure_env_var` Python helper that individually updates variables in the existing `.env` file. The script explicitly preserves remote-only keys (line 93 comment). The actual issue may be about a different deploy process or an older version of the script.
**Fix:** Verify with the user whether the TODO refers to a different script or an outdated concern. If it's the main `deploy-docker.sh`, that script uses `--exclude='.env*'` on line 299 already.
**Confidence:** HIGH

## F6: Control route group could merge into dashboard admin [MEDIUM/MEDIUM]

**Files:** `src/app/(control)/layout.tsx`, `src/app/(control)/control/page.tsx`
**Description:** The control route group has only 2 pages (`/control` and `/control/discussions`). The control home page just links to dashboard admin pages. The discussions moderation page could live under `/dashboard/admin/discussions` or `/dashboard/community/moderation`. Having a separate route group with its own layout, nav component (`ControlNav`), and i18n namespace (`controlShell`) adds maintenance burden for 2 pages.
**Fix:** As Phase 3/4 of workspace-to-public migration, consider merging `/control` routes into the dashboard layout. Add a "Moderation" item to the admin sidebar with `community.moderate` capability check.
**Confidence:** MEDIUM

## F7: `compiler:` localStorage prefix in sign-out cleanup is dashboard-only [LOW/MEDIUM]

**Files:** `src/lib/auth/sign-out.ts:23`
**Description:** The `compiler:` prefix in `APP_STORAGE_PREFIXES` references `src/app/(dashboard)/dashboard/compiler/compiler-client.tsx`. After the playground migration (Phase 4), the compiler client will be used from the public playground page. The comment should be updated to reflect both locations.
**Fix:** Update the comment to reference the public playground path after migration.
**Confidence:** LOW
