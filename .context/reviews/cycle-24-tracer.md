# Tracer — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## TR-1: Workspace-to-dashboard redirect chain traces through contest detail -> /workspace -> 302 -> /dashboard [MEDIUM/HIGH]

**Files:** `src/app/(public)/contests/[id]/page.tsx:236` -> `next.config.ts:19-23` -> `(dashboard)/dashboard/page.tsx`
**Description:** Tracing the user flow: User views contest at `/contests/[id]` -> clicks "Open workspace" button -> browser navigates to `/workspace` -> Next.js redirect middleware returns 302 to `/dashboard` -> browser loads `/dashboard` page. The redirect adds an unnecessary hop and the label is semantically incorrect after the migration.
**Concrete failure scenario:** The redirect chain is visible in browser DevTools and adds ~50-100ms latency per click. The "back" button trap (pressing back goes to `/workspace` which redirects forward again) is a UX regression.
**Fix:** Link directly to `/dashboard` from the contest detail page.

## TR-2: robots.txt /workspace entry traces to a redirect-only route [LOW/MEDIUM]

**Files:** `src/app/robots.ts:17` -> `next.config.ts:19-23`
**Description:** Tracing the robots.txt disallow entry: `"/workspace"` -> no route handler exists -> only a redirect to `/dashboard` exists. The disallow entry is for a route that never serves content.
**Fix:** Remove `/workspace` from robots.txt disallow list.

---

## Verified Safe

- Auth flow traces correctly through proxy middleware.
- CSP nonce traces correctly through the request lifecycle.
