import { beforeEach, describe, expect, it, vi } from "vitest";

const { getRecruitingInvitationByTokenMock } = vi.hoisted(() => ({
  getRecruitingInvitationByTokenMock: vi.fn(),
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
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  },
}));

vi.mock("@/lib/compiler/catalog", () => ({
  getEnabledCompilerLanguages: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/db/schema", () => ({
  assignments: { id: "id", title: "title", description: "description", examDurationMinutes: "examDurationMinutes", deadline: "deadline" },
  assignmentProblems: { assignmentId: "assignmentId" },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  sql: vi.fn(),
}));

import RecruitPage, { generateMetadata } from "@/app/(auth)/recruit/[token]/page";

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

    const metadata = await generateMetadata({
      params: Promise.resolve({ token: "invite-token" }),
    });

    expect(metadata.title).toBe("Coding Assessment");
    expect(metadata.description).toBe(
      "You've been invited to a coding assessment. Click to begin."
    );
  });

  it("still uses the claimed-state metadata for redeemed tokens", async () => {
    getRecruitingInvitationByTokenMock.mockResolvedValue({
      id: "invite-2",
      status: "redeemed",
      assignmentId: "assignment-2",
      candidateName: "Candidate Two",
      expiresAt: null,
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ token: "invite-token" }),
    });

    expect(metadata.title).toBe("Assessment already claimed");
    expect(metadata.description).toContain("already been used");
  });
});
