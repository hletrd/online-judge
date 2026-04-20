# Security Review — Cycle 2

**Base commit:** b91dac5b
**Reviewer:** security-reviewer

## F1 — Admin audit-logs and login-logs CSV export has no row limit
- **Severity:** HIGH | **Confidence:** HIGH
- **File:** `src/app/api/v1/admin/audit-logs/route.ts:127-175`, `src/app/api/v1/admin/login-logs/route.ts:98-132`
- When `format=csv`, the query omits `.limit(limit).offset(offset)` and fetches ALL matching rows. An attacker with admin access could cause a memory exhaustion DoS by requesting CSV export of millions of audit/login events.
- **Fix:** Apply the same `limit`/`offset` to CSV exports, or impose a maximum export row count (e.g., 10000).

## F2 — `COMPILER_RUNNER_URL` and `RUNNER_AUTH_TOKEN` have empty-string fallbacks
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/lib/compiler/execute.ts:56-57`, `src/lib/docker/client.ts:6-7`
- `process.env.COMPILER_RUNNER_URL || ""` silently defaults to empty string rather than failing fast. If the env var is misconfigured, the system will attempt to connect to an empty URL instead of reporting the misconfiguration.
- **Fix:** Validate these at startup (similar to `getValidatedAuthSecret`) rather than falling back to empty string.

## F3 — Rankings page raw SQL is safe but would benefit from parameterized period
- **Severity:** LOW | **Confidence:** HIGH
- **File:** `src/app/(public)/rankings/page.tsx:31-39,115-172`
- The `getPeriodClause` function returns SQL fragments that are concatenated into `rawQueryOne`/`rawQueryAll`. The period is validated against `PERIOD_FILTER_VALUES` before use, so this is currently safe. However, the raw SQL pattern is a code-smell that could become a vulnerability if the validation is accidentally weakened.
- **Fix:** Use parameterized queries or Drizzle's query builder.

## F4 — Chat widget API key stored in plugin state config (DB)
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/app/api/v1/plugins/chat-widget/chat/route.ts:176-189`
- The `pluginState.config` object contains `openaiApiKey`, `claudeApiKey`, `geminiApiKey` as plaintext strings. These API keys are stored in the database and loaded on every chat request. If the DB is compromised, all AI provider API keys are exposed.
- **Fix:** Consider encrypting API keys at rest (using the existing `derive-key.ts`/`encryption.ts` infrastructure) or storing them exclusively in env vars.

## F5 — CSV export lacks filename sanitization
- **Severity:** LOW | **Confidence:** MEDIUM
- **File:** `src/app/api/v1/admin/audit-logs/route.ts:171`, `src/app/api/v1/admin/login-logs/route.ts:129`
- The `Content-Disposition` filename is hardcoded (`audit-logs.csv`, `login-logs.csv`), so this is not currently exploitable. However, if user-controlled input is ever used in filenames, it could lead to header injection.
- **Fix:** No immediate fix needed; document the constraint if filenames become dynamic.
