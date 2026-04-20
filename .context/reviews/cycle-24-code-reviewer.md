# Code Reviewer — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## CR-1: Contest detail page still links to `/workspace` instead of `/dashboard` [HIGH/HIGH]

**Files:** `src/app/(public)/contests/[id]/page.tsx:236`, `src/app/(public)/_components/public-contest-detail.tsx:58-59,92-93,117-118`
**Description:** The public contest detail page passes `workspaceHref={buildLocalePath("/workspace", locale)}` and `workspaceLabel={t("contests.openWorkspace")}` to `PublicContestDetail`. While `next.config.ts` has a redirect from `/workspace` to `/dashboard`, this creates a confusing UX: users click "Open workspace" (a label that references a removed concept), get redirected, and land on the dashboard. The workspace-to-public migration explicitly replaced workspace references everywhere else, but this contest detail link was missed.
**Concrete failure scenario:** A user viewing a public contest page clicks "Open workspace" and is redirected via 302 to `/dashboard`. The button label still says "Open workspace" / "워크스페이스 열기" which references a removed navigation concept.
**Fix:** Change `workspaceHref` to `buildLocalePath("/dashboard", locale)`, rename the prop to `dashboardHref`/`dashboardLabel`, and update the i18n key `contests.openWorkspace` to something like `contests.openDashboard` in both `en.json` and `ko.json`.

## CR-2: `robots.ts` still disallows `/workspace` — stale entry from removed route [MEDIUM/HIGH]

**Files:** `src/app/robots.ts:17`
**Description:** The robots.txt disallow list includes `"/workspace"` but the `/workspace` route no longer exists (it redirects to `/dashboard` which is already in the disallow list). The `/workspace` entry is dead code and misleading.
**Concrete failure scenario:** Crawlers see a disallow for `/workspace` which is a dead route. Developers reading robots.ts may think `/workspace` is still an active route.
**Fix:** Remove `"/workspace"` from the disallow list in `src/app/robots.ts`.

## CR-3: Korean letter-spacing violations in multiple components [MEDIUM/MEDIUM]

**Files:**
- `src/app/not-found.tsx:58` — `tracking-[0.2em]` on "404" text (always numeric, but the component renders Korean content below it; the `tracking-tight` on h1 line 59 also applies to Korean)
- `src/app/(public)/_components/public-home-page.tsx:67` — `tracking-[0.2em]` on `{eyebrow}` which can be Korean text
- `src/app/(dashboard)/dashboard/_components/dashboard-judge-system-tabs.tsx:88` — `tracking-[0.16em]` on `{featuredEnvironmentsTitle}` which can be Korean
- `src/components/layout/active-timed-assignment-sidebar-panel.tsx:118` — `tracking-[0.16em]` on assignment name (Korean content)
- `src/app/(public)/languages/page.tsx:69,75,81,86,90,95` — `tracking-wide` on column headers that render Korean text when locale is Korean
- `src/app/(public)/_components/public-contest-list.tsx:118` — `tracking-wide` on `{groupLabel}` which can be Korean
- `src/app/(dashboard)/dashboard/admin/settings/home-page-content-form.tsx:153` — `tracking-wide` on label text
- `src/components/layout/active-timed-assignment-sidebar-panel.tsx:132,138,146` — `tracking-wide` on "remaining"/"elapsed" labels (these use `tNav()` which returns Korean when locale is ko)

**Description:** Per CLAUDE.md: "Keep Korean text at the browser/font default letter spacing. Do not apply custom `letter-spacing` (or `tracking-*` Tailwind utilities) to Korean content." Several components still apply hardcoded `tracking-[0.2em]`, `tracking-[0.16em]`, or `tracking-wide` to text that may be Korean. The `AppSidebar` and `PublicHeader` correctly use locale-conditional tracking (e.g., `locale !== "ko" ? " tracking-wider" : ""`), but many other components do not.
**Concrete failure scenario:** Korean users see cramped or overly-spaced text in sidebar panel labels, page headings, column headers, and form labels.
**Fix:** Apply the same locale-conditional pattern used in `AppSidebar` and `PublicHeader` to all the above locations. For `tracking-[0.Xem]` on uppercase-only text (like "404" or uppercase English labels), add a comment explaining it's Latin-only. For text that can be Korean, conditionally apply tracking based on locale.

## CR-4: `public-route-seo.ts` still references `/workspace` in SEO disallow list [MEDIUM/MEDIUM]

**Files:** `src/lib/public-route-seo.ts:107`
**Description:** The SEO module that determines which public routes use deterministic locale includes `/workspace` in its disallow/routing logic. Since `/workspace` is now a redirect-only route, this reference is stale.
**Concrete failure scenario:** The module may incorrectly classify or handle requests to `/workspace` in its SEO logic.
**Fix:** Remove the `/workspace` reference from `public-route-seo.ts`.

---

## Verified Safe

- `(control)` route group directory has been fully removed.
- `controlShell` i18n namespace has been fully removed from both locale files.
- `ControlNav` component has been removed.
- `PaginationControls` is a synchronous client component (cycle 22 fix confirmed).
- No remaining `controlShell` references in source code.
- `next.config.ts` correctly has `/control` and `/control/discussions` redirects.
