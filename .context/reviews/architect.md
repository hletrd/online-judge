# Architecture Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** architect
**Base commit:** 63557cc2

## Previously Fixed Items (Verified)

- Double `.json()` anti-pattern migration: Complete — all known instances migrated
- handleResetAccountPassword fetchAll: Fixed
- normalizePage upper bound: Fixed
- comment-section GET error feedback: Fixed
- discussion-thread-moderation-controls optimistic state: Fixed

## ARCH-1: `code-editor.tsx` fullscreen buttons bypass the i18n system [MEDIUM/MEDIUM]

**File:** `src/components/code/code-editor.tsx:96-97,107,113-114`

The code editor component uses hardcoded English strings for accessibility attributes (`title`, `aria-label`) and the language fallback label. This is an architectural inconsistency — all other components in the codebase use i18n keys for user-facing strings. The code editor is the only component that hardcodes strings.

The `CodeEditor` component does not currently accept translation props or use `useTranslations`, so adding i18n support requires either:
1. Adding i18n props to the component (consistent with how `ContestReplay` receives label props)
2. Using `useTranslations` inside the component (consistent with how `CompilerClient` does it)

**Fix:** Add `useTranslations` calls or pass label props for the fullscreen/exit buttons and the "Code Editor" fallback.

---

## ARCH-2: Duplicated visibility-aware polling pattern across components [LOW/LOW]

**Files:**
- `src/components/contest/contest-announcements.tsx`
- `src/components/contest/contest-clarifications.tsx`
- `src/hooks/use-visibility-polling.ts`

Carried from prior cycles. The `useVisibilityPolling` hook has been extracted and is now used by `contest-quick-stats`, `contest-clarifications`, and `submission-overview`. However, `contest-announcements` and `participant-anti-cheat-timeline` may still have inline implementations.

**Fix:** Verify remaining components use `useVisibilityPolling` and migrate any that don't.

---

## Verified Safe / No Issue

- Route group structure is clean
- Navigation centralized via shared helpers
- Capability-based filtering consistent between PublicHeader and AppSidebar
- Proxy middleware properly handles auth, CSP, locale, cache headers
- i18n well-structured with proper locale resolution
- Workspace-to-public migration complete
