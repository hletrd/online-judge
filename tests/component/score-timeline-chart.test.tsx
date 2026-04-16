import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScoreTimelineChart } from "@/components/contest/score-timeline-chart";

describe("ScoreTimelineChart", () => {
  it("renders participant options and switches series when selection changes", () => {
    render(
      <ScoreTimelineChart
        title="Score Progression"
        participantLabel="Participant"
        noDataLabel="No data"
        scoreLabel="Score"
        progressions={[
          {
            userId: "user-1",
            name: "Alice",
            points: [
              { timestamp: 1, totalScore: 10 },
              { timestamp: 2, totalScore: 30 },
            ],
          },
          {
            userId: "user-2",
            name: "Bob",
            points: [
              { timestamp: 1, totalScore: 5 },
              { timestamp: 3, totalScore: 50 },
            ],
          },
        ]}
      />
    );

    expect(screen.getByLabelText("Participant")).toBeInTheDocument();
    expect(screen.getByText("Score Progression")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Participant"), { target: { value: "user-2" } });
    expect(screen.getByDisplayValue("Bob")).toBeInTheDocument();
  });
});
