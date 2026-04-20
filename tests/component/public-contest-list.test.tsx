import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { PublicContestList } from "@/app/(public)/_components/public-contest-list";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));

describe("PublicContestList", () => {
  it("renders public contests in a list layout", () => {
    render(
      <PublicContestList
        title="Public contest catalog"
        description="Browse public contests"
        noContestsLabel="No public contests"
        archiveTitle="Past Contests"
        locale="en"
        contests={[
          {
            id: "contest-1",
            href: "/contests/contest-1",
            title: "Spring Challenge",
            description: "A public contest.",
            groupName: "Algorithms 101",
            statusLabel: "Upcoming",
            statusKey: "upcoming",
            problemCountLabel: "3 total problems",
            publicProblemCountLabel: "2 public problems",
            modeLabel: "Scheduled",
            modeKey: "scheduled",
            scoringLabel: "IOI",
            scoringKey: "ioi",
            archiveGroupLabel: "2026",
            startsAtLabel: "Starts: Apr 16, 2026",
            deadlineLabel: "Deadline: Apr 17, 2026",
          },
        ]}
      />
    );

    expect(screen.getByText("Public contest catalog")).toBeInTheDocument();
    expect(screen.getByText("Spring Challenge")).toBeInTheDocument();
    expect(screen.getByText("Algorithms 101")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Starts: Apr 16, 2026")).toBeInTheDocument();
    expect(screen.getByText("Deadline: Apr 17, 2026")).toBeInTheDocument();
  });

  it("groups archived contests under year headings", () => {
    render(
      <PublicContestList
        title="Public contest catalog"
        description="Browse public contests"
        noContestsLabel="No public contests"
        archiveTitle="Past Contests"
        locale="en"
        contests={[
          {
            id: "contest-2026",
            href: "/contests/contest-2026",
            title: "Winter Finals",
            description: null,
            groupName: "Algorithms 401",
            statusLabel: "Closed",
            statusKey: "closed",
            problemCountLabel: "5 total problems",
            publicProblemCountLabel: "5 public problems",
            modeLabel: "Scheduled",
            modeKey: "scheduled",
            scoringLabel: "ICPC",
            scoringKey: "icpc",
            archiveGroupLabel: "2026",
            startsAtLabel: "Starts: Jan 16, 2026",
            deadlineLabel: "Deadline: Jan 16, 2026",
          },
          {
            id: "contest-2025",
            href: "/contests/contest-2025",
            title: "Autumn Finals",
            description: null,
            groupName: "Algorithms 301",
            statusLabel: "Closed",
            statusKey: "closed",
            problemCountLabel: "4 total problems",
            publicProblemCountLabel: "4 public problems",
            modeLabel: "Scheduled",
            modeKey: "scheduled",
            scoringLabel: "IOI",
            scoringKey: "ioi",
            archiveGroupLabel: "2025",
            startsAtLabel: "Starts: Oct 16, 2025",
            deadlineLabel: "Deadline: Oct 16, 2025",
          },
        ]}
      />
    );

    expect(screen.getByText("Past Contests")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2026" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2025" })).toBeInTheDocument();
    expect(screen.getByText("Winter Finals")).toBeInTheDocument();
    expect(screen.getByText("Autumn Finals")).toBeInTheDocument();
  });
});
