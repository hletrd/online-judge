# RPF Cycle 20 — Security Reviewer

**Date:** 2026-04-22
**Base commit:** 4182e529

## Findings

### SEC-1: `create-group-dialog.tsx:74` — Unguarded `.json()` allows SyntaxError to bypass error handling [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:74`

**Description:** After `response.ok`, `response.json()` is called without `.catch()`. A non-JSON 200 response throws SyntaxError. While not a direct security vulnerability, the crash can mask an attack where a MITM or compromised CDN injects HTML responses. The code does handle SyntaxError in the catch block (line 44 checks `error instanceof SyntaxError`), but this is fragile — if the error handling changes, the server error string could leak.

**Fix:** Add `.catch()` to the `.json()` call per the codebase convention.

---

### SEC-2: `admin-config.tsx:103` — Unguarded `.json()` on test-connection success path [MEDIUM/MEDIUM]

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:103`

**Description:** Same pattern as SEC-1. The test-connection endpoint hits external AI provider APIs. If a proxy returns HTML, the unguarded `.json()` throws. The error message from the catch block may expose partial response content to the admin user.

**Fix:** Add `.catch()` or use `apiFetchJson`.

---

### SEC-3: `providers.ts` — AI provider API responses parsed without `.catch()` [LOW/MEDIUM]

**Files:**
- `src/lib/plugins/chat-widget/providers.ts:138` (OpenAI)
- `src/lib/plugins/chat-widget/providers.ts:258` (Claude)
- `src/lib/plugins/chat-widget/providers.ts:398` (Gemini)

**Description:** All three AI provider `chatWithTools` implementations parse `response.json()` without `.catch()` after checking `response.ok`. These are server-to-server calls to known AI APIs, so the risk is lower. However, CDN/WAF intermediaries (Cloudflare, etc.) can inject HTML error pages that would cause SyntaxError.

**Fix:** Wrap in `.catch(() => ({}))`.

---

### SEC-4: `comment-section.tsx:45` — GET path `.json()` without `.catch()` [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/submissions/[id]/_components/comment-section.tsx:45`

**Description:** The comment fetch calls `response.json()` after `response.ok` without `.catch()`. Same anti-pattern as SEC-1/SEC-2 but for a read-only GET. Lower severity since no sensitive data is sent.

**Fix:** Add `.catch(() => ({ data: [] }))`.

---

### SEC-5: `invite-participants.tsx:89` — Server error key checked against whitelist, but no logging for unexpected keys [LOW/LOW]

**File:** `src/components/contest/invite-participants.tsx:89`

**Description:** The error handling correctly maps `userNotFound` to a localized label and uses a safe fallback for all other errors. However, unexpected error keys are silently swallowed without logging. This could hide server-side issues during incident response.

**Fix:** Add `console.error("Invite failed:", data.error)` before the toast.

---

## Verified Safe (No Issue Found)

- HTML sanitization uses DOMPurify with strict allowlists (LEGACY_HTML_ALLOWED_TAGS, LEGACY_HTML_ALLOWED_ATTR)
- `safeJsonForScript` properly escapes `</script` and `<!--` sequences for JSON-LD embedding
- `sanitizeMarkdown` strips null bytes and control characters
- Image src attributes restricted to root-relative paths only
- URI regexp in DOMPurify only allows `https:`, `mailto:`, and root-relative paths
- CSRF protection via `X-Requested-With: XMLHttpRequest` header on all `apiFetch` calls
- Auth tokens (`RUNNER_AUTH_TOKEN`, `RATE_LIMITER_AUTH_TOKEN`) sent only over server-to-server fetch calls
- API keys for AI providers are handled via `type="password"` inputs
- Encryption key is validated in production (`src/lib/security/encryption.ts:33`)
- No `as any`, `@ts-ignore`, or `@ts-expect-error` usage
- No raw server error strings leaked to users (previous cycle fixes confirmed working)
