const DEFAULT_POLL_URL = "http://localhost:3000/api/v1/judge/poll";
const DEFAULT_POLL_INTERVAL_MS = 2000;
const JUDGE_AUTH_TOKEN_PLACEHOLDER = "your-judge-auth-token";

function normalizeBooleanEnv(value: string | undefined) {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

export function getJudgePollUrl() {
  return process.env.JUDGE_POLL_URL?.trim() || DEFAULT_POLL_URL;
}

export function getJudgePollIntervalMs() {
  const rawValue = process.env.POLL_INTERVAL?.trim();

  if (!rawValue) {
    return DEFAULT_POLL_INTERVAL_MS;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error("POLL_INTERVAL must be a positive integer.");
  }

  return parsedValue;
}

export function getJudgeAuthToken() {
  const authToken = process.env.JUDGE_AUTH_TOKEN?.trim();

  if (!authToken) {
    throw new Error("JUDGE_AUTH_TOKEN must be set before starting the judge worker.");
  }

  if (authToken === JUDGE_AUTH_TOKEN_PLACEHOLDER) {
    throw new Error("JUDGE_AUTH_TOKEN must be replaced with a strong random value before starting the judge worker.");
  }

  return authToken;
}

export function shouldDisableCustomSeccomp() {
  const disabled = normalizeBooleanEnv(process.env.JUDGE_DISABLE_CUSTOM_SECCOMP);

  if (disabled) {
    console.warn(
      "WARNING: JUDGE_DISABLE_CUSTOM_SECCOMP is set. " +
      "Custom seccomp profile is disabled. " +
      "This MUST NOT be used in production environments."
    );
  }

  return disabled;
}
