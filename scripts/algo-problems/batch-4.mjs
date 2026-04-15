export const problems = [
  // ─── 수학 (1–20) ────────────────────────────────────────────────────────────

  {
    title: "소인수분해",
    description: `자연수 N을 소인수분해하여 소인수를 오름차순으로 한 줄에 공백으로 구분하여 출력한다. 같은 소인수가 여러 번 나타나면 중복하여 출력한다.

## 입력

첫째 줄에 자연수 N이 주어진다. (2 ≤ N ≤ 1,000,000)

## 출력

N의 소인수를 오름차순으로 공백 구분하여 한 줄에 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "12", expectedOutput: "2 2 3", isVisible: true },
      { input: "2", expectedOutput: "2", isVisible: true },
      { input: "360", expectedOutput: "2 2 2 3 3 5", isVisible: false },
      { input: "100", expectedOutput: "2 2 5 5", isVisible: false },
      { input: "1000000", expectedOutput: "2 2 2 2 2 2 5 5 5 5 5 5", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "진법 변환 (10→N진법)",
    description: `10진수 X를 B진법으로 변환하여 출력한다. 10 이상의 숫자는 대문자 알파벳(A, B, C, D, E, F)으로 표현한다.

## 입력

첫째 줄에 10진수 정수 X와 진법 B가 공백으로 구분되어 주어진다. (0 ≤ X ≤ 1,000,000, 2 ≤ B ≤ 16)

## 출력

X를 B진법으로 변환한 문자열을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "255 16", expectedOutput: "FF", isVisible: true },
      { input: "10 2", expectedOutput: "1010", isVisible: true },
      { input: "0 8", expectedOutput: "0", isVisible: false },
      { input: "100 8", expectedOutput: "144", isVisible: false },
      { input: "1000000 16", expectedOutput: "F4240", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "진법 변환 (N진법→10)",
    description: `B진법으로 표현된 문자열 S를 10진수로 변환하여 출력한다. 10 이상의 숫자는 대문자 알파벳(A, B, C, D, E, F)으로 표현되어 있다.

## 입력

첫째 줄에 B진법 문자열 S와 진법 B가 공백으로 구분되어 주어진다. (2 ≤ B ≤ 16, 변환 결과 ≤ 1,000,000,000)

## 출력

S를 10진수로 변환한 결과를 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "FF 16", expectedOutput: "255", isVisible: true },
      { input: "1010 2", expectedOutput: "10", isVisible: true },
      { input: "144 8", expectedOutput: "100", isVisible: false },
      { input: "F4240 16", expectedOutput: "1000000", isVisible: false },
      { input: "1 2", expectedOutput: "1", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "조합 (nCr)",
    description: `n과 r이 주어졌을 때, 이항계수 nCr을 계산하여 출력한다.

nCr은 서로 다른 n개 중에서 순서 없이 r개를 선택하는 경우의 수이며, 다음과 같이 정의된다.

nCr = n! / (r! × (n-r)!)

단, 0C0 = 1로 정의한다.

## 입력

첫째 줄에 n과 r이 공백으로 구분되어 주어진다. (0 ≤ r ≤ n ≤ 20)

## 출력

nCr 값을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 2", expectedOutput: "10", isVisible: true },
      { input: "10 3", expectedOutput: "120", isVisible: true },
      { input: "5 0", expectedOutput: "1", isVisible: false },
      { input: "20 10", expectedOutput: "184756", isVisible: false },
      { input: "0 0", expectedOutput: "1", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "순열 (nPr)",
    description: `n과 r이 주어졌을 때, 순열 nPr을 계산하여 출력한다.

nPr은 서로 다른 n개 중에서 r개를 순서 있게 선택하는 경우의 수이며, 다음과 같이 정의된다.

nPr = n! / (n-r)!

단, nP0 = 1로 정의한다.

## 입력

첫째 줄에 n과 r이 공백으로 구분되어 주어진다. (0 ≤ r ≤ n ≤ 12)

## 출력

nPr 값을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 2", expectedOutput: "20", isVisible: true },
      { input: "4 4", expectedOutput: "24", isVisible: true },
      { input: "12 3", expectedOutput: "1320", isVisible: false },
      { input: "5 0", expectedOutput: "1", isVisible: false },
      { input: "10 2", expectedOutput: "90", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "이항계수 (파스칼의 삼각형)",
    description: `파스칼의 삼각형에서 N번째 행(0-indexed)을 출력한다.

파스칼의 삼각형에서 N번째 행은 N+1개의 원소로 이루어지며, k번째 원소(0-indexed)는 NkC 값이다.

예를 들어 4번째 행은 \`1 4 6 4 1\`이다.

## 입력

첫째 줄에 N이 주어진다. (0 ≤ N ≤ 15)

## 출력

파스칼의 삼각형에서 N번째 행의 원소를 공백으로 구분하여 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4", expectedOutput: "1 4 6 4 1", isVisible: true },
      { input: "0", expectedOutput: "1", isVisible: true },
      { input: "5", expectedOutput: "1 5 10 10 5 1", isVisible: false },
      { input: "1", expectedOutput: "1 1", isVisible: false },
      { input: "15", expectedOutput: "1 15 105 455 1365 3003 5005 6435 6435 5005 3003 1365 455 105 15 1", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "피타고라스 빗변",
    description: `직각삼각형의 두 변 a와 b가 주어질 때, 빗변 c의 길이를 소수 둘째 자리까지 출력한다.

빗변의 길이는 피타고라스 정리에 의해 c = √(a² + b²)이다.

## 입력

첫째 줄에 정수 a와 b가 공백으로 구분되어 주어진다. (1 ≤ a, b ≤ 1,000)

## 출력

빗변 c의 길이를 소수 둘째 자리까지 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.01,
    testCases: [
      { input: "3 4", expectedOutput: "5.00", isVisible: true },
      { input: "5 12", expectedOutput: "13.00", isVisible: true },
      { input: "1 1", expectedOutput: "1.41", isVisible: false },
      { input: "7 24", expectedOutput: "25.00", isVisible: false },
      { input: "5 5", expectedOutput: "7.07", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "원의 넓이와 둘레",
    description: `반지름 r이 주어질 때, 원의 넓이와 둘레를 소수 둘째 자리까지 출력한다.

π = 3.141592653589793을 사용한다.

- 넓이 = π × r²
- 둘레 = 2 × π × r

## 입력

첫째 줄에 정수 r이 주어진다. (1 ≤ r ≤ 1,000)

## 출력

첫째 줄에 원의 넓이를, 둘째 줄에 원의 둘레를 소수 둘째 자리까지 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.01,
    testCases: [
      { input: "1", expectedOutput: "3.14\n6.28", isVisible: true },
      { input: "5", expectedOutput: "78.54\n31.42", isVisible: true },
      { input: "10", expectedOutput: "314.16\n62.83", isVisible: false },
      { input: "100", expectedOutput: "31415.93\n628.32", isVisible: false },
      { input: "3", expectedOutput: "28.27\n18.85", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "직사각형 넓이와 둘레",
    description: `가로 W, 세로 H인 직사각형의 넓이와 둘레를 출력한다.

- 넓이 = W × H
- 둘레 = 2 × (W + H)

## 입력

첫째 줄에 정수 W와 H가 공백으로 구분되어 주어진다. (1 ≤ W, H ≤ 10,000)

## 출력

첫째 줄에 넓이를, 둘째 줄에 둘레를 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 5", expectedOutput: "20\n18", isVisible: true },
      { input: "3 7", expectedOutput: "21\n20", isVisible: true },
      { input: "1 1", expectedOutput: "1\n4", isVisible: false },
      { input: "10000 10000", expectedOutput: "100000000\n40000", isVisible: false },
      { input: "6 3", expectedOutput: "18\n18", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "삼각형 넓이",
    description: `밑변 b와 높이 h가 주어질 때, 삼각형의 넓이를 소수 첫째 자리까지 출력한다.

삼각형의 넓이 = b × h / 2

## 입력

첫째 줄에 정수 b와 h가 공백으로 구분되어 주어진다. (1 ≤ b, h ≤ 10,000)

## 출력

삼각형의 넓이를 소수 첫째 자리까지 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.1,
    testCases: [
      { input: "4 3", expectedOutput: "6.0", isVisible: true },
      { input: "6 5", expectedOutput: "15.0", isVisible: true },
      { input: "3 7", expectedOutput: "10.5", isVisible: false },
      { input: "1 1", expectedOutput: "0.5", isVisible: false },
      { input: "5 4", expectedOutput: "10.0", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "두 점 사이의 거리",
    description: `두 점 (x1, y1)과 (x2, y2)가 주어질 때, 두 점 사이의 거리를 소수 둘째 자리까지 출력한다.

두 점 사이의 거리 = √((x2-x1)² + (y2-y1)²)

## 입력

첫째 줄에 정수 x1, y1, x2, y2가 공백으로 구분되어 주어진다. (-10,000 ≤ x1, y1, x2, y2 ≤ 10,000)

## 출력

두 점 사이의 거리를 소수 둘째 자리까지 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.01,
    testCases: [
      { input: "0 0 3 4", expectedOutput: "5.00", isVisible: true },
      { input: "1 2 4 6", expectedOutput: "5.00", isVisible: true },
      { input: "-3 -4 3 4", expectedOutput: "10.00", isVisible: false },
      { input: "0 0 1 1", expectedOutput: "1.41", isVisible: false },
      { input: "0 0 0 5", expectedOutput: "5.00", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "N번째 삼각수",
    description: `N번째 삼각수 T(N)을 출력한다.

삼각수는 1부터 N까지의 자연수를 모두 더한 값으로, 다음과 같이 정의된다.

T(N) = 1 + 2 + 3 + ... + N = N × (N + 1) / 2

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 10,000)

## 출력

T(N)을 출력한다.`,
    difficulty: 2.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "1", isVisible: true },
      { input: "5", expectedOutput: "15", isVisible: true },
      { input: "100", expectedOutput: "5050", isVisible: false },
      { input: "10000", expectedOutput: "50005000", isVisible: false },
      { input: "3", expectedOutput: "6", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "완전제곱수 판별",
    description: `자연수 N이 완전제곱수인지 판별한다.

완전제곱수란 어떤 정수를 제곱한 수를 말한다. (예: 1, 4, 9, 16, 25, ...)

완전제곱수이면 "YES"를 첫째 줄에, 그 제곱근을 둘째 줄에 출력한다.
완전제곱수가 아니면 "NO"를 출력한다.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 1,000,000,000)

## 출력

N이 완전제곱수이면 첫째 줄에 "YES", 둘째 줄에 제곱근(정수)을 출력한다.
완전제곱수가 아니면 "NO"를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "25", expectedOutput: "YES\n5", isVisible: true },
      { input: "26", expectedOutput: "NO", isVisible: true },
      { input: "1", expectedOutput: "YES\n1", isVisible: false },
      { input: "144", expectedOutput: "YES\n12", isVisible: false },
      { input: "1000000000", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "제곱근 (정수 부분)",
    description: `자연수 N의 제곱근의 정수 부분(내림)을 출력한다.

즉, k² ≤ N < (k+1)²를 만족하는 정수 k를 출력한다.

## 입력

첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 1,000,000,000)

## 출력

N의 제곱근의 정수 부분을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "8", expectedOutput: "2", isVisible: true },
      { input: "25", expectedOutput: "5", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "99", expectedOutput: "9", isVisible: false },
      { input: "1000000000", expectedOutput: "31622", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "소수의 합",
    description: `1 이상 N 이하의 모든 소수의 합을 출력한다.

소수란 1보다 크고, 1과 자기 자신만을 약수로 가지는 자연수이다.

## 입력

첫째 줄에 N이 주어진다. (2 ≤ N ≤ 100,000)

## 출력

1 이상 N 이하의 모든 소수의 합을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10", expectedOutput: "17", isVisible: true },
      { input: "20", expectedOutput: "77", isVisible: true },
      { input: "2", expectedOutput: "2", isVisible: false },
      { input: "100", expectedOutput: "1060", isVisible: false },
      { input: "1000", expectedOutput: "76127", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "약수 함수",
    description: `1 이상 N 이하의 각 자연수의 약수 개수를 모두 합산하여 출력한다.

예를 들어 N=5이면, 1의 약수는 1개, 2의 약수는 2개, 3의 약수는 2개, 4의 약수는 3개, 5의 약수는 2개이므로 합은 10이다.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 10,000)

## 출력

1부터 N까지 각 수의 약수 개수의 합을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5", expectedOutput: "10", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: true },
      { input: "4", expectedOutput: "8", isVisible: false },
      { input: "10", expectedOutput: "27", isVisible: false },
      { input: "100", expectedOutput: "482", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "에라토스테네스의 체",
    description: `N 이하의 소수의 개수를 출력한다.

에라토스테네스의 체(Sieve of Eratosthenes)를 이용하면 효율적으로 소수를 구할 수 있다.

## 입력

첫째 줄에 N이 주어진다. (2 ≤ N ≤ 1,000,000)

## 출력

N 이하의 소수의 개수를 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10", expectedOutput: "4", isVisible: true },
      { input: "100", expectedOutput: "25", isVisible: true },
      { input: "2", expectedOutput: "1", isVisible: false },
      { input: "1000", expectedOutput: "168", isVisible: false },
      { input: "1000000", expectedOutput: "78498", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "쌍둥이 소수",
    description: `N 이하에서 서로 차이가 2인 소수 쌍(쌍둥이 소수)의 개수를 출력한다.

쌍둥이 소수란 두 소수 p, q가 |p - q| = 2인 경우를 말한다. (예: (3, 5), (5, 7), (11, 13), ...)

## 입력

첫째 줄에 N이 주어진다. (4 ≤ N ≤ 100,000)

## 출력

N 이하의 쌍둥이 소수 쌍의 개수를 출력한다. 두 소수가 모두 N 이하인 경우에만 카운트한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "20", expectedOutput: "4", isVisible: true },
      { input: "5", expectedOutput: "1", isVisible: true },
      { input: "4", expectedOutput: "0", isVisible: false },
      { input: "13", expectedOutput: "3", isVisible: false },
      { input: "100", expectedOutput: "8", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "하노이 탑 이동 횟수",
    description: `원판 N개를 하노이 탑 규칙에 따라 1번 기둥에서 3번 기둥으로 옮기는 데 필요한 최소 이동 횟수를 출력한다.

하노이 탑의 최소 이동 횟수는 2^N - 1이다.

## 입력

첫째 줄에 원판의 개수 N이 주어진다. (1 ≤ N ≤ 30)

## 출력

최소 이동 횟수를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "1", isVisible: true },
      { input: "3", expectedOutput: "7", isVisible: true },
      { input: "10", expectedOutput: "1023", isVisible: false },
      { input: "20", expectedOutput: "1048575", isVisible: false },
      { input: "30", expectedOutput: "1073741823", isVisible: false },
    ],
    tags: ["수학", "재귀"],
  },

  {
    title: "하노이 탑 이동 과정",
    description: `원판 N개를 하노이 탑 규칙에 따라 1번 기둥에서 3번 기둥으로 옮기는 과정을 출력한다.

각 이동은 "X Y" 형식으로 출력하며, X번 기둥의 맨 위 원판을 Y번 기둥으로 옮김을 의미한다. 기둥 번호는 1, 2, 3이다.

이동 순서는 재귀적으로 결정된다.

## 입력

첫째 줄에 원판의 개수 N이 주어진다. (1 ≤ N ≤ 10)

## 출력

이동 과정을 한 줄에 하나씩 출력한다. 각 줄은 "X Y" 형식이다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "1 3", isVisible: true },
      { input: "2", expectedOutput: "1 2\n1 3\n2 3", isVisible: true },
      { input: "3", expectedOutput: "1 3\n1 2\n3 2\n1 3\n2 1\n2 3\n1 3", isVisible: false },
      { input: "4", expectedOutput: "1 2\n1 3\n2 3\n1 2\n3 1\n3 2\n1 2\n1 3\n2 3\n2 1\n3 1\n2 3\n1 2\n1 3\n2 3", isVisible: false },
    ],
    tags: ["수학", "재귀"],
  },

  // ─── 정렬과 탐색 (21–35) ────────────────────────────────────────────────────

  {
    title: "오름차순 정렬",
    description: `N개의 정수를 오름차순으로 정렬하여 출력한다.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 1,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)

## 출력

오름차순으로 정렬한 N개의 정수를 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n3 1 2", expectedOutput: "1 2 3", isVisible: true },
      { input: "5\n5 -1 3 2 -4", expectedOutput: "-4 -1 2 3 5", isVisible: true },
      { input: "1\n42", expectedOutput: "42", isVisible: false },
      { input: "4\n-3 -1 -2 -4", expectedOutput: "-4 -3 -2 -1", isVisible: false },
      { input: "5\n1000000 -1000000 0 500000 -500000", expectedOutput: "-1000000 -500000 0 500000 1000000", isVisible: false },
    ],
    tags: ["정렬"],
  },

  {
    title: "내림차순 정렬",
    description: `N개의 정수를 내림차순으로 정렬하여 출력한다.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 1,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)

## 출력

내림차순으로 정렬한 N개의 정수를 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n3 1 2", expectedOutput: "3 2 1", isVisible: true },
      { input: "5\n5 -1 3 2 -4", expectedOutput: "5 3 2 -1 -4", isVisible: true },
      { input: "1\n42", expectedOutput: "42", isVisible: false },
      { input: "4\n-3 -1 -2 -4", expectedOutput: "-1 -2 -3 -4", isVisible: false },
      { input: "5\n1000000 -1000000 0 500000 -500000", expectedOutput: "1000000 500000 0 -500000 -1000000", isVisible: false },
    ],
    tags: ["정렬"],
  },

  {
    title: "절댓값 기준 정렬",
    description: `N개의 정수를 절댓값 기준 오름차순으로 정렬하여 출력한다. 절댓값이 같은 경우 원래 값이 작은 수를 먼저 출력한다.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 1,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)

## 출력

절댓값 기준 오름차순으로 정렬한 결과를 공백으로 구분하여 한 줄에 출력한다. 절댓값이 같으면 값이 작은 수 먼저 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 -1 2 -2 1", expectedOutput: "-1 1 -2 2 3", isVisible: true },
      { input: "5\n-3 2 0 1 -1", expectedOutput: "0 -1 1 2 -3", isVisible: true },
      { input: "1\n-5", expectedOutput: "-5", isVisible: false },
      { input: "4\n-10 10 -5 5", expectedOutput: "-5 5 -10 10", isVisible: false },
      { input: "3\n0 0 0", expectedOutput: "0 0 0", isVisible: false },
    ],
    tags: ["정렬"],
  },

  {
    title: "좌표 정렬",
    description: `N개의 좌표 (x, y)를 x 오름차순으로 정렬하되, x가 같은 경우 y 오름차순으로 정렬하여 출력한다.

## 입력

첫째 줄에 좌표의 개수 N이 주어진다. (1 ≤ N ≤ 1,000)
둘째 줄부터 N개의 줄에 걸쳐 x와 y 좌표가 공백으로 구분되어 주어진다. (-10,000 ≤ x, y ≤ 10,000)

## 출력

정렬된 좌표를 한 줄에 하나씩 출력한다. 각 줄에 x와 y를 공백으로 구분하여 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n3 4\n1 2\n1 -1\n2 3", expectedOutput: "1 -1\n1 2\n2 3\n3 4", isVisible: true },
      { input: "3\n0 0\n-1 5\n0 -3", expectedOutput: "-1 5\n0 -3\n0 0", isVisible: true },
      { input: "1\n5 5", expectedOutput: "5 5", isVisible: false },
      { input: "3\n2 3\n2 1\n2 2", expectedOutput: "2 1\n2 2\n2 3", isVisible: false },
      { input: "4\n-2 3\n1 -4\n-2 -1\n1 2", expectedOutput: "-2 -1\n-2 3\n1 -4\n1 2", isVisible: false },
    ],
    tags: ["정렬"],
  },

  {
    title: "K번째 수",
    description: `N개의 정수를 오름차순으로 정렬했을 때, K번째 수를 출력한다.

## 입력

첫째 줄에 정수의 개수 N과 K가 공백으로 구분되어 주어진다. (1 ≤ K ≤ N ≤ 1,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)

## 출력

오름차순으로 정렬했을 때 K번째 수를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3\n5 2 8 1 3", expectedOutput: "3", isVisible: true },
      { input: "5 2\n10 20 30 40 50", expectedOutput: "20", isVisible: true },
      { input: "1 1\n100", expectedOutput: "100", isVisible: false },
      { input: "4 1\n-5 -3 -1 -4", expectedOutput: "-5", isVisible: false },
      { input: "5 5\n3 1 4 1 5", expectedOutput: "5", isVisible: false },
    ],
    tags: ["정렬"],
  },

  {
    title: "두 수의 합",
    description: `N개의 정수 중에서 두 수를 선택하여 합이 X가 되는 경우가 존재하는지 확인한다.

같은 원소를 두 번 선택할 수 없다. 단, 배열에 같은 값이 두 개 이상 있다면 각각 다른 원소로 선택할 수 있다.

## 입력

첫째 줄에 정수의 개수 N과 목표 합 X가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 1,000, -1,000,000 ≤ X ≤ 1,000,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)

## 출력

합이 X가 되는 두 수의 쌍이 존재하면 "YES", 없으면 "NO"를 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 9\n1 2 3 4 5", expectedOutput: "YES", isVisible: true },
      { input: "5 10\n1 2 3 4 5", expectedOutput: "NO", isVisible: true },
      { input: "3 6\n3 3 5", expectedOutput: "YES", isVisible: false },
      { input: "1 2\n1", expectedOutput: "NO", isVisible: false },
      { input: "4 0\n-3 -1 1 3", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["정렬", "탐색"],
  },

  {
    title: "이진 탐색",
    description: `오름차순으로 정렬된 N개의 정수에서 X의 위치(1-based 인덱스)를 이진 탐색으로 찾아 출력한다. X가 없으면 -1을 출력한다.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 100,000)
둘째 줄에 N개의 정수가 오름차순으로 정렬되어 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)
셋째 줄에 찾을 수 X가 주어진다. (-1,000,000 ≤ X ≤ 1,000,000)

## 출력

X의 1-based 인덱스를 출력한다. X가 없으면 -1을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 3 5 7 9\n7", expectedOutput: "4", isVisible: true },
      { input: "5\n1 3 5 7 9\n4", expectedOutput: "-1", isVisible: true },
      { input: "5\n2 4 6 8 10\n6", expectedOutput: "3", isVisible: false },
      { input: "3\n10 20 30\n10", expectedOutput: "1", isVisible: false },
      { input: "3\n10 20 30\n25", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["탐색"],
  },

  {
    title: "선형 탐색",
    description: `N개의 정수에서 X의 위치(1-based 인덱스)를 선형 탐색으로 찾아 출력한다. X가 없으면 -1을 출력한다. 같은 값이 여러 개 있을 경우 첫 번째 위치를 출력한다.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 1,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)
셋째 줄에 찾을 수 X가 주어진다. (-1,000,000 ≤ X ≤ 1,000,000)

## 출력

X의 첫 번째 1-based 인덱스를 출력한다. X가 없으면 -1을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n5 3 8 1 6\n8", expectedOutput: "3", isVisible: true },
      { input: "5\n5 3 8 1 6\n7", expectedOutput: "-1", isVisible: true },
      { input: "5\n1 2 3 4 5\n1", expectedOutput: "1", isVisible: false },
      { input: "4\n3 3 3 3\n3", expectedOutput: "1", isVisible: false },
      { input: "3\n10 20 30\n30", expectedOutput: "3", isVisible: false },
    ],
    tags: ["탐색"],
  },

  {
    title: "빈도수 정렬",
    description: `N개의 정수를 빈도수(등장 횟수) 기준 내림차순으로 정렬하여 출력한다. 빈도수가 같은 경우 값이 작은 수를 먼저 출력한다.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 1,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (1 ≤ 각 정수 ≤ 1,000)

## 출력

빈도수 기준 내림차순으로 정렬한 결과를 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n4 5 6 5 4 3", expectedOutput: "4 4 5 5 3 6", isVisible: true },
      { input: "6\n3 3 1 2 2 2", expectedOutput: "2 2 2 3 3 1", isVisible: true },
      { input: "3\n1 2 3", expectedOutput: "1 2 3", isVisible: false },
      { input: "5\n5 5 5 5 5", expectedOutput: "5 5 5 5 5", isVisible: false },
      { input: "5\n3 1 2 1 3", expectedOutput: "1 1 3 3 2", isVisible: false },
    ],
    tags: ["정렬"],
  },

  {
    title: "단어 정렬",
    description: `N개의 단어를 길이 기준 오름차순으로 정렬하되, 길이가 같은 경우 사전 순으로 정렬하여 출력한다. 중복된 단어는 한 번만 출력한다.

## 입력

첫째 줄에 단어의 개수 N이 주어진다. (1 ≤ N ≤ 1,000)
둘째 줄부터 N개의 줄에 걸쳐 단어가 하나씩 주어진다. 단어는 소문자 알파벳으로만 이루어져 있다. (1 ≤ 단어 길이 ≤ 50)

## 출력

정렬 기준에 따라 정렬된 단어를 중복 제거 후 한 줄에 하나씩 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\napple\nbanana\ncat\ndog\nant\nbee", expectedOutput: "ant\nbee\ncat\ndog\napple\nbanana", isVisible: true },
      { input: "6\nhello\nworld\nhi\nhey\nho\nhello", expectedOutput: "hi\nho\nhey\nhello\nworld", isVisible: true },
      { input: "3\nzoo\nabc\ndef", expectedOutput: "abc\ndef\nzoo", isVisible: false },
      { input: "4\na\na\na\na", expectedOutput: "a", isVisible: false },
      { input: "3\nlong\nshort\nab", expectedOutput: "ab\nlong\nshort", isVisible: false },
    ],
    tags: ["정렬", "문자열"],
  },

  {
    title: "수 정렬하기 (대용량)",
    description: `N개의 정수를 오름차순으로 정렬하여 출력한다. 데이터의 양이 많으므로 효율적인 정렬 알고리즘을 사용해야 한다.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 100,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)

## 출력

오름차순으로 정렬한 N개의 정수를 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "1 1 3 4 5", isVisible: true },
      { input: "5\n-5 -3 -1 -4 -2", expectedOutput: "-5 -4 -3 -2 -1", isVisible: true },
      { input: "1\n0", expectedOutput: "0", isVisible: false },
      { input: "6\n6 5 4 3 2 1", expectedOutput: "1 2 3 4 5 6", isVisible: false },
      { input: "7\n1000000 -1000000 0 500000 -500000 250000 -250000", expectedOutput: "-1000000 -500000 -250000 0 250000 500000 1000000", isVisible: false },
    ],
    tags: ["정렬"],
  },

  {
    title: "이진수 덧셈",
    description: `두 이진수 문자열 A와 B를 더한 결과를 이진수로 출력한다.

## 입력

첫째 줄에 이진수 문자열 A가 주어진다. (1 ≤ A의 길이 ≤ 30)
둘째 줄에 이진수 문자열 B가 주어진다. (1 ≤ B의 길이 ≤ 30)

두 문자열은 0과 1로만 이루어져 있다.

## 출력

A와 B의 합을 이진수로 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1010\n1011", expectedOutput: "10101", isVisible: true },
      { input: "111\n1", expectedOutput: "1000", isVisible: true },
      { input: "1\n1", expectedOutput: "10", isVisible: false },
      { input: "1101\n101", expectedOutput: "10010", isVisible: false },
      { input: "0\n0", expectedOutput: "0", isVisible: false },
    ],
    tags: ["수학", "문자열"],
  },

  {
    title: "카드 섞기",
    description: `길이가 2N인 배열을 앞 절반과 뒤 절반으로 나눈 후, 두 절반을 번갈아 가며 합친다.

앞 절반을 a1, a2, ..., aN, 뒤 절반을 b1, b2, ..., bN이라 할 때 결과는 a1, b1, a2, b2, ..., aN, bN이다.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 50)
둘째 줄에 2N개의 정수가 공백으로 구분되어 주어진다. (1 ≤ 각 정수 ≤ 1,000)

## 출력

섞인 결과를 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n1 2 3 4", expectedOutput: "1 3 2 4", isVisible: true },
      { input: "3\n1 2 3 4 5 6", expectedOutput: "1 4 2 5 3 6", isVisible: true },
      { input: "1\n7 9", expectedOutput: "7 9", isVisible: false },
      { input: "4\n1 2 3 4 5 6 7 8", expectedOutput: "1 5 2 6 3 7 4 8", isVisible: false },
      { input: "2\n10 20 30 40", expectedOutput: "10 30 20 40", isVisible: false },
    ],
    tags: ["배열"],
  },

  {
    title: "행렬 곱셈",
    description: `N×M 행렬 A와 M×K 행렬 B의 곱 C = A × B를 계산하여 출력한다.

## 입력

첫째 줄에 N, M, K가 공백으로 구분되어 주어진다. (1 ≤ N, M, K ≤ 10)
다음 N개의 줄에 행렬 A의 원소가 행 순서로 공백 구분되어 주어진다. (-100 ≤ 각 원소 ≤ 100)
다음 M개의 줄에 행렬 B의 원소가 행 순서로 공백 구분되어 주어진다. (-100 ≤ 각 원소 ≤ 100)

## 출력

행렬 C = A × B를 N개의 줄에 걸쳐 출력한다. 각 행의 원소를 공백으로 구분하여 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "2 2 2\n1 2\n3 4\n5 6\n7 8",
        expectedOutput: "19 22\n43 50",
        isVisible: true,
      },
      {
        input: "1 3 1\n1 2 3\n4\n5\n6",
        expectedOutput: "32",
        isVisible: true,
      },
      {
        input: "2 3 2\n1 0 2\n-1 3 1\n3 1\n2 1\n1 0",
        expectedOutput: "5 1\n4 2",
        isVisible: false,
      },
      {
        input: "1 1 1\n3\n4",
        expectedOutput: "12",
        isVisible: false,
      },
      {
        input: "2 2 3\n1 2\n3 4\n1 2 3\n4 5 6",
        expectedOutput: "9 12 15\n19 26 33",
        isVisible: false,
      },
    ],
    tags: ["배열", "수학"],
  },

  {
    title: "달력 요일",
    description: `연도 Y, 월 M, 일 D가 주어졌을 때, 해당 날짜의 요일을 영어로 출력한다.

출력 형식: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

## 입력

첫째 줄에 연도 Y, 월 M, 일 D가 공백으로 구분되어 주어진다. (1 ≤ Y ≤ 9999, 유효한 날짜 보장)

## 출력

해당 날짜의 요일을 영어로 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2024 1 1", expectedOutput: "Monday", isVisible: true },
      { input: "2000 1 1", expectedOutput: "Saturday", isVisible: true },
      { input: "1999 12 31", expectedOutput: "Friday", isVisible: false },
      { input: "2026 4 15", expectedOutput: "Wednesday", isVisible: false },
      { input: "1900 1 1", expectedOutput: "Monday", isVisible: false },
    ],
    tags: ["수학", "구현"],
  },

  // ─── 재귀와 기타 (36–50) ───────────────────────────────────────────────────

  {
    title: "재귀로 팩토리얼",
    description: `재귀 함수를 사용하여 N!을 계산하여 출력한다.

N! = N × (N-1) × ... × 1이며, 0! = 1이다.

## 입력

첫째 줄에 N이 주어진다. (0 ≤ N ≤ 20)

## 출력

N!을 출력한다.`,
    difficulty: 2.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5", expectedOutput: "120", isVisible: true },
      { input: "0", expectedOutput: "1", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "10", expectedOutput: "3628800", isVisible: false },
      { input: "20", expectedOutput: "2432902008176640000", isVisible: false },
    ],
    tags: ["재귀"],
  },

  {
    title: "재귀로 피보나치",
    description: `재귀 함수를 사용하여 N번째 피보나치 수를 출력한다.

피보나치 수열은 F(1) = 1, F(2) = 1, F(N) = F(N-1) + F(N-2)로 정의된다.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 30)

## 출력

N번째 피보나치 수를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "1", isVisible: true },
      { input: "5", expectedOutput: "5", isVisible: true },
      { input: "2", expectedOutput: "1", isVisible: false },
      { input: "10", expectedOutput: "55", isVisible: false },
      { input: "30", expectedOutput: "832040", isVisible: false },
    ],
    tags: ["재귀"],
  },

  {
    title: "재귀로 거듭제곱",
    description: `재귀 함수를 사용하여 A의 B제곱(A^B)을 계산하여 출력한다.

단, A^0 = 1로 정의한다.

## 입력

첫째 줄에 A와 B가 공백으로 구분되어 주어진다. (1 ≤ A ≤ 10, 0 ≤ B ≤ 10)

## 출력

A^B를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 10", expectedOutput: "1024", isVisible: true },
      { input: "3 4", expectedOutput: "81", isVisible: true },
      { input: "5 0", expectedOutput: "1", isVisible: false },
      { input: "10 5", expectedOutput: "100000", isVisible: false },
      { input: "7 3", expectedOutput: "343", isVisible: false },
    ],
    tags: ["재귀"],
  },

  {
    title: "재귀로 이진수 변환",
    description: `재귀 함수를 사용하여 10진수 정수 N을 2진수 문자열로 변환하여 출력한다.

## 입력

첫째 줄에 N이 주어진다. (0 ≤ N ≤ 1,000,000)

## 출력

N의 2진수 표현을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5", expectedOutput: "101", isVisible: true },
      { input: "10", expectedOutput: "1010", isVisible: true },
      { input: "0", expectedOutput: "0", isVisible: false },
      { input: "255", expectedOutput: "11111111", isVisible: false },
      { input: "1000000", expectedOutput: "11110100001001000000", isVisible: false },
    ],
    tags: ["재귀"],
  },

  {
    title: "재귀로 문자열 뒤집기",
    description: `재귀 함수를 사용하여 문자열을 뒤집어 출력한다.

## 입력

첫째 줄에 문자열이 주어진다. 문자열은 공백 없이 알파벳 대소문자와 숫자로만 이루어져 있다. (1 ≤ 문자열 길이 ≤ 100)

## 출력

뒤집어진 문자열을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello", expectedOutput: "olleh", isVisible: true },
      { input: "abcde", expectedOutput: "edcba", isVisible: true },
      { input: "a", expectedOutput: "a", isVisible: false },
      { input: "racecar", expectedOutput: "racecar", isVisible: false },
      { input: "abc123", expectedOutput: "321cba", isVisible: false },
    ],
    tags: ["재귀"],
  },

  {
    title: "재귀로 배열의 합",
    description: `재귀 함수를 사용하여 N개 정수의 합을 계산하여 출력한다.

## 입력

첫째 줄에 정수의 개수 N이 주어진다. (1 ≤ N ≤ 100)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)

## 출력

N개 정수의 합을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "15", isVisible: true },
      { input: "3\n10 20 30", expectedOutput: "60", isVisible: true },
      { input: "1\n42", expectedOutput: "42", isVisible: false },
      { input: "4\n-1 2 -3 4", expectedOutput: "2", isVisible: false },
      { input: "3\n-10 0 10", expectedOutput: "0", isVisible: false },
    ],
    tags: ["재귀"],
  },

  {
    title: "재귀로 최대공약수",
    description: `유클리드 호제법을 재귀 함수로 구현하여 두 정수 A와 B의 최대공약수(GCD)를 출력한다.

유클리드 호제법: GCD(A, B) = GCD(B, A mod B), GCD(A, 0) = A

## 입력

첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어진다. (1 ≤ A, B ≤ 1,000,000)

## 출력

A와 B의 최대공약수를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "12 8", expectedOutput: "4", isVisible: true },
      { input: "48 18", expectedOutput: "6", isVisible: true },
      { input: "100 75", expectedOutput: "25", isVisible: false },
      { input: "7 13", expectedOutput: "1", isVisible: false },
      { input: "1000000 999999", expectedOutput: "1", isVisible: false },
    ],
    tags: ["재귀", "수학"],
  },

  {
    title: "괄호 검사",
    description: `'('와 ')'로만 이루어진 괄호 문자열이 올바른 괄호 문자열인지 판별한다.

올바른 괄호 문자열이란:
- 빈 문자열은 올바른 괄호 문자열이다.
- A가 올바른 괄호 문자열이면 (A)도 올바른 괄호 문자열이다.
- A와 B가 올바른 괄호 문자열이면 AB도 올바른 괄호 문자열이다.

## 입력

첫째 줄에 괄호 문자열이 주어진다. 문자열은 '('와 ')'만 포함한다. (1 ≤ 문자열 길이 ≤ 100)

## 출력

올바른 괄호 문자열이면 "YES", 아니면 "NO"를 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "(())", expectedOutput: "YES", isVisible: true },
      { input: "()()", expectedOutput: "YES", isVisible: true },
      { input: "(()", expectedOutput: "NO", isVisible: false },
      { input: ")", expectedOutput: "NO", isVisible: false },
      { input: "((()))", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["문자열", "구현"],
  },

  {
    title: "스택으로 문자열 뒤집기",
    description: `스택(Stack) 자료구조를 활용하여 문자열을 뒤집어 출력한다.

스택을 사용하는 방법: 문자열의 각 문자를 스택에 push한 후, 스택이 빌 때까지 pop하여 문자를 꺼내면 뒤집힌 문자열을 얻을 수 있다.

## 입력

첫째 줄에 문자열이 주어진다. 문자열은 공백 없이 알파벳 대소문자와 숫자로만 이루어져 있다. (1 ≤ 문자열 길이 ≤ 100)

## 출력

스택을 이용하여 뒤집어진 문자열을 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "hello", expectedOutput: "olleh", isVisible: true },
      { input: "abcde", expectedOutput: "edcba", isVisible: true },
      { input: "a", expectedOutput: "a", isVisible: false },
      { input: "racecar", expectedOutput: "racecar", isVisible: false },
      { input: "abc123", expectedOutput: "321cba", isVisible: false },
    ],
    tags: ["문자열", "구현"],
  },

  {
    title: "후위 표기식 계산",
    description: `후위 표기식(Postfix Notation)을 계산하여 결과를 출력한다.

피연산자는 한 자리 양의 정수이며, 연산자는 +, -, *, / 중 하나이다. 나눗셈은 정수 나눗셈(0 방향 내림)을 사용한다.

각 토큰(숫자 또는 연산자)은 공백으로 구분된다. 0으로 나누는 경우는 없다.

스택을 이용한 후위 표기식 계산 알고리즘:
1. 토큰을 순서대로 읽는다.
2. 피연산자이면 스택에 push한다.
3. 연산자이면 스택에서 두 값을 pop하여 연산 후 결과를 push한다.

## 입력

첫째 줄에 후위 표기식이 공백 구분된 토큰으로 주어진다. (3 ≤ 토큰 수 ≤ 50)

## 출력

후위 표기식의 계산 결과를 출력한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4 +", expectedOutput: "7", isVisible: true },
      { input: "5 1 2 + 4 * + 3 -", expectedOutput: "14", isVisible: true },
      { input: "2 3 * 4 +", expectedOutput: "10", isVisible: false },
      { input: "7 2 3 * -", expectedOutput: "1", isVisible: false },
      { input: "9 3 / 2 +", expectedOutput: "5", isVisible: false },
    ],
    tags: ["구현", "수학"],
  },

  {
    title: "로마 숫자 → 정수",
    description: `로마 숫자 문자열을 정수로 변환하여 출력한다.

로마 숫자의 기호와 값:
- I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000

뺄셈 표기법:
- IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900

## 입력

첫째 줄에 로마 숫자 문자열이 주어진다. (변환 결과 1 ≤ 정수 ≤ 3,999)

## 출력

로마 숫자를 10진수 정수로 변환한 값을 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "III", expectedOutput: "3", isVisible: true },
      { input: "MCMXCIX", expectedOutput: "1999", isVisible: true },
      { input: "IV", expectedOutput: "4", isVisible: false },
      { input: "CDXLIV", expectedOutput: "444", isVisible: false },
      { input: "MMMCMXCIX", expectedOutput: "3999", isVisible: false },
    ],
    tags: ["문자열", "구현"],
  },

  {
    title: "정수 → 로마 숫자",
    description: `정수를 로마 숫자로 변환하여 출력한다.

로마 숫자의 기호와 값:
- I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000

뺄셈 표기법:
- IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900

## 입력

첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 3,999)

## 출력

N을 로마 숫자로 변환한 문자열을 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3", expectedOutput: "III", isVisible: true },
      { input: "1999", expectedOutput: "MCMXCIX", isVisible: true },
      { input: "4", expectedOutput: "IV", isVisible: false },
      { input: "444", expectedOutput: "CDXLIV", isVisible: false },
      { input: "3999", expectedOutput: "MMMCMXCIX", isVisible: false },
    ],
    tags: ["문자열", "구현"],
  },

  {
    title: "팰린드롬 수",
    description: `정수 N이 팰린드롬 수인지 판별한다.

팰린드롬 수란 앞에서 읽으나 뒤에서 읽으나 동일한 수를 말한다. (예: 121, 12321)
음수는 항상 팰린드롬 수가 아니다.

## 입력

첫째 줄에 정수 N이 주어진다. (-1,000,000,000 ≤ N ≤ 1,000,000,000)

## 출력

N이 팰린드롬 수이면 "YES", 아니면 "NO"를 출력한다.`,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "121", expectedOutput: "YES", isVisible: true },
      { input: "-121", expectedOutput: "NO", isVisible: true },
      { input: "12321", expectedOutput: "YES", isVisible: false },
      { input: "12345", expectedOutput: "NO", isVisible: false },
      { input: "0", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["수학"],
  },

  {
    title: "콜라츠 수열 출력",
    description: `콜라츠 추측에 따라 N부터 시작하여 1이 될 때까지의 수열 전체를 공백으로 구분하여 출력한다.

콜라츠 규칙:
- N이 짝수이면 N / 2로 변환한다.
- N이 홀수이면 3 × N + 1로 변환한다.
- N이 1이 되면 수열을 종료한다.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 1,000,000)

## 출력

콜라츠 수열(N부터 1까지)을 공백으로 구분하여 한 줄에 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6", expectedOutput: "6 3 10 5 16 8 4 2 1", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: true },
      { input: "3", expectedOutput: "3 10 5 16 8 4 2 1", isVisible: false },
      { input: "7", expectedOutput: "7 22 11 34 17 52 26 13 40 20 10 5 16 8 4 2 1", isVisible: false },
      { input: "4", expectedOutput: "4 2 1", isVisible: false },
    ],
    tags: ["수학", "구현"],
  },

  {
    title: "가장 가까운 수",
    description: `N개의 정수 중에서 X에 가장 가까운 수를 출력한다. 거리가 같은 경우(즉 X보다 같은 차이만큼 작은 수와 큰 수가 있는 경우) 더 작은 수를 출력한다.

## 입력

첫째 줄에 정수의 개수 N과 목표 수 X가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 1,000, -1,000,000 ≤ X ≤ 1,000,000)
둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000 ≤ 각 정수 ≤ 1,000,000)

## 출력

X에 가장 가까운 수를 출력한다. 거리가 같으면 더 작은 수를 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 6\n1 5 3 7 9", expectedOutput: "5", isVisible: true },
      { input: "2 0\n-10 10", expectedOutput: "-10", isVisible: true },
      { input: "3 25\n10 20 30", expectedOutput: "20", isVisible: false },
      { input: "5 4\n1 5 3 7 9", expectedOutput: "3", isVisible: false },
      { input: "1 50\n100", expectedOutput: "100", isVisible: false },
    ],
    tags: ["배열", "정렬"],
  },
];
