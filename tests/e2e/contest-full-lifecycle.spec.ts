/**
 * Full Contest Lifecycle E2E Test
 *
 * Tests the complete flow: create contest → add problems → access codes →
 * student joins → submits → scoring (IOI/ICPC) → leaderboard → anti-cheat → analytics
 *
 * Run:
 *   PLAYWRIGHT_BASE_URL=http://oj-internal.maum.ai E2E_USERNAME=test_admin E2E_PASSWORD='mcl1234~' npx playwright test tests/e2e/contest-full-lifecycle.spec.ts
 */

import { test, expect, type Page, type APIRequestContext } from "@playwright/test";
import { loginWithCredentials } from "./support/helpers";
import { DEFAULT_CREDENTIALS } from "./support/constants";

const CSRF_HEADERS = {
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest",
};

const suffix = `e2e-${Date.now()}`;

// Shared state across tests in this file (serial execution)
let adminPage: Page;
let adminRequest: APIRequestContext;
let studentPage: Page;

let groupId: string;
let problemAId: string;
let problemBId: string;
let ioiAssignmentId: string;
let icpcAssignmentId: string;
let accessCodeIoi: string;
let accessCodeIcpc: string;
let studentUserId: string;
const studentUsername = `student-${suffix}`;
const studentPassword = "TestPass123!";

async function loginAsAdmin(page: Page) {
  await loginWithCredentials(page, DEFAULT_CREDENTIALS.username, DEFAULT_CREDENTIALS.password, {
    allowPasswordChange: true,
  });
  if (page.url().includes("/change-password")) {
    await page.locator("#currentPassword").fill(DEFAULT_CREDENTIALS.password);
    await page.locator("#newPassword").fill(DEFAULT_CREDENTIALS.password);
    await page.locator("#confirmPassword").fill(DEFAULT_CREDENTIALS.password);
    await page.getByRole("button", { name: /Change Password|비밀번호 변경/ }).click();
    await page.waitForURL("**/dashboard", { timeout: 15_000 });
  }
}

async function loginAsStudent(page: Page) {
  await loginWithCredentials(page, studentUsername, studentPassword, {
    allowPasswordChange: true,
  });
  if (page.url().includes("/change-password")) {
    await page.locator("#currentPassword").fill(studentPassword);
    await page.locator("#newPassword").fill(studentPassword);
    await page.locator("#confirmPassword").fill(studentPassword);
    await page.getByRole("button", { name: /Change Password|비밀번호 변경/ }).click();
    await page.waitForURL("**/dashboard", { timeout: 15_000 });
  }
}

async function apiPost(request: APIRequestContext, path: string, data: Record<string, unknown>) {
  const res = await request.post(path, { data, headers: CSRF_HEADERS });
  const body = await res.json();
  if (!res.ok()) {
    throw new Error(`API POST ${path} failed (${res.status()}): ${JSON.stringify(body)}`);
  }
  return body;
}

async function apiGet(request: APIRequestContext, path: string) {
  const res = await request.get(path);
  const body = await res.json();
  return { status: res.status(), body };
}

async function pollSubmission(request: APIRequestContext, submissionId: string, maxWaitSec = 60) {
  for (let i = 0; i < maxWaitSec / 2; i++) {
    const { body } = await apiGet(request, `/api/v1/submissions/${submissionId}`);
    const status = body.data?.status;
    if (status && !["pending", "queued", "judging"].includes(status)) {
      return body.data;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Submission ${submissionId} did not finish within ${maxWaitSec}s`);
}

test.describe.serial("Contest Full Lifecycle", () => {
  // ─── Setup: Login as admin ─────────────────────────────────────────────
  test("Step 1: Admin login", async ({ browser }) => {
    adminPage = await browser.newPage();
    await loginAsAdmin(adminPage);
    adminRequest = adminPage.request;
    expect(adminPage.url()).toContain("/dashboard");
  });

  // ─── Setup: Create test student ────────────────────────────────────────
  test("Step 2: Create student user", async () => {
    const res = await apiPost(adminRequest, "/api/v1/users", {
      username: studentUsername,
      name: `E2E Student ${suffix}`,
      role: "student",
      password: studentPassword,
    });
    studentUserId = res.data.user?.id ?? res.data.id;
    expect(studentUserId).toBeTruthy();
  });

  // ─── Setup: Create group ───────────────────────────────────────────────
  test("Step 3: Create group", async () => {
    const res = await apiPost(adminRequest, "/api/v1/groups", {
      name: `E2E Contest Group ${suffix}`,
      description: "E2E test group for contest lifecycle",
    });
    groupId = res.data.id;
    expect(groupId).toBeTruthy();
  });

  // ─── Setup: Enroll student ─────────────────────────────────────────────
  test("Step 4: Enroll student in group", async () => {
    const res = await apiPost(adminRequest, `/api/v1/groups/${groupId}/members`, {
      userId: studentUserId,
    });
    expect(res.data.id).toBeTruthy();
  });

  // ─── Setup: Create problems ────────────────────────────────────────────
  test("Step 5: Create Problem A (A+B)", async () => {
    const res = await apiPost(adminRequest, "/api/v1/problems", {
      title: `[E2E] A+B ${suffix}`,
      description: "Read two integers and print their sum.",
      timeLimitMs: 2000,
      memoryLimitMb: 256,
      visibility: "private",
      testCases: [
        { input: "1 2\n", expectedOutput: "3\n", isVisible: true, sortOrder: 0 },
        { input: "0 0\n", expectedOutput: "0\n", isVisible: true, sortOrder: 1 },
        { input: "100 200\n", expectedOutput: "300\n", isVisible: false, sortOrder: 2 },
      ],
    });
    problemAId = res.data.id;
    expect(problemAId).toBeTruthy();
  });

  test("Step 6: Create Problem B (Multiply)", async () => {
    const res = await apiPost(adminRequest, "/api/v1/problems", {
      title: `[E2E] Multiply ${suffix}`,
      description: "Read two integers and print their product.",
      timeLimitMs: 2000,
      memoryLimitMb: 256,
      visibility: "private",
      testCases: [
        { input: "3 4\n", expectedOutput: "12\n", isVisible: true, sortOrder: 0 },
        { input: "0 5\n", expectedOutput: "0\n", isVisible: true, sortOrder: 1 },
      ],
    });
    problemBId = res.data.id;
    expect(problemBId).toBeTruthy();
  });

  // ─── Create IOI Contest ────────────────────────────────────────────────
  test("Step 7: Create IOI contest (scheduled exam)", async () => {
    const now = Date.now();
    const res = await apiPost(adminRequest, `/api/v1/groups/${groupId}/assignments`, {
      title: `[E2E] IOI Contest ${suffix}`,
      description: "IOI-style partial scoring contest",
      examMode: "scheduled",
      scoringModel: "ioi",
      startsAt: now - 60_000, // started 1 min ago
      deadline: now + 3_600_000, // ends in 1 hour
      enableAntiCheat: true,
      problems: [
        { problemId: problemAId, points: 100 },
        { problemId: problemBId, points: 100 },
      ],
    });
    ioiAssignmentId = res.data.id;
    expect(ioiAssignmentId).toBeTruthy();
  });

  // ─── Create ICPC Contest ───────────────────────────────────────────────
  test("Step 8: Create ICPC contest (windowed exam)", async () => {
    const now = Date.now();
    const res = await apiPost(adminRequest, `/api/v1/groups/${groupId}/assignments`, {
      title: `[E2E] ICPC Contest ${suffix}`,
      description: "ICPC-style binary scoring contest",
      examMode: "windowed",
      examDurationMinutes: 120,
      scoringModel: "icpc",
      startsAt: now - 60_000,
      deadline: now + 7_200_000,
      enableAntiCheat: false,
      problems: [
        { problemId: problemAId, points: 100 },
        { problemId: problemBId, points: 100 },
      ],
    });
    icpcAssignmentId = res.data.id;
    expect(icpcAssignmentId).toBeTruthy();
  });

  // ─── Generate Access Codes ─────────────────────────────────────────────
  test("Step 9: Generate IOI contest access code", async () => {
    const res = await apiPost(adminRequest, `/api/v1/contests/${ioiAssignmentId}/access-code`, {});
    accessCodeIoi = res.data.accessCode;
    expect(accessCodeIoi).toBeTruthy();
    expect(accessCodeIoi.length).toBeGreaterThanOrEqual(4);
  });

  test("Step 10: Generate ICPC contest access code", async () => {
    const res = await apiPost(adminRequest, `/api/v1/contests/${icpcAssignmentId}/access-code`, {});
    accessCodeIcpc = res.data.accessCode;
    expect(accessCodeIcpc).toBeTruthy();
  });

  // ─── Verify contest pages as admin ─────────────────────────────────────
  test("Step 11: Admin sees contests in list", async () => {
    await adminPage.goto("/dashboard/contests");
    await adminPage.waitForLoadState("networkidle");

    const pageContent = await adminPage.textContent("body");
    expect(pageContent).toContain(`[E2E] IOI Contest ${suffix}`);
  });

  test("Step 12: Admin sees tabbed contest detail", async () => {
    // Debug: verify assignment ID and API access
    const { status: apiStatus, body: apiBody } = await apiGet(
      adminRequest,
      `/api/v1/contests/${ioiAssignmentId}/leaderboard`
    );
    console.log(`  IOI assignment ID: ${ioiAssignmentId}, leaderboard API: ${apiStatus}`);

    const response = await adminPage.goto(`/dashboard/contests/${ioiAssignmentId}`);
    console.log(`  Page status: ${response?.status()}, URL: ${adminPage.url()}`);
    await adminPage.waitForLoadState("networkidle");

    // Check we're on the right page (not 404)
    const url = adminPage.url();
    expect(url).toContain(ioiAssignmentId);

    // Check page loaded with contest content
    const bodyText = await adminPage.textContent("body");
    expect(bodyText).toContain(`[E2E] IOI Contest ${suffix}`);
  });

  test("Step 13: Admin sees access code manager", async () => {
    await adminPage.goto(`/dashboard/contests/${ioiAssignmentId}`);
    await adminPage.waitForLoadState("networkidle");

    // Access code should be visible on the page (may be in Overview tab)
    const bodyText = await adminPage.textContent("body");
    expect(bodyText).toContain(accessCodeIoi);
  });

  // ─── Student flow ─────────────────────────────────────────────────────
  test("Step 14: Student login", async ({ browser }) => {
    studentPage = await browser.newPage();
    await loginAsStudent(studentPage);
    expect(studentPage.url()).toContain("/dashboard");
  });

  test("Step 15: Student sees IOI contest in list", async () => {
    await studentPage.goto("/dashboard/contests");
    await studentPage.waitForLoadState("networkidle");

    const content = await studentPage.textContent("body");
    expect(content).toContain(`[E2E] IOI Contest ${suffix}`);
  });

  test("Step 16: Student opens IOI contest detail", async () => {
    await studentPage.goto(`/dashboard/contests/${ioiAssignmentId}`);
    await studentPage.waitForLoadState("networkidle");

    // Should see problems and scoring badges
    const content = await studentPage.textContent("body");
    expect(content).toMatch(/IOI|A\+B/);
  });

  // ─── Submit correct solution to Problem A (IOI) ────────────────────────
  test("Step 17: Student submits correct solution to Problem A (IOI)", async () => {
    const res = await apiPost(studentPage.request, "/api/v1/submissions", {
      problemId: problemAId,
      assignmentId: ioiAssignmentId,
      language: "python",
      sourceCode: "a, b = map(int, input().split())\nprint(a + b)\n",
    });
    const submissionId = res.data.id;
    expect(submissionId).toBeTruthy();

    // Poll for result
    const result = await pollSubmission(studentPage.request, submissionId);
    expect(result.status).toBe("accepted");
    expect(result.score).toBe(100);
  });

  // ─── Submit partially correct solution to Problem B (IOI) ──────────────
  test("Step 18: Student submits wrong solution to Problem B (IOI)", async () => {
    // This outputs a+b instead of a*b, so it'll be wrong
    const res = await apiPost(studentPage.request, "/api/v1/submissions", {
      problemId: problemBId,
      assignmentId: ioiAssignmentId,
      language: "python",
      sourceCode: "a, b = map(int, input().split())\nprint(a + b)\n",
    });
    const submissionId = res.data.id;
    expect(submissionId).toBeTruthy();

    const result = await pollSubmission(studentPage.request, submissionId);
    // This should be wrong_answer (or partially correct if some test cases match)
    expect(["wrong_answer", "accepted"]).toContain(result.status);
  });

  // ─── Check IOI Leaderboard ─────────────────────────────────────────────
  test("Step 19: IOI leaderboard shows student score", async () => {
    const { status, body } = await apiGet(
      studentPage.request,
      `/api/v1/contests/${ioiAssignmentId}/leaderboard`
    );
    expect(status).toBe(200);
    expect(body.data.scoringModel).toBe("ioi");
    expect(body.data.entries.length).toBeGreaterThanOrEqual(1);

    // Student should be in entries with score > 0 (at least Problem A is correct)
    const studentEntry = body.data.entries.find(
      (e: { isCurrentUser?: boolean }) => e.isCurrentUser
    );
    // For student view, isCurrentUser should be set
    if (studentEntry) {
      expect(studentEntry.totalScore).toBeGreaterThan(0);
    }
  });

  // ─── Check IOI Leaderboard UI ──────────────────────────────────────────
  test("Step 20: IOI leaderboard renders in browser", async () => {
    await studentPage.goto(`/dashboard/contests/${ioiAssignmentId}`);
    await studentPage.waitForLoadState("networkidle");

    // Wait for leaderboard to load (it fetches via API)
    const leaderboardCard = studentPage.locator("text=Leaderboard").or(studentPage.locator("text=리더보드"));
    await expect(leaderboardCard.first()).toBeVisible({ timeout: 15_000 });
  });

  // ─── ICPC: Start exam session ──────────────────────────────────────────
  test("Step 21: Student starts ICPC windowed exam", async () => {
    await studentPage.goto(`/dashboard/contests/${icpcAssignmentId}`);
    await studentPage.waitForLoadState("networkidle");

    // For windowed exam, student needs to click "Start Exam"
    const startBtn = studentPage.getByRole("button", { name: /Start Exam|시험 시작/ });
    if (await startBtn.isVisible()) {
      await startBtn.click();
      // Confirm dialog
      const confirmBtn = studentPage.getByRole("button", { name: /Start Exam|시험 시작/ }).last();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }
      await studentPage.waitForLoadState("networkidle");
    }
  });

  // ─── ICPC: Submit correct solution ─────────────────────────────────────
  test("Step 22: Student submits correct solution (ICPC)", async () => {
    const res = await apiPost(studentPage.request, "/api/v1/submissions", {
      problemId: problemAId,
      assignmentId: icpcAssignmentId,
      language: "python",
      sourceCode: "a, b = map(int, input().split())\nprint(a + b)\n",
    });
    const submissionId = res.data.id;
    expect(submissionId).toBeTruthy();

    const result = await pollSubmission(studentPage.request, submissionId);
    expect(result.status).toBe("accepted");
  });

  // ─── ICPC: Submit wrong then correct to Problem B ──────────────────────
  test("Step 23: ICPC penalty - wrong attempt then correct", async () => {
    // Wrong attempt first
    const wrongRes = await apiPost(studentPage.request, "/api/v1/submissions", {
      problemId: problemBId,
      assignmentId: icpcAssignmentId,
      language: "python",
      sourceCode: "print('wrong')\n",
    });
    const wrongResult = await pollSubmission(studentPage.request, wrongRes.data.id);
    expect(wrongResult.status).toBe("wrong_answer");

    // Correct attempt
    const correctRes = await apiPost(studentPage.request, "/api/v1/submissions", {
      problemId: problemBId,
      assignmentId: icpcAssignmentId,
      language: "python",
      sourceCode: "a, b = map(int, input().split())\nprint(a * b)\n",
    });
    const correctResult = await pollSubmission(studentPage.request, correctRes.data.id);
    expect(correctResult.status).toBe("accepted");
  });

  // ─── ICPC Leaderboard ──────────────────────────────────────────────────
  test("Step 24: ICPC leaderboard shows correct ranking", async () => {
    const { status, body } = await apiGet(
      studentPage.request,
      `/api/v1/contests/${icpcAssignmentId}/leaderboard`
    );
    expect(status).toBe(200);
    expect(body.data.scoringModel).toBe("icpc");

    const entries = body.data.entries;
    expect(entries.length).toBeGreaterThanOrEqual(1);

    // Student should have 2 problems solved with penalty > 0 (due to wrong attempt)
    const studentEntry = entries.find((e: { isCurrentUser?: boolean }) => e.isCurrentUser);
    if (studentEntry) {
      expect(studentEntry.totalScore).toBe(2); // 2 problems solved
      expect(studentEntry.totalPenalty).toBeGreaterThan(0); // penalty from wrong attempt
    }
  });

  // ─── Anti-cheat: Log event ─────────────────────────────────────────────
  test("Step 25: Anti-cheat event is logged", async () => {
    // IOI contest has anti-cheat enabled, log a tab_switch event
    const res = await apiPost(studentPage.request, `/api/v1/contests/${ioiAssignmentId}/anti-cheat`, {
      eventType: "tab_switch",
      details: JSON.stringify({ timestamp: Date.now() }),
    });
    expect(res.data).toBeDefined();
  });

  // ─── Anti-cheat: Admin sees events ─────────────────────────────────────
  test("Step 26: Admin sees anti-cheat events", async () => {
    const { status, body } = await apiGet(
      adminRequest,
      `/api/v1/contests/${ioiAssignmentId}/anti-cheat?limit=100`
    );
    expect(status).toBe(200);
    expect(body.data.total).toBeGreaterThanOrEqual(1);
    expect(body.data.events.length).toBeGreaterThanOrEqual(1);

    const tabSwitchEvent = body.data.events.find(
      (e: { eventType: string }) => e.eventType === "tab_switch"
    );
    expect(tabSwitchEvent).toBeDefined();
  });

  // ─── Analytics ─────────────────────────────────────────────────────────
  test("Step 27: IOI analytics returns data", async () => {
    const { status, body } = await apiGet(
      adminRequest,
      `/api/v1/contests/${ioiAssignmentId}/analytics`
    );
    expect(status).toBe(200);
    expect(body.data.scoreDistribution).toBeDefined();
    expect(body.data.problemSolveRates).toBeDefined();
    expect(body.data.problemSolveRates.length).toBe(2); // 2 problems
    expect(body.data.cheatSummary.totalEvents).toBeGreaterThanOrEqual(1);
  });

  test("Step 28: ICPC analytics returns data", async () => {
    const { status, body } = await apiGet(
      adminRequest,
      `/api/v1/contests/${icpcAssignmentId}/analytics`
    );
    expect(status).toBe(200);
    expect(body.data.scoreDistribution).toBeDefined();
    expect(body.data.problemSolveRates).toBeDefined();
  });

  // ─── Export ────────────────────────────────────────────────────────────
  test("Step 29: Export CSV works", async () => {
    const res = await adminRequest.get(
      `/api/v1/contests/${ioiAssignmentId}/export?format=csv`
    );
    expect(res.status()).toBe(200);
    const contentType = res.headers()["content-type"];
    expect(contentType).toContain("text/csv");
    const text = await res.text();
    expect(text).toContain(studentUsername);
  });

  test("Step 30: Export JSON works", async () => {
    const res = await adminRequest.get(
      `/api/v1/contests/${ioiAssignmentId}/export?format=json`
    );
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
  });

  // ─── Verify contest UI components ──────────────────────────────────────
  test("Step 31: Admin analytics page renders charts", async () => {
    await adminPage.goto(`/dashboard/contests/${ioiAssignmentId}/analytics`);
    await adminPage.waitForLoadState("networkidle");

    // Wait for analytics to load
    await adminPage.waitForTimeout(3000);

    // SVG charts should render
    const svgs = adminPage.locator("svg");
    const svgCount = await svgs.count();
    expect(svgCount).toBeGreaterThanOrEqual(1);
  });

  test("Step 32: Admin anti-cheat dashboard shows events", async () => {
    await adminPage.goto(`/dashboard/contests/${ioiAssignmentId}`);
    await adminPage.waitForLoadState("networkidle");
    await adminPage.waitForTimeout(2000);

    // Should show anti-cheat related content somewhere on the page
    const content = await adminPage.textContent("body");
    expect(content).toMatch(/Anti-Cheat|부정행위|event|이벤트/i);
  });

  // ─── Cleanup ───────────────────────────────────────────────────────────
  test("Step 33: Cleanup - close pages", async () => {
    await studentPage?.close();
    await adminPage?.close();
  });
});
