import type { Page } from "@playwright/test";
import { expect, test as base } from "@playwright/test";
import { ensureRuntimeAdminUser, loginAsRuntimeAdmin } from "./support/runtime-admin";

type E2EFixtures = {
  runtimeAdminPage: Page;
  runtimeSuffix: string;
};

export const test = base.extend<E2EFixtures>({
  runtimeSuffix: async ({}, applyFixture, testInfo) => {
    await applyFixture(`${Date.now()}-${testInfo.workerIndex}`);
  },
  runtimeAdminPage: async ({ browser, page }, applyFixture) => {
    await ensureRuntimeAdminUser(browser);
    await loginAsRuntimeAdmin(page);
    await applyFixture(page);
  },
});

export { expect };
