export const problems = [
  // ─── 입출력 기초 (1–10) ────────────────────────────────────────────────────
  {
    title: "Hello, World!",
    description: `"Hello, World!"를 출력하는 프로그램을 작성하시오.

## 입력

입력 없음.

## 출력

\`Hello, World!\`를 한 줄에 출력한다.`,
    difficulty: 0.3,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "", expectedOutput: "Hello, World!", isVisible: true },
    ],
    tags: ["입출력"],
  },

  {
    title: "정수 출력",
    description: `정수 하나를 입력받아 그대로 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정수 N이 주어진다.

- -10000 ≤ N ≤ 10000

## 출력

N을 그대로 출력한다.`,
    difficulty: 0.3,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "42", expectedOutput: "42", isVisible: true },
      { input: "-7", expectedOutput: "-7", isVisible: false },
      { input: "0", expectedOutput: "0", isVisible: false },
      { input: "10000", expectedOutput: "10000", isVisible: false },
    ],
    tags: ["입출력"],
  },

  {
    title: "두 정수 출력",
    description: `두 정수를 입력받아 각각 줄 바꿔 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B ≤ 10000

## 출력

첫째 줄에 A, 둘째 줄에 B를 출력한다.`,
    difficulty: 0.3,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 7", expectedOutput: "3\n7", isVisible: true },
      { input: "-5 10", expectedOutput: "-5\n10", isVisible: false },
      { input: "0 0", expectedOutput: "0\n0", isVisible: false },
      { input: "10000 -10000", expectedOutput: "10000\n-10000", isVisible: false },
    ],
    tags: ["입출력"],
  },

  {
    title: "문자열 출력",
    description: `알파벳으로만 이루어진 문자열 하나를 입력받아 그대로 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 알파벳 대소문자로만 이루어진 문자열 S가 주어진다.

- 1 ≤ S의 길이 ≤ 50

## 출력

S를 그대로 출력한다.`,
    difficulty: 0.3,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "Hello", expectedOutput: "Hello", isVisible: true },
      { input: "abcABC", expectedOutput: "abcABC", isVisible: false },
      { input: "Z", expectedOutput: "Z", isVisible: false },
      { input: "ThequickBrownFoxJumpsOverTheLazyDog", expectedOutput: "ThequickBrownFoxJumpsOverTheLazyDog", isVisible: false },
    ],
    tags: ["입출력"],
  },

  {
    title: "실수 출력",
    description: `실수 하나를 입력받아 소수점 둘째 자리까지 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 실수 X가 주어진다.

- -10000.0 ≤ X ≤ 10000.0

## 출력

X를 소수점 둘째 자리까지 반올림하여 출력한다.`,
    difficulty: 0.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.005,
    testCases: [
      { input: "3.14159", expectedOutput: "3.14", isVisible: true },
      { input: "-2.5", expectedOutput: "-2.50", isVisible: false },
      { input: "0.0", expectedOutput: "0.00", isVisible: false },
      { input: "9999.999", expectedOutput: "10000.00", isVisible: false },
    ],
    tags: ["입출력"],
  },

  {
    title: "특수 문자 출력",
    description: `입력 없이 아래 문자열을 정확히 출력하는 프로그램을 작성하시오.

출력해야 할 내용:
\`\`\`
!@#$%^&*()
\`\`\`

## 입력

입력 없음.

## 출력

\`!@#$%^&*()\`를 한 줄에 출력한다.`,
    difficulty: 0.4,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "", expectedOutput: "!@#$%^&*()", isVisible: true },
    ],
    tags: ["입출력"],
  },

  {
    title: "N개의 정수 출력",
    description: `N개의 정수를 입력받아 한 줄에 하나씩 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정수의 개수 N이 주어진다.
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100
- -1000 ≤ 각 정수 ≤ 1000

## 출력

입력받은 N개의 정수를 입력 순서대로 한 줄에 하나씩 출력한다.`,
    difficulty: 0.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 2 3", expectedOutput: "1\n2\n3", isVisible: true },
      { input: "5\n-3 0 7 -1 100", expectedOutput: "-3\n0\n7\n-1\n100", isVisible: false },
      { input: "1\n42", expectedOutput: "42", isVisible: false },
      { input: "4\n1000 -1000 0 500", expectedOutput: "1000\n-1000\n0\n500", isVisible: false },
    ],
    tags: ["입출력"],
  },

  {
    title: "공백 포함 문자열",
    description: `공백이 포함된 한 줄 문자열을 입력받아 그대로 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 공백을 포함할 수 있는 문자열 S가 주어진다.

- 1 ≤ S의 길이 ≤ 100

## 출력

S를 그대로 출력한다.`,
    difficulty: 0.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello world", expectedOutput: "hello world", isVisible: true },
      { input: "the quick brown fox", expectedOutput: "the quick brown fox", isVisible: false },
      { input: "a b c", expectedOutput: "a b c", isVisible: false },
      { input: "no spaces", expectedOutput: "no spaces", isVisible: false },
    ],
    tags: ["입출력"],
  },

  {
    title: "여러 줄 출력",
    description: `입력 없이 아래 네 줄을 정확히 출력하는 프로그램을 작성하시오.

\`\`\`
|\\    /|
| \\  / |
|  \\/  |
|  /\\  |
\`\`\`

## 입력

입력 없음.

## 출력

위 네 줄을 정확히 출력한다. 공백과 특수 문자에 유의한다.`,
    difficulty: 0.6,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "",
        expectedOutput: "|\\    /|\n| \\  / |\n|  \\/  |\n|  /\\  |",
        isVisible: true,
      },
    ],
    tags: ["입출력"],
  },

  {
    title: "두 값 동시 출력",
    description: `정수 A와 문자열 S를 입력받아 "S A" 형식으로 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정수 A와 문자열 S가 공백으로 구분되어 주어진다.

- -100 ≤ A ≤ 100
- S는 영어 소문자로만 이루어지며, 1 ≤ S의 길이 ≤ 20

## 출력

"S A" 형식으로 출력한다. S와 A 사이에 공백 한 칸을 출력한다.`,
    difficulty: 0.8,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 hello", expectedOutput: "hello 5", isVisible: true },
      { input: "-3 world", expectedOutput: "world -3", isVisible: false },
      { input: "0 abc", expectedOutput: "abc 0", isVisible: false },
      { input: "100 z", expectedOutput: "z 100", isVisible: false },
    ],
    tags: ["입출력"],
  },

  // ─── 사칙연산 (11–30) ──────────────────────────────────────────────────────
  {
    title: "A+B (1)",
    description: `두 정수 A와 B를 입력받아 A+B를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- 0 ≤ A, B ≤ 100

## 출력

A+B를 출력한다.`,
    difficulty: 0.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1 2", expectedOutput: "3", isVisible: true },
      { input: "0 0", expectedOutput: "0", isVisible: true },
      { input: "50 50", expectedOutput: "100", isVisible: false },
      { input: "99 1", expectedOutput: "100", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "A+B (2)",
    description: `두 정수 A와 B를 입력받아 A+B를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B ≤ 10000

## 출력

A+B를 출력한다.`,
    difficulty: 0.7,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 7", expectedOutput: "10", isVisible: true },
      { input: "-5 3", expectedOutput: "-2", isVisible: false },
      { input: "-10000 -10000", expectedOutput: "-20000", isVisible: false },
      { input: "10000 10000", expectedOutput: "20000", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "A+B (3)",
    description: `두 정수 A와 B를 입력받아 A+B를 출력하는 프로그램을 작성하시오. 두 수의 합이 매우 클 수 있으므로 큰 정수형을 사용해야 한다.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -1000000000 ≤ A, B ≤ 1000000000

## 출력

A+B를 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1000000000 1000000000", expectedOutput: "2000000000", isVisible: true },
      { input: "-1000000000 1000000000", expectedOutput: "0", isVisible: false },
      { input: "999999999 1", expectedOutput: "1000000000", isVisible: false },
      { input: "-500000000 -500000000", expectedOutput: "-1000000000", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "A-B (1)",
    description: `두 정수 A와 B를 입력받아 A-B를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- 0 ≤ A, B ≤ 100

## 출력

A-B를 출력한다.`,
    difficulty: 0.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3", expectedOutput: "2", isVisible: true },
      { input: "0 0", expectedOutput: "0", isVisible: true },
      { input: "10 10", expectedOutput: "0", isVisible: false },
      { input: "100 1", expectedOutput: "99", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "A-B (2)",
    description: `두 정수 A와 B를 입력받아 A-B를 출력하는 프로그램을 작성하시오. 결과가 음수일 수 있다.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B ≤ 10000

## 출력

A-B를 출력한다.`,
    difficulty: 0.7,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 7", expectedOutput: "-4", isVisible: true },
      { input: "-5 -3", expectedOutput: "-2", isVisible: false },
      { input: "10000 -10000", expectedOutput: "20000", isVisible: false },
      { input: "0 0", expectedOutput: "0", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "A×B (1)",
    description: `두 정수 A와 B를 입력받아 A×B를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- 0 ≤ A, B ≤ 100

## 출력

A×B를 출력한다.`,
    difficulty: 0.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4", expectedOutput: "12", isVisible: true },
      { input: "0 100", expectedOutput: "0", isVisible: true },
      { input: "10 10", expectedOutput: "100", isVisible: false },
      { input: "7 8", expectedOutput: "56", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "A×B (2)",
    description: `두 정수 A와 B를 입력받아 A×B를 출력하는 프로그램을 작성하시오. 결과는 int 범위 내에 있다.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B ≤ 10000
- 결과값은 int 범위(-2,147,483,648 ~ 2,147,483,647) 이내임이 보장된다.

## 출력

A×B를 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "100 200", expectedOutput: "20000", isVisible: true },
      { input: "-3 7", expectedOutput: "-21", isVisible: false },
      { input: "-100 -100", expectedOutput: "10000", isVisible: false },
      { input: "0 9999", expectedOutput: "0", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "A÷B (1)",
    description: `두 정수 A와 B를 입력받아 A를 B로 나눈 몫을 출력하는 프로그램을 작성하시오. 결과는 0을 향해 버림한다.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- 1 ≤ B ≤ A ≤ 10000

## 출력

A를 B로 나눈 정수 몫을 출력한다.`,
    difficulty: 0.8,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10 3", expectedOutput: "3", isVisible: true },
      { input: "10 2", expectedOutput: "5", isVisible: false },
      { input: "10000 3", expectedOutput: "3333", isVisible: false },
      { input: "7 7", expectedOutput: "1", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "A÷B (2)",
    description: `두 실수 A와 B를 입력받아 A÷B의 결과를 소수점 셋째 자리까지 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- 1 ≤ A ≤ 10000
- 1 ≤ B ≤ 10000

## 출력

A÷B를 소수점 셋째 자리까지 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.001,
    testCases: [
      { input: "1 3", expectedOutput: "0.333", isVisible: true },
      { input: "10 4", expectedOutput: "2.500", isVisible: false },
      { input: "22 7", expectedOutput: "3.143", isVisible: false },
      { input: "1 1", expectedOutput: "1.000", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "나머지 연산",
    description: `두 정수 A와 B를 입력받아 A를 B로 나눈 나머지를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- 1 ≤ B ≤ A ≤ 10000

## 출력

A를 B로 나눈 나머지를 출력한다.`,
    difficulty: 0.8,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10 3", expectedOutput: "1", isVisible: true },
      { input: "10 2", expectedOutput: "0", isVisible: false },
      { input: "17 5", expectedOutput: "2", isVisible: false },
      { input: "10000 9999", expectedOutput: "1", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "몫과 나머지",
    description: `두 정수 A와 B를 입력받아 A÷B의 몫과 나머지를 공백으로 구분하여 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- 1 ≤ B ≤ A ≤ 10000

## 출력

A÷B의 몫과 나머지를 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 0.8,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10 3", expectedOutput: "3 1", isVisible: true },
      { input: "10 2", expectedOutput: "5 0", isVisible: false },
      { input: "17 5", expectedOutput: "3 2", isVisible: false },
      { input: "7 7", expectedOutput: "1 0", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "세 정수의 합",
    description: `세 정수 A, B, C를 입력받아 A+B+C를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 세 정수 A, B, C가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B, C ≤ 10000

## 출력

A+B+C를 출력한다.`,
    difficulty: 0.8,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1 2 3", expectedOutput: "6", isVisible: true },
      { input: "-1 -2 -3", expectedOutput: "-6", isVisible: false },
      { input: "0 0 0", expectedOutput: "0", isVisible: false },
      { input: "10000 10000 -10000", expectedOutput: "10000", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "세 정수의 곱",
    description: `세 정수 A, B, C를 입력받아 A×B×C를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 세 정수 A, B, C가 공백으로 구분되어 주어진다.

- -100 ≤ A, B, C ≤ 100

## 출력

A×B×C를 출력한다.`,
    difficulty: 0.8,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 3 4", expectedOutput: "24", isVisible: true },
      { input: "-1 2 3", expectedOutput: "-6", isVisible: false },
      { input: "0 50 100", expectedOutput: "0", isVisible: false },
      { input: "-5 -5 4", expectedOutput: "100", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "N개 정수의 평균",
    description: `N개의 정수를 입력받아 평균을 소수점 둘째 자리까지 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정수의 개수 N이 주어진다.
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100
- -1000 ≤ 각 정수 ≤ 1000

## 출력

N개 정수의 평균을 소수점 둘째 자리까지 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.005,
    testCases: [
      { input: "3\n1 2 3", expectedOutput: "2.00", isVisible: true },
      { input: "4\n1 2 3 4", expectedOutput: "2.50", isVisible: false },
      { input: "1\n-7", expectedOutput: "-7.00", isVisible: false },
      { input: "5\n-1 0 1 2 3", expectedOutput: "1.00", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "거듭제곱",
    description: `정수 A와 B를 입력받아 A의 B제곱을 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- 1 ≤ A ≤ 10
- 0 ≤ B ≤ 15
- 결과값은 int 범위 이내임이 보장된다.

## 출력

A^B를 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 10", expectedOutput: "1024", isVisible: true },
      { input: "3 0", expectedOutput: "1", isVisible: false },
      { input: "10 5", expectedOutput: "100000", isVisible: false },
      { input: "1 15", expectedOutput: "1", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "절댓값",
    description: `정수 하나를 입력받아 그 절댓값을 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정수 N이 주어진다.

- -10000 ≤ N ≤ 10000

## 출력

N의 절댓값을 출력한다.`,
    difficulty: 0.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "-5", expectedOutput: "5", isVisible: true },
      { input: "3", expectedOutput: "3", isVisible: false },
      { input: "0", expectedOutput: "0", isVisible: false },
      { input: "-10000", expectedOutput: "10000", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "두 수의 차의 절댓값",
    description: `두 정수 A와 B를 입력받아 |A-B|를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B ≤ 10000

## 출력

|A-B|를 출력한다.`,
    difficulty: 0.7,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 7", expectedOutput: "4", isVisible: true },
      { input: "7 3", expectedOutput: "4", isVisible: false },
      { input: "-5 5", expectedOutput: "10", isVisible: false },
      { input: "0 0", expectedOutput: "0", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "복합 연산 (1)",
    description: `세 정수 A, B, C를 입력받아 (A+B)×C를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 세 정수 A, B, C가 공백으로 구분되어 주어진다.

- -100 ≤ A, B, C ≤ 100

## 출력

(A+B)×C를 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 3 4", expectedOutput: "20", isVisible: true },
      { input: "-1 1 5", expectedOutput: "0", isVisible: false },
      { input: "10 -3 2", expectedOutput: "14", isVisible: false },
      { input: "0 0 100", expectedOutput: "0", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "복합 연산 (2)",
    description: `네 정수 A, B, C, D를 입력받아 A×B+C×D를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 네 정수 A, B, C, D가 공백으로 구분되어 주어진다.

- -100 ≤ A, B, C, D ≤ 100

## 출력

A×B+C×D를 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 3 4 5", expectedOutput: "26", isVisible: true },
      { input: "-1 2 3 -4", expectedOutput: "-14", isVisible: false },
      { input: "0 100 0 100", expectedOutput: "0", isVisible: false },
      { input: "10 10 -5 -5", expectedOutput: "75", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  {
    title: "사칙연산 계산기",
    description: `두 정수와 연산자를 입력받아 계산 결과를 출력하는 프로그램을 작성하시오.

연산자는 \`+\`, \`-\`, \`*\`, \`/\` 중 하나이다.
나눗셈(\`/\`)은 정수 몫만 출력한다.

## 입력

첫째 줄에 정수 A, 연산자 OP, 정수 B가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B ≤ 10000
- OP는 \`+\`, \`-\`, \`*\`, \`/\` 중 하나
- OP가 \`/\`인 경우 B ≠ 0이 보장된다.

## 출력

계산 결과를 출력한다. 나눗셈은 정수 몫을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 + 5", expectedOutput: "8", isVisible: true },
      { input: "10 - 4", expectedOutput: "6", isVisible: true },
      { input: "6 * 7", expectedOutput: "42", isVisible: false },
      { input: "10 / 3", expectedOutput: "3", isVisible: false },
      { input: "-5 + 3", expectedOutput: "-2", isVisible: false },
    ],
    tags: ["사칙연산", "입출력"],
  },

  // ─── 조건문 (31–50) ────────────────────────────────────────────────────────
  {
    title: "양수/음수/영 판별",
    description: `정수 N을 입력받아 양수이면 "positive", 음수이면 "negative", 0이면 "zero"를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정수 N이 주어진다.

- -10000 ≤ N ≤ 10000

## 출력

N이 양수이면 \`positive\`, 음수이면 \`negative\`, 0이면 \`zero\`를 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5", expectedOutput: "positive", isVisible: true },
      { input: "-3", expectedOutput: "negative", isVisible: true },
      { input: "0", expectedOutput: "zero", isVisible: false },
      { input: "10000", expectedOutput: "positive", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "짝수/홀수 판별",
    description: `정수 N을 입력받아 짝수이면 "even", 홀수이면 "odd"를 출력하는 프로그램을 작성하시오. 음수도 올바르게 처리해야 한다.

## 입력

첫째 줄에 정수 N이 주어진다.

- -10000 ≤ N ≤ 10000

## 출력

N이 짝수이면 \`even\`, 홀수이면 \`odd\`를 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4", expectedOutput: "even", isVisible: true },
      { input: "7", expectedOutput: "odd", isVisible: false },
      { input: "-2", expectedOutput: "even", isVisible: false },
      { input: "-3", expectedOutput: "odd", isVisible: false },
      { input: "0", expectedOutput: "even", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "두 수 중 큰 수",
    description: `두 정수 A와 B 중 큰 값을 출력하는 프로그램을 작성하시오. 두 값이 같으면 그 값을 출력한다.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B ≤ 10000

## 출력

A와 B 중 큰 값을 출력한다. 같으면 그 값을 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 5", expectedOutput: "5", isVisible: true },
      { input: "7 2", expectedOutput: "7", isVisible: false },
      { input: "-1 -5", expectedOutput: "-1", isVisible: false },
      { input: "4 4", expectedOutput: "4", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "두 수 중 작은 수",
    description: `두 정수 A와 B 중 작은 값을 출력하는 프로그램을 작성하시오. 두 값이 같으면 그 값을 출력한다.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B ≤ 10000

## 출력

A와 B 중 작은 값을 출력한다. 같으면 그 값을 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 5", expectedOutput: "3", isVisible: true },
      { input: "7 2", expectedOutput: "2", isVisible: false },
      { input: "-1 -5", expectedOutput: "-5", isVisible: false },
      { input: "4 4", expectedOutput: "4", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "세 수 중 최댓값",
    description: `세 정수 A, B, C 중 가장 큰 값을 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 세 정수 A, B, C가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B, C ≤ 10000

## 출력

세 수 중 최댓값을 출력한다.`,
    difficulty: 1.2,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1 3 2", expectedOutput: "3", isVisible: true },
      { input: "-5 -1 -3", expectedOutput: "-1", isVisible: false },
      { input: "10 10 5", expectedOutput: "10", isVisible: false },
      { input: "0 0 0", expectedOutput: "0", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "세 수 중 최솟값",
    description: `세 정수 A, B, C 중 가장 작은 값을 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 세 정수 A, B, C가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B, C ≤ 10000

## 출력

세 수 중 최솟값을 출력한다.`,
    difficulty: 1.2,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1 3 2", expectedOutput: "1", isVisible: true },
      { input: "-5 -1 -3", expectedOutput: "-5", isVisible: false },
      { input: "10 10 5", expectedOutput: "5", isVisible: false },
      { input: "0 0 0", expectedOutput: "0", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "세 수 중 중간값",
    description: `서로 다른 세 정수 A, B, C를 입력받아 중간값(두 번째로 큰 값)을 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 세 정수 A, B, C가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B, C ≤ 10000
- A, B, C는 모두 서로 다르다.

## 출력

세 수의 중간값을 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1 3 2", expectedOutput: "2", isVisible: true },
      { input: "10 5 7", expectedOutput: "7", isVisible: false },
      { input: "-3 -1 -5", expectedOutput: "-3", isVisible: false },
      { input: "100 -100 0", expectedOutput: "0", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "윤년 판별",
    description: `연도 Y가 주어졌을 때, 윤년이면 "leap", 평년이면 "not leap"를 출력하는 프로그램을 작성하시오.

윤년 조건:
- 4로 나누어 떨어지는 해는 윤년이다.
- 단, 100으로 나누어 떨어지는 해는 평년이다.
- 단, 400으로 나누어 떨어지는 해는 윤년이다.

## 입력

첫째 줄에 연도 Y가 주어진다.

- 1 ≤ Y ≤ 9999

## 출력

Y가 윤년이면 \`leap\`, 평년이면 \`not leap\`를 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2000", expectedOutput: "leap", isVisible: true },
      { input: "1900", expectedOutput: "not leap", isVisible: true },
      { input: "2024", expectedOutput: "leap", isVisible: false },
      { input: "2023", expectedOutput: "not leap", isVisible: false },
      { input: "400", expectedOutput: "leap", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "성적 등급",
    description: `점수를 입력받아 해당하는 등급을 출력하는 프로그램을 작성하시오.

등급 기준:
- 90점 이상: A
- 80점 이상 90점 미만: B
- 70점 이상 80점 미만: C
- 60점 이상 70점 미만: D
- 60점 미만: F

## 입력

첫째 줄에 정수 점수 S가 주어진다.

- 0 ≤ S ≤ 100

## 출력

해당 등급을 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "95", expectedOutput: "A", isVisible: true },
      { input: "85", expectedOutput: "B", isVisible: false },
      { input: "75", expectedOutput: "C", isVisible: false },
      { input: "65", expectedOutput: "D", isVisible: false },
      { input: "55", expectedOutput: "F", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "시험 합격 여부",
    description: `세 과목의 점수를 입력받아 합격 여부를 출력하는 프로그램을 작성하시오.

세 과목 점수의 평균이 60점 이상이면 합격(PASS), 미만이면 불합격(FAIL)이다.

## 입력

첫째 줄에 세 과목의 점수 A, B, C가 공백으로 구분되어 주어진다.

- 0 ≤ A, B, C ≤ 100

## 출력

평균이 60점 이상이면 \`PASS\`, 60점 미만이면 \`FAIL\`을 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "70 80 90", expectedOutput: "PASS", isVisible: true },
      { input: "50 50 50", expectedOutput: "FAIL", isVisible: false },
      { input: "60 60 60", expectedOutput: "PASS", isVisible: false },
      { input: "100 0 80", expectedOutput: "PASS", isVisible: false },
      { input: "0 0 100", expectedOutput: "FAIL", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "양수만 합산",
    description: `두 정수를 입력받아 양수인 것만 합산하여 출력하는 프로그램을 작성하시오. 양수가 하나도 없으면 0을 출력한다.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -1000 ≤ A, B ≤ 1000

## 출력

A와 B 중 양수인 값들의 합을 출력한다. 양수가 없으면 0을 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 5", expectedOutput: "8", isVisible: true },
      { input: "-3 5", expectedOutput: "5", isVisible: false },
      { input: "-3 -5", expectedOutput: "0", isVisible: false },
      { input: "0 7", expectedOutput: "7", isVisible: false },
      { input: "0 0", expectedOutput: "0", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "사분면 판별",
    description: `좌표 (x, y)가 주어졌을 때 몇 사분면인지 출력하는 프로그램을 작성하시오.

- 제1사분면: x > 0, y > 0
- 제2사분면: x < 0, y > 0
- 제3사분면: x < 0, y < 0
- 제4사분면: x > 0, y < 0

## 입력

첫째 줄에 정수 x와 y가 공백으로 구분되어 주어진다.

- -1000 ≤ x, y ≤ 1000
- x ≠ 0, y ≠ 0

## 출력

좌표 (x, y)가 속한 사분면 번호(1, 2, 3, 4)를 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1 1", expectedOutput: "1", isVisible: true },
      { input: "-1 1", expectedOutput: "2", isVisible: false },
      { input: "-1 -1", expectedOutput: "3", isVisible: false },
      { input: "1 -1", expectedOutput: "4", isVisible: false },
      { input: "500 -300", expectedOutput: "4", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "삼각형 판별",
    description: `세 변의 길이가 주어졌을 때, 이 세 변으로 삼각형을 만들 수 있는지 판별하는 프로그램을 작성하시오.

삼각형이 되려면 가장 긴 변의 길이가 나머지 두 변의 길이의 합보다 작아야 한다.

## 입력

첫째 줄에 세 변의 길이 a, b, c가 공백으로 구분되어 주어진다.

- 1 ≤ a, b, c ≤ 1000

## 출력

삼각형을 만들 수 있으면 \`YES\`, 없으면 \`NO\`를 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4 5", expectedOutput: "YES", isVisible: true },
      { input: "1 2 3", expectedOutput: "NO", isVisible: true },
      { input: "5 5 5", expectedOutput: "YES", isVisible: false },
      { input: "1 1 1000", expectedOutput: "NO", isVisible: false },
      { input: "10 7 8", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "알파벳 대소문자 판별",
    description: `알파벳 한 글자를 입력받아 대문자이면 "upper", 소문자이면 "lower"를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 알파벳 한 글자가 주어진다.

- 입력은 영어 알파벳 대문자 또는 소문자 한 글자이다.

## 출력

대문자이면 \`upper\`, 소문자이면 \`lower\`를 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "A", expectedOutput: "upper", isVisible: true },
      { input: "z", expectedOutput: "lower", isVisible: false },
      { input: "M", expectedOutput: "upper", isVisible: false },
      { input: "a", expectedOutput: "lower", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "모음/자음 판별",
    description: `영어 소문자 한 글자를 입력받아 모음이면 "vowel", 자음이면 "consonant"를 출력하는 프로그램을 작성하시오.

모음은 a, e, i, o, u이다.

## 입력

첫째 줄에 영어 소문자 한 글자가 주어진다.

## 출력

모음이면 \`vowel\`, 자음이면 \`consonant\`를 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "a", expectedOutput: "vowel", isVisible: true },
      { input: "b", expectedOutput: "consonant", isVisible: false },
      { input: "u", expectedOutput: "vowel", isVisible: false },
      { input: "z", expectedOutput: "consonant", isVisible: false },
      { input: "e", expectedOutput: "vowel", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "배수 판별",
    description: `두 정수 A와 B를 입력받아 A가 B의 배수인지 판별하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- 1 ≤ B ≤ A ≤ 10000

## 출력

A가 B의 배수이면 \`YES\`, 아니면 \`NO\`를 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10 2", expectedOutput: "YES", isVisible: true },
      { input: "10 3", expectedOutput: "NO", isVisible: false },
      { input: "100 10", expectedOutput: "YES", isVisible: false },
      { input: "7 7", expectedOutput: "YES", isVisible: false },
      { input: "9 4", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "두 수 비교",
    description: `두 정수 A와 B를 비교하여 A가 크면 \`>\`, B가 크면 \`<\`, 같으면 \`==\`을 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B ≤ 10000

## 출력

A > B이면 \`>\`, A < B이면 \`<\`, A == B이면 \`==\`을 출력한다.`,
    difficulty: 1.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3", expectedOutput: ">", isVisible: true },
      { input: "3 5", expectedOutput: "<", isVisible: false },
      { input: "4 4", expectedOutput: "==", isVisible: false },
      { input: "-1 -2", expectedOutput: ">", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "나이 구간",
    description: `나이 N을 입력받아 해당 나이 구간을 출력하는 프로그램을 작성하시오.

구간 기준:
- 0 ~ 2세: baby
- 3 ~ 5세: toddler
- 6 ~ 12세: child
- 13 ~ 17세: teenager
- 18 ~ 64세: adult
- 65세 이상: senior

## 입력

첫째 줄에 나이 N이 주어진다.

- 0 ≤ N ≤ 150

## 출력

해당하는 나이 구간 문자열을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "baby", isVisible: true },
      { input: "4", expectedOutput: "toddler", isVisible: false },
      { input: "10", expectedOutput: "child", isVisible: false },
      { input: "15", expectedOutput: "teenager", isVisible: false },
      { input: "30", expectedOutput: "adult", isVisible: false },
      { input: "70", expectedOutput: "senior", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "BMI 계산",
    description: `몸무게와 키를 입력받아 BMI를 계산하고 해당 구간을 출력하는 프로그램을 작성하시오.

BMI 계산식: BMI = 몸무게(kg) ÷ (키(m))²

구간 기준:
- BMI < 18.5: underweight
- 18.5 ≤ BMI < 25.0: normal
- 25.0 ≤ BMI < 30.0: overweight
- BMI ≥ 30.0: obese

## 입력

첫째 줄에 몸무게(kg) W와 키(cm) H가 공백으로 구분되어 주어진다.

- 1.0 ≤ W ≤ 300.0
- 50.0 ≤ H ≤ 250.0

## 출력

해당하는 BMI 구간 문자열을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "70 175", expectedOutput: "normal", isVisible: true },
      { input: "45 170", expectedOutput: "underweight", isVisible: false },
      { input: "90 170", expectedOutput: "overweight", isVisible: false },
      { input: "120 170", expectedOutput: "obese", isVisible: false },
      { input: "50 165", expectedOutput: "normal", isVisible: false },
    ],
    tags: ["조건문"],
  },

  {
    title: "세 수 오름차순 정렬",
    description: `세 정수를 입력받아 오름차순으로 정렬하여 공백으로 구분해 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 세 정수 A, B, C가 공백으로 구분되어 주어진다.

- -10000 ≤ A, B, C ≤ 10000

## 출력

세 수를 오름차순으로 정렬하여 공백으로 구분해 한 줄에 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 1 2", expectedOutput: "1 2 3", isVisible: true },
      { input: "-5 0 3", expectedOutput: "-5 0 3", isVisible: false },
      { input: "10 10 5", expectedOutput: "5 10 10", isVisible: false },
      { input: "100 -100 0", expectedOutput: "-100 0 100", isVisible: false },
      { input: "7 7 7", expectedOutput: "7 7 7", isVisible: false },
    ],
    tags: ["조건문", "정렬"],
  },
];
