# Security Reviewer — RPF Cycle 7/100

**Date:** 2026-04-26
**Cycle:** 7/100
**Lens:** OWASP Top 10, secrets handling, auth/authz, input validation, data integrity, audit/logging, CSRF, CSP

---

## Cycle-6 carry-over verification

Cycle-6 critical security findings (4-agent convergence on AGG6-1 / SEC6-1) are RESOLVED at HEAD:
- `deploy-docker.sh` Step 5b backfill runs unconditionally before drizzle-kit push, preventing the "judge worker silent lockout via DRIZZLE_PUSH_FORCE bypass" scenario.
- AGENTS.md documents the recovery path; operators no longer need to read the bash script to find DRIZZLE_PUSH_FORCE.
- The Step 5b backfill SQL matches the production hash semantics (`encode(sha256(secret_token::bytea), 'hex')`).

Cycle-6 deferred SEC6-2 (tags.updated_at nullable) — reaffirmed deferrable; no security implication today.
Cycle-6 deferred SEC6-3 (DRIZZLE_PUSH_FORCE audit trail) — reaffirmed deferrable; deploy script has no audit infra yet.

---

## SEC7-1: [LOW, NEW] `deploy-docker.sh:576` and `deploy-docker.sh:635` BOTH read `POSTGRES_PASSWORD` from `.env.production` and export it as `PGPASSWORD` to a docker container — `PGPASSWORD` env var is visible in `docker inspect` for the container's lifetime

**Severity:** LOW (defense-in-depth — passwords in container env are visible to anyone with docker.sock access)
**Confidence:** HIGH

**Evidence:**
- `deploy-docker.sh:576-581`: PG_PASS lookup + `docker run -e PGPASSWORD ...`.
- `docker inspect <container-id>` reveals env vars in plain text. Anyone on the deploy host with `docker.sock` access (root, members of `docker` group) can read it during the ~5-10s container lifetime.

**Why it's a problem:** Defense-in-depth. The password is already in `.env.production` on disk (chmod 600 per script line 269), so the on-host attack surface is identical. But `--rm` containers expose env via inspect for the lifetime of the container.

**Fix (defense-in-depth):**
1. Use `PGPASSFILE` instead of `PGPASSWORD`. Mount a temporary `~/.pgpass` file into the container.
2. Or use a docker secret (docker swarm only).

**Exit criteria:** Production password is not exposed via `docker inspect` for any deploy step.

**Carried-deferred status:** Defer (current threat model is acceptable; deploy host is hardened).

---

## SEC7-2: [LOW, NEW] `deploy-docker.sh` Step 5b uses `psql -h db -U judgekit -d judgekit` without sslmode — connection is plaintext

**Severity:** LOW (defense-in-depth — internal network only)
**Confidence:** HIGH

**Evidence:**
- `deploy-docker.sh:583`: `psql -h db -U judgekit -d judgekit` — no `sslmode=` parameter.
- Connection is between two containers on the same docker bridge network (private to the host).

**Fix:** Add `sslmode=prefer` to the psql connection. PostgreSQL accepts both encrypted and unencrypted by default.

**Exit criteria:** psql connections request SSL when available.

**Carried-deferred status:** Defer (internal network, low threat).

---

## SEC7-3: [LOW, NEW] `proxy.ts:282-291` records `suspicious_ua_mismatch` audit events without rate-limiting

**Severity:** LOW (audit log integrity)
**Confidence:** HIGH

**Evidence:**
- `src/proxy.ts:278-292`: every request with mismatched UA emits an audit event. No deduplication, no rate-limit.
- A UA-rotating browser extension could trigger one event per request.

**Fix:** Deduplicate by user_id + day or apply a per-user-per-hour cap.

**Exit criteria:** UA-mismatch audit events are bounded.

**Carried-deferred status:** Defer (audit log infra is centrally managed; threshold issue is downstream).

---

## SEC7-4: [LOW, NEW] `clearAuthSessionCookies` does NOT set `httpOnly: true` or `sameSite: "lax"` on the clear directive — clearing a cookie doesn't require these attributes, but a future code review may incorrectly conclude they're needed

**Severity:** LOW (cosmetic / clarity)
**Confidence:** HIGH

**Evidence:**
- `src/proxy.ts:93-94`: cookie clear directives.
- Per RFC 6265 / browser semantics, clearing a cookie (Max-Age=0) only requires matching `domain` + `path`.

**Fix (cosmetic):** Add a comment:
```ts
// Note: clearing a cookie via Max-Age=0 only requires matching domain+path.
// httpOnly and sameSite attributes are NOT needed on the clear directive.
```

**Exit criteria:** Comment explains the cookie-clear semantics.

**Carried-deferred status:** Defer (current code correct, cosmetic improvement).

---

## SEC7-5: [LOW, NEW] `getValidatedAuthSecret()` validation chain — verified safe

**Severity:** LOW (verification)
**Confidence:** HIGH

**Evidence:**
- `src/lib/security/env.ts:182-190`:
  ```ts
  if (authSecret === AUTH_SECRET_PLACEHOLDER || authSecret.length < 32) {
    throw new Error("AUTH_SECRET must be replaced with a strong value...");
  }
  ```
- Order: check placeholder OR length. Both are checked; either failure aborts.
- Placeholder length: 56 chars. Partial-match like 43 chars would pass length-check (43 ≥ 32) and fail placeholder-check. ✓

**Fix:** No action — validation chain is well-formed.

**Carried-deferred status:** Resolved at verification.

---

## Summary

**Cycle-7 NEW findings:** 0 HIGH, 0 MEDIUM, 4 LOW (all carried-deferable; SEC7-5 resolved at verification).
**Cycle-6 carry-over status:** All cycle-6 critical security findings resolved. Carried defers from cycles 1-5 remain accurate.
**Security verdict:** No HIGH or MEDIUM security risks at HEAD.
