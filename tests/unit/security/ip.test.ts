import { afterEach, describe, expect, it, vi } from "vitest";

async function importIpModule(trustedProxyHops?: string) {
  vi.resetModules();

  if (trustedProxyHops === undefined) {
    delete process.env.TRUSTED_PROXY_HOPS;
  } else {
    process.env.TRUSTED_PROXY_HOPS = trustedProxyHops;
  }

  return import("@/lib/security/ip");
}

function createHeaders(values: Record<string, string>) {
  return {
    get(name: string) {
      return values[name.toLowerCase()] ?? null;
    },
  };
}

afterEach(() => {
  delete process.env.TRUSTED_PROXY_HOPS;
  vi.restoreAllMocks();
});

describe("extractClientIp", () => {
  it("uses the client IP before the trusted proxy by default", async () => {
    const { extractClientIp } = await importIpModule();

    expect(
      extractClientIp(createHeaders({ "x-forwarded-for": "198.51.100.8, 203.0.113.10" }))
    ).toBe("198.51.100.8");
  });

  it("walks back through multiple trusted proxies", async () => {
    const { extractClientIp } = await importIpModule("2");

    expect(
      extractClientIp(
        createHeaders({
          "x-forwarded-for": "198.51.100.8, 203.0.113.10, 203.0.113.11",
        })
      )
    ).toBe("198.51.100.8");
  });

  it("falls back to the first forwarded IP when there are fewer hops than expected", async () => {
    const { extractClientIp } = await importIpModule("3");

    expect(
      extractClientIp(createHeaders({ "x-forwarded-for": "198.51.100.8, 203.0.113.10" }))
    ).toBe("198.51.100.8");
  });

  it("uses x-real-ip when x-forwarded-for is absent", async () => {
    const { extractClientIp } = await importIpModule();

    expect(extractClientIp(createHeaders({ "x-real-ip": "198.51.100.9" }))).toBe(
      "198.51.100.9"
    );
  });
});
