import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("public problem-set search implementation", () => {
  it("threads the public problem-set search query through the helper and page pagination", () => {
    const helperSource = read("src/lib/problem-sets/public.ts");
    const pageSource = read("src/app/(public)/practice/sets/page.tsx");

    expect(helperSource).toContain("buildPublicProblemSetSearchFilter");
    expect(helperSource).toContain("normalizePracticeSearch");
    expect(helperSource).toContain("like(problemSets.name");
    expect(helperSource).toContain("like(problemSets.description");
    expect(pageSource).toContain("searchParams?: Promise<{ page?: string; search?: string }>");
    expect(pageSource).toContain('name="search"');
    expect(pageSource).toContain("countPublicProblemSets(searchQuery)");
    expect(pageSource).toContain("listPublicProblemSets({ limit: PAGE_SIZE, offset, search: searchQuery })");
  });
});
