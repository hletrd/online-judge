# Debugger — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## DBG-1: Contest detail page `/workspace` link creates unnecessary redirect chain [MEDIUM/HIGH]

**Files:** `src/app/(public)/contests/[id]/page.tsx:236`, `src/app/(public)/_components/public-contest-detail.tsx:117-118`
**Description:** When a user clicks "Open workspace" on the contest detail page, the browser navigates to `/workspace`, which triggers a 302 redirect to `/dashboard`. This is an unnecessary redirect hop that adds latency and can cause issues with browser history (the "back" button goes to `/workspace` which redirects forward again). The redirect also means the final URL in the address bar differs from what the user expected based on the button label.
**Concrete failure scenario:** User clicks "Open workspace", waits for redirect, lands on `/dashboard`. Pressing "back" goes to `/workspace` which immediately redirects forward to `/dashboard` again, trapping the user.
**Fix:** Change the link to point directly to `/dashboard` and update the label.

## DBG-2: `public-route-seo.ts` still has `/workspace` in route classification [LOW/MEDIUM]

**Files:** `src/lib/public-route-seo.ts:107`
**Description:** The SEO route classification function still includes `/workspace` in its route list. Since `/workspace` is now redirect-only, classifying it for SEO purposes is meaningless — crawlers following the redirect will index `/dashboard` instead.
**Concrete failure scenario:** The function may waste processing on a route that no longer serves content.
**Fix:** Remove `/workspace` from the route classification list.

---

## Verified Safe

- No runtime errors found in the recently added admin discussions page.
- `canModerateDiscussions` correctly delegates to capability-based checking.
- No `console.log` calls found in production source code.
