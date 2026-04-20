# Security Review -- Review-Plan-Fix Cycle 5

**Reviewer:** security-reviewer
**Base commit:** 4c2769b2

## Findings

### F1 -- Group assignment export route uses manual `getApiUser` without CSRF check
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts:13-19`
- **Description:** This route uses `getApiUser` directly without `createApiHandler`. While it is a GET-only route (no CSRF needed for GET), the route lacks rate limiting, which is important for export routes that can be resource-intensive. All other export routes (contest export, admin submissions export, audit-logs, login-logs) use `createApiHandler` with `rateLimit: "export"`. This route has no rate limit at all.
- **Concrete failure:** An attacker with instructor access could repeatedly request exports for large groups, causing repeated full-table scans and potential DoS.
- **Suggested fix:** Migrate to `createApiHandler` with `rateLimit: "export"`.

### F2 -- Deploy-worker.sh `ensure_env_var` uses unsanitized `sed` with remote key/value
- **Severity:** MEDIUM
- **Confidence:** MEDIUM
- **File:** `scripts/deploy-worker.sh:98-108`
- **Description:** The `ensure_env_var` function passes `key` and `value` directly into a `sed -i` command over SSH. If either contains characters like `|`, `/`, or `&`, the `sed` substitution could break or inject unintended content. While the keys are hardcoded (safe), the values come from `APP_URL` (user input via `--app-url`) and `AUTH_TOKEN` (from `.env.production`). A URL containing `|` or `&` could cause unexpected sed behavior.
- **Concrete failure:** If `APP_URL` is `https://example.com|malicious`, the sed command becomes `sed -i "s|^JUDGE_BASE_URL=.*|JUDGE_BASE_URL=https://example.com|malicious|"` which breaks the sed pattern.
- **Suggested fix:** Use `awk` or Python for the remote env update, or properly escape sed special characters in the value.

### F3 -- Proxy matcher no longer includes `/workspace/:path*` (verified fix from cycle 4)
- **Severity:** N/A (verified)
- **Confidence:** HIGH
- **File:** `src/proxy.ts:306-324`
- **Description:** The `/workspace/:path*` matcher entry has been removed. Verified that the proxy matcher is clean.

### F4 -- SSE events route leaks submission data to deactivated users for up to 30 seconds
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:306-317`
- **Description:** The SSE route re-checks auth every `AUTH_RECHECK_INTERVAL_MS` (30 seconds). A user whose account is deactivated or whose session is invalidated can continue receiving submission status updates for up to 30 seconds after the change. The comment at line 316 acknowledges this: "the auth revocation will take effect on the next tick". This is a known tradeoff documented in the code.
- **Concrete failure:** A student who is removed from a contest during an active SSE connection continues receiving status updates for up to 30 seconds.
- **Suggested fix:** This is a known tradeoff. Consider reducing `AUTH_RECHECK_INTERVAL_MS` to 10 seconds for a tighter window, or implementing a push-based invalidation mechanism.

### F5 -- API key auth bypasses CSRF but not all routes handle it consistently
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `src/lib/api/handler.ts:135-137`
- **Description:** The `createApiHandler` correctly skips CSRF for API key-authenticated requests (line 135-137). However, 5 routes that use manual `getApiUser` + `csrfForbidden` patterns (identified in cycle 4 AGG-12) may not apply the same API key bypass logic. Specifically, `csrfForbidden()` in `src/lib/api/auth.ts` needs to be checked for whether it also skips CSRF for API key auth.
- **Suggested fix:** Verify that `csrfForbidden()` in auth.ts skips CSRF for Bearer token requests. Migrate remaining manual routes to `createApiHandler`.
