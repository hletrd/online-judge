# Security Reviewer Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Scope:** OWASP top 10 + auth/authz + secrets + unsafe patterns
**Method:** static review of recently-changed files (analytics, anti-cheat, env, proxy) and adjacent surfaces

## Findings

### SEC4-1: [LOW, deferred] `__Secure-` cookie clear over HTTP is a no-op (carried)

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/proxy.ts:94`

Carried from cycle 2 AGG-9 / cycle 3 AGG3-6. `response.cookies.set(secureName, "", { ..., secure: true })` over HTTP is silently dropped by the browser. Production is HTTPS-only, so this is a dev-environment nuisance only.

**Failure scenario:** Developer testing locally over plain HTTP can't clear a stuck `__Secure-` cookie. Workaround: use HTTPS dev cert or clear via DevTools.

**Fix (deferred):** Conditional: `secure: request.nextUrl.protocol === "https:"`. Not pursued this cycle (negligible production impact).

**Exit criterion:** Reopen if a developer reports a stuck `__Secure-` cookie in dev.

---

### SEC4-2: [LOW] `__test_internals` exported from production module increases attack surface marginally

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:92-101`

Same issue as ARCH4-1, CR4-1, CRIT4-1. From a security angle: `__test_internals.cacheClear()` allows arbitrary clearing of the analytics cache; `__test_internals.setCooldown` allows arbitrary cooldown manipulation. These are not user-reachable (the export is only callable from inside server code that imports the route module), but they are an internal-server attack surface that didn't exist before.

**Concrete risk:** A future SSRF or RCE that lets an attacker execute code in the server process could call `__test_internals.cacheClear()` to denial-of-service the analytics cache. This is multi-step and unlikely, but the export is unnecessary surface.

**Fix:** Same as ARCH4-1 — gate behind `NODE_ENV === "test"`.

**Exit criterion:** `__test_internals` is undefined in production runtime.

---

### SEC4-3: [LOW] `password.ts` enforces dictionary + similarity (over-spec per AGENTS.md, deferred)

**Severity:** LOW | **Confidence:** HIGH | **Files:** `AGENTS.md:516-521`, `src/lib/security/password.ts:45,50,59`

Carried from cycle 3 AGG3-5 / cycle 2 AGG-11. The password module is *more* restrictive than AGENTS.md says, which is the safer side. Removing the dictionary/similarity checks would weaken security; updating AGENTS.md to allow them aligns doc-with-code.

**Quoted policy (AGENTS.md:516-521):**
> Password validation MUST only check minimum length

**Fix (deferred):** Cannot decide without user/PM input. Carried.

**Exit criterion:** User decision on which side to reconcile.

---

### SEC4-4: [INFO] CSP, HSTS, and cookie security headers verified

**File:** `src/proxy.ts:148-238`

The CSP is dynamically built per request (with nonce), distinguishes `/signup` (allowing hcaptcha) from other pages, and properly restricts `frame-ancestors`, `object-src`, `base-uri`, `form-action`. HSTS is set when `x-forwarded-proto === "https"`. Cookies are cleared with `secure: true` for `__Secure-` variants.

`SEC-M5` (UA hash audit) at lines 278-291 is correctly an audit-only signal, not a hard reject. Reasonable.

**No action.**

---

### SEC4-5: [INFO] Anti-cheat data is correctly redacted

**File:** `src/components/exam/anti-cheat-monitor.tsx:240-261`

`describeElement` deliberately does NOT capture text content from the page (commented at line 252-253: "text content is intentionally NOT captured to avoid storing copyrighted exam problem text in the audit log"). This is a strong privacy-by-design choice. The `target` field reports element type and parent class only.

**No action.**

---

### SEC4-6: [INFO] localStorage usage in anti-cheat is appropriate

**File:** `src/components/exam/anti-cheat-monitor.tsx:41-63`

The pending-events queue is stored in `localStorage` keyed by `assignmentId`. This is a queue of events to retry sending; no PII or auth tokens. The data is bounded by the user's own activity (visibility changes, copies, etc.) and cleared once delivered. Reasonable use of localStorage.

Minor: see CR4-2 for length cap. No security impact today.

**No action.**

---

### SEC4-7: [LOW] Test mock signatures use `any` for handler ctx

**Severity:** LOW | **Confidence:** HIGH | **File:** `tests/unit/api/contests-analytics-route.test.ts:21-22`

```ts
({ handler }: { handler: (req: NextRequest, ctx: { user: any; params: any }) => Promise<Response> }) =>
```

`any` types in test mocks reduce type safety in tests. If the production route handler's expected ctx shape changes, the test mock won't catch it. Cosmetic.

**Fix:** Type the mock as `Parameters<typeof createApiHandler>[0]` or use `unknown` with proper narrowing.

**Exit criterion:** N/A this cycle (cosmetic; deferred).

---

### SEC4-8: [INFO] No new security regressions detected

Verified clean:
- Auth secret validation in `env.ts:182-190` (placeholder reject + 32-char min).
- Judge auth token validation in `env.ts:192-210` (3 placeholder rejects + 32-char min).
- Trust-host logic correctly defaults to `true` only in non-prod.
- Cache clear cookies use `maxAge: 0` (immediate expiry, RFC-correct).
- No SQL string interpolation in `analytics/route.ts:108-112` — uses `@assignmentId` placeholder via `rawQueryOne`.

**No action.**

---

## Confidence Summary

- SEC4-1: MEDIUM (carried-deferred, dev-only impact).
- SEC4-2: MEDIUM (multi-step risk; defense-in-depth fix recommended).
- SEC4-3: HIGH (carried-deferred, repo-policy ambiguity).
- SEC4-4: HIGH (informational).
- SEC4-5: HIGH (informational; intentional privacy choice).
- SEC4-6: HIGH (informational).
- SEC4-7: HIGH (cosmetic).
- SEC4-8: HIGH (clean state).
