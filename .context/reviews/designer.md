# UI/UX Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** designer
**Base commit:** 63557cc2

## Previously Fixed Items (Verified)

- AGG-1 (localStorage crashes): Fixed
- AGG-2 (clarifications userId): Deferred (requires backend change)
- AGG-3 (compiler defaultValue): Fixed (removed)
- Error boundary gating: Fixed
- comment-section error feedback: Fixed

## DES-1: `code-editor.tsx` hardcoded English strings — accessibility and i18n violation [MEDIUM/MEDIUM]

**File:** `src/components/code/code-editor.tsx:96-97,107,113-114,117`

The code editor has 5 hardcoded English strings in user-facing positions:
1. `title="Fullscreen (F) · Exit (Esc)"` — tooltip
2. `aria-label="Fullscreen (F)"` — screen reader label
3. `{props.language ?? "Code Editor"}` — visible text in fullscreen mode
4. `title="Exit fullscreen (Esc)"` — tooltip
5. `aria-label="Exit fullscreen (Esc)"` — screen reader label
6. `<span>Exit</span>` — visible button text at line 117

**Impact:** Korean screen reader users hear English labels. The "Exit" button text at line 117 is particularly visible — it's not hidden or icon-only.

**Concrete scenario:** A Korean user with a visual impairment uses a screen reader to navigate the code editor. The fullscreen button is announced as "Fullscreen (F)" instead of the Korean equivalent.

**Fix:** Add i18n keys and use `t()` or accept i18n props for these strings.

---

## DES-2: Contest clarifications still show "askedByOther" instead of username [LOW/MEDIUM]

**File:** `src/components/contest/contest-clarifications.tsx:249`

The component now uses `t("askedByOther")` (a generic label) instead of showing the raw `userId`. This is an improvement over the previous behavior (showing UUIDs). However, the UX is still suboptimal — users cannot identify who asked a question. The fix requires a backend API change to include `userName`.

**Fix:** Deferred (DEFER-20) — requires backend change.

---

## Verified Safe / No Issue

- Korean letter-spacing compliance thorough
- PublicHeader mobile menu has proper focus trap and Escape to close
- Screen reader announcements for menu state
- All interactive elements in recruiting panel have proper aria-label
- Lecture toolbar has proper aria-label for all buttons
- Sidebar admin section has locale-conditional tracking
