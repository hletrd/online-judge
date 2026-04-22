# UI/UX Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** designer
**Base commit:** b3147a98

## Findings

### DES-1: `admin-config.tsx` test connection button gives no feedback for non-JSON server errors [MEDIUM/MEDIUM]

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:86-106`

**Description:** The `handleTestConnection` function calls `response.json()` without checking `response.ok` first. When the test-connection endpoint returns a non-JSON error (e.g., 502 from proxy), SyntaxError is thrown and the catch on line 101 shows "Network error". The admin sees "Network error" when the actual problem might be an invalid API key or a proxy issue. This is confusing UX — the error message is misleading.

**Fix:** Check `response.ok` before `.json()`. On error, extract the server's error message. Show a specific error message (e.g., "Server error" vs "Network error" vs "Invalid API key").

**Confidence:** HIGH

---

### DES-2: `bulk-create-dialog.tsx` shows generic "Error" on API failure — no actionable feedback for partial results [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/admin/users/bulk-create-dialog.tsx:212-227`

**Description:** When the bulk creation API returns a non-JSON error, the admin sees a generic error toast. For bulk operations, the admin needs to know which users were created and which failed. The current error handling does not provide this information for non-JSON errors.

**Fix:** Improve error messaging for bulk operations to indicate partial success or suggest checking the user list.

**Confidence:** LOW

---

### DES-3: `chat-widget.tsx` error messages are hardcoded English strings, not i18n keys [LOW/LOW]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:170-171`

**Description:** The error messages "rateLimit" and "errorGeneric" appear to be i18n keys from `t("errorRateLimit")` and `t("errorGeneric")`, which is correct. However, the `admin-config.tsx` test result on line 102 shows the hardcoded string "Network error" instead of using an i18n key.

**Fix:** Use an i18n key for the "Network error" string in `admin-config.tsx`.

**Confidence:** LOW

---

## Final Sweep

The UI components generally follow the project's design system with consistent use of Select, Button, Dialog, and Card components. The accepted solutions page has proper loading and empty states. The submission detail page has proper accessibility with `aria-live="polite"` on the status badges. The main UX gaps are in error messaging consistency for admin operations.
