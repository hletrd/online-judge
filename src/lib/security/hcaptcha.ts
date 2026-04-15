const HCAPTCHA_VERIFY_URL = "https://api.hcaptcha.com/siteverify";

export function getHcaptchaSiteKey() {
  const value = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY?.trim();
  return value && value.length > 0 ? value : null;
}

export function getHcaptchaSecret() {
  const value = process.env.HCAPTCHA_SECRET?.trim();
  return value && value.length > 0 ? value : null;
}

export function isHcaptchaConfigured() {
  return Boolean(getHcaptchaSiteKey() && getHcaptchaSecret());
}

export async function verifyHcaptchaToken(token: string, remoteIp?: string | null) {
  const secret = getHcaptchaSecret();
  if (!secret) {
    return {
      success: false,
      errorCodes: ["hcaptcha-not-configured"],
    };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(HCAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      success: false,
      errorCodes: [`http-${response.status}`],
    };
  }

  const payload = await response.json() as {
    success?: boolean;
    "error-codes"?: string[];
  };

  return {
    success: payload.success === true,
    errorCodes: payload["error-codes"] ?? [],
  };
}
