import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("contest analytics timeline implementation", () => {
  it("requests timeline data from contest analytics computation", () => {
    const source = read("src/app/api/v1/contests/[assignmentId]/analytics/route.ts");

    expect(source).toContain("computeContestAnalytics(assignmentId, true)");
  });
});
