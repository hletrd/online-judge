import { devices, type Page } from "@playwright/test";
import { test, expect } from "./fixtures";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL;
const isRemoteRun = (() => {
  if (!baseUrl) return false;
  try {
    const parsed = new URL(baseUrl);
    return parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1";
  } catch {
    return false;
  }
})();

test.skip(isRemoteRun, "Local-only mobile layout audit expects the local Playwright webserver.");
test.use({
  browserName: "chromium",
  ...devices["iPhone 13"],
});

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: Math.ceil(window.visualViewport?.width ?? window.innerWidth),
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

async function loginAsSeededAdmin(page: Page) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.locator("#username").fill("admin");
  await page.locator("#password").fill("admin123");
  await page.getByRole("button", { name: /sign in|로그인/i }).click();
  await page.waitForFunction(() => /\/(dashboard|change-password)(?:$|\?)/.test(window.location.pathname + window.location.search), null, { timeout: 30_000 });

  if (page.url().includes("/change-password")) {
    await page.locator("#currentPassword").fill("admin123");
    await page.locator("#newPassword").fill("AdminPass234");
    await page.locator("#confirmPassword").fill("AdminPass234");
    await page.getByRole("button", { name: /change password|비밀번호 변경/i }).click();
    await page.waitForURL("**/dashboard", { timeout: 15_000 });
  }
}

test("public mobile header collapses navigation without horizontal overflow", async ({ page }) => {
  const publicPages = ["/", "/practice", "/playground", "/community"];

  for (const path of publicPages) {
    await page.goto(path, { waitUntil: "networkidle" });
    await expectNoHorizontalOverflow(page);
  }

  await page.goto("/", { waitUntil: "networkidle" });
  const header = page.locator("header").first();
  const toggle = header.getByRole("button", { name: /toggle navigation menu/i });

  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(header.getByRole("link", { name: /sign in|로그인/i })).toBeHidden();

  await toggle.click();

  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(header.getByRole("link", { name: /practice|연습/i })).toBeVisible();
  await expect(header.getByRole("link", { name: /sign in|로그인/i })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("admin mobile pages keep primary controls visible without horizontal scrolling", async ({ page }) => {
  await loginAsSeededAdmin(page);

  await page.goto("/dashboard/admin/languages", { waitUntil: "networkidle" });
  await expectNoHorizontalOverflow(page);
  const languageSearch = page.getByPlaceholder(/search languages|언어 검색/i);
  await expect(languageSearch).toBeVisible();
  expect((await languageSearch.boundingBox())?.width ?? 0).toBeGreaterThan(180);
  await expect(page.getByRole("button", { name: /build image|이미지 빌드/i }).first()).toBeVisible();

  await page.goto("/dashboard/admin/users", { waitUntil: "networkidle" });
  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole("button", { name: /bulk create|일괄 생성/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /add user|사용자 추가/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /edit|수정/i }).first()).toBeVisible();

  await page.goto("/dashboard/admin/workers", { waitUntil: "networkidle" });
  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole("button", { name: /add worker|워커 추가/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /refresh|새로고침/i })).toBeVisible();
});
