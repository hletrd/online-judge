import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("high-stakes runtime implementation", () => {
  it("ships a dedicated runtime-check script for high-stakes deployments", () => {
    const source = read("scripts/check-high-stakes-runtime.sh");

    expect(source).toContain("REALTIME_COORDINATION_BACKEND=postgresql");
    expect(source).toContain("COMPILER_RUNNER_URL must be set");
    expect(source).toContain("ENABLE_COMPILER_LOCAL_FALLBACK=1 is not allowed");
  });

  it("documents the validation matrix and references the runtime-check script", () => {
    const doc = read("docs/high-stakes-validation-matrix.md");

    expect(doc).toContain("Runtime topology validation");
    expect(doc).toContain("bash scripts/check-high-stakes-runtime.sh");
    expect(doc).toContain("Realtime load validation");
    expect(doc).toContain("Recovery / failover rehearsal");
  });

  it("keeps env examples and README aligned with the current runtime contract", () => {
    const envExample = read(".env.example");
    const envProduction = read(".env.production.example");
    const readme = read("README.md");

    expect(envExample).toContain("shared PostgreSQL mode");
    expect(envExample).toContain("REALTIME_COORDINATION_BACKEND=postgresql");
    expect(envProduction).toContain("shared PostgreSQL mode");
    expect(envProduction).toContain("REALTIME_COORDINATION_BACKEND=postgresql");
    expect(readme).toContain("TypeScript-5.9");
  });
});
