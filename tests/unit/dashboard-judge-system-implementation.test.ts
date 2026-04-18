import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("dashboard judge system implementation", () => {
  it("wires the judge system section into the root dashboard page", () => {
    const source = read("src/app/(dashboard)/dashboard/page.tsx");

    expect(source).toContain('DashboardJudgeSystemSection');
    expect(source).toContain('!isAdminView && !isCandidateView && (');
  });

  it("exposes a dedicated full languages page while blocking recruiting candidates from infra details", () => {
    const source = read("src/app/(dashboard)/dashboard/languages/page.tsx");

    expect(source).toContain("const session = await auth();");
    expect(source).toContain("resolveCapabilities(session.user.role)");
    expect(source).toContain("getRecruitingAccessContext(session.user.id)");
    expect(source).toContain('accessContext.effectivePlatformMode === "recruiting"');
    expect(source).toContain('accessContext.isRecruitingCandidate');
    expect(source).toContain('redirect("/dashboard")');
    expect(source).toContain('getJudgeSystemSnapshot()');
    expect(source).toContain('tDashboard("allEnabledLanguages")');
    expect(source).toContain('href="/dashboard"');
  });
});
