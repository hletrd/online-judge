import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("login rate-limit flow", () => {
  it("consumes auth attempts atomically before credential verification", () => {
    const source = readFileSync(join(process.cwd(), "src/lib/auth/config.ts"), "utf8");

    expect(source).toContain("consumeRateLimitAttemptMulti");
    expect(source).not.toContain("isAnyKeyRateLimited");
    expect(source).not.toContain("recordRateLimitFailureMulti(...rateLimitKeys)");
  });
});
