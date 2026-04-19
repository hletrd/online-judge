import { users } from "@/lib/db/schema";

/**
 * Minimal column set for proxy/API auth lookups. Intentionally excludes
 * preference fields (preferredLanguage, preferredTheme, etc.) because those
 * are carried by the JWT token/session, not the API auth context.
 * If you need preference fields, use the session or a dedicated query.
 */
export const authUserSelect = {
  id: users.id,
  role: users.role,
  username: users.username,
  email: users.email,
  name: users.name,
  className: users.className,
  isActive: users.isActive,
  mustChangePassword: users.mustChangePassword,
  tokenInvalidatedAt: users.tokenInvalidatedAt,
};

export const safeUserSelect = {
  id: users.id,
  username: users.username,
  email: users.email,
  name: users.name,
  className: users.className,
  role: users.role,
  isActive: users.isActive,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};
