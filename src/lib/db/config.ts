/**
 * Database dialect configuration.
 * PostgreSQL is the only supported dialect.
 */

export type DbDialect = "postgresql";

/**
 * Returns the configured database dialect. Always "postgresql".
 */
export function getDialect(): DbDialect {
  return "postgresql";
}

/**
 * Returns true — PostgreSQL is the only supported dialect.
 */
export function isPostgresql(): boolean {
  return true;
}

export type ConnectionConfig = { dialect: "postgresql"; url: string };

/**
 * Returns the connection configuration.
 */
export function getConnectionConfig(): ConnectionConfig {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  return { dialect: "postgresql", url };
}
