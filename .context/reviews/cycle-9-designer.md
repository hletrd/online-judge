# Cycle 9 Designer (UI/UX) Report

**Reviewer:** designer
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** UI/UX review for Next.js web app

## Inventory of Files Reviewed

- `src/app/(public)/layout.tsx` — Public layout with PublicHeader/PublicFooter
- `src/app/(dashboard)/layout.tsx` — Dashboard layout with AppSidebar
- `src/components/layout/public-header.tsx` — Top navigation component
- `src/components/layout/app-sidebar.tsx` — Dashboard sidebar
- `src/app/(public)/_components/` — Public page components
- `src/app/globals.css` — Global styles
- `src/components/ui/` — UI component library (shadcn-based)
- `messages/` — i18n message files

## Findings

### CR9-D1 — [MEDIUM] Dual navigation paradigm creates inconsistent UX between public and dashboard pages

- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx`, `src/components/layout/app-sidebar.tsx`
- **Evidence:** Public pages use a top navbar (`PublicHeader`) with horizontal navigation. Dashboard pages use a sidebar (`AppSidebar`) with vertical navigation. When a user navigates from a public page to the dashboard, the entire navigation paradigm changes. The "Back to public site" link (added in commit 2bfcbb89) acknowledges this discontinuity but is a workaround.
- **UX impact:** Users lose their navigation context when switching between public and dashboard views. They must learn two different navigation patterns.
- **Suggested fix:** Continue Phase 3 of workspace-to-public migration — make the top navbar visible on dashboard pages and gradually reduce the sidebar's role.

### CR9-D2 — [LOW] No loading skeleton for SSE connection establishment

- **Confidence:** MEDIUM
- **File:** `src/app/(dashboard)/dashboard/submissions/[id]/submission-detail-client.tsx`
- **Evidence:** When a user views a submission detail page, the SSE connection takes a moment to establish and return the initial status. During this time, the page shows either a loading spinner or an empty state. There's no progressive loading indicator showing that the SSE connection is being established.
- **UX impact:** Users may think the page is broken if the SSE connection takes more than 1-2 seconds to establish (e.g., under high load).
- **Suggested fix:** Add a "Connecting..." indicator with a subtle animation while the SSE connection is being established.

### CR9-D3 — [LOW] Korean letter spacing in public header navigation items

- **Confidence:** LOW
- **File:** `src/components/layout/public-header.tsx`
- **Evidence:** Per CLAUDE.md rules, Korean text must not have custom `letter-spacing`. The public header navigation items are in English/Korean depending on locale. Need to verify that the `tracking-*` Tailwind utility is not applied to Korean navigation labels.
- **Suggested fix:** Verify that navigation items use the default letter spacing when the locale is Korean.

## Assessment

The most significant UX issue is the dual navigation paradigm (CR9-D1), which is already tracked in the workspace-to-public migration plan. The SSE loading indicator (CR9-D2) is a minor improvement that would enhance perceived performance.
