import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("public submissions language filter implementation", () => {
  it("adds a language filter select and preserves it across pagination links", () => {
    const source = read("src/app/(public)/submissions/page.tsx");

    expect(source).toContain('name="language"');
    expect(source).toContain('defaultValue={currentLanguage}');
    expect(source).toContain('params.set("language", currentLanguage)');
  });

  it("filters the submissions query by language when a specific language is selected", () => {
    const source = read("src/app/(public)/submissions/page.tsx");

    expect(source).toContain("const languageFilter = currentLanguage !== \"all\"");
    expect(source).toContain("eq(submissions.language, currentLanguage)");
    expect(source).toContain("availableLanguages.includes(rawLanguage)");
  });
});
