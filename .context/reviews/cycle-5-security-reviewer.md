# Security Reviewer — RPF Cycle 5

**Reviewer:** security-reviewer
**Base commit:** 00002346
**Date:** 2026-04-22

## Findings

### SEC-1: `discussion-post-delete-button.tsx` — `.json()` on potentially non-JSON error body [MEDIUM/MEDIUM]

**File:** `src/components/discussions/discussion-post-delete-button.tsx:25`
**Confidence:** HIGH

Same class of `.json()` before `response.ok` issue. On a 502 with HTML body, `response.json()` throws SyntaxError. The error message leaks raw SyntaxError text to the user via the toast. While not a direct security vulnerability, it can reveal internal infrastructure details (e.g., proxy error pages containing server names).

**Fix:** Check `response.ok` first, use `.json().catch(() => ({}))`.

---

### SEC-2: `start-exam-button.tsx` — `.json()` on error path leaks server details [MEDIUM/MEDIUM]

**File:** `src/components/exam/start-exam-button.tsx:41`
**Confidence:** HIGH

Same pattern as SEC-1 but in exam session flow. A non-JSON error body could expose internal server details through the thrown error message that gets displayed in a toast.

**Fix:** Check `response.ok` first, use `.json().catch(() => ({}))`.

---

### SEC-3: `recruiting-invitations-panel.tsx` — `window.location.origin` for invitation URL construction [LOW/MEDIUM]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:97`
**Confidence:** HIGH

Using client-side `window.location.origin` to construct invitation URLs. If the app is behind a reverse proxy, the origin may not match the actual public URL. This could generate invalid invitation links. Same class as DEFER-24.

**Fix:** Use server-provided `appUrl` config value when available.

---

### SEC-4: `access-code-manager.tsx` — `window.location.origin` for invitation URL [LOW/MEDIUM]

**File:** `src/components/contest/access-code-manager.tsx:134`
**Confidence:** HIGH

Same as SEC-3 but in access-code-manager. Already tracked as DEFER-24. Noting the additional file.

---

### SEC-5: `recruiting-invitations-panel.tsx` — `handleRevoke`/`handleDelete` lack CSRF error handling [LOW/LOW]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:229-281`
**Confidence:** LOW

These mutation handlers call `apiFetch` without try/catch. If the CSRF token (`X-Requested-With` header added by `apiFetch`) is stripped by a misconfigured proxy, the request will fail with a 403 but there's no error feedback. The user sees no indication the action failed.

**Fix:** Wrap in try/catch with error toast.

## Summary

5 findings: 2 MEDIUM/MEDIUM, 2 LOW/MEDIUM (window.location.origin), 1 LOW/LOW.
