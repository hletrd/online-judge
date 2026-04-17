import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbSelectMock } = vi.hoisted(() => ({
  dbSelectMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    select: dbSelectMock,
  },
}));

vi.mock("@/lib/db/schema", () => ({
  roles: {},
}));

describe("capabilities cache bootstrap", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    dbSelectMock.mockReturnValue({
      from: vi.fn().mockResolvedValue([]),
    });
  });

  it("bootstraps all built-in roles, including assistant, when the DB is empty", async () => {
    const {
      resolveCapabilities,
      getRoleLevel,
      getAllCachedRoles,
      isValidRole,
    } = await import("@/lib/capabilities/cache");

    const assistantCaps = await resolveCapabilities("assistant");
    const assistantLevel = await getRoleLevel("assistant");
    const allRoles = await getAllCachedRoles();

    expect(assistantCaps.has("submissions.view_all")).toBe(true);
    expect(assistantLevel).toBe(1);
    expect(await isValidRole("assistant")).toBe(true);
    expect(allRoles.map((role) => role.name)).toContain("assistant");
  });
});
