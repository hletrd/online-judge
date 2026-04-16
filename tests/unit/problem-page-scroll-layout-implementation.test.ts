import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("problem page scroll layout implementation", () => {
  it("keeps the submission panel sticky only on large screens so stacked mobile layouts can scroll normally", () => {
    const source = read("src/app/(dashboard)/dashboard/problems/[id]/page.tsx");

    expect(source).toContain('<Card className="sticky top-6">');
    expect(source).toContain("grid grid-cols-1 lg:grid-cols-2 gap-6");
  });
});
