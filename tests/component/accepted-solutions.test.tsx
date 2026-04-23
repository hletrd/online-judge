import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AcceptedSolutions } from "@/components/problem/accepted-solutions";

const { apiFetchMock } = vi.hoisted(() => ({
  apiFetchMock: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, string | number>) => {
    if (values && "page" in values && "totalPages" in values) {
      return `${key}:${values.page}/${values.totalPages}`;
    }
    if (values && "value" in values) {
      return `${key}:${values.value}`;
    }
    return key;
  },
}));

vi.mock("@/lib/api/client", () => ({
  apiFetch: (...args: unknown[]) => apiFetchMock(...args),
  apiFetchJson: async (input: unknown, init: unknown, fallback: unknown) => {
    const res = await apiFetchMock(input, init);
    const data = await res.json();
    return { ok: res.ok, data };
  },
}));

vi.mock("@/components/code/code-viewer", () => ({
  CodeViewer: ({ value }: { value: string }) => <pre>{value}</pre>,
}));

describe("AcceptedSolutions", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("loads accepted solutions and expands source code", async () => {
    apiFetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          solutions: [
            {
              submissionId: "submission-1",
              userId: "user-1",
              username: "alice",
              language: "python",
              sourceCode: "print(1)",
              codeLength: 8,
              executionTimeMs: 12,
              memoryUsedKb: 128,
              submittedAt: "2026-04-16T00:00:00.000Z",
              isAnonymous: false,
            },
          ],
          total: 1,
          page: 1,
          pageSize: 10,
        },
      }),
    });

    render(
      <AcceptedSolutions
        problemId="problem-1"
        languages={[{ language: "python", displayName: "Python", standard: "3.14" }]}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("alice")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "expand" }));
    expect(screen.getByText("print(1)")).toBeInTheDocument();
  });
});
