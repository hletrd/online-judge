# Cycle 24 Aggregate Review

**Date:** 2026-04-20
**Base commit:** 2af713d3
**Review artifacts:** `cycle-24-code-reviewer.md`, `cycle-24-security-reviewer.md`, `cycle-24-critic.md`, `cycle-24-architect.md`, `cycle-24-verifier.md`, `cycle-24-test-engineer.md`, `cycle-24-debugger.md`, `cycle-24-perf-reviewer.md`, `cycle-24-designer.md`, `cycle-24-tracer.md`, `cycle-24-document-specialist.md`

## Deduped Findings (sorted by severity then signal)

### AGG-1: Contest detail page still links to `/workspace` with stale "Open workspace" label — workspace-to-public migration is incomplete [HIGH/HIGH]

**Flagged by:** code-reviewer (CR-1), security-reviewer (SEC-1), critic (CRI-1), architect (ARCH-1), verifier (V-1), debugger (DBG-1), perf-reviewer (PERF-1), designer (DES-2), tracer (TR-1), document-specialist (DOC-1)
**Files:** `src/app/(public)/contests/[id]/page.tsx:236-237`, `src/app/(public)/_components/public-contest-detail.tsx:58-59,92-93,117-118`, `messages/en.json:2901`, `messages/ko.json:2901`
**Description:** The public contest detail page passes `workspaceHref={buildLocalePath("/workspace", locale)}` and `workspaceLabel={t("contests.openWorkspace")}` to `PublicContestDetail`. While `next.config.ts` has a redirect from `/workspace` to `/dashboard`, this creates multiple problems:
1. **UX inconsistency:** The nav says "Dashboard" but the contest page says "Open workspace"
2. **Unnecessary redirect:** Every click incurs a 302 redirect hop adding latency
3. **Back button trap:** Pressing "back" from `/dashboard` goes to `/workspace` which redirects forward again
4. **Stale i18n:** The key `contests.openWorkspace` ("Open workspace" / "워크스페이스 열기") references a deprecated concept
5. **Incomplete migration:** The workspace-to-public migration replaced workspace terminology everywhere else
**Concrete failure scenario:** A user viewing a public contest page clicks "Open workspace" and is redirected via 302 to `/dashboard`. The button label still says "workspace" but the destination is "dashboard".
**Fix:**
1. Change `workspaceHref` to `buildLocalePath("/dashboard", locale)` in the contest page
2. Rename the props from `workspaceHref`/`workspaceLabel` to `dashboardHref`/`dashboardLabel` in `PublicContestDetail`
3. Rename i18n key `contests.openWorkspace` to `contests.openDashboard` with values "Open dashboard" / "대시보드 열기"
4. Update the component to use the new prop names

### AGG-2: robots.ts still disallows stale `/workspace` route [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-2), critic (CRI-1), verifier (V-2), debugger (DBG-2), tracer (TR-2), document-specialist (DOC-2)
**Files:** `src/app/robots.ts:17`
**Description:** The robots.txt disallow list includes `"/workspace"` but the `/workspace` route no longer exists as a real page — it only redirects to `/dashboard` which is already disallowed. The entry is dead code.
**Concrete failure scenario:** Crawlers see a disallow for a dead route. Developers reading robots.ts may think `/workspace` is still an active route.
**Fix:** Remove `"/workspace"` from the disallow list.

### AGG-3: `public-route-seo.ts` still references `/workspace` [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-4), critic (CRI-1), architect (ARCH-1), debugger (DBG-2)
**Files:** `src/lib/public-route-seo.ts:107`
**Description:** The SEO route classification function includes `/workspace` in its route list. Since `/workspace` is now redirect-only, classifying it for SEO purposes is meaningless.
**Concrete failure scenario:** The function may waste processing on a route that no longer serves content.
**Fix:** Remove `/workspace` from the route classification list.

### AGG-4: Korean letter-spacing violations in multiple components [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-3), designer (DES-1)
**Files:**
- `src/app/(public)/_components/public-home-page.tsx:67` — `tracking-[0.2em]` on `{eyebrow}` (can be Korean)
- `src/app/(dashboard)/dashboard/_components/dashboard-judge-system-tabs.tsx:88` — `tracking-[0.16em]` on `{featuredEnvironmentsTitle}` (can be Korean)
- `src/components/layout/active-timed-assignment-sidebar-panel.tsx:118,132,138,146` — tracking on labels rendered via `tNav()` (Korean when locale is ko)
- `src/app/(public)/languages/page.tsx:69,75,81,86,90,95` — `tracking-wide` on column headers (Korean when locale is ko)
- `src/app/(public)/_components/public-contest-list.tsx:118` — `tracking-wide` on `{groupLabel}` (can be Korean)
- `src/app/(dashboard)/dashboard/admin/settings/home-page-content-form.tsx:153` — `tracking-wide` on label text
- `src/app/not-found.tsx:59` — `tracking-tight` on h1 that renders Korean text
- `src/app/(public)/_components/public-home-page.tsx:68,87,108,116,138` — `tracking-tight` on headings that may contain Korean

**Description:** Per CLAUDE.md: "Keep Korean text at the browser/font default letter spacing. Do not apply custom `letter-spacing` (or `tracking-*` Tailwind utilities) to Korean content." The `AppSidebar` and `PublicHeader` correctly use locale-conditional tracking, but many other components apply hardcoded tracking to text that may be Korean.
**Concrete failure scenario:** Korean users see inconsistent letter spacing across the app — cramped or over-spaced text in headings, labels, and sidebar items.
**Fix:** Apply the locale-conditional pattern (`locale !== "ko" ? " tracking-wider" : ""`) to all affected locations. For `tracking-tight` on headings that contain Korean text, remove it or make it locale-conditional. For `tracking-[0.Xem]` on uppercase English-only text (like "404"), add a comment explaining it's Latin-only.

## Verified Safe / No Regression Found

- `(control)` route group has been fully removed from the codebase.
- `controlShell` i18n namespace has been fully removed from both locale files.
- `ControlNav` component has been removed.
- `PaginationControls` is a synchronous client component (cycle 22 fix confirmed).
- Admin discussions page at `/dashboard/admin/discussions` correctly checks `canModerateDiscussions`.
- `AppSidebar` shows discussion moderation link for users with `community.moderate` capability.
- `next.config.ts` correctly has `/control` and `/control/discussions` redirects.
- No `console.log` calls in production source code.
- Only 3 `eslint-disable` / `@ts-ignore` usages found, all with legitimate justification comments.

## Agent Failures

None. All requested review perspectives completed successfully.
