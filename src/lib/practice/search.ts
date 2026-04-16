export type PracticeSearchMatchKind = "number" | "title" | "content";

export function normalizePracticeSearch(value?: string) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 200);
}

export function escapePracticeLike(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}

export function getPracticeSearchMatchKinds(
  problem: {
    sequenceNumber: number | null;
    title: string;
    description: string | null;
  },
  query: string,
): PracticeSearchMatchKind[] {
  const normalizedQuery = normalizePracticeSearch(query).toLocaleLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const matches: PracticeSearchMatchKind[] = [];
  const normalizedTitle = problem.title.toLocaleLowerCase();
  const normalizedDescription = (problem.description ?? "").toLocaleLowerCase();
  const normalizedSequenceNumber = problem.sequenceNumber != null ? String(problem.sequenceNumber) : "";

  if (normalizedSequenceNumber.includes(normalizedQuery)) {
    matches.push("number");
  }

  if (normalizedTitle.includes(normalizedQuery)) {
    matches.push("title");
  }

  if (normalizedDescription.includes(normalizedQuery)) {
    matches.push("content");
  }

  return matches;
}
