import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecruitStartForm } from "@/app/(auth)/recruit/[token]/recruit-start-form";

const { pushMock, refreshMock, signInMock, signOutMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
  signInMock: vi.fn(),
  signOutMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      startAssessment: "Start Assessment",
      continueAssessment: "Continue Assessment",
      starting: "Starting...",
      startFailed: "Couldn't start. Try again.",
    };
    return messages[key] ?? key;
  },
}));

vi.mock("next-auth/react", () => ({
  signIn: signInMock,
  signOut: signOutMock,
}));

describe("RecruitStartForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signOutMock.mockResolvedValue(undefined);
    signInMock.mockResolvedValue({ ok: true });
  });

  it("signs in with the invite token for an unclaimed assessment", async () => {
    const user = userEvent.setup();

    render(
      <RecruitStartForm
        token="invite-token"
        assignmentId="assignment-1"
        isReentry={false}
        resumeWithCurrentSession={false}
      />
    );

    await user.click(screen.getByRole("button", { name: "Start Assessment" }));

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledWith({ redirect: false });
      expect(signInMock).toHaveBeenCalledWith("credentials", {
        recruitToken: "invite-token",
        redirect: false,
      });
      expect(pushMock).toHaveBeenCalledWith("/dashboard/contests/assignment-1");
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it("reuses the current session for a claimed assessment instead of replaying the invite token", async () => {
    const user = userEvent.setup();

    render(
      <RecruitStartForm
        token="invite-token"
        assignmentId="assignment-2"
        isReentry
        resumeWithCurrentSession
      />
    );

    await user.click(screen.getByRole("button", { name: "Continue Assessment" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/contests/assignment-2");
      expect(refreshMock).toHaveBeenCalled();
    });
    expect(signOutMock).not.toHaveBeenCalled();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("shows an error when invite-token sign-in fails", async () => {
    const user = userEvent.setup();
    signInMock.mockResolvedValueOnce({ ok: false });

    render(
      <RecruitStartForm
        token="invite-token"
        assignmentId="assignment-3"
        isReentry={false}
        resumeWithCurrentSession={false}
      />
    );

    await user.click(screen.getByRole("button", { name: "Start Assessment" }));

    await waitFor(() => {
      expect(screen.getByText("Couldn't start. Try again.")).toBeInTheDocument();
    });
    expect(pushMock).not.toHaveBeenCalled();
  });
});
