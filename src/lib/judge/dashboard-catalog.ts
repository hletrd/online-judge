import { getDockerImageRuntimeInfo } from "@/lib/judge/languages";

export type EnabledJudgeLanguageRecord = {
  id: string;
  language: string;
  displayName: string;
  standard: string | null;
  extension: string;
  dockerImage: string;
  compiler: string | null;
  compileCommand: string | null;
  runCommand: string;
};

export type JudgeLanguageCatalogRow = EnabledJudgeLanguageRecord & {
  label: string;
  runtime: string;
};

export type FeaturedJudgeEnvironment = {
  key: string;
  title: string;
  runtime: string;
  compiler: string | null;
  variants: string[];
  languageCount: number;
};

export type JudgeLanguageCatalog = {
  allLanguages: JudgeLanguageCatalogRow[];
  featuredEnvironments: FeaturedJudgeEnvironment[];
  additionalLanguageCount: number;
};

type FeaturedGroupConfig = {
  key: string;
  title: string;
  languageIds: string[];
};

const FEATURED_LANGUAGE_GROUPS: FeaturedGroupConfig[] = [
  {
    key: "c",
    title: "C",
    languageIds: ["c23", "c17", "c99", "c89", "clang_c23"],
  },
  {
    key: "cpp",
    title: "C++",
    languageIds: ["cpp23", "cpp20", "clang_cpp23"],
  },
  {
    key: "python",
    title: "Python",
    languageIds: ["python", "micropython"],
  },
  {
    key: "java-jvm",
    title: "Java / JVM",
    languageIds: ["java", "kotlin", "scala", "groovy", "clojure", "flix"],
  },
  {
    key: "javascript-typescript",
    title: "JavaScript / TypeScript",
    languageIds: ["typescript", "javascript", "deno_ts", "deno_js", "bun_ts", "bun_js", "coffeescript", "rescript"],
  },
  {
    key: "rust",
    title: "Rust",
    languageIds: ["rust"],
  },
  {
    key: "go",
    title: "Go",
    languageIds: ["go"],
  },
];

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

export function formatEnabledJudgeLanguageLabel(language: Pick<EnabledJudgeLanguageRecord, "displayName" | "standard">) {
  return language.standard ? `${language.displayName} (${language.standard})` : language.displayName;
}

function sortLanguages(a: JudgeLanguageCatalogRow, b: JudgeLanguageCatalogRow) {
  const displayComparison = collator.compare(a.displayName, b.displayName);
  if (displayComparison !== 0) return displayComparison;

  const standardComparison = collator.compare(a.standard ?? "", b.standard ?? "");
  if (standardComparison !== 0) return standardComparison;

  return collator.compare(a.language, b.language);
}

export function buildJudgeLanguageCatalog(rows: EnabledJudgeLanguageRecord[]): JudgeLanguageCatalog {
  const allLanguages = rows
    .map((row) => ({
      ...row,
      label: formatEnabledJudgeLanguageLabel(row),
      runtime: getDockerImageRuntimeInfo(row.dockerImage),
    }))
    .sort(sortLanguages);

  const byLanguage = new Map(allLanguages.map((row) => [row.language, row]));
  const featuredLanguageIds = new Set<string>();

  const featuredEnvironments = FEATURED_LANGUAGE_GROUPS.flatMap((group) => {
    const matchedRows = group.languageIds
      .map((languageId) => byLanguage.get(languageId))
      .filter((row): row is JudgeLanguageCatalogRow => Boolean(row));

    if (matchedRows.length === 0) {
      return [];
    }

    matchedRows.forEach((row) => featuredLanguageIds.add(row.language));
    const representative = matchedRows[0];

    return [{
      key: group.key,
      title: group.title,
      runtime: representative.runtime,
      compiler: representative.compiler,
      variants: [...new Set(matchedRows.map((row) => row.label))],
      languageCount: matchedRows.length,
    } satisfies FeaturedJudgeEnvironment];
  });

  return {
    allLanguages,
    featuredEnvironments,
    additionalLanguageCount: Math.max(allLanguages.length - featuredLanguageIds.size, 0),
  };
}
