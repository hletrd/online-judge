import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("buildDockerImage implementation", () => {
  it("uses the repository root as the docker build context", () => {
    const source = readFileSync(join(process.cwd(), "src/lib/docker/client.ts"), "utf8");

    expect(source).toContain('const contextDir = ".";');
    expect(source).toContain('spawn("docker", ["build", "-t", imageName, "-f", dockerfilePath, contextDir])');
  });

  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    delete process.env.COMPILER_RUNNER_URL;
    delete process.env.JUDGE_AUTH_TOKEN;
  });

  it("routes Docker management through the worker API when a runner is configured", async () => {
    process.env.COMPILER_RUNNER_URL = "http://judge-worker:3001";
    process.env.JUDGE_AUTH_TOKEN = "x".repeat(32);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as unknown as typeof fetch;

    const { listDockerImages } = await import("@/lib/docker/client");
    await expect(listDockerImages("judge-*")).resolves.toEqual([]);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://judge-worker:3001/docker/images?filter=judge-*",
      expect.objectContaining({
        method: "GET",
        cache: "no-store",
      }),
    );
  });
});
