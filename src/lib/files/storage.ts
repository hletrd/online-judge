import { mkdirSync, writeFileSync, unlinkSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

function getDataDir(): string {
  return process.env.DATABASE_PATH
    ? resolve(process.env.DATABASE_PATH, "..")
    : join(process.cwd(), "data");
}

export function getUploadsDir(): string {
  return join(getDataDir(), "uploads");
}

export function ensureUploadsDir(): void {
  mkdirSync(getUploadsDir(), { recursive: true });
}

export function resolveStoredPath(storedName: string): string {
  if (
    storedName.includes("/") ||
    storedName.includes("\\") ||
    storedName.includes("..")
  ) {
    throw new Error("Invalid stored file name");
  }
  return join(getUploadsDir(), storedName);
}

export function writeUploadedFile(storedName: string, data: Buffer): void {
  ensureUploadsDir();
  writeFileSync(resolveStoredPath(storedName), data, { mode: 0o644 });
}

export function deleteUploadedFile(storedName: string): void {
  try {
    unlinkSync(resolveStoredPath(storedName));
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}

export function readUploadedFile(storedName: string): Buffer {
  return readFileSync(resolveStoredPath(storedName));
}

export function uploadedFileExists(storedName: string): boolean {
  return existsSync(resolveStoredPath(storedName));
}
