# RPF Cycle 10 Security Reviewer — JudgeKit

**Reviewer:** security-reviewer
**Date:** 2026-04-24
**HEAD commit:** b6151c2a

## Files Reviewed

- `src/lib/auth/config.ts` — Credentials provider, authorize(), JWT/session callbacks
- `src/lib/security/csrf.ts` — CSRF validation (X-Requested-With, Sec-Fetch-Site, Origin)
- `src/lib/security/encryption.ts` — AES-256-GCM with NODE_ENCRYPTION_KEY
- `src/lib/security/password-hash.ts` — Argon2id with OWASP-recommended params, bcrypt migration
- `src/lib/security/api-rate-limit.ts` — Two-tier rate limiting (sidecar + DB)
- `src/lib/security/in-memory-rate-limit.ts` — In-memory rate limiter
- `src/lib/security/sanitize-html.ts` — DOMPurify with strict allowlists
- `src/lib/security/timing.ts` — Constant-time comparison
- `src/lib/db/queries.ts` — namedToPositional() parameterized queries
- `src/app/api/v1/recruiting/validate/route.ts` — Token validation (no auth required)
- `src/app/api/v1/judge/claim/route.ts` — Judge auth, IP allowlist, capacity-gated claim
- `src/app/api/v1/judge/poll/route.ts` — Judge result submission
- `src/app/api/v1/test/seed/route.ts` — Test seed (hard-gated by env var + localhost)
- `src/app/api/v1/admin/migrate/import/route.ts` — Database import (password reconfirmation)
- `src/app/api/v1/files/[id]/route.ts` — File serving with path traversal protection
- `src/lib/files/storage.ts` — resolveStoredPath() path traversal guard
- `src/components/seo/json-ld.tsx` — safeJsonForScript() XSS prevention

## Findings

**No new security findings.** All OWASP top-10 categories checked:

- **Injection**: All SQL uses parameterized queries (drizzle ORM or namedToPositional). No string interpolation in SQL.
- **Broken Authentication**: Argon2id with OWASP params, timing-safe dummy hash for non-existent users, DB-time JWT timestamps.
- **Sensitive Data Exposure**: Encryption key enforced in production, plaintext recruiting tokens deprecated, secrets redacted.
- **XXE**: DOMPurify with strict allowlists, no XML parsing.
- **Broken Access Control**: Capability-based RBAC, CSRF on mutations, IP allowlist for judge routes.
- **Security Misconfiguration**: AUTH_URL required in production, secure cookies when appropriate.
- **XSS**: DOMPurify sanitization, JSON-LD uses safeJsonForScript, no raw innerHTML.
- **Insecure Deserialization**: Zod validation on all API inputs, import validation schema.
- **Known Vulnerabilities**: Dependencies up to date (React 19, Next.js 16, argon2 0.44).
- **Logging/Monitoring**: Audit events, login events, structured logging with pino.

## Verified Prior State

The 21-item deferred registry from cycle 4 plan is carried forward unchanged. No security, correctness, or data-loss findings are deferred.
