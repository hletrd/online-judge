import { act, render, screen } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { ContestQuickStats } from "@/components/contest/contest-quick-stats";

const apiFetchMock = vi.fn();

// Capture the polling callback so tests can trigger it deterministically,
// avoiding the random 0-500ms jitter inside useVisibilityPolling.
let pollingCallback: (() => void) | null = null;

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("@/hooks/use-visibility-polling", () => ({
  useVisibilityPolling: (cb: () => void, _intervalMs: number, _paused = false) => {
    pollingCallback = cb;
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

describe("ContestQuickStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pollingCallback = null;
    apiFetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          participantCount: 5,
          submittedCount: 3,
          avgScore: 80,
          problemsSolvedCount: 1,
        },
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches stats on mount and updates the display", async () => {
    render(
      <ContestQuickStats
        assignmentId="assignment-1"
        problemCount={1}
        refreshInterval={20}
        initialStats={{
          participantCount: 1,
          submittedCount: 0,
          avgScore: 0,
          problemsSolvedCount: 0,
        }}
      />
    );

    // Trigger the polling callback captured by the mock
    expect(pollingCallback).toBeTruthy();
    await act(async () => {
      pollingCallback!();
      await Promise.resolve();
    });

    expect(apiFetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText("1/1")).toBeInTheDocument();
  });

  it("does not fetch when the polling callback is not invoked", () => {
    render(
      <ContestQuickStats
        assignmentId="assignment-1"
        problemCount={1}
        refreshInterval={20}
        initialStats={{
          participantCount: 1,
          submittedCount: 0,
          avgScore: 0,
          problemsSolvedCount: 0,
        }}
      />
    );

    // Without triggering the polling callback, no fetch should happen
    expect(apiFetchMock).not.toHaveBeenCalled();
  });
});
