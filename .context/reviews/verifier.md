# Verifier Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** verifier
**Base commit:** 63557cc2

## V-1: Verify `code-editor.tsx` hardcoded English strings — CONFIRMED [MEDIUM/MEDIUM]

**File verified:** `src/components/code/code-editor.tsx:96-97,107,113-114,117`

**Evidence:** Read the file directly. Five hardcoded English strings confirmed:
- Line 96: `title="Fullscreen (F) · Exit (Esc)"`
- Line 97: `aria-label="Fullscreen (F)"`
- Line 107: `{props.language ?? "Code Editor"}`
- Line 113: `title="Exit fullscreen (Esc)"`
- Line 114: `aria-label="Exit fullscreen (Esc)"`
- Line 117: `<span>Exit</span>`

These are the last remaining hardcoded English strings in the codebase.

---

## V-2: Verify cycle-26/27/28 fixes — ALL VERIFIED

- AGG-1 (double `.json()` in assignment-form, create-group, create-problem-form): Verified — all use "parse once, then branch"
- AGG-2 (compiler-client i18n): Verified — uses `t("networkError")` for inline display
- AGG-3 (handleResetAccountPassword fetchAll): Verified at line 298
- AGG-4 (quick-stats typeof): Verified — `typeof x === "number" && Number.isFinite(x)` pattern
- localStorage try/catch in compiler-client: Verified at line 188
- localStorage try/catch in submission-detail-client: Verified at line 94
- console.error gating (14 components): Verified — all use `process.env.NODE_ENV === "development"`
- admin-config double .json(): Verified — uses "parse once" pattern
- bulk-create err.message truncation: Verified — `err.message.slice(0, 120)`
- normalizePage parseInt + upper bound: Verified — `parseInt(value, 10)` and `MAX_PAGE = 10000`
- comment-section GET error feedback: Verified — `else { toast.error(tComments("loadError")); }`
- discussion-thread-moderation-controls optimistic state: Verified — `useState(isLockedProp)` and `useState(isPinnedProp)`
- contest-join uses apiFetchJson: Verified at line 38
- recruiting-invitations AbortController: Verified at lines 122-126

---

## V-3: `contest-replay.tsx` setInterval — still present [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:77`

Verified that `setInterval` is still used. This has been deferred for 3 cycles (AGG-5 from cycle 26).

**Fix:** Replace with recursive `setTimeout` when capacity allows.
