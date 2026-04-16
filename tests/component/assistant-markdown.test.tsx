import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AssistantMarkdown } from "@/components/assistant-markdown";

vi.mock("@/components/code/copy-code-button", () => ({
  CopyCodeButton: ({ value }: { value: string }) => (
    <button data-testid="copy-code-button" data-value={value} type="button">
      Copy code
    </button>
  ),
}));

describe("AssistantMarkdown", () => {
  it("renders markdown formatting and hard line breaks", () => {
    const { container } = render(
      <AssistantMarkdown content={"**Bold text**\nnext line"} />
    );

    expect(screen.getByText("Bold text", { selector: "strong" })).toBeInTheDocument();
    expect(container.querySelector("br")).not.toBeNull();
    expect(screen.getByText("next line")).toBeInTheDocument();
  });

  it("skips raw html instead of rendering or escaping it", () => {
    const { container } = render(
      <AssistantMarkdown content={'Before <img src="x" alt="raw-html" /> after'} />
    );

    expect(screen.queryByAltText("raw-html")).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent("<img");
    expect(container).toHaveTextContent("Before after");
  });

  it("renders highlighted fenced code blocks with a copy button", () => {
    const { container } = render(
      <AssistantMarkdown content={"```python\nprint(42)\n```"} />
    );

    expect(container.querySelector("code")?.className).toContain("hljs");
    expect(screen.getByTestId("copy-code-button")).toHaveAttribute("data-value", "print(42)");
  });
});
