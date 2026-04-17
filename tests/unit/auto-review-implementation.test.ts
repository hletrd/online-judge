import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("auto review implementation", () => {
  it("reuses the joined submission user preference and checks for an existing AI comment directly", () => {
    const source = read("src/lib/judge/auto-review.ts");

    expect(source).toContain("user: {");
    expect(source).toContain("preferredLanguage: true");
    expect(source).toContain('const reviewLanguage = submission.user?.preferredLanguage ?? "ko"');
    expect(source).toContain("isNull(submissionComments.authorId)");
    expect(source).toContain("existingAiComment");
    expect(source).not.toContain("db.query.users.findFirst");
  });
});
