# Security Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** security-reviewer
**Base commit:** f55836d0

## SEC-1: Double `.json()` anti-pattern risks "body already consumed" errors in 3 files [MEDIUM/MEDIUM]

**Files:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:273,277`
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:67,71`
- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx:335,339`

While the current code works because the `throw` prevents the second `.json()`, this error-first pattern creates a latent risk. If a developer refactors the error handling (e.g., replacing `throw` with a state update), the second `.json()` call would throw "body already consumed" at runtime, which is an unhandled exception that bypasses the catch block's error mapping. This would result in a raw error being shown to the user or silently failing.

**Fix:** Migrate to the "parse once, then branch" pattern documented in `apiFetchJson`.

---

## SEC-2: `compiler-client.tsx` catch block leaks raw error message in inline display [LOW/MEDIUM]

**File:** `src/components/code/compiler-client.tsx:292-296`

The catch block uses `err instanceof Error ? err.message : "Network error"` for the inline error display. While the toast correctly uses the i18n key `t("networkError")`, the inline error still shows raw `error.message`. This is inconsistent with the cycle-25 fix that eliminated raw error messages from all `getErrorMessage` default cases.

**Concrete scenario:** A DNS resolution failure produces `TypeError: getaddrinfo ENOTFOUND`. The inline error display shows this raw message.

**Fix:** Use `t("networkError")` for the inline display as well.

---

## SEC-3: Carried findings (unchanged)

- SEC-3: `window.location.origin` for URL construction — covered by DEFER-24
- SEC-4: Encryption plaintext fallback — covered by DEFER-39
- SEC-5: `AUTH_CACHE_TTL_MS` has no upper bound — covered by DEFER-40
- SEC-6: Anti-cheat localStorage persistence — covered by DEFER-48
- SEC-7: `sanitizeHtml` root-relative img src — covered by DEFER-49
