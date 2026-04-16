export type CodeDiffLine = {
  kind: "context" | "added" | "removed";
  text: string;
  previousLineNumber: number | null;
  currentLineNumber: number | null;
};

export type CodeDiffResult = {
  lines: CodeDiffLine[];
  summary: {
    added: number;
    removed: number;
    unchanged: number;
  };
};

function splitLines(source: string) {
  if (source.length === 0) {
    return [] as string[];
  }

  return source.replace(/\r\n/g, "\n").split("\n");
}

export function buildCodeSnapshotDiff(previousSource: string, currentSource: string): CodeDiffResult {
  const previousLines = splitLines(previousSource);
  const currentLines = splitLines(currentSource);
  const lcsMatrix = Array.from({ length: previousLines.length + 1 }, () =>
    Array(currentLines.length + 1).fill(0)
  );

  for (let previousIndex = previousLines.length - 1; previousIndex >= 0; previousIndex -= 1) {
    for (let currentIndex = currentLines.length - 1; currentIndex >= 0; currentIndex -= 1) {
      lcsMatrix[previousIndex][currentIndex] =
        previousLines[previousIndex] === currentLines[currentIndex]
          ? lcsMatrix[previousIndex + 1][currentIndex + 1] + 1
          : Math.max(
              lcsMatrix[previousIndex + 1][currentIndex],
              lcsMatrix[previousIndex][currentIndex + 1]
            );
    }
  }

  const lines: CodeDiffLine[] = [];
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  let previousIndex = 0;
  let currentIndex = 0;
  let previousLineNumber = 1;
  let currentLineNumber = 1;

  while (previousIndex < previousLines.length && currentIndex < currentLines.length) {
    if (previousLines[previousIndex] === currentLines[currentIndex]) {
      lines.push({
        kind: "context",
        text: previousLines[previousIndex] ?? "",
        previousLineNumber,
        currentLineNumber,
      });
      unchanged += 1;
      previousIndex += 1;
      currentIndex += 1;
      previousLineNumber += 1;
      currentLineNumber += 1;
      continue;
    }

    if (lcsMatrix[previousIndex + 1][currentIndex] >= lcsMatrix[previousIndex][currentIndex + 1]) {
      lines.push({
        kind: "removed",
        text: previousLines[previousIndex] ?? "",
        previousLineNumber,
        currentLineNumber: null,
      });
      removed += 1;
      previousIndex += 1;
      previousLineNumber += 1;
      continue;
    }

    lines.push({
      kind: "added",
      text: currentLines[currentIndex] ?? "",
      previousLineNumber: null,
      currentLineNumber,
    });
    added += 1;
    currentIndex += 1;
    currentLineNumber += 1;
  }

  while (previousIndex < previousLines.length) {
    lines.push({
      kind: "removed",
      text: previousLines[previousIndex] ?? "",
      previousLineNumber,
      currentLineNumber: null,
    });
    removed += 1;
    previousIndex += 1;
    previousLineNumber += 1;
  }

  while (currentIndex < currentLines.length) {
    lines.push({
      kind: "added",
      text: currentLines[currentIndex] ?? "",
      previousLineNumber: null,
      currentLineNumber,
    });
    added += 1;
    currentIndex += 1;
    currentLineNumber += 1;
  }

  return {
    lines,
    summary: {
      added,
      removed,
      unchanged,
    },
  };
}
