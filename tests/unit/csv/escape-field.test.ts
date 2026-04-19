import { describe, it, expect } from "vitest";
import { escapeCsvField } from "@/lib/csv/escape-field";

describe("escapeCsvField", () => {
  it("handles null", () => {
    expect(escapeCsvField(null)).toBe("");
  });

  it("handles undefined", () => {
    expect(escapeCsvField(undefined)).toBe("");
  });

  it("handles number", () => {
    expect(escapeCsvField(42)).toBe("42");
  });

  it("handles simple string", () => {
    expect(escapeCsvField("hello")).toBe("hello");
  });

  it("wraps fields with commas", () => {
    expect(escapeCsvField("a,b")).toBe('"a,b"');
  });

  it("wraps fields with double quotes", () => {
    expect(escapeCsvField('say "hello"')).toBe('"say ""hello"""');
  });

  it("wraps fields with newlines", () => {
    expect(escapeCsvField("line1\nline2")).toBe('"line1\nline2"');
  });

  it("wraps fields with carriage returns", () => {
    expect(escapeCsvField("line1\rline2")).toBe('"line1\rline2"');
  });

  it("prefixes formula-injection characters with tab", () => {
    expect(escapeCsvField("=SUM(A1:A5)")).toBe("\t=SUM(A1:A5)");
    expect(escapeCsvField("+cmd")).toBe("\t+cmd");
    expect(escapeCsvField("-cmd")).toBe("\t-cmd");
    expect(escapeCsvField("@cmd")).toBe("\t@cmd");
  });

  it("prefixes leading tab with another tab", () => {
    expect(escapeCsvField("\tdata")).toBe("\t\tdata");
  });

  it("prefixes leading carriage return with tab and wraps (contains CR)", () => {
    expect(escapeCsvField("\rdata")).toBe("\"\t\rdata\"");
  });

  it("handles empty string", () => {
    expect(escapeCsvField("")).toBe("");
  });
});
