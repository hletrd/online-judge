import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LectureProblemView } from "@/components/lecture/lecture-problem-view";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/components/lecture/lecture-mode-provider", () => ({
  useLectureMode: () => ({
    active: true,
    toggle: () => {},
    fontScale: "1.5",
    setFontScale: () => {},
    colorScheme: "dark",
    setColorScheme: () => {},
    panelLayout: "split",
    setPanelLayout: () => {},
  }),
}));

describe("LectureProblemView", () => {
  it("keeps split panes shrinkable so the inner scroll containers can scroll", () => {
    const { container } = render(
      <LectureProblemView
        problemTitle="Two Sum"
        problemPanel={<div>problem-panel</div>}
        codePanel={<div>code-panel</div>}
      />
    );

    expect(screen.getByText("problemPanelLabel")).toBeInTheDocument();
    expect(screen.getByText("codePanelLabel")).toBeInTheDocument();

    const paneContainers = container.querySelectorAll(".min-h-0.min-w-0");
    expect(paneContainers).toHaveLength(2);

    const scrollPanes = container.querySelectorAll(".overflow-y-auto.min-h-0");
    expect(scrollPanes).toHaveLength(2);
  });
});
