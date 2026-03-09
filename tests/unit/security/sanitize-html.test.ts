import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "@/lib/security/sanitize-html";

describe("sanitizeHtml", () => {
  it("preserves basic formatting content", () => {
    const sanitized = sanitizeHtml(
      '<p><strong>Bold</strong> <a href="https://example.com" rel="noreferrer">link</a></p>'
    );

    expect(sanitized).toContain("<strong>Bold</strong>");
    expect(sanitized).toContain('href="https://example.com"');
  });

  it("strips interactive elements and inline event handlers", () => {
    const sanitized = sanitizeHtml(
      '<form><input value="x" /><button onclick="alert(1)">Go</button><p onclick="alert(2)">Safe</p></form>'
    );

    expect(sanitized).not.toContain("<form");
    expect(sanitized).not.toContain("<input");
    expect(sanitized).not.toContain("<button");
    expect(sanitized).not.toContain("onclick");
    expect(sanitized).toContain("<p>Safe</p>");
  });
});
