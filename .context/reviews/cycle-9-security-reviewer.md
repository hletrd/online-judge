# Cycle 9 Security Reviewer Report

**Reviewer:** security-reviewer
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** OWASP top 10, secrets, unsafe patterns, auth/authz

## Inventory of Files Reviewed

- `src/lib/auth/config.ts` — Authentication configuration, JWT/session callbacks
- `src/lib/security/encryption.ts` — AES-256-GCM encryption
- `src/lib/security/rate-limit.ts` — Rate limiting
- `src/lib/security/csrf.ts` — CSRF protection
- `src/lib/security/api-rate-limit.ts` — API rate limiting
- `src/lib/security/ip.ts` — IP extraction
- `src/lib/security/password-hash.ts` — Password hashing
- `src/lib/security/password.ts` — Password validation
- `src/lib/security/sanitize-html.ts` — HTML sanitization
- `src/lib/security/env.ts` — Security env validation
- `src/lib/api/auth.ts` — API authentication
- `src/lib/api/handler.ts` — API handler factory with auth/CSRF
- `src/lib/compiler/execute.ts` — Docker sandboxed execution
- `src/lib/realtime/realtime-coordination.ts` — SSE coordination
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE events route
- `src/app/api/v1/playground/run/route.ts` — Playground execution
- `src/app/api/v1/admin/backup/route.ts` — Admin backup
- `src/app/api/v1/admin/restore/route.ts` — Admin restore
- `src/lib/db/export.ts` — Database export with redaction
- `src/lib/plugins/secrets.ts` — Plugin secrets management

## Findings

### CR9-SR1 — [MEDIUM] SSE re-auth check is fire-and-forget; deactivated user can receive one more status event

- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:306-317`
- **Evidence:** The re-auth check is initiated with `void (async () => { ... })()` and does not block the current status event from being emitted. The code comment acknowledges this: "the auth revocation will take effect on the next tick." However, this means a deactivated user receives one additional status event (potentially containing submission data) after their account is disabled.
- **Failure scenario:** An admin disables a user account for security reasons (e.g., compromised account). The user's open SSE connection continues to receive data for one more poll cycle (up to `ssePollIntervalMs` milliseconds). In a high-security environment, this window could be problematic.
- **Suggested fix:** Await the re-auth check before processing the status event. If re-auth fails, close immediately.

### CR9-SR2 — [MEDIUM] `shareAcceptedSolutions` default `true` may expose user solutions unintentionally

- **Confidence:** MEDIUM
- **File:** `src/lib/auth/config.ts:66,93,429`
- **Evidence:** The `shareAcceptedSolutions` field defaults to `true` when the DB value is null. This means new users who have never set a preference have their solutions shared by default. While this may be intentional for the educational use case, it could be surprising in competitive programming contexts where solution sharing is typically opt-in.
- **Failure scenario:** A student submits an accepted solution in a contest. They are unaware that by default, their solution is visible to other users. They may have expected privacy by default.
- **Suggested fix:** Document this as an intentional design decision in code comments. Consider making it opt-in for contest-related submissions.

### CR9-SR3 — [LOW] Tags route still lacks rate limiting (carried forward from prior cycle)

- **Confidence:** HIGH
- **File:** `src/app/api/v1/tags/route.ts`
- **Evidence:** Previously identified in cycle 6b as AGG-6. The tags route is not wrapped in `createApiHandler` and has no `consumeApiRateLimit` call. An attacker could brute-force tag enumeration without rate limiting.
- **Failure scenario:** Unauthenticated or low-privilege user makes thousands of requests to the tags endpoint, potentially causing DB load.
- **Suggested fix:** Wrap in `createApiHandler` with `rateLimit: "tags:read"`.

### CR9-SR4 — [LOW] `validateShellCommand` denylist misses `source` and `exec` builtins

- **Confidence:** LOW
- **File:** `src/lib/compiler/execute.ts:156`
- **Evidence:** The regex denylist blocks `` ` ``, `$(`, `${`, `<(`, `>()`, `||`, `|`, `>`, `<`, newlines, null, and `eval`. But `source` and `exec` shell builtins are not blocked. While the `validateShellCommandStrict` function's prefix check provides additional defense, a command like `exec /usr/bin/something` would pass the prefix check if `exec` is the first token (it's not in `ALLOWED_COMMAND_PREFIXES`).
- **Failure scenario:** A compromised admin adds `exec python3 -c 'import os; os.system("...")'` as a compile command. The `validateShellCommandStrict` would reject it because `exec` is not in `ALLOWED_COMMAND_PREFIXES`. So this is defense-in-depth only.
- **Suggested fix:** Add `exec` and `source` to the regex denylist for completeness.

### CR9-SR5 — [LOW] `decrypt()` plaintext fallback could mask migration failures

- **Confidence:** LOW
- **File:** `src/lib/security/encryption.ts:78-81`
- **Evidence:** `decrypt()` returns values that don't start with `enc:` as-is. This is designed for backward compatibility with data stored before encryption was enabled. However, it means that if encryption is accidentally disabled (e.g., `NODE_ENCRYPTION_KEY` is unset in production but the environment check fails silently), all encrypted values would be returned as raw `enc:...` strings without any error.
- **Failure scenario:** In production, `NODE_ENCRYPTION_KEY` is accidentally unset. The `getKey()` function would throw in production, so this scenario is actually caught. The fallback is only active in development. Low risk.
- **Suggested fix:** Add a runtime check or warning when `decrypt()` receives a string that looks like it should be encrypted (starts with `enc:`) but the key is the dev key in a production-like environment.

## Previously Found Issues (Still Open — Verified Present)

- D1: SSE submission events route capability check incomplete (MEDIUM)
- D3: JWT callback DB query on every request (MEDIUM)
- D5: Backup/restore/migrate routes use manual auth pattern (LOW)
- D6: Files/[id] DELETE/PATCH manual auth (LOW)
- D7: SSE re-auth rate limiting (LOW)

## Previously Found Issues (Verified Fixed This Cycle)

- AGG-2: Backup `body` variable shadowing — FIXED
- AGG-3: Encryption key parsing on every call — FIXED
- AGG-6: `processImage` 500 error — FIXED
