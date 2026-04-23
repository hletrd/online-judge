# Architecture Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** architect
**Base commit:** 16cf7ecf

## Inventory of Files Reviewed

- `src/lib/db/import.ts` — Import engine
- `src/lib/db/export.ts` — Export engine
- `src/lib/realtime/realtime-coordination.ts` — Realtime coordination
- `src/lib/security/` — Security modules
- `src/lib/plugins/chat-widget/` — Chat widget (component + tools + route)
- `src/app/api/v1/` — API route structure
- `src/lib/docker/client.ts` — Docker client dual-path

## Findings

### ARCH-1: Import engine `TABLE_MAP` and export `TABLE_ORDER` are independently maintained lists — schema drift risk [MEDIUM/MEDIUM]

**File:** `src/lib/db/import.ts:15-55`, `src/lib/db/export.ts:156-202`

**Description:** The import engine uses `TABLE_MAP` (a `Record<string, any>`) and the export engine uses `TABLE_ORDER` (an ordered array with `name`, `table`, `orderColumns`). These are independently maintained lists that must stay in sync with each other and with the schema. If a table is added to the schema but only to one of these lists, either exports will include it but imports will skip it, or vice versa. This was identified as AGG-6 in cycle 33 but remains unfixed.

**Concrete failure scenario:** A developer adds a `contestAnnouncements` table to the schema and adds it to `TABLE_ORDER` for export but forgets `TABLE_MAP` for import. An export includes the table, but an import silently skips it. The imported database is missing all announcement data.

**Fix:** Derive `TABLE_MAP` from `TABLE_ORDER` to ensure they are always in sync:
```typescript
// In import.ts
import { TABLE_ORDER } from "./export";

const TABLE_MAP: Record<string, any> = {};
for (const { name, table } of TABLE_ORDER) {
  TABLE_MAP[name] = table;
}
```

**Confidence:** High

---

### ARCH-2: Duplicate password rehash logic across three locations — DRY violation [LOW/MEDIUM]

**File:** `src/app/api/v1/admin/migrate/import/route.ts:64-74, 164-174`, `src/app/api/v1/admin/restore/route.ts:63-73`

**Description:** The exact same password verification + rehash logic is duplicated three times. This creates maintenance risk and inconsistent audit coverage. See CR-3 in code-reviewer review for the same finding with proposed fix.

**Confidence:** High

---

### Previously Fixed Items

- AGG-4 (files route POST bypasses createApiHandler): Fixed in commit 9e277929
