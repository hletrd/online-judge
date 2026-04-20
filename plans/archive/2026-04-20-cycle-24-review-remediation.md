# Cycle 24 Review Remediation Plan

**Date:** 2026-04-20
**Source:** `.context/reviews/cycle-24-aggregate.md`

---

## Scope

This cycle addresses the new cycle-24 findings from the multi-agent review:
- AGG-1: Contest detail page still links to `/workspace` with stale "Open workspace" label
- AGG-2: robots.ts still disallows stale `/workspace` route
- AGG-3: `public-route-seo.ts` still references `/workspace`
- AGG-4: Korean letter-spacing violations in multiple components

No cycle-24 review finding is silently dropped. No new refactor-only work is added under deferred.

---

## Implementation lanes

### H1: Complete workspace-to-dashboard migration on contest detail page (AGG-1)

- **Source:** AGG-1
- **Severity / confidence:** HIGH / HIGH
- **Citations:** `src/app/(public)/contests/[id]/page.tsx:236-237`, `src/app/(public)/_components/public-contest-detail.tsx:58-59,92-93,117-118`, `messages/en.json:2901`, `messages/ko.json:2901`
- **Problem:** The public contest detail page links to `/workspace` (which redirects to `/dashboard`) with a "Open workspace" label. The workspace terminology has been deprecated in favor of "dashboard" across the rest of the app. The redirect creates UX issues (back button trap, unnecessary redirect hop, inconsistent terminology).
- **Plan:**
  1. In `src/app/(public)/contests/[id]/page.tsx`, change `workspaceHref={buildLocalePath("/workspace", locale)}` to `dashboardHref={buildLocalePath("/dashboard", locale)}` and `workspaceLabel={t("contests.openWorkspace")}` to `dashboardLabel={t("contests.openDashboard")}`.
  2. In `src/app/(public)/_components/public-contest-detail.tsx`, rename `workspaceHref`/`workspaceLabel` props to `dashboardHref`/`dashboardLabel` and update all references.
  3. In `messages/en.json`, rename key `contests.openWorkspace` to `contests.openDashboard` with value "Open dashboard".
  4. In `messages/ko.json`, rename key `contests.openWorkspace` to `contests.openDashboard` with value "대시보드 열기".
  5. Update any affected tests.
  6. Verify quality gates pass.
- **Status:** DONE

### M1: Remove stale `/workspace` from robots.ts disallow list (AGG-2)

- **Source:** AGG-2
- **Severity / confidence:** MEDIUM / HIGH
- **Citations:** `src/app/robots.ts:17`
- **Problem:** The robots.txt disallow list includes `"/workspace"` but the `/workspace` route no longer exists as a real page — it only redirects to `/dashboard` which is already disallowed.
- **Plan:**
  1. Remove `"/workspace"` from the disallow array in `src/app/robots.ts`.
  2. Update the robots test to remove the `/workspace` assertion.
- **Status:** DONE

### M2: Remove stale `/workspace` reference from public-route-seo.ts (AGG-3)

- **Source:** AGG-3
- **Severity / confidence:** MEDIUM / MEDIUM
- **Citations:** `src/lib/public-route-seo.ts:107`
- **Problem:** The SEO route classification function includes `/workspace` in its route list. Since `/workspace` is now redirect-only, classifying it for SEO purposes is meaningless.
- **Plan:**
  1. Remove `/workspace` from the route classification list in `src/lib/public-route-seo.ts`.
  2. Verify any affected tests.
- **Status:** DONE (already removed from codebase)

### M3: Fix Korean letter-spacing violations in multiple components (AGG-4)

- **Source:** AGG-4
- **Severity / confidence:** MEDIUM / MEDIUM
- **Citations:** See file list below.
- **Problem:** Per CLAUDE.md, Korean text must use browser/font default letter-spacing. Several components apply hardcoded `tracking-[0.Xem]`, `tracking-wide`, or `tracking-tight` to text that may be Korean, violating this rule.
- **Plan:**

  **Client components (can use `useLocale()`):**
  1. `src/app/(public)/_components/public-home-page.tsx:67` — Make `tracking-[0.2em]` on `{eyebrow}` locale-conditional (eyebrow can be Korean). Also address `tracking-tight` on lines 68, 87, 108, 116, 138 (headings that may contain Korean).
  2. `src/app/(dashboard)/dashboard/_components/dashboard-judge-system-tabs.tsx:88` — Make `tracking-[0.16em]` on `{featuredEnvironmentsTitle}` locale-conditional.
  3. `src/components/layout/active-timed-assignment-sidebar-panel.tsx:118,132,138,146` — Make tracking on labels locale-conditional (they render Korean via `tNav()`).
  4. `src/app/(public)/languages/page.tsx:69,75,81,86,90,95` — Make `tracking-wide` on column headers locale-conditional.
  5. `src/app/(public)/_components/public-contest-list.tsx:118` — Make `tracking-wide` on `{groupLabel}` locale-conditional.
  6. `src/app/(dashboard)/dashboard/admin/settings/home-page-content-form.tsx:153` — Make `tracking-wide` on label locale-conditional.

  **Server components (use `locale` from `getLocale()`):**
  7. `src/app/not-found.tsx:58-59` — Line 58 is "404" (numeric, safe with tracking). Line 59 `tracking-tight` on h1 that renders Korean text — make conditional.

  **Pattern to use:**
  - For `tracking-[0.Xem]` on uppercase English-only text: add a comment `/* Latin/uppercase only */` 
  - For `tracking-wide`/`tracking-wider` on text that may be Korean: use `${locale !== "ko" ? " tracking-wide" : ""}`
  - For `tracking-tight` on headings that may be Korean: use `${locale !== "ko" ? " tracking-tight" : ""}`
  - For `tracking-[0.Xem]` on text that may be Korean: use `${locale !== "ko" ? " tracking-[0.Xem]" : ""}`

- **Status:** DONE

---

## Deferred items

None. Every cycle-24 finding above is planned for implementation in this cycle.

---

## Progress log

- 2026-04-20: Plan created from cycle-24 aggregate review.
- 2026-04-20: H1, M1, M2, M3 all DONE. All cycle-24 findings resolved. Quality gates pass (tsc, eslint, vitest, build).
