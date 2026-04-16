import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const {
  getInvitationMock,
  updateInvitationMock,
  deleteInvitationMock,
  recordAuditEventMock,
} = vi.hoisted(() => ({
  getInvitationMock: vi.fn(),
  updateInvitationMock: vi.fn(),
  deleteInvitationMock: vi.fn(),
  recordAuditEventMock: vi.fn(),
}));

vi.mock("@/lib/api/auth", () => ({
  getApiUser: vi.fn(() => Promise.resolve({ id: "admin-1", role: "admin", username: "admin" })),
  csrfForbidden: vi.fn(() => null),
  unauthorized: () => NextResponse.json({ error: "unauthorized" }, { status: 401 }),
  forbidden: () => NextResponse.json({ error: "forbidden" }, { status: 403 }),
  notFound: (resource: string) => NextResponse.json({ error: "notFound", resource }, { status: 404 }),
}));

vi.mock("@/lib/api/responses", () => ({
  apiSuccess: (data: unknown) => NextResponse.json({ data }, { status: 200 }),
  apiError: (error: string, status: number) => NextResponse.json({ error }, { status }),
}));

vi.mock("@/lib/capabilities/cache", () => ({
  resolveCapabilities: async () => ({
    has: () => true,
  }),
}));

vi.mock("@/lib/assignments/recruiting-invitations", () => ({
  getRecruitingInvitation: getInvitationMock,
  updateRecruitingInvitation: updateInvitationMock,
  deleteRecruitingInvitation: deleteInvitationMock,
}));

vi.mock("@/lib/assignments/contests", () => ({
  getContestAssignment: vi.fn(() => Promise.resolve({ id: "assignment-1", examMode: "scheduled", instructorId: "admin-1" })),
  canManageContest: vi.fn(() => Promise.resolve(true)),
}));

vi.mock("@/lib/audit/events", () => ({
  recordAuditEvent: recordAuditEventMock,
}));

vi.mock("@/lib/db", () => ({
  db: {
    update: vi.fn(() => ({ where: vi.fn(), set: vi.fn(() => ({ then: vi.fn(cb => cb([])) })) })),
    delete: vi.fn(() => ({ where: vi.fn(() => ({ then: vi.fn(cb => cb()) })) })),
  },
}));

function makePatchRequest(body: unknown) {
  return new NextRequest("http://localhost/api/v1/contests/assignment-1/recruiting-invitations/invite-1", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(body),
  });
}

describe("PATCH /api/v1/contests/[assignmentId]/recruiting-invitations/[invitationId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getInvitationMock.mockResolvedValue({
      id: "invite-1",
      assignmentId: "assignment-1",
      candidateName: "Candidate One",
      status: "redeemed",
      userId: "user-1",
      metadata: { resumeCodeHash: "hash" },
    });
  });

  it("updates invitation metadata when provided", async () => {
    const { PATCH } = await import("@/app/api/v1/contests/[assignmentId]/recruiting-invitations/[invitationId]/route");
    const res = await PATCH(makePatchRequest({ metadata: { key: "value" } }), {
      params: Promise.resolve({ assignmentId: "assignment-1", invitationId: "invite-1" }),
    });

    expect(res.status).toBe(200);
    expect(updateInvitationMock).toHaveBeenCalledWith("invite-1", {
      metadata: { key: "value" },
    });
  });
});
