import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("deployment automation docs", () => {
  it("documents the current workstation deploy baseline and disabled CD posture", () => {
    const doc = read("docs/deployment-automation.md");
    const cdWorkflow = read(".github/workflows/cd.yml");

    expect(doc).toContain("./deploy-docker.sh");
    expect(doc).toContain(".github/workflows/ci.yml");
    expect(doc).toContain("workflow_dispatch");
    expect(doc).toContain("scripts/pg-volume-safety-check.sh");
    expect(doc).toContain("GitHub Actions CD is intentionally **disabled** today.");
    expect(cdWorkflow).toContain("CD via GitHub Actions is intentionally disabled.");
  });

  it("links the deployment automation baseline from the main operator docs", () => {
    const readme = read("README.md");
    const deploymentGuide = read("docs/deployment.md");
    const checklist = read("docs/release-readiness-checklist.md");

    expect(readme).toContain("docs/deployment-automation.md");
    expect(deploymentGuide).toContain("Deployment Automation & Reproducibility");
    expect(checklist).toContain("docs/deployment-automation.md");
  });
});
