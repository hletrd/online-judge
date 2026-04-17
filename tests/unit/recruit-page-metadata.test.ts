import { beforeEach, describe, expect, it, vi } from "vitest";

const { getRecruitingInvitationByTokenMock, dbSelectMock } = vi.hoisted(() => ({
  getRecruitingInvitationByTokenMock: vi.fn(),
  dbSelectMock: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => {
    const messages: Record<string, string> = {
      title: "Coding Assessment",
      ogDescription: "You've been invited to a coding assessment. Click to begin.",
      invalidToken: "Invalid link",
      expired: "Link expired",
      claimed: "Assessment already claimed",
      claimedDescription:
        "This invitation has already been used. Continue from your existing assessment session on this device, or sign in with your recruiting email and account password.",
    };
    return messages[key] ?? key;
  },
}));

vi.mock("@/lib/assignments/recruiting-invitations", () => ({
  getRecruitingInvitationByToken: getRecruitingInvitationByTokenMock,
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    select: dbSelectMock,
  },
}));

describe("recruit page metadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses generic metadata for valid public invite tokens instead of leaking assignment titles", async () => {
    getRecruitingInvitationByTokenMock.mockResolvedValue({
      id: "invite-1",
      status: "pending",
      assignmentId: "assignment-1",
      candidateName: "Candidate One",
      expiresAt: null,
    });

    const page = await import("@/app/(auth)/recruit/[token]/page");
    const metadata = await page.generateMetadata({
      params: Promise.resolve({ token: "invite-token" }),
    });

    expect(metadata.title).toBe("Coding Assessment");
    expect(metadata.description).toBe(
      "You've been invited to a coding assessment. Click to begin."
    );
    expect(dbSelectMock).not.toHaveBeenCalled();
  });

  it("still uses the claimed-state metadata for redeemed tokens", async () => {
    getRecruitingInvitationByTokenMock.mockResolvedValue({
      id: "invite-2",
      status: "redeemed",
      assignmentId: "assignment-2",
      candidateName: "Candidate Two",
      expiresAt: null,
    });

    const page = await import("@/app/(auth)/recruit/[token]/page");
    const metadata = await page.generateMetadata({
      params: Promise.resolve({ token: "invite-token" }),
    });

    expect(metadata.title).toBe("Assessment already claimed");
    expect(metadata.description).toContain("already been used");
  });
});
