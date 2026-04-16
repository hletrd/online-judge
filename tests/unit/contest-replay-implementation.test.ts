import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("contest replay animation implementation", () => {
  it("uses FLIP-style row animation when the replay snapshot changes", () => {
    const source = read("src/components/contest/contest-replay.tsx");

    expect(source).toContain("useLayoutEffect");
    expect(source).toContain("getBoundingClientRect");
    expect(source).toContain("requestAnimationFrame");
    expect(source).toContain('row.style.transition = "transform 450ms ease"');
    expect(source).toContain("rowRefs.current.set(entry.userId, node)");
  });
});
