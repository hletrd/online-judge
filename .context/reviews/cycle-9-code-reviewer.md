# Cycle 9 Code Reviewer Report

**Reviewer:** code-reviewer
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** Full codebase review focusing on code quality, logic, SOLID, maintainability

## Inventory of Files Reviewed

- `src/lib/auth/config.ts` — NextAuth configuration, JWT/session callbacks
- `src/lib/security/encryption.ts` — AES-256-GCM encryption/decryption
- `src/lib/db/export.ts` — Database export engine
- `src/lib/api/handler.ts` — API handler factory
- `src/lib/compiler/execute.ts` — Docker-sandboxed code execution
- `src/lib/realtime/realtime-coordination.ts` — SSE connection coordination
- `src/app/api/v1/submissions/route.ts` — Submissions API
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE events
- `src/app/api/v1/playground/run/route.ts` — Playground code execution
- `src/lib/assignments/code-similarity.ts` — Anti-cheat similarity check
- `src/lib/security/rate-limit.ts` — Rate limiting (prior fix verified)
- `src/lib/db/import.ts` — Database import
- `src/lib/db/schema.ts` / `schema.pg.ts` — DB schema

## Findings

### CR9-CR1 — [MEDIUM] `createSuccessfulLoginResponse` and `syncTokenWithUser` duplicate user field mapping

- **Confidence:** HIGH
- **File:** `src/lib/auth/config.ts:52-104`
- **Evidence:** Three separate locations map the same ~15 user fields into token/session objects:
  1. `createSuccessfulLoginResponse()` (line 52-76)
  2. `syncTokenWithUser()` (line 78-104)
  3. The `jwt` callback inline object (line 327-345)
  
  Adding a new user preference field requires changes in all three places. A missed update would silently drop the field from either the login response or the JWT token.
- **Failure scenario:** A developer adds a new preference column to the users table and updates `createSuccessfulLoginResponse` and `syncTokenWithUser` but forgets the `jwt` callback's inline object. The field would be present on login but lost on JWT refresh.
- **Suggested fix:** Extract a shared `mapUserToAuthFields(user: AuthUserRecord)` function that both `createSuccessfulLoginResponse` and `syncTokenWithUser` call, and use it in the jwt callback as well.

### CR9-CR2 — [MEDIUM] SSE events route `onPollResult` callback fires re-auth check but does not await it before processing status

- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:302-317`
- **Evidence:** The `onPollResult` callback starts an async re-auth check with `void (async () => { ... })()` but then continues processing the current status update. The comment says "the auth revocation will take effect on the next tick" — but if the auth check returns `null` (user deactivated), the `close()` call inside the async IIFE races with the status processing. If the status is terminal, the `close()` inside the async terminal-result fetch (line 343) and the `close()` from the auth check could double-fire.
- **Failure scenario:** A user is deactivated while a submission is being judged. The re-auth check fires `close()`, but simultaneously the terminal status is reached and also calls `close()`. While `close()` has an early-return guard (`if (closed) return`), the timing means the terminal `result` event might never be sent to the client — the auth-revocation `close()` wins the race, and the submission result is lost.
- **Suggested fix:** Await the re-auth check result before processing the status update. If re-auth fails, close immediately without processing the status. Alternatively, set a `revoked` flag and check it before enqueuing events.

### CR9-CR3 — [MEDIUM] `validateExport` does not check for duplicate table names in the import data

- **Confidence:** MEDIUM
- **File:** `src/lib/db/export.ts:306-327`
- **Evidence:** When iterating `Object.entries(tables)`, if the import data has duplicate keys like `{"users": {...}, "users": {...}}`, JSON.parse would keep only the last one (per JSON spec). But the validation only checks if each tableName is in `knownTables`. A maliciously crafted import file could pass validation with unexpected content if it exploits key shadowing.
- **Failure scenario:** This is low-risk in practice because `JSON.parse` deduplicates keys (last wins), and the import side iterates `Object.entries`. But it means the rowCount/rows validation might pass for a table that was silently replaced. Combined with an import that has extra unknown tables, the error messages could be misleading.
- **Suggested fix:** Track seen table names in a `Set` and warn if any table name appears more than once in the raw JSON (before parsing, or by checking against `Object.keys` length vs deduplicated set).

### CR9-CR4 — [LOW] Playground run route does not validate `stdin` length at the DB/config level

- **Confidence:** MEDIUM
- **File:** `src/app/api/v1/playground/run/route.ts:13-17`
- **Evidence:** The Zod schema limits `stdin` to 64KB (`MAX_STDIN_LENGTH = 64 * 1024`), but `executeCompilerRun` then appends a newline (`options.stdin.endsWith("\n") ? options.stdin : options.stdin + "\n"`). This is fine for most cases, but the stdin is also read into a `Buffer.from(stdinText, "utf8")` — if the stdin is exactly at the 64KB limit, the appended newline could push it slightly over. The executor doesn't re-validate stdin size.
- **Failure scenario:** A user submits exactly 65536 bytes of stdin. The Zod schema passes. The newline append makes it 65537 bytes. In practice this is negligible, but it's a consistency issue.
- **Suggested fix:** Either reduce the Zod max by 1 byte to account for the appended newline, or add a Buffer.byteLength check after appending.

### CR9-CR5 — [LOW] `realtime-coordination.ts` uses `LIKE` pattern for SSE key matching — potential performance concern at scale

- **Confidence:** LOW
- **File:** `src/lib/realtime/realtime-coordination.ts:94-95,107-108`
- **Evidence:** `acquireSharedSseConnectionSlot` queries `rateLimits` using `key LIKE 'realtime:sse:user:%'`. With a large number of SSE connections, this LIKE query on the `rateLimits` table could be slow if the table is large and lacks an index on `key`. The `rateLimits` table already has a `rl_key_idx` index, but prefix LIKE patterns may not use it efficiently depending on the PG version and collation.
- **Failure scenario:** Under high load with many SSE connections, the advisory lock + LIKE query pattern could create contention, slowing down SSE connection acquisition.
- **Suggested fix:** Monitor query performance; if needed, consider a dedicated `realtimeConnections` table or a partial index.

### CR9-CR6 — [LOW] `shareAcceptedSolutions` defaults differ between `createSuccessfulLoginResponse` and `syncTokenWithUser`

- **Confidence:** LOW
- **File:** `src/lib/auth/config.ts:66,93,337`
- **Evidence:** In `createSuccessfulLoginResponse` (line 66): `shareAcceptedSolutions: user.shareAcceptedSolutions ?? true`. In `syncTokenWithUser` (line 93): `shareAcceptedSolutions: user.shareAcceptedSolutions ?? true`. In the jwt callback inline (line 337): `shareAcceptedSolutions: user.shareAcceptedSolutions ?? true`. All three use `?? true`. But in the session callback (line 429): `session.user.shareAcceptedSolutions = token.shareAcceptedSolutions ?? true`. The default is consistent (`true`), but the triple repetition is fragile — see CR9-CR1.
- **Suggested fix:** Same as CR9-CR1 — extract shared mapping function.

## Previously Found Issues (Still Open)

The following deferred items from prior cycles remain open and verified as still present:

- D3: JWT callback DB query on every request (`src/lib/auth/config.ts:364`) — MEDIUM, still present
- D4: Test coverage gaps for workspace-to-public migration Phase 2 — MEDIUM
- D5: Backup/restore/migrate routes use manual auth pattern — LOW
- D6: Files/[id] DELETE/PATCH manual auth — LOW
- D7: SSE re-auth rate limiting — LOW
- D8: PublicHeader click-outside-to-close — LOW
- D9: `namedToPositional` regex alignment — LOW

## Previously Found Issues (Verified Fixed)

- AGG-2: Backup route `body` variable shadowing — FIXED (commit 8217a80d)
- AGG-3: `encryption.ts` key parsing on every call — FIXED (commit d6497263)
- AGG-4: `waitForReadableStreamDemand` 10ms polling — FIXED (commit 55d9cd3f)
- AGG-5: `recordRateLimitFailure` explicit `nanoid()` — Still present but LOW
- AGG-6: `processImage` 500 error — FIXED (commit 9e654740)
