import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("access code schema implementation", () => {
  it("marks assignment access codes unique in both PostgreSQL and MySQL schemas", () => {
    const pgSource = read("src/lib/db/schema.pg.ts");
    const mysqlSource = read("src/lib/db/schema.mysql.ts");

    expect(pgSource).toContain('uniqueIndex("assignments_access_code_unique").on(table.accessCode)');
    expect(mysqlSource).toContain('uniqueIndex("assignments_access_code_unique").on(table.accessCode)');
  });
});
