export interface JudgeLanguageDefinition {
  displayName: string;
  standard: string | null;
  extension: string;
  dockerImage: string;
  compiler: string | null;
  compileCommand: string[] | null;
  runCommand: string[];
}

export const JUDGE_LANGUAGE_CONFIGS: Record<string, JudgeLanguageDefinition> = {
  c17: {
    displayName: "C",
    standard: "C17",
    extension: ".c",
    dockerImage: "judge-cpp:latest",
    compiler: "GCC (gcc)",
    compileCommand: ["gcc", "-O2", "-std=c17", "-o", "/workspace/solution", "/workspace/solution.c", "-lm"],
    runCommand: ["/workspace/solution"],
  },
  c23: {
    displayName: "C",
    standard: "C23",
    extension: ".c",
    dockerImage: "judge-cpp:latest",
    compiler: "GCC (gcc)",
    compileCommand: ["gcc", "-O2", "-std=c23", "-o", "/workspace/solution", "/workspace/solution.c", "-lm"],
    runCommand: ["/workspace/solution"],
  },
  cpp20: {
    displayName: "C++20",
    standard: "C++20",
    extension: ".cpp",
    dockerImage: "judge-cpp:latest",
    compiler: "GCC (g++)",
    compileCommand: ["g++", "-O2", "-std=c++20", "-o", "/workspace/solution", "/workspace/solution.cpp"],
    runCommand: ["/workspace/solution"],
  },
  cpp23: {
    displayName: "C++23",
    standard: "C++23",
    extension: ".cpp",
    dockerImage: "judge-cpp:latest",
    compiler: "GCC (g++)",
    compileCommand: ["g++", "-O2", "-std=c++23", "-o", "/workspace/solution", "/workspace/solution.cpp"],
    runCommand: ["/workspace/solution"],
  },
  python: {
    displayName: "Python 3",
    standard: null,
    extension: ".py",
    dockerImage: "judge-python:latest",
    compiler: "CPython",
    compileCommand: null,
    runCommand: ["python3", "/workspace/solution.py"],
  },
};

export function getJudgeLanguageDefinition(language: string) {
  return JUDGE_LANGUAGE_CONFIGS[language] ?? null;
}

export function serializeJudgeCommand(command: string[] | null | undefined) {
  return command?.join(" ") ?? null;
}
