import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { PublicProblemList } from "@/app/(public)/_components/public-problem-list";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));

describe("PublicProblemList", () => {
  it("renders public problem rows in a list/table layout", () => {
    render(
      <PublicProblemList
        title="Public problem catalog"
        description="Browse public problems"
        noProblemsLabel="No public problems"
        numberLabel="#"
        problemTitleLabel="Title"
        difficultyLabel="Difficulty"
        tagLabel="Tags"
        problems={[
          {
            id: "problem-1",
            sequenceNumber: 1000,
            title: "A + B",
            difficultyLabel: "Difficulty: 1.00 / 10",
            tags: [{ name: "math", color: null }],
          },
        ]}
      />
    );

    expect(screen.getByText("Public problem catalog")).toBeInTheDocument();
    expect(screen.getByText("A + B")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("Difficulty: 1.00 / 10")).toBeInTheDocument();
    expect(screen.getByText("math")).toBeInTheDocument();
  });
});
