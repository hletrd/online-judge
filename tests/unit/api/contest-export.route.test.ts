import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const {
  canViewAssignmentSubmissionsMock,
  computeContestRankingMock,
  getLeaderboardProblemsMock,
  rawQueryOneMock,
  rawQueryAllMock,
  recordAuditEventMock,
} = vi.hoisted(() => ({
  canViewAssignmentSubmissionsMock: vi.fn(),
  computeContestRankingMock: vi.fn(),
  getLeaderboardProblemsMock: vi.fn(),
  rawQueryOneMock: vi.fn(),
  rawQueryAllMock: vi.fn(),
  recordAuditEventMock: vi.fn(),
}));

vi.mock("@/lib/api/handler", () => ({
  createApiHandler:
    ({ handler }: { handler: (req: NextRequest, ctx: { user: any; params: Record<string, string> }) => Promise<Response> }) =>
    async (req: NextRequest, routeCtx?: { params?: Promise<Record<string, string>> }) =>
      handler(req, {
        user: { id: "recruiter-1", role: "admin" },
        params: routeCtx?.params ? await routeCtx.params : { assignmentId: "assignment-1" },
      }),
}));

vi.mock("@/lib/api/responses", () => ({
  apiError: (error: string, status: number) =>
    NextResponse.json({ error }, { status }),
}));

vi.mock("@/lib/assignments/submissions", () => ({
  canViewAssignmentSubmissions: canViewAssignmentSubmissionsMock,
}));

vi.mock("@/lib/assignments/contest-scoring", () => ({
  computeContestRanking: computeContestRankingMock,
}));

vi.mock("@/lib/assignments/leaderboard", () => ({
  getLeaderboardProblems: getLeaderboardProblemsMock,
}));

vi.mock("@/lib/db/queries", () => ({
  rawQueryOne: rawQueryOneMock,
  rawQueryAll: rawQueryAllMock,
}));

vi.mock("@/lib/audit/events", () => ({
  recordAuditEvent: recordAuditEventMock,
}));

describe("GET /api/v1/contests/[assignmentId]/export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rawQueryOneMock.mockResolvedValue({
      groupId: "group-1",
      instructorId: "instructor-1",
      examMode: "scheduled",
      title: "Hiring Contest",
      scoringModel: "ioi",
    });
    canViewAssignmentSubmissionsMock.mockResolvedValue(true);
    getLeaderboardProblemsMock.mockResolvedValue([
      { problemId: "p-1", title: "A + B" },
      { problemId: "p-2", title: "Prefix Sum" },
    ]);
    computeContestRankingMock.mockResolvedValue({
      scoringModel: "ioi",
      entries: [
        {
          rank: 1,
          userId: "user-1",
          name: "Alice",
          username: "alice",
          className: "CS101",
          totalScore: 180,
          totalPenalty: 0,
          problems: [
            { problemId: "p-1", score: 100, attempts: 1, solved: true, firstAcAt: null },
            { problemId: "p-2", score: 80, attempts: 2, solved: false, firstAcAt: null },
          ],
        },
      ],
    });
    rawQueryAllMock
      .mockResolvedValueOnce([{ userId: "user-1", count: 2 }])
      .mockResolvedValueOnce([{ userId: "user-1", ips: "10.0.0.1" }]);
  });

  it("returns anonymized CSV exports without candidate PII and records an audit event", async () => {
    const { GET } = await import("@/app/api/v1/contests/[assignmentId]/export/route");
    const response = await GET(
      new NextRequest(
        "http://localhost/api/v1/contests/assignment-1/export?format=csv&anonymized=1&download=1"
      ),
      { params: Promise.resolve({ assignmentId: "assignment-1" }) } as never
    );

    expect(response.status).toBe(200);
    const csv = await response.text();
    expect(csv).toContain("Candidate 1");
    expect(csv).not.toContain("Alice");
    expect(csv).not.toContain("alice");
    expect(csv).not.toContain("CS101");
    expect(csv).not.toContain("10.0.0.1");
    expect(recordAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "contest.export_downloaded_anonymized",
        resourceId: "assignment-1",
      })
    );
  });

  it("does not record an export audit event for the panel's background JSON fetch", async () => {
    const { GET } = await import("@/app/api/v1/contests/[assignmentId]/export/route");
    const response = await GET(
      new NextRequest("http://localhost/api/v1/contests/assignment-1/export?format=json"),
      { params: Promise.resolve({ assignmentId: "assignment-1" }) } as never
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json[0]).toMatchObject({ name: "Alice", username: "alice" });
    expect(recordAuditEventMock).not.toHaveBeenCalled();
  });
});
