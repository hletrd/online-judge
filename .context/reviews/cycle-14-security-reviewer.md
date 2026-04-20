# Cycle 14 Security Reviewer Report

**Base commit:** 74d403a6
**Reviewer:** security-reviewer
**Scope:** OWASP top 10, secrets, unsafe patterns, auth/authz

---

## CR14-SR1 — [MEDIUM] `changePassword` server action has TOCTOU race in rate limiting — check and increment are not atomic

- **Confidence:** HIGH
- **Files:** `src/lib/actions/change-password.ts:40-53`
- **Evidence:** The server action first calls `isRateLimited(key)` (check), then if the password is wrong, calls `recordRateLimitFailure(key)` (increment). These are two separate transactions. Between them, the row lock from `isRateLimited` is released. An attacker can exploit this window to make concurrent wrong-password attempts that all pass the check before any increment is recorded. The login auth path correctly uses `consumeRateLimitAttemptMulti` which atomically checks and increments.
- **Attack scenario:** An attacker with 4/5 attempts used sends two concurrent requests. Both check `isRateLimited` and get "not limited" (4 < 5). Both then increment to 5. Neither gets blocked. The attacker effectively gets double the allowed attempts.
- **Suggested fix:** Use `consumeRateLimitAttemptMulti(rateLimitKey)` instead of the check-then-record pattern. On failure, the rate limit is already consumed. On success, call `clearRateLimit`.

## CR14-SR2 — [LOW] `recordRateLimitFailure` used in `changePassword` does not return whether the user is now blocked

- **Confidence:** MEDIUM
- **Files:** `src/lib/actions/change-password.ts:52`, `src/lib/security/rate-limit.ts:195`
- **Evidence:** `recordRateLimitFailure` returns `void`. The caller (`changePassword`) does not know whether this attempt caused the user to be blocked. In contrast, `consumeRateLimitAttemptMulti` returns `true` when the request should be rejected. This means the change-password flow cannot provide a more specific error like "account temporarily locked" after the threshold is hit.
- **Suggested fix:** If switching to `consumeRateLimitAttemptMulti` (as suggested in SR1), the return value would indicate whether the attempt was blocked.

## CR14-SR3 — [LOW] API key auth sets `mustChangePassword: false` — admin-forced password change can be bypassed via API key

- **Confidence:** MEDIUM
- **Files:** `src/lib/api/api-key-auth.ts:121`
- **Evidence:** `authenticateApiKey` hardcodes `mustChangePassword: false` in the returned user object. The middleware (`src/middleware.ts:307-313`) checks `activeUser.mustChangePassword` and blocks access to protected routes when it's true. However, API key-authenticated requests bypass this check because the API key auth always returns `mustChangePassword: false`. An admin who sets `mustChangePassword = true` for a user would expect that user to be forced to change their password before using the system. But if that user has an API key, they can continue making API requests without changing their password.
- **Attack scenario:** Admin flags user for password change. User has an active API key. User continues to use API endpoints via the API key, never changing their password. The forced-password-change policy is ineffective.
- **Suggested fix:** When authenticating via API key, check the creator user's `mustChangePassword` field from the DB (already queried at line 89-93). Pass the actual value instead of hardcoding `false`. Note: API keys are typically used for automated services, so there may be a legitimate reason to bypass forced password changes. If so, document this explicitly.

## CR14-SR4 — [LOW] CSP `style-src 'unsafe-inline'` is still present

- **Confidence:** LOW (carried from D25)
- **Files:** `src/middleware.ts:195`
- **Evidence:** The CSP header includes `style-src 'self' 'unsafe-inline'`, which allows inline style injection. This is common for Tailwind CSS and component libraries but is a known weakness. Already deferred as D25.
- **Suggested fix:** Re-evaluate when component libraries support CSP nonce for styles.

## Final Sweep

- Auth secret validation is solid (minimum 32 chars, placeholder detection).
- Judge auth token has proper minimum length validation.
- Password hashing uses Argon2id with OWASP-recommended parameters.
- CSRF protection is well-implemented (X-Requested-With + Origin + Sec-Fetch-Site).
- CSP headers are comprehensive.
- HSTS is properly configured with HTTP fallback clearing.
- IP extraction properly validates proxy hop count.
- API key encryption uses AES-256-GCM with HKDF-derived keys.
- Session cookie security (httpOnly, sameSite, secure) is properly configured.
