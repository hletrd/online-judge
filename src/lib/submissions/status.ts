export type SubmissionStatus = "pending" | "queued" | "judging" | "accepted" | "wrong_answer" | "compile_error" | "runtime_error" | "time_limit_exceeded" | "memory_limit_exceeded" | "output_limit_exceeded" | "internal_error" | "cancelled";

export const ACTIVE_SUBMISSION_STATUSES = new Set<string>(["pending", "queued", "judging"]);

export function isActiveSubmissionStatus(status: string | null | undefined) {
  return Boolean(status && ACTIVE_SUBMISSION_STATUSES.has(status));
}

export function getSubmissionStatusVariant(
  status: string | null | undefined
): "default" | "secondary" | "destructive" {
  if (status === "accepted") {
    return "default";
  }

  if (status === "submitted" || isActiveSubmissionStatus(status)) {
    return "secondary";
  }

  return "destructive";
}
