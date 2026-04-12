import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("admin dashboard implementation", () => {
  it("surfaces quick links for common admin operations", () => {
    const source = read("src/app/(dashboard)/dashboard/_components/admin-dashboard.tsx");

    expect(source).toContain('CardTitle>{t("adminQuickActions")}');
    expect(source).toContain('href="/dashboard/admin/workers"');
    expect(source).toContain('href="/dashboard/admin/languages"');
    expect(source).toContain('href="/dashboard/admin/users"');
    expect(source).toContain('href="/dashboard/admin/audit-logs"');
  });
});
