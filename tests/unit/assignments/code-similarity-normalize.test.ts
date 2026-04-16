import { describe, expect, it, vi } from "vitest";
import {
  normalizeIdentifiersForSimilarity,
  normalizeSource,
} from "@/lib/assignments/code-similarity";

vi.mock("@/lib/db", () => ({
  db: {
    delete: vi.fn(),
    insert: vi.fn(),
    transaction: vi.fn(),
  },
}));

vi.mock("@/lib/db/queries", () => ({
  rawQueryAll: vi.fn(),
}));

vi.mock("@/lib/assignments/code-similarity-client", () => ({
  computeSimilarityRust: vi.fn(),
}));

describe("normalizeSource", () => {
  it("preserves identifier casing for case-sensitive languages", () => {
    const normalized = normalizeSource("const Foo = bar + BAZ;");

    expect(normalized).toContain("Foo");
    expect(normalized).toContain("BAZ");
    expect(normalized).not.toContain("foo");
  });

  it("still strips comments and collapses whitespace", () => {
    const normalized = normalizeSource("let Value = 1; // comment\n\n/* block */\nValue++;");

    expect(normalized).toBe("let Value = 1; Value++;");
  });
});

describe("normalizeIdentifiersForSimilarity", () => {
  it("maps renamed identifiers onto the same placeholder stream", () => {
    const left = normalizeIdentifiersForSimilarity(
      normalizeSource("int total = left + right; return total;")
    );
    const right = normalizeIdentifiersForSimilarity(
      normalizeSource("int answer = alpha + beta; return answer;")
    );

    expect(left).toBe("int v1 = v2 + v3; return v1;");
    expect(right).toBe(left);
  });

  it("preserves language keywords and preprocessor directives", () => {
    const normalized = normalizeIdentifiersForSimilarity(
      normalizeSource("#include <stdio.h>\nfor (int i = 0; i < n; i++) return value;")
    );

    expect(normalized).toContain("#include");
    expect(normalized).toContain("for");
    expect(normalized).toContain("int");
    expect(normalized).toContain("return");
  });
});
