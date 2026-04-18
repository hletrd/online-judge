import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { computeSimilarityRust } from "@/lib/assignments/code-similarity-client";

describe("computeSimilarityRust", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns pairs on successful response", async () => {
    const mockPairs = [
      { userId1: "u1", userId2: "u2", problemId: "p1", language: "python", similarity: 0.95 },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ pairs: mockPairs }),
    });

    const result = await computeSimilarityRust(
      [
        { userId: "u1", problemId: "p1", language: "python", sourceCode: "code1" },
        { userId: "u2", problemId: "p1", language: "python", sourceCode: "code2" },
      ],
      0.85,
      3
    );

    expect(result).toEqual(mockPairs);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("returns null on non-ok response (fail-open)", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await computeSimilarityRust(
      [{ userId: "u1", problemId: "p1", language: "python", sourceCode: "code" }],
      0.85,
      3
    );

    expect(result).toBeNull();
  });

  it("returns null on network error (fail-open)", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await computeSimilarityRust(
      [{ userId: "u1", problemId: "p1", language: "python", sourceCode: "code" }],
      0.85,
      3
    );

    expect(result).toBeNull();
  });

  it("returns null on timeout (fail-open)", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError"));

    const result = await computeSimilarityRust(
      [{ userId: "u1", problemId: "p1", language: "python", sourceCode: "code" }],
      0.85,
      3
    );

    expect(result).toBeNull();
  });

  it("sends correct JSON payload with snake_case ngram_size", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ pairs: [] }),
    });

    await computeSimilarityRust(
      [{ userId: "u1", problemId: "p1", language: "python", sourceCode: "code" }],
      0.9,
      5
    );

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body).toEqual({
      submissions: [{ userId: "u1", problemId: "p1", language: "python", sourceCode: "code" }],
      threshold: 0.9,
      ngram_size: 5,
    });
  });

  it("uses default threshold and ngramSize", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ pairs: [] }),
    });

    await computeSimilarityRust([
      { userId: "u1", problemId: "p1", language: "python", sourceCode: "code" },
    ]);

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.threshold).toBe(0.85);
    expect(body.ngram_size).toBe(3);
  });
});
