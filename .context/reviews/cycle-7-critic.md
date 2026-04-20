# Critic — Cycle 7 Deep Review

**Date:** 2026-04-20
**Scope:** Multi-perspective critique of the whole change surface

---

## Findings

### HIGH 1 — `tokenInvalidatedAt` clock-skew is the most impactful unaddressed security issue

**Confidence:** HIGH
**Cross-agent agreement:** code-reviewer, security-reviewer, debugger, architect

**Problem:** The session revocation mechanism is the last major security-relevant code path that still uses `new Date()`. Previous cycles have systematically migrated contest deadlines, exam sessions, access code redemption, API key expiry, and anti-cheat boundary checks to DB time. The `tokenInvalidatedAt` field was missed because it's not in the "deadline/expiry" category — it's a "revocation timestamp" that serves a different but equally security-critical purpose.

**Why this matters more than the other findings:** While public contest page status and sidebar display are UX concerns (the API enforces the actual rules), `tokenInvalidatedAt` directly controls whether a session is valid. A clock-skew window here means a deactivated user or a user whose password was just changed can continue accessing the system.

**Suggested fix:** Migrate all `tokenInvalidatedAt: new Date()` to `tokenInvalidatedAt: await getDbNowUncached()`. This is the highest-priority fix in this cycle.

---

### MEDIUM 1 — Public contest pages and sidebar status are UX consistency issues, not security issues

**Confidence:** HIGH
**Cross-agent agreement:** code-reviewer, security-reviewer, debugger

**Problem:** While these pages use `new Date()` for contest status, the actual access control is enforced by API routes that use DB time. The inconsistency is a UX issue (confusing "open" status for closed contests) rather than a security issue.

**Suggested fix:** Migrate to `getDbNow()` for consistency, but prioritize after the `tokenInvalidatedAt` fix.

---

### MEDIUM 2 — Anti-cheat and invite route timestamps are minor consistency issues

**Confidence:** MEDIUM

**Problem:** These timestamps are stored in the DB but are not compared against DB-sourced deadlines. The inconsistency is cosmetic rather than functional.

**Suggested fix:** Use DB time for consistency, lower priority.

---

### MEDIUM 3 — Test coverage gaps for new DB-time migration paths

**Confidence:** HIGH

**Problem:** After the `tokenInvalidatedAt` fix, there are no tests to prevent regression back to `new Date()`. The codebase needs guard-rail tests.

**Suggested fix:** Add unit tests for `isTokenInvalidated()` and integration tests for the migration.

---

## Overall assessment

The codebase has been progressively hardened against clock-skew vulnerabilities over the past several cycles. The `tokenInvalidatedAt` issue is the last significant gap. After fixing it, the remaining `new Date()` usages are either:
1. In non-security paths (display-only timestamps, copyright year)
2. In DB schema defaults (acceptable — these run at the DB level)
3. In explicitly deferred items (e.g., `submittedAt` — cosmetic)

The `tokenInvalidatedAt` fix is the critical remaining work for clock-skew consistency.
