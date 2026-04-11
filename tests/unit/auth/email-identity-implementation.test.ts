import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("email identity implementation guards", () => {
  it("normalizes email casing consistently across login and user-management entrypoints", () => {
    const authConfig = read("src/lib/auth/config.ts");
    const userActions = read("src/lib/actions/user-management.ts");
    const usersRoute = read("src/app/api/v1/users/route.ts");
    const userByIdRoute = read("src/app/api/v1/users/[id]/route.ts");
    const bulkUsersRoute = read("src/app/api/v1/users/bulk/route.ts");

    expect(authConfig).toContain("where: sql`lower(${users.email}) = lower(${identifier})`");
    expect(userActions).toContain('const normalizedEmail = data.email?.trim().toLowerCase() || null;');
    expect(usersRoute).toContain("const normalizedEmail = email?.trim().toLowerCase() || null;");
    expect(userByIdRoute).toContain("return normalized?.toLowerCase() ?? null;");
    expect(bulkUsersRoute).toContain("item.email.trim().toLowerCase()");
  });
});
