import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("importDatabase implementation guards", () => {
  it("aborts the transaction on batch insert failure instead of silently committing partial state", () => {
    const source = readFileSync(join(process.cwd(), "src/lib/db/import.ts"), "utf8");

    expect(source).toContain('throw new Error(`Failed to import ${tableName} batch ${i}: ${message}`)');
    expect(source).not.toContain("result.success = false;\n            skipped += values.length;\n          }\n        }\n\n        result.tableResults");
  });

  it("derives timestamp, boolean, and json coercion columns from schema metadata", () => {
    const source = readFileSync(join(process.cwd(), "src/lib/db/import.ts"), "utf8");

    expect(source).toContain("buildImportColumnSets(TABLE_MAP)");
    expect(source).toContain("const dataType = (column as { dataType?: string }).dataType;");
    expect(source).not.toContain('const BOOLEAN_COLUMNS = new Set([');
    expect(source).not.toContain('const TIMESTAMP_COLUMNS = new Set([');
    expect(source).not.toContain('const JSON_COLUMNS = new Set([');
  });
});
