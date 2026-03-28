import { getMinPasswordLength } from "@/lib/security/constants";

export type PasswordValidationError = "passwordTooShort" | "passwordTooLong" | "passwordTooSimilar";

export function getPasswordValidationError(
  password: string,
  context?: { username?: string; email?: string | null }
): PasswordValidationError | null {
  if (password.length < getMinPasswordLength()) {
    return "passwordTooShort";
  }

  if (password.length > 128) {
    return "passwordTooLong";
  }

  // Check password is not too similar to username or email
  if (context) {
    const lower = password.toLowerCase();
    if (context.username && lower.includes(context.username.toLowerCase())) {
      return "passwordTooSimilar";
    }
    if (context.email) {
      const emailLocal = context.email.toLowerCase().split("@")[0];
      if (emailLocal && emailLocal.length >= 3 && lower.includes(emailLocal)) {
        return "passwordTooSimilar";
      }
    }
  }

  return null;
}

export function isStrongPassword(password: string, context?: { username?: string; email?: string | null }) {
  return getPasswordValidationError(password, context) === null;
}
