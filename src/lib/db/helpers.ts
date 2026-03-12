/**
 * Drizzle ORM update helpers.
 *
 * Drizzle's `$defaultFn` only runs on INSERT, not UPDATE.
 * Use `withUpdatedAt()` to automatically inject `updatedAt: new Date()` into
 * every `.set()` call so that no update silently leaves the timestamp stale.
 *
 * @example
 *   await db.update(users).set(withUpdatedAt({ name: "Alice" })).where(eq(users.id, id));
 */
export function withUpdatedAt<T extends Record<string, unknown>>(
  data: T
): T & { updatedAt: Date } {
  return { ...data, updatedAt: new Date() };
}
