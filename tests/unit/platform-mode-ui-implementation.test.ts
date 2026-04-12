import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("platform mode UI implementation", () => {
  it("shows the effective platform mode visibly in the dashboard layout header", () => {
    const source = read("src/app/(dashboard)/layout.tsx");

    expect(source).toContain('<Badge variant="outline" className="text-[10px] uppercase tracking-wide">');
    expect(source).toContain('{t(`platformModes.${effectivePlatformMode}`)}');
  });

  it("shows an operational-mode warning block in system settings", () => {
    const source = read("src/app/(dashboard)/dashboard/admin/settings/system-settings-form.tsx");

    expect(source).toContain('const platformPolicy = useMemo(() => getPlatformModePolicy(platformMode), [platformMode]);');
    expect(source).toContain('t("platformModeOperationalTitle")');
    expect(source).toContain('t("platformModeHighStakesNotice")');
  });
});
