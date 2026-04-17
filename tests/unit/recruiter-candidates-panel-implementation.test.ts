import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("recruiter candidates panel implementation", () => {
  it("offers an anonymized CSV export path distinct from the normal export", () => {
    const source = read("src/components/contest/recruiter-candidates-panel.tsx");

    expect(source).toContain("handleAnonymizedCsvDownload");
    expect(source).toContain("export?format=csv&anonymized=1&download=1");
    expect(source).toContain('t("exportAnonymizedCsv")');
  });
});
