# Cycle 27 Designer (UI/UX)

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### DES-1: Recruit page deadline date formatting ignores user locale [LOW/MEDIUM]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:218`
**Description:** The deadline is displayed using `new Date(assignment.deadline).toLocaleString()` which formats according to the server's locale, not the user's. The app supports Korean and English locales via next-intl, but this specific date rendering bypasses the i18n system.
**Failure scenario:** Korean users see "4/20/2026, 11:00:00 PM" instead of "2026. 4. 20. 오후 11:00:00".
**Fix:** Use the next-intl date formatting utility or `@/lib/datetime` module.
**Confidence:** MEDIUM

### DES-2: Recruit page not-found card has no illustration or guidance [LOW/LOW]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:68-76`
**Description:** When the invitation is invalid, expired, or revoked, the page shows a bare `Card` with just a title and description. Adding a simple illustration or a "Contact your instructor" link would improve the UX for candidates who land on an invalid link.
**Failure scenario:** Candidates who receive an expired/invalid link see a stark error message with no guidance.
**Fix:** Add a link to the support contact or contest list page. Low priority.
**Confidence:** LOW

## Verified Safe

- Korean letter-spacing is properly locale-conditional throughout the codebase.
- Access code input tracking has proper documentation comment (cycle 26 fix).
- All interactive elements have proper ARIA attributes.
- Color contrast is adequate (dark/light mode support via next-themes).
