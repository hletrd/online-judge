function roundAssignmentScore(value: number) {
  return Math.round(value * 100) / 100;
}

export function mapSubmissionPercentageToAssignmentPoints(
  score: number,
  points: number,
  lateContext?: {
    submittedAt: Date | null;
    deadline: Date | null;
    latePenalty: number;
  }
) {
  const normalizedPercentage = Math.min(Math.max(score, 0), 100);
  let earnedPoints = roundAssignmentScore((normalizedPercentage / 100) * points);

  if (lateContext && lateContext.submittedAt && lateContext.deadline && lateContext.latePenalty > 0) {
    const submittedTime = lateContext.submittedAt.valueOf();
    const deadlineTime = lateContext.deadline.valueOf();

    if (submittedTime > deadlineTime) {
      const penaltyFraction = lateContext.latePenalty / 100;
      earnedPoints = roundAssignmentScore(earnedPoints * (1 - penaltyFraction));
    }
  }

  return earnedPoints;
}

export function isSubmissionLate(submittedAt: Date | null, deadline: Date | null): boolean {
  if (!submittedAt || !deadline) return false;
  return submittedAt.valueOf() > deadline.valueOf();
}
