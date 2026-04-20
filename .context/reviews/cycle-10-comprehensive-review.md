# Cycle 10 Deep Code Review — JudgeKit

**Date:** 2026-04-19
**Reviewer:** Comprehensive multi-angle review (code quality, security, performance, architecture, correctness, testing, design)
**Scope:** Full repository — `src/`, configuration files
**Delta from prior cycle:** Focus on new issues not covered in cycles 1-9, verifying previously reported items

---

## F1: `getRecruitingInvitationByToken()` uses `.select().from()` without column restriction
- **File**: `src/lib/assignments/recruiting-invitations.ts:163-169`
- **Severity**: MEDIUM | **Confidence**: High
- **Description**: `getRecruitingInvitationByToken()` calls `db.select().from(recruitingInvitations).where(...)` with no column restriction. This function is called in `redeemRecruitingToken()` (line 296-300) inside a transaction, meaning all columns — including `tokenHash` — are loaded into memory. The same file's other read functions (`getRecruitingInvitation()`, `getRecruitingInvitations()`) already use explicit column selection. Additionally, inside `redeemRecruitingToken()` at line 296-299, there's a second `tx.select().from(recruitingInvitations)` without column restriction, which loads the full row including the `tokenHash` column. While `tokenHash` is a SHA-256 hash (not the plaintext token), minimizing data exposure is defense-in-depth.
- **Concrete failure scenario**: A developer reading `getRecruitingInvitationByToken()` or `redeemRecruitingToken()` may not realize all columns are loaded. If a future column is added to `recruitingInvitations` containing sensitive data (e.g., PII), it would be silently exposed.
- **Fix**: Add explicit column selection to both `getRecruitingInvitationByToken()` and the inline query in `redeemRecruitingToken()`, matching the pattern used in `getRecruitingInvitation()`.

## F2: Problem GET endpoint leaks full problem data to non-managers before access check returns
- **File**: `src/app/api/v1/problems/[id]/route.ts:45-55`
- **Severity**: MEDIUM | **Confidence**: Medium
- **Description**: The GET handler fetches the full problem row with `db.query.problems.findFirst({ where: eq(problems.id, id) })` (no column restriction) at line 45 **before** checking access at line 49-50. If the user does not have access, `forbidden()` is returned at line 50, which is correct. However, the full problem data (including potentially hidden description, test cases when the manager branch is taken) is loaded into memory even for unauthorized users. More importantly, `findFirst` without `columns` restriction loads every column of the `problems` table, including fields like `description` which could contain private content for hidden problems.
- **Concrete failure scenario**: The data is loaded into server memory but never sent to the client (the `forbidden()` response is returned). This is not a data leak, but it is an unnecessary full-row fetch on every unauthorized access attempt. If the `problems` table grows large columns (e.g., very long descriptions), this is a minor performance issue.
- **Fix**: Add `columns: { id: true, authorId: true, visibility: true }` to the initial `findFirst` for the access check, then re-fetch full data only when access is granted.

## F3: `communityVotes` vote toggle is not atomic — race condition on concurrent votes
- **File**: `src/app/api/v1/community/votes/route.ts:72-97`
- **Severity**: MEDIUM | **Confidence**: Medium
- **Description**: The vote toggle logic reads the existing vote with `db.query.communityVotes.findFirst()` (line 72), then conditionally inserts, updates, or deletes (lines 81-97). This is a read-then-write pattern with no transaction or row lock. Two concurrent requests from the same user for the same target can both read "no existing vote" and both insert, resulting in duplicate vote rows. The `communityVotes` table likely has a unique constraint on `(targetType, targetId, userId)` which would cause one insert to fail with a constraint violation, resulting in a 500 error to the user instead of a clean response.
- **Concrete failure scenario**: User double-clicks the upvote button rapidly. Both requests read no existing vote at line 72. Both attempt `db.insert(communityVotes).values(...)` at line 91. The second insert fails with a PostgreSQL unique constraint violation, caught by the generic `createApiHandler` error handler which returns a 500. The user sees an error instead of a clean vote toggle.
- **Fix**: Wrap the vote toggle in a transaction with `SELECT ... FOR UPDATE` on the existing vote row, or use an `INSERT ... ON CONFLICT` upsert pattern.

## F4: Problem PATCH endpoint fetches full problem row twice without column restriction
- **File**: `src/app/api/v1/problems/[id]/route.ts:72,145`
- **Severity**: LOW | **Confidence**: High
- **Description**: The PATCH handler calls `db.query.problems.findFirst({ where: eq(problems.id, id) })` at line 72 without `columns` restriction, then calls it again at line 145 (also without `columns` restriction, but with `with: { testCases: true }`). The first fetch loads all columns to check existence and get current values for the patch merge. The second fetch loads the updated row for the response. Both are full-row reads. The first fetch could use `columns: { id: true, authorId: true, title: true, description: true, ... }` to only load the fields needed for the merge.
- **Concrete failure scenario**: Minor performance waste on every PATCH request — two full-row reads when partial reads would suffice.
- **Fix**: Add `columns` restriction to the first `findFirst` at line 72, listing only the fields needed for the merge logic.

## F5: `redeemRecruitingToken` uses `new Date()` for deadline comparison inside transaction instead of PostgreSQL `NOW()`
- **File**: `src/lib/assignments/recruiting-invitations.ts:375,410`
- **Severity**: LOW | **Confidence**: Medium
- **Description**: Inside `redeemRecruitingToken()`, the deadline comparison at lines 375 and 410 uses `new Date()` (application server time) instead of PostgreSQL `NOW()` for the comparison. This is a specific instance of the clock-skew concern noted in the deferred item D2. The interesting aspect is that the atomic claim at line 463-469 correctly uses `NOW()` in the SQL (`${recruitingInvitations.expiresAt} > NOW()`), creating an inconsistency: the initial validation at line 410 uses application time, but the atomic claim uses database time. If the application server clock is slightly ahead of the database clock, a request could pass the initial validation (deadline not yet passed per app time) but fail the atomic claim (deadline already passed per DB time), resulting in the transaction rolling back with "alreadyRedeemed" error even though the token is still valid — a confusing error message.
- **Concrete failure scenario**: App server clock is 5 seconds ahead of DB clock. A token expires at exactly 12:00:00. At 11:59:57 app time (11:59:52 DB time), the user submits a redeem request. The initial check at line 410 passes (11:59:57 < 12:00:00). The atomic claim at line 467 uses `NOW()` which returns 11:59:52 DB time, and the `expiresAt > NOW()` check passes correctly. No failure in this direction. However, if the app server clock is behind the DB clock (DB says 12:00:05, app says 12:00:00), the initial check passes but the atomic claim fails because DB NOW() is past the deadline. The user gets "alreadyRedeemed" instead of "contestClosed".
- **Fix**: This is already tracked as D2 (deferred). The specific error message mismatch could be fixed by changing the thrown error from "alreadyRedeemed" to a more specific message that distinguishes "expired" from "already redeemed", but this is LOW severity.

## F6: `invite/route.ts` LIKE search doesn't use ILIKE for case-insensitive matching on `users.name`
- **File**: `src/app/api/v1/contests/[assignmentId]/invite/route.ts:46`
- **Severity**: LOW | **Confidence**: High
- **Description**: The invite search uses `sql\`lower(${users.name}) like ${likePattern} escape '\\'\``. This works correctly because both the column value and the pattern are lowercased. However, the `users.username` search at line 45 also uses `lower()`. In contrast, `recruiting-invitations.ts:109` uses `ILIKE` without `lower()`. The patterns are functionally equivalent but inconsistent across the codebase. The `ILIKE` approach is cleaner and allows PostgreSQL to potentially use an index (if a case-insensitive index exists).
- **Concrete failure scenario**: No functional failure — both approaches produce correct case-insensitive results. The inconsistency is a maintainability concern.
- **Fix**: Standardize on either `ILIKE` or `lower() + LIKE` across the codebase. Prefer `ILIKE` for readability.

## F7: `validateShellCommand` regex uses `\beval\b` which can reject legitimate commands containing "eval" as a substring
- **File**: `src/lib/compiler/execute.ts:156`
- **Severity**: LOW | **Confidence**: Medium
- **Description**: The regex `/\beval\b/` matches word boundaries. As the code's own comment on line 147 notes, this rejects tokens like "eval-xxx" where a hyphen follows "eval". The Rust worker uses `split_whitespace` which only rejects the exact token "eval". This divergence is acknowledged in the comment as a "safe false-positive." However, there are legitimate tools/commands that might contain "eval" as a word-boundary-adjacent substring, such as `reval` (a Ruby eval tool) or script filenames like `evaluate.sh`. The `\b` word boundary considers hyphens as boundaries, so `my-eval-script.sh` would match `\beval\b` and be rejected, while it would pass the Rust validator.
- **Concrete failure scenario**: An admin configures a compile command like `sh -c "my-eval-script.sh && cc ..."` which would be rejected by the Node.js validator but accepted by the Rust runner. The fallback path would fail while the primary runner would succeed, causing inconsistent behavior.
- **Fix**: Align the Node.js validator with the Rust one by replacing `\beval\b` with a split-on-whitespace check that only matches the exact token "eval".

## F8: `readStreamTextWithLimit` does not account for multi-byte character truncation
- **File**: `src/lib/db/import-transfer.ts:10-21`
- **Severity**: LOW | **Confidence**: Medium
- **Description**: The `readStreamTextWithLimit` function reads chunks from a stream and concatenates them using `TextDecoder.decode(value, { stream: true })`. The byte-count limit check at line 16 (`total += value.byteLength; if (total > limit)`) counts raw bytes correctly. However, the final `decoder.decode()` at line 23 could produce a partial multi-byte character if the stream was truncated mid-character at the byte boundary. This would cause `JSON.parse` at line 47 to throw a syntax error, which is caught and converted to an "invalidJson" error. The error message is misleading — it suggests invalid JSON when the real issue is that the stream was too large and was cut mid-character.
- **Concrete failure scenario**: A 100 MB JSON body is uploaded where the 100 MB boundary falls in the middle of a multi-byte UTF-8 character (e.g., Korean text). The stream read stops at the byte limit, the decoder produces a replacement character, and JSON.parse fails with "invalidJson" instead of "fileTooLarge". The admin sees a confusing error.
- **Fix**: Before throwing "fileTooLarge", check if the decoder produced replacement characters. Alternatively, move the size check to the `Content-Length` header validation (already done at line 32-36) and make the stream-level check a safety net with a clearer error.

---

## Summary Statistics
- Total new findings this cycle: 8
- Critical: 0
- High: 0
- Medium: 3 (F1 — uncolumned select on recruiting invitations, F2 — full problem row fetched before access check, F3 — vote toggle race condition)
- Low: 5 (F4 — double full-row fetch in problem PATCH, F5 — clock skew inconsistency in redeem, F6 — LIKE vs ILIKE inconsistency, F7 — eval regex divergence from Rust, F8 — multi-byte truncation in stream reader)
