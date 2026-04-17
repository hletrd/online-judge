import { PassThrough } from "node:stream";
import { describe, expect, it } from "vitest";

import { createLogger } from "@/lib/logger";

function waitForFlush() {
  return new Promise((resolve) => setImmediate(resolve));
}

describe("logger redaction", () => {
  it("redacts bearer auth and password-like fields from structured logs", async () => {
    const stream = new PassThrough();
    let output = "";
    stream.on("data", (chunk) => {
      output += chunk.toString();
    });

    const logger = createLogger(stream);
    logger.info({
      headers: { authorization: "Bearer super-secret-token" },
      password: "super-secret-password",
      workerSecret: "worker-secret-value",
      nested: {
        note: "still-visible",
      },
    }, "structured log");

    await waitForFlush();

    const line = output.trim();
    expect(line).not.toContain("super-secret-token");
    expect(line).not.toContain("super-secret-password");
    expect(line).not.toContain("worker-secret-value");

    const parsed = JSON.parse(line) as {
      headers: { authorization: string };
      password: string;
      workerSecret: string;
      nested: { note: string };
    };

    expect(parsed.headers.authorization).toBe("[REDACTED]");
    expect(parsed.password).toBe("[REDACTED]");
    expect(parsed.workerSecret).toBe("[REDACTED]");
    expect(parsed.nested.note).toBe("still-visible");
  });
});
