import { getAuthUrl } from "@/lib/security/env";

/**
 * Determines whether the auth session cookie should have the Secure flag.
 * Derives from AUTH_URL protocol rather than inspecting client headers
 * (which can be spoofed).
 */
export function shouldUseSecureAuthCookie() {
  const authUrl = getAuthUrl();

  return authUrl?.startsWith("https://") === true;
}
