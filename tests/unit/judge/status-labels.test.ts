import { describe, expect, it } from "vitest";
import { buildStatusLabels } from "@/lib/judge/status-labels";

describe("buildStatusLabels", () => {
  it("includes localized mappings for pending and terminal statuses, including submitted/cancelled aliases", () => {
    const labels = buildStatusLabels((key) => `translated:${key}`);

    expect(labels).toMatchObject({
      pending: "translated:status.pending",
      queued: "translated:status.queued",
      judging: "translated:status.judging",
      accepted: "translated:status.accepted",
      wrong_answer: "translated:status.wrong_answer",
      time_limit: "translated:status.time_limit",
      memory_limit: "translated:status.memory_limit",
      runtime_error: "translated:status.runtime_error",
      compile_error: "translated:status.compile_error",
      submitted: "translated:status.submitted",
      canceled: "translated:status.canceled",
      cancelled: "translated:status.cancelled",
    });
  });
});
