# Security Reviewer — Cycle 19

**Date:** 2026-04-24
**Base commit:** f1817fdf

---

## Findings

### S-1: [MEDIUM] Full-Fidelity Backup Export Leaks Encrypted hCaptcha Secret — `ALWAYS_REDACT` Incomplete

**File:** `src/lib/db/export.ts:255-258`
**Confidence:** HIGH

The `ALWAYS_REDACT` map redacts `users.passwordHash` and `apiKeys.encryptedKey` even in full-fidelity backups. The `systemSettings.hcaptchaSecret` column stores the hCaptcha site secret encrypted with AES-256-GCM (via `encrypt()` in `src/lib/security/encryption.ts`). However, it is not in `ALWAYS_REDACT`, meaning the encrypted ciphertext is included in all backup exports.

While the value is encrypted, the backup typically ships alongside environment variables (including `NODE_ENCRYPTION_KEY`) in operational disaster recovery procedures. An attacker who obtains both the backup file and the encryption key can decrypt the hCaptcha secret and abuse it to bypass CAPTCHA verification on the site.

This is a defense-in-depth gap: `encryptedKey` in `apiKeys` is redacted even though it's also encrypted, but `hcaptchaSecret` is not.

**Concrete failure scenario:** An admin creates a full-fidelity backup for migration. The JSON file contains `systemSettings.hcaptchaSecret: "enc:a1b2..."`. The backup is stored on a shared drive. A low-privileged user with access to the drive and knowledge of `NODE_ENCRYPTION_KEY` (which may be in `.env` files also on the drive) can decrypt the hCaptcha secret and programmatically submit CAPTCHA-bypassing requests.

**Fix:** Add `systemSettings: new Set(["hcaptchaSecret"])` to `ALWAYS_REDACT` in `src/lib/db/export.ts`.

---

### S-2: [LOW] `hcaptchaSecret` Also Missing from `SANITIZED_COLUMNS` in Export

**File:** `src/lib/db/export.ts:245-252`
**Confidence:** HIGH

In sanitized (human-downloadable) exports, the `systemSettings` table is not listed in `SANITIZED_COLUMNS` at all. This means even sanitized exports include the encrypted hCaptcha secret. Sanitized exports are intended to be safe for human sharing — they should not contain any secret material, encrypted or not.

**Fix:** Add `systemSettings: new Set(["hcaptchaSecret"])` to `SANITIZED_COLUMNS` in `src/lib/db/export.ts`.

---

### S-3: [LOW] `hcaptchaSecret` Not Tested in Export Redaction Test

**File:** Related to `tests/unit/db/` test files
**Confidence:** MEDIUM

There is no automated test that validates `ALWAYS_REDACT` and `SANITIZED_COLUMNS` include entries for all known secret columns in the schema. This is the same systemic gap that existed for `REDACT_PATHS` (fixed in cycle 17 with AGG-4). If a new secret column is added to `systemSettings` (e.g., an OAuth client secret), it must be manually added to both the logger's `REDACT_PATHS` and the export's redaction maps, and there is no test to catch omissions.

**Fix:** Add a test that validates `ALWAYS_REDACT` and `SANITIZED_COLUMNS` include entries for known secret columns (`passwordHash`, `encryptedKey`, `hcaptchaSecret`). Consider deriving these from a single source of truth.

---

## Verified Safe

### VS1: CSRF protection is consistent across all mutation routes
All mutation routes use `createApiHandler` with default CSRF enforcement, or `validateCsrf()` directly. API key requests correctly skip CSRF (no cookies involved).

### VS2: Server action origin check works correctly
`isTrustedServerActionOrigin()` in `src/lib/security/server-actions.ts` validates the `Origin` header against trusted hosts (from `AUTH_URL` + DB `allowedHosts`). Falls back to allowing in development only.

### VS3: Encryption is properly implemented
AES-256-GCM with 96-bit IV, 128-bit auth tag. Fixed dev key only used in non-production. Production throws if `NODE_ENCRYPTION_KEY` is missing. Plaintext fallback is logged in production.

### VS4: Password hashing follows OWASP recommendations
Argon2id with 19 MiB memory cost, time cost 2, parallelism 1. Transparent bcrypt-to-argon2 migration via `verifyAndRehashPassword`. Dummy hash used for timing-safe non-existent user responses.

### VS5: Token invalidation is secure
`clearAuthToken()` sets `authenticatedAt` to 0 (not delete), ensuring `isTokenInvalidated()` returns true even when `token.iat` is still valid. This closes a revocation bypass window.
