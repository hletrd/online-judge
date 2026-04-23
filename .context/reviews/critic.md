# Critic Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** critic
**Base commit:** 63557cc2

## CRI-1: `code-editor.tsx` hardcoded English strings are the last i18n holdout [MEDIUM/MEDIUM]

**File:** `src/components/code/code-editor.tsx:96-97,107,113-114`

The code editor is the only component in the codebase with hardcoded English strings in user-facing positions (title, aria-label, fallback text). The cycle-28 plan (Task 6) identified hardcoded English in `compiler-client.tsx`, but that has been fixed (defaultValue parameters removed). The code-editor.tsx issue is the remaining holdout.

Specific strings:
- `"Fullscreen (F) · Exit (Esc)"` (title attribute)
- `"Fullscreen (F)"` (aria-label)
- `"Code Editor"` (language fallback)
- `"Exit fullscreen (Esc)"` (title and aria-label)
- `"Exit"` (button text at line 117)

**Concrete scenario:** A Korean screen reader user navigates to the code editor fullscreen button and hears English instead of Korean.

**Fix:** Add i18n keys for these 5 strings. The `F` and `Esc` key names are universal keyboard shortcuts and can remain in the localized string as-is (e.g., Korean translation would be "전체 화면 (F)").

---

## CRI-2: `contest-replay.tsx` still uses `setInterval` — carried from cycle 26 [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:77-87`

This has been deferred for 3 cycles. While the impact is LOW, the inconsistency with the codebase convention (recursive `setTimeout`) is a growing maintenance risk.

**Fix:** Replace `setInterval` with recursive `setTimeout`.

---

## Verified Safe / No Issue

- All console.error calls properly gated behind dev check
- All .json() patterns follow "parse once, then branch" convention
- Error handling consistently uses i18n keys for user-facing messages
- localStorage operations all have try/catch
- Korean letter-spacing compliance thorough
