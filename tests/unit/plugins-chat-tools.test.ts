import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  assignmentFindFirstMock,
  canViewAssignmentSubmissionsMock,
  canAccessGroupMock,
  getRecruitingAccessContextMock,
} = vi.hoisted(() => ({
  assignmentFindFirstMock: vi.fn(),
  canViewAssignmentSubmissionsMock: vi.fn(),
  canAccessGroupMock: vi.fn(),
  getRecruitingAccessContextMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      assignments: {
        findFirst: assignmentFindFirstMock,
      },
    },
  },
}));

vi.mock("@/lib/db/schema", () => ({
  assignments: { id: "assignments.id" },
  problems: { id: "problems.id" },
  submissions: { id: "submissions.id", submittedAt: "submissions.submittedAt" },
  submissionResults: { submissionId: "submissionResults.submissionId" },
}));

vi.mock("drizzle-orm", async () => {
  const actual = await vi.importActual<typeof import("drizzle-orm")>("drizzle-orm");
  return {
    ...actual,
    eq: vi.fn((_field: unknown, value: unknown) => ({ _eq: value })),
    desc: vi.fn((value: unknown) => ({ _desc: value })),
  };
});

vi.mock("@/lib/auth/permissions", () => ({
  canAccessProblem: vi.fn(),
  canAccessGroup: canAccessGroupMock,
}));

vi.mock("@/lib/assignments/submissions", () => ({
  canViewAssignmentSubmissions: canViewAssignmentSubmissionsMock,
}));

vi.mock("@/lib/recruiting/access", () => ({
  getRecruitingAccessContext: getRecruitingAccessContextMock,
}));

describe("chat widget assignment-info tool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    assignmentFindFirstMock.mockResolvedValue({
      id: "assignment-1",
      groupId: "group-1",
      title: "Assignment 1",
      deadline: null,
      lateDeadline: null,
    });
    canViewAssignmentSubmissionsMock.mockResolvedValue(false);
    canAccessGroupMock.mockResolvedValue(false);
    getRecruitingAccessContextMock.mockResolvedValue({
      assignmentIds: [],
      problemIds: [],
      isRecruitingCandidate: false,
      effectivePlatformMode: "homework",
    });
  });

  it("rejects assignment metadata access when the caller lacks assignment/group scope", async () => {
    const { executeTool } = await import("@/lib/plugins/chat-widget/tools");

    const result = await executeTool(
      "get_assignment_info",
      {},
      {
        userId: "student-1",
        userRole: "student",
        assignmentId: "assignment-1",
      }
    );

    expect(JSON.parse(result)).toEqual({
      error: "Assignment not found or access denied",
    });
  });

  it("returns assignment metadata when recruiting access explicitly scopes the assignment", async () => {
    getRecruitingAccessContextMock.mockResolvedValue({
      assignmentIds: ["assignment-1"],
      problemIds: [],
      isRecruitingCandidate: true,
      effectivePlatformMode: "recruiting",
    });

    const { executeTool } = await import("@/lib/plugins/chat-widget/tools");

    const result = await executeTool(
      "get_assignment_info",
      {},
      {
        userId: "candidate-1",
        userRole: "student",
        assignmentId: "assignment-1",
      }
    );

    expect(JSON.parse(result)).toMatchObject({
      title: "Assignment 1",
      deadline: null,
      lateDeadline: null,
    });
  });
});
