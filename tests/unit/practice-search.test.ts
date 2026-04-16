import { describe, expect, it } from "vitest";
import { escapePracticeLike, getPracticeSearchMatchKinds, normalizePracticeSearch } from "@/lib/practice/search";

describe("practice search helpers", () => {
  it("normalizes and clamps the raw search query", () => {
    expect(normalizePracticeSearch("  graph  ")).toBe("graph");
    expect(normalizePracticeSearch(undefined)).toBe("");
    expect(normalizePracticeSearch("x".repeat(300))).toHaveLength(200);
  });

  it("escapes SQL LIKE wildcard characters", () => {
    expect(escapePracticeLike(String.raw`100%_done\ok`)).toBe(String.raw`100\%\_done\\ok`);
  });

  it("detects number, title, and content matches independently", () => {
    const problem = {
      sequenceNumber: 1234,
      title: "Graph Paths",
      description: "Find the shortest path in a weighted graph.",
    };

    expect(getPracticeSearchMatchKinds(problem, "123")).toEqual(["number"]);
    expect(getPracticeSearchMatchKinds(problem, "graph")).toEqual(["title", "content"]);
    expect(getPracticeSearchMatchKinds(problem, "shortest")).toEqual(["content"]);
    expect(getPracticeSearchMatchKinds(problem, "missing")).toEqual([]);
  });
});
