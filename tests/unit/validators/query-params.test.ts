import { describe, it, expect } from "vitest";
import { parsePositiveInt } from "@/lib/validators/query-params";

describe("parsePositiveInt", () => {
  it("returns default for null", () => {
    expect(parsePositiveInt(null, 50)).toBe(50);
  });

  it("returns default for undefined", () => {
    expect(parsePositiveInt(undefined, 50)).toBe(50);
  });

  it("returns default for empty string", () => {
    expect(parsePositiveInt("", 50)).toBe(50);
  });

  it("returns default for whitespace-only string", () => {
    expect(parsePositiveInt("   ", 50)).toBe(50);
  });

  it("returns default for non-numeric string", () => {
    expect(parsePositiveInt("abc", 50)).toBe(50);
  });

  it("returns default for mixed alphanumeric", () => {
    expect(parsePositiveInt("12abc", 50)).toBe(12); // parseInt truncates
  });

  it("returns default for negative number", () => {
    expect(parsePositiveInt("-5", 50)).toBe(50);
  });

  it("returns default for zero", () => {
    expect(parsePositiveInt("0", 50)).toBe(50);
  });

  it("parses positive integer", () => {
    expect(parsePositiveInt("42", 50)).toBe(42);
  });

  it("parses 1 (minimum valid)", () => {
    expect(parsePositiveInt("1", 50)).toBe(1);
  });

  it("truncates decimal to integer", () => {
    expect(parsePositiveInt("3.5", 50)).toBe(3);
  });

  it("handles large values", () => {
    expect(parsePositiveInt("999999", 50)).toBe(999999);
  });

  it("trims whitespace", () => {
    expect(parsePositiveInt("  25  ", 50)).toBe(25);
  });

  it("returns default for string with spaces around number", () => {
    expect(parsePositiveInt(" 25", 50)).toBe(25);
  });

  describe("strict mode", () => {
    it("rejects non-integer strings in strict mode", () => {
      expect(parsePositiveInt("3.5", 50, { strict: true })).toBe(50);
    });

    it("rejects mixed alphanumeric in strict mode", () => {
      expect(parsePositiveInt("12abc", 50, { strict: true })).toBe(50);
    });

    it("accepts pure digit strings in strict mode", () => {
      expect(parsePositiveInt("42", 50, { strict: true })).toBe(42);
    });
  });
});
