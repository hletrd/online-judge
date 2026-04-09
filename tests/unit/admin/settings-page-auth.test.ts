import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("admin settings page authorization", () => {
  it("uses the system.settings capability instead of a hard-coded super_admin role gate", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/(dashboard)/dashboard/admin/settings/page.tsx"),
      "utf8"
    );

    expect(source).toContain('caps.has("system.settings")');
    expect(source).not.toContain('session.user.role !== "super_admin"');
  });
});
