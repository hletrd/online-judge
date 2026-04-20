# Designer — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## DES-1: Korean letter-spacing violations across multiple components [MEDIUM/MEDIUM]

**Files:** See CR-3 in code-reviewer review for the full list.
**Description:** The CLAUDE.md typography rule states: "Keep Korean text at the browser/font default letter spacing. Do not apply custom `letter-spacing` (or `tracking-*` Tailwind utilities) to Korean content." This rule is correctly implemented in `AppSidebar` (line 270) and `PublicHeader` (line 302) using the pattern `locale !== "ko" ? " tracking-wider" : ""`. However, the following components still apply hardcoded tracking to text that may contain Korean characters:

1. **`public-home-page.tsx:67`** — `tracking-[0.2em]` on `{eyebrow}` — this is a dynamic string that can be Korean
2. **`not-found.tsx:58`** — `tracking-[0.2em]` on "404" — this is always numeric, so it's safe, but the h1 on line 59 uses `tracking-tight` on Korean text
3. **`dashboard-judge-system-tabs.tsx:88`** — `tracking-[0.16em]` on `{featuredEnvironmentsTitle}` — can be Korean
4. **`active-timed-assignment-sidebar-panel.tsx:118,132,138,146`** — tracking on labels that render Korean via `tNav()`
5. **`languages/page.tsx:69,75,81,86,90,95`** — `tracking-wide` on column headers that render Korean
6. **`public-contest-list.tsx:118`** — `tracking-wide` on `{groupLabel}` — can be Korean
7. **`home-page-content-form.tsx:153`** — `tracking-wide` on label text
8. **`contest-join-client.tsx:102`** — `tracking-[0.35em]` on access code input — this is font-mono for code entry, so likely acceptable

**Concrete failure scenario:** Korean users see inconsistent letter spacing across the app — some labels correctly use default spacing, others are cramped or over-spaced.
**Fix:** Apply the same locale-conditional pattern used in `AppSidebar` and `PublicHeader` to all affected locations. For `tracking-tight` on headings that contain Korean text, either remove it or make it locale-conditional.

## DES-2: "Open workspace" button label is semantically misleading after migration [MEDIUM/HIGH]

**Files:** `src/app/(public)/_components/public-contest-detail.tsx:117-118`, `messages/en.json:2901`, `messages/ko.json:2901`
**Description:** The contest detail page has a button labeled "Open workspace" / "워크스페이스 열기" that links to `/workspace` (which redirects to `/dashboard`). After the workspace-to-public migration, the "workspace" terminology is deprecated. The button should use "dashboard" terminology instead.
**Concrete failure scenario:** Users see inconsistent terminology — the nav says "Dashboard" but the contest page says "Open workspace".
**Fix:** Update the i18n key `contests.openWorkspace` to `contests.openDashboard` with values "Open dashboard" / "대시보드 열기" and update the component props.

---

## Verified Safe

- The `AppSidebar` administration section label correctly uses locale-conditional tracking.
- The `PublicHeader` mobile menu correctly uses locale-conditional tracking.
- Dark/light mode is handled by `next-themes`.
