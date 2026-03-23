import { expect, test } from "@playwright/test";

test("health endpoint reports database readiness", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.status()).toBe(200);

  const payload = await response.json();

  expect(payload.status).toBe("ok");

  // Admin users get detailed checks; non-admin users get only status
  if (payload.checks !== undefined) {
    expect(payload.checks).toMatchObject({
      auditEvents: "ok",
      database: "ok",
    });
    expect(payload.timestamp).toEqual(expect.any(String));
  }
});
