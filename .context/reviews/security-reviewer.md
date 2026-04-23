# Security Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** security-reviewer
**Base commit:** 16cf7ecf

## Inventory of Files Reviewed

- All API routes (`src/app/api/v1/`)
- Security modules (`src/lib/security/`)
- Docker client (`src/lib/docker/client.ts`)
- Compiler execute (`src/lib/compiler/execute.ts`)
- Auth (`src/lib/auth/`)
- CSRF (`src/lib/security/csrf.ts`)
- Rate limiting (`src/lib/security/in-memory-rate-limit.ts`, `src/lib/security/rate-limit.ts`)
- File storage (`src/lib/files/storage.ts`)
- Sanitization (`src/lib/security/sanitize-html.ts`)
- DB import/restore routes (`src/app/api/v1/admin/migrate/import/route.ts`, `src/app/api/v1/admin/restore/route.ts`)
- Chat widget (`src/lib/plugins/chat-widget/`)
- Recruiting (`src/app/api/v1/recruiting/validate/route.ts`)

## Findings

### SEC-1: Import route JSON body path includes password in request body — potential log/middleware exposure [MEDIUM/MEDIUM]

**File:** `src/app/api/v1/admin/migrate/import/route.ts:127-183`

**Description:** The JSON body path for the import route accepts `{ password, data: {...} }` in the request body. This means the admin's password is transmitted as a JSON field, which could be logged by request-logging middleware, load balancers, or CDN access logs. The multipart/form-data path (lines 38-125) sends the password as a form field, which is standard. This was identified as prior AGG-7 in cycle 33 but remains unfixed.

**Concrete failure scenario:** A reverse proxy or CDN logs request bodies for error diagnostics. The admin's password appears in plaintext in those logs.

**Fix:** Deprecate the JSON body path and require multipart/form-data for all imports. Add a deprecation warning header for the JSON path while it remains for backward compatibility.

**Confidence:** Medium

---

### SEC-2: Duplicate password rehash logic creates inconsistent audit coverage [LOW/MEDIUM]

**File:** `src/app/api/v1/admin/migrate/import/route.ts:64-74, 164-174`, `src/app/api/v1/admin/restore/route.ts:63-73`

**Description:** The password rehash logic is duplicated three times across two files. While not a direct security vulnerability, the duplication means any security improvement (e.g., adding audit logging for rehash events, or rate-limiting rehash attempts) must be applied consistently to all three locations. Currently, none of them log the rehash event, which is a gap in audit coverage.

**Concrete failure scenario:** A security auditor asks "when was the last time an admin password was transparently rehashed from bcrypt to argon2id?" — there is no audit trail for this event.

**Fix:** Extract to a shared utility with built-in audit logging (same as CR-3 in code-reviewer review).

**Confidence:** Medium

---

### Previously Fixed Items (Verified in Current Code)

- AGG-1 (Docker client remote path error leak): Fixed in commit 5527e96b — verified at lines 249, 305, 351
- AGG-2 (Compiler spawn error leak): Fixed in commit 46ba5e0c — verified at line 484
- AGG-3 (SSE NaN guard): Fixed in commit 8ca143d4 — verified at lines 86-88
- AGG-7 (Chat widget ARIA role): Fixed in commit 16cf7ecf — verified at line 314
