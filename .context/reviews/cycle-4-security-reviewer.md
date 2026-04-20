# Cycle 4 Security Review

**Reviewer:** security-reviewer
**Base commit:** 5086ec22

## Findings

### F1 — Contest export CSV formula injection via inconsistent `escapeCsvCell`
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/contests/[assignmentId]/export/route.ts:11-21`
- **Description:** The local `escapeCsvCell` function uses single-quote (`'`) prefixing to prevent CSV formula injection, while the shared `escapeCsvField` uses tab (`\t`) prefixing. Single-quote prefixing is a weaker mitigation — some spreadsheet applications (particularly older versions of Excel) may not recognize it as an escape and could still interpret the cell as a formula. Contest names, student names, or class names starting with `=`, `+`, `-`, or `@` could trigger formula injection.
- **Concrete failure:** A contest with a problem titled `=CMD|'/C calc'!A0` would result in a CSV cell `'=CMD|'/C calc'!A0` which some spreadsheets may still interpret as a formula.
- **Suggested fix:** Replace local `escapeCsvCell` with the shared `escapeCsvField` from `@/lib/csv/escape-field`.

### F2 — Deploy-worker.sh overwrites remote `.env` without exclusion
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `scripts/deploy-worker.sh:102-109`
- **Description:** The worker deploy script creates a new `.env` file locally with `JUDGE_BASE_URL`, `JUDGE_AUTH_TOKEN`, `JUDGE_CONCURRENCY`, etc. and uploads it via `scp`, overwriting any existing `.env` on the remote worker. If the operator has customized the remote `.env` (e.g., added `DOCKER_HOST`, custom `RUST_LOG`, or other worker-specific settings), those customizations are silently lost on every deploy. This is listed as user-injected TODO #2.
- **Suggested fix:** Add `--exclude='.env'` to the scp or use a merge strategy that preserves remote-only keys.

### F3 — Deploy-docker.sh requires manual COMPILER_RUNNER_URL when INCLUDE_WORKER=false
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `deploy-docker.sh:335-341`
- **Description:** When `INCLUDE_WORKER=false`, the deploy script checks that `COMPILER_RUNNER_URL` is set in the remote `.env.production` and dies if it's the default `http://judge-worker:3001`. This requires the operator to manually edit the remote `.env.production` before deploying, which is error-prone and not documented in the script's `--help`. The script should auto-inject the correct URL (pointing to the external worker) when `--no-worker` is passed, similar to how `AUTH_TRUST_HOST` is auto-injected. This is listed as user-injected TODO #3.
- **Suggested fix:** When `INCLUDE_WORKER=false`, auto-inject `COMPILER_RUNNER_URL=http://host.docker.internal:3001` (or a configurable URL) in the remote `.env.production`, similar to the `ensure_env_secret` function for `AUTH_TRUST_HOST`.

### F4 — Tags API route uses manual auth pattern without `createApiHandler`
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `src/app/api/v1/tags/route.ts:5-14`
- **Description:** The tags GET route uses `getApiUser` directly instead of `createApiHandler`. While this is a GET-only route (no CSRF needed), using the wrapper would ensure consistent auth and error handling. This is a code consistency concern rather than a direct vulnerability.
- **Suggested fix:** Migrate to `createApiHandler`.

### F5 — Middleware `/workspace/:path*` matcher entry is now dead code after Phase 1 migration
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/proxy.ts:311`
- **Description:** The proxy matcher still includes `/workspace/:path*` even though the `(workspace)` route group was eliminated in cycle 3 (WS-PHASE1). The `/workspace` routes now redirect to `/dashboard` or `/community`, so this matcher entry is dead code. While not a security risk, it adds unnecessary middleware processing for workspace URLs.
- **Suggested fix:** Remove `/workspace/:path*` from the proxy matcher. Add `/community/:path*` if not already covered.
