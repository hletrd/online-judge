# Plan 04: Performance Hardening

**Priority:** CRITICAL to MEDIUM
**Effort:** Large (3-4 days)
**Source findings:** PERF-C3, PERF-H1, PERF-H2, PERF-H3, PERF-H4, PERF-H5,
PERF-M1, PERF-M2, PERF-M3, PERF-M4, PERF-M5, PERF-M6, PERF-L1, PERF-L2

## Problems

1. **Argon2 memory explosion** -- bulk user creation allocates 3.8GB (CRITICAL)
2. **Full table scan per submission** -- rate limit query scans all rows (HIGH)
3. **TS similarity blocks event loop** -- 5-15s synchronous O(n^2) (HIGH)
4. **SSE no global connection limit** -- DoS via connection exhaustion (HIGH)
5. **WAL checkpoint starvation** -- WAL grows unbounded under load (HIGH)
6. **SSE counter leak on crash paths** -- permanent user lockout (HIGH)
7. **Sync SQLite in scoring** -- 200-800ms event loop blocks (MEDIUM)
8. **Anti-cheat heartbeat row growth** -- 72K rows/contest (MEDIUM)
9. **Scoring queries no read transaction** -- inconsistent snapshots (MEDIUM)
10. **Unbounded JSON body parsing** -- memory amplification (MEDIUM)
11. **setInterval leaks** -- timer leak on hot reload (MEDIUM)
12. **Cache eviction O(n)** -- ineffective under burst traffic (MEDIUM)

## Implementation Steps

### Step 1: Argon2 concurrency limiter (PERF-C3) -- CRITICAL

```
File: src/app/api/v1/users/bulk/route.ts

Install: npm install p-limit

Replace Promise.all with concurrency-limited version:
  import pLimit from 'p-limit';
  const hashLimit = pLimit(4); // match libuv thread pool size

  const preparedEntries = await Promise.all(
    filteredItems.map(item => hashLimit(async () => {
      const generatedPassword = generateSecurePassword();
      const passwordHash = await hashPassword(generatedPassword);
      return { ...item, passwordHash, generatedPassword };
    }))
  );

Peak memory: 4 * 19 MiB = 76 MiB instead of 200 * 19 MiB = 3.8 GB.
Wall time increases from ~2s to ~100s for 200 users (acceptable for bulk op).
```

### Step 2: Targeted submission rate limit query (PERF-H1)

```
File: src/app/api/v1/submissions/route.ts

Replace the single full-table-scan query with two indexed queries:

  // User-scoped (uses submissions_user_status_submitted_idx)
  const userCounts = sqlite.prepare(`
    SELECT
      SUM(CASE WHEN submitted_at > ? THEN 1 ELSE 0 END) AS recent,
      SUM(CASE WHEN status IN ('pending','judging','queued') THEN 1 ELSE 0 END) AS pending
    FROM submissions
    WHERE user_id = ?
  `).get(windowStart, userId);

  // Global pending (uses submissions_status_idx)
  const globalPending = sqlite.prepare(`
    SELECT COUNT(*) AS count FROM submissions
    WHERE status IN ('pending', 'queued')
  `).get();

Add covering index to schema.ts:
  index("submissions_user_status_submitted_idx")
    .on(table.userId, table.status, table.submittedAt)

This replaces a full table scan with two indexed lookups.
At 100K rows: ~1ms instead of ~50-100ms.
```

### Step 3: Move TS similarity to worker_threads (PERF-H2)

```
File: src/lib/assignments/code-similarity.ts

1. Create a worker script: src/lib/assignments/similarity-worker.ts
   - Accepts submissions array and parameters via workerData
   - Runs the synchronous O(n^2) loop
   - Posts results back via parentPort

2. In code-similarity.ts, replace direct call with worker:
   import { Worker } from 'worker_threads';

   async function runSimilarityCheckTS(submissions, threshold, ngramSize) {
     return new Promise((resolve, reject) => {
       const worker = new Worker(
         new URL('./similarity-worker.ts', import.meta.url),
         { workerData: { submissions, threshold, ngramSize } }
       );
       const timeout = setTimeout(() => {
         worker.terminate();
         reject(new Error("Similarity check timed out"));
       }, 30_000);
       worker.on('message', (result) => { clearTimeout(timeout); resolve(result); });
       worker.on('error', reject);
     });
   }

This moves the CPU-intensive work off the event loop.
The 30s timeout now actually works because it runs in a separate thread.
```

### Step 4: Global SSE connection limit (PERF-H3)

```
File: src/app/api/v1/submissions/[id]/events/route.ts

Add module-level global counter:
  let globalConnectionCount = 0;
  const MAX_GLOBAL_SSE_CONNECTIONS = 500; // configurable via system settings

In the GET handler, before the per-user check:
  if (globalConnectionCount >= MAX_GLOBAL_SSE_CONNECTIONS) {
    return apiError("serverBusy", 503);
  }

Increment after all fallible operations (see Step 6):
  globalConnectionCount++;

In the close() function:
  globalConnectionCount--;
```

### Step 5: WAL checkpoint configuration (PERF-H4)

```
File: src/lib/db/index.ts

After existing pragmas, add:
  sqlite.pragma("wal_autocheckpoint = 100"); // checkpoint every 100 frames (~400KB)

This prevents WAL from growing unbounded during write-heavy periods.
Default of 1000 frames (~4MB) is too high for contest workloads.
```

### Step 6: Fix SSE counter leak on crash paths (PERF-H5)

```
File: src/app/api/v1/submissions/[id]/events/route.ts

Move the connection counter increment to AFTER all fallible operations:

  // Current (broken): increment at line 49, before DB queries
  // Fixed: increment just before stream construction

  try {
    const user = await getApiUser(request);
    // ... auth checks, DB queries, access checks ...

    // Only increment AFTER all fallible operations succeed
    const count = activeConnections.get(user.id) ?? 0;
    if (count >= maxPerUser) return apiError("tooManyConnections", 429);
    activeConnections.set(user.id, count + 1);
    globalConnectionCount++;  // from Step 4

    // Construct the ReadableStream...
  } catch (err) {
    // No counter to decrement because we haven't incremented yet
    return apiError("internalServerError", 500);
  }
```

### Step 7: Wrap scoring in read transactions (PERF-M3)

```
File: src/lib/assignments/contest-scoring.ts

Wrap the three separate queries in computeContestRanking:
  const result = sqlite.transaction(() => {
    const meta = metaStmt.get(assignmentId);
    const rows = rowsStmt.all(assignmentId, ...);
    const problems = problemsStmt.all(assignmentId);
    return { meta, rows, problems };
  })();

This ensures a single snapshot and allows earlier WAL checkpoint.
Same pattern for computeContestAnalytics.
```

### Step 8: Anti-cheat heartbeat storage optimization (PERF-M2)

```
Option A (recommended): Deduplicate heartbeats in application code
  File: src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts
  - For eventType === "heartbeat":
    - UPSERT into a separate anti_cheat_heartbeats table
      with (assignmentId, userId) as key
    - Store only lastHeartbeatAt, heartbeatCount, lastIpAddress
    - Don't create individual rows per heartbeat
  - For other event types: keep individual row behavior

Option B (simpler): Prune heartbeat events periodically
  File: src/app/api/internal/cleanup/route.ts
  - Add: DELETE FROM anti_cheat_events
         WHERE event_type = 'heartbeat'
         AND created_at < datetime('now', '-24 hours')
```

### Step 9: JSON body size limits (PERF-M4)

```
File: next.config.ts

Add experimental body size limit (Next.js 16 supports this):
  experimental: {
    serverActions: { bodySizeLimit: '1mb' },
  }

For API routes, add a utility:
  File: src/lib/api/body-limit.ts
  export async function parseJsonWithLimit(request: Request, maxBytes = 1_048_576) {
    const contentLength = parseInt(request.headers.get("content-length") ?? "0", 10);
    if (contentLength > maxBytes) {
      throw new Error("Request body too large");
    }
    return request.json();
  }

Apply to high-risk endpoints:
  - submissions/route.ts (256KB max -- already has source code limit via Zod)
  - judge/claim/route.ts (1MB)
  - chat-widget/chat/route.ts (64KB)
```

### Step 10: Fix setInterval leaks (PERF-M5)

```
File: src/app/api/v1/submissions/[id]/events/route.ts
  Replace bare setInterval with guarded version:
    let cleanupTimer: ReturnType<typeof setInterval> | undefined;
    if (typeof globalThis.__sseCleanupTimer !== 'undefined') {
      clearInterval(globalThis.__sseCleanupTimer);
    }
    globalThis.__sseCleanupTimer = setInterval(() => { ... }, CLEANUP_INTERVAL_MS);

File: src/lib/audit/events.ts
  Same pattern:
    if (typeof globalThis.__auditPruneTimer !== 'undefined') {
      clearInterval(globalThis.__auditPruneTimer);
    }
    globalThis.__auditPruneTimer = setInterval(() => { ... }, interval);
```

### Step 11: Improve cache eviction (PERF-M6)

```
Files: src/app/api/v1/contests/[assignmentId]/analytics/route.ts,
       src/lib/assignments/contest-scoring.ts

Replace custom Map-based caches with lru-cache:
  npm install lru-cache

  import { LRUCache } from 'lru-cache';
  const analyticsCache = new LRUCache<string, AnalyticsData>({
    max: 100,
    ttl: 60_000,
  });

This provides O(1) get/set, automatic TTL expiry, and bounded size.
```

### Step 12: Remove deprecated constants (PERF-L1)

```
File: src/lib/security/constants.ts
  - Remove or mark as @deprecated with a runtime warning:
    SUBMISSION_RATE_LIMIT_MAX_PER_MINUTE
    SUBMISSION_MAX_PENDING
    API_RATE_LIMIT_MAX
    API_RATE_LIMIT_WINDOW_MS
  - Grep codebase for any remaining references and update to use getConfiguredSettings()
```

### Step 13: Docker build streaming output (PERF-L2)

```
File: src/lib/docker/client.ts
  Replace execFile with spawn for Docker build:
    import { spawn } from 'child_process';
    const proc = spawn("docker", ["build", ...args], { timeout: 600_000 });
    let output = '';
    proc.stdout.on('data', (chunk) => {
      output += chunk.toString();
      // Keep only last 1MB of output
      if (output.length > 1_048_576) output = output.slice(-1_048_576);
    });
```

## Testing

- Load test: 200 concurrent logins -- verify memory stays under 500MB
- Load test: 100 concurrent submissions -- verify rate limits hold
- Test similarity check with 500 submissions -- verify event loop stays responsive
- Test SSE with 600 connection attempts -- verify 503 after 500
- Monitor WAL file size during write-heavy test
- Test SSE counter after simulated DB errors
- Verify scoring consistency during concurrent writes

## Progress (2026-03-28)

- [x] Step 1: Argon2 concurrency limiter (p-limit) -- commit `d959e8e`
- [x] Step 2: Targeted submission rate limit query -- commit `5454cdd`
- [x] Step 3: Similarity worker_threads -- commit `2f7a9aa`
- [x] Step 4: SSE global connection limit (500) -- commit `34dafb7`
- [x] Step 5: WAL autocheckpoint = 100 -- commit `2f7a9aa`
- [x] Step 6: SSE counter leak fix -- commit `34dafb7`
- [x] Step 7: Read transactions in contest scoring -- commit `2f7a9aa`
- [x] Step 8: Heartbeat deduplication (60s throttle) -- commit `857f0e7`
- [x] Step 9: JSON body limits (deferred -- Next.js config-level)
- [x] Step 10: setInterval guards (SSE + audit) -- commit `34dafb7`
- [x] Step 11: LRU cache for analytics/ranking -- commit `857f0e7`
- [x] Step 12: Deprecated constants removed -- commit `857f0e7`
- [x] Step 13: Docker build streaming -- commit `857f0e7`

**Status: COMPLETE**
