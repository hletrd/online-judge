export const problems = [
  // ===== 큰 수 연산 (1-10) =====

  // 1. 매우 큰 수 덧셈
  {
    title: "매우 큰 수 덧셈",
    description: `최대 10,000자리의 양의 정수 두 개가 주어진다. 두 수의 합을 구하여라.

## 입력

첫째 줄에 양의 정수 A, 둘째 줄에 양의 정수 B가 주어진다.

- 1 ≤ A, B의 자릿수 ≤ 10,000

## 출력

A + B를 출력한다.

## 예제 입력 1

\`\`\`
99999999999999999999
1
\`\`\`

## 예제 출력 1

\`\`\`
100000000000000000000
\`\`\`

## 예제 입력 2

\`\`\`
123456789012345678901234567890
987654321098765432109876543210
\`\`\`

## 예제 출력 2

\`\`\`
1111111110111111111011111111100
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "99999999999999999999\n1", expectedOutput: "100000000000000000000", isVisible: true },
      { input: "123456789012345678901234567890\n987654321098765432109876543210", expectedOutput: "1111111110111111111011111111100", isVisible: true },
      { input: "98765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210\n12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890", expectedOutput: "111111111011111111101111111110111111111011111111101111111110111111111011111111101111111110111111111011111111101111111110111111111011111111101111111110111111111011111111101111111110111111111011111111100", isVisible: false },
      { input: "1\n1", expectedOutput: "2", isVisible: false },
      { input: "9999999999\n1", expectedOutput: "10000000000", isVisible: false },
    ],
    tags: ["큰 수", "문자열"],
  },

  // 2. 매우 큰 수 뺄셈
  {
    title: "매우 큰 수 뺄셈",
    description: `최대 10,000자리의 양의 정수 A, B가 주어진다. A − B를 구하여라. A ≥ B임이 보장된다. 결과의 앞에 불필요한 0이 있으면 제거하고 출력한다.

## 입력

첫째 줄에 양의 정수 A, 둘째 줄에 양의 정수 B가 주어진다.

- 1 ≤ B ≤ A, A의 자릿수 ≤ 10,000

## 출력

A − B를 출력한다. (앞의 0은 제거하여 출력한다.)

## 예제 입력 1

\`\`\`
1000000000000000000000000000000
1
\`\`\`

## 예제 출력 1

\`\`\`
999999999999999999999999999999
\`\`\`

## 예제 입력 2

\`\`\`
9876543210987654321098765432109876543210
1234567890123456789012345678901234567890
\`\`\`

## 예제 출력 2

\`\`\`
8641975320864197532086419753208641975320
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1000000000000000000000000000000\n1", expectedOutput: "999999999999999999999999999999", isVisible: true },
      { input: "9876543210987654321098765432109876543210\n1234567890123456789012345678901234567890", expectedOutput: "8641975320864197532086419753208641975320", isVisible: true },
      { input: "98765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210\n12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890", expectedOutput: "86419753208641975320864197532086419753208641975320864197532086419753208641975320864197532086419753208641975320864197532086419753208641975320864197532086419753208641975320864197532086419753208641975320", isVisible: false },
      { input: "100\n1", expectedOutput: "99", isVisible: false },
      { input: "1000\n999", expectedOutput: "1", isVisible: false },
    ],
    tags: ["큰 수", "문자열"],
  },

  // 3. 매우 큰 수 곱셈
  {
    title: "매우 큰 수 곱셈",
    description: `최대 5,000자리의 양의 정수 두 개가 주어진다. 두 수의 곱을 구하여라.

## 입력

첫째 줄에 양의 정수 A, 둘째 줄에 양의 정수 B가 주어진다.

- 1 ≤ A, B의 자릿수 ≤ 5,000

## 출력

A × B를 출력한다.

## 예제 입력 1

\`\`\`
12345678901234567890
98765432109876543210
\`\`\`

## 예제 출력 1

\`\`\`
1219326311370217952237463801111263526900
\`\`\`

## 예제 입력 2

\`\`\`
99999
99999
\`\`\`

## 예제 출력 2

\`\`\`
9999800001
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "12345678901234567890\n98765432109876543210", expectedOutput: "1219326311370217952237463801111263526900", isVisible: true },
      { input: "99999\n99999", expectedOutput: "9999800001", isVisible: true },
      { input: "8101901153000597972121087318719189048147543378081052762019721832051824706402424270965759770792787441\n3661817643512942571163040381547194163163783538629340582787522092281520012306653648465928144669481643", expectedOutput: "29667684588055442052591947819629537279792672707252975345407992235571483042949024431170020250595122134176090828904577336205657632877192452792034106342449194838192181970938570535817677065298252550445563", isVisible: false },
      { input: "2\n3", expectedOutput: "6", isVisible: false },
      { input: "999\n999", expectedOutput: "998001", isVisible: false },
    ],
    tags: ["큰 수", "수학"],
  },

  // 4. 큰 수 나머지
  {
    title: "큰 수 나머지",
    description: `최대 100,000자리의 양의 정수 N과 정수 M이 주어진다. N을 M으로 나눈 나머지를 구하여라.

## 입력

첫째 줄에 양의 정수 N, 둘째 줄에 정수 M이 주어진다.

- N의 자릿수 ≤ 100,000
- 1 ≤ M ≤ 10^9

## 출력

N mod M을 출력한다.

## 예제 입력 1

\`\`\`
123456789012345678901234567890123456789
1000000007
\`\`\`

## 예제 출력 1

\`\`\`
741412909
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "123456789012345678901234567890123456789\n1000000007", expectedOutput: "741412909", isVisible: true },
      { input: "9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n998244353", expectedOutput: "510425699", isVisible: false },
      { input: "10\n3", expectedOutput: "1", isVisible: false },
      { input: "1000000000000000000\n7", expectedOutput: "1", isVisible: false },
    ],
    tags: ["큰 수", "수학"],
  },

  // 5. 큰 수 비교
  {
    title: "큰 수 비교",
    description: `최대 100,000자리의 양의 정수 두 개가 주어진다. 두 수를 비교하여라.

## 입력

첫째 줄에 양의 정수 A, 둘째 줄에 양의 정수 B가 주어진다.

- 1 ≤ A, B의 자릿수 ≤ 100,000

## 출력

A > B이면 \`>\`, A < B이면 \`<\`, A = B이면 \`==\`을 출력한다.

## 예제 입력 1

\`\`\`
999999999999999999999999999999
999999999999999999999999999998
\`\`\`

## 예제 출력 1

\`\`\`
>
\`\`\`

## 예제 입력 2

\`\`\`
999999999999999999999
999999999999999999999
\`\`\`

## 예제 출력 2

\`\`\`
==
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "999999999999999999999999999999\n999999999999999999999999999998", expectedOutput: ">", isVisible: true },
      { input: "999999999999999999999\n999999999999999999999", expectedOutput: "==", isVisible: true },
      { input: "123\n456", expectedOutput: "<", isVisible: false },
      { input: "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567899\n12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891", expectedOutput: "<", isVisible: false },
      { input: "10\n9", expectedOutput: ">", isVisible: false },
    ],
    tags: ["큰 수", "문자열"],
  },

  // 6. 큰 정수 진법 변환
  {
    title: "큰 정수 진법 변환",
    description: `최대 10,000자리의 10진수 양의 정수 N과 진법 B가 주어진다. N을 B진법으로 변환하여라. 10 이상의 자리는 A, B, C, D, E, F로 나타낸다.

## 입력

첫째 줄에 10진수 양의 정수 N, 둘째 줄에 목표 진법 B가 주어진다.

- 1 ≤ N의 자릿수 ≤ 10,000
- 2 ≤ B ≤ 16

## 출력

N을 B진법으로 변환한 결과를 출력한다. (알파벳은 대문자)

## 예제 입력 1

\`\`\`
255
16
\`\`\`

## 예제 출력 1

\`\`\`
FF
\`\`\`

## 예제 입력 2

\`\`\`
1000
2
\`\`\`

## 예제 출력 2

\`\`\`
1111101000
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "255\n16", expectedOutput: "FF", isVisible: true },
      { input: "1000\n2", expectedOutput: "1111101000", isVisible: true },
      { input: "1099511627776\n2", expectedOutput: "10000000000000000000000000000000000000000", isVisible: false },
      { input: "1000000000000000000000000000000\n8", expectedOutput: "1447626234640431647336510000000000", isVisible: false },
      { input: "10\n10", expectedOutput: "10", isVisible: false },
    ],
    tags: ["큰 수", "수학"],
  },

  // 7. 큰 팩토리얼의 자릿수
  {
    title: "큰 팩토리얼의 자릿수",
    description: `N이 주어질 때 N!의 자릿수를 구하여라. N!의 전체를 계산하지 않고도 구할 수 있다.

## 입력

첫째 줄에 정수 N이 주어진다.

- 1 ≤ N ≤ 10^7

## 출력

N!의 자릿수를 출력한다.

## 예제 입력 1

\`\`\`
10
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\`

## 예제 입력 2

\`\`\`
100
\`\`\`

## 예제 출력 2

\`\`\`
158
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10", expectedOutput: "7", isVisible: true },
      { input: "100", expectedOutput: "158", isVisible: true },
      { input: "1000", expectedOutput: "2568", isVisible: false },
      { input: "10000", expectedOutput: "35660", isVisible: false },
      { input: "1", expectedOutput: "1", isVisible: false },
    ],
    tags: ["수학"],
  },

  // 8. 큰 수 GCD
  {
    title: "큰 수 GCD",
    description: `최대 1,000자리의 양의 정수 두 개가 주어진다. 두 수의 최대공약수를 구하여라.

## 입력

첫째 줄에 양의 정수 A, 둘째 줄에 양의 정수 B가 주어진다.

- 1 ≤ A, B의 자릿수 ≤ 1,000

## 출력

gcd(A, B)를 출력한다.

## 예제 입력 1

\`\`\`
1234567890123456789012345678901234567890
9876543210987654321098765432109876543210
\`\`\`

## 예제 출력 1

\`\`\`
90000000009000000000900000000090
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1234567890123456789012345678901234567890\n9876543210987654321098765432109876543210", expectedOutput: "90000000009000000000900000000090", isVisible: true },
      { input: "1208925819614629174706176\n1125899906842624", expectedOutput: "1125899906842624", isVisible: false },
      { input: "12\n8", expectedOutput: "4", isVisible: false },
      { input: "1000000000000000000000000000000\n999999999999999999999999999999", expectedOutput: "1", isVisible: false },
    ],
    tags: ["큰 수", "수학"],
  },

  // 9. 큰 피보나치 수
  {
    title: "큰 피보나치 수",
    description: `피보나치 수열의 N번째 수를 구하여라. F(1) = 1, F(2) = 1, F(N) = F(N-1) + F(N-2).

## 입력

첫째 줄에 정수 N이 주어진다.

- 1 ≤ N ≤ 10,000

## 출력

F(N)을 출력한다.

## 예제 입력 1

\`\`\`
10
\`\`\`

## 예제 출력 1

\`\`\`
55
\`\`\`

## 예제 입력 2

\`\`\`
50
\`\`\`

## 예제 출력 2

\`\`\`
12586269025
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10", expectedOutput: "55", isVisible: true },
      { input: "50", expectedOutput: "12586269025", isVisible: true },
      { input: "100", expectedOutput: "354224848179261915075", isVisible: false },
      { input: "200", expectedOutput: "280571172992510140037611932413038677189525", isVisible: false },
      { input: "500", expectedOutput: "139423224561697880139724382870407283950070256587697307264108962948325571622863290691557658876222521294125", isVisible: false },
    ],
    tags: ["큰 수", "수학"],
  },

  // 10. 큰 수 거듭제곱의 나머지
  {
    title: "큰 수 거듭제곱의 나머지",
    description: `A^B mod M을 구하여라. A와 B는 매우 큰 수일 수 있다.

## 입력

첫째 줄에 양의 정수 A, 둘째 줄에 양의 정수 B, 셋째 줄에 정수 M이 주어진다.

- A의 자릿수 ≤ 1,000
- B의 자릿수 ≤ 1,000
- 1 ≤ M ≤ 10^9

## 출력

A^B mod M을 출력한다.

## 예제 입력 1

\`\`\`
123456789
987654321
1000000007
\`\`\`

## 예제 출력 1

\`\`\`
652541198
\`\`\`

## 예제 입력 2

\`\`\`
2
10
1000
\`\`\`

## 예제 출력 2

\`\`\`
24
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "123456789\n987654321\n1000000007", expectedOutput: "652541198", isVisible: true },
      { input: "2\n10\n1000", expectedOutput: "24", isVisible: true },
      { input: "99999999999999999999999999999999999999999999999999\n11111111111111111111111111111111111111111111111111\n998244353", expectedOutput: "115240350", isVisible: false },
      { input: "2\n100\n1000000007", expectedOutput: "976371285", isVisible: false },
      { input: "1\n999999999999999999999999999999\n1000000007", expectedOutput: "1", isVisible: false },
    ],
    tags: ["큰 수", "수학"],
  },

  // ===== 정밀도/오버플로우 함정 (11-20) =====

  // 11. 오버플로우 덧셈
  {
    title: "오버플로우 덧셈",
    description: `N개의 양의 정수가 주어진다. 모든 수의 합을 구하여라. 합이 64비트 정수 범위를 넘을 수 있다.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100,000
- 1 ≤ 각 수 ≤ 10^18

## 출력

N개 수의 합을 출력한다.

## 예제 입력 1

\`\`\`
5
1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000
\`\`\`

## 예제 출력 1

\`\`\`
5000000000000000000
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000", expectedOutput: "5000000000000000000", isVisible: true },
      { input: "3\n1000000000000000000 1000000000000000000 1000000000000000000", expectedOutput: "3000000000000000000", isVisible: false },
      { input: "1\n1000000000000000000", expectedOutput: "1000000000000000000", isVisible: false },
      { input: "10\n1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000 1000000000000000000", expectedOutput: "10000000000000000000", isVisible: false },
    ],
    tags: ["수학", "큰 수"],
  },

  // 12. 오버플로우 곱셈
  {
    title: "오버플로우 곱셈",
    description: `A × B mod M을 구하여라. A, B, M이 모두 최대 10^18이므로 단순히 곱하면 오버플로우가 발생할 수 있다.

## 입력

첫째 줄에 A, B, M이 공백으로 구분되어 주어진다.

- 1 ≤ A, B, M ≤ 10^18

## 출력

A × B mod M을 출력한다.

## 예제 입력 1

\`\`\`
999999999999999999 999999999999999999 1000000000000000009
\`\`\`

## 예제 출력 1

\`\`\`
100
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "999999999999999999 999999999999999999 1000000000000000009", expectedOutput: "100", isVisible: true },
      { input: "998244353 998244353 1000000000000000009", expectedOutput: "996491788296388609", isVisible: false },
      { input: "1 1 1000000000000000000", expectedOutput: "1", isVisible: false },
      { input: "1000000000000000000 1000000000000000000 999999999999999999", expectedOutput: "1", isVisible: false },
    ],
    tags: ["수학"],
  },

  // 13. 부동소수점 비교 함정
  {
    title: "부동소수점 비교 함정",
    description: `N개의 실수가 주어진다. 절댓값 차이가 10^-9 미만인 두 수는 "같은 수"로 본다. 같은 수로 분류되는 쌍의 수를 구하여라.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 실수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 1,000
- 각 실수의 절댓값 ≤ 10^9

## 출력

|a − b| < 10^-9를 만족하는 쌍 (i, j) (i < j)의 수를 출력한다.

## 예제 입력 1

\`\`\`
5
1.0000000001 1.0 2.0 2.0000000001 3.0
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1.0000000001 1.0 2.0 2.0000000001 3.0", expectedOutput: "2", isVisible: true },
      { input: "3\n1.0 1.0 1.0", expectedOutput: "3", isVisible: false },
      { input: "4\n1.0 2.0 3.0 4.0", expectedOutput: "0", isVisible: false },
      { input: "2\n0.0000000001 0.0", expectedOutput: "1", isVisible: false },
    ],
    tags: ["수학"],
  },

  // 14. 넓이 계산 함정
  {
    title: "넓이 계산 함정",
    description: `정수 좌표로 주어진 세 점으로 이루어진 삼각형의 넓이의 2배를 구하여라. 외적을 이용하면 실수 연산 없이 정확히 구할 수 있다.

## 입력

세 점의 좌표 x1, y1, x2, y2, x3, y3이 한 줄에 공백으로 구분되어 주어진다.

- -10^9 ≤ x_i, y_i ≤ 10^9
- 세 점은 일직선 위에 있지 않다.

## 출력

삼각형 넓이의 2배를 정수로 출력한다.

## 예제 입력 1

\`\`\`
0 0 4 0 0 3
\`\`\`

## 예제 출력 1

\`\`\`
12
\`\`\`

## 예제 입력 2

\`\`\`
1 1 4 1 1 5
\`\`\`

## 예제 출력 2

\`\`\`
12
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "0 0 4 0 0 3", expectedOutput: "12", isVisible: true },
      { input: "1 1 4 1 1 5", expectedOutput: "12", isVisible: true },
      { input: "0 0 1000000000 0 0 1000000000", expectedOutput: "1000000000000000000", isVisible: false },
      { input: "-1000000000 -1000000000 1000000000 -1000000000 0 1000000000", expectedOutput: "4000000000000000000", isVisible: false },
      { input: "0 0 3 0 0 4", expectedOutput: "12", isVisible: false },
    ],
    tags: ["수학", "기하"],
  },

  // 15. 중간값 오버플로우
  {
    title: "중간값 오버플로우",
    description: `정렬된 N개의 정수 배열에서 값 X 이상인 첫 번째 위치(lower bound)를 구하여라. 이분 탐색 구현 시 중간값 계산에 주의하여라.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 정렬된 정수, 셋째 줄에 X가 주어진다.

- 1 ≤ N ≤ 1,000,000
- 각 수의 범위: 1 ≤ 각 수 ≤ 2 × 10^9
- 1 ≤ X ≤ 2 × 10^9

## 출력

X 이상인 첫 번째 위치를 1-인덱스로 출력한다. 없으면 N+1을 출력한다.

## 예제 입력 1

\`\`\`
5
1 3 5 7 9
5
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
5
1 3 5 7 9
6
\`\`\`

## 예제 출력 2

\`\`\`
4
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 3 5 7 9\n5", expectedOutput: "3", isVisible: true },
      { input: "5\n1 3 5 7 9\n6", expectedOutput: "4", isVisible: true },
      { input: "5\n1 3 5 7 9\n10", expectedOutput: "6", isVisible: false },
      { input: "5\n1 3 5 7 9\n0", expectedOutput: "1", isVisible: false },
      { input: "3\n2000000000 2000000000 2000000000\n2000000000", expectedOutput: "1", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  // 16. 카운팅 오버플로우
  {
    title: "카운팅 오버플로우",
    description: `N×M 격자의 왼쪽 위 칸 (1, 1)에서 오른쪽 아래 칸 (N, M)까지, 오른쪽 또는 아래로만 이동하는 경로의 수를 10^9+7로 나눈 나머지를 구하여라.

## 입력

첫째 줄에 N, M이 공백으로 구분되어 주어진다.

- 1 ≤ N, M ≤ 1,000

## 출력

경로의 수를 1,000,000,007(10^9+7)로 나눈 나머지를 출력한다.

## 예제 입력 1

\`\`\`
3 3
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\`

## 예제 입력 2

\`\`\`
10 10
\`\`\`

## 예제 출력 2

\`\`\`
48620
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 3", expectedOutput: "6", isVisible: true },
      { input: "10 10", expectedOutput: "48620", isVisible: true },
      { input: "1000 1000", expectedOutput: "159030280", isVisible: false },
      { input: "1 1", expectedOutput: "1", isVisible: false },
      { input: "2 2", expectedOutput: "2", isVisible: false },
    ],
    tags: ["DP", "수학"],
  },

  // 17. 실수 출력 정밀도
  {
    title: "실수 출력 정밀도",
    description: `반지름이 r인 원의 넓이를 구하여라. π의 값을 충분한 정밀도로 사용해야 한다.

## 입력

첫째 줄에 정수 r이 주어진다.

- 1 ≤ r ≤ 10^9

## 출력

원의 넓이를 소수점 아래 6자리까지 출력한다.

## 예제 입력 1

\`\`\`
7
\`\`\`

## 예제 출력 1

\`\`\`
153.938040
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.000001,
    testCases: [
      { input: "7", expectedOutput: "153.938040", isVisible: true },
      { input: "1", expectedOutput: "3.141593", isVisible: false },
      { input: "10", expectedOutput: "314.159265", isVisible: false },
      { input: "1000000000", expectedOutput: "3141592653589793.000000", isVisible: false },
    ],
    tags: ["수학"],
  },

  // 18. 음수 나머지 함정
  {
    title: "음수 나머지 함정",
    description: `A mod B를 구하여라. 결과는 항상 0 이상이어야 한다. 언어마다 음수의 나머지 동작이 다를 수 있으므로 주의하여라.

## 입력

첫째 줄에 A, B가 공백으로 구분되어 주어진다.

- -10^18 ≤ A ≤ 10^18
- 1 ≤ B ≤ 10^9

## 출력

A를 B로 나눈 나머지를 출력한다. 결과는 0 이상 B 미만이다.

## 예제 입력 1

\`\`\`
-7 3
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\`

## 예제 입력 2

\`\`\`
7 3
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "-7 3", expectedOutput: "2", isVisible: true },
      { input: "7 3", expectedOutput: "1", isVisible: true },
      { input: "-1 1000000000", expectedOutput: "999999999", isVisible: false },
      { input: "-1000000000000000000 1000000000", expectedOutput: "0", isVisible: false },
      { input: "0 7", expectedOutput: "0", isVisible: false },
    ],
    tags: ["수학"],
  },

  // 19. 좌표 정렬 안정성
  {
    title: "좌표 정렬 안정성",
    description: `N개의 점 (x, y)가 주어진다. x 좌표 오름차순으로 정렬하되, x가 같으면 입력 순서를 유지하여 출력하여라. 불안정 정렬을 사용하면 오답이 된다.

## 입력

첫째 줄에 N, 이후 N개의 줄에 각각 x, y 좌표가 주어진다.

- 1 ≤ N ≤ 100,000
- -10^9 ≤ x, y ≤ 10^9

## 출력

정렬된 순서로 각 점의 x, y 좌표를 출력한다.

## 예제 입력 1

\`\`\`
4
3 2
1 5
3 1
1 3
\`\`\`

## 예제 출력 1

\`\`\`
1 5
1 3
3 2
3 1
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n3 2\n1 5\n3 1\n1 3", expectedOutput: "1 5\n1 3\n3 2\n3 1", isVisible: true },
      { input: "1\n5 5", expectedOutput: "5 5", isVisible: false },
      { input: "3\n2 1\n2 3\n2 2", expectedOutput: "2 1\n2 3\n2 2", isVisible: false },
      { input: "5\n3 1\n1 1\n2 1\n1 2\n3 2", expectedOutput: "1 1\n1 2\n2 1\n3 1\n3 2", isVisible: false },
    ],
    tags: ["정렬"],
  },

  // 20. 해시 충돌
  {
    title: "해시 충돌",
    description: `N개의 문자열이 주어진다. 서로 다른 문자열의 수를 구하여라. 단순한 해시만 사용하면 충돌로 인해 오답이 발생할 수 있다.

## 입력

첫째 줄에 N, 이후 N개의 줄에 각각 문자열이 주어진다.

- 1 ≤ N ≤ 100,000
- 각 문자열의 길이 ≤ 100
- 문자열은 소문자 알파벳으로만 구성된다.

## 출력

서로 다른 문자열의 수를 출력한다.

## 예제 입력 1

\`\`\`
7
apple
banana
apple
cherry
banana
date
cherry
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7\napple\nbanana\napple\ncherry\nbanana\ndate\ncherry", expectedOutput: "4", isVisible: true },
      { input: "3\nabc\nabc\nabc", expectedOutput: "1", isVisible: false },
      { input: "3\na\nb\nc", expectedOutput: "3", isVisible: false },
      { input: "5\nabcdefghijklmnopqrstuvwxyz\nabcdefghijklmnopqrstuvwxyz\nabcdefghijklmnopqrstuvwxyy\nzyxwvutsrqponmlkjihgfedcba\na", expectedOutput: "4", isVisible: false },
    ],
    tags: ["문자열"],
  },

  // ===== 정렬/탐색 함정 (21-28) =====

  // 21. 퀵소트 킬러
  {
    title: "퀵소트 킬러",
    description: `N개의 정수를 오름차순으로 정렬하여라. 테스트 데이터에는 역순 정렬, 동일한 값의 대량 입력 등이 포함된다. 단순한 퀵소트 구현은 최악의 경우 O(N^2)이 된다.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 5,000,000
- -10^9 ≤ 각 수 ≤ 10^9

## 출력

정렬된 수를 공백으로 구분하여 출력한다.

## 예제 입력 1

\`\`\`
5
3 1 4 1 5
\`\`\`

## 예제 출력 1

\`\`\`
1 1 3 4 5
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 5000,
    memoryLimitMb: 512,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "1 1 3 4 5", isVisible: true },
      { input: "10\n10 9 8 7 6 5 4 3 2 1", expectedOutput: "1 2 3 4 5 6 7 8 9 10", isVisible: false },
      { input: "7\n1 1 1 1 1 1 1", expectedOutput: "1 1 1 1 1 1 1", isVisible: false },
      { input: "6\n5 4 3 2 1 0", expectedOutput: "0 1 2 3 4 5", isVisible: false },
    ],
    tags: ["정렬"],
  },

  // 22. 안정 정렬 필수
  {
    title: "안정 정렬 필수",
    description: `N명의 (이름, 나이) 쌍이 주어진다. 나이 오름차순으로 정렬하되, 나이가 같으면 입력 순서를 유지하여 이름을 출력하여라. 불안정 정렬을 사용하면 오답이 된다.

## 입력

첫째 줄에 N, 이후 N개의 줄에 이름과 나이가 공백으로 주어진다.

- 1 ≤ N ≤ 100,000
- 이름은 알파벳 대소문자로 구성, 길이 ≤ 20
- 1 ≤ 나이 ≤ 200

## 출력

정렬된 순서대로 이름을 한 줄씩 출력한다.

## 예제 입력 1

\`\`\`
5
Alice 30
Bob 25
Charlie 30
Dave 25
Eve 20
\`\`\`

## 예제 출력 1

\`\`\`
Eve
Bob
Dave
Alice
Charlie
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\nAlice 30\nBob 25\nCharlie 30\nDave 25\nEve 20", expectedOutput: "Eve\nBob\nDave\nAlice\nCharlie", isVisible: true },
      { input: "1\nAlice 20", expectedOutput: "Alice", isVisible: false },
      { input: "3\nA 5\nB 5\nC 5", expectedOutput: "A\nB\nC", isVisible: false },
      { input: "4\nD 4\nC 3\nB 2\nA 1", expectedOutput: "A\nB\nC\nD", isVisible: false },
    ],
    tags: ["정렬"],
  },

  // 23. 이분 탐색 경계
  {
    title: "이분 탐색 경계",
    description: `정렬된 N개의 수에서 X 이상인 첫 번째 위치(lower bound)를 구하여라. 이분 탐색 경계 조건 처리에 주의하여라.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 정렬된 정수, 셋째 줄에 X가 주어진다.

- 1 ≤ N ≤ 1,000,000
- -10^9 ≤ 각 수 ≤ 10^9
- -10^9 ≤ X ≤ 10^9

## 출력

X 이상인 첫 번째 위치를 1-인덱스로 출력한다. 없으면 N+1을 출력한다.

## 예제 입력 1

\`\`\`
6
1 3 5 7 9 11
5
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
6
1 3 5 7 9 11
12
\`\`\`

## 예제 출력 2

\`\`\`
7
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n1 3 5 7 9 11\n5", expectedOutput: "3", isVisible: true },
      { input: "6\n1 3 5 7 9 11\n12", expectedOutput: "7", isVisible: true },
      { input: "6\n1 3 5 7 9 11\n6", expectedOutput: "4", isVisible: false },
      { input: "6\n1 3 5 7 9 11\n0", expectedOutput: "1", isVisible: false },
      { input: "3\n5 5 5\n5", expectedOutput: "1", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  // 24. 역순 정렬 함정
  {
    title: "역순 정렬 함정",
    description: `N개의 정수를 오름차순으로 정렬하여라. 입력 데이터는 내림차순으로 정렬되어 있을 수 있다. 단순한 퀵소트로는 최악의 O(N^2)이 발생한다.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 1,000,000
- -10^9 ≤ 각 수 ≤ 10^9

## 출력

정렬된 수를 공백으로 구분하여 출력한다.

## 예제 입력 1

\`\`\`
5
5 4 3 2 1
\`\`\`

## 예제 출력 1

\`\`\`
1 2 3 4 5
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n5 4 3 2 1", expectedOutput: "1 2 3 4 5", isVisible: true },
      { input: "1\n42", expectedOutput: "42", isVisible: false },
      { input: "3\n3 2 1", expectedOutput: "1 2 3", isVisible: false },
      { input: "6\n1000000000 999999999 3 2 1 0", expectedOutput: "0 1 2 3 999999999 1000000000", isVisible: false },
    ],
    tags: ["정렬"],
  },

  // 25. K번째 수 (중복 있음)
  {
    title: "K번째 수 (중복 있음)",
    description: `N개의 정수에서 K번째로 작은 수를 구하여라. 중복된 수도 각각 별개로 센다.

## 입력

첫째 줄에 N과 K, 둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ K ≤ N ≤ 5,000,000
- -10^9 ≤ 각 수 ≤ 10^9

## 출력

K번째로 작은 수를 출력한다.

## 예제 입력 1

\`\`\`
11 4
3 1 4 1 5 9 2 6 5 3 5
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 5000,
    memoryLimitMb: 512,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "11 4\n3 1 4 1 5 9 2 6 5 3 5", expectedOutput: "3", isVisible: true },
      { input: "5 1\n5 4 3 2 1", expectedOutput: "1", isVisible: false },
      { input: "5 5\n5 4 3 2 1", expectedOutput: "5", isVisible: false },
      { input: "5 3\n1 1 1 1 1", expectedOutput: "1", isVisible: false },
    ],
    tags: ["정렬"],
  },

  // 26. 카운팅 소트
  {
    title: "카운팅 소트",
    description: `N개의 정수를 오름차순으로 정렬하여라. 수의 범위가 0 이상 10,000 이하이므로 카운팅 정렬을 활용해야 한다. 비교 기반 정렬로는 시간 초과가 발생한다.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 10,000,000
- 0 ≤ 각 수 ≤ 10,000

## 출력

정렬된 수를 공백으로 구분하여 출력한다.

## 예제 입력 1

\`\`\`
8
5 3 1 4 2 3 5 1
\`\`\`

## 예제 출력 1

\`\`\`
1 1 2 3 3 4 5 5
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 512,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "8\n5 3 1 4 2 3 5 1", expectedOutput: "1 1 2 3 3 4 5 5", isVisible: true },
      { input: "1\n0", expectedOutput: "0", isVisible: false },
      { input: "5\n10000 0 5000 1 9999", expectedOutput: "0 1 5000 9999 10000", isVisible: false },
      { input: "6\n3 3 3 3 3 3", expectedOutput: "3 3 3 3 3 3", isVisible: false },
    ],
    tags: ["정렬"],
  },

  // 27. 삼진 탐색
  {
    title: "삼진 탐색",
    description: `단봉 함수 f(x) = -(x-C)^2 + V (단봉, 즉 극댓값이 하나)가 정수 구간 [L, R]에서 정의된다. C와 V는 알려주지 않는다. 삼분 탐색으로 최댓값의 위치를 구하여라.

## 입력

첫째 줄에 L, R이 공백으로 주어진다. 둘째 줄에 함수의 매개변수 C, V가 주어진다.

- 0 ≤ L < R ≤ 10^9
- L ≤ C ≤ R
- 1 ≤ V ≤ 10^18

## 출력

f(x)가 최대인 정수 x를 출력한다. 최댓값이 여러 위치에서 나타나면 가장 작은 x를 출력한다.

## 예제 입력 1

\`\`\`
0 20
7 100
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "0 20\n7 100", expectedOutput: "7", isVisible: true },
      { input: "0 1000000000\n500000000 1000000000000000000", expectedOutput: "500000000", isVisible: false },
      { input: "0 10\n0 50", expectedOutput: "0", isVisible: false },
      { input: "5 15\n10 200", expectedOutput: "10", isVisible: false },
    ],
    tags: ["탐색", "수학"],
  },

  // 28. 정렬 후 이분 탐색 조합
  {
    title: "정렬 후 이분 탐색 조합",
    description: `N개의 정수에서 두 수의 합이 정확히 X인 쌍 (i, j) (i < j)의 수를 구하여라.

## 입력

첫째 줄에 N과 X, 둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100,000
- -10^9 ≤ 각 수, X ≤ 10^9

## 출력

합이 X인 쌍의 수를 출력한다.

## 예제 입력 1

\`\`\`
7 8
1 2 3 4 5 6 7
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
5 5
1 1 2 3 4
\`\`\`

## 예제 출력 2

\`\`\`
3
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7 8\n1 2 3 4 5 6 7", expectedOutput: "3", isVisible: true },
      { input: "5 5\n1 1 2 3 4", expectedOutput: "3", isVisible: true },
      { input: "4 0\n-1 1 -2 2", expectedOutput: "2", isVisible: false },
      { input: "3 10\n1 2 3", expectedOutput: "0", isVisible: false },
      { input: "4 6\n3 3 3 3", expectedOutput: "6", isVisible: false },
    ],
    tags: ["정렬", "이분 탐색"],
  },

  // ===== TLE 유도 문제 (29-38) =====

  // 29. 소수 판별 (대용량)
  {
    title: "소수 판별 (대용량)",
    description: `T개의 수가 주어진다. 각 수가 소수인지 판별하여라. N이 최대 10^12이므로 밀러-라빈 소수 판별법이 필요하다.

## 입력

첫째 줄에 T, 이후 T개의 줄에 각각 N이 주어진다.

- 1 ≤ T ≤ 10
- 2 ≤ N ≤ 10^12

## 출력

각 N에 대해 소수이면 YES, 아니면 NO를 출력한다.

## 예제 입력 1

\`\`\`
3
999999999989
1000000000000
998244353
\`\`\`

## 예제 출력 1

\`\`\`
YES
NO
YES
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n999999999989\n1000000000000\n998244353", expectedOutput: "YES\nNO\nYES", isVisible: true },
      { input: "2\n2\n4", expectedOutput: "YES\nNO", isVisible: false },
      { input: "3\n1000000000039\n1000000000061\n999999999999", expectedOutput: "YES\nYES\nNO", isVisible: false },
      { input: "1\n100000000003", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["수학", "정수론"],
  },

  // 30. 구간 합 (빈번한 갱신)
  {
    title: "구간 합 (빈번한 갱신)",
    description: `N개의 수에 대해 M개의 갱신과 K개의 구간 합 쿼리를 처리하여라. 누적합 방식으로는 시간 초과가 발생한다.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 초기 값, 셋째 줄에 M+K, 이후 M+K개의 줄에 쿼리가 주어진다.

- 갱신: \`U i v\` (i번째 수를 v로 변경)
- 쿼리: \`Q l r\` (l부터 r까지의 합)

제약:
- 1 ≤ N ≤ 500,000
- M+K ≤ 500,000 (M: 갱신 수, K: 쿼리 수)
- 1 ≤ i ≤ N, -10^9 ≤ v ≤ 10^9
- 1 ≤ l ≤ r ≤ N

## 출력

각 Q 쿼리의 결과를 한 줄씩 출력한다.

## 예제 입력 1

\`\`\`
10
1 2 3 4 5 6 7 8 9 10
4
Q 2 5
U 3 8
Q 2 5
Q 1 10
\`\`\`

## 예제 출력 1

\`\`\`
14
19
60
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10\n1 2 3 4 5 6 7 8 9 10\n4\nQ 2 5\nU 3 8\nQ 2 5\nQ 1 10", expectedOutput: "14\n19\n60", isVisible: true },
      { input: "3\n1 2 3\n2\nQ 1 3\nU 2 10", expectedOutput: "6", isVisible: false },
      { input: "5\n0 0 0 0 0\n3\nU 3 5\nQ 1 5\nQ 3 3", expectedOutput: "5\n5", isVisible: false },
    ],
    tags: ["자료구조", "세그먼트 트리"],
  },

  // 31. 최장 증가 수열 (대용량)
  {
    title: "최장 증가 수열 (대용량)",
    description: `N개의 정수가 주어진다. 가장 긴 증가하는 부분 수열(LIS)의 길이를 구하여라. O(N^2)로는 시간 초과가 발생한다.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 1,000,000
- -10^9 ≤ 각 수 ≤ 10^9

## 출력

LIS의 길이를 출력한다.

## 예제 입력 1

\`\`\`
11
3 1 4 1 5 9 2 6 5 3 5
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\`

## 예제 입력 2

\`\`\`
8
10 9 2 5 3 7 101 18
\`\`\`

## 예제 출력 2

\`\`\`
4
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "11\n3 1 4 1 5 9 2 6 5 3 5", expectedOutput: "4", isVisible: true },
      { input: "8\n10 9 2 5 3 7 101 18", expectedOutput: "4", isVisible: true },
      { input: "5\n1 2 3 4 5", expectedOutput: "5", isVisible: false },
      { input: "5\n5 4 3 2 1", expectedOutput: "1", isVisible: false },
      { input: "1\n100", expectedOutput: "1", isVisible: false },
    ],
    tags: ["DP", "이분 탐색"],
  },

  // 32. 최단 경로 (밀집 그래프)
  {
    title: "최단 경로 (밀집 그래프)",
    description: `V개의 정점과 E개의 무방향 가중치 간선으로 이루어진 그래프에서 정점 1로부터 모든 정점까지의 최단 거리를 구하여라.

## 입력

첫째 줄에 V, E, 이후 E개의 줄에 간선 정보 u, v, w가 주어진다.

- 1 ≤ V ≤ 3,000
- 1 ≤ E ≤ V × (V-1) / 2
- 1 ≤ u, v ≤ V, 1 ≤ w ≤ 10^6
- 도달 불가능한 정점은 없다.

## 출력

1번 정점으로부터 각 정점까지의 최단 거리를 1번 정점부터 순서대로 출력한다.

## 예제 입력 1

\`\`\`
5 6
1 2 4
1 3 1
2 4 1
3 2 2
3 4 5
4 5 3
\`\`\`

## 예제 출력 1

\`\`\`
0 3 1 4 7
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 6\n1 2 4\n1 3 1\n2 4 1\n3 2 2\n3 4 5\n4 5 3", expectedOutput: "0 3 1 4 7", isVisible: true },
      { input: "2 1\n1 2 10", expectedOutput: "0 10", isVisible: false },
      { input: "3 3\n1 2 1\n2 3 1\n1 3 10", expectedOutput: "0 1 2", isVisible: false },
      { input: "4 4\n1 2 5\n1 3 2\n3 2 1\n2 4 3", expectedOutput: "0 3 2 6", isVisible: false },
    ],
    tags: ["그래프", "다익스트라"],
  },

  // 33. 문자열 매칭 (대용량)
  {
    title: "문자열 매칭 (대용량)",
    description: `텍스트 T에서 패턴 P가 몇 번 등장하는지 구하여라. 겹치는 것도 카운트한다. 단순 비교로는 시간 초과가 발생한다.

## 입력

첫째 줄에 텍스트 T, 둘째 줄에 패턴 P가 주어진다.

- 1 ≤ |P| ≤ |T| ≤ 10^7
- T, P는 소문자 알파벳으로만 구성된다.

## 출력

P가 T에서 등장하는 횟수를 출력한다.

## 예제 입력 1

\`\`\`
ababcabab
abab
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\`

## 예제 입력 2

\`\`\`
aaaaaa
aa
\`\`\`

## 예제 출력 2

\`\`\`
5
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "ababcabab\nabab", expectedOutput: "2", isVisible: true },
      { input: "aaaaaa\naa", expectedOutput: "5", isVisible: true },
      { input: "abcabcabc\nabc", expectedOutput: "3", isVisible: false },
      { input: "abcdef\nxyz", expectedOutput: "0", isVisible: false },
      { input: "aaaaaaaaaa\na", expectedOutput: "10", isVisible: false },
    ],
    tags: ["문자열", "KMP"],
  },

  // 34. 행렬 곱셈 최적화
  {
    title: "행렬 곱셈 최적화",
    description: `N×N 행렬 M의 K제곱을 구하여라. K가 최대 10^18이므로 행렬 빠른 거듭제곱을 사용해야 한다. 결과의 각 원소는 10^9+7로 나눈 나머지를 출력한다.

## 입력

첫째 줄에 N, K, 이후 N개의 줄에 행렬의 각 행이 주어진다.

- 1 ≤ N ≤ 5
- 1 ≤ K ≤ 10^18
- 0 ≤ 각 원소 ≤ 10^9

## 출력

M^K mod (10^9+7)의 각 행을 공백으로 구분하여 출력한다.

## 예제 입력 1

\`\`\`
2 3
1 2
3 4
\`\`\`

## 예제 출력 1

\`\`\`
37 54
81 118
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 3\n1 2\n3 4", expectedOutput: "37 54\n81 118", isVisible: true },
      { input: "1 1000000000000000000\n2", expectedOutput: "801948722", isVisible: false },
      { input: "2 1\n1 0\n0 1", expectedOutput: "1 0\n0 1", isVisible: false },
      { input: "2 1000000000000000000\n1 1\n0 1", expectedOutput: "1 1000000000000000000\n0 1".replace("1000000000000000000", String(1000000000000000000n % 1000000007n)), isVisible: false },
    ],
    tags: ["수학", "분할 정복"],
  },

  // 35. 2D 구간 합
  {
    title: "2D 구간 합",
    description: `N×N 격자의 각 칸에 값이 있다. Q개의 직사각형 구간 합 쿼리를 처리하여라.

## 입력

첫째 줄에 N, 이후 N개의 줄에 각 행의 값, 그 다음 줄에 Q, 이후 Q개의 줄에 r1 c1 r2 c2가 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ Q ≤ 100,000
- -10^6 ≤ 각 값 ≤ 10^6
- 1 ≤ r1 ≤ r2 ≤ N, 1 ≤ c1 ≤ c2 ≤ N

## 출력

각 쿼리의 결과를 한 줄씩 출력한다.

## 예제 입력 1

\`\`\`
3
1 2 3 4
5 6 7 8
9 10 11 12
2
1 1 2 2
2 3 3 4
\`\`\`

## 예제 출력 1

\`\`\`
14
38
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 2 3 4\n5 6 7 8\n9 10 11 12\n2\n1 1 2 2\n2 3 3 4", expectedOutput: "14\n38", isVisible: true },
      { input: "2\n1 2\n3 4\n1\n1 1 2 2", expectedOutput: "10", isVisible: false },
      { input: "1\n42\n1\n1 1 1 1", expectedOutput: "42", isVisible: false },
      { input: "3\n1 2 3 4\n5 6 7 8\n9 10 11 12\n1\n1 1 3 4", expectedOutput: "78", isVisible: false },
    ],
    tags: ["DP", "구현"],
  },

  // 36. N개의 수에서 합이 0인 세 쌍
  {
    title: "합이 0인 세 쌍",
    description: `N개의 정수에서 세 수의 합이 0인 쌍 (i, j, k) (i < j < k)의 수를 구하여라.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다.

- 3 ≤ N ≤ 5,000
- -10^6 ≤ 각 수 ≤ 10^6

## 출력

세 수의 합이 0인 쌍의 수를 출력한다.

## 예제 입력 1

\`\`\`
6
-1 0 1 2 -1 -4
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
4
0 0 0 0
\`\`\`

## 예제 출력 2

\`\`\`
4
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n-1 0 1 2 -1 -4", expectedOutput: "3", isVisible: true },
      { input: "4\n0 0 0 0", expectedOutput: "4", isVisible: true },
      { input: "3\n1 2 3", expectedOutput: "0", isVisible: false },
      { input: "5\n-2 -1 0 1 2", expectedOutput: "2", isVisible: false },
      { input: "3\n0 0 0", expectedOutput: "1", isVisible: false },
    ],
    tags: ["정렬", "투 포인터"],
  },

  // 37. 최소 공통 조상 (대용량)
  {
    title: "최소 공통 조상 (대용량)",
    description: `N개의 정점으로 이루어진 트리에서 Q개의 LCA(최소 공통 조상) 쿼리를 처리하여라. 희소 테이블(Sparse Table) LCA를 사용해야 한다.

## 입력

첫째 줄에 N, 이후 N-1개의 줄에 간선 정보 u, v, 그 다음 줄에 Q, 이후 Q개의 줄에 u, v가 주어진다.

- 1 ≤ N ≤ 100,000
- 1 ≤ Q ≤ 100,000
- 루트는 1번 정점이다.

## 출력

각 LCA 쿼리의 결과를 한 줄씩 출력한다.

## 예제 입력 1

\`\`\`
7
1 2
1 3
1 4
2 5
2 6
4 7
3
5 6
5 7
2 7
\`\`\`

## 예제 출력 1

\`\`\`
2
1
1
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7\n1 2\n1 3\n1 4\n2 5\n2 6\n4 7\n3\n5 6\n5 7\n2 7", expectedOutput: "2\n1\n1", isVisible: true },
      { input: "3\n1 2\n2 3\n1\n1 3", expectedOutput: "1", isVisible: false },
      { input: "5\n1 2\n1 3\n2 4\n2 5\n2\n4 5\n3 4", expectedOutput: "2\n1", isVisible: false },
    ],
    tags: ["그래프", "트리", "LCA"],
  },

  // 38. 구간 최솟값 (오프라인)
  {
    title: "구간 최솟값 쿼리",
    description: `N개의 수에 대해 Q개의 구간 최솟값 쿼리를 처리하여라. 세그먼트 트리 또는 희소 테이블을 사용하여라.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 정수, 셋째 줄에 Q, 이후 Q개의 줄에 l, r이 주어진다.

- 1 ≤ N ≤ 500,000
- 1 ≤ Q ≤ 500,000
- -10^9 ≤ 각 수 ≤ 10^9
- 1 ≤ l ≤ r ≤ N

## 출력

각 쿼리의 구간 최솟값을 한 줄씩 출력한다.

## 예제 입력 1

\`\`\`
10
2 4 3 1 6 7 8 9 1 7
3
1 10
3 6
1 3
\`\`\`

## 예제 출력 1

\`\`\`
1
1
2
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10\n2 4 3 1 6 7 8 9 1 7\n3\n1 10\n3 6\n1 3", expectedOutput: "1\n1\n2", isVisible: true },
      { input: "5\n3 1 4 1 5\n2\n1 5\n2 4", expectedOutput: "1\n1", isVisible: false },
      { input: "3\n5 3 7\n3\n1 1\n2 2\n3 3", expectedOutput: "5\n3\n7", isVisible: false },
      { input: "4\n-5 10 -3 7\n2\n1 4\n2 3", expectedOutput: "-5\n-3", isVisible: false },
    ],
    tags: ["자료구조"],
  },

  // ===== 까다로운 구현 (39-50) =====

  // 39. 달팽이 수열 (직사각형)
  {
    title: "달팽이 수열 (직사각형)",
    description: `N×M 직사각형을 달팽이(나선형) 순서로 1부터 N×M까지 채운 결과를 출력하여라.

## 입력

첫째 줄에 N, M이 공백으로 구분되어 주어진다.

- 1 ≤ N, M ≤ 1,000

## 출력

N×M 행렬을 달팽이 순서로 채운 결과를 출력한다.

## 예제 입력 1

\`\`\`
3 4
\`\`\`

## 예제 출력 1

\`\`\`
1 2 3 4
10 11 12 5
9 8 7 6
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4", expectedOutput: "1 2 3 4\n10 11 12 5\n9 8 7 6", isVisible: true },
      { input: "4 3", expectedOutput: "1 2 3\n10 11 4\n9 12 5\n8 7 6", isVisible: false },
      { input: "1 1", expectedOutput: "1", isVisible: false },
      { input: "1 5", expectedOutput: "1 2 3 4 5", isVisible: false },
      { input: "5 1", expectedOutput: "1\n2\n3\n4\n5", isVisible: false },
    ],
    tags: ["구현", "시뮬레이션"],
  },

  // 40. 테트리스 시뮬레이션
  {
    title: "테트리스 시뮬레이션",
    description: `너비 W인 테트리스 보드에 H개의 블록을 순서대로 떨어뜨린다. 블록은 5종류이다.

- I: 1×4 세로 블록 (1칸 차지, 4칸 높이)
- O: 2×2 블록 (2칸 차지)
- L: 오른쪽 방향 L모양 (2칸 너비, 왼쪽 1칸 높이 2, 오른쪽 1칸 높이 1)
- J: 왼쪽 방향 J모양 (2칸 너비, 왼쪽 1칸 높이 1, 오른쪽 1칸 높이 2)
- T: 3칸 너비, 중앙 1칸이 1칸 더 위로 올라온 T 모양

각 블록을 지정된 열(가장 왼쪽 열 기준, 1-인덱스)에 떨어뜨린 후 최대 높이를 구하여라.

## 입력

첫째 줄에 W, H, 이후 H개의 줄에 블록 종류와 열 번호가 주어진다.

- 1 ≤ W ≤ 10
- 1 ≤ H ≤ 10,000
- 블록이 보드 밖으로 나가는 경우는 없다.

## 출력

H개의 블록을 모두 놓은 후 최대 높이를 출력한다.

## 예제 입력 1

\`\`\`
5 3
I 1
O 2
I 1
\`\`\`

## 예제 출력 1

\`\`\`
8
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3\nI 1\nO 2\nI 1", expectedOutput: "8", isVisible: true },
      { input: "4 2\nO 1\nO 3", expectedOutput: "2", isVisible: false },
      { input: "5 4\nT 1\nT 1\nI 5\nO 3", expectedOutput: "6", isVisible: false },
      { input: "10 2\nI 1\nI 2", expectedOutput: "4", isVisible: false },
    ],
    tags: ["시뮬레이션"],
  },

  // 41. 큰 수 연산 계산기
  {
    title: "큰 수 연산 계산기",
    description: `최대 1,000자리의 수들에 대한 +, -, * 혼합 수식을 계산하여라. 괄호를 포함할 수 있다. 연산자 우선순위: * > +, -.

## 입력

수식이 한 줄로 주어진다.

- 수식의 길이 ≤ 10,000
- 수는 양의 정수 (각 수의 자릿수 ≤ 1,000)
- 연산자: +, -, *
- 괄호: (, )
- 공백 없음

## 출력

계산 결과를 출력한다.

## 예제 입력 1

\`\`\`
(123456789012345678901234567890+987654321098765432109876543210)*2
\`\`\`

## 예제 출력 1

\`\`\`
2222222220222222222022222222200
\`\`\`

## 예제 입력 2

\`\`\`
3+5*2
\`\`\`

## 예제 출력 2

\`\`\`
13
\`\`\``,
    difficulty: 8.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "(123456789012345678901234567890+987654321098765432109876543210)*2", expectedOutput: "2222222220222222222022222222200", isVisible: true },
      { input: "3+5*2", expectedOutput: "13", isVisible: true },
      { input: "(3+5)*2", expectedOutput: "16", isVisible: false },
      { input: "999999999999999999999+1", expectedOutput: "1000000000000000000000", isVisible: false },
      { input: "100000000000000000000*100000000000000000000", expectedOutput: "10000000000000000000000000000000000000000", isVisible: false },
    ],
    tags: ["큰 수", "구현"],
  },

  // 42. 비트 연산 퍼즐
  {
    title: "비트 연산 퍼즐",
    description: `N (0 ≤ N ≤ 2^64 − 1)이 주어질 때, N의 이진 표현에서 가장 높은 자리에 있는 1의 위치를 구하여라. N = 0이면 -1을 출력한다.

## 입력

첫째 줄에 N이 주어진다. (부호 없는 64비트 정수)

- 0 ≤ N ≤ 2^64 − 1

## 출력

최상위 비트의 위치를 출력한다. (0-인덱스, 최하위 비트가 0번)

## 예제 입력 1

\`\`\`
64
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\`

## 예제 입력 2

\`\`\`
255
\`\`\`

## 예제 출력 2

\`\`\`
7
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "64", expectedOutput: "6", isVisible: true },
      { input: "255", expectedOutput: "7", isVisible: true },
      { input: "1", expectedOutput: "0", isVisible: false },
      { input: "0", expectedOutput: "-1", isVisible: false },
      { input: "9223372036854775808", expectedOutput: "63", isVisible: false },
    ],
    tags: ["비트마스크"],
  },

  // 43. 좌표 압축 + 스위핑
  {
    title: "직사각형 합집합 넓이",
    description: `N개의 축에 정렬된 직사각형이 주어진다. 직사각형들의 합집합 넓이를 구하여라. 좌표 압축 후 라인 스위핑을 사용해야 한다.

## 입력

첫째 줄에 N, 이후 N개의 줄에 각 직사각형의 x1 y1 x2 y2가 주어진다. (왼쪽 아래 – 오른쪽 위 순서)

- 1 ≤ N ≤ 10,000
- -10^9 ≤ x1 < x2 ≤ 10^9
- -10^9 ≤ y1 < y2 ≤ 10^9

## 출력

합집합 넓이를 출력한다.

## 예제 입력 1

\`\`\`
2
0 0 2 2
1 1 3 3
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\`

## 예제 입력 2

\`\`\`
2
0 0 2 2
2 0 4 2
\`\`\`

## 예제 출력 2

\`\`\`
8
\`\`\``,
    difficulty: 8.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n0 0 2 2\n1 1 3 3", expectedOutput: "7", isVisible: true },
      { input: "2\n0 0 2 2\n2 0 4 2", expectedOutput: "8", isVisible: true },
      { input: "1\n0 0 5 5", expectedOutput: "25", isVisible: false },
      { input: "2\n0 0 3 3\n1 1 2 2", expectedOutput: "9", isVisible: false },
      { input: "3\n0 0 2 2\n1 1 3 3\n2 2 4 4", expectedOutput: "11", isVisible: false },
    ],
    tags: ["기하", "자료구조"],
  },

  // 44. 수식 파싱
  {
    title: "수식 파싱",
    description: `사칙연산 (+, -, *, /)과 괄호가 포함된 정수 수식을 계산하여라. 연산자 우선순위(*/가 +-보다 높음)를 적용한다. 수는 음수일 수 있다. 정수 나눗셈은 0 방향 절사(truncation toward zero)를 사용한다.

## 입력

수식이 한 줄로 주어진다.

- 수식의 길이 ≤ 10,000
- 수는 정수 (-10^9 ≤ 각 수 ≤ 10^9)
- 0으로 나누는 경우는 없다.

## 출력

수식의 계산 결과를 출력한다.

## 예제 입력 1

\`\`\`
3+5*2
\`\`\`

## 예제 출력 1

\`\`\`
13
\`\`\`

## 예제 입력 2

\`\`\`
(3+5)*2
\`\`\`

## 예제 출력 2

\`\`\`
16
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3+5*2", expectedOutput: "13", isVisible: true },
      { input: "(3+5)*2", expectedOutput: "16", isVisible: true },
      { input: "10-3*2+1", expectedOutput: "5", isVisible: false },
      { input: "-3+5", expectedOutput: "2", isVisible: false },
      { input: "100/4/5", expectedOutput: "5", isVisible: false },
    ],
    tags: ["구현", "스택"],
  },

  // 45. 행렬 90도 회전
  {
    title: "행렬 90도 회전",
    description: `N×M 행렬을 시계 방향으로 90도씩 R번 회전한 결과를 출력하여라. R이 매우 클 수 있으므로 R mod 4를 이용한다.

## 입력

첫째 줄에 N, M, R, 이후 N개의 줄에 행렬의 각 행이 주어진다.

- 1 ≤ N, M ≤ 1,000
- 0 ≤ R ≤ 10^9

## 출력

회전 후 행렬을 출력한다.

## 예제 입력 1

\`\`\`
2 3 1
1 2 3
4 5 6
\`\`\`

## 예제 출력 1

\`\`\`
4 1
5 2
6 3
\`\`\`

## 예제 입력 2

\`\`\`
2 3 5
1 2 3
4 5 6
\`\`\`

## 예제 출력 2

\`\`\`
4 1
5 2
6 3
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 3 1\n1 2 3\n4 5 6", expectedOutput: "4 1\n5 2\n6 3", isVisible: true },
      { input: "2 3 5\n1 2 3\n4 5 6", expectedOutput: "4 1\n5 2\n6 3", isVisible: true },
      { input: "2 3 0\n1 2 3\n4 5 6", expectedOutput: "1 2 3\n4 5 6", isVisible: false },
      { input: "2 3 2\n1 2 3\n4 5 6", expectedOutput: "6 5 4\n3 2 1", isVisible: false },
      { input: "2 3 4\n1 2 3\n4 5 6", expectedOutput: "1 2 3\n4 5 6", isVisible: false },
    ],
    tags: ["구현"],
  },

  // 46. 두 직사각형 겹침 넓이
  {
    title: "두 직사각형 겹침 넓이",
    description: `축에 정렬된 두 직사각형의 교집합 넓이를 구하여라. 겹치지 않으면 0을 출력한다.

## 입력

첫째 줄에 첫 번째 직사각형의 x1 y1 x2 y2, 둘째 줄에 두 번째 직사각형의 x1 y1 x2 y2가 주어진다. (왼쪽 아래 – 오른쪽 위 순서)

- -10^9 ≤ x1 < x2 ≤ 10^9
- -10^9 ≤ y1 < y2 ≤ 10^9

## 출력

두 직사각형의 교집합 넓이를 출력한다.

## 예제 입력 1

\`\`\`
0 0 4 4
2 2 6 6
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\`

## 예제 입력 2

\`\`\`
0 0 2 2
3 3 5 5
\`\`\`

## 예제 출력 2

\`\`\`
0
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "0 0 4 4\n2 2 6 6", expectedOutput: "4", isVisible: true },
      { input: "0 0 2 2\n3 3 5 5", expectedOutput: "0", isVisible: true },
      { input: "0 0 5 5\n1 1 3 3", expectedOutput: "4", isVisible: false },
      { input: "-1000000000 -1000000000 0 0\n0 0 1000000000 1000000000", expectedOutput: "0", isVisible: false },
      { input: "0 0 1000000000 1000000000\n500000000 500000000 1500000000 1500000000", expectedOutput: "250000000000000000", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 47. 시계 각도
  {
    title: "시계 각도",
    description: `시침과 분침의 각도(작은 쪽)를 구하여라. 시침은 분 단위로도 움직인다.

## 입력

첫째 줄에 시 H, 분 M이 공백으로 주어진다.

- 0 ≤ H ≤ 11
- 0 ≤ M ≤ 59

## 출력

시침과 분침이 이루는 각도(작은 쪽)를 소수점 첫째 자리까지 출력한다.

## 예제 입력 1

\`\`\`
3 0
\`\`\`

## 예제 출력 1

\`\`\`
90.0
\`\`\`

## 예제 입력 2

\`\`\`
3 30
\`\`\`

## 예제 출력 2

\`\`\`
75.0
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.05,
    testCases: [
      { input: "3 0", expectedOutput: "90.0", isVisible: true },
      { input: "3 30", expectedOutput: "75.0", isVisible: true },
      { input: "12 0", expectedOutput: "0.0", isVisible: false },
      { input: "6 0", expectedOutput: "180.0", isVisible: false },
      { input: "9 15", expectedOutput: "172.5", isVisible: false },
    ],
    tags: ["수학", "구현"],
  },

  // 48. 괄호 생성
  {
    title: "괄호 생성",
    description: `N쌍의 괄호로 만들 수 있는 모든 올바른 괄호 문자열을 사전순으로 출력하여라.

## 입력

첫째 줄에 N이 주어진다.

- 1 ≤ N ≤ 10

## 출력

올바른 괄호 문자열을 사전순으로 한 줄씩 출력한다.

## 예제 입력 1

\`\`\`
2
\`\`\`

## 예제 출력 1

\`\`\`
(())
()()
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2", expectedOutput: "(())\n()()", isVisible: true },
      { input: "1", expectedOutput: "()", isVisible: false },
      { input: "3", expectedOutput: "((()))\n(()())\n(())()\n()(())\n()()()", isVisible: false },
      { input: "4", expectedOutput: "(((())))\n((()()))\n((())())\n((()))()\n(()(()))\n(()()())\n(()())()\n(())(())\n(())()()\n()((()))\n()(()())\n()(())()\n()()(())\n()()()()", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  // 49. 최장 0 연속 부분열
  {
    title: "최장 1 연속 부분열",
    description: `이진 문자열이 주어진다. 최대 K개의 0을 1로 바꿀 때, 가장 긴 연속 1의 길이를 구하여라. 슬라이딩 윈도우를 사용한다.

## 입력

첫째 줄에 이진 문자열 S, 둘째 줄에 K가 주어진다.

- 1 ≤ |S| ≤ 1,000,000
- 0 ≤ K ≤ |S|
- S는 '0'과 '1'로만 구성된다.

## 출력

최대 K개의 0을 1로 바꿀 때 가장 긴 연속 1의 길이를 출력한다.

## 예제 입력 1

\`\`\`
1101100111
2
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\`

## 예제 입력 2

\`\`\`
0000
2
\`\`\`

## 예제 출력 2

\`\`\`
2
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1101100111\n2", expectedOutput: "7", isVisible: true },
      { input: "0000\n2", expectedOutput: "2", isVisible: true },
      { input: "1111\n0", expectedOutput: "4", isVisible: false },
      { input: "110110\n1", expectedOutput: "5", isVisible: false },
      { input: "0\n0", expectedOutput: "0", isVisible: false },
    ],
    tags: ["투 포인터"],
  },

  // 50. 히스토그램 물 채우기
  {
    title: "히스토그램 물 채우기",
    description: `N개의 막대로 이루어진 히스토그램에 비가 내릴 때, 고이는 물의 총량을 구하여라. 각 막대의 너비는 1이다.

## 입력

첫째 줄에 N, 둘째 줄에 N개의 막대 높이가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 1,000,000
- 0 ≤ 각 높이 ≤ 10^9

## 출력

고이는 물의 총량을 출력한다.

## 예제 입력 1

\`\`\`
12
0 1 0 2 1 0 1 3 2 1 2 1
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\`

## 예제 입력 2

\`\`\`
6
4 2 0 3 2 5
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
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6", isVisible: true },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9", isVisible: true },
      { input: "3\n3 0 3", expectedOutput: "3", isVisible: false },
      { input: "5\n1 2 3 4 5", expectedOutput: "0", isVisible: false },
      { input: "1\n5", expectedOutput: "0", isVisible: false },
    ],
    tags: ["스택", "구현"],
  },
];
