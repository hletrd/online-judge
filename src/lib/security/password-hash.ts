import argon2 from "argon2";
import { compare as bcryptCompare } from "bcryptjs";

const ARGON2_OPTIONS: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 19456, // 19 MiB (OWASP minimum recommendation)
  timeCost: 2,
  parallelism: 1,
};

/** Returns true if the hash is a legacy bcrypt hash. */
function isBcryptHash(hash: string): boolean {
  return hash.startsWith("$2a$") || hash.startsWith("$2b$");
}

/** Hash a password using Argon2id. */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

/**
 * Verify a password against a stored hash (bcrypt or argon2).
 * Returns `{ valid, needsRehash }` — caller should rehash and persist
 * the new hash when `needsRehash` is true.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
  if (isBcryptHash(storedHash)) {
    const valid = await bcryptCompare(password, storedHash);
    return { valid, needsRehash: valid };
  }

  const valid = await argon2.verify(storedHash, password);
  return { valid, needsRehash: false };
}
