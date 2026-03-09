import { describe, expect, it } from "vitest";
import {
  isSubmissionLate,
  mapSubmissionPercentageToAssignmentPoints,
} from "@/lib/assignments/scoring";

describe("mapSubmissionPercentageToAssignmentPoints", () => {
  it("maps the score percentage to assignment points", () => {
    expect(mapSubmissionPercentageToAssignmentPoints(75, 40)).toBe(30);
  });

  it("clamps scores to the valid percentage range", () => {
    expect(mapSubmissionPercentageToAssignmentPoints(140, 40)).toBe(40);
    expect(mapSubmissionPercentageToAssignmentPoints(-10, 40)).toBe(0);
  });

  it("applies the late penalty only after the deadline", () => {
    const deadline = new Date("2026-03-09T12:00:00.000Z");

    expect(
      mapSubmissionPercentageToAssignmentPoints(80, 50, {
        submittedAt: new Date("2026-03-09T11:59:59.000Z"),
        deadline,
        latePenalty: 25,
      })
    ).toBe(40);

    expect(
      mapSubmissionPercentageToAssignmentPoints(80, 50, {
        submittedAt: new Date("2026-03-09T12:00:01.000Z"),
        deadline,
        latePenalty: 25,
      })
    ).toBe(30);
  });
});

describe("isSubmissionLate", () => {
  it("returns false when the submission is on time or the schedule is incomplete", () => {
    const deadline = new Date("2026-03-09T12:00:00.000Z");

    expect(isSubmissionLate(new Date("2026-03-09T12:00:00.000Z"), deadline)).toBe(false);
    expect(isSubmissionLate(null, deadline)).toBe(false);
    expect(isSubmissionLate(new Date("2026-03-09T12:00:01.000Z"), null)).toBe(false);
  });

  it("returns true when the submission is after the deadline", () => {
    expect(
      isSubmissionLate(
        new Date("2026-03-09T12:00:01.000Z"),
        new Date("2026-03-09T12:00:00.000Z")
      )
    ).toBe(true);
  });
});
