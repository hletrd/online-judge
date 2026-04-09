# Comprehensive Code Review — JudgeKit

**Date:** 2026-04-08
**Scope:** Full repository (src/, rate-limiter-rs/, scripts/, tests/)
**Reviewer:** Automated multi-agent review (6 parallel lanes + final sweep)

---

## Executive Summary

**Overall Assessment: REQUEST CHANGES**

The codebase demonstrates strong foundational security: Argon2id password hashing, timing-safe token comparison, Docker sandboxing with seccomp/capabilities, parameterized SQL via Drizzle ORM, nonce-based CSP headers, and comprehensive audit logging. However, the review identified **9 CRITICAL**, **18 HIGH**, **22 MEDIUM**, and **15 LOW** severity issues that should be addressed.

The most urgent categories are:
1. **Race conditions** — Multiple TOCTOU (time-of-check-time-of-use) bugs in user creation, submission rate limiting, group deletion, and judge claiming
2. **Container isolation** — Workspace directory permissions and shell command validation in the judge pipeline
3. **Information disclosure** — Generated passwords returned in API responses, API keys in client-side code
4. **Data loss risks** — Audit event buffer not flushed on process exit, backup deletion without verification

| Severity | Count |
|----------|-------|
| CRITICAL | 9 |
| HIGH | 18 |
| MEDIUM | 22 |
| LOW | 15 |

---

## CRITICAL Issues

### C-01. XSS via dangerouslySetInnerHTML in Problem Descriptions
**File:** `src/components/problem-description.tsx:37-44`
**Confidence:** HIGH

Legacy HTML descriptions are rendered with `dangerouslySetInnerHTML` using DOMPurify sanitization that allows `href`, `rel`, and `target` attributes. This is insufficient — `href` with `javascript:` protocol can bypass DOMPurify in certain configurations.

```tsx
// Current code
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
```

**Scenario:** An admin or imported problem description contains `<a href="javascript:alert(document.cookie)">click me</a>`. If DOMPurify doesn't strip `javascript:` URIs in this configuration, stored XSS affects every student viewing the problem.

**Fix:** Either upgrade to ReactMarkdown for all descriptions (already used for non-legacy) or strengthen DOMPurify config to strip all URI schemes except `http/https/mailto`.

---

### C-02. Container Escape via Workspace Directory Symlink Attack
**File:** `src/lib/compiler/execute.ts:44, 530`
**Confidence:** HIGH

`WORKSPACE_BASE` defaults to `tmpdir()` (typically `/tmp`) and workspace directories are chmodded to `0o777` (world-writable) for sibling container access. A malicious container could create symlinks in `/tmp/compiler-XXXX/` pointing to host paths.

```typescript
const WORKSPACE_BASE = process.env.COMPILER_WORKSPACE_DIR || tmpdir();
// ...
await chmod(workspaceDir, 0o777);
```

**Scenario:** A compromised container creates `/tmp/compiler-XXXX/solution.c` → `/etc/shadow`. The subsequent compile command reads `/etc/shadow` as "source code" and includes it in error output visible to the attacker.

**Fix:** Use a dedicated, isolated base directory. After `mkdir`, verify no symlinks exist. Restrict to `0o770` with a shared group. Consider Docker `--security-opt apparmor=...`.

---

### C-03. TOCTOU Race in Submission Rate Limit Check
**File:** `src/app/api/v1/submissions/route.ts:213-281`
**Confidence:** HIGH

The rate limit check queries user submission counts but does NOT use `SELECT FOR UPDATE`. Concurrent submissions from the same user can both read the same count and pass the rate limit before either writes.

```typescript
const userCounts = await tx
  .select({...})
  .from(submissions)
  .where(eq(submissions.userId, user.id));
// Missing: .for('update')
```

**Scenario:** Student submits rapidly during a contest. Two requests arrive simultaneously, both see 4/5 submissions used, both pass the check, resulting in 6/5 submissions (exceeding the limit).

**Fix:** Add `.for('update')` to lock the user's submission rows during the check.

---

### C-04. API Key Partially Exposed in Client-Side Code
**File:** `src/lib/plugins/chat-widget/admin-config.tsx:85-88`
**Confidence:** HIGH

API keys are partially revealed (first 3 + last 4 characters) in client-side components. This data is accessible via React DevTools, browser console, or telemetry. Combined with other information, this could aid targeted attacks.

**Fix:** Never send API key material to the client. Indicate key status with a boolean (`hasKey: true/false`) and a redacted marker like `••••••••` with no actual characters.

---

### C-05. Audit Event Buffer Not Flushed on Process Exit
**File:** `src/lib/audit/events.ts:104-123`
**Confidence:** HIGH

The audit event buffer uses `setInterval` for batch insertion but has no signal handler to flush on process termination. If the process is killed (SIGTERM, SIGKILL, crash, container restart), up to 50 audit events are permanently lost.

**Scenario:** Server crashes during an ongoing contest. Audit events for the last 5 seconds (up to 50 events) are lost, including evidence of cheating, submission timestamps, or admin actions.

**Fix:** Add listeners for `SIGTERM`, `SIGINT`, and `beforeExit` to flush the buffer:
```typescript
async function flushAuditBuffer() { /* ... */ }
process.on('SIGTERM', async () => { await flushAuditBuffer(); process.exit(0); });
process.on('SIGINT', async () => { await flushAuditBuffer(); process.exit(0); });
```

---

### C-06. TOCTOU Race in User Creation (Username/Email Uniqueness)
**File:** `src/app/api/v1/users/route.ts:85-90, 129`
**Confidence:** HIGH

Username and email uniqueness checks are separate queries outside any transaction. Between the check and INSERT, another request can create a duplicate user.

**Scenario:** Two concurrent admin POST requests with username "alice" both pass `isUsernameTaken()`, both INSERT, creating duplicate users.

**Fix:** Use `INSERT ... ON CONFLICT DO NOTHING` with unique constraints, or wrap check+insert in a single serializable transaction.

---

### C-07. TOCTOU Race in Bulk User Creation
**File:** `src/app/api/v1/users/bulk/route.ts:64-81, 142-159`
**Confidence:** HIGH

Same pattern as C-06 but in bulk endpoint. Existing username check happens before the insert transaction, creating a race window.

**Fix:** Move all uniqueness checks inside the transaction, or use `ON CONFLICT` with proper error handling per-row.

---

### C-08. Missing Connection Pool Size Configuration
**File:** `src/lib/db/index.ts:30`
**Confidence:** HIGH

PostgreSQL Pool is created with no `max` parameter, using the pg default of 10. Under high load (contests, exams), this is insufficient and can cause connection exhaustion leading to 503 errors.

```typescript
_pool = new Pool({ connectionString: url });
// Missing: max, idleTimeoutMillis, connectionTimeoutMillis
```

**Fix:**
```typescript
_pool = new Pool({
  connectionString: url,
  max: parseInt(process.env.DATABASE_POOL_MAX ?? '20', 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});
```

---

### C-09. Missing Index on `lower(username)` for Case-Insensitive Lookups
**File:** `src/lib/users/core.ts:19-24`
**Confidence:** HIGH

`isUsernameTaken()` uses `lower(username) = lower($input)` but there is no functional index on `lower(username)`. This causes a sequential scan at scale.

**Fix:** Add migration:
```sql
CREATE INDEX users_username_lower_idx ON users (lower(username));
```

---

## HIGH Issues

### H-01. Generated Password Exposed in API Response
**File:** `src/app/api/v1/users/route.ts:129-135`

When admin creates a user without specifying a password, the generated password is returned in the API response body. Despite `Cache-Control: no-store`, this is transmitted over the network and logged in audit logs, proxy logs, and browser history.

```typescript
...(password === undefined && { generatedPassword: generatedPassword }),
```

**Fix:** Never return generated passwords in API responses. Use a separate secure delivery mechanism (e.g., password reset email, one-time display page).

---

### H-02. Password Similarity Check Enables User Enumeration
**File:** `src/lib/security/password.ts:19-28`

The check uses `lower.includes()` for partial substring matching. An attacker can verify if a username/email exists by testing passwords containing that string — if the response says "passwordTooSimilar", the account exists.

```typescript
if (context.username && lower.includes(context.username.toLowerCase())) {
  return "passwordTooSimilar";
}
```

**Fix:** Use exact match (`===`) instead of `includes()`, or remove the similarity check entirely and enforce stronger password requirements instead.

---

### H-03. Recruiting Token Replay Attack
**File:** `src/lib/auth/recruiting-token.ts:35`, `src/lib/assignments/recruiting-invitations.ts`

The recruiting token redemption does not atomically check-and-update the token status. If the token is not properly invalidated in a transaction, a compromised token can be reused.

**Fix:** Wrap the token lookup, validation, and status update in a single transaction with `FOR UPDATE` row lock.

---

### H-04. Missing CSRF Protection in Test/Seed Route
**File:** `src/app/api/v1/test/seed/route.ts:94-102`

The route validates `PLAYWRIGHT_AUTH_TOKEN` but does not use `createApiHandler` (which provides CSRF protection). If the test token is leaked (browser DevTools during E2E tests), an attacker can perform CSRF attacks.

**Fix:** Add explicit CSRF check via `csrfForbidden()` from `@/lib/api/auth`, or wrap with `createApiHandler({ auth: false })`.

---

### H-05. Group Deletion Race Condition
**File:** `src/app/api/v1/groups/[id]/route.ts:139-156`

Submission count check and group DELETE are not in a transaction. Between the count query and DELETE, a submission could be created, allowing a non-empty group to be deleted with orphaned submissions.

**Fix:** Wrap in a transaction, or use `DELETE FROM groups WHERE ... AND NOT EXISTS (SELECT 1 FROM submissions JOIN assignments WHERE ...)`.

---

### H-06. Code Similarity Check Timeout Doesn't Cancel Background Work
**File:** `src/app/api/v1/contests/[assignmentId]/similarity-check/route.ts:31-51`

`Promise.race` returns timeout after 30s but `runAndStoreSimilarityCheck` continues running in the background, consuming database connections and CPU.

**Fix:** Use `AbortController` to signal cancellation to the background computation.

---

### H-07. Race Condition in Judge Claim (TOCTOU)
**File:** `src/app/api/internal/judge/poll/route.ts` (claim logic)

While `FOR UPDATE SKIP LOCKED` is correctly used, the stale claim timeout check creates a window where multiple workers can claim the same submission if one claim becomes stale during the race.

**Fix:** Add additional WHERE condition ensuring the submission is truly available (no active, non-stale claim).

---

### H-08. Weak Encryption Key Fallback for Plugin Secrets
**File:** `src/lib/plugins/secrets.ts:8-16`

Falls back to `AUTH_SECRET` if `PLUGIN_CONFIG_ENCRYPTION_KEY` is not set. Using the same secret for session auth AND plugin config encryption violates cryptographic separation — compromise of one compromises both.

**Fix:** Require `PLUGIN_CONFIG_ENCRYPTION_KEY` as a separate env var. Throw on startup if not configured.

---

### H-09. Rate Limit Bypass via WeakMap Deduplication
**File:** `src/lib/security/api-rate-limit.ts:19, 109-119`

The `WeakMap` keyed by `NextRequest` objects may not deduplicate correctly across the request lifecycle. An attacker replaying identical requests from the same connection could bypass rate limits.

**Fix:** Use a `Map` with stable fingerprint keys (IP + path + auth context) and short TTL-based expiry.

---

### H-10. Rate Limiter Circuit Breaker Allows Bypass via Non-OK Responses
**File:** `src/lib/security/rate-limiter-client.ts:34-52`

The circuit breaker resets `consecutiveFailures` to 0 on any `response.ok` check, but a 429 response from the rate limiter is treated as success, preventing the circuit breaker from ever opening.

**Fix:** Only reset failure counter on successful (200-level) responses, not all non-error responses.

---

### H-11. Missing Authorization Check on Judge Result Endpoint
**File:** `src/app/api/internal/judge/poll/route.ts` (result handling)

Any worker with the shared `JUDGE_AUTH_TOKEN` can submit results for any submission. A compromised worker could inject fake verdicts.

**Fix:** Validate that results come from the worker that claimed the submission (match `judge_worker_id`). Add per-worker rate limiting on result submissions.

---

### H-12. Unverified Backup Deletion Without Verification
**File:** `scripts/backup-db.sh:64-70`

Old backups are deleted via `rm -f` without verifying the current backup succeeded first. Failed backups lead to permanent data loss as old backups are deleted by the retention policy.

**Fix:** Only delete old backups after confirming the current backup succeeded and has expected file size.

---

### H-13. SSE Connection Cleanup Race Condition on Page Unload
**File:** `src/hooks/use-submission-polling.ts:130-143`

When the `result` event fires and an SSE error occur simultaneously (network instability), both handlers can execute concurrently before `sseActive` is set to false, causing duplicate cleanup or unexpected state transitions.

**Fix:** Add `if (!sseActive) return;` guard at the top of each handler before mutating state.

---

### H-14. Docker Command Validation Allows Shell Metacharacters
**File:** `src/lib/compiler/execute.ts:127-133`

`validateShellCommand()` blocks `|`, `<`, `>`, `$()` but allows `&&` and `;`. If a language config is compromised (via DB access), an attacker could inject: `gcc solution.c && cat /etc/passwd > /workspace/output.txt`.

**Fix:** For admin-configured commands, consider an allowlist of known safe executables. Add database-level integrity protection for language configs.

---

### H-15. N+1 Query Pattern in Assignment Submission Validation
**File:** `src/lib/assignments/submissions.ts:176-232`

`validateAssignmentSubmission` makes 5 sequential database queries (assignment lookup, enrollment check, contest access, exam session, assignment problem). Under high submission load, this adds significant latency.

**Fix:** Combine into parallel queries with `Promise.all()` or a single joined query.

---

### H-16. Missing Service Dependencies in Systemd Unit
**File:** `scripts/online-judge.service`

The service has `After=network.target` but does not require PostgreSQL. If the DB takes time to start, the app fails with connection errors and crash loops.

**Fix:** Add `After=postgresql.service` and `Wants=postgresql.service`.

---

### H-17. Missing Index on `rate_limits.lastAttempt` for Eviction
**File:** `src/lib/db/schema.pg.ts:537-554`

The rate limits table has no index on `lastAttempt`, causing full table scans during periodic eviction cleanup.

**Fix:** Add: `index("rate_limits_last_attempt_idx").on(table.lastAttempt)`

---

### H-18. Missing DB Transaction for User Update + Session Invalidation
**File:** `src/lib/actions/user-management.ts:99-107`

User status update and session invalidation happen in two separate operations. Between them, the user can briefly complete an action that should have been blocked.

**Fix:** Wrap both operations in a single transaction, or ensure `tokenInvalidatedAt` check is atomic with the update.

---

## MEDIUM Issues

### M-01. Auth Cache Delay (2s) Allows Stale Session Access
**File:** `src/proxy.ts:16-36`

After session invalidation, the in-process FIFO cache (TTL=2000ms) may serve stale auth results for up to 2 seconds. Compromised/deactivated users retain access briefly.

**Fix:** Reduce cache TTL for production (e.g., 500ms) or implement immediate cache invalidation on user deactivation.

---

### M-02. Timing-Safe Token Compare Uses Random Key Per Call
**File:** `src/lib/security/timing.ts:9-14`

`safeTokenCompare` generates a new random key for each comparison. While HMAC + `timingSafeEqual` is correct, the standard approach uses a fixed key or direct constant-time comparison on padded buffers.

**Fix:** Use direct `crypto.timingSafeEqual` on equal-length padded buffers for simplicity and correctness.

---

### M-03. CSP Policy Contains `unsafe-inline` for Styles
**File:** `src/proxy.ts:66-77`, `next.config.ts:46-59`

The CSP allows `style-src 'self' 'unsafe-inline'`, enabling style injection attacks. While documented as necessary for CSS-in-JS libraries, it opens a vector for data exfiltration via CSS.

**Fix:** Migrate to nonce-based style CSP or use CSP level 3 with `strict-dynamic`.

---

### M-04. Missing Transaction for System Settings Initialization
**File:** `src/lib/system-settings-config.ts:104-126`

`loadFromDb()` reads multiple settings columns without a transaction. Concurrent calls during startup could result in inconsistent state.

**Fix:** Wrap the DB read in a transaction or use a mutex/lock pattern for initialization.

---

### M-05. Race Condition in System Settings Cache Refresh
**File:** `src/lib/system-settings-config.ts:155-178`

Multiple concurrent calls could trigger simultaneous background DB refreshes (thundering herd problem).

**Fix:** Use Promise-based locking to ensure only one refresh is in-flight at a time.

---

### M-06. File Access Check Uses LIKE on Problem Description
**File:** `src/app/api/v1/files/[id]/route.ts:31-39`

File access is determined by `LIKE` pattern matching on `problems.description`. This is O(n) over all problems and can produce false positives if the file URL pattern appears in text by coincidence.

**Fix:** Store an explicit `attachmentProblemId` in the files table instead of pattern matching.

---

### M-07. SSE Connection Tracking Memory Leak
**File:** `src/app/api/v1/submissions/[id]/events/route.ts:52-67`

If connections disconnect abruptly (network failure, browser crash) and cleanup doesn't fire, entries accumulate in global tracking Maps. After days of operation, this could consume significant memory.

**Fix:** Add `request.signal.addEventListener("abort")` cleanup (partially present). Verify cleanup runs for all disconnect modes. Consider `WeakRef` for connection tracking.

---

### M-08. Empty Catch Masks SSE Parser Errors
**File:** `src/app/api/v1/submissions/[id]/events/route.ts:271-287`

When `queryFullSubmission(id)` fails in the SSE final callback, the stream closes silently without notifying the client of the failure.

**Fix:** Send an `event: error` message before closing the stream so the client can display an appropriate error.

---

### M-09. Missing Content-Type Validation in Judge Heartbeat
**File:** `src/app/api/internal/judge/heartbeat/route.ts:22-32`

Unlike claim and deregister routes, heartbeat doesn't validate `Content-Type: application/json`. Malformed requests could cause unexpected parsing errors.

**Fix:** Add content-type check consistent with other judge routes.

---

### M-10. Recruiting Invitation Bulk Create Missing Pagination
**File:** `src/app/api/v1/recruiting/invitations/route.ts`

Duplicate email check fetches ALL matching invitations without limit. Large invitation lists could consume excessive memory.

**Fix:** Use `.limit(1)` or `EXISTS` subquery — you only need to know if ANY duplicate exists.

---

### M-11. Anti-Cheat Heartbeat LRU Cache Too Small
**File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:13-14`

Heartbeat cache has max size 10,000 with 2-minute TTL. For large contests (>10,000 participants), active students could bypass throttling.

**Fix:** Increase max cache size to 100,000 or use a sliding window algorithm.

---

### M-12. Missing Input Validation in AI Provider Switching
**File:** `src/app/api/v1/plugins/chat-widget/chat/route.ts:226-241`

Provider switch falls through to "openai" as default with no validation. Invalid provider values bypass checks.

**Fix:** Validate provider against allowlist `["openai", "claude", "gemini"]` and return 400 for unknown values.

---

### M-13. Missing Sanitization in AI System Prompt Construction
**File:** `src/app/api/v1/plugins/chat-widget/chat/route.ts:39-99`

System prompt template directly concatenates `config.systemPrompt` and `config.knowledgeBase` without sanitization. A malicious admin could inject prompt manipulation directives.

**Fix:** Escape or validate custom prompts before inclusion. Add boundaries/separators between system instructions and user content.

---

### M-14. No Timeout on Backup Operations
**File:** `scripts/backup-db.sh:8-21`

`pg_dump` and Python SQLite backup have no timeout. Large databases or locks could cause backups to hang indefinitely, and cron may start a second backup concurrently.

**Fix:** Add `timeout 300s` wrapper. Implement pid file locking to prevent concurrent backups.

---

### M-15. Missing Plugin Isolation Between Configurations
**File:** `src/lib/plugins/data.ts:22-61`

No error isolation between plugin configurations. One corrupted plugin row could cause `getPluginState` to fail for all plugins.

**Fix:** Wrap each plugin's config retrieval in try-catch to isolate failures.

---

### M-16. Excessive Message History Sent to AI Provider
**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:145-146`

Sends last 20 messages to AI API including full history. Long conversations increase token usage and cost without deduplication or summarization.

**Fix:** Implement conversation summarization and cap total context window.

---

### M-17. Missing Rate Limit Headers in Response
**File:** `src/app/api/v1/plugins/chat-widget/chat/route.ts:289-297`

When rate limit is hit, returns 429 without `Retry-After` header. Clients cannot implement proper backoff.

**Fix:** Add `Retry-After` header when returning 429.

---

### M-18. Memory Leak in Countdown Timer Interval
**File:** `src/components/exam/countdown-timer.tsx:85-110`

The countdown timer's `setInterval` is only cleared when the timer expires. If the component unmounts before expiration, the interval continues in the background.

**Fix:** Always clear the interval in the useEffect cleanup function, regardless of timer state.

---

### M-19. Memory Leak in Auto-Refresh Interval
**File:** `src/components/submission-list-auto-refresh.tsx:21-36`

The auto-refresh interval may not be properly cleaned up on unmount, causing continued polling after navigation.

**Fix:** Ensure cleanup function always clears the interval ref, and include all dependencies in the effect.

---

### M-20. No Client-Side File Upload Size Validation
**File:** `src/app/(dashboard)/dashboard/admin/files/file-upload-dialog.tsx:155-205`

Files are sent to the server without client-side size validation. Large files (100MB+) could cause upload failures or timeouts.

**Fix:** Add client-side size check (e.g., 50MB limit) before starting the upload.

---

### M-21. Missing Constraint on Exam Mode Submissions
**File:** `src/lib/db/schema.pg.ts:426-467`

For exam mode, a user should have at most one submission per assignment, but the database doesn't enforce this. The application checks it, but race conditions could allow duplicates.

**Fix:** Add a partial unique index for exam mode contexts.

---

### M-22. Cascade Delete Inconsistency for Groups
**File:** `src/lib/db/schema.pg.ts:166-189`

`groups.instructorId` has `onDelete: "set null"`. Deleting an instructor leaves groups without instructors, making them unmanageable.

**Fix:** Add logic to reassign or prevent deletion of instructors with active groups.

---

## LOW Issues

### L-01. Missing Input Length Validation on Login Identifier
**File:** `src/lib/auth/config.ts:167-175`

No explicit length check before DB lookup. Extremely long identifiers could cause unexpected behavior.

### L-02. Rate Limit Eviction Interval May Be Too Long
**File:** `src/lib/security/rate-limit.ts:43-60`

60-second eviction interval may allow memory accumulation under high traffic.

### L-03. Docker Seccomp Profile Optional Without Warning
**File:** `src/lib/compiler/execute.ts:284-286`

If seccomp profile file is missing, containers run with reduced security but no warning is logged.

### L-04. Verdict Score Floating Point Precision
**File:** `src/lib/judge/verdict.ts:13-42`

`score = (passed / results.length) * 100` uses floating point. Use `Math.round((passed * 100) / results.length)` for integer scores.

### L-05. Missing Worker Concurrency Validation
**File:** `src/app/api/internal/judge/register/route.ts:12-13`

Worker concurrency validated to 1-64 but no system-wide limit. A malicious worker registering concurrency=64 could overwhelm infrastructure.

### L-06. Magic Number in Container Age Cleanup
**File:** `src/lib/compiler/execute.ts:35`

`MAX_CONTAINER_AGE_MS = 10 * 60 * 1000` is hardcoded. Should be configurable or documented.

### L-07. Group Access Check Redundant Queries
**File:** `src/app/api/v1/groups/[id]/route.ts:15-35`

GET endpoint queries the `groups` table 2-3 times (existence check, access check, full fetch).

### L-08. Inconsistent Transaction Helper Usage
**File:** Multiple routes

Some routes use `db.transaction()` directly, others use `execTransaction()`. Should be standardized.

### L-09. Assignment Problem Count Limit Inconsistency
**File:** `src/lib/validators/assignments.ts:36-39`

Validator allows 100 problems per assignment but enforcement may differ elsewhere.

### L-10. Missing examDurationMinutes Validation for Scheduled Mode
**File:** `src/lib/validators/assignments.ts:94-105`

Scheduled exam mode requires `startsAt`/`deadline` but not `examDurationMinutes`. Should be validated or documented as intentional.

### L-11. Decrypt Error Shows Blank Instead of Error Message
**File:** `src/lib/plugins/secrets.ts:94-99`

Plugin secret decryption failure is silently caught, showing blank. Admin doesn't know the key needs re-entry.

### L-12. Nginx Config Contains Placeholder Domain
**File:** `scripts/online-judge.nginx.conf:21`

Deploying without updating `your-domain.example` causes HTTPS misconfiguration.

### L-13. No Health Check After Service Install
**File:** `scripts/install-online-judge-service.sh:1-19`

Service is enabled and started but health is never verified.

### L-14. Missing Loading State on Group Archive Button
**File:** `src/app/(dashboard)/dashboard/groups/[id]/group-archive-button.tsx`

No loading state allows multiple clicks and unclear UX.

### L-15. CDN Scripts Without Subresource Integrity
**File:** `static-site/html/*/index.html`

External CDN scripts (MathJax, polyfills) included without `integrity` attribute, enabling supply chain attacks if CDN is compromised.

---

## Positive Observations

The following security controls and practices are well-implemented:

1. **Argon2id password hashing** with OWASP-compliant parameters (19 MiB, time cost 2)
2. **Timing-safe token comparison** using HMAC + `timingSafeEqual`
3. **Docker sandboxing** with seccomp profiles, dropped capabilities, noexec tmpfs, read-only root
4. **CSRF protection** requiring `X-Requested-With: XMLHttpRequest` header on API routes
5. **CSP headers** with nonce-based script-src, `frame-ancestors 'none'`, `object-src 'none'`
6. **SQL injection prevention** via Drizzle ORM parameterized queries throughout
7. **Session invalidation** via `tokenInvalidatedAt` timestamp
8. **Comprehensive audit logging** with batch insertion reducing DB load
9. **User-Agent hashing** for session fingerprinting (audit-only)
10. **Trusted proxy configuration** for IP extraction with configurable trust hops
11. **Path traversal prevention** in file storage (`resolveStoredPath` validates against `..`, `/`, `\`)
12. **Open redirect prevention** (`getSafeRedirectUrl` validates same-origin absolute paths)
13. **Docker image validation** with regex patterns and trusted registry enforcement
14. **No ReDoS vulnerabilities** — all regex patterns use simple character classes
15. **No prototype pollution** — all user input flows through Zod schemas
16. **Good test coverage** across unit, integration, component, and E2E tests
17. **Proper cascade delete** configuration on most foreign keys
18. **Timing-safe dummy password hash** for non-existent users preventing enumeration
19. **Idempotent language config sync** using upsert with change detection
20. **Systemd hardening** with `ProtectSystem=strict`, `NoNewPrivileges=true`

---

## Priority Remediation Plan

### Phase 1 — Immediate (Security-Critical)

| Issue | Description |
|-------|-------------|
| C-01 | Fix XSS in problem description rendering |
| C-02 | Harden workspace directory isolation |
| C-03 | Fix submission rate limit TOCTOU |
| C-04 | Remove API key data from client-side code |
| C-05 | Add process exit handlers for audit buffer flush |
| C-06/07 | Make user creation uniqueness checks atomic |
| H-01 | Stop returning generated passwords in API responses |
| H-08 | Require separate plugin encryption key |

### Phase 2 — This Sprint (Data Integrity)

| Issue | Description |
|-------|-------------|
| C-08 | Configure connection pool limits |
| C-09 | Add functional index on `lower(username)` |
| H-05 | Fix group deletion race condition |
| H-06 | Add AbortController to similarity check |
| H-12 | Fix backup deletion safety |
| H-17 | Add index on `rate_limits.lastAttempt` |
| H-18 | Wrap user update + session invalidation in transaction |

### Phase 3 — Next Sprint (Hardening)

| Issue | Description |
|-------|-------------|
| H-02 | Fix password similarity user enumeration |
| H-03 | Fix recruiting token replay |
| H-09 | Fix rate limit deduplication |
| H-13 | Fix SSE connection cleanup race |
| M-01 | Reduce auth cache TTL |
| M-03 | Remove `unsafe-inline` from CSP |
| M-06 | Replace LIKE-based file access check |
| M-18/19 | Fix interval cleanup in components |

---

## Files Requiring Immediate Attention

1. `src/lib/compiler/execute.ts` — Container escape, command validation, seccomp
2. `src/components/problem-description.tsx` — XSS vulnerability
3. `src/app/api/v1/users/route.ts` — Race condition, password exposure
4. `src/app/api/v1/submissions/route.ts` — Rate limit TOCTOU
5. `src/lib/plugins/chat-widget/admin-config.tsx` — API key exposure
6. `src/lib/audit/events.ts` — Data loss on process exit
7. `src/lib/plugins/secrets.ts` — Encryption key separation
8. `src/lib/db/index.ts` — Connection pool configuration
9. `scripts/backup-db.sh` — Data loss risk
10. `src/app/api/v1/groups/[id]/route.ts` — Deletion race condition

---

## Remediation follow-up (workspace update)

After this review, the current workspace implemented a substantial portion of the reported issues. Notable fixes now present include:

- safer deploy SSH defaults and HTTPS-oriented `AUTH_URL` handling
- fixed proxy/client-IP trust for rate limiting
- capability-based auth on admin Docker image routes
- co-instructor-aware group access with TA restrictions on override powers
- export ordering + repeatable-read export snapshot hardening
- bounded JSON import/validate request parsing
- quick-create schedule validation
- recruiting-token fingerprint logging instead of raw prefix logging
- worker heartbeat interval + orphan-cleanup fixes
- CI enforcement for `tsc` and Rust tests
- removal of `ignoreBuildErrors` from `next.config.ts`

Validated in the current workspace with targeted Vitest suites, `npx tsc --noEmit`, Rust test runs, and `npm run build`.

Final note: all actionable code/configuration issues from this review were addressed in the current workspace. The only remaining item is the SSE / anti-cheat multi-instance behavior, which is now documented as a **single-app-instance deployment constraint** until shared-state coordination is introduced.
