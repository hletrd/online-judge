import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookiesMock, headersMock, getResolvedSystemSettingsMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  headersMock: vi.fn(),
  getResolvedSystemSettingsMock: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getRequestConfig: (factory: () => Promise<unknown>) => factory,
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
  headers: headersMock,
}));

vi.mock("@/lib/system-settings", () => ({
  getResolvedSystemSettings: getResolvedSystemSettingsMock,
}));

describe("i18n request config", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    cookiesMock.mockResolvedValue({
      get: vi.fn((name: string) => (name === "locale" ? { value: "ko" } : undefined)),
    });
    headersMock.mockResolvedValue({
      get: vi.fn((name: string) => {
        if (name === "x-public-locale-mode") return "deterministic";
        if (name === "accept-language") return "ko,en;q=0.9";
        return null;
      }),
    });
    getResolvedSystemSettingsMock.mockResolvedValue({ defaultLocale: "ko" });
  });

  it("keeps deterministic public routes on default locale without explicit override", async () => {
    const getConfig = (await import("@/i18n/request")).default;
    const config = await (getConfig as () => Promise<{ locale: string }>)();

    expect(config.locale).toBe("en");
  });

  it("honors explicit locale overrides on deterministic public routes", async () => {
    headersMock.mockResolvedValue({
      get: vi.fn((name: string) => {
        if (name === "x-public-locale-mode") return "deterministic";
        if (name === "x-locale-override") return "ko";
        return null;
      }),
    });

    const getConfig = (await import("@/i18n/request")).default;
    const config = await (getConfig as () => Promise<{ locale: string }>)();

    expect(config.locale).toBe("ko");
  });
});
