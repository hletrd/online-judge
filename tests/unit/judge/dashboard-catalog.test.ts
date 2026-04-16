import { describe, expect, it } from "vitest";
import {
  buildJudgeLanguageCatalog,
  formatEnabledJudgeLanguageLabel,
  type EnabledJudgeLanguageRecord,
} from "@/lib/judge/dashboard-catalog";

function makeLanguage(overrides: Partial<EnabledJudgeLanguageRecord>): EnabledJudgeLanguageRecord {
  return {
    id: overrides.id ?? overrides.language ?? "lang-id",
    language: overrides.language ?? "python",
    displayName: overrides.displayName ?? "Python",
    standard: overrides.standard ?? null,
    extension: overrides.extension ?? ".txt",
    dockerImage: overrides.dockerImage ?? "judge-python:latest",
    compiler: overrides.compiler ?? "CPython 3.14",
    compileCommand: overrides.compileCommand ?? null,
    runCommand: overrides.runCommand ?? "python solution.py",
  };
}

describe("dashboard language catalog", () => {
  it("formats labels with optional standards", () => {
    expect(
      formatEnabledJudgeLanguageLabel({ displayName: "Rust", standard: null })
    ).toBe("Rust");
    expect(
      formatEnabledJudgeLanguageLabel({ displayName: "C", standard: "C23" })
    ).toBe("C (C23)");
  });

  it("keeps major language environments featured while leaving the rest for the full catalog", () => {
    const catalog = buildJudgeLanguageCatalog([
      makeLanguage({ language: "c23", displayName: "C", standard: "C23", dockerImage: "judge-cpp:latest", compiler: "GCC (gcc)" }),
      makeLanguage({ language: "python", displayName: "Python", dockerImage: "judge-python:latest", compiler: "CPython 3.14" }),
      makeLanguage({ language: "javascript", displayName: "JavaScript", dockerImage: "judge-node:latest", compiler: "Node.js 24" }),
      makeLanguage({ language: "rust", displayName: "Rust", dockerImage: "judge-rust:latest", compiler: "Rust 1.94" }),
      makeLanguage({ language: "haskell", displayName: "Haskell", dockerImage: "judge-haskell:latest", compiler: "GHC 9.4" }),
    ]);

    expect(catalog.featuredEnvironments.map((environment) => environment.title)).toEqual([
      "C",
      "Python",
      "JavaScript / TypeScript",
      "Rust",
    ]);
    expect(catalog.featuredEnvironments.find((environment) => environment.title === "Python")?.runtime).toContain("CPython");
    expect(catalog.additionalLanguageCount).toBe(1);
    expect(catalog.allLanguages.map((language) => language.label)).toEqual([
      "C (C23)",
      "Haskell",
      "JavaScript",
      "Python",
      "Rust",
    ]);
  });

  it("keeps CPython as the primary Python environment even when PyPy is enabled", () => {
    const catalog = buildJudgeLanguageCatalog([
      makeLanguage({ language: "python", displayName: "Python", dockerImage: "judge-python:latest", compiler: "CPython 3.14" }),
      makeLanguage({ language: "pypy", displayName: "PyPy", dockerImage: "judge-pypy:latest", compiler: "PyPy 3.10" }),
    ]);

    expect(catalog.featuredEnvironments).toEqual([
      expect.objectContaining({
        title: "Python",
        runtime: expect.stringContaining("Python"),
        compiler: "CPython 3.14",
        variants: ["Python", "PyPy"],
        languageCount: 2,
      }),
    ]);
    expect(catalog.allLanguages.map((language) => language.label)).toEqual(["PyPy", "Python"]);
    expect(catalog.additionalLanguageCount).toBe(0);
  });
});
