# Security Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** security-reviewer
**Base commit:** 63557cc2

## Previously Fixed Items (Verified)

- AGG-1 (localStorage crashes): Fixed — both compiler-client and submission-detail-client have try/catch
- AGG-8 (console.error gating): Fixed — all 14 components gate behind dev check
- admin-config double `.json()`: Fixed
- bulk-create raw err.message: Fixed — truncated to 120 chars
- normalizePage upper bound: Fixed — prevents unbounded DB OFFSET queries

## SEC-1: `contest-join-client.tsx` raw API error code propagates through Error chain [LOW/LOW]

**File:** `src/app/(dashboard)/dashboard/contests/join/contest-join-client.tsx:49-50`

`(payload as { error?: string }).error ?? "joinFailed"` extracts the raw API error string and throws it. While this is never shown to the user (the catch block uses `t("joinFailed")`), the raw error code exists in the Error object. This is acceptable since Error objects are only accessible via DevTools.

**Fix:** No action required. The user-facing display is already using i18n keys.

---

## SEC-2: Carried security findings (unchanged)

- SEC-CARRIED-1: `window.location.origin` for URL construction — covered by DEFER-24
- SEC-CARRIED-2: Encryption plaintext fallback — MEDIUM/MEDIUM, carried from DEFER-39
- SEC-CARRIED-3: `AUTH_CACHE_TTL_MS` has no upper bound — LOW/MEDIUM, carried from DEFER-40
- SEC-CARRIED-4: Anti-cheat localStorage persistence — LOW/LOW, carried from DEFER-48
- SEC-CARRIED-5: `sanitizeHtml` root-relative img src — LOW/LOW, carried from DEFER-49

---

## Verified Safe / No Issue

- CSP headers comprehensive and properly configured
- HSTS headers correctly set with includeSubDomains for HTTPS
- CSRF protection via X-Requested-With header on all apiFetch calls
- Rate limiting uses two-tier strategy preventing TOCTOU races
- Auth flow: Argon2id, timing-safe dummy hash, token invalidation
- Proxy correctly strips x-forwarded-host to prevent RSC streaming corruption
- UA hash mismatch is audit-only (appropriate)
- authUserCache is FIFO with 2-second TTL, 500-entry cap, no negative caching
- sign-out.ts properly clears app-specific storage prefixes
- No dangerouslySetInnerHTML without sanitization
- No eval() or innerHTML assignments
- `handleResetAccountPassword` now calls `fetchAll()` after success
