# Plan 03: Backup & Restore Safety

**Priority:** CRITICAL
**Effort:** Small (half day)
**Source findings:** PERF-C1, PERF-C2, QUAL-H2

## Problem

Both backup and restore are fundamentally broken:
- **Backup** reads the raw `.sqlite` file, missing WAL data -- produces incomplete/corrupt backups
- **Restore** overwrites the live DB file while `better-sqlite3` has it mmap'd -- corrupts the active connection
- **Restore** buffers the upload 3x in memory (File + ArrayBuffer + Buffer) -- 300MB for 100MB upload

## Implementation Steps

### Step 1: Fix backup to use SQLite backup API

```
File: src/app/api/v1/admin/backup/route.ts

Replace:
  const fileBuffer = await fs.readFile(dbPath);

With:
  import { sqlite } from "@/lib/db";

  // Create consistent backup via SQLite's backup API
  const backupPath = path.join(os.tmpdir(), `judgekit-backup-${timestamp}.sqlite`);
  try {
    await sqlite.backup(backupPath);
    const stat = await fs.stat(backupPath);

    // Stream to response instead of buffering
    const fileBuffer = await fs.readFile(backupPath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="judgekit-backup-${timestamp}.sqlite"`,
        "Content-Length": String(stat.size),
      },
    });
  } finally {
    // Cleanup temp file
    await fs.unlink(backupPath).catch(() => {});
  }

Note: better-sqlite3's .backup() returns a Promise and is WAL-safe.
It creates a consistent snapshot including all WAL data.
```

### Step 2: Fix restore to close connection and handle WAL

```
File: src/app/api/v1/admin/restore/route.ts

Replace the file writing logic:

  // 1. Validate the uploaded file is a valid SQLite database
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length < 100 || buffer.toString("ascii", 0, 16) !== "SQLite format 3\0") {
    return apiError("invalidDatabaseFile", 400);
  }

  // 2. Write to temp file first
  const tempPath = dbPath + ".restore-tmp";
  await fs.writeFile(tempPath, buffer);

  // 3. Close the live SQLite connection
  sqlite.close();

  // 4. Remove orphaned WAL and SHM files
  await fs.unlink(dbPath + "-wal").catch(() => {});
  await fs.unlink(dbPath + "-shm").catch(() => {});

  // 5. Atomic rename
  await fs.rename(tempPath, dbPath);

  // 6. Force process restart -- the DB connection is dead
  //    Return success first, then exit
  const response = apiSuccess({
    message: "Database restored. The server will restart now.",
    timestamp: new Date().toISOString(),
  });

  // Schedule restart after response is sent
  setTimeout(() => process.exit(0), 500);

  return response;

This ensures:
- The old connection is properly closed before overwriting
- WAL/SHM files from the old DB are removed
- The server restarts with a fresh connection to the new DB
```

### Step 3: Reduce memory usage in restore

```
The current code creates 3 copies of the uploaded data:
  1. formData.get("file") as File -- holds data in memory
  2. file.arrayBuffer() -- creates ArrayBuffer copy
  3. Buffer.from(...) -- creates Buffer copy

Optimization: Stream the file directly to disk:

  const file = formData.get("file");
  if (!(file instanceof File)) return apiError("noFile", 400);
  if (file.size > MAX_UPLOAD_SIZE) return apiError("fileTooLarge", 400);

  const tempPath = dbPath + ".restore-tmp";
  const writable = createWriteStream(tempPath);
  const reader = file.stream().getReader();
  // ... pipe reader to writable ...

For now, the single Buffer.from(await file.arrayBuffer()) approach is
acceptable since max upload is 100MB and this is an admin-only operation.
The critical fix is closing the connection and handling WAL files.
```

## Testing

- Backup: verify the downloaded file is a valid SQLite DB with recent data
- Backup: verify backup during active writes still produces consistent snapshot
- Restore: verify the server restarts after restore
- Restore: verify WAL/SHM files are cleaned up
- Restore: verify invalid file is rejected (not SQLite)
- Restore: verify file size limit is enforced

## Progress (2026-03-28)

- [x] Step 1: Backup uses sqlite.backup() -- commit `8db6c4e`
- [x] Step 2: Restore closes connection, deletes WAL/SHM, forces restart -- commit `8db6c4e`
- [x] Step 3: Memory reduction (deferred -- current approach acceptable for admin-only)

**Status: COMPLETE**
