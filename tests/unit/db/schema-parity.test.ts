import { describe, it, expect } from "vitest";
import { getTableName, getTableColumns } from "drizzle-orm";
import * as pgSchema from "@/lib/db/schema.pg";

/**
 * Verify that the PostgreSQL schema is well-formed: every exported table
 * has a valid name and columns. Multi-dialect schema parity tests are no
 * longer needed since only PostgreSQL is supported.
 */

function getExportedTables(schemaModule: Record<string, unknown>) {
  const tables: Record<string, { tableName: string; columns: string[] }> = {};

  for (const [exportName, value] of Object.entries(schemaModule)) {
    if (value && typeof value === "object" && Symbol.for("drizzle:Name") in (value as any)) {
      try {
        const tableName = getTableName(value as any);
        const columns = Object.keys(getTableColumns(value as any)).sort();
        tables[exportName] = { tableName, columns };
      } catch {
        // Not a table, skip
      }
    }
  }

  return tables;
}

describe("Schema Integrity", () => {
  const pgTables = getExportedTables(pgSchema as any);

  it("should export at least one table", () => {
    expect(Object.keys(pgTables).length).toBeGreaterThan(0);
  });

  it("every table should have a non-empty name", () => {
    for (const [, table] of Object.entries(pgTables)) {
      expect(table.tableName.length).toBeGreaterThan(0);
    }
  });

  it("every table should have at least one column", () => {
    for (const [exportName, table] of Object.entries(pgTables)) {
      expect(table.columns.length, `${exportName} should have columns`).toBeGreaterThan(0);
    }
  });

  it("no two tables should share the same runtime name", () => {
    const names = Object.values(pgTables).map((t) => t.tableName);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });
});
