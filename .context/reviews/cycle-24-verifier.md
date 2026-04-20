# Verifier — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## V-1: Contest detail "Open workspace" link does not go to the intended destination [HIGH/HIGH]

**Files:** `src/app/(public)/contests/[id]/page.tsx:236`, `src/app/(public)/_components/public-contest-detail.tsx:117-118`
**Description:** The contest detail page has a button labeled "Open workspace" that links to `/workspace`. The `/workspace` route performs a 302 redirect to `/dashboard`. Verification: the `next.config.ts` redirect table confirms `source: "/workspace" destination: "/dashboard" permanent: false`. The button's intended behavior is to take the user to the dashboard, but it uses an intermediate redirect. This is both a correctness issue (stale route reference) and a performance issue (extra redirect hop).
**Evidence:**
- `next.config.ts:19-23` confirms the `/workspace` -> `/dashboard` redirect
- `src/app/(public)/contests/[id]/page.tsx:236` builds a link to `/workspace`
- `messages/en.json:2901` has `"openWorkspace": "Open workspace"`
**Concrete failure scenario:** User clicks "Open workspace", browser makes request to `/workspace`, server returns 302 to `/dashboard`, browser loads `/dashboard`. The label still says "workspace" but the destination is "dashboard".
**Fix:** Change the link target to `/dashboard` directly and update the i18n key.

## V-2: robots.ts disallow list contains stale `/workspace` entry [MEDIUM/HIGH]

**Files:** `src/app/robots.ts:17`
**Description:** The robots.txt disallow list includes `"/workspace"` but the `/workspace` route no longer exists as a real page — it only redirects to `/dashboard`. The `/dashboard` entry already covers the actual destination. The `/workspace` entry is verifiably dead.
**Evidence:** `src/app/robots.ts:17` shows `"/workspace"` in the disallow array. `next.config.ts:19-23` shows the redirect. No route handler exists for `/workspace`.
**Fix:** Remove `"/workspace"` from the disallow list.

---

## Verified Safe

- `/control` redirect in next.config.ts works correctly.
- `/control/discussions` redirect in next.config.ts works correctly.
- Admin discussions page at `/dashboard/admin/discussions` correctly checks `canModerateDiscussions`.
- `AppSidebar` shows discussion moderation link for users with `community.moderate` capability.
