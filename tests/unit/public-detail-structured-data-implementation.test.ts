import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("public detail structured data implementation", () => {
  it("keeps problem detail JSON-LD enriched with page identity, image, and publisher", () => {
    const source = read("src/app/(public)/practice/problems/[id]/page.tsx");

    expect(source).toContain('"@type": "TechArticle"');
    expect(source).toContain("mainEntityOfPage");
    expect(source).toContain("image: [socialImageUrl]");
    expect(source).toContain('"@type": "Organization"');
    expect(source).toContain("publisher:");
  });

  it("keeps contest detail JSON-LD enriched with event status, virtual location, and image", () => {
    const source = read("src/app/(public)/contests/[id]/page.tsx");

    expect(source).toContain('"@type": "Event"');
    expect(source).toContain("eventStatus");
    expect(source).toContain('"@type": "VirtualLocation"');
    expect(source).toContain("image: [socialImageUrl]");
  });

  it("keeps community thread JSON-LD enriched with main entity, image, and publisher", () => {
    const source = read("src/app/(public)/community/threads/[id]/page.tsx");

    expect(source).toContain('"@type": "DiscussionForumPosting"');
    expect(source).toContain("mainEntityOfPage");
    expect(source).toContain("image: [socialImageUrl]");
    expect(source).toContain("publisher:");
  });
});
