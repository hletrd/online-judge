import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Dependabot configuration", () => {
  it("covers npm, cargo workspaces, and GitHub Actions", () => {
    const config = read(".github/dependabot.yml");

    expect(config).toContain('package-ecosystem: "npm"');
    expect(config).toContain('directory: "/judge-worker-rs"');
    expect(config).toContain('directory: "/code-similarity-rs"');
    expect(config).toContain('directory: "/rate-limiter-rs"');
    expect(config).toContain('package-ecosystem: "github-actions"');
    expect(config).toContain('interval: "weekly"');
  });
});
