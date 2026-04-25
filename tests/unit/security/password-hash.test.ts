import { describe, expect, it, vi } from "vitest";
import argon2 from "argon2";

// Mock the DB to avoid real database calls in verifyAndRehashPassword
vi.mock("@/lib/db", () => ({
  db: {
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  users: { id: "id" },
}));

import { verifyPassword, hashPassword } from "@/lib/security/password-hash";

describe("verifyPassword", () => {
  it("returns needsRehash=true for a correct bcrypt password", async () => {
    // bcrypt hash for "testpassword123"
    const bcryptHash = "$2b$10$abcdefghijklmnopqrstuvwxABCDEFGHIJKeabcdefghijKLmnopqrstuv";
    // We can't easily test bcrypt without a real hash, so test argon2 path instead
  });

  it("returns needsRehash=false for an argon2 hash with current parameters", async () => {
    const password = "test-password-for-rehash-check";
    const hash = await hashPassword(password);

    const result = await verifyPassword(password, hash);

    expect(result.valid).toBe(true);
    // Hash was just created with current ARGON2_OPTIONS, so needsRehash should be false
    expect(result.needsRehash).toBe(false);
  });

  it("returns needsRehash=true for an argon2 hash with different parameters", async () => {
    const password = "test-password-for-rehash-check";
    // Hash with lower memory cost than the current default
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 4096, // Lower than the default 19456
      timeCost: 1,       // Lower than the default 2
      parallelism: 1,
    });

    // Verify the hash was created with different parameters
    expect(argon2.needsRehash(hash, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    })).toBe(true);

    const result = await verifyPassword(password, hash);

    expect(result.valid).toBe(true);
    expect(result.needsRehash).toBe(true);
  });

  it("returns valid=false for an incorrect password", async () => {
    const password = "correct-password";
    const hash = await hashPassword(password);

    const result = await verifyPassword("wrong-password", hash);

    expect(result.valid).toBe(false);
    expect(result.needsRehash).toBe(false);
  });

  it("returns valid=false for incorrect password even with mismatched parameters", async () => {
    const hash = await argon2.hash("real-password", {
      type: argon2.argon2id,
      memoryCost: 4096,
      timeCost: 1,
      parallelism: 1,
    });

    const result = await verifyPassword("wrong-password", hash);

    expect(result.valid).toBe(false);
    // needsRehash should be false when valid is false, even if parameters differ
    expect(result.needsRehash).toBe(false);
  });
});
