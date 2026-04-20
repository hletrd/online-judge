# Cycle 18 Debugger Findings

**Date:** 2026-04-19
**Reviewer:** Latent bug surface, failure modes, regressions
**Base commit:** 7c1b65cc

---

## Findings

### F1: `import-transfer.ts` string concatenation in streaming read can cause OOM for large uploads

- **File**: `src/lib/db/import-transfer.ts:20`
- **Severity**: MEDIUM
- **Confidence**: MEDIUM
- **Description**: Same as code-reviewer F2. The `text += decoder.decode(value, { stream: true })` pattern in `readStreamTextWithLimit` creates a new string on every chunk, doubling the memory usage during accumulation. For a 100 MB upload, peak memory usage is ~200 MB (original string + new string during concatenation). Combined with `JSON.parse(text)` which creates another copy, peak usage is ~300 MB. This can cause OOM in a memory-constrained Docker container (e.g., 512 MB limit).
- **Concrete failure scenario**: Admin uploads a 95 MB database export on a production server running in a 512 MB container. The upload processing consumes 300 MB, leaving only 212 MB for the running Next.js process. If other requests are being processed simultaneously, the container runs out of memory and the process is killed.
- **Suggested fix**: For the file upload path, use `file.arrayBuffer()` instead of streaming, since `file.size` is already checked. For the streaming path, use `Uint8Array` accumulation instead of string concatenation, then decode once at the end.

### F2: `updateRecruitingInvitation` uses `new Date()` for `updatedAt` — clock skew risk on distributed deployments

- **File**: `src/lib/assignments/recruiting-invitations.ts:193`
- **Severity**: LOW
- **Confidence**: MEDIUM
- **Description**: The `updateRecruitingInvitation` function sets `updatedAt: new Date()` in JavaScript, while other parts of the recruiting flow (e.g., `redeemRecruitingToken`) use SQL `NOW()` for date comparisons. In a distributed deployment where the app server clock differs from the DB server clock, the JS-side `new Date()` can create timestamps that are inconsistent with SQL-generated timestamps. This could cause confusing ordering in audit logs or race conditions in time-based queries.
- **Concrete failure scenario**: App server clock is 2 seconds ahead of DB server. Admin revokes an invitation at time T (JS). The `updatedAt` is set to T+2s (JS time). Meanwhile, a candidate tries to redeem at time T+1s (DB time). The SQL `expiresAt > NOW()` check passes because DB time is T+1s, but the invitation's `updatedAt` is already T+2s, creating a temporal inconsistency.
- **Suggested fix**: Use SQL `NOW()` for `updatedAt` in update queries, consistent with how other date comparisons are handled in the recruiting flow.

---

## Verified Safe

### VS1: No race conditions in recruiting token redemption
- Atomic SQL claim with `UPDATE ... WHERE status = 'pending' AND (expiresAt IS NULL OR expiresAt > NOW())` prevents concurrent claims.

### VS2: No unhandled promise rejections in SSE route
- All async IIFEs have `.catch()` handlers.

### VS3: No integer overflow risks in scoring calculations
- All score values use `ROUND(..., 2)` in SQL and `Math.round(x * 100) / 100` in JS, keeping values in a reasonable range.
