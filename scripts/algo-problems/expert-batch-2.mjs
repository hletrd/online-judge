export const problems = [
  // ===== 고급 수학/정수론 (1-10) =====

  // 1. 확장 유클리드 알고리즘
  {
    title: "확장 유클리드 알고리즘",
    description: `양의 정수 A, B가 주어질 때, ax + by = gcd(a, b)를 만족하는 정수 x, y를 하나 구하여라.

## 입력

첫째 줄에 양의 정수 A, B가 공백으로 구분되어 주어진다.

- 1 ≤ A, B ≤ 10^9

## 출력

첫째 줄에 gcd(A, B)를 출력한다.
둘째 줄에 정수 x, y를 공백으로 구분하여 출력한다.
여러 해가 존재하면 그 중 하나를 출력한다.

## 예제 입력 1

\`\`\`
35 15
\`\`\`

## 예제 출력 1

\`\`\`
5
1 -2
\`\`\`

## 예제 입력 2

\`\`\`
7 13
\`\`\`

## 예제 출력 2

\`\`\`
1
2 -1
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "35 15", expectedOutput: "5\n1 -2", isVisible: true },
      { input: "7 13", expectedOutput: "1\n2 -1", isVisible: true },
      { input: "100 75", expectedOutput: "25\n1 -1", isVisible: false },
      { input: "1000000000 999999999", expectedOutput: "1\n1 -1", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // 2. 모듈러 역원
  {
    title: "모듈러 역원",
    description: `서로소인 양의 정수 A, M이 주어질 때, A의 mod M 역원을 구하여라. 즉, A * x ≡ 1 (mod M)을 만족하는 x를 구하여라. 단, 0 ≤ x < M이어야 한다.

## 입력

첫째 줄에 양의 정수 A, M이 공백으로 구분되어 주어진다.

- 1 ≤ A < M ≤ 10^9
- gcd(A, M) = 1

## 출력

A의 mod M 역원을 출력한다.

## 예제 입력 1

\`\`\`
3 7
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\`

## 예제 입력 2

\`\`\`
5 11
\`\`\`

## 예제 출력 2

\`\`\`
9
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 7", expectedOutput: "5", isVisible: true },
      { input: "5 11", expectedOutput: "9", isVisible: true },
      { input: "10 17", expectedOutput: "12", isVisible: false },
      { input: "999999999 1000000007", expectedOutput: "500000004", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // 3. 중국인 나머지 정리
  {
    title: "중국인 나머지 정리",
    description: `K개의 연립 합동식이 주어진다.

x ≡ r_1 (mod m_1)
x ≡ r_2 (mod m_2)
...
x ≡ r_K (mod m_K)

모든 m_i가 서로소일 때, 0 ≤ x < m_1 * m_2 * ... * m_K 를 만족하는 x를 구하여라.

## 입력

첫째 줄에 K가 주어진다.
다음 K개 줄에 r_i, m_i가 공백으로 구분되어 주어진다.

- 1 ≤ K ≤ 10
- 0 ≤ r_i < m_i
- 1 ≤ m_i ≤ 10^5
- 모든 m_i는 서로소

## 출력

조건을 만족하는 x를 출력한다.

## 예제 입력 1

\`\`\`
3
2 3
3 5
2 7
\`\`\`

## 예제 출력 1

\`\`\`
23
\`\`\`

## 예제 입력 2

\`\`\`
2
1 4
2 7
\`\`\`

## 예제 출력 2

\`\`\`
9
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n2 3\n3 5\n2 7", expectedOutput: "23", isVisible: true },
      { input: "2\n1 4\n2 7", expectedOutput: "9", isVisible: true },
      { input: "1\n0 7", expectedOutput: "0", isVisible: false },
      { input: "4\n0 2\n0 3\n1 5\n1 7", expectedOutput: "6", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // 4. 오일러 피 함수
  {
    title: "오일러 피 함수",
    description: `양의 정수 N이 주어질 때, 오일러 피 함수 φ(N)을 구하여라.

φ(N)은 1 이상 N 이하의 정수 중 N과 서로소인 것의 개수이다.

소인수분해를 활용하여 풀어라.

## 입력

첫째 줄에 양의 정수 N이 주어진다.

- 1 ≤ N ≤ 10^12

## 출력

φ(N)을 출력한다.

## 예제 입력 1

\`\`\`
6
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\`

## 예제 입력 2

\`\`\`
100
\`\`\`

## 예제 출력 2

\`\`\`
40
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6", expectedOutput: "2", isVisible: true },
      { input: "100", expectedOutput: "40", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "1000000000000", expectedOutput: "400000000000", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // 5. 이산 로그
  {
    title: "이산 로그",
    description: `소수 p와 정수 a, b가 주어질 때, a^x ≡ b (mod p)를 만족하는 최소 양의 정수 x를 구하여라. 해가 존재하지 않으면 -1을 출력한다.

Baby-step Giant-step 알고리즘을 사용하여 풀어라.

## 입력

첫째 줄에 소수 p, 정수 a, b가 공백으로 구분되어 주어진다.

- 2 ≤ p ≤ 10^9 (p는 소수)
- 1 ≤ a, b < p

## 출력

조건을 만족하는 최소 양의 정수 x를 출력한다. 해가 없으면 -1을 출력한다.

## 예제 입력 1

\`\`\`
5 2 3
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
7 3 4
\`\`\`

## 예제 출력 2

\`\`\`
4
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 2 3", expectedOutput: "3", isVisible: true },
      { input: "7 3 4", expectedOutput: "4", isVisible: true },
      { input: "11 2 1", expectedOutput: "10", isVisible: false },
      { input: "1000000007 2 500000004", expectedOutput: "999999999", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // 6. 뤼카의 정리
  {
    title: "뤼카의 정리",
    description: `정수 n, r과 소수 p가 주어질 때, C(n, r) mod p를 구하여라.

뤼카의 정리(Lucas' theorem)를 이용하여 풀어라.

## 입력

첫째 줄에 n, r, p가 공백으로 구분되어 주어진다.

- 0 ≤ r ≤ n ≤ 10^18
- 2 ≤ p ≤ 10,000 (p는 소수)

## 출력

C(n, r) mod p를 출력한다.

## 예제 입력 1

\`\`\`
10 4 3
\`\`\`

## 예제 출력 1

\`\`\`
0
\`\`\`

## 예제 입력 2

\`\`\`
1000 500 7
\`\`\`

## 예제 출력 2

\`\`\`
4
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10 4 3", expectedOutput: "0", isVisible: true },
      { input: "1000 500 7", expectedOutput: "4", isVisible: true },
      { input: "100 50 3", expectedOutput: "0", isVisible: false },
      { input: "1000000000000000000 500000000000000000 5", expectedOutput: "0", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // 7. 정수 제곱근
  {
    title: "정수 제곱근",
    description: `음이 아닌 정수 N이 주어질 때, floor(sqrt(N))을 구하여라.

부동소수점 연산을 사용하지 말고 이분 탐색으로 구하여라.

## 입력

첫째 줄에 음이 아닌 정수 N이 주어진다.

- 0 ≤ N ≤ 10^18

## 출력

floor(sqrt(N))을 출력한다.

## 예제 입력 1

\`\`\`
15
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
1000000000000000000
\`\`\`

## 예제 출력 2

\`\`\`
1000000000
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "15", expectedOutput: "3", isVisible: true },
      { input: "1000000000000000000", expectedOutput: "1000000000", isVisible: true },
      { input: "0", expectedOutput: "0", isVisible: false },
      { input: "999999999999999999", expectedOutput: "999999999", isVisible: false },
    ],
    tags: ["수학", "이분 탐색"],
  },

  // 8. 소수 개수 세기
  {
    title: "소수 개수 세기",
    description: `N 이하의 소수 개수 π(N)을 구하여라.

에라토스테네스의 체를 최적화하여 풀어라.

## 입력

첫째 줄에 양의 정수 N이 주어진다.

- 1 ≤ N ≤ 10^8

## 출력

N 이하의 소수 개수를 출력한다.

## 예제 입력 1

\`\`\`
10
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\`

## 예제 입력 2

\`\`\`
1000
\`\`\`

## 예제 출력 2

\`\`\`
168
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 5000,
    memoryLimitMb: 512,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10", expectedOutput: "4", isVisible: true },
      { input: "1000", expectedOutput: "168", isVisible: true },
      { input: "100", expectedOutput: "25", isVisible: false },
      { input: "100000000", expectedOutput: "5761455", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // 9. 밀러-라빈 소수 판별
  {
    title: "밀러-라빈 소수 판별",
    description: `T개의 쿼리가 주어진다. 각 쿼리마다 양의 정수 N이 소수인지 판별하여라.

밀러-라빈 소수 판별법을 사용하여 풀어라.

## 입력

첫째 줄에 T가 주어진다.
다음 T개 줄에 양의 정수 N이 주어진다.

- 1 ≤ T ≤ 100
- 1 ≤ N ≤ 10^18

## 출력

각 쿼리에 대해 N이 소수이면 "YES", 아니면 "NO"를 출력한다.

## 예제 입력 1

\`\`\`
5
2
4
17
97
1000000007
\`\`\`

## 예제 출력 1

\`\`\`
YES
NO
YES
YES
YES
\`\`\`

## 예제 입력 2

\`\`\`
3
1000000000000000000
1000000000000000009
999999999999999877
\`\`\`

## 예제 출력 2

\`\`\`
NO
YES
YES
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n2\n4\n17\n97\n1000000007", expectedOutput: "YES\nNO\nYES\nYES\nYES", isVisible: true },
      { input: "3\n1000000000000000000\n1000000000000000009\n999999999999999877", expectedOutput: "NO\nYES\nYES", isVisible: true },
      { input: "4\n1\n2\n3\n9", expectedOutput: "NO\nYES\nYES\nNO", isVisible: false },
      { input: "2\n998244353\n998244354", expectedOutput: "YES\nNO", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // 10. 폴라드 로 인수분해
  {
    title: "폴라드 로 인수분해",
    description: `양의 정수 N이 주어질 때, N의 가장 큰 소인수를 구하여라.

폴라드 로(Pollard's rho) 알고리즘을 사용하여 풀어라.

## 입력

첫째 줄에 양의 정수 N이 주어진다.

- 2 ≤ N ≤ 10^18

## 출력

N의 가장 큰 소인수를 출력한다.

## 예제 입력 1

\`\`\`
12
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
1000000007
\`\`\`

## 예제 출력 2

\`\`\`
1000000007
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "12", expectedOutput: "3", isVisible: true },
      { input: "1000000007", expectedOutput: "1000000007", isVisible: true },
      { input: "100", expectedOutput: "5", isVisible: false },
      { input: "999999999999999877", expectedOutput: "999999999999999877", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // ===== 기하 (11-20) =====

  // 11. CCW (반시계 방향 판별)
  {
    title: "CCW (반시계 방향 판별)",
    description: `평면 위의 세 점 P1, P2, P3이 주어질 때, 세 점의 방향을 판별하여라.

반시계 방향(CCW)이면 1, 시계 방향(CW)이면 -1, 세 점이 일직선이면 0을 출력한다.

## 입력

세 줄에 걸쳐 각 점의 x, y 좌표가 공백으로 구분되어 주어진다.

- -10^9 ≤ x, y ≤ 10^9
- 모든 좌표는 정수

## 출력

판별 결과를 출력한다.

## 예제 입력 1

\`\`\`
0 0
1 0
0 1
\`\`\`

## 예제 출력 1

\`\`\`
1
\`\`\`

## 예제 입력 2

\`\`\`
0 0
1 0
2 0
\`\`\`

## 예제 출력 2

\`\`\`
0
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "0 0\n1 0\n0 1", expectedOutput: "1", isVisible: true },
      { input: "0 0\n1 0\n2 0", expectedOutput: "0", isVisible: true },
      { input: "0 0\n0 1\n1 0", expectedOutput: "-1", isVisible: false },
      { input: "1000000000 1000000000\n-1000000000 -1000000000\n1000000000 -1000000000", expectedOutput: "1", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 12. 선분 교차 판별
  {
    title: "선분 교차 판별",
    description: `두 선분이 교차하는지 판별하여라. 끝점에서 만나는 경우도 교차로 본다.

CCW를 활용하여 풀어라.

## 입력

첫째 줄에 선분 1의 양 끝점 좌표 x1 y1 x2 y2가 공백으로 구분되어 주어진다.
둘째 줄에 선분 2의 양 끝점 좌표 x3 y3 x4 y4가 공백으로 구분되어 주어진다.

- -10^6 ≤ 모든 좌표 ≤ 10^6
- 모든 좌표는 정수

## 출력

두 선분이 교차하면 "YES", 아니면 "NO"를 출력한다.

## 예제 입력 1

\`\`\`
1 1 5 5
1 5 5 1
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\`

## 예제 입력 2

\`\`\`
0 0 1 0
2 0 3 0
\`\`\`

## 예제 출력 2

\`\`\`
NO
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1 1 5 5\n1 5 5 1", expectedOutput: "YES", isVisible: true },
      { input: "0 0 1 0\n2 0 3 0", expectedOutput: "NO", isVisible: true },
      { input: "0 0 2 0\n1 0 3 0", expectedOutput: "YES", isVisible: false },
      { input: "0 0 1 1\n1 0 2 2", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 13. 볼록 껍질
  {
    title: "볼록 껍질",
    description: `N개의 점이 주어질 때, 볼록 껍질(convex hull)을 이루는 꼭짓점의 수를 구하여라.

같은 직선 위에 있는 점은 꼭짓점으로 세지 않는다.

## 입력

첫째 줄에 N이 주어진다.
다음 N개 줄에 각 점의 x, y 좌표가 공백으로 구분되어 주어진다.

- 3 ≤ N ≤ 100,000
- -10^9 ≤ x, y ≤ 10^9
- 모든 좌표는 정수
- 모든 점이 같은 직선 위에 있지 않음이 보장됨

## 출력

볼록 껍질을 이루는 꼭짓점의 수를 출력한다.

## 예제 입력 1

\`\`\`
7
0 0
1 1
2 2
0 2
2 0
1 0
0 1
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\`

## 예제 입력 2

\`\`\`
5
0 0
4 0
4 4
0 4
2 2
\`\`\`

## 예제 출력 2

\`\`\`
4
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7\n0 0\n1 1\n2 2\n0 2\n2 0\n1 0\n0 1", expectedOutput: "4", isVisible: true },
      { input: "5\n0 0\n4 0\n4 4\n0 4\n2 2", expectedOutput: "4", isVisible: true },
      { input: "3\n0 0\n1 0\n0 1", expectedOutput: "3", isVisible: false },
      { input: "6\n0 0\n3 0\n6 0\n6 3\n3 3\n0 3", expectedOutput: "4", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 14. 볼록 껍질 넓이
  {
    title: "볼록 껍질 넓이",
    description: `N개의 점이 주어질 때, 이 점들의 볼록 껍질(convex hull)의 넓이의 2배를 정수로 출력하여라.

## 입력

첫째 줄에 N이 주어진다.
다음 N개 줄에 각 점의 x, y 좌표가 공백으로 구분되어 주어진다.

- 3 ≤ N ≤ 100,000
- -10^9 ≤ x, y ≤ 10^9
- 모든 좌표는 정수
- 모든 점이 같은 직선 위에 있지 않음이 보장됨

## 출력

볼록 껍질 넓이의 2배를 정수로 출력한다.

## 예제 입력 1

\`\`\`
4
0 0
4 0
4 4
0 4
\`\`\`

## 예제 출력 1

\`\`\`
32
\`\`\`

## 예제 입력 2

\`\`\`
3
0 0
3 0
0 4
\`\`\`

## 예제 출력 2

\`\`\`
12
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n0 0\n4 0\n4 4\n0 4", expectedOutput: "32", isVisible: true },
      { input: "3\n0 0\n3 0\n0 4", expectedOutput: "12", isVisible: true },
      { input: "5\n0 0\n4 0\n4 4\n0 4\n2 2", expectedOutput: "32", isVisible: false },
      { input: "4\n0 0\n10 0\n10 5\n0 5", expectedOutput: "100", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 15. 가장 먼 두 점
  {
    title: "가장 먼 두 점",
    description: `N개의 점이 주어질 때, 가장 먼 두 점 사이의 거리의 제곱을 구하여라.

볼록 껍질과 회전하는 캘리퍼스(rotating calipers)를 사용하여 풀어라.

## 입력

첫째 줄에 N이 주어진다.
다음 N개 줄에 각 점의 x, y 좌표가 공백으로 구분되어 주어진다.

- 2 ≤ N ≤ 100,000
- -10^9 ≤ x, y ≤ 10^9
- 모든 좌표는 정수

## 출력

가장 먼 두 점 사이의 거리의 제곱을 출력한다.

## 예제 입력 1

\`\`\`
4
0 0
3 0
0 4
3 4
\`\`\`

## 예제 출력 1

\`\`\`
25
\`\`\`

## 예제 입력 2

\`\`\`
3
0 0
1 0
0 1
\`\`\`

## 예제 출력 2

\`\`\`
2
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n0 0\n3 0\n0 4\n3 4", expectedOutput: "25", isVisible: true },
      { input: "3\n0 0\n1 0\n0 1", expectedOutput: "2", isVisible: true },
      { input: "2\n0 0\n1000000000 1000000000", expectedOutput: "2000000000000000000", isVisible: false },
      { input: "5\n0 0\n4 0\n4 3\n0 3\n2 1", expectedOutput: "25", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 16. 점과 볼록 다각형 포함 관계
  {
    title: "점과 볼록 다각형 포함 관계",
    description: `볼록 다각형과 점 하나가 주어질 때, 점이 다각형의 내부, 경계, 외부 중 어디에 있는지 판별하여라.

다각형의 꼭짓점은 반시계 방향으로 주어진다.

## 입력

첫째 줄에 다각형의 꼭짓점 수 N이 주어진다.
다음 N개 줄에 각 꼭짓점의 x, y 좌표가 반시계 방향으로 주어진다.
마지막 줄에 점의 x, y 좌표가 주어진다.

- 3 ≤ N ≤ 100,000
- -10^9 ≤ 모든 좌표 ≤ 10^9
- 모든 좌표는 정수

## 출력

점이 내부에 있으면 "INSIDE", 경계에 있으면 "BOUNDARY", 외부에 있으면 "OUTSIDE"를 출력한다.

## 예제 입력 1

\`\`\`
4
0 0
4 0
4 4
0 4
2 2
\`\`\`

## 예제 출력 1

\`\`\`
INSIDE
\`\`\`

## 예제 입력 2

\`\`\`
4
0 0
4 0
4 4
0 4
0 0
\`\`\`

## 예제 출력 2

\`\`\`
BOUNDARY
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n0 0\n4 0\n4 4\n0 4\n2 2", expectedOutput: "INSIDE", isVisible: true },
      { input: "4\n0 0\n4 0\n4 4\n0 4\n0 0", expectedOutput: "BOUNDARY", isVisible: true },
      { input: "4\n0 0\n4 0\n4 4\n0 4\n5 2", expectedOutput: "OUTSIDE", isVisible: false },
      { input: "4\n0 0\n4 0\n4 4\n0 4\n4 2", expectedOutput: "BOUNDARY", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 17. 두 원의 교점
  {
    title: "두 원의 교점",
    description: `두 원이 주어질 때, 교점의 개수를 구하여라. 두 원이 일치하는 경우에는 -1을 출력한다.

## 입력

첫째 줄에 원 1의 중심 좌표 x1, y1과 반지름 r1이 공백으로 구분되어 주어진다.
둘째 줄에 원 2의 중심 좌표 x2, y2와 반지름 r2가 공백으로 구분되어 주어진다.

- -10^4 ≤ x1, y1, x2, y2 ≤ 10^4
- 1 ≤ r1, r2 ≤ 10^4
- 모든 값은 정수

## 출력

교점의 개수(0, 1, 2)를 출력한다. 두 원이 일치하면 -1을 출력한다.

## 예제 입력 1

\`\`\`
0 0 2
1 0 2
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\`

## 예제 입력 2

\`\`\`
0 0 1
3 0 1
\`\`\`

## 예제 출력 2

\`\`\`
0
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "0 0 2\n1 0 2", expectedOutput: "2", isVisible: true },
      { input: "0 0 1\n3 0 1", expectedOutput: "0", isVisible: true },
      { input: "0 0 1\n2 0 1", expectedOutput: "1", isVisible: false },
      { input: "0 0 1\n0 0 1", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 18. 최소 외접원
  {
    title: "최소 외접원",
    description: `N개의 점을 모두 포함하는 최소 원의 반지름을 구하여라.

## 입력

첫째 줄에 N이 주어진다.
다음 N개 줄에 각 점의 x, y 좌표가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100,000
- -10^6 ≤ x, y ≤ 10^6
- 모든 좌표는 정수

## 출력

최소 외접원의 반지름을 소수점 아래 6자리까지 출력한다.

## 예제 입력 1

\`\`\`
3
0 0
2 0
1 2
\`\`\`

## 예제 출력 1

\`\`\`
1.264911
\`\`\`

## 예제 입력 2

\`\`\`
2
0 0
6 0
\`\`\`

## 예제 출력 2

\`\`\`
3.000000
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.000001,
    testCases: [
      { input: "3\n0 0\n2 0\n1 2", expectedOutput: "1.264911", isVisible: true },
      { input: "2\n0 0\n6 0", expectedOutput: "3.000000", isVisible: true },
      { input: "1\n5 5", expectedOutput: "0.000000", isVisible: false },
      { input: "4\n0 0\n4 0\n4 3\n0 3", expectedOutput: "2.500000", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 19. 다각형 넓이 (신발끈 공식)
  {
    title: "다각형 넓이",
    description: `N각형의 넓이의 2배를 정수로 구하여라. 꼭짓점은 반시계 방향으로 주어진다.

신발끈 공식(Shoelace formula)을 사용하여 풀어라.

## 입력

첫째 줄에 N이 주어진다.
다음 N개 줄에 각 꼭짓점의 x, y 좌표가 반시계 방향으로 주어진다.

- 3 ≤ N ≤ 100,000
- -10^9 ≤ x, y ≤ 10^9
- 모든 좌표는 정수

## 출력

다각형 넓이의 2배를 정수로 출력한다.

## 예제 입력 1

\`\`\`
4
0 0
4 0
4 3
0 3
\`\`\`

## 예제 출력 1

\`\`\`
24
\`\`\`

## 예제 입력 2

\`\`\`
3
0 0
3 0
0 4
\`\`\`

## 예제 출력 2

\`\`\`
12
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n0 0\n4 0\n4 3\n0 3", expectedOutput: "24", isVisible: true },
      { input: "3\n0 0\n3 0\n0 4", expectedOutput: "12", isVisible: true },
      { input: "5\n0 0\n4 0\n5 3\n2 5\n-1 3", expectedOutput: "38", isVisible: false },
      { input: "3\n0 0\n1000000000 0\n0 1000000000", expectedOutput: "1000000000000000000", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 20. 반직선과 다각형 교점 수
  {
    title: "반직선과 다각형 교점 수",
    description: `단순 다각형과 반직선이 주어질 때, 반직선이 다각형 경계와 만나는 교점의 수를 구하여라.

반직선은 원점에서 양의 x 방향으로 뻗어 나간다.

## 입력

첫째 줄에 다각형의 꼭짓점 수 N이 주어진다.
다음 N개 줄에 각 꼭짓점의 x, y 좌표가 주어진다.
마지막 줄에 반직선 시작점의 x, y 좌표가 주어진다.

- 3 ≤ N ≤ 1,000
- -10^6 ≤ 모든 좌표 ≤ 10^6
- 모든 좌표는 정수

## 출력

교점의 수를 출력한다.

## 예제 입력 1

\`\`\`
4
0 0
4 0
4 4
0 4
1 2
\`\`\`

## 예제 출력 1

\`\`\`
1
\`\`\`

## 예제 입력 2

\`\`\`
4
0 0
4 0
4 4
0 4
-1 2
\`\`\`

## 예제 출력 2

\`\`\`
2
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n0 0\n4 0\n4 4\n0 4\n1 2", expectedOutput: "1", isVisible: true },
      { input: "4\n0 0\n4 0\n4 4\n0 4\n-1 2", expectedOutput: "2", isVisible: true },
      { input: "4\n0 0\n4 0\n4 4\n0 4\n5 2", expectedOutput: "0", isVisible: false },
      { input: "3\n0 0\n4 0\n2 4\n1 1", expectedOutput: "1", isVisible: false },
    ],
    tags: ["기하"],
  },

  // ===== 게임 이론 (21-28) =====

  // 21. 님 게임
  {
    title: "님 게임",
    description: `N개의 돌더미가 있다. 두 명의 플레이어가 번갈아 가며, 한 번에 하나의 더미에서 1개 이상의 돌을 가져간다. 마지막 돌을 가져가는 플레이어가 이긴다.

선공 플레이어가 최적으로 플레이했을 때 이기는지 여부를 출력하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 각 더미의 돌 개수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100
- 0 ≤ 각 더미의 돌 개수 ≤ 10^9

## 출력

선공이 이기면 "WIN", 지면 "LOSE"를 출력한다.

## 예제 입력 1

\`\`\`
3
1 2 3
\`\`\`

## 예제 출력 1

\`\`\`
LOSE
\`\`\`

## 예제 입력 2

\`\`\`
3
1 2 4
\`\`\`

## 예제 출력 2

\`\`\`
WIN
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 2 3", expectedOutput: "LOSE", isVisible: true },
      { input: "3\n1 2 4", expectedOutput: "WIN", isVisible: true },
      { input: "2\n2 2", expectedOutput: "LOSE", isVisible: false },
      { input: "1\n1", expectedOutput: "WIN", isVisible: false },
    ],
    tags: ["게임 이론"],
  },

  // 22. 돌 게임 (1, 3, 4)
  {
    title: "돌 게임 (1, 3, 4)",
    description: `돌 N개가 있다. 두 명의 플레이어가 번갈아 가며, 한 번에 1개, 3개, 또는 4개의 돌을 가져간다. 마지막 돌을 가져가는 플레이어가 이긴다.

선공 플레이어가 최적으로 플레이했을 때 이기는지 여부를 출력하여라.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 1,000,000

## 출력

선공이 이기면 "WIN", 지면 "LOSE"를 출력한다.

## 예제 입력 1

\`\`\`
1
\`\`\`

## 예제 출력 1

\`\`\`
WIN
\`\`\`

## 예제 입력 2

\`\`\`
7
\`\`\`

## 예제 출력 2

\`\`\`
LOSE
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "WIN", isVisible: true },
      { input: "7", expectedOutput: "LOSE", isVisible: true },
      { input: "2", expectedOutput: "LOSE", isVisible: false },
      { input: "1000000", expectedOutput: "WIN", isVisible: false },
    ],
    tags: ["게임 이론", "DP"],
  },

  // 23. 스프래그-그런디 정리
  {
    title: "스프래그-그런디 정리",
    description: `K개의 독립적인 게임이 있다. 각 게임은 돌더미이며, 해당 게임에서 한 번에 가져갈 수 있는 최대 돌의 수가 정해져 있다. 두 플레이어가 번갈아 가며 임의의 한 게임을 골라 최소 1개의 돌을 가져간다. 모든 게임에서 더 이상 가져갈 수 없을 때 마지막 이동을 한 플레이어가 이긴다.

스프래그-그런디 정리를 이용하여 선공 플레이어의 승패를 판별하여라.

## 입력

첫째 줄에 K가 주어진다.
다음 K개 줄에 돌의 개수 n_i와 한 번에 가져갈 수 있는 최대 수 m_i가 공백으로 구분되어 주어진다.

- 1 ≤ K ≤ 10
- 1 ≤ n_i ≤ 100
- 1 ≤ m_i ≤ 100

## 출력

선공이 이기면 "WIN", 지면 "LOSE"를 출력한다.

## 예제 입력 1

\`\`\`
2
3 2
5 2
\`\`\`

## 예제 출력 1

\`\`\`
WIN
\`\`\`

## 예제 입력 2

\`\`\`
2
2 2
4 2
\`\`\`

## 예제 출력 2

\`\`\`
LOSE
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n3 2\n5 2", expectedOutput: "WIN", isVisible: true },
      { input: "2\n2 2\n4 2", expectedOutput: "LOSE", isVisible: true },
      { input: "1\n5 3", expectedOutput: "WIN", isVisible: false },
      { input: "3\n4 2\n4 2\n4 2", expectedOutput: "WIN", isVisible: false },
    ],
    tags: ["게임 이론"],
  },

  // 24. 님 게임 변형 (Misère)
  {
    title: "님 게임 변형 (Misère)",
    description: `N개의 돌더미가 있다. 두 명의 플레이어가 번갈아 가며, 한 번에 하나의 더미에서 1개 이상의 돌을 가져간다. 마지막 돌을 가져가는 플레이어가 **진다** (Misère Nim).

선공 플레이어가 최적으로 플레이했을 때 이기는지 여부를 출력하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 각 더미의 돌 개수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100
- 1 ≤ 각 더미의 돌 개수 ≤ 10^9

## 출력

선공이 이기면 "WIN", 지면 "LOSE"를 출력한다.

## 예제 입력 1

\`\`\`
3
1 2 3
\`\`\`

## 예제 출력 1

\`\`\`
WIN
\`\`\`

## 예제 입력 2

\`\`\`
3
1 1 1
\`\`\`

## 예제 출력 2

\`\`\`
LOSE
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 2 3", expectedOutput: "WIN", isVisible: true },
      { input: "3\n1 1 1", expectedOutput: "LOSE", isVisible: true },
      { input: "2\n1 1", expectedOutput: "WIN", isVisible: false },
      { input: "2\n2 2", expectedOutput: "WIN", isVisible: false },
    ],
    tags: ["게임 이론"],
  },

  // 25. 계단 님
  {
    title: "계단 님",
    description: `계단이 0번부터 N번까지 있다. 각 계단에 돌이 놓여 있다. 두 플레이어가 번갈아 가며, 한 번에 임의의 계단(1번 이상)에서 1개 이상의 돌을 그 바로 아래 계단으로 이동시킨다. 0번 계단에 도달한 돌은 제거된다. 더 이상 이동할 수 없는 플레이어가 진다.

선공 플레이어가 최적으로 플레이했을 때 이기는지 여부를 출력하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 0번부터 N번 계단의 돌 개수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100
- 0 ≤ 각 계단의 돌 개수 ≤ 10^9

## 출력

선공이 이기면 "WIN", 지면 "LOSE"를 출력한다.

## 예제 입력 1

\`\`\`
2
0 3 0
\`\`\`

## 예제 출력 1

\`\`\`
WIN
\`\`\`

## 예제 입력 2

\`\`\`
3
0 1 0 1
\`\`\`

## 예제 출력 2

\`\`\`
LOSE
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n0 3 0", expectedOutput: "WIN", isVisible: true },
      { input: "3\n0 1 0 1", expectedOutput: "LOSE", isVisible: true },
      { input: "2\n0 2 2", expectedOutput: "WIN", isVisible: false },
      { input: "4\n0 2 0 2 0", expectedOutput: "LOSE", isVisible: false },
    ],
    tags: ["게임 이론"],
  },

  // 26. 초콜릿 게임 (Chomp)
  {
    title: "초콜릿 게임",
    description: `N×M 크기의 초콜릿이 있다. 두 플레이어가 번갈아 가며, 한 번에 임의의 칸 (r, c)를 골라 그 칸과 오른쪽 아래 방향 모든 칸을 먹는다. 단, (1, 1) 칸을 먹으면 그 플레이어가 진다.

선공 플레이어가 최적으로 플레이했을 때 이기는지 여부를 출력하여라.

## 입력

첫째 줄에 N, M이 공백으로 구분되어 주어진다.

- 1 ≤ N, M ≤ 10^9

## 출력

선공이 이기면 "WIN", 지면 "LOSE"를 출력한다.

## 예제 입력 1

\`\`\`
2 2
\`\`\`

## 예제 출력 1

\`\`\`
WIN
\`\`\`

## 예제 입력 2

\`\`\`
1 1
\`\`\`

## 예제 출력 2

\`\`\`
LOSE
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 2", expectedOutput: "WIN", isVisible: true },
      { input: "1 1", expectedOutput: "LOSE", isVisible: true },
      { input: "1 5", expectedOutput: "WIN", isVisible: false },
      { input: "1000000000 1000000000", expectedOutput: "WIN", isVisible: false },
    ],
    tags: ["게임 이론"],
  },

  // 27. 돌 나누기 게임
  {
    title: "돌 나누기 게임",
    description: `돌 N개짜리 더미 하나가 있다. 두 플레이어가 번갈아 가며, 현재 더미 중 하나를 서로 다른 크기의 두 더미로 나눈다. 나눌 수 있는 더미가 없으면 진다.

스프래그-그런디 정리를 이용하여 선공 플레이어의 승패를 판별하여라.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 100

## 출력

선공이 이기면 "WIN", 지면 "LOSE"를 출력한다.

## 예제 입력 1

\`\`\`
3
\`\`\`

## 예제 출력 1

\`\`\`
WIN
\`\`\`

## 예제 입력 2

\`\`\`
4
\`\`\`

## 예제 출력 2

\`\`\`
LOSE
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3", expectedOutput: "WIN", isVisible: true },
      { input: "4", expectedOutput: "LOSE", isVisible: true },
      { input: "5", expectedOutput: "WIN", isVisible: false },
      { input: "7", expectedOutput: "LOSE", isVisible: false },
    ],
    tags: ["게임 이론"],
  },

  // 28. Green Hackenbush (트리)
  {
    title: "Green Hackenbush (트리)",
    description: `루트가 있는 트리에서 Green Hackenbush 게임을 한다. 두 플레이어가 번갈아 가며 임의의 간선을 제거하고, 루트와 연결되지 않은 부분도 함께 제거된다. 더 이상 제거할 간선이 없으면 진다.

스프래그-그런디 정리를 이용하여 선공 플레이어의 승패를 판별하여라.

## 입력

첫째 줄에 정점 수 N이 주어진다. 정점은 1번부터 N번이고 1번이 루트(지면)이다.
다음 N-1개 줄에 간선 u, v가 주어진다.

- 2 ≤ N ≤ 1,000

## 출력

선공이 이기면 "WIN", 지면 "LOSE"를 출력한다.

## 예제 입력 1

\`\`\`
2
1 2
\`\`\`

## 예제 출력 1

\`\`\`
WIN
\`\`\`

## 예제 입력 2

\`\`\`
3
1 2
1 3
\`\`\`

## 예제 출력 2

\`\`\`
LOSE
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n1 2", expectedOutput: "WIN", isVisible: true },
      { input: "3\n1 2\n1 3", expectedOutput: "LOSE", isVisible: true },
      { input: "4\n1 2\n1 3\n1 4", expectedOutput: "WIN", isVisible: false },
      { input: "4\n1 2\n2 3\n2 4", expectedOutput: "WIN", isVisible: false },
    ],
    tags: ["게임 이론", "트리"],
  },

  // ===== 고급 DP 응용 (29-38) =====

  // 29. Knuth 최적화 (최적 이진 검색 트리)
  {
    title: "최적 이진 검색 트리",
    description: `N개의 키가 주어지고 각 키에 대한 탐색 빈도(가중치)가 주어진다. 이진 검색 트리를 구성했을 때 기대 비교 횟수를 최소화하는 비용을 구하여라.

비용은 각 키를 탐색할 때 비교 횟수의 가중 합이다. Knuth 최적화를 사용하여 O(N²) 시간에 풀어라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 N개의 정수 w_1, w_2, ..., w_N이 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 5,000
- 1 ≤ w_i ≤ 1,000

## 출력

최적 이진 검색 트리의 탐색 비용을 출력한다.

## 예제 입력 1

\`\`\`
4
1 2 3 4
\`\`\`

## 예제 출력 1

\`\`\`
18
\`\`\`

## 예제 입력 2

\`\`\`
1
5
\`\`\`

## 예제 출력 2

\`\`\`
5
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n1 2 3 4", expectedOutput: "18", isVisible: true },
      { input: "1\n5", expectedOutput: "5", isVisible: true },
      { input: "3\n3 2 1", expectedOutput: "8", isVisible: false },
      { input: "5\n1 1 1 1 1", expectedOutput: "12", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 30. 볼록 껍질 트릭 (CHT)
  {
    title: "볼록 껍질 트릭",
    description: `N개의 도시가 있고 도시 i는 비용 c_i를 가진다. 도시 1에서 출발하여 도시 N까지 이동할 수 있다. 도시 i에서 도시 j(i < j)로 이동하는 비용은 (c_i + c_j) × (j - i)이다. 총 이동 비용의 최솟값을 구하여라.

볼록 껍질 트릭(Convex Hull Trick) 또는 Li Chao Tree를 사용하여 O(N log N) 이하로 풀어라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 N개의 정수 c_1, c_2, ..., c_N이 공백으로 구분되어 주어진다.

- 2 ≤ N ≤ 100,000
- 1 ≤ c_i ≤ 10^6

## 출력

최솟값을 출력한다.

## 예제 입력 1

\`\`\`
3
1 2 3
\`\`\`

## 예제 출력 1

\`\`\`
8
\`\`\`

## 예제 입력 2

\`\`\`
4
1 10 2 3
\`\`\`

## 예제 출력 2

\`\`\`
14
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 2 3", expectedOutput: "8", isVisible: true },
      { input: "4\n1 10 2 3", expectedOutput: "14", isVisible: true },
      { input: "2\n1 1", expectedOutput: "2", isVisible: false },
      { input: "5\n1 2 3 4 5", expectedOutput: "30", isVisible: false },
    ],
    tags: ["DP", "자료구조"],
  },

  // 31. 트리 DP (최대 독립 집합)
  {
    title: "트리 최대 독립 집합",
    description: `루트가 있는 트리에서 각 노드에 값이 주어진다. 인접한 두 노드를 동시에 선택할 수 없을 때, 선택된 노드의 값의 합을 최대화하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 N개의 정수 v_1, v_2, ..., v_N이 공백으로 구분되어 주어진다.
다음 N-1개 줄에 간선 u, v가 주어진다. 1번 노드가 루트이다.

- 1 ≤ N ≤ 100,000
- 1 ≤ v_i ≤ 10^6

## 출력

선택된 노드 값의 최대 합을 출력한다.

## 예제 입력 1

\`\`\`
3
1 5 1
1 2
2 3
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\`

## 예제 입력 2

\`\`\`
4
10 1 1 1
1 2
1 3
1 4
\`\`\`

## 예제 출력 2

\`\`\`
10
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 5 1\n1 2\n2 3", expectedOutput: "5", isVisible: true },
      { input: "4\n10 1 1 1\n1 2\n1 3\n1 4", expectedOutput: "10", isVisible: true },
      { input: "1\n7", expectedOutput: "7", isVisible: false },
      { input: "5\n3 4 2 5 1\n1 2\n1 3\n2 4\n2 5", expectedOutput: "11", isVisible: false },
    ],
    tags: ["DP", "트리"],
  },

  // 32. 확률 DP
  {
    title: "확률 DP",
    description: `6면체 주사위 두 개를 던졌을 때 나온 눈의 합이 N 이상일 확률을 구하여라.

## 입력

첫째 줄에 N이 주어진다.

- 2 ≤ N ≤ 12

## 출력

확률을 소수점 아래 6자리까지 출력한다.

## 예제 입력 1

\`\`\`
7
\`\`\`

## 예제 출력 1

\`\`\`
0.583333
\`\`\`

## 예제 입력 2

\`\`\`
2
\`\`\`

## 예제 출력 2

\`\`\`
1.000000
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.000001,
    testCases: [
      { input: "7", expectedOutput: "0.583333", isVisible: true },
      { input: "2", expectedOutput: "1.000000", isVisible: true },
      { input: "12", expectedOutput: "0.027778", isVisible: false },
      { input: "8", expectedOutput: "0.416667", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 33. 기댓값 DP
  {
    title: "기댓값 DP",
    description: `공정한 동전을 던질 때, N번 연속으로 앞면이 나올 때까지 던지는 횟수의 기댓값을 구하여라.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 20

## 출력

기댓값을 소수점 아래 6자리까지 출력한다.

## 예제 입력 1

\`\`\`
1
\`\`\`

## 예제 출력 1

\`\`\`
2.000000
\`\`\`

## 예제 입력 2

\`\`\`
3
\`\`\`

## 예제 출력 2

\`\`\`
14.000000
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.000001,
    testCases: [
      { input: "1", expectedOutput: "2.000000", isVisible: true },
      { input: "3", expectedOutput: "14.000000", isVisible: true },
      { input: "2", expectedOutput: "6.000000", isVisible: false },
      { input: "5", expectedOutput: "62.000000", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 34. SOS DP (Sum over Subsets)
  {
    title: "부분집합 합 DP",
    description: `길이 2^N인 배열 A가 주어진다. 각 마스크 mask에 대해 mask의 서브마스크(비트가 mask의 부분 집합인 마스크)의 A 값의 합을 구하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 2^N개의 정수 A[0], A[1], ..., A[2^N - 1]이 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 20
- 0 ≤ A[i] ≤ 10^6

## 출력

2^N개의 정수를 공백으로 구분하여 출력한다. i번째 값은 마스크 i에 대한 서브마스크 합이다.

## 예제 입력 1

\`\`\`
2
1 2 3 4
\`\`\`

## 예제 출력 1

\`\`\`
1 3 4 10
\`\`\`

## 예제 입력 2

\`\`\`
1
5 7
\`\`\`

## 예제 출력 2

\`\`\`
5 12
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n1 2 3 4", expectedOutput: "1 3 4 10", isVisible: true },
      { input: "1\n5 7", expectedOutput: "5 12", isVisible: true },
      { input: "3\n1 2 3 4 5 6 7 8", expectedOutput: "1 3 4 10 6 14 16 36", isVisible: false },
      { input: "2\n0 0 0 1", expectedOutput: "0 0 0 1", isVisible: false },
    ],
    tags: ["DP", "비트마스크"],
  },

  // 35. Digit DP
  {
    title: "자릿수 합 DP",
    description: `정수 L, R, K가 주어질 때, L 이상 R 이하의 정수 중 각 자릿수의 합이 K인 수의 개수를 구하여라.

## 입력

첫째 줄에 L, R, K가 공백으로 구분되어 주어진다.

- 1 ≤ L ≤ R ≤ 10^18
- 1 ≤ K ≤ 162

## 출력

조건을 만족하는 정수의 개수를 출력한다.

## 예제 입력 1

\`\`\`
1 99 10
\`\`\`

## 예제 출력 1

\`\`\`
9
\`\`\`

## 예제 입력 2

\`\`\`
1 100 10
\`\`\`

## 예제 출력 2

\`\`\`
9
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1 99 10", expectedOutput: "9", isVisible: true },
      { input: "1 100 10", expectedOutput: "9", isVisible: true },
      { input: "1 1000000000000000000 1", expectedOutput: "19", isVisible: false },
      { input: "100 999 5", expectedOutput: "15", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 36. 연쇄 행렬 곱셈
  {
    title: "연쇄 행렬 곱셈",
    description: `N개의 행렬을 순서대로 곱할 때 최소 곱셈 횟수를 구하고, 그 괄호 표현을 출력하여라.

## 입력

첫째 줄에 N이 주어진다.
다음 N+1개의 줄에 d_0, d_1, ..., d_N이 주어진다. i번째 행렬은 d_{i-1} × d_i 크기이다.

- 2 ≤ N ≤ 100
- 1 ≤ d_i ≤ 500

## 출력

첫째 줄에 최솟값을 출력한다.
둘째 줄에 괄호 표현을 출력한다. i번째 행렬은 A_i로 표기한다.

## 예제 입력 1

\`\`\`
3
10
30
5
60
\`\`\`

## 예제 출력 1

\`\`\`
4500
((A1A2)A3)
\`\`\`

## 예제 입력 2

\`\`\`
2
5
10
20
\`\`\`

## 예제 출력 2

\`\`\`
1000
(A1A2)
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n10\n30\n5\n60", expectedOutput: "4500\n((A1A2)A3)", isVisible: true },
      { input: "2\n5\n10\n20", expectedOutput: "1000\n(A1A2)", isVisible: true },
      { input: "4\n30\n35\n15\n5\n10", expectedOutput: "7875\n((A1(A2A3))A4)", isVisible: false },
      { input: "1\n3\n5", expectedOutput: "0\nA1", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 37. DP on Trees (Rerooting)
  {
    title: "트리 리루팅 DP",
    description: `N개의 정점으로 이루어진 트리가 있다. 각 정점 v에 대해, v를 루트로 했을 때 모든 정점까지의 거리의 합을 구하여라.

## 입력

첫째 줄에 N이 주어진다.
다음 N-1개 줄에 간선 u, v가 주어진다.

- 1 ≤ N ≤ 200,000

## 출력

N개의 줄에 1번 정점부터 N번 정점까지 각 정점을 루트로 했을 때의 거리 합을 출력한다.

## 예제 입력 1

\`\`\`
4
1 2
2 3
2 4
\`\`\`

## 예제 출력 1

\`\`\`
4
2
4
4
\`\`\`

## 예제 입력 2

\`\`\`
3
1 2
2 3
\`\`\`

## 예제 출력 2

\`\`\`
3
2
3
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n1 2\n2 3\n2 4", expectedOutput: "4\n2\n4\n4", isVisible: true },
      { input: "3\n1 2\n2 3", expectedOutput: "3\n2\n3", isVisible: true },
      { input: "1", expectedOutput: "0", isVisible: false },
      { input: "5\n1 2\n1 3\n1 4\n1 5", expectedOutput: "4\n6\n6\n6\n6", isVisible: false },
    ],
    tags: ["DP", "트리"],
  },

  // 38. 비트마스크 DP (도미노 타일링)
  {
    title: "도미노 타일링",
    description: `N×M 격자를 1×2 도미노로 빈틈없이 채우는 경우의 수를 구하여라.

## 입력

첫째 줄에 N, M이 공백으로 구분되어 주어진다.

- 1 ≤ N, M ≤ 12

## 출력

격자를 도미노로 채우는 경우의 수를 출력한다.

## 예제 입력 1

\`\`\`
2 4
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\`

## 예제 입력 2

\`\`\`
4 4
\`\`\`

## 예제 출력 2

\`\`\`
36
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 4", expectedOutput: "5", isVisible: true },
      { input: "4 4", expectedOutput: "36", isVisible: true },
      { input: "2 2", expectedOutput: "2", isVisible: false },
      { input: "4 6", expectedOutput: "281", isVisible: false },
    ],
    tags: ["DP", "비트마스크"],
  },

  // ===== 구성적 알고리즘 / 복합 문제 (39-50) =====

  // 39. 구성적: 순열 만들기
  {
    title: "인접 차이 최대-최소 순열",
    description: `1부터 N까지의 수를 한 번씩 사용하는 순열 중, 인접한 원소 차이의 최솟값이 최대가 되는 순열을 하나 구성하여라.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 100,000

## 출력

조건을 만족하는 순열을 한 줄에 공백으로 구분하여 출력한다.

## 예제 입력 1

\`\`\`
4
\`\`\`

## 예제 출력 1

\`\`\`
2 4 1 3
\`\`\`

## 예제 입력 2

\`\`\`
6
\`\`\`

## 예제 출력 2

\`\`\`
3 6 2 5 1 4
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4", expectedOutput: "2 4 1 3", isVisible: true },
      { input: "6", expectedOutput: "3 6 2 5 1 4", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "8", expectedOutput: "4 8 3 7 2 6 1 5", isVisible: false },
    ],
    tags: ["구성적"],
  },

  // 40. 구성적: 그래프 만들기
  {
    title: "차수 수열 그래프 구성",
    description: `N개의 정수로 이루어진 차수 수열이 주어질 때, 해당 차수 수열을 갖는 단순 그래프를 구성하여라. 불가능하면 -1을 출력한다.

Erdős–Gallai 정리를 이용하여 검증한 후 구성하여라.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 N개의 정수 d_1, d_2, ..., d_N이 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 1,000
- 0 ≤ d_i ≤ N-1

## 출력

그래프가 존재하면 간선의 수 M을 첫째 줄에 출력하고, 다음 M개 줄에 각 간선 u, v를 출력한다.
불가능하면 -1을 출력한다.

## 예제 입력 1

\`\`\`
4
3 3 3 3
\`\`\`

## 예제 출력 1

\`\`\`
6
1 2
1 3
1 4
2 3
2 4
3 4
\`\`\`

## 예제 입력 2

\`\`\`
3
3 2 1
\`\`\`

## 예제 출력 2

\`\`\`
-1
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n3 3 3 3", expectedOutput: "6\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4", isVisible: true },
      { input: "3\n3 2 1", expectedOutput: "-1", isVisible: true },
      { input: "3\n2 2 2", expectedOutput: "3\n1 2\n1 3\n2 3", isVisible: false },
      { input: "4\n4 4 4 4", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["구성적", "그래프"],
  },

  // 41. 최대 독립 집합 (비트마스크)
  {
    title: "최대 독립 집합",
    description: `N개의 정점과 M개의 간선으로 이루어진 그래프에서 독립 집합(어느 두 정점도 인접하지 않은 집합)의 최대 크기를 구하여라.

비트마스크를 이용하여 풀어라.

## 입력

첫째 줄에 N, M이 공백으로 구분되어 주어진다.
다음 M개 줄에 간선 u, v가 주어진다.

- 1 ≤ N ≤ 20
- 0 ≤ M ≤ N(N-1)/2

## 출력

최대 독립 집합의 크기를 출력한다.

## 예제 입력 1

\`\`\`
4 3
1 2
2 3
3 4
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\`

## 예제 입력 2

\`\`\`
3 3
1 2
2 3
1 3
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 3\n1 2\n2 3\n3 4", expectedOutput: "2", isVisible: true },
      { input: "3 3\n1 2\n2 3\n1 3", expectedOutput: "1", isVisible: true },
      { input: "5 4\n1 2\n2 3\n3 4\n4 5", expectedOutput: "3", isVisible: false },
      { input: "4 0", expectedOutput: "4", isVisible: false },
    ],
    tags: ["그래프", "비트마스크"],
  },

  // 42. 2-SAT
  {
    title: "2-SAT",
    description: `N개의 불리언 변수 x_1, x_2, ..., x_N과 M개의 절(clause)이 주어진다. 각 절은 두 리터럴의 논리합(OR) 형태이다. 모든 절을 만족하는 변수 할당이 존재하는지 판별하여라.

## 입력

첫째 줄에 N, M이 공백으로 구분되어 주어진다.
다음 M개 줄에 절이 주어진다. 양의 정수 i는 x_i, 음의 정수 -i는 ¬x_i를 나타낸다.

- 1 ≤ N ≤ 10,000
- 1 ≤ M ≤ 100,000

## 출력

만족 가능하면 "YES", 아니면 "NO"를 출력한다.

## 예제 입력 1

\`\`\`
3 3
1 2
-1 3
-2 -3
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\`

## 예제 입력 2

\`\`\`
1 2
1 1
-1 -1
\`\`\`

## 예제 출력 2

\`\`\`
NO
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 3\n1 2\n-1 3\n-2 -3", expectedOutput: "YES", isVisible: true },
      { input: "1 2\n1 1\n-1 -1", expectedOutput: "NO", isVisible: true },
      { input: "2 2\n1 2\n-1 -2", expectedOutput: "YES", isVisible: false },
      { input: "2 4\n1 2\n1 -2\n-1 2\n-1 -2", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["그래프"],
  },

  // 43. 최소 버텍스 커버 (트리)
  {
    title: "트리 최소 버텍스 커버",
    description: `N개의 정점으로 이루어진 트리에서 최소 버텍스 커버의 크기를 구하여라. 버텍스 커버란 모든 간선에 대해 적어도 한 끝점이 포함된 정점 집합이다.

## 입력

첫째 줄에 N이 주어진다.
다음 N-1개 줄에 간선 u, v가 주어진다.

- 1 ≤ N ≤ 100,000

## 출력

최소 버텍스 커버의 크기를 출력한다.

## 예제 입력 1

\`\`\`
3
1 2
2 3
\`\`\`

## 예제 출력 1

\`\`\`
1
\`\`\`

## 예제 입력 2

\`\`\`
4
1 2
1 3
1 4
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 2\n2 3", expectedOutput: "1", isVisible: true },
      { input: "4\n1 2\n1 3\n1 4", expectedOutput: "1", isVisible: true },
      { input: "5\n1 2\n2 3\n3 4\n4 5", expectedOutput: "2", isVisible: false },
      { input: "6\n1 2\n2 3\n2 4\n1 5\n5 6", expectedOutput: "2", isVisible: false },
    ],
    tags: ["DP", "트리"],
  },

  // 44. 센트로이드 분할
  {
    title: "센트로이드 분할",
    description: `N개의 정점으로 이루어진 트리에서 두 정점 사이의 거리가 정확히 K인 쌍의 수를 구하여라.

센트로이드 분할(centroid decomposition)을 사용하여 풀어라.

## 입력

첫째 줄에 N, K가 공백으로 구분되어 주어진다.
다음 N-1개 줄에 간선 u, v가 주어진다.

- 1 ≤ N ≤ 100,000
- 1 ≤ K ≤ 10^9

## 출력

거리가 K인 정점 쌍의 수를 출력한다.

## 예제 입력 1

\`\`\`
5 2
1 2
2 3
3 4
4 5
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
5 3
1 2
2 3
3 4
4 5
\`\`\`

## 예제 출력 2

\`\`\`
2
\`\`\``,
    difficulty: 9.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 2\n1 2\n2 3\n3 4\n4 5", expectedOutput: "3", isVisible: true },
      { input: "5 3\n1 2\n2 3\n3 4\n4 5", expectedOutput: "2", isVisible: true },
      { input: "5 10\n1 2\n2 3\n3 4\n4 5", expectedOutput: "0", isVisible: false },
      { input: "7 2\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7", expectedOutput: "4", isVisible: false },
    ],
    tags: ["트리", "분할 정복"],
  },

  // 45. Heavy-Light Decomposition
  {
    title: "Heavy-Light Decomposition",
    description: `N개의 정점으로 이루어진 트리에서 Q개의 쿼리를 처리하여라. 각 쿼리는 두 가지 중 하나이다.

- 1 v w: 정점 v의 값을 w로 변경
- 2 u v: 정점 u에서 v로 가는 경로 위의 정점 값의 합을 출력

## 입력

첫째 줄에 N, Q가 공백으로 구분되어 주어진다.
둘째 줄에 각 정점의 초기 값이 공백으로 구분되어 주어진다.
다음 N-1개 줄에 간선 u, v가 주어진다.
다음 Q개 줄에 쿼리가 주어진다.

- 1 ≤ N, Q ≤ 100,000
- 1 ≤ 정점 값, w ≤ 10^6
- 1번 정점이 루트

## 출력

타입 2 쿼리마다 결과를 출력한다.

## 예제 입력 1

\`\`\`
5 3
1 2 3 4 5
1 2
1 3
2 4
2 5
2 1 4
1 3 10
2 1 3
\`\`\`

## 예제 출력 1

\`\`\`
7
13
\`\`\`

## 예제 입력 2

\`\`\`
3 2
1 1 1
1 2
1 3
2 2 3
2 1 3
\`\`\`

## 예제 출력 2

\`\`\`
3
2
\`\`\``,
    difficulty: 9.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3\n1 2 3 4 5\n1 2\n1 3\n2 4\n2 5\n2 1 4\n1 3 10\n2 1 3", expectedOutput: "7\n13", isVisible: true },
      { input: "3 2\n1 1 1\n1 2\n1 3\n2 2 3\n2 1 3", expectedOutput: "3\n2", isVisible: true },
      { input: "1 1\n7\n2 1 1", expectedOutput: "7", isVisible: false },
      { input: "4 3\n5 3 7 2\n1 2\n2 3\n3 4\n2 1 4\n1 2 10\n2 1 4", expectedOutput: "17\n24", isVisible: false },
    ],
    tags: ["트리", "자료구조"],
  },

  // 46. Aho-Corasick
  {
    title: "Aho-Corasick",
    description: `텍스트 T와 N개의 패턴이 주어질 때, 텍스트에서 모든 패턴이 나타나는 총 횟수를 구하여라. 서로 다른 패턴이 같은 위치에서 겹쳐도 각각 센다.

Aho-Corasick 알고리즘을 사용하여 풀어라.

## 입력

첫째 줄에 텍스트 T가 주어진다.
둘째 줄에 N이 주어진다.
다음 N개 줄에 각 패턴이 주어진다.

- 1 ≤ |T| ≤ 10^6
- 1 ≤ N ≤ 1,000
- 모든 패턴의 길이 합 ≤ 10^6
- T와 패턴은 소문자 영문자로 이루어짐

## 출력

텍스트에서 모든 패턴이 나타나는 총 횟수를 출력한다.

## 예제 입력 1

\`\`\`
abcabc
3
abc
bc
c
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\`

## 예제 입력 2

\`\`\`
aaaa
2
a
aa
\`\`\`

## 예제 출력 2

\`\`\`
7
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "abcabc\n3\nabc\nbc\nc", expectedOutput: "6", isVisible: true },
      { input: "aaaa\n2\na\naa", expectedOutput: "7", isVisible: true },
      { input: "abcdef\n2\nabc\nxyz", expectedOutput: "1", isVisible: false },
      { input: "aaa\n1\na", expectedOutput: "3", isVisible: false },
    ],
    tags: ["문자열", "자료구조"],
  },

  // 47. 최소 비용 최대 유량 (MCMF)
  {
    title: "최소 비용 최대 유량",
    description: `N개의 정점과 E개의 단방향 간선으로 이루어진 네트워크가 주어진다. 소스 1에서 싱크 N까지의 최대 유량과 그 최대 유량을 흘릴 때의 최소 비용을 구하여라.

## 입력

첫째 줄에 N, E가 공백으로 구분되어 주어진다.
다음 E개 줄에 간선 u, v, capacity, cost가 주어진다.

- 2 ≤ N ≤ 200
- 1 ≤ E ≤ 5,000
- 1 ≤ capacity ≤ 1,000
- 1 ≤ cost ≤ 1,000

## 출력

첫째 줄에 최대 유량을 출력한다.
둘째 줄에 최소 비용을 출력한다.

## 예제 입력 1

\`\`\`
4 5
1 2 3 1
1 3 2 2
2 3 1 1
2 4 2 3
3 4 3 1
\`\`\`

## 예제 출력 1

\`\`\`
4
14
\`\`\`

## 예제 입력 2

\`\`\`
2 1
1 2 5 3
\`\`\`

## 예제 출력 2

\`\`\`
5
15
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 5\n1 2 3 1\n1 3 2 2\n2 3 1 1\n2 4 2 3\n3 4 3 1", expectedOutput: "4\n14", isVisible: true },
      { input: "2 1\n1 2 5 3", expectedOutput: "5\n15", isVisible: true },
      { input: "3 3\n1 2 2 1\n2 3 2 1\n1 3 1 3", expectedOutput: "3\n7", isVisible: false },
      { input: "2 2\n1 2 3 1\n1 2 2 2", expectedOutput: "5\n7", isVisible: false },
    ],
    tags: ["그래프", "네트워크 플로우"],
  },

  // 48. 평면 그래프 판별
  {
    title: "평면 그래프 판별",
    description: `N개의 정점과 M개의 간선으로 이루어진 단순 그래프가 주어질 때, 이 그래프가 평면 그래프인지 판별하여라.

오일러 공식 V - E + F = 2와 E ≤ 3V - 6 조건을 이용하여 판별하여라.

## 입력

첫째 줄에 N, M이 공백으로 구분되어 주어진다.
다음 M개 줄에 간선 u, v가 주어진다.

- 1 ≤ N ≤ 200
- 0 ≤ M ≤ N(N-1)/2

## 출력

평면 그래프이면 "YES", 아니면 "NO"를 출력한다.

## 예제 입력 1

\`\`\`
4 6
1 2
1 3
1 4
2 3
2 4
3 4
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\`

## 예제 입력 2

\`\`\`
5 10
1 2
1 3
1 4
1 5
2 3
2 4
2 5
3 4
3 5
4 5
\`\`\`

## 예제 출력 2

\`\`\`
NO
\`\`\``,
    difficulty: 9.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 6\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4", expectedOutput: "YES", isVisible: true },
      { input: "5 10\n1 2\n1 3\n1 4\n1 5\n2 3\n2 4\n2 5\n3 4\n3 5\n4 5", expectedOutput: "NO", isVisible: true },
      { input: "3 3\n1 2\n2 3\n1 3", expectedOutput: "YES", isVisible: false },
      { input: "6 9\n1 2\n1 3\n1 4\n2 5\n2 6\n3 5\n3 6\n4 5\n4 6", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["그래프"],
  },

  // 49. Suffix Array + LCP
  {
    title: "서로 다른 부분 문자열 수",
    description: `문자열 S가 주어질 때, S의 서로 다른 부분 문자열의 개수를 구하여라.

Suffix Array와 LCP 배열을 이용하여 풀어라.

## 입력

첫째 줄에 문자열 S가 주어진다.

- 1 ≤ |S| ≤ 200,000
- S는 소문자 영문자로 이루어짐

## 출력

서로 다른 부분 문자열의 개수를 출력한다.

## 예제 입력 1

\`\`\`
aab
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\`

## 예제 입력 2

\`\`\`
abc
\`\`\`

## 예제 출력 2

\`\`\`
6
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "aab", expectedOutput: "5", isVisible: true },
      { input: "abc", expectedOutput: "6", isVisible: true },
      { input: "aaa", expectedOutput: "3", isVisible: false },
      { input: "abab", expectedOutput: "7", isVisible: false },
    ],
    tags: ["문자열"],
  },

  // 50. Persistent Segment Tree
  {
    title: "영속 세그먼트 트리",
    description: `N개의 정수로 이루어진 배열이 주어진다. 다음 두 종류의 쿼리를 처리하여라.

- 1 v i x: v번 버전의 배열에서 i번째 원소를 x로 바꾼 새로운 버전을 만든다.
- 2 v i: v번 버전의 배열의 i번째 원소를 출력한다.

초기 배열이 버전 0이다.

## 입력

첫째 줄에 N이 주어진다.
둘째 줄에 N개의 초기 값이 공백으로 구분되어 주어진다.
셋째 줄에 쿼리 수 Q가 주어진다.
다음 Q개 줄에 쿼리가 주어진다.

- 1 ≤ N ≤ 100,000
- 1 ≤ Q ≤ 100,000
- 1 ≤ i ≤ N
- 1 ≤ x ≤ 10^9
- 쿼리 1의 v는 이미 존재하는 버전 번호 (0 이상)
- 쿼리 2의 v는 이미 존재하는 버전 번호

## 출력

쿼리 2마다 결과를 출력한다.

## 예제 입력 1

\`\`\`
5
3 1 4 1 5
4
1 0 2 10
2 0 2
2 1 2
2 1 3
\`\`\`

## 예제 출력 1

\`\`\`
1
10
4
\`\`\`

## 예제 입력 2

\`\`\`
3
1 2 3
3
1 0 1 9
2 0 1
2 1 1
\`\`\`

## 예제 출력 2

\`\`\`
1
9
\`\`\``,
    difficulty: 9.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5\n4\n1 0 2 10\n2 0 2\n2 1 2\n2 1 3", expectedOutput: "1\n10\n4", isVisible: true },
      { input: "3\n1 2 3\n3\n1 0 1 9\n2 0 1\n2 1 1", expectedOutput: "1\n9", isVisible: true },
      { input: "1\n7\n2\n2 0 1\n1 0 1 42", expectedOutput: "7", isVisible: false },
      { input: "4\n5 3 7 2\n4\n1 0 3 99\n2 0 3\n2 1 3\n2 1 1", expectedOutput: "7\n99\n5", isVisible: false },
    ],
    tags: ["자료구조", "세그먼트 트리"],
  },
];
