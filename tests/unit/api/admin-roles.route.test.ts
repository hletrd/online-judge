import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const {
  getApiUserMock,
  resolveCapabilitiesMock,
  execTransactionMock,
  dbSelectMock,
  recordAuditEventMock,
} = vi.hoisted(() => ({
  getApiUserMock: vi.fn(),
  resolveCapabilitiesMock: vi.fn(),
  execTransactionMock: vi.fn(),
  dbSelectMock: vi.fn(),
  recordAuditEventMock: vi.fn(),
}));

vi.mock("@/lib/api/auth", () => ({
  getApiUser: getApiUserMock,
  unauthorized: () => new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 }),
  forbidden: () => new Response(JSON.stringify({ error: "forbidden" }), { status: 403 }),
  csrfForbidden: vi.fn(() => null),
  isAdmin: (role: string) => role === "admin" || role === "super_admin",
  isInstructor: (role: string) => role === "instructor" || role === "admin" || role === "super_admin",
}));

vi.mock("@/lib/capabilities/cache", () => ({
  resolveCapabilities: resolveCapabilitiesMock,
  invalidateRoleCache: vi.fn(),
}));

vi.mock("@/lib/audit/events", () => ({
  recordAuditEvent: recordAuditEventMock,
}));

vi.mock("@/lib/db", () => ({
  db: {
    select: dbSelectMock,
  },
  execTransaction: execTransactionMock,
}));

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/v1/admin/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/v1/admin/roles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getApiUserMock.mockResolvedValue({
      id: "admin-1",
      role: "admin",
      username: "admin",
      email: "admin@example.com",
      name: "Admin",
      className: null,
      mustChangePassword: false,
    });
    resolveCapabilitiesMock.mockResolvedValue(new Set(["users.manage_roles"]));
  });

  it("returns 409 when a concurrent insert hits the unique role name constraint", async () => {
    execTransactionMock.mockImplementation(async (fn: (tx: any) => Promise<unknown>) => {
      const tx = {
        select: vi.fn(() => ({
          from: vi.fn(() => ({
            where: vi.fn(() => ({
              limit: vi.fn().mockResolvedValue([]),
            })),
          })),
        })),
        insert: vi.fn(() => ({
          values: vi.fn().mockRejectedValue({ code: "23505" }),
        })),
      };
      return fn(tx);
    });

    const { POST } = await import("@/app/api/v1/admin/roles/route");
    const res = await POST(
      makeRequest({
        name: "reviewer_plus",
        displayName: "Reviewer+",
        description: "Can review",
        level: 1,
        capabilities: ["submissions.view_all"],
      }),
      { params: Promise.resolve({}) }
    );

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("roleNameExists");
  });
});
