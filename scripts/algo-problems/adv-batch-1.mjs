export const problems = [
  // ===== DP 기초 (1-15) =====

  // 1. 계단 오르기
  {
    title: "계단 오르기",
    description: `N개의 계단이 있다. 한 번에 1칸 또는 2칸을 오를 수 있을 때, N번째 계단에 오르는 방법의 수를 구하여라.

## 입력

첫째 줄에 계단의 수 N이 주어진다.

- 1 ≤ N ≤ 45

## 출력

N번째 계단에 오르는 방법의 수를 출력한다.

## 예제 입력 1

\`\`\`
5
\`\`\`

## 예제 출력 1

\`\`\`
8
\`\`\``,
    difficulty: 3.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5", expectedOutput: "8", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "2", expectedOutput: "2", isVisible: false },
      { input: "10", expectedOutput: "89", isVisible: false },
      { input: "45", expectedOutput: "1836311903", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 2. 타일 채우기 (2×N)
  {
    title: "타일 채우기 (2×N)",
    description: `2×N 크기의 직사각형을 1×2 또는 2×1 크기의 타일로 채우는 방법의 수를 구하여라.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 1,000

## 출력

2×N 직사각형을 채우는 방법의 수를 1,000,000,007(10⁹+7)로 나눈 나머지를 출력한다.

## 예제 입력 1

\`\`\`
4
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4", expectedOutput: "5", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "2", expectedOutput: "2", isVisible: false },
      { input: "3", expectedOutput: "3", isVisible: false },
      { input: "10", expectedOutput: "89", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 3. 타일 채우기 2 (2×N)
  {
    title: "타일 채우기 2 (2×N)",
    description: `2×N 크기의 직사각형을 1×2, 2×1, 2×2 크기의 타일로 채우는 방법의 수를 구하여라.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 1,000

## 출력

2×N 직사각형을 채우는 방법의 수를 1,000,000,007(10⁹+7)로 나눈 나머지를 출력한다.

## 예제 입력 1

\`\`\`
3
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3", expectedOutput: "5", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "2", expectedOutput: "3", isVisible: false },
      { input: "4", expectedOutput: "11", isVisible: false },
      { input: "10", expectedOutput: "683", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 4. 1, 2, 3 더하기
  {
    title: "1, 2, 3 더하기",
    description: `정수 N을 1, 2, 3의 합으로 나타내는 방법의 수를 구하여라. 덧셈의 순서가 다르면 다른 방법이다.

## 입력

첫째 줄에 정수 N이 주어진다.

- 1 ≤ N ≤ 20

## 출력

N을 1, 2, 3의 합으로 나타내는 방법의 수를 출력한다.

## 예제 입력 1

\`\`\`
4
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4", expectedOutput: "7", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "2", expectedOutput: "2", isVisible: false },
      { input: "3", expectedOutput: "4", isVisible: false },
      { input: "10", expectedOutput: "274", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 5. 1로 만들기
  {
    title: "1로 만들기",
    description: `정수 N에 대해 다음 세 가지 연산을 사용하여 1을 만드는 최소 연산 횟수를 구하여라.

1. N이 3으로 나누어지면 3으로 나눈다.
2. N이 2로 나누어지면 2로 나눈다.
3. 1을 뺀다.

## 입력

첫째 줄에 정수 N이 주어진다.

- 1 ≤ N ≤ 1,000,000

## 출력

1을 만드는 데 필요한 최소 연산 횟수를 출력한다.

## 예제 입력 1

\`\`\`
10
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10", expectedOutput: "3", isVisible: true },
      { input: "1", expectedOutput: "0", isVisible: false },
      { input: "6", expectedOutput: "2", isVisible: false },
      { input: "12", expectedOutput: "3", isVisible: false },
      { input: "1000000", expectedOutput: "39", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 6. 이친수
  {
    title: "이친수",
    description: `0과 1로만 이루어진 수를 이진수라고 한다. 이 중 맨 앞 자리가 1이고, 1이 두 번 연속으로 나타나지 않는 이진수를 이친수라고 한다. N자리 이친수의 개수를 구하여라.

예를 들어 4자리 이친수는 1000, 1001, 1010으로 3개이다.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 90

## 출력

N자리 이친수의 개수를 출력한다.

## 예제 입력 1

\`\`\`
4
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4", expectedOutput: "3", isVisible: true },
      { input: "2", expectedOutput: "1", isVisible: false },
      { input: "3", expectedOutput: "2", isVisible: false },
      { input: "5", expectedOutput: "5", isVisible: false },
      { input: "10", expectedOutput: "55", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 7. 01타일
  {
    title: "01타일",
    description: `길이가 N인 0과 1로 이루어진 문자열 중, 두 자리 연속으로 00이 나타나지 않는 문자열의 개수를 구하여라.

예를 들어 N=2이면 01, 10, 11의 3가지이다. (00은 제외)

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 1,000,000

## 출력

길이가 N인 00이 없는 이진 문자열의 개수를 15746으로 나눈 나머지를 출력한다.

## 예제 입력 1

\`\`\`
5
\`\`\`

## 예제 출력 1

\`\`\`
13
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5", expectedOutput: "13", isVisible: true },
      { input: "1", expectedOutput: "2", isVisible: false },
      { input: "2", expectedOutput: "3", isVisible: false },
      { input: "4", expectedOutput: "8", isVisible: false },
      { input: "100", expectedOutput: "6726", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 8. 파도반 수열
  {
    title: "파도반 수열",
    description: `파도반 수열 P(N)은 다음과 같이 정의된다.

- P(1) = 1, P(2) = 1, P(3) = 1
- P(N) = P(N-2) + P(N-3) (N ≥ 4)

N이 주어졌을 때 P(N)을 구하여라.

## 입력

첫째 줄에 T(테스트 케이스 수)가 주어진다. 이후 T개의 줄에 각각 N이 주어진다.

- 1 ≤ T ≤ 100
- 1 ≤ N ≤ 100

## 출력

각 테스트 케이스마다 P(N)을 출력한다.

## 예제 입력 1

\`\`\`
3
1
5
10
\`\`\`

## 예제 출력 1

\`\`\`
1
2
9
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1\n5\n10", expectedOutput: "1\n2\n9", isVisible: true },
      { input: "1\n100", expectedOutput: "888855064897", isVisible: false },
      { input: "2\n8\n15", expectedOutput: "5\n37", isVisible: false },
      { input: "3\n3\n4\n20", expectedOutput: "1\n2\n151", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 9. 피보나치 함수
  {
    title: "피보나치 함수",
    description: `다음과 같이 재귀적으로 정의된 피보나치 함수가 있다.

\`\`\`
fib(0) = 0
fib(1) = 1
fib(n) = fib(n-1) + fib(n-2)  (n ≥ 2)
\`\`\`

fib(n)을 재귀적으로 호출할 때 fib(0)과 fib(1)이 각각 몇 번 호출되는지 구하여라. DP를 활용하면 메모이제이션 없이도 효율적으로 구할 수 있다.

## 입력

첫째 줄에 테스트 케이스 수 T가 주어진다. 이후 T개의 줄에 각각 N이 주어진다.

- 1 ≤ T ≤ 40
- 0 ≤ N ≤ 40

## 출력

각 테스트 케이스마다 fib(0)이 호출되는 횟수와 fib(1)이 호출되는 횟수를 공백으로 구분하여 출력한다.

## 예제 입력 1

\`\`\`
3
0
1
5
\`\`\`

## 예제 출력 1

\`\`\`
1 0
0 1
3 5
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n0\n1\n5", expectedOutput: "1 0\n0 1\n3 5", isVisible: true },
      { input: "2\n2\n3", expectedOutput: "1 1\n1 2", isVisible: false },
      { input: "2\n10\n20", expectedOutput: "34 55\n4181 6765", isVisible: false },
      { input: "1\n40", expectedOutput: "63245986 102334155", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 10. 이항 계수 (DP)
  {
    title: "이항 계수 (DP)",
    description: `이항 계수 C(n, r)을 파스칼의 삼각형을 이용한 DP로 구하여라.

파스칼의 삼각형: C(n, r) = C(n-1, r-1) + C(n-1, r)

## 입력

첫째 줄에 n과 r이 주어진다.

- 1 ≤ r ≤ n ≤ 30

## 출력

C(n, r)의 값을 출력한다.

## 예제 입력 1

\`\`\`
10 3
\`\`\`

## 예제 출력 1

\`\`\`
120
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10 3", expectedOutput: "120", isVisible: true },
      { input: "5 2", expectedOutput: "10", isVisible: false },
      { input: "15 7", expectedOutput: "6435", isVisible: false },
      { input: "30 15", expectedOutput: "155117520", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 11. 동전 교환 (최소 개수)
  {
    title: "동전 교환 (최소 개수)",
    description: `K종류의 동전이 있다. 각 동전은 무한히 사용할 수 있다. 합이 N이 되도록 동전을 선택할 때, 사용하는 동전의 최소 개수를 구하여라. 합 N을 만들 수 없으면 -1을 출력한다.

## 입력

첫째 줄에 동전의 종류 수 K와 목표 금액 N이 주어진다.
둘째 줄에 K개의 동전 액면가가 주어진다.

- 1 ≤ K ≤ 10
- 1 ≤ N ≤ 10,000
- 1 ≤ 각 동전 액면가 ≤ N

## 출력

합 N을 만드는 최소 동전 수를 출력한다. 불가능하면 -1을 출력한다.

## 예제 입력 1

\`\`\`
3 15
1 5 10
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 15\n1 5 10", expectedOutput: "2", isVisible: true },
      { input: "4 30\n1 5 10 25", expectedOutput: "2", isVisible: false },
      { input: "2 3\n2 5", expectedOutput: "-1", isVisible: false },
      { input: "2 11\n2 5", expectedOutput: "4", isVisible: false },
      { input: "3 36\n1 5 10", expectedOutput: "5", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 12. 동전 교환 (경우의 수)
  {
    title: "동전 교환 (경우의 수)",
    description: `K종류의 동전이 있다. 각 동전은 무한히 사용할 수 있다. 합이 N이 되도록 동전을 선택하는 경우의 수를 구하여라. 동전의 순서는 구분하지 않는다 (집합으로 취급).

## 입력

첫째 줄에 동전의 종류 수 K와 목표 금액 N이 주어진다.
둘째 줄에 K개의 동전 액면가가 주어진다.

- 1 ≤ K ≤ 100
- 1 ≤ N ≤ 10,000
- 1 ≤ 각 동전 액면가 ≤ N

## 출력

경우의 수를 1,000,000,007(10⁹+7)로 나눈 나머지를 출력한다.

## 예제 입력 1

\`\`\`
3 4
1 2 3
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4\n1 2 3", expectedOutput: "4", isVisible: true },
      { input: "4 10\n1 5 10 25", expectedOutput: "4", isVisible: false },
      { input: "3 10\n2 3 5", expectedOutput: "4", isVisible: false },
      { input: "2 100\n3 5", expectedOutput: "4", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 13. 누적 합 구간 쿼리
  {
    title: "누적 합 구간 쿼리",
    description: `N개의 정수가 주어진다. Q개의 쿼리가 주어지며, 각 쿼리는 구간 [L, R]의 합을 묻는다. 누적 합(prefix sum)을 이용하여 각 쿼리를 O(1)로 답하여라.

## 입력

첫째 줄에 N과 Q가 주어진다.
둘째 줄에 N개의 정수가 주어진다.
이후 Q개의 줄에 각각 L, R이 주어진다. (1-indexed)

- 1 ≤ N, Q ≤ 100,000
- -10,000 ≤ 각 정수 ≤ 10,000
- 1 ≤ L ≤ R ≤ N

## 출력

각 쿼리마다 구간 합을 출력한다.

## 예제 입력 1

\`\`\`
10 3
3 1 4 1 5 9 2 6 5 3
1 5
3 8
1 10
\`\`\`

## 예제 출력 1

\`\`\`
14
27
39
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10 3\n3 1 4 1 5 9 2 6 5 3\n1 5\n3 8\n1 10", expectedOutput: "14\n27\n39", isVisible: true },
      { input: "5 2\n1 2 3 4 5\n2 4\n1 5", expectedOutput: "9\n15", isVisible: false },
      { input: "4 3\n-1 3 -2 5\n1 4\n2 3\n1 2", expectedOutput: "5\n1\n2", isVisible: false },
      { input: "3 1\n10 20 30\n1 3", expectedOutput: "60", isVisible: false },
    ],
    tags: ["DP", "구현"],
  },

  // 14. 연속합
  {
    title: "연속합",
    description: `N개의 정수로 이루어진 수열이 있다. 이 수열에서 연속된 하나 이상의 수를 선택했을 때의 합 중 최댓값을 구하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 N개의 정수가 주어진다.

- 1 ≤ N ≤ 100,000
- -1,000 ≤ 각 정수 ≤ 1,000

## 출력

연속 부분 배열의 합의 최댓값을 출력한다.

## 예제 입력 1

\`\`\`
9
-2 1 -3 4 -1 2 1 -5 4
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isVisible: true },
      { input: "5\n1 2 3 -1 5", expectedOutput: "10", isVisible: false },
      { input: "3\n-1 -2 -3", expectedOutput: "-1", isVisible: false },
      { input: "3\n5 -3 5", expectedOutput: "7", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 15. 최대 부분 증가 수열 (LIS)
  {
    title: "최대 부분 증가 수열",
    description: `N개의 정수로 이루어진 수열이 주어졌을 때, 가장 긴 증가하는 부분 수열(LIS)의 길이를 구하여라. O(N²) DP를 사용하여라.

예를 들어 수열 [10, 9, 2, 5, 3, 7, 101, 18]에서 LIS는 [2, 5, 7, 101]로 길이 4이다.

## 입력

첫째 줄에 수열의 크기 N이 주어진다.
둘째 줄에 N개의 정수가 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ 각 정수 ≤ 1,000

## 출력

가장 긴 증가하는 부분 수열의 길이를 출력한다.

## 예제 입력 1

\`\`\`
8
10 9 2 5 3 7 101 18
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "8\n10 9 2 5 3 7 101 18", expectedOutput: "4", isVisible: true },
      { input: "5\n1 2 3 4 5", expectedOutput: "5", isVisible: false },
      { input: "6\n5 6 7 1 2 8", expectedOutput: "4", isVisible: false },
      { input: "4\n4 3 2 1", expectedOutput: "1", isVisible: false },
    ],
    tags: ["DP"],
  },

  // ===== DP 중급 (16-35) =====

  // 16. 정수 삼각형
  {
    title: "정수 삼각형",
    description: `삼각형 모양으로 정수가 배열되어 있다. 맨 꼭대기에서 출발하여 매 단계마다 아래 행의 인접한 두 수 중 하나를 선택하여 내려갈 때, 지나는 수들의 합의 최댓값을 구하여라.

## 입력

첫째 줄에 삼각형의 크기 N이 주어진다.
둘째 줄부터 N+1번째 줄까지 삼각형의 각 행이 주어진다. i번째 행에는 i개의 수가 주어진다.

- 1 ≤ N ≤ 500
- 0 ≤ 각 수 ≤ 9,999

## 출력

꼭대기에서 바닥까지 이동하며 얻을 수 있는 최대 합을 출력한다.

## 예제 입력 1

\`\`\`
4
1
2 3
4 5 6
7 8 9 10
\`\`\`

## 예제 출력 1

\`\`\`
20
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n1\n2 3\n4 5 6\n7 8 9 10", expectedOutput: "20", isVisible: true },
      { input: "5\n7\n3 8\n8 1 0\n2 7 4 4\n4 5 2 6 5", expectedOutput: "30", isVisible: false },
      { input: "1\n42", expectedOutput: "42", isVisible: false },
      { input: "3\n3\n1 2\n5 4 3", expectedOutput: "10", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 17. RGB거리
  {
    title: "RGB거리",
    description: `N개의 집이 일렬로 있다. 각 집은 빨강(R), 초록(G), 파랑(B) 중 하나로 색칠해야 한다. 인접한 두 집은 같은 색이 되어서는 안 된다. 집 i를 색 j로 칠하는 비용이 주어질 때 모든 집을 칠하는 최소 비용을 구하여라.

## 입력

첫째 줄에 집의 수 N이 주어진다.
둘째 줄부터 N+1번째 줄까지 집 i를 R, G, B로 칠하는 비용이 주어진다.

- 2 ≤ N ≤ 1,000
- 1 ≤ 각 비용 ≤ 1,000

## 출력

모든 집을 칠하는 최소 비용을 출력한다.

## 예제 입력 1

\`\`\`
3
26 40 83
49 60 57
13 89 99
\`\`\`

## 예제 출력 1

\`\`\`
96
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n26 40 83\n49 60 57\n13 89 99", expectedOutput: "96", isVisible: true },
      { input: "3\n1 100 100\n100 1 100\n100 100 1", expectedOutput: "3", isVisible: false },
      { input: "2\n10 20 30\n5 15 25", expectedOutput: "25", isVisible: false },
      { input: "4\n10 20 30\n20 10 30\n30 10 20\n10 30 20", expectedOutput: "40", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 18. 포도주 시식
  {
    title: "포도주 시식",
    description: `N잔의 포도주가 일렬로 놓여 있다. 포도주 시식 규칙은 연속으로 3잔 이상 마실 수 없다는 것이다. 포도주의 양이 주어졌을 때 마실 수 있는 최대 양을 구하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄부터 N번째 줄까지 각 포도주 잔의 양이 주어진다.

- 1 ≤ N ≤ 10,000
- 1 ≤ 각 포도주 양 ≤ 1,000

## 출력

마실 수 있는 포도주의 최대 양을 출력한다.

## 예제 입력 1

\`\`\`
6
6
10
13
9
8
1
\`\`\`

## 예제 출력 1

\`\`\`
33
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n6\n10\n13\n9\n8\n1", expectedOutput: "33", isVisible: true },
      { input: "3\n1\n2\n3", expectedOutput: "5", isVisible: false },
      { input: "4\n4\n3\n2\n1", expectedOutput: "8", isVisible: false },
      { input: "1\n100", expectedOutput: "100", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 19. 스티커
  {
    title: "스티커",
    description: `2×N 크기의 스티커 판이 있다. 스티커는 2×N 개이며, 인접한 변을 공유한 스티커는 함께 뗄 수 없다. 뜯어낸 스티커의 점수 합을 최대로 하려면 얼마를 얻을 수 있는지 구하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 윗 행 N개의 스티커 점수, 셋째 줄에 아랫 행 N개의 스티커 점수가 주어진다.

- 1 ≤ N ≤ 100,000
- 1 ≤ 각 점수 ≤ 100

## 출력

뜯어낼 수 있는 스티커의 최대 점수 합을 출력한다.

## 예제 입력 1

\`\`\`
3
50 10 100
60 20 80
\`\`\`

## 예제 출력 1

\`\`\`
290
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n50 10 100\n60 20 80", expectedOutput: "290", isVisible: true },
      { input: "3\n1 3 2\n4 1 5", expectedOutput: "12", isVisible: false },
      { input: "4\n1 2 3 4\n5 6 7 8", expectedOutput: "20", isVisible: false },
      { input: "1\n10\n20", expectedOutput: "30", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 20. 가장 긴 감소 부분 수열
  {
    title: "가장 긴 감소 부분 수열",
    description: `N개의 정수로 이루어진 수열이 주어졌을 때, 가장 긴 감소하는 부분 수열(LDS)의 길이를 구하여라.

예를 들어 수열 [5, 4, 3, 2, 1]에서 LDS는 [5, 4, 3, 2, 1]로 길이 5이다.

## 입력

첫째 줄에 수열의 크기 N이 주어진다.
둘째 줄에 N개의 정수가 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ 각 정수 ≤ 1,000

## 출력

가장 긴 감소하는 부분 수열의 길이를 출력한다.

## 예제 입력 1

\`\`\`
5
5 4 3 2 1
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n5 4 3 2 1", expectedOutput: "5", isVisible: true },
      { input: "6\n10 30 10 20 20 10", expectedOutput: "3", isVisible: false },
      { input: "5\n30 10 20 5 25", expectedOutput: "3", isVisible: false },
      { input: "5\n3 2 1 4 5", expectedOutput: "3", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 21. 가장 긴 바이토닉 부분 수열
  {
    title: "가장 긴 바이토닉 부분 수열",
    description: `수열 A가 주어졌을 때, 가장 긴 바이토닉 부분 수열의 길이를 구하여라.

바이토닉 수열이란 어떤 위치 k를 기준으로 A[1] < A[2] < ... < A[k] > A[k+1] > ... > A[n]을 만족하는 수열이다. 즉 증가했다가 감소하는 형태이다.

## 입력

첫째 줄에 수열의 크기 N이 주어진다.
둘째 줄에 N개의 정수가 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ 각 정수 ≤ 1,000

## 출력

가장 긴 바이토닉 부분 수열의 길이를 출력한다.

## 예제 입력 1

\`\`\`
10
1 5 2 1 4 3 4 5 2 1
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10\n1 5 2 1 4 3 4 5 2 1", expectedOutput: "7", isVisible: true },
      { input: "7\n1 2 3 4 3 2 1", expectedOutput: "7", isVisible: false },
      { input: "5\n1 2 3 2 1", expectedOutput: "5", isVisible: false },
      { input: "3\n3 2 1", expectedOutput: "3", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 22. 최장 공통 부분 수열 (LCS)
  {
    title: "최장 공통 부분 수열 (LCS)",
    description: `두 문자열 A, B가 주어졌을 때, 가장 긴 공통 부분 수열(LCS)의 길이를 구하여라.

부분 수열이란 원래 문자열에서 문자를 0개 이상 삭제하여 만들 수 있는 문자열이다.

## 입력

첫째 줄에 문자열 A, 둘째 줄에 문자열 B가 주어진다.

- 1 ≤ |A|, |B| ≤ 1,000
- 알파벳 대문자로만 이루어짐

## 출력

두 문자열의 LCS 길이를 출력한다.

## 예제 입력 1

\`\`\`
ACBAED
ABCADF
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "ACBAED\nABCADF", expectedOutput: "4", isVisible: true },
      { input: "AGGTAB\nGXTXAYB", expectedOutput: "4", isVisible: false },
      { input: "ABCDEF\nACE", expectedOutput: "3", isVisible: false },
      { input: "ABC\nABC", expectedOutput: "3", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 23. 편집 거리
  {
    title: "편집 거리",
    description: `두 문자열 A, B가 주어졌을 때, A를 B로 변환하기 위한 최소 편집 횟수를 구하여라.

사용할 수 있는 연산은 다음 세 가지이다.
- 삽입: 임의의 위치에 문자 1개를 삽입한다.
- 삭제: 임의의 위치의 문자 1개를 삭제한다.
- 교체: 임의의 위치의 문자 1개를 다른 문자로 교체한다.

## 입력

첫째 줄에 문자열 A, 둘째 줄에 문자열 B가 주어진다.

- 1 ≤ |A|, |B| ≤ 1,000
- 알파벳 소문자로만 이루어짐

## 출력

A를 B로 변환하는 데 필요한 최소 편집 횟수를 출력한다.

## 예제 입력 1

\`\`\`
kitten
sitting
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "kitten\nsitting", expectedOutput: "3", isVisible: true },
      { input: "sunday\nsaturday", expectedOutput: "3", isVisible: false },
      { input: "abc\nabc", expectedOutput: "0", isVisible: false },
      { input: "abc\nyabd", expectedOutput: "2", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 24. 0-1 배낭 문제
  {
    title: "0-1 배낭 문제",
    description: `N개의 물건과 무게 제한이 W인 배낭이 있다. 각 물건은 무게와 가치를 가지며, 각 물건은 최대 1번만 선택할 수 있다. 배낭에 넣을 수 있는 물건들의 최대 가치를 구하여라.

## 입력

첫째 줄에 물건의 수 N과 배낭의 무게 제한 W가 주어진다.
이후 N개의 줄에 각 물건의 무게와 가치가 주어진다.

- 1 ≤ N ≤ 100
- 1 ≤ W ≤ 10,000
- 1 ≤ 무게, 가치 ≤ 1,000

## 출력

배낭에 넣을 수 있는 물건들의 최대 가치를 출력한다.

## 예제 입력 1

\`\`\`
3 5
2 3
3 4
4 5
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 5\n2 3\n3 4\n4 5", expectedOutput: "7", isVisible: true },
      { input: "4 7\n1 1\n3 4\n4 5\n5 7", expectedOutput: "9", isVisible: false },
      { input: "1 100\n50 200", expectedOutput: "200", isVisible: false },
      { input: "3 3\n4 5\n3 4\n2 3", expectedOutput: "3", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 25. 카드 구매하기
  {
    title: "카드 구매하기",
    description: `카드를 최대 N장 구매하려고 한다. 카드팩은 1장부터 N장까지 있으며, i장짜리 카드팩의 가격이 P_i원이다. N장을 정확히 구매할 때 최대 비용을 구하여라. 같은 카드팩을 여러 번 구매할 수 있다.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 P_1, P_2, ..., P_N이 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ P_i ≤ 10,000

## 출력

N장의 카드를 구매할 때 지불할 수 있는 최대 금액을 출력한다.

## 예제 입력 1

\`\`\`
4
1 5 6 7
\`\`\`

## 예제 출력 1

\`\`\`
10
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n1 5 6 7", expectedOutput: "10", isVisible: true },
      { input: "5\n3 9 25 32 50", expectedOutput: "50", isVisible: false },
      { input: "3\n5 10 11", expectedOutput: "15", isVisible: false },
      { input: "1\n100", expectedOutput: "100", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 26. 점프 게임
  {
    title: "점프 게임",
    description: `N개의 칸으로 이루어진 배열이 있다. 각 칸에는 해당 위치에서 최대로 점프할 수 있는 거리가 적혀 있다. 첫 번째 칸에서 출발하여 마지막 칸에 도달할 수 있는지 여부를 구하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 N개의 정수가 주어진다.

- 1 ≤ N ≤ 10,000
- 0 ≤ 각 정수 ≤ 10,000

## 출력

마지막 칸에 도달 가능하면 "YES", 불가능하면 "NO"를 출력한다.

## 예제 입력 1

\`\`\`
5
2 3 1 1 4
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n2 3 1 1 4", expectedOutput: "YES", isVisible: true },
      { input: "5\n3 2 1 0 4", expectedOutput: "NO", isVisible: false },
      { input: "4\n1 0 0 0", expectedOutput: "NO", isVisible: false },
      { input: "4\n4 1 1 1", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 27. 최소 경로 합 (그리드)
  {
    title: "최소 경로 합 (그리드)",
    description: `N×M 격자가 있다. 각 칸에는 비용이 주어진다. (1,1)에서 (N,M)까지 오른쪽 또는 아래쪽으로만 이동할 때 경로 비용의 최솟값을 구하여라.

## 입력

첫째 줄에 N과 M이 주어진다.
이후 N개의 줄에 각 행의 M개 비용이 주어진다.

- 1 ≤ N, M ≤ 500
- 0 ≤ 각 비용 ≤ 100

## 출력

(1,1)에서 (N,M)까지의 최소 경로 비용을 출력한다.

## 예제 입력 1

\`\`\`
3 3
1 3 1
1 5 1
4 2 1
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 3\n1 3 1\n1 5 1\n4 2 1", expectedOutput: "7", isVisible: true },
      { input: "2 3\n1 2 3\n4 5 6", expectedOutput: "12", isVisible: false },
      { input: "1 1\n5", expectedOutput: "5", isVisible: false },
      { input: "3 2\n1 2\n3 4\n5 6", expectedOutput: "13", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 28. 금광 문제
  {
    title: "금광 문제",
    description: `N×M 격자에 금이 있다. 왼쪽 열의 임의의 위치에서 출발하여 오른쪽으로 이동한다. 매 단계에서 오른쪽, 오른쪽 위 대각선, 오른쪽 아래 대각선 중 하나로 이동한다. 격자를 벗어날 수 없다. 얻을 수 있는 최대 금의 양을 구하여라.

## 입력

첫째 줄에 N과 M이 주어진다.
이후 N개의 줄에 각 행의 M개의 금 양이 주어진다.

- 1 ≤ N, M ≤ 20
- 1 ≤ 각 칸의 금 ≤ 100

## 출력

얻을 수 있는 금의 최댓값을 출력한다.

## 예제 입력 1

\`\`\`
4 4
1 3 1 5
2 2 4 1
5 0 2 3
0 6 1 2
\`\`\`

## 예제 출력 1

\`\`\`
16
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 4\n1 3 1 5\n2 2 4 1\n5 0 2 3\n0 6 1 2", expectedOutput: "16", isVisible: true },
      { input: "3 3\n1 9 1\n2 3 8\n8 2 1", expectedOutput: "19", isVisible: false },
      { input: "2 2\n1 2\n3 4", expectedOutput: "7", isVisible: false },
      { input: "1 3\n5 3 8", expectedOutput: "16", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 29. 개미 전사 (연속 불가)
  {
    title: "개미 전사",
    description: `N개의 식량 창고가 일렬로 놓여 있다. 인접한 두 창고를 동시에 털면 경보가 울리므로, 인접하지 않은 창고들만 털 수 있다. 얻을 수 있는 식량의 최대 합을 구하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 N개의 식량 창고의 식량 양이 주어진다.

- 3 ≤ N ≤ 100
- 0 ≤ 각 식량 ≤ 1,000

## 출력

얻을 수 있는 식량의 최대 합을 출력한다.

## 예제 입력 1

\`\`\`
4
1 3 1 5
\`\`\`

## 예제 출력 1

\`\`\`
8
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n1 3 1 5", expectedOutput: "8", isVisible: true },
      { input: "3\n3 1 3", expectedOutput: "6", isVisible: false },
      { input: "5\n3 1 3 1 3", expectedOutput: "9", isVisible: false },
      { input: "3\n2 3 2", expectedOutput: "4", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 30. 퇴사
  {
    title: "퇴사",
    description: `상담사가 N일 후 퇴사한다. 오늘부터 퇴사 전날까지 N일 동안 상담을 할 수 있다. 각 상담은 기간 T_i일이 걸리고 보수 P_i원을 받는다. 상담이 퇴사일을 넘어가면 할 수 없다. 받을 수 있는 최대 보수를 구하여라.

## 입력

첫째 줄에 N이 주어진다.
이후 N개의 줄에 각 날의 상담 기간 T_i와 보수 P_i가 주어진다.

- 1 ≤ N ≤ 15
- 1 ≤ T_i ≤ 5, 1 ≤ P_i ≤ 1,000

## 출력

받을 수 있는 최대 보수를 출력한다.

## 예제 입력 1

\`\`\`
7
3 10
5 20
1 10
1 20
2 15
4 40
2 200
\`\`\`

## 예제 출력 1

\`\`\`
45
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7\n3 10\n5 20\n1 10\n1 20\n2 15\n4 40\n2 200", expectedOutput: "45", isVisible: true },
      { input: "3\n1 5\n1 3\n1 4", expectedOutput: "12", isVisible: false },
      { input: "4\n2 100\n1 50\n2 100\n1 50", expectedOutput: "200", isVisible: false },
      { input: "1\n1 1000", expectedOutput: "1000", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 31. 못생긴 수
  {
    title: "못생긴 수",
    description: `못생긴 수란 소인수가 2, 3, 5만으로 이루어진 양의 정수이다 (1 포함). N번째 못생긴 수를 구하여라.

못생긴 수: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, ...

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 1,000

## 출력

N번째 못생긴 수를 출력한다.

## 예제 입력 1

\`\`\`
10
\`\`\`

## 예제 출력 1

\`\`\`
12
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10", expectedOutput: "12", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "15", expectedOutput: "24", isVisible: false },
      { input: "150", expectedOutput: "5832", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 32. 합분해
  {
    title: "합분해",
    description: `0부터 N까지의 정수 K개를 선택하여 (중복 가능) 그 합이 N이 되는 경우의 수를 구하여라.

예를 들어 N=3, K=2이면 (0,3), (1,2), (2,1), (3,0)으로 4가지이다.

## 입력

첫째 줄에 N과 K가 주어진다.

- 1 ≤ N, K ≤ 200

## 출력

경우의 수를 1,000,000,007(10⁹+7)로 나눈 나머지를 출력한다.

## 예제 입력 1

\`\`\`
5 3
\`\`\`

## 예제 출력 1

\`\`\`
21
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3", expectedOutput: "21", isVisible: true },
      { input: "3 2", expectedOutput: "4", isVisible: false },
      { input: "4 3", expectedOutput: "15", isVisible: false },
      { input: "10 5", expectedOutput: "1001", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 33. 내려가기
  {
    title: "내려가기",
    description: `N×3 크기의 격자가 있다. 가장 위 행에서 아래로 내려가면서 매 행마다 인접한 열(같은 열 또는 이웃한 열)로만 이동할 수 있다. 최대 점수와 최소 점수를 구하여라.

## 입력

첫째 줄에 N이 주어진다.
이후 N개의 줄에 각 행의 3개 수가 주어진다.

- 1 ≤ N ≤ 100,000
- 1 ≤ 각 수 ≤ 9

## 출력

최대 점수와 최소 점수를 공백으로 구분하여 출력한다.

## 예제 입력 1

\`\`\`
3
1 2 3
4 5 6
7 8 9
\`\`\`

## 예제 출력 1

\`\`\`
18 12
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "18 12", isVisible: true },
      { input: "4\n3 7 8\n8 1 2\n5 4 6\n1 4 2", expectedOutput: "24 9", isVisible: false },
      { input: "1\n5 3 8", expectedOutput: "8 3", isVisible: false },
      { input: "4\n1 2 3\n4 5 6\n7 8 9\n1 2 3", expectedOutput: "21 13", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 34. 가장 큰 정사각형
  {
    title: "가장 큰 정사각형",
    description: `N×M 크기의 0과 1로 이루어진 행렬이 있다. 1로만 채워진 가장 큰 정사각형의 변의 길이를 구하여라.

## 입력

첫째 줄에 N과 M이 주어진다.
이후 N개의 줄에 각 행이 주어진다 (공백 없이).

- 1 ≤ N, M ≤ 1,000

## 출력

1로만 이루어진 가장 큰 정사각형의 변의 길이를 출력한다. 없으면 0을 출력한다.

## 예제 입력 1

\`\`\`
4 5
10100
10111
11111
10010
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 5\n10100\n10111\n11111\n10010", expectedOutput: "2", isVisible: true },
      { input: "3 3\n111\n111\n111", expectedOutput: "3", isVisible: false },
      { input: "2 2\n01\n10", expectedOutput: "1", isVisible: false },
      { input: "2 2\n00\n00", expectedOutput: "0", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 35. 돌 게임
  {
    title: "돌 게임",
    description: `N개의 돌이 있다. 두 명이 번갈아 가며 돌을 가져가는데, 한 번에 1개, 2개, 또는 3개를 가져갈 수 있다. 마지막 돌을 가져가는 사람이 이긴다. 선공(먼저 시작하는 사람)이 최선을 다해 플레이할 때 이기면 "YES", 지면 "NO"를 출력하여라.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 1,000

## 출력

선공이 이기면 "YES", 지면 "NO"를 출력한다.

## 예제 입력 1

\`\`\`
7
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7", expectedOutput: "YES", isVisible: true },
      { input: "4", expectedOutput: "NO", isVisible: false },
      { input: "8", expectedOutput: "NO", isVisible: false },
      { input: "9", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["DP", "게임 이론"],
  },

  // ===== DP 고급 (36-50) =====

  // 36. 계단 수
  {
    title: "계단 수",
    description: `인접한 자릿수의 차이가 1인 수를 계단 수라고 한다. 예를 들어 45656은 계단 수이다.
길이가 N인 계단 수의 개수를 구하여라. 0으로 시작하는 수는 계단 수가 아니다.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 100

## 출력

길이가 N인 계단 수의 개수를 1,000,000,007(10⁹+7)로 나눈 나머지를 출력한다.

## 예제 입력 1

\`\`\`
2
\`\`\`

## 예제 출력 1

\`\`\`
17
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2", expectedOutput: "17", isVisible: true },
      { input: "1", expectedOutput: "9", isVisible: false },
      { input: "3", expectedOutput: "32", isVisible: false },
      { input: "10", expectedOutput: "2986", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 37. 오르막 수
  {
    title: "오르막 수",
    description: `수의 자릿수가 오름차순(비내림차순)인 수를 오르막 수라 한다. 예를 들어 2345, 1113, 0239는 오르막 수이다 (앞 자리가 뒷 자리보다 작거나 같음).
길이가 N인 오르막 수의 개수를 구하여라. 0으로 시작하는 수도 포함한다.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 1,000

## 출력

길이가 N인 오르막 수의 개수를 10007로 나눈 나머지를 출력한다.

## 예제 입력 1

\`\`\`
2
\`\`\`

## 예제 출력 1

\`\`\`
55
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2", expectedOutput: "55", isVisible: true },
      { input: "1", expectedOutput: "10", isVisible: false },
      { input: "3", expectedOutput: "220", isVisible: false },
      { input: "100", expectedOutput: "8404", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 38. 행렬 곱셈 순서
  {
    title: "행렬 곱셈 순서",
    description: `N개의 행렬을 순서대로 곱할 때, 연산 횟수를 최소화하는 곱셈 순서를 구하여라.
행렬 A(p×q)와 B(q×r)의 곱의 연산 횟수는 p×q×r이다. 행렬의 순서는 변경할 수 없다.

## 입력

첫째 줄에 행렬의 수 N이 주어진다.
이후 N개의 줄에 각 행렬의 행 크기와 열 크기가 주어진다.

- 1 ≤ N ≤ 500
- 1 ≤ 행, 열 ≤ 500

## 출력

최소 연산 횟수를 출력한다.

## 예제 입력 1

\`\`\`
4
40 20
20 30
30 10
10 30
\`\`\`

## 예제 출력 1

\`\`\`
26000
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n40 20\n20 30\n30 10\n10 30", expectedOutput: "26000", isVisible: true },
      { input: "3\n10 30\n30 5\n5 60", expectedOutput: "4500", isVisible: false },
      { input: "5\n3 2\n2 5\n5 4\n4 6\n6 7", expectedOutput: "214", isVisible: false },
      { input: "1\n5 10", expectedOutput: "0", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 39. 팰린드롬 만들기
  {
    title: "팰린드롬 만들기",
    description: `문자열이 주어졌을 때, 문자를 삽입하여 팰린드롬으로 만드는 최소 삽입 횟수를 구하여라. 문자는 어느 위치에나 삽입할 수 있다.

예를 들어 "ab"는 "aba" 또는 "bab"로 만들 수 있으므로 1번 삽입이 필요하다.

## 입력

첫째 줄에 문자열 S가 주어진다.

- 1 ≤ |S| ≤ 1,000
- 알파벳 소문자로만 이루어짐

## 출력

팰린드롬으로 만들기 위한 최소 삽입 횟수를 출력한다.

## 예제 입력 1

\`\`\`
mbadm
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "mbadm", expectedOutput: "2", isVisible: true },
      { input: "ab", expectedOutput: "1", isVisible: false },
      { input: "race", expectedOutput: "3", isVisible: false },
      { input: "abcba", expectedOutput: "0", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 40. 팰린드롬 분할
  {
    title: "팰린드롬 분할",
    description: `문자열 S를 여러 부분 문자열로 분할할 때, 각 부분 문자열이 모두 팰린드롬이 되도록 분할하는 최소 분할 횟수를 구하여라. 분할 횟수는 (부분 문자열 수 - 1)이다.

예를 들어 "aab"는 "aa"와 "b"로 분할하면 1번이다.

## 입력

첫째 줄에 문자열 S가 주어진다.

- 1 ≤ |S| ≤ 2,500
- 알파벳 소문자로만 이루어짐

## 출력

최소 분할 횟수를 출력한다.

## 예제 입력 1

\`\`\`
ababbbabbababa
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "ababbbabbababa", expectedOutput: "3", isVisible: true },
      { input: "aab", expectedOutput: "1", isVisible: false },
      { input: "aabbc", expectedOutput: "2", isVisible: false },
      { input: "abcba", expectedOutput: "0", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 41. 부분 수열의 합
  {
    title: "부분 수열의 합",
    description: `1부터 N까지의 정수 중 일부를 선택하여 만든 부분집합의 합이 S가 되는 경우의 수를 구하여라.

## 입력

첫째 줄에 N과 S가 주어진다.

- 1 ≤ N ≤ 20
- 1 ≤ S ≤ N*(N+1)/2

## 출력

1부터 N까지의 정수 중 합이 S가 되는 부분집합의 개수를 출력한다.

## 예제 입력 1

\`\`\`
6 7
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 7", expectedOutput: "4", isVisible: true },
      { input: "4 4", expectedOutput: "2", isVisible: false },
      { input: "5 7", expectedOutput: "3", isVisible: false },
      { input: "5 10", expectedOutput: "3", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 42. 동전 뒤집기
  {
    title: "동전 뒤집기",
    description: `N×M 크기의 보드에 동전이 있다. 각 동전의 앞면은 H(Head), 뒷면은 T(Tail)이다. 한 번의 작업으로 한 행 전체 또는 한 열 전체를 뒤집을 수 있다. 뒤집기를 여러 번 수행한 후, 보드에 남은 T의 최소 개수를 구하여라.

## 입력

첫째 줄에 N과 M이 주어진다.
이후 N개의 줄에 각 행의 동전 상태가 주어진다 (H 또는 T).

- 1 ≤ N, M ≤ 20

## 출력

T의 최소 개수를 출력한다.

## 예제 입력 1

\`\`\`
3 3
THH
HTH
HHT
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 3\nTHH\nHTH\nHHT", expectedOutput: "2", isVisible: true },
      { input: "3 3\nTHT\nHTH\nTHT", expectedOutput: "0", isVisible: false },
      { input: "3 3\nTTT\nTTT\nTTT", expectedOutput: "0", isVisible: false },
      { input: "2 3\nTHH\nHTT", expectedOutput: "1", isVisible: false },
    ],
    tags: ["DP", "비트마스크"],
  },

  // 43. 외판원 문제 (소규모)
  {
    title: "외판원 문제 (소규모)",
    description: `N개의 도시가 있다. 도시 i에서 도시 j로 이동하는 비용이 주어진다. 도시 1에서 출발하여 모든 도시를 정확히 한 번씩 방문하고 도시 1로 돌아오는 최소 비용을 구하여라. 이동이 불가능한 경우는 없다고 가정한다.

## 입력

첫째 줄에 도시의 수 N이 주어진다.
이후 N개의 줄에 N개의 정수가 주어진다. i행 j열의 값이 i→j 이동 비용이다 (대각선 = 0).

- 2 ≤ N ≤ 16
- 0 ≤ 이동 비용 ≤ 1,000,000 (0이면 해당 경로 없음, 단 항상 해를 구할 수 있는 입력이 주어짐)

## 출력

모든 도시를 순회하는 최소 비용을 출력한다.

## 예제 입력 1

\`\`\`
4
0 10 15 20
10 0 35 25
15 35 0 30
20 25 30 0
\`\`\`

## 예제 출력 1

\`\`\`
80
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0", expectedOutput: "80", isVisible: true },
      { input: "4\n0 2 9 10\n1 0 6 4\n15 7 0 8\n6 3 12 0", expectedOutput: "21", isVisible: false },
      { input: "3\n0 1 2\n2 0 3\n1 4 0", expectedOutput: "5", isVisible: false },
      { input: "2\n0 5\n3 0", expectedOutput: "8", isVisible: false },
    ],
    tags: ["DP", "비트마스크", "그래프"],
  },

  // 44. LCS 길이와 역추적
  {
    title: "LCS 길이와 역추적",
    description: `두 문자열 A, B가 주어졌을 때, 가장 긴 공통 부분 수열(LCS)을 실제로 출력하여라. LCS가 여러 개일 경우 아무것이나 출력한다.

## 입력

첫째 줄에 문자열 A, 둘째 줄에 문자열 B가 주어진다.

- 1 ≤ |A|, |B| ≤ 1,000
- 알파벳 대문자로만 이루어짐

## 출력

LCS를 출력한다. LCS가 없으면 빈 줄을 출력한다.

## 예제 입력 1

\`\`\`
ABCBDAB
BDCAB
\`\`\`

## 예제 출력 1

\`\`\`
BDAB
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "ABCBDAB\nBDCAB", expectedOutput: "BDAB", isVisible: true },
      { input: "AGGTAB\nGXTXAYB", expectedOutput: "GTAB", isVisible: false },
      { input: "ABC\nABC", expectedOutput: "ABC", isVisible: false },
      { input: "AXB\nAYB", expectedOutput: "AB", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 45. 팰린드롬인 부분 수열 최장 길이 (LPS)
  {
    title: "팰린드롬인 부분 수열 최장 길이",
    description: `문자열 S가 주어졌을 때, S의 부분 수열(subsequence) 중 팰린드롬인 것의 최대 길이를 구하여라.

부분 수열이란 문자열에서 일부 문자를 삭제하여 얻는 문자열이다.

## 입력

첫째 줄에 문자열 S가 주어진다.

- 1 ≤ |S| ≤ 1,000
- 알파벳 소문자로만 이루어짐

## 출력

가장 긴 팰린드롬 부분 수열의 길이를 출력한다.

## 예제 입력 1

\`\`\`
bbbab
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "bbbab", expectedOutput: "4", isVisible: true },
      { input: "cbbd", expectedOutput: "2", isVisible: false },
      { input: "aacecaaa", expectedOutput: "7", isVisible: false },
      { input: "abcde", expectedOutput: "1", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 46. 동전 조합 (순서 구분)
  {
    title: "동전 조합 (순서 구분)",
    description: `N종류의 동전이 있다. 합이 M이 되도록 동전을 선택하는 경우의 수를 구하여라. 동전의 순서가 다르면 다른 경우로 취급한다. 각 동전은 무한히 사용할 수 있다.

## 입력

첫째 줄에 동전의 종류 수 N과 목표 금액 M이 주어진다.
둘째 줄에 N개의 동전 액면가가 주어진다.

- 1 ≤ N ≤ 10
- 1 ≤ M ≤ 10,000
- 1 ≤ 각 동전 액면가 ≤ M

## 출력

경우의 수를 1,000,000,007(10⁹+7)로 나눈 나머지를 출력한다.

## 예제 입력 1

\`\`\`
3 4
1 2 3
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4\n1 2 3", expectedOutput: "7", isVisible: true },
      { input: "2 3\n1 2", expectedOutput: "3", isVisible: false },
      { input: "3 5\n1 3 5", expectedOutput: "5", isVisible: false },
      { input: "2 5\n2 3", expectedOutput: "1", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 47. 부분 합 나누기
  {
    title: "부분 합 나누기",
    description: `N개의 정수를 두 개의 집합으로 나누어 각 집합의 합의 차이를 최소화하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 N개의 정수가 주어진다.

- 1 ≤ N ≤ 20
- 1 ≤ 각 정수 ≤ 100,000

## 출력

두 집합의 합의 차이의 최솟값을 출력한다.

## 예제 입력 1

\`\`\`
4
1 6 11 5
\`\`\`

## 예제 출력 1

\`\`\`
1
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n1 6 11 5", expectedOutput: "1", isVisible: true },
      { input: "4\n1 2 3 4", expectedOutput: "0", isVisible: false },
      { input: "3\n1 2 7", expectedOutput: "4", isVisible: false },
      { input: "5\n5 8 13 27 14", expectedOutput: "3", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 48. 문자열 인터리빙
  {
    title: "문자열 인터리빙",
    description: `두 문자열 A, B를 인터리빙하여 문자열 C를 만들 수 있는지 판단하여라.

인터리빙이란 A의 문자와 B의 문자를 원래 순서를 유지하면서 섞어 C를 만드는 것이다.
|A| + |B| = |C|이어야 한다.

## 입력

첫째 줄에 문자열 A, 둘째 줄에 문자열 B, 셋째 줄에 문자열 C가 주어진다.

- 1 ≤ |A|, |B| ≤ 200
- |A| + |B| = |C|
- 알파벳 소문자로만 이루어짐

## 출력

인터리빙이 가능하면 "YES", 불가능하면 "NO"를 출력한다.

## 예제 입력 1

\`\`\`
aab
axy
aaxaby
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "aab\naxy\naaxaby", expectedOutput: "YES", isVisible: true },
      { input: "aab\naxy\nabaaxy", expectedOutput: "NO", isVisible: false },
      { input: "abc\ndef\nadbecf", expectedOutput: "YES", isVisible: false },
      { input: "abc\ndef\nabcdef", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 49. 최장 팰린드롬 부분 문자열
  {
    title: "최장 팰린드롬 부분 문자열",
    description: `문자열 S가 주어졌을 때, S의 부분 문자열(substring) 중 가장 긴 팰린드롬의 길이를 구하여라.

부분 문자열은 원래 문자열에서 연속된 문자들의 집합이다.

## 입력

첫째 줄에 문자열 S가 주어진다.

- 1 ≤ |S| ≤ 1,000
- 알파벳 소문자로만 이루어짐

## 출력

가장 긴 팰린드롬 부분 문자열의 길이를 출력한다.

## 예제 입력 1

\`\`\`
babad
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "babad", expectedOutput: "3", isVisible: true },
      { input: "cbbd", expectedOutput: "2", isVisible: false },
      { input: "racecar", expectedOutput: "7", isVisible: false },
      { input: "abacaba", expectedOutput: "7", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 50. 단어 분리
  {
    title: "단어 분리",
    description: `W개의 단어로 이루어진 사전이 있다. 문자열 S를 사전에 있는 단어들만으로 분리할 수 있는지 판단하여라. 각 단어는 여러 번 사용할 수 있다.

## 입력

첫째 줄에 사전 단어의 수 W가 주어진다.
이후 W개의 줄에 각 단어가 주어진다.
마지막 줄에 문자열 S가 주어진다.

- 1 ≤ W ≤ 100
- 1 ≤ 각 단어 길이 ≤ 50
- 1 ≤ |S| ≤ 300
- 알파벳 소문자로만 이루어짐

## 출력

분리 가능하면 "YES", 불가능하면 "NO"를 출력한다.

## 예제 입력 1

\`\`\`
2
leet
code
leetcode
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\nleet\ncode\nleetcode", expectedOutput: "YES", isVisible: true },
      { input: "3\none\ntwo\nthree\nonetwothree", expectedOutput: "YES", isVisible: false },
      { input: "5\ncats\ndog\nsand\nand\ncat\ncatsandog", expectedOutput: "NO", isVisible: false },
      { input: "2\ngo\ndie\ngogodie", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["DP"],
  },
];
