import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompilerClient } from "@/app/(dashboard)/dashboard/compiler/compiler-client";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) =>
    values?.defaultValue ?? key,
}));

vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/code/code-editor", () => ({
  CodeEditor: ({ language, value }: { language: string; value: string }) => (
    <div data-testid="code-editor" data-language={language}>
      {value}
    </div>
  ),
}));

vi.mock("@/components/language-selector", () => ({
  LanguageSelector: ({ value }: { value: string }) => (
    <div data-testid="language-selector">{value}</div>
  ),
}));

vi.mock("@/lib/api/client", () => ({
  apiFetch: vi.fn(),
}));

describe("CompilerClient", () => {
  const languages = [
    { id: "1", language: "python", displayName: "Python", standard: null, extension: ".py" },
    { id: "2", language: "javascript", displayName: "JavaScript", standard: null, extension: ".js" },
  ];

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("hydrates the saved compiler language after mount", async () => {
    window.localStorage.setItem("compiler:language", "javascript");

    render(
      <CompilerClient
        languages={languages}
        title="Compiler"
        description="Run code"
        preferredLanguage="python"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("language-selector")).toHaveTextContent("javascript");
      expect(screen.getByTestId("code-editor")).toHaveAttribute("data-language", "javascript");
    });
  });
});
