import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("problem editor scroll implementation", () => {
  it("marks both textarea and CodeMirror editor surfaces as vertical pan targets for touch scrolling", () => {
    const codeEditorSource = read("src/components/code/code-editor.tsx");
    const codeSurfaceSource = read("src/components/code/code-surface.tsx");

    expect(codeEditorSource).toContain("overflow-auto");
    expect(codeEditorSource).toContain('resize: "vertical"');

    expect(codeSurfaceSource).toContain("overflow-hidden");
    expect(codeSurfaceSource).toContain('".cm-scroller": {');
    expect(codeSurfaceSource).toContain('overflow: "auto"');
  });
});
