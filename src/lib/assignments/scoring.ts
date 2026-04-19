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

/**
 * SQL fragment for the IOI late-penalty CASE expression.
 *
 * This is the single source of truth for the late-penalty scoring logic used
 * in both the main leaderboard query (`contest-scoring.ts`) and the single-user
 * live-rank query (`leaderboard.ts`). Keeping it in one place ensures both
 * queries stay in sync when new exam modes or penalty rules are added.
 *
 * Returns a SQL CASE expression that computes the adjusted score for a single
 * submission row. The caller must ensure:
 * - `@deadline`, `@latePenalty`, `@examMode` parameters are bound.
 * - For the windowed branch, `personal_deadline` is available in the FROM
 *   clause (via LEFT JOIN exam_sessions).
 * - `score` and `points` (or an alias like `COALESCE(ap.points, 100)`) are
 *   available as column references.
 *
 * @param scoreCol  SQL column reference for the raw submission score (e.g. `score` or `s.score`).
 * @param pointsCol SQL column reference for the max points (e.g. `points` or `COALESCE(ap.points, 100)`).
 */
export function buildIoiLatePenaltyCaseExpr(
  scoreCol: string = "score",
  pointsCol: string = "points",
  submittedAtCol: string = "submitted_at",
  personalDeadlineCol: string = "personal_deadline",
): string {
  return `CASE
    WHEN ${scoreCol} IS NOT NULL THEN
      CASE
        -- Non-windowed: late penalty against the global deadline
        WHEN @deadline::bigint IS NOT NULL AND @latePenalty::double precision > 0 AND @examMode::text != 'windowed'
             AND ${submittedAtCol} IS NOT NULL AND EXTRACT(EPOCH FROM ${submittedAtCol})::bigint > @deadline::bigint
        THEN ROUND(((LEAST(GREATEST(${scoreCol}, 0), 100) / 100.0 * ${pointsCol}) * (1.0 - @latePenalty::double precision / 100.0))::numeric, 2)
        -- Windowed: late penalty against the per-user personal_deadline
        WHEN @examMode::text = 'windowed' AND @latePenalty::double precision > 0
             AND ${personalDeadlineCol} IS NOT NULL
             AND ${submittedAtCol} IS NOT NULL AND ${submittedAtCol} > ${personalDeadlineCol}
        THEN ROUND(((LEAST(GREATEST(${scoreCol}, 0), 100) / 100.0 * ${pointsCol}) * (1.0 - @latePenalty::double precision / 100.0))::numeric, 2)
        ELSE ROUND((LEAST(GREATEST(${scoreCol}, 0), 100) / 100.0 * ${pointsCol})::numeric, 2)
      END
    ELSE NULL
  END`;
}
