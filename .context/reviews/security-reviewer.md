# Security Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** security-reviewer
**Base commit:** 4b9d48f0

## SEC-1: `window.location.origin` for URL construction — carried from DEFER-24 [MEDIUM/MEDIUM]

**Files:**
- `src/components/contest/access-code-manager.tsx:137`
- `src/components/contest/recruiting-invitations-panel.tsx:99`
- `src/app/(dashboard)/dashboard/admin/files/file-management-client.tsx:96`
- `src/app/(dashboard)/dashboard/admin/workers/workers-client.tsx:148`

**Confidence:** HIGH

Four components construct invitation or app URLs using `window.location.origin`. If the app is accessed through a reverse proxy that rewrites the Host header, the origin may differ from the intended public URL. This was previously identified as DEFER-24 (access-code-manager, recruiting-invitations-panel) and remains unfixed. Two additional instances were found: `file-management-client.tsx` (copy URL) and `workers-client.tsx` (deploy command display).

**Fix:** Use a server-provided public URL or a configurable base URL for all external-facing links.

---

## SEC-2: Gemini model name interpolation into URL path — defense-in-depth concern [LOW/MEDIUM]

**File:** `src/app/api/v1/plugins/chat-widget/test-connection/route.ts:127`
**Confidence:** MEDIUM

Carried from cycle 18. The model name is interpolated directly into the URL path. While `SAFE_GEMINI_MODEL_PATTERN` restricts to safe characters, this is a defense-in-depth concern.

**Fix:** Use `URL` constructor and `encodeURIComponent` for the model segment.

---

## SEC-3: Encryption plaintext fallback — carried from cycle 11 [MEDIUM/MEDIUM]

The encryption module falls back to plaintext when encryption keys are not configured. Known deferred item.

---

## Verified Safe

- CSRF protection is consistent across all mutation routes
- `apiFetch` adds `X-Requested-With` header on all requests
- `test-connection/route.ts` properly validates `req.json()` with try/catch (returns 400 on malformed JSON)
- API keys are retrieved from server-side storage, not accepted from request body
- Model name validation patterns prevent path traversal
- No secrets in client-side code
- HTML sanitization uses DOMPurify with strict allowlists
- `safeJsonForScript` escapes `<!--` sequences
- All clipboard operations use the shared `copyToClipboard` utility with proper error handling
- `role-editor-dialog.tsx` error response properly uses `.catch()` on `.json()`
