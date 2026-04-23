# Code Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** code-reviewer
**Base commit:** 63557cc2

## Previously Fixed Items (Verified)

All cycle-26/27 aggregate findings have been addressed:
- AGG-1 (double `.json()` in 3 files): Fixed
- AGG-2 (compiler-client raw error): Fixed — uses i18n key
- AGG-3 (handleResetAccountPassword fetchAll): Fixed
- AGG-4 (quick-stats redundant `!`): Fixed
- localStorage try/catch in compiler-client and submission-detail-client: Fixed
- console.error gating (14 components): Fixed
- admin-config double `.json()`: Fixed
- bulk-create raw err.message: Fixed (truncated)
- comment-section GET error feedback: Fixed
- normalizePage parseInt + upper bound: Fixed
- discussion-thread-moderation-controls optimistic state: Fixed

## CR-1: `code-editor.tsx` hardcoded English strings in aria-label and title [MEDIUM/MEDIUM]

**File:** `src/components/code/code-editor.tsx:96-97,107,113-114`

The fullscreen button and exit button use hardcoded English strings:
- Line 96: `title="Fullscreen (F) · Exit (Esc)"`
- Line 97: `aria-label="Fullscreen (F)"`
- Line 107: `{props.language ?? "Code Editor"}` — hardcoded fallback
- Line 113: `title="Exit fullscreen (Esc)"`
- Line 114: `aria-label="Exit fullscreen (Esc)"`

This is inconsistent with the rest of the codebase, which uses i18n keys for all user-visible strings including accessibility attributes. Korean users accessing these buttons via screen readers will hear English labels.

**Concrete scenario:** A Korean user using a screen reader navigates to the fullscreen button and hears "Fullscreen (F)" instead of the Korean translation.

**Fix:** Add i18n keys for these strings and use `t()` calls, or accept the hardcoded keyboard shortcut labels as locale-independent (the `F` and `Esc` key names are universal).

---

## CR-2: `edit-group-dialog.tsx` getErrorMessage lacks SyntaxError guard [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/groups/edit-group-dialog.tsx:52-70`

The `getErrorMessage` function switches on `error.message`. While the default case now correctly returns `tCommon("error")`, a `SyntaxError` from a failed `.json()` parse would match the default case rather than being explicitly handled. Other `getErrorMessage` functions in the codebase (e.g., `create-problem-form.tsx`) have the same pattern but with a broader set of known error codes.

The real concern is at line 92: `throw new Error((errorBody as { error?: string }).error || "updateError")` — this throws with the raw API error string. If the API returns an unexpected error code like `"SyntaxError"` or `"internal_server_error"`, the `getErrorMessage` switch won't match it, and the user sees `tCommon("error")` which is correct. But the thrown `Error.message` contains the raw API string, which is fine since it's only used for matching.

**Fix:** This is already safe (the default case returns `tCommon("error")`). No action required beyond documentation.

---

## CR-3: `contest-join-client.tsx` error handling chain could be cleaner [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/contests/join/contest-join-client.tsx:48-51`

After `apiFetchJson` returns `!ok`, line 49 extracts the error: `(payload as { error?: string }).error ?? "joinFailed"` and throws it as `new Error(errorMessage)`. The catch block on line 66-69 catches this and shows `t("joinFailed")`. The thrown Error's message is never shown to the user, so this is safe. However, the `apiFetchJson` helper already returns `{ ok, data }` — the error code could be checked directly without the intermediate `throw new Error`.

**Fix:** Low priority — the current pattern is functional and safe. Could be simplified to check `payload.error` directly for specific error codes (like `alreadyEnrolled`).

---

## Verified Safe / No Issue

- All `.json()` patterns now follow "parse once, then branch" or use `apiFetchJson`
- `localStorage` write operations all have try/catch guards
- `console.error` calls all gated behind `process.env.NODE_ENV === "development"`
- Error boundary `console.error` calls properly gated
- Korean letter-spacing compliance maintained
- No `as any`, `@ts-ignore`, or `@ts-expect-error` in production code
- No silently swallowed catch blocks
