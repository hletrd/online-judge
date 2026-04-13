import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("chat widget submission-history assignment scoping", () => {
  it("filters submission history by assignmentId when the chat context provides one", () => {
    const source = read("src/lib/plugins/chat-widget/tools.ts");

    expect(source).toContain("if (context.assignmentId) {");
    expect(source).toContain("filters.push(eqOp(s.assignmentId, context.assignmentId));");
  });
});
