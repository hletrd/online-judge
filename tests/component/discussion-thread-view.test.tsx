import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DiscussionThreadView } from "@/components/discussions/discussion-thread-view";

vi.mock("@/components/code/copy-code-button", () => ({
  CopyCodeButton: ({ value }: { value: string }) => (
    <button data-testid="copy-code-button" data-value={value} type="button">
      Copy code
    </button>
  ),
}));

describe("DiscussionThreadView", () => {
  it("renders thread and reply bodies through AssistantMarkdown so code blocks stay formatted", () => {
    render(
      <DiscussionThreadView
        title="Need help with BFS"
        content={"Thread intro\n\n```cpp\ncout << 42;\n```"}
        authorName="Alice"
        scopeLabel="Problem"
        repliesTitle="Replies"
        noRepliesLabel="No replies"
        actions={<span>actions</span>}
        posts={[
          {
            id: "post-1",
            content: "```python\nprint(42)\n```",
            authorName: "Bob",
            actions: <span>post-actions</span>,
          },
        ]}
      />
    );

    expect(screen.getByText("Need help with BFS")).toBeInTheDocument();
    const buttons = screen.getAllByTestId("copy-code-button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute("data-value", "cout << 42;");
    expect(buttons[1]).toHaveAttribute("data-value", "print(42)");
  });
});
