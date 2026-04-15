export const problems = [
  // ─── 배열 (1–25) ───────────────────────────────────────────────────────────

  {
    title: "배열 역순 출력",
    description: `N개의 정수가 주어질 때, 이를 역순으로 공백으로 구분하여 한 줄에 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

N개의 정수를 역순으로 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1", isVisible: true },
      { input: "3\n-3 0 7", expectedOutput: "7 0 -3", isVisible: true },
      { input: "1\n42", expectedOutput: "42", isVisible: false },
      { input: "4\n10 -10 20 -20", expectedOutput: "-20 20 -10 10", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "배열의 최댓값과 인덱스",
    description: `N개의 정수가 주어질 때, 최댓값과 그 인덱스(1-based)를 출력하라. 최댓값이 여러 개이면 가장 먼저 등장하는 것의 인덱스를 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

최댓값과 그 인덱스(1-based)를 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "5 5", isVisible: true },
      { input: "4\n7 7 2 1", expectedOutput: "7 1", isVisible: true },
      { input: "1\n-5", expectedOutput: "-5 1", isVisible: false },
      { input: "6\n1 2 3 10 5 6", expectedOutput: "10 4", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "배열의 최솟값과 인덱스",
    description: `N개의 정수가 주어질 때, 최솟값과 그 인덱스(1-based)를 출력하라. 최솟값이 여러 개이면 가장 먼저 등장하는 것의 인덱스를 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

최솟값과 그 인덱스(1-based)를 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "1 2", isVisible: true },
      { input: "4\n-2 -2 0 1", expectedOutput: "-2 1", isVisible: true },
      { input: "1\n100", expectedOutput: "100 1", isVisible: false },
      { input: "6\n5 4 3 2 1 0", expectedOutput: "0 6", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "특정 값의 개수",
    description: `N개의 정수와 찾을 값 X가 주어질 때, 배열에서 X가 몇 번 등장하는지 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)
셋째 줄에 찾을 값 X가 주어진다. (-10,000 ≤ X ≤ 10,000)

## 출력

X의 등장 횟수를 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 2 3 2 1\n2", expectedOutput: "2", isVisible: true },
      { input: "4\n5 5 5 5\n5", expectedOutput: "4", isVisible: true },
      { input: "3\n1 2 3\n7", expectedOutput: "0", isVisible: false },
      { input: "6\n-1 0 -1 1 0 -1\n-1", expectedOutput: "3", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "특정 값 찾기",
    description: `N개의 정수에서 값 X가 처음 등장하는 인덱스(1-based)를 출력하라. X가 없으면 -1을 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)
셋째 줄에 찾을 값 X가 주어진다. (-10,000 ≤ X ≤ 10,000)

## 출력

X가 처음 등장하는 인덱스(1-based)를 출력한다. 없으면 -1을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n10 20 30 20 10\n20", expectedOutput: "2", isVisible: true },
      { input: "4\n1 2 3 4\n5", expectedOutput: "-1", isVisible: true },
      { input: "3\n7 7 7\n7", expectedOutput: "1", isVisible: false },
      { input: "5\n-3 -1 0 1 3\n-1", expectedOutput: "2", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "평균 이상인 수의 개수",
    description: `N개의 정수가 주어질 때, 그 평균 이상인 수가 몇 개인지 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

평균 이상인 수의 개수를 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "3", isVisible: true },
      { input: "4\n4 4 4 4", expectedOutput: "4", isVisible: true },
      { input: "3\n1 2 9", expectedOutput: "1", isVisible: false },
      { input: "6\n10 20 30 40 50 60", expectedOutput: "3", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "두 번째로 큰 수",
    description: `N개의 정수가 주어질 때, 두 번째로 큰 값을 출력하라. 같은 값이 여러 개 있더라도 서로 다른 값 기준으로 두 번째로 큰 값을 출력한다. 서로 다른 값이 2개 이상임이 보장된다.

## 입력

첫째 줄에 정수 N이 주어진다. (2 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000, 서로 다른 값이 2개 이상 보장)

## 출력

두 번째로 큰 값을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "4", isVisible: true },
      { input: "4\n10 10 9 8", expectedOutput: "9", isVisible: true },
      { input: "2\n1 2", expectedOutput: "1", isVisible: false },
      { input: "6\n5 3 5 2 5 1", expectedOutput: "3", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "두 번째로 작은 수",
    description: `N개의 정수가 주어질 때, 두 번째로 작은 값을 출력하라. 같은 값이 여러 개 있더라도 서로 다른 값 기준으로 두 번째로 작은 값을 출력한다. 서로 다른 값이 2개 이상임이 보장된다.

## 입력

첫째 줄에 정수 N이 주어진다. (2 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000, 서로 다른 값이 2개 이상 보장)

## 출력

두 번째로 작은 값을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "3", isVisible: true },
      { input: "4\n2 2 3 4", expectedOutput: "3", isVisible: true },
      { input: "2\n100 200", expectedOutput: "200", isVisible: false },
      { input: "6\n-5 -5 -3 0 0 2", expectedOutput: "-3", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "짝수만 출력",
    description: `N개의 정수 중 짝수만 입력 순서대로 공백으로 구분하여 출력하라. 짝수가 하나도 없으면 "NONE"을 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

짝수만 순서대로 공백으로 구분하여 출력한다. 짝수가 없으면 "NONE"을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n1 2 3 4 5 6", expectedOutput: "2 4 6", isVisible: true },
      { input: "3\n1 3 5", expectedOutput: "NONE", isVisible: true },
      { input: "5\n-4 -2 0 2 4", expectedOutput: "-4 -2 0 2 4", isVisible: false },
      { input: "4\n7 11 13 17", expectedOutput: "NONE", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "홀수만 출력",
    description: `N개의 정수 중 홀수만 입력 순서대로 공백으로 구분하여 출력하라. 홀수가 하나도 없으면 "NONE"을 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

홀수만 순서대로 공백으로 구분하여 출력한다. 홀수가 없으면 "NONE"을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n1 2 3 4 5 6", expectedOutput: "1 3 5", isVisible: true },
      { input: "3\n2 4 6", expectedOutput: "NONE", isVisible: true },
      { input: "5\n-3 -1 1 3 5", expectedOutput: "-3 -1 1 3 5", isVisible: false },
      { input: "4\n10 20 30 40", expectedOutput: "NONE", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "배열 오른쪽 회전",
    description: `N개의 정수를 오른쪽으로 K칸 회전한 결과를 출력하라. 오른쪽 회전이란 배열의 마지막 원소가 맨 앞으로 이동하는 것을 1회로 한다.

## 입력

첫째 줄에 정수 N과 K가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 100, 1 ≤ K ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

오른쪽으로 K칸 회전한 배열을 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 2\n1 2 3 4 5", expectedOutput: "4 5 1 2 3", isVisible: true },
      { input: "4 1\n1 2 3 4", expectedOutput: "4 1 2 3", isVisible: true },
      { input: "3 3\n10 20 30", expectedOutput: "10 20 30", isVisible: false },
      { input: "5 7\n1 2 3 4 5", expectedOutput: "4 5 1 2 3", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "배열 왼쪽 회전",
    description: `N개의 정수를 왼쪽으로 K칸 회전한 결과를 출력하라. 왼쪽 회전이란 배열의 첫 번째 원소가 맨 뒤로 이동하는 것을 1회로 한다.

## 입력

첫째 줄에 정수 N과 K가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 100, 1 ≤ K ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

왼쪽으로 K칸 회전한 배열을 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 2\n1 2 3 4 5", expectedOutput: "3 4 5 1 2", isVisible: true },
      { input: "4 1\n1 2 3 4", expectedOutput: "2 3 4 1", isVisible: true },
      { input: "3 3\n10 20 30", expectedOutput: "10 20 30", isVisible: false },
      { input: "5 7\n1 2 3 4 5", expectedOutput: "3 4 5 1 2", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "배열 원소의 곱",
    description: `N개의 양의 정수가 주어질 때, 모든 원소의 곱을 1,000,000,007로 나눈 나머지를 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 양의 정수가 공백으로 구분되어 주어진다. (1 ≤ 각 값 ≤ 1,000)

## 출력

모든 원소의 곱을 1,000,000,007로 나눈 나머지를 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n1 2 3 4", expectedOutput: "24", isVisible: true },
      { input: "3\n1000 1000 1000", expectedOutput: "1000000000", isVisible: true },
      { input: "1\n7", expectedOutput: "7", isVisible: false },
      { input: "5\n100 200 300 400 500", expectedOutput: "999991607", isVisible: false },
    ],
    tags: ["배열", "수학"],
  },

  {
    title: "구간 합",
    description: `N개의 정수와 구간 [L, R]이 주어질 때, L번째부터 R번째 원소까지의 합을 출력하라. (1-based 인덱스)

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 1,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)
셋째 줄에 정수 L과 R이 공백으로 구분되어 주어진다. (1 ≤ L ≤ R ≤ N)

## 출력

L번째부터 R번째 원소까지의 합을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 2 3 4 5\n2 4", expectedOutput: "9", isVisible: true },
      { input: "6\n10 -3 5 2 -1 4\n1 6", expectedOutput: "17", isVisible: true },
      { input: "3\n100 200 300\n2 2", expectedOutput: "200", isVisible: false },
      { input: "5\n-5 -4 -3 -2 -1\n1 5", expectedOutput: "-15", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "연속 부분 합의 최댓값",
    description: `N개의 정수로 이루어진 배열에서 연속된 부분 배열의 합 중 최댓값을 출력하라. 부분 배열은 길이가 1 이상이어야 한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 1,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

연속 부분 배열의 합 중 최댓값을 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "8\n-2 1 -3 4 -1 2 1 -5", expectedOutput: "6", isVisible: true },
      { input: "5\n1 2 3 4 5", expectedOutput: "15", isVisible: true },
      { input: "4\n-3 -1 -2 -4", expectedOutput: "-1", isVisible: false },
      { input: "6\n5 -10 3 3 3 3", expectedOutput: "12", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "정렬된 두 배열 합치기",
    description: `오름차순으로 정렬된 두 배열 A와 B를 하나의 오름차순 배열로 합쳐 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 오름차순 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)
셋째 줄에 정수 M이 주어진다. (1 ≤ M ≤ 100)
넷째 줄에 M개의 오름차순 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

두 배열을 합쳐 오름차순으로 정렬한 배열을 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 3 5\n3\n2 4 6", expectedOutput: "1 2 3 4 5 6", isVisible: true },
      { input: "2\n1 2\n3\n3 4 5", expectedOutput: "1 2 3 4 5", isVisible: true },
      { input: "1\n10\n1\n10", expectedOutput: "10 10", isVisible: false },
      { input: "3\n-3 -1 1\n2\n-2 0", expectedOutput: "-3 -2 -1 0 1", isVisible: false },
    ],
    tags: ["배열", "정렬"],
  },

  {
    title: "두 배열의 공통 원소",
    description: `두 배열의 공통 원소를 오름차순으로 중복 없이 출력하라. 공통 원소가 없으면 "NONE"을 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)
셋째 줄에 정수 M이 주어진다. (1 ≤ M ≤ 100)
넷째 줄에 M개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

공통 원소를 오름차순으로 중복 없이 공백으로 구분하여 출력한다. 없으면 "NONE"을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 2 3 4 5\n5\n3 4 5 6 7", expectedOutput: "3 4 5", isVisible: true },
      { input: "3\n1 2 3\n3\n4 5 6", expectedOutput: "NONE", isVisible: true },
      { input: "4\n1 1 2 2\n3\n1 2 3", expectedOutput: "1 2", isVisible: false },
      { input: "3\n-2 0 2\n3\n-2 0 2", expectedOutput: "-2 0 2", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "중복 제거 후 출력",
    description: `N개의 정수에서 중복을 제거하고 처음 등장한 순서를 유지하여 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 값 ≤ 10,000)

## 출력

중복을 제거한 정수를 처음 등장 순서대로 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n1 2 3 2 1 4", expectedOutput: "1 2 3 4", isVisible: true },
      { input: "5\n5 5 5 5 5", expectedOutput: "5", isVisible: true },
      { input: "4\n4 3 2 1", expectedOutput: "4 3 2 1", isVisible: false },
      { input: "7\n3 1 4 1 5 9 2", expectedOutput: "3 1 4 5 9 2", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "행렬의 합",
    description: `N×M 크기의 두 정수 행렬 A, B가 주어질 때, A+B를 출력하라.

## 입력

첫째 줄에 정수 N과 M이 공백으로 구분되어 주어진다. (1 ≤ N, M ≤ 10)
다음 N줄에 걸쳐 행렬 A의 원소가 각 줄마다 M개씩 공백으로 구분되어 주어진다. (-1,000 ≤ 각 원소 ≤ 1,000)
다음 N줄에 걸쳐 행렬 B의 원소가 각 줄마다 M개씩 공백으로 구분되어 주어진다. (-1,000 ≤ 각 원소 ≤ 1,000)

## 출력

두 행렬의 합을 N줄에 걸쳐 출력한다. 각 줄의 원소는 공백으로 구분한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "2 2\n1 2\n3 4\n5 6\n7 8",
        expectedOutput: "6 8\n10 12",
        isVisible: true,
      },
      {
        input: "1 3\n1 2 3\n4 5 6",
        expectedOutput: "5 7 9",
        isVisible: true,
      },
      {
        input: "2 3\n1 0 -1\n2 3 4\n-1 0 1\n-2 -3 -4",
        expectedOutput: "0 0 0\n0 0 0",
        isVisible: false,
      },
      {
        input: "3 3\n1 2 3\n4 5 6\n7 8 9\n9 8 7\n6 5 4\n3 2 1",
        expectedOutput: "10 10 10\n10 10 10\n10 10 10",
        isVisible: false,
      },
    ],
    tags: ["배열"],
  },

  {
    title: "행렬의 전치",
    description: `N×M 크기의 정수 행렬이 주어질 때, 전치(transpose) 행렬을 출력하라. 전치 행렬은 행과 열을 서로 바꾼 M×N 행렬이다.

## 입력

첫째 줄에 정수 N과 M이 공백으로 구분되어 주어진다. (1 ≤ N, M ≤ 10)
다음 N줄에 걸쳐 행렬의 원소가 각 줄마다 M개씩 공백으로 구분되어 주어진다. (-1,000 ≤ 각 원소 ≤ 1,000)

## 출력

전치 행렬을 M줄에 걸쳐 출력한다. 각 줄의 원소는 공백으로 구분한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "2 3\n1 2 3\n4 5 6",
        expectedOutput: "1 4\n2 5\n3 6",
        isVisible: true,
      },
      {
        input: "3 3\n1 2 3\n4 5 6\n7 8 9",
        expectedOutput: "1 4 7\n2 5 8\n3 6 9",
        isVisible: true,
      },
      {
        input: "1 4\n10 20 30 40",
        expectedOutput: "10\n20\n30\n40",
        isVisible: false,
      },
      {
        input: "3 2\n1 2\n3 4\n5 6",
        expectedOutput: "1 3 5\n2 4 6",
        isVisible: false,
      },
    ],
    tags: ["배열"],
  },

  {
    title: "대각선 합",
    description: `N×N 크기의 정방 행렬이 주어질 때, 주 대각선(왼쪽 위에서 오른쪽 아래 방향) 원소들의 합을 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 10)
다음 N줄에 걸쳐 행렬의 원소가 각 줄마다 N개씩 공백으로 구분되어 주어진다. (-1,000 ≤ 각 원소 ≤ 1,000)

## 출력

주 대각선 원소들의 합을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "3\n1 2 3\n4 5 6\n7 8 9",
        expectedOutput: "15",
        isVisible: true,
      },
      {
        input: "2\n10 20\n30 40",
        expectedOutput: "50",
        isVisible: true,
      },
      {
        input: "1\n7",
        expectedOutput: "7",
        isVisible: false,
      },
      {
        input: "4\n1 0 0 0\n0 2 0 0\n0 0 3 0\n0 0 0 4",
        expectedOutput: "10",
        isVisible: false,
      },
    ],
    tags: ["배열"],
  },

  {
    title: "행의 합",
    description: `N×M 크기의 정수 행렬이 주어질 때, 각 행의 합을 한 줄에 하나씩 출력하라.

## 입력

첫째 줄에 정수 N과 M이 공백으로 구분되어 주어진다. (1 ≤ N, M ≤ 10)
다음 N줄에 걸쳐 행렬의 원소가 각 줄마다 M개씩 공백으로 구분되어 주어진다. (-1,000 ≤ 각 원소 ≤ 1,000)

## 출력

각 행의 합을 한 줄에 하나씩 N줄 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "3 3\n1 2 3\n4 5 6\n7 8 9",
        expectedOutput: "6\n15\n24",
        isVisible: true,
      },
      {
        input: "2 4\n1 -1 1 -1\n2 -2 2 -2",
        expectedOutput: "0\n0",
        isVisible: true,
      },
      {
        input: "1 3\n100 200 300",
        expectedOutput: "600",
        isVisible: false,
      },
      {
        input: "3 2\n5 5\n10 10\n15 15",
        expectedOutput: "10\n20\n30",
        isVisible: false,
      },
    ],
    tags: ["배열"],
  },

  {
    title: "열의 합",
    description: `N×M 크기의 정수 행렬이 주어질 때, 각 열의 합을 공백으로 구분하여 한 줄에 출력하라.

## 입력

첫째 줄에 정수 N과 M이 공백으로 구분되어 주어진다. (1 ≤ N, M ≤ 10)
다음 N줄에 걸쳐 행렬의 원소가 각 줄마다 M개씩 공백으로 구분되어 주어진다. (-1,000 ≤ 각 원소 ≤ 1,000)

## 출력

각 열의 합을 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "3 3\n1 2 3\n4 5 6\n7 8 9",
        expectedOutput: "12 15 18",
        isVisible: true,
      },
      {
        input: "2 4\n1 2 3 4\n5 6 7 8",
        expectedOutput: "6 8 10 12",
        isVisible: true,
      },
      {
        input: "1 3\n10 20 30",
        expectedOutput: "10 20 30",
        isVisible: false,
      },
      {
        input: "3 2\n-1 1\n-2 2\n-3 3",
        expectedOutput: "-6 6",
        isVisible: false,
      },
    ],
    tags: ["배열"],
  },

  {
    title: "2차원 배열 최댓값 위치",
    description: `N×M 크기의 정수 행렬에서 최댓값과 그 위치(행 번호, 열 번호)를 출력하라. 인덱스는 1-based이며, 최댓값이 여러 곳에 있으면 행 번호가 작은 것을, 행이 같으면 열 번호가 작은 것을 출력한다.

## 입력

첫째 줄에 정수 N과 M이 공백으로 구분되어 주어진다. (1 ≤ N, M ≤ 10)
다음 N줄에 걸쳐 행렬의 원소가 각 줄마다 M개씩 공백으로 구분되어 주어진다. (-1,000 ≤ 각 원소 ≤ 1,000)

## 출력

최댓값, 행 번호, 열 번호를 공백으로 구분하여 한 줄에 출력한다. (모두 1-based)`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "3 3\n1 2 3\n4 9 6\n7 8 5",
        expectedOutput: "9 2 2",
        isVisible: true,
      },
      {
        input: "2 3\n5 5 5\n5 5 5",
        expectedOutput: "5 1 1",
        isVisible: true,
      },
      {
        input: "1 1\n-100",
        expectedOutput: "-100 1 1",
        isVisible: false,
      },
      {
        input: "3 3\n1 2 3\n4 5 6\n7 8 100",
        expectedOutput: "100 3 3",
        isVisible: false,
      },
    ],
    tags: ["배열"],
  },

  {
    title: "달팽이 배열",
    description: `N×N 크기의 배열을 달팽이 순서로 1부터 N²까지 채운 뒤 출력하라. 달팽이 순서란 배열의 가장 바깥쪽부터 시계 방향(오른쪽→아래→왼쪽→위)으로 숫자를 채워 나가는 방식이다.

예를 들어 N=3이면:
\`\`\`
1 2 3
8 9 4
7 6 5
\`\`\`

## 입력

정수 N이 주어진다. (1 ≤ N ≤ 10)

## 출력

달팽이 순서로 채운 N×N 배열을 N줄에 걸쳐 출력한다. 각 줄의 원소는 공백으로 구분한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "3",
        expectedOutput: "1 2 3\n8 9 4\n7 6 5",
        isVisible: true,
      },
      {
        input: "1",
        expectedOutput: "1",
        isVisible: true,
      },
      {
        input: "4",
        expectedOutput: "1 2 3 4\n12 13 14 5\n11 16 15 6\n10 9 8 7",
        isVisible: false,
      },
      {
        input: "2",
        expectedOutput: "1 2\n4 3",
        isVisible: false,
      },
    ],
    tags: ["배열", "구현"],
  },

  // ─── 문자열 (26–50) ──────────────────────────────────────────────────────

  {
    title: "문자열 길이",
    description: `영문자와 숫자로만 이루어진 문자열이 주어질 때, 그 길이를 출력하라.

## 입력

영문자와 숫자로만 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

문자열의 길이를 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello", expectedOutput: "5", isVisible: true },
      { input: "abc123", expectedOutput: "6", isVisible: true },
      { input: "A", expectedOutput: "1", isVisible: false },
      { input: "HelloWorld2024", expectedOutput: "14", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "문자열 뒤집기",
    description: `문자열이 주어질 때, 이를 뒤집어 출력하라.

## 입력

문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100, 공백 없음)

## 출력

문자열을 뒤집어 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello", expectedOutput: "olleh", isVisible: true },
      { input: "abcde", expectedOutput: "edcba", isVisible: true },
      { input: "a", expectedOutput: "a", isVisible: false },
      { input: "racecar", expectedOutput: "racecar", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "대문자로 변환",
    description: `영어 소문자로만 이루어진 문자열이 주어질 때, 모든 문자를 대문자로 변환하여 출력하라.

## 입력

영어 소문자로만 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

모든 문자를 대문자로 변환한 문자열을 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello", expectedOutput: "HELLO", isVisible: true },
      { input: "abcxyz", expectedOutput: "ABCXYZ", isVisible: true },
      { input: "a", expectedOutput: "A", isVisible: false },
      { input: "programming", expectedOutput: "PROGRAMMING", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "소문자로 변환",
    description: `영어 대문자로만 이루어진 문자열이 주어질 때, 모든 문자를 소문자로 변환하여 출력하라.

## 입력

영어 대문자로만 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

모든 문자를 소문자로 변환한 문자열을 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "HELLO", expectedOutput: "hello", isVisible: true },
      { input: "ABCXYZ", expectedOutput: "abcxyz", isVisible: true },
      { input: "Z", expectedOutput: "z", isVisible: false },
      { input: "PROGRAMMING", expectedOutput: "programming", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "대소문자 교환",
    description: `영어 대소문자로 이루어진 문자열이 주어질 때, 대문자는 소문자로, 소문자는 대문자로 교환하여 출력하라.

## 입력

영어 알파벳으로만 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

대소문자를 교환한 문자열을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "Hello", expectedOutput: "hELLO", isVisible: true },
      { input: "AbCdEf", expectedOutput: "aBcDeF", isVisible: true },
      { input: "Z", expectedOutput: "z", isVisible: false },
      { input: "PrOgRaMmInG", expectedOutput: "pRoGrAmMiNg", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "특정 문자 개수",
    description: `문자열과 찾을 문자 하나가 주어질 때, 문자열에서 해당 문자가 몇 번 등장하는지 출력하라.

## 입력

첫째 줄에 영문자와 숫자로만 이루어진 문자열이 주어진다. (1 ≤ 길이 ≤ 100)
둘째 줄에 찾을 문자 하나가 주어진다.

## 출력

해당 문자의 등장 횟수를 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello\nl", expectedOutput: "2", isVisible: true },
      { input: "mississippi\ns", expectedOutput: "4", isVisible: true },
      { input: "aaaaaa\nb", expectedOutput: "0", isVisible: false },
      { input: "abcabc\na", expectedOutput: "2", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "숫자만 추출",
    description: `영문자와 숫자가 혼합된 문자열에서 숫자만 순서대로 붙여 출력하라. 숫자가 하나도 없으면 "NONE"을 출력한다.

## 입력

영문자와 숫자로 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

숫자만 순서대로 붙여 출력한다. 숫자가 없으면 "NONE"을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "abc123def456", expectedOutput: "123456", isVisible: true },
      { input: "abcdef", expectedOutput: "NONE", isVisible: true },
      { input: "1a2b3c", expectedOutput: "123", isVisible: false },
      { input: "Hello2024World", expectedOutput: "2024", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "알파벳만 추출",
    description: `영문자, 숫자, 공백이 혼합된 문자열에서 알파벳만 순서대로 붙여 출력하라. 알파벳이 하나도 없으면 "NONE"을 출력한다.

## 입력

영문자, 숫자, 공백으로 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

알파벳만 순서대로 붙여 출력한다. 알파벳이 없으면 "NONE"을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "abc123def", expectedOutput: "abcdef", isVisible: true },
      { input: "123 456", expectedOutput: "NONE", isVisible: true },
      { input: "Hello World 2024", expectedOutput: "HelloWorld", isVisible: false },
      { input: "a1b2c3", expectedOutput: "abc", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "회문 판별",
    description: `소문자 영어로만 이루어진 문자열이 주어질 때, 이 문자열이 회문(앞에서 읽으나 뒤에서 읽으나 같은 문자열)이면 "YES", 아니면 "NO"를 출력하라.

## 입력

소문자 영어로만 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

회문이면 "YES", 아니면 "NO"를 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "racecar", expectedOutput: "YES", isVisible: true },
      { input: "hello", expectedOutput: "NO", isVisible: true },
      { input: "a", expectedOutput: "YES", isVisible: false },
      { input: "abacaba", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "단어 수 세기",
    description: `공백으로 단어가 구분된 문자열이 주어질 때, 단어의 수를 출력하라. 연속된 공백은 입력에 주어지지 않는다.

## 입력

공백으로 단어가 구분된 문자열이 한 줄에 주어진다. (1 ≤ 전체 길이 ≤ 200, 단어 수 ≥ 1, 연속 공백 없음)

## 출력

단어의 수를 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello world", expectedOutput: "2", isVisible: true },
      { input: "one two three four five", expectedOutput: "5", isVisible: true },
      { input: "single", expectedOutput: "1", isVisible: false },
      { input: "the quick brown fox jumps over the lazy dog", expectedOutput: "9", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "문자열 반복",
    description: `문자열 S와 정수 N이 주어질 때, S를 N번 반복한 결과를 출력하라.

## 입력

첫째 줄에 문자열 S가 주어진다. (1 ≤ S의 길이 ≤ 20, 공백 없음)
둘째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 10)

## 출력

S를 N번 반복한 문자열을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "abc\n3", expectedOutput: "abcabcabc", isVisible: true },
      { input: "ha\n5", expectedOutput: "hahahahaha", isVisible: true },
      { input: "x\n1", expectedOutput: "x", isVisible: false },
      { input: "hello\n2", expectedOutput: "hellohello", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "첫 글자 대문자",
    description: `소문자 영어와 공백으로 이루어진 문자열이 주어질 때, 각 단어의 첫 글자만 대문자로, 나머지는 소문자로 변환하여 출력하라.

## 입력

소문자 영어와 공백으로 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 200, 단어 수 ≥ 1, 연속 공백 없음)

## 출력

각 단어의 첫 글자만 대문자로 변환한 문자열을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello world", expectedOutput: "Hello World", isVisible: true },
      { input: "the quick brown fox", expectedOutput: "The Quick Brown Fox", isVisible: true },
      { input: "single", expectedOutput: "Single", isVisible: false },
      { input: "competitive programming is fun", expectedOutput: "Competitive Programming Is Fun", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "문자열 사전순 비교",
    description: `두 문자열을 사전순으로 비교하여 첫 번째 문자열이 앞이면 -1, 같으면 0, 뒤이면 1을 출력하라.

## 입력

첫째 줄에 소문자 영어로만 이루어진 첫 번째 문자열이 주어진다. (1 ≤ 길이 ≤ 100)
둘째 줄에 소문자 영어로만 이루어진 두 번째 문자열이 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

사전순으로 첫 번째 문자열이 앞이면 -1, 같으면 0, 뒤이면 1을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "apple\nbanana", expectedOutput: "-1", isVisible: true },
      { input: "hello\nhello", expectedOutput: "0", isVisible: true },
      { input: "zebra\nant", expectedOutput: "1", isVisible: false },
      { input: "abc\nabd", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "특정 문자 제거",
    description: `문자열에서 특정 문자를 모두 제거한 결과를 출력하라. 결과가 빈 문자열이면 "EMPTY"를 출력한다.

## 입력

첫째 줄에 영문자와 숫자로만 이루어진 문자열이 주어진다. (1 ≤ 길이 ≤ 100)
둘째 줄에 제거할 문자 하나가 주어진다.

## 출력

특정 문자를 모두 제거한 문자열을 출력한다. 결과가 빈 문자열이면 "EMPTY"를 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello\nl", expectedOutput: "heo", isVisible: true },
      { input: "aaaa\na", expectedOutput: "EMPTY", isVisible: true },
      { input: "abc123\n1", expectedOutput: "abc23", isVisible: false },
      { input: "programming\nm", expectedOutput: "prograing", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "문자열 연결",
    description: `두 문자열이 주어질 때, 이를 이어 붙여 출력하라.

## 입력

첫째 줄에 첫 번째 문자열이 주어진다. (1 ≤ 길이 ≤ 50, 공백 없음)
둘째 줄에 두 번째 문자열이 주어진다. (1 ≤ 길이 ≤ 50, 공백 없음)

## 출력

두 문자열을 이어 붙인 결과를 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "Hello\nWorld", expectedOutput: "HelloWorld", isVisible: true },
      { input: "abc\n123", expectedOutput: "abc123", isVisible: true },
      { input: "foo\nbar", expectedOutput: "foobar", isVisible: false },
      { input: "Judge\nKit", expectedOutput: "JudgeKit", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "부분 문자열 포함 여부",
    description: `문자열 S 안에 문자열 T가 부분 문자열로 포함되어 있으면 "YES", 아니면 "NO"를 출력하라.

## 입력

첫째 줄에 문자열 S가 주어진다. (1 ≤ S의 길이 ≤ 100, 소문자 영어와 숫자)
둘째 줄에 문자열 T가 주어진다. (1 ≤ T의 길이 ≤ 50, 소문자 영어와 숫자)

## 출력

S 안에 T가 포함되어 있으면 "YES", 아니면 "NO"를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "helloworld\nllo", expectedOutput: "YES", isVisible: true },
      { input: "abcdef\nxyz", expectedOutput: "NO", isVisible: true },
      { input: "aaabbbccc\nbbb", expectedOutput: "YES", isVisible: false },
      { input: "abc\nabcd", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "아스키 코드 → 문자",
    description: `정수 N이 주어질 때, N에 해당하는 아스키 문자를 출력하라.

## 입력

아스키 코드 값 N이 주어진다. (33 ≤ N ≤ 126)

## 출력

N에 해당하는 아스키 문자를 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "65", expectedOutput: "A", isVisible: true },
      { input: "97", expectedOutput: "a", isVisible: true },
      { input: "48", expectedOutput: "0", isVisible: false },
      { input: "33", expectedOutput: "!", isVisible: false },
    ],
    tags: ["문자열", "입출력"],
  },

  {
    title: "문자 → 아스키 코드",
    description: `출력 가능한 문자 하나가 주어질 때, 그 문자의 아스키 코드 값을 출력하라.

## 입력

출력 가능한 문자 하나가 주어진다. (아스키 코드 33 이상 126 이하)

## 출력

해당 문자의 아스키 코드 값을 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "A", expectedOutput: "65", isVisible: true },
      { input: "a", expectedOutput: "97", isVisible: true },
      { input: "0", expectedOutput: "48", isVisible: false },
      { input: "!", expectedOutput: "33", isVisible: false },
    ],
    tags: ["문자열", "입출력"],
  },

  {
    title: "시저 암호 (암호화)",
    description: `소문자 영어로만 이루어진 문자열 S와 정수 K가 주어질 때, 각 문자를 알파벳 순서상 K만큼 뒤로 밀어 암호화한 결과를 출력하라. z 다음은 a로 이어진다.

예를 들어 K=3이면 a→d, x→a, z→c 로 변환된다.

## 입력

첫째 줄에 소문자 영어로만 이루어진 문자열 S가 주어진다. (1 ≤ S의 길이 ≤ 100)
둘째 줄에 정수 K가 주어진다. (1 ≤ K ≤ 25)

## 출력

암호화된 문자열을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "abc\n3", expectedOutput: "def", isVisible: true },
      { input: "xyz\n3", expectedOutput: "abc", isVisible: true },
      { input: "hello\n13", expectedOutput: "uryyb", isVisible: false },
      { input: "zebra\n1", expectedOutput: "afcsb", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "시저 암호 (복호화)",
    description: `소문자 영어로만 이루어진 암호화된 문자열 S와 정수 K가 주어질 때, 시저 암호로 암호화된 문자열을 원래 문자열로 복원하라. 암호화는 각 문자를 K만큼 뒤로 민 것이다.

## 입력

첫째 줄에 소문자 영어로만 이루어진 암호화된 문자열 S가 주어진다. (1 ≤ S의 길이 ≤ 100)
둘째 줄에 정수 K가 주어진다. (1 ≤ K ≤ 25)

## 출력

복호화된 원래 문자열을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "def\n3", expectedOutput: "abc", isVisible: true },
      { input: "abc\n3", expectedOutput: "xyz", isVisible: true },
      { input: "uryyb\n13", expectedOutput: "hello", isVisible: false },
      { input: "afcsb\n1", expectedOutput: "zebra", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "문자열 압축",
    description: `소문자 영어로만 이루어진 문자열이 주어질 때, 연속된 같은 문자를 "문자+개수" 형식으로 압축하여 출력하라.

예를 들어 "aaabbc"는 "a3b2c1"로 압축된다.

## 입력

소문자 영어로만 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

압축된 문자열을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "aaabbc", expectedOutput: "a3b2c1", isVisible: true },
      { input: "abcd", expectedOutput: "a1b1c1d1", isVisible: true },
      { input: "aaaaaa", expectedOutput: "a6", isVisible: false },
      { input: "aabbccaabb", expectedOutput: "a2b2c2a2b2", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "애너그램 판별",
    description: `두 문자열이 주어질 때, 두 문자열이 애너그램(서로의 문자를 재배열하면 같아지는 관계)이면 "YES", 아니면 "NO"를 출력하라.

## 입력

첫째 줄에 소문자 영어로만 이루어진 첫 번째 문자열이 주어진다. (1 ≤ 길이 ≤ 100)
둘째 줄에 소문자 영어로만 이루어진 두 번째 문자열이 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

두 문자열이 애너그램이면 "YES", 아니면 "NO"를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "listen\nsilent", expectedOutput: "YES", isVisible: true },
      { input: "hello\nworld", expectedOutput: "NO", isVisible: true },
      { input: "abc\ncba", expectedOutput: "YES", isVisible: false },
      { input: "aab\nabc", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "가장 긴 단어",
    description: `공백으로 단어가 구분된 문자열이 주어질 때, 가장 긴 단어를 출력하라. 길이가 같은 단어가 여러 개이면 첫 번째 단어를 출력한다.

## 입력

공백으로 단어가 구분된 문자열이 한 줄에 주어진다. (1 ≤ 단어 수 ≤ 20, 연속 공백 없음, 소문자 영어)

## 출력

가장 긴 단어를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "the quick brown fox", expectedOutput: "quick", isVisible: true },
      { input: "hello world", expectedOutput: "hello", isVisible: true },
      { input: "a bb ccc dd e", expectedOutput: "ccc", isVisible: false },
      { input: "competitive programming", expectedOutput: "competitive", isVisible: false },
    ],
    tags: ["문자열"],
  },

  {
    title: "알파벳 빈도수",
    description: `소문자 영어로만 이루어진 문자열이 주어질 때, a부터 z까지 각 문자의 등장 횟수를 공백으로 구분하여 한 줄에 출력하라.

## 입력

소문자 영어로만 이루어진 문자열이 한 줄에 주어진다. (1 ≤ 길이 ≤ 100)

## 출력

a부터 z까지 각 문자의 등장 횟수를 공백으로 구분하여 한 줄에 출력한다. (총 26개)`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "abc",
        expectedOutput: "1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
        isVisible: true,
      },
      {
        input: "aabbcc",
        expectedOutput: "2 2 2 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
        isVisible: true,
      },
      {
        input: "z",
        expectedOutput: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1",
        isVisible: false,
      },
      {
        input: "hello",
        expectedOutput: "0 0 0 0 1 0 0 1 0 0 0 2 0 0 1 0 0 0 0 0 0 0 0 0 0 0",
        isVisible: false,
      },
    ],
    tags: ["문자열"],
  },

  {
    title: "문자열 내 단어 뒤집기",
    description: `공백으로 단어가 구분된 문자열이 주어질 때, 단어의 순서는 유지하되 각 단어를 뒤집어 출력하라.

## 입력

공백으로 단어가 구분된 문자열이 한 줄에 주어진다. (1 ≤ 전체 길이 ≤ 200, 연속 공백 없음, 소문자 영어)

## 출력

각 단어를 뒤집되 단어 순서는 유지한 문자열을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello world", expectedOutput: "olleh dlrow", isVisible: true },
      { input: "the quick brown fox", expectedOutput: "eht kciuq nworb xof", isVisible: true },
      { input: "single", expectedOutput: "elgnis", isVisible: false },
      { input: "abcde fghij", expectedOutput: "edcba jihgf", isVisible: false },
    ],
    tags: ["문자열"],
  },
];
