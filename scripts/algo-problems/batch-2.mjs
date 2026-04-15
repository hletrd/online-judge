export const problems = [
  // ─── 반복문 기초 (1–20) ────────────────────────────────────────────────────

  {
    title: "1부터 N까지 출력",
    description: `1부터 N까지의 정수를 한 줄에 하나씩 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)

## 출력

1부터 N까지의 정수를 한 줄에 하나씩 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5", expectedOutput: "1\n2\n3\n4\n5", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: true },
      { input: "10", expectedOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10", isVisible: false },
      { input: "3", expectedOutput: "1\n2\n3", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "N부터 1까지 출력",
    description: `N부터 1까지의 정수를 한 줄에 하나씩 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)

## 출력

N부터 1까지의 정수를 한 줄에 하나씩 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5", expectedOutput: "5\n4\n3\n2\n1", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: true },
      { input: "7", expectedOutput: "7\n6\n5\n4\n3\n2\n1", isVisible: false },
      { input: "3", expectedOutput: "3\n2\n1", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "1부터 N까지의 합",
    description: `1부터 N까지의 모든 정수의 합을 구하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 10,000)

## 출력

1부터 N까지의 합을 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 1+2+3+4+5 = 15
      { input: "5", expectedOutput: "15", isVisible: true },
      // 1
      { input: "1", expectedOutput: "1", isVisible: false },
      // 1+...+10 = 55
      { input: "10", expectedOutput: "55", isVisible: false },
      // 1+...+100 = 5050
      { input: "100", expectedOutput: "5050", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "1부터 N까지 짝수의 합",
    description: `1부터 N까지의 정수 중 짝수의 합을 구하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 10,000)

## 출력

1부터 N까지의 짝수의 합을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 2+4+6+8+10 = 30
      { input: "10", expectedOutput: "30", isVisible: true },
      // 2+4 = 6
      { input: "5", expectedOutput: "6", isVisible: false },
      // 2
      { input: "2", expectedOutput: "2", isVisible: false },
      // 2+4+...+20 = 2*(1+2+...+10) = 2*55 = 110
      { input: "20", expectedOutput: "110", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "1부터 N까지 홀수의 합",
    description: `1부터 N까지의 정수 중 홀수의 합을 구하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 10,000)

## 출력

1부터 N까지의 홀수의 합을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 1+3+5+7+9 = 25
      { input: "10", expectedOutput: "25", isVisible: true },
      // 1+3+5 = 9
      { input: "5", expectedOutput: "9", isVisible: false },
      // 1
      { input: "1", expectedOutput: "1", isVisible: false },
      // 1+3+5+7+9+11+13+15+17+19 = 100
      { input: "20", expectedOutput: "100", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "N의 약수 출력",
    description: `자연수 N의 약수를 오름차순으로 공백으로 구분하여 한 줄에 출력하라.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 10,000)

## 출력

N의 약수를 오름차순으로 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "12", expectedOutput: "1 2 3 4 6 12", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "7", expectedOutput: "1 7", isVisible: false },
      { input: "16", expectedOutput: "1 2 4 8 16", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "N의 약수의 개수",
    description: `자연수 N의 약수의 개수를 구하라.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 100,000)

## 출력

N의 약수의 개수를 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 약수: 1,2,3,4,6,12 → 6개
      { input: "12", expectedOutput: "6", isVisible: true },
      // 약수: 1 → 1개
      { input: "1", expectedOutput: "1", isVisible: false },
      // 소수이므로 약수 2개
      { input: "7", expectedOutput: "2", isVisible: false },
      // 약수: 1,2,4,8,16 → 5개
      { input: "16", expectedOutput: "5", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "N의 약수의 합",
    description: `자연수 N의 모든 약수의 합을 구하라.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 100,000)

## 출력

N의 모든 약수의 합을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 1+2+3+4+6+12 = 28
      { input: "12", expectedOutput: "28", isVisible: true },
      // 1
      { input: "1", expectedOutput: "1", isVisible: false },
      // 1+7 = 8
      { input: "7", expectedOutput: "8", isVisible: false },
      // 1+2+4+8+16 = 31
      { input: "16", expectedOutput: "31", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "구구단 (특정 단)",
    description: `정수 N을 입력받아 N단 구구단을 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (2 ≤ N ≤ 9)

## 출력

N*1부터 N*9까지를 "N * M = R" 형식으로 한 줄에 하나씩 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "2",
        expectedOutput:
          "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18",
        isVisible: true,
      },
      {
        input: "5",
        expectedOutput:
          "5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45",
        isVisible: false,
      },
      {
        input: "9",
        expectedOutput:
          "9 * 1 = 9\n9 * 2 = 18\n9 * 3 = 27\n9 * 4 = 36\n9 * 5 = 45\n9 * 6 = 54\n9 * 7 = 63\n9 * 8 = 72\n9 * 9 = 81",
        isVisible: false,
      },
    ],
    tags: ["반복문"],
  },

  {
    title: "구구단 전체",
    description: `2단부터 9단까지의 구구단 전체를 출력하라. 각 단 사이에는 빈 줄을 출력한다.

## 입력

입력이 없다.

## 출력

2단부터 9단까지를 "N * M = R" 형식으로 출력한다. 각 단이 끝난 후 빈 줄을 출력하되, 9단 이후에는 빈 줄을 출력하지 않는다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "",
        expectedOutput:
          "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18\n\n3 * 1 = 3\n3 * 2 = 6\n3 * 3 = 9\n3 * 4 = 12\n3 * 5 = 15\n3 * 6 = 18\n3 * 7 = 21\n3 * 8 = 24\n3 * 9 = 27\n\n4 * 1 = 4\n4 * 2 = 8\n4 * 3 = 12\n4 * 4 = 16\n4 * 5 = 20\n4 * 6 = 24\n4 * 7 = 28\n4 * 8 = 32\n4 * 9 = 36\n\n5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n\n6 * 1 = 6\n6 * 2 = 12\n6 * 3 = 18\n6 * 4 = 24\n6 * 5 = 30\n6 * 6 = 36\n6 * 7 = 42\n6 * 8 = 48\n6 * 9 = 54\n\n7 * 1 = 7\n7 * 2 = 14\n7 * 3 = 21\n7 * 4 = 28\n7 * 5 = 35\n7 * 6 = 42\n7 * 7 = 49\n7 * 8 = 56\n7 * 9 = 63\n\n8 * 1 = 8\n8 * 2 = 16\n8 * 3 = 24\n8 * 4 = 32\n8 * 5 = 40\n8 * 6 = 48\n8 * 7 = 56\n8 * 8 = 64\n8 * 9 = 72\n\n9 * 1 = 9\n9 * 2 = 18\n9 * 3 = 27\n9 * 4 = 36\n9 * 5 = 45\n9 * 6 = 54\n9 * 7 = 63\n9 * 8 = 72\n9 * 9 = 81",
        isVisible: true,
      },
      {
        input: "",
        expectedOutput:
          "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18\n\n3 * 1 = 3\n3 * 2 = 6\n3 * 3 = 9\n3 * 4 = 12\n3 * 5 = 15\n3 * 6 = 18\n3 * 7 = 21\n3 * 8 = 24\n3 * 9 = 27\n\n4 * 1 = 4\n4 * 2 = 8\n4 * 3 = 12\n4 * 4 = 16\n4 * 5 = 20\n4 * 6 = 24\n4 * 7 = 28\n4 * 8 = 32\n4 * 9 = 36\n\n5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n\n6 * 1 = 6\n6 * 2 = 12\n6 * 3 = 18\n6 * 4 = 24\n6 * 5 = 30\n6 * 6 = 36\n6 * 7 = 42\n6 * 8 = 48\n6 * 9 = 54\n\n7 * 1 = 7\n7 * 2 = 14\n7 * 3 = 21\n7 * 4 = 28\n7 * 5 = 35\n7 * 6 = 42\n7 * 7 = 49\n7 * 8 = 56\n7 * 9 = 63\n\n8 * 1 = 8\n8 * 2 = 16\n8 * 3 = 24\n8 * 4 = 32\n8 * 5 = 40\n8 * 6 = 48\n8 * 7 = 56\n8 * 8 = 64\n8 * 9 = 72\n\n9 * 1 = 9\n9 * 2 = 18\n9 * 3 = 27\n9 * 4 = 36\n9 * 5 = 45\n9 * 6 = 54\n9 * 7 = 63\n9 * 8 = 72\n9 * 9 = 81",
        isVisible: false,
      },
      {
        input: "",
        expectedOutput:
          "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18\n\n3 * 1 = 3\n3 * 2 = 6\n3 * 3 = 9\n3 * 4 = 12\n3 * 5 = 15\n3 * 6 = 18\n3 * 7 = 21\n3 * 8 = 24\n3 * 9 = 27\n\n4 * 1 = 4\n4 * 2 = 8\n4 * 3 = 12\n4 * 4 = 16\n4 * 5 = 20\n4 * 6 = 24\n4 * 7 = 28\n4 * 8 = 32\n4 * 9 = 36\n\n5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n\n6 * 1 = 6\n6 * 2 = 12\n6 * 3 = 18\n6 * 4 = 24\n6 * 5 = 30\n6 * 6 = 36\n6 * 7 = 42\n6 * 8 = 48\n6 * 9 = 54\n\n7 * 1 = 7\n7 * 2 = 14\n7 * 3 = 21\n7 * 4 = 28\n7 * 5 = 35\n7 * 6 = 42\n7 * 7 = 49\n7 * 8 = 56\n7 * 9 = 63\n\n8 * 1 = 8\n8 * 2 = 16\n8 * 3 = 24\n8 * 4 = 32\n8 * 5 = 40\n8 * 6 = 48\n8 * 7 = 56\n8 * 8 = 64\n8 * 9 = 72\n\n9 * 1 = 9\n9 * 2 = 18\n9 * 3 = 27\n9 * 4 = 36\n9 * 5 = 45\n9 * 6 = 54\n9 * 7 = 63\n9 * 8 = 72\n9 * 9 = 81",
        isVisible: false,
      },
    ],
    tags: ["반복문"],
  },

  {
    title: "팩토리얼",
    description: `N! (N 팩토리얼)을 계산하라. 0! = 1이다.

## 입력

첫째 줄에 정수 N이 주어진다. (0 ≤ N ≤ 20)

## 출력

N!을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "0", expectedOutput: "1", isVisible: true },
      // 5! = 120
      { input: "5", expectedOutput: "120", isVisible: true },
      // 10! = 3628800
      { input: "10", expectedOutput: "3628800", isVisible: false },
      // 20! = 2432902008176640000
      { input: "20", expectedOutput: "2432902008176640000", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "피보나치 수열",
    description: `피보나치 수열의 N번째 항을 출력하라. F(1) = 1, F(2) = 1이고 N ≥ 3이면 F(N) = F(N-1) + F(N-2)이다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 40)

## 출력

피보나치 수열의 N번째 항을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "1", isVisible: true },
      // F(6) = 1,1,2,3,5,8 → 8
      { input: "6", expectedOutput: "8", isVisible: true },
      // F(10) = 1,1,2,3,5,8,13,21,34,55 → 55
      { input: "10", expectedOutput: "55", isVisible: false },
      // F(40) = 102334155
      { input: "40", expectedOutput: "102334155", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "N개의 정수 중 최댓값",
    description: `N개의 정수가 주어질 때 그 중 최댓값을 구하라.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 정수 ≤ 10,000)

## 출력

최댓값을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "5", isVisible: true },
      { input: "1\n-5", expectedOutput: "-5", isVisible: false },
      { input: "4\n-3 -1 -4 -2", expectedOutput: "-1", isVisible: false },
      { input: "3\n7 7 7", expectedOutput: "7", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "N개의 정수 중 최솟값",
    description: `N개의 정수가 주어질 때 그 중 최솟값을 구하라.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 정수 ≤ 10,000)

## 출력

최솟값을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "1", isVisible: true },
      { input: "1\n-5", expectedOutput: "-5", isVisible: false },
      { input: "4\n-3 -1 -4 -2", expectedOutput: "-4", isVisible: false },
      { input: "3\n7 7 7", expectedOutput: "7", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "N개의 정수의 합",
    description: `N개의 정수가 주어질 때 그 합을 구하라.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 정수 ≤ 10,000)

## 출력

N개의 정수의 합을 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 3+1+4+1+5 = 14
      { input: "5\n3 1 4 1 5", expectedOutput: "14", isVisible: true },
      { input: "1\n-5", expectedOutput: "-5", isVisible: false },
      // -3+-1+-4+-2 = -10
      { input: "4\n-3 -1 -4 -2", expectedOutput: "-10", isVisible: false },
      // 10+20+30 = 60
      { input: "3\n10 20 30", expectedOutput: "60", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "N개의 정수의 평균",
    description: `N개의 정수가 주어질 때 평균을 소수 둘째 자리까지 출력하라.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 정수 ≤ 10,000)

## 출력

평균을 소수 둘째 자리까지 출력한다. (예: 3.50)`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.001,
    testCases: [
      // (1+2+3+4+5)/5 = 15/5 = 3.00
      { input: "5\n1 2 3 4 5", expectedOutput: "3.00", isVisible: true },
      // 7/1 = 7.00
      { input: "1\n7", expectedOutput: "7.00", isVisible: false },
      // (1+2)/2 = 1.50
      { input: "2\n1 2", expectedOutput: "1.50", isVisible: false },
      // (10+20+30)/3 = 20.00
      { input: "3\n10 20 30", expectedOutput: "20.00", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "별 찍기 — 직각삼각형 (왼쪽)",
    description: `N줄짜리 왼쪽 정렬 직각삼각형 모양으로 별을 출력하라. i번째 줄(1-indexed)에는 별 i개를 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 20)

## 출력

N줄에 걸쳐 별을 출력한다. i번째 줄에는 별 i개를 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4", expectedOutput: "*\n**\n***\n****", isVisible: true },
      { input: "1", expectedOutput: "*", isVisible: false },
      { input: "3", expectedOutput: "*\n**\n***", isVisible: false },
      { input: "5", expectedOutput: "*\n**\n***\n****\n*****", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "별 찍기 — 직각삼각형 (오른쪽)",
    description: `N줄짜리 오른쪽 정렬 직각삼각형 모양으로 별을 출력하라. i번째 줄(1-indexed)에는 공백 (N-i)개 뒤에 별 i개를 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 20)

## 출력

N줄에 걸쳐 별을 출력한다. i번째 줄에는 (N-i)개의 공백 뒤에 별 i개를 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // N=4: "   *", "  **", " ***", "****"
      { input: "4", expectedOutput: "   *\n  **\n ***\n****", isVisible: true },
      { input: "1", expectedOutput: "*", isVisible: false },
      // N=3: "  *", " **", "***"
      { input: "3", expectedOutput: "  *\n **\n***", isVisible: false },
      // N=5: "    *", "   **", "  ***", " ****", "*****"
      { input: "5", expectedOutput: "    *\n   **\n  ***\n ****\n*****", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "별 찍기 — 역직각삼각형",
    description: `N줄짜리 역직각삼각형 모양으로 별을 출력하라. i번째 줄(1-indexed)에는 별 (N-i+1)개를 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 20)

## 출력

N줄에 걸쳐 별을 출력한다. i번째 줄에는 별 (N-i+1)개를 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4", expectedOutput: "****\n***\n**\n*", isVisible: true },
      { input: "1", expectedOutput: "*", isVisible: false },
      { input: "3", expectedOutput: "***\n**\n*", isVisible: false },
      { input: "5", expectedOutput: "*****\n****\n***\n**\n*", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "별 찍기 — 피라미드",
    description: `N줄짜리 가운데 정렬 피라미드 모양으로 별을 출력하라. i번째 줄(1-indexed)에는 공백 (N-i)개 뒤에 별 (2i-1)개를 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 20)

## 출력

N줄에 걸쳐 별을 출력한다. i번째 줄에는 (N-i)개의 공백 뒤에 별 (2i-1)개를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // N=4: i=1: "   *", i=2: "  ***", i=3: " *****", i=4: "*******"
      { input: "4", expectedOutput: "   *\n  ***\n *****\n*******", isVisible: true },
      { input: "1", expectedOutput: "*", isVisible: false },
      // N=3: "  *", " ***", "*****"
      { input: "3", expectedOutput: "  *\n ***\n*****", isVisible: false },
      // N=5: "    *","   ***","  *****"," *******","*********"
      { input: "5", expectedOutput: "    *\n   ***\n  *****\n *******\n*********", isVisible: false },
    ],
    tags: ["반복문"],
  },

  // ─── 반복문 중급 (21–40) ──────────────────────────────────────────────────

  {
    title: "별 찍기 — 역피라미드",
    description: `N줄짜리 역피라미드 모양으로 별을 출력하라. i번째 줄(1-indexed)에는 공백 (i-1)개 뒤에 별 (2(N-i)+1)개를 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 20)

## 출력

N줄에 걸쳐 역피라미드 모양으로 별을 출력한다. i번째 줄에는 (i-1)개의 공백 뒤에 별 (2(N-i)+1)개를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // N=4: i=1: "*******", i=2: " *****", i=3: "  ***", i=4: "   *"
      { input: "4", expectedOutput: "*******\n *****\n  ***\n   *", isVisible: true },
      { input: "1", expectedOutput: "*", isVisible: false },
      // N=3: "*****", " ***", "  *"
      { input: "3", expectedOutput: "*****\n ***\n  *", isVisible: false },
      // N=5: "*********"," *******","  *****","   ***","    *"
      { input: "5", expectedOutput: "*********\n *******\n  *****\n   ***\n    *", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "별 찍기 — 다이아몬드",
    description: `홀수 N이 주어지면 다이아몬드 모양으로 별을 출력하라. 위쪽 절반(1 ~ (N+1)/2줄)은 피라미드, 아래쪽 절반((N+3)/2 ~ N줄)은 역피라미드 형태이다.

## 입력

첫째 줄에 홀수 정수 N이 주어진다. (1 ≤ N ≤ 19, N은 홀수)

## 출력

N줄에 걸쳐 다이아몬드 모양으로 별을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "*", isVisible: true },
      // N=3: " *", "***", " *"
      { input: "3", expectedOutput: " *\n***\n *", isVisible: true },
      // N=5: "  *","  ***"," *****","  ***","  *" — wait, let me recount
      // half = (5+1)/2 = 3
      // row1: spaces=2, stars=1 → "  *"
      // row2: spaces=1, stars=3 → " ***"
      // row3: spaces=0, stars=5 → "*****"
      // row4: spaces=1, stars=3 → " ***"
      // row5: spaces=2, stars=1 → "  *"
      { input: "5", expectedOutput: "  *\n ***\n*****\n ***\n  *", isVisible: false },
      // N=7: half=4
      // row1: spaces=3, stars=1 → "   *"
      // row2: spaces=2, stars=3 → "  ***"
      // row3: spaces=1, stars=5 → " *****"
      // row4: spaces=0, stars=7 → "*******"
      // row5: spaces=1, stars=5 → " *****"
      // row6: spaces=2, stars=3 → "  ***"
      // row7: spaces=3, stars=1 → "   *"
      { input: "7", expectedOutput: "   *\n  ***\n *****\n*******\n *****\n  ***\n   *", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "별 찍기 — 모래시계",
    description: `홀수 N이 주어지면 모래시계 모양으로 별을 출력하라. 위쪽 절반은 역피라미드, 아래쪽 절반은 피라미드 형태이다.

## 입력

첫째 줄에 홀수 정수 N이 주어진다. (1 ≤ N ≤ 19, N은 홀수)

## 출력

N줄에 걸쳐 모래시계 모양으로 별을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "*", isVisible: true },
      // N=3: "***", " *", "***"
      { input: "3", expectedOutput: "***\n *\n***", isVisible: true },
      // N=5:
      // row1: spaces=0, stars=5 → "*****"
      // row2: spaces=1, stars=3 → " ***"
      // row3: spaces=2, stars=1 → "  *"
      // row4: spaces=1, stars=3 → " ***"
      // row5: spaces=0, stars=5 → "*****"
      { input: "5", expectedOutput: "*****\n ***\n  *\n ***\n*****", isVisible: false },
      // N=7:
      // row1: 0sp 7stars "*******"
      // row2: 1sp 5stars " *****"
      // row3: 2sp 3stars "  ***"
      // row4: 3sp 1star  "   *"
      // row5: 2sp 3stars "  ***"
      // row6: 1sp 5stars " *****"
      // row7: 0sp 7stars "*******"
      { input: "7", expectedOutput: "*******\n *****\n  ***\n   *\n  ***\n *****\n*******", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "별 찍기 — 체크무늬",
    description: `N×M 격자에서 0-indexed 기준으로 (i+j)가 짝수인 위치에 '*', 홀수인 위치에 ' '를 출력하라.

## 입력

첫째 줄에 행의 수 N과 열의 수 M이 공백으로 구분되어 주어진다. (1 ≤ N, M ≤ 20)

## 출력

N줄에 걸쳐 체크무늬를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 3x3: "*  *  *\n * * *\n*  *  *" — wait
      // row0: (0,0)=even→*, (0,1)=odd→space, (0,2)=even→* → "* *"
      // row1: (1,0)=odd→space, (1,1)=even→*, (1,2)=odd→space → " * "
      // row2: (2,0)=even→*, (2,1)=odd→space, (2,2)=even→* → "* *"
      { input: "3 3", expectedOutput: "* *\n * \n* *", isVisible: true },
      // 2x4:
      // row0: * *(0,0),(0,2) even; (0,1),(0,3) odd → "* * "... wait col indices 0-3
      // (0,0)=0→*, (0,1)=1→sp, (0,2)=2→*, (0,3)=3→sp → "* * "
      // (1,0)=1→sp, (1,1)=2→*, (1,2)=3→sp, (1,3)=4→* → " * *"
      { input: "2 4", expectedOutput: "* * \n * *", isVisible: false },
      // 1x1: *
      { input: "1 1", expectedOutput: "*", isVisible: false },
      // 4x4:
      // row0: * * (cols 0,1,2,3): *,sp,*,sp → "* * "
      // row1: sp,*,sp,* → " * *"
      // row2: *,sp,*,sp → "* * "
      // row3: sp,*,sp,* → " * *"
      { input: "4 4", expectedOutput: "* * \n * *\n* * \n * *", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "별 찍기 — 테두리만",
    description: `N×M 직사각형에서 테두리(첫째 줄, 마지막 줄, 각 줄의 첫 번째 및 마지막 문자)는 '*'로, 안쪽은 ' '(공백)으로 채워 출력하라.

## 입력

첫째 줄에 행의 수 N과 열의 수 M이 공백으로 구분되어 주어진다. (3 ≤ N, M ≤ 20)

## 출력

N줄에 걸쳐 테두리만 별로 채운 직사각형을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 4x5: "*****(5)", "* *(5자)", "* *(5자)", "*****"
      // row0: "*****"
      // row1: "*   *"
      // row2: "*   *"
      // row3: "*****"
      { input: "4 5", expectedOutput: "*****\n*   *\n*   *\n*****", isVisible: true },
      // 3x3: "***","* *","***"
      { input: "3 3", expectedOutput: "***\n* *\n***", isVisible: false },
      // 5x4: "****","*  *","*  *","*  *","****"
      { input: "5 4", expectedOutput: "****\n*  *\n*  *\n*  *\n****", isVisible: false },
      // 3x6: "******","*    *","******"
      { input: "3 6", expectedOutput: "******\n*    *\n******", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "두 수 사이의 합",
    description: `정수 A와 B가 주어질 때 A 이상 B 이하의 모든 정수의 합을 구하라.

## 입력

첫째 줄에 정수 A와 B가 공백으로 구분되어 주어진다. (-10,000 ≤ A ≤ B ≤ 10,000)

## 출력

A부터 B까지의 합을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 1+2+3+4+5 = 15
      { input: "1 5", expectedOutput: "15", isVisible: true },
      // 3
      { input: "3 3", expectedOutput: "3", isVisible: false },
      // -2+-1+0+1+2 = 0
      { input: "-2 2", expectedOutput: "0", isVisible: false },
      // -5+-4+-3 = -12
      { input: "-5 -3", expectedOutput: "-12", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "3의 배수의 합",
    description: `1부터 N까지의 정수 중 3의 배수의 합을 구하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 10,000)

## 출력

1부터 N까지의 3의 배수의 합을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 3+6+9 = 18
      { input: "9", expectedOutput: "18", isVisible: true },
      // 없음
      { input: "2", expectedOutput: "0", isVisible: false },
      // 3
      { input: "3", expectedOutput: "3", isVisible: false },
      // 3+6+9+12+15 = 45
      { input: "15", expectedOutput: "45", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "소수 판별",
    description: `자연수 N이 소수인지 판별하라.

## 입력

첫째 줄에 자연수 N이 주어진다. (2 ≤ N ≤ 1,000,000)

## 출력

N이 소수이면 "YES", 아니면 "NO"를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7", expectedOutput: "YES", isVisible: true },
      { input: "4", expectedOutput: "NO", isVisible: true },
      { input: "2", expectedOutput: "YES", isVisible: false },
      { input: "1000000", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "1부터 N까지의 소수",
    description: `1부터 N까지의 소수를 오름차순으로 공백으로 구분하여 한 줄에 출력하라.

## 입력

첫째 줄에 정수 N이 주어진다. (2 ≤ N ≤ 10,000)

## 출력

1부터 N까지의 소수를 오름차순으로 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10", expectedOutput: "2 3 5 7", isVisible: true },
      { input: "2", expectedOutput: "2", isVisible: false },
      { input: "20", expectedOutput: "2 3 5 7 11 13 17 19", isVisible: false },
      { input: "30", expectedOutput: "2 3 5 7 11 13 17 19 23 29", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "N번째 소수",
    description: `N번째 소수를 출력하라. 첫 번째 소수는 2이다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 1,000)

## 출력

N번째 소수를 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "2", isVisible: true },
      // 2,3,5,7,11 → 5번째
      { input: "5", expectedOutput: "11", isVisible: true },
      // 2,3,5,7,11,13,17,19,23,29 → 10번째
      { input: "10", expectedOutput: "29", isVisible: false },
      // 1000번째 소수 = 7919
      { input: "1000", expectedOutput: "7919", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "자릿수의 합",
    description: `자연수 N의 각 자릿수의 합을 구하라.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 1,000,000,000)

## 출력

N의 각 자릿수의 합을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 1+2+3 = 6
      { input: "123", expectedOutput: "6", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      // 9+9+9 = 27
      { input: "999", expectedOutput: "27", isVisible: false },
      // 1+0+0+0+0+0+0+0+0+0 = 1
      { input: "1000000000", expectedOutput: "1", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "숫자 뒤집기",
    description: `자연수 N을 뒤집어 출력하라. 뒤집었을 때 앞에 0이 생기면 그 0은 무시한다.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 1,000,000,000)

## 출력

N을 뒤집은 수를 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 1234 → 4321
      { input: "1234", expectedOutput: "4321", isVisible: true },
      // 100 → 001 → 1
      { input: "100", expectedOutput: "1", isVisible: false },
      { input: "1", expectedOutput: "1", isVisible: false },
      // 12300 → 00321 → 321
      { input: "12300", expectedOutput: "321", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "최대공약수",
    description: `두 자연수 A와 B의 최대공약수(GCD)를 구하라. 유클리드 호제법을 사용하여 구현하라.

## 입력

첫째 줄에 두 자연수 A와 B가 공백으로 구분되어 주어진다. (1 ≤ A, B ≤ 1,000,000)

## 출력

A와 B의 최대공약수를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // gcd(12,8) = 4
      { input: "12 8", expectedOutput: "4", isVisible: true },
      // gcd(1,1) = 1
      { input: "1 1", expectedOutput: "1", isVisible: false },
      // gcd(100,75) = 25
      { input: "100 75", expectedOutput: "25", isVisible: false },
      // gcd(7,13) = 1
      { input: "7 13", expectedOutput: "1", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "최소공배수",
    description: `두 자연수 A와 B의 최소공배수(LCM)를 구하라. LCM = A * B / GCD(A, B)를 이용하라.

## 입력

첫째 줄에 두 자연수 A와 B가 공백으로 구분되어 주어진다. (1 ≤ A, B ≤ 100,000)

## 출력

A와 B의 최소공배수를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // lcm(4,6) = 12
      { input: "4 6", expectedOutput: "12", isVisible: true },
      // lcm(1,1) = 1
      { input: "1 1", expectedOutput: "1", isVisible: false },
      // lcm(12,15) = 60
      { input: "12 15", expectedOutput: "60", isVisible: false },
      // lcm(7,11) = 77
      { input: "7 11", expectedOutput: "77", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "이진수 변환",
    description: `10진수 정수 N을 2진수 문자열로 변환하여 출력하라. N이 0이면 "0"을 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (0 ≤ N ≤ 1,000,000)

## 출력

N을 2진수로 변환한 문자열을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 0 → "0"
      { input: "0", expectedOutput: "0", isVisible: true },
      // 10 → 1010
      { input: "10", expectedOutput: "1010", isVisible: true },
      // 255 → 11111111
      { input: "255", expectedOutput: "11111111", isVisible: false },
      // 1000000 → 11110100001001000000
      { input: "1000000", expectedOutput: "11110100001001000000", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "8진수 변환",
    description: `10진수 정수 N을 8진수 문자열로 변환하여 출력하라. N이 0이면 "0"을 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (0 ≤ N ≤ 1,000,000)

## 출력

N을 8진수로 변환한 문자열을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 0 → "0"
      { input: "0", expectedOutput: "0", isVisible: true },
      // 8 → 10
      { input: "8", expectedOutput: "10", isVisible: true },
      // 255 → 377
      { input: "255", expectedOutput: "377", isVisible: false },
      // 1000 → 1750
      { input: "1000", expectedOutput: "1750", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "16진수 변환",
    description: `10진수 정수 N을 16진수 대문자 문자열로 변환하여 출력하라. N이 0이면 "0"을 출력한다.

## 입력

첫째 줄에 정수 N이 주어진다. (0 ≤ N ≤ 1,000,000)

## 출력

N을 16진수로 변환한 문자열을 대문자로 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 0 → "0"
      { input: "0", expectedOutput: "0", isVisible: true },
      // 255 → FF
      { input: "255", expectedOutput: "FF", isVisible: true },
      // 16 → 10
      { input: "16", expectedOutput: "10", isVisible: false },
      // 1000000 → F4240
      { input: "1000000", expectedOutput: "F4240", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "2진수 → 10진수",
    description: `2진수 문자열을 10진수 정수로 변환하여 출력하라.

## 입력

첫째 줄에 2진수 문자열이 주어진다. (길이 1 이상 30 이하, 선행 0 없음, 단 "0" 자체는 입력될 수 있음)

## 출력

2진수 문자열에 해당하는 10진수 정수를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // "1010" → 10
      { input: "1010", expectedOutput: "10", isVisible: true },
      { input: "0", expectedOutput: "0", isVisible: false },
      // "11111111" → 255
      { input: "11111111", expectedOutput: "255", isVisible: false },
      // "1" → 1
      { input: "1", expectedOutput: "1", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "거듭제곱 (반복문)",
    description: `A를 B번 곱한 값(A^B)을 반복문을 사용하여 계산하라.

## 입력

첫째 줄에 정수 A와 B가 공백으로 구분되어 주어진다. (1 ≤ A ≤ 100, 0 ≤ B ≤ 10)

## 출력

A^B를 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 2^10 = 1024
      { input: "2 10", expectedOutput: "1024", isVisible: true },
      // 5^0 = 1
      { input: "5 0", expectedOutput: "1", isVisible: false },
      // 3^3 = 27
      { input: "3 3", expectedOutput: "27", isVisible: false },
      // 10^5 = 100000
      { input: "10 5", expectedOutput: "100000", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "콜라츠 추측",
    description: `자연수 N에 대해 다음 과정을 반복한다.
- N이 짝수이면 N을 2로 나눈다.
- N이 홀수이면 N을 3배 하고 1을 더한다.

N이 1이 될 때까지 위 과정을 반복한 횟수를 출력하라. N이 1이면 0을 출력한다.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 1,000,000)

## 출력

콜라츠 과정의 반복 횟수를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // N=1 → 0
      { input: "1", expectedOutput: "0", isVisible: true },
      // N=6: 6→3→10→5→16→8→4→2→1 (8 steps)
      { input: "6", expectedOutput: "8", isVisible: true },
      // N=27 → 111 steps
      { input: "27", expectedOutput: "111", isVisible: false },
      // N=2: 2→1 (1 step)
      { input: "2", expectedOutput: "1", isVisible: false },
    ],
    tags: ["반복문"],
  },

  // ─── 반복문 응용 (41–50) ─────────────────────────────────────────────────

  {
    title: "완전수 판별",
    description: `자연수 N이 완전수인지 판별하라. 완전수란 자기 자신을 제외한 모든 약수의 합이 자기 자신과 같은 수이다.

## 입력

첫째 줄에 자연수 N이 주어진다. (2 ≤ N ≤ 10,000)

## 출력

N이 완전수이면 "YES", 아니면 "NO"를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 6: 약수 1+2+3 = 6 → YES
      { input: "6", expectedOutput: "YES", isVisible: true },
      { input: "7", expectedOutput: "NO", isVisible: true },
      // 28: 1+2+4+7+14 = 28 → YES
      { input: "28", expectedOutput: "YES", isVisible: false },
      // 496: 완전수
      { input: "496", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "자연수의 자릿수",
    description: `자연수 N의 자릿수를 출력하라.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 1,000,000,000)

## 출력

N의 자릿수를 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "12345", expectedOutput: "5", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "1000000000", expectedOutput: "10", isVisible: false },
      { input: "99", expectedOutput: "2", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "배수의 합",
    description: `A의 배수 중 B 이하인 것들의 합을 구하라.

## 입력

첫째 줄에 정수 A와 B가 공백으로 구분되어 주어진다. (1 ≤ A ≤ 1,000, 1 ≤ B ≤ 100,000)

## 출력

A의 배수 중 B 이하인 수들의 합을 출력한다. A의 배수 중 B 이하인 수가 없으면 0을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 3의 배수 중 10 이하: 3+6+9 = 18
      { input: "3 10", expectedOutput: "18", isVisible: true },
      // 5의 배수 중 25 이하: 5+10+15+20+25 = 75
      { input: "5 25", expectedOutput: "75", isVisible: false },
      // 100의 배수 중 50 이하: 없음 → 0
      { input: "100 50", expectedOutput: "0", isVisible: false },
      // 7의 배수 중 21 이하: 7+14+21 = 42
      { input: "7 21", expectedOutput: "42", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "등차수열의 합",
    description: `첫째항 a, 공차 d, 항수 n인 등차수열의 합을 구하라.

## 입력

첫째 줄에 첫째항 a, 공차 d, 항수 n이 공백으로 구분되어 주어진다. (-1,000 ≤ a, d ≤ 1,000, 1 ≤ n ≤ 100)

## 출력

등차수열의 합을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // a=1, d=1, n=5: 1+2+3+4+5 = 15
      { input: "1 1 5", expectedOutput: "15", isVisible: true },
      // a=2, d=3, n=4: 2+5+8+11 = 26
      { input: "2 3 4", expectedOutput: "26", isVisible: false },
      // a=10, d=0, n=3: 10+10+10 = 30
      { input: "10 0 3", expectedOutput: "30", isVisible: false },
      // a=-5, d=2, n=5: -5+-3+-1+1+3 = -5
      { input: "-5 2 5", expectedOutput: "-5", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "등비수열의 합",
    description: `첫째항 a, 공비 r, 항수 n인 등비수열의 합을 구하라.

## 입력

첫째 줄에 첫째항 a, 공비 r, 항수 n이 공백으로 구분되어 주어진다. (1 ≤ a ≤ 10, 1 ≤ r ≤ 3, 1 ≤ n ≤ 20)

## 출력

등비수열의 합을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // a=1, r=2, n=5: 1+2+4+8+16 = 31
      { input: "1 2 5", expectedOutput: "31", isVisible: true },
      // a=1, r=1, n=4: 1+1+1+1 = 4
      { input: "1 1 4", expectedOutput: "4", isVisible: false },
      // a=3, r=3, n=3: 3+9+27 = 39
      { input: "3 3 3", expectedOutput: "39", isVisible: false },
      // a=2, r=2, n=6: 2+4+8+16+32+64 = 126
      { input: "2 2 6", expectedOutput: "126", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "제곱의 합",
    description: `1² + 2² + ... + N²을 계산하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 10,000)

## 출력

1² + 2² + ... + N²의 값을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 1+4 = 5
      { input: "2", expectedOutput: "5", isVisible: true },
      // 1+4+9+16+25 = 55
      { input: "5", expectedOutput: "55", isVisible: false },
      { input: "1", expectedOutput: "1", isVisible: false },
      // 1+4+9+16 = 30
      { input: "4", expectedOutput: "30", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "세제곱의 합",
    description: `1³ + 2³ + ... + N³을 계산하라.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 1,000)

## 출력

1³ + 2³ + ... + N³의 값을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 1
      { input: "1", expectedOutput: "1", isVisible: true },
      // 1+8 = 9
      { input: "2", expectedOutput: "9", isVisible: false },
      // 1+8+27 = 36
      { input: "3", expectedOutput: "36", isVisible: false },
      // 1+8+27+64+125 = 225
      { input: "5", expectedOutput: "225", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },

  {
    title: "카운트다운 (짝수만)",
    description: `N부터 0까지 짝수만 한 줄에 하나씩 출력하라. N이 홀수이면 N보다 작은 가장 큰 짝수부터 시작한다.

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 100)

## 출력

N부터 0까지 짝수만 한 줄에 하나씩 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // N=6: 6,4,2,0
      { input: "6", expectedOutput: "6\n4\n2\n0", isVisible: true },
      // N=5: 4,2,0
      { input: "5", expectedOutput: "4\n2\n0", isVisible: false },
      // N=2: 2,0
      { input: "2", expectedOutput: "2\n0", isVisible: false },
      // N=1: 0
      { input: "1", expectedOutput: "0", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "수의 반복 출력",
    description: `정수 N과 횟수 M이 주어질 때 N을 M번 한 줄에 하나씩 출력하라.

## 입력

첫째 줄에 정수 N과 횟수 M이 공백으로 구분되어 주어진다. (-1,000 ≤ N ≤ 1,000, 1 ≤ M ≤ 50)

## 출력

N을 M번 한 줄에 하나씩 출력한다.`,
    difficulty: 1.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7 3", expectedOutput: "7\n7\n7", isVisible: true },
      { input: "-5 2", expectedOutput: "-5\n-5", isVisible: false },
      { input: "0 1", expectedOutput: "0", isVisible: false },
      { input: "100 4", expectedOutput: "100\n100\n100\n100", isVisible: false },
    ],
    tags: ["반복문"],
  },

  {
    title: "약수 쌍 출력",
    description: `자연수 N의 약수 쌍을 출력하라. 각 줄에 작은 약수와 큰 약수를 공백으로 구분하여 출력한다. 중복 없이 오름차순으로 출력하며, N이 완전제곱수인 경우 중간 약수 쌍(예: √N과 √N)도 한 번만 출력한다.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 100,000)

## 출력

N의 약수 쌍을 오름차순으로 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      // 12: (1,12),(2,6),(3,4)
      { input: "12", expectedOutput: "1 12\n2 6\n3 4", isVisible: true },
      // 1: (1,1)
      { input: "1", expectedOutput: "1 1", isVisible: false },
      // 9: (1,9),(3,3)
      { input: "9", expectedOutput: "1 9\n3 3", isVisible: false },
      // 7: (1,7)
      { input: "7", expectedOutput: "1 7", isVisible: false },
    ],
    tags: ["반복문", "수학"],
  },
];
