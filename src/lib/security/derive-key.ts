import { createHash, hkdfSync } from "node:crypto";

/**
 * Derive a domain-separated 256-bit key from the shared master secret
 * using HKDF-SHA256. Each domain (e.g. "api-key-encryption", "plugin-config")
 * gets a cryptographically independent key even though they share the same
 * environment variable.
 */
export function deriveEncryptionKey(domain: string): Buffer {
  const secret = process.env.PLUGIN_CONFIG_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error(
      "PLUGIN_CONFIG_ENCRYPTION_KEY must be set. Generate: openssl rand -hex 32"
    );
  }
  return Buffer.from(hkdfSync("sha256", secret, "", domain, 32));
}

/**
 * Legacy key derivation — plain SHA-256 of the secret.
 * Used as fallback when decrypting values encrypted before HKDF migration.
 */
export function legacyEncryptionKey(): Buffer {
  const secret = process.env.PLUGIN_CONFIG_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error(
      "PLUGIN_CONFIG_ENCRYPTION_KEY must be set. Generate: openssl rand -hex 32"
    );
  }
  return createHash("sha256").update(secret).digest();
}
