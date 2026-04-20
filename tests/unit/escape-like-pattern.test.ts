import { describe, it, expect } from "vitest";
import { escapeLikePattern } from "@/lib/db/like";

describe("escapeLikePattern", () => {
  it("passes through normal strings unchanged", () => {
    expect(escapeLikePattern("hello")).toBe("hello");
    expect(escapeLikePattern("test 123")).toBe("test 123");
  });

  it("escapes percent signs", () => {
    expect(escapeLikePattern("100%")).toBe("100\\%");
    expect(escapeLikePattern("%complete%")).toBe("\\%complete\\%");
  });

  it("escapes underscores", () => {
    expect(escapeLikePattern("hello_world")).toBe("hello\\_world");
    expect(escapeLikePattern("_start_")).toBe("\\_start\\_");
  });

  it("escapes backslashes FIRST to prevent double-escaping", () => {
    // This is the critical test: backslash must be escaped before % and _
    // so that a literal backslash in the input does not neutralize the
    // escaping of a subsequent % or _.
    expect(escapeLikePattern("a\\b")).toBe("a\\\\b");
    expect(escapeLikePattern("a\\%b")).toBe("a\\\\\\%b");
    expect(escapeLikePattern("a\\_b")).toBe("a\\\\\\_b");
  });

  it("escapes double backslashes correctly", () => {
    expect(escapeLikePattern("a\\\\b")).toBe("a\\\\\\\\b");
  });

  it("handles empty strings", () => {
    expect(escapeLikePattern("")).toBe("");
  });

  it("handles strings with only special characters", () => {
    expect(escapeLikePattern("%")).toBe("\\%");
    expect(escapeLikePattern("_")).toBe("\\_");
    expect(escapeLikePattern("\\")).toBe("\\\\");
    expect(escapeLikePattern("%_\\")).toBe("\\%\\_\\\\");
  });

  it("handles mixed special and normal characters", () => {
    expect(escapeLikePattern("file_name.txt")).toBe("file\\_name.txt");
    expect(escapeLikePattern("C:\\Users\\test")).toBe("C:\\\\Users\\\\test");
    expect(escapeLikePattern("100%_done")).toBe("100\\%\\_done");
  });
});
