# Designer Review — Cycle 2

**Base commit:** b91dac5b
**Reviewer:** designer (UI/UX)

## F1 — Public header has no skip-to-content link in mobile view
- **Severity:** LOW | **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx`
- The desktop view has a `PublicHeader` component with navigation, but the mobile hamburger menu opens a panel with no skip-to-content link. Users on mobile who rely on keyboard navigation must tab through all menu items to reach main content.
- **Fix:** Add a visually hidden skip-to-content link at the top of the header (similar to the existing `SkipToContent` component).

## F2 — Languages page has no system info card (user TODO #4)
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/app/(public)/languages/page.tsx`
- The languages page shows language variants and commands but does not display the grading server hardware/OS info. Users need to know what environment their code runs on. The `src/lib/system-info.ts` module already provides `getRuntimeSystemInfo()` which detects CPU, architecture, and OS.
- **Fix:** Add a "Grading Environment" card above the language table that displays the system info from `getRuntimeSystemInfo()`.

## F3 — Workspace sidebar uses custom letter-spacing that may affect Korean text
- **Severity:** LOW | **Confidence:** LOW
- **File:** `src/components/layout/workspace-nav.tsx:31`
- `tracking-[0.18em]` is applied to the section label. This is a short uppercase label ("WORKSPACE" / Korean equivalent) so the impact is minimal, but it violates the CLAUDE.md rule against custom letter-spacing on Korean text.
- **Fix:** Verify the section label is always in English/uppercase (likely safe). If it can be Korean, remove the tracking utility.

## F4 — Rankings page tier badges could benefit from color contrast improvement
- **Severity:** LOW | **Confidence:** LOW
- **File:** `src/app/(public)/rankings/page.tsx:260-262`
- Tier badges are rendered next to usernames. The visual hierarchy could be improved with more distinct colors per tier level.
- **Fix:** Low priority visual polish.

## F5 — Practice page search form has no loading state
- **Severity:** LOW | **Confidence:** MEDIUM
- **File:** `src/app/(public)/practice/page.tsx:561-629`
- The search/filter form uses a standard HTML form submit with no loading indicator. Server-side rendering means the page reloads on filter, but there is no visual feedback during the load.
- **Fix:** Add a loading state or use `useTransition` for client-side filter changes.
