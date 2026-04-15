export const problems = [
  // ─── 그리디 1-18 ───────────────────────────────────────────────────────────

  {
    title: "동전 거스름돈",
    description: `거스름돈으로 N원을 돌려줘야 한다. 500원, 100원, 50원, 10원짜리 동전이 무한히 있을 때, 거슬러 줄 수 있는 동전의 최소 개수를 구하라.

## 입력

첫째 줄에 정수 N이 주어진다. (10 ≤ N ≤ 100,000, N은 10의 배수)

## 출력

동전의 최소 개수를 출력한다.

## 예제 입력 1

\`\`\`
1260
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1260", expectedOutput: "6", isVisible: true },
      { input: "10", expectedOutput: "1", isVisible: false },
      { input: "100000", expectedOutput: "200", isVisible: false },
      { input: "550", expectedOutput: "2", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "회의실 배정",
    description: `N개의 회의가 있다. 각 회의는 시작 시간과 끝나는 시간이 주어진다. 회의실이 하나뿐일 때, 겹치지 않게 사용할 수 있는 최대 회의 수를 구하라. 회의는 끝나는 시간에 다른 회의가 시작될 수 있다.

## 입력

첫째 줄에 회의 수 N이 주어진다. (1 ≤ N ≤ 100,000)

둘째 줄부터 N개의 줄에 각 회의의 시작 시간과 끝나는 시간이 공백으로 구분되어 주어진다. 시작 시간과 끝나는 시간은 0 이상 2^31-1 미만의 정수이며, 시작 시간이 끝나는 시간보다 클 수도 있다.

## 출력

최대 회의 수를 출력한다.

## 예제 입력 1

\`\`\`
11
1 4
3 5
0 6
5 7
3 8
5 9
6 10
8 11
8 12
2 13
12 14
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "11\n1 4\n3 5\n0 6\n5 7\n3 8\n5 9\n6 10\n8 11\n8 12\n2 13\n12 14",
        expectedOutput: "4",
        isVisible: true,
      },
      { input: "1\n0 0", expectedOutput: "1", isVisible: false },
      { input: "3\n1 2\n2 3\n3 4", expectedOutput: "3", isVisible: false },
      { input: "4\n1 5\n2 3\n4 6\n6 8", expectedOutput: "3", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "ATM 대기 시간",
    description: `N명이 ATM 앞에 줄을 서 있다. 각 사람이 ATM을 이용하는 데 걸리는 시간 P_i가 주어질 때, 각 사람이 기다리는 시간의 합이 최소가 되도록 줄을 세워라. 모든 사람의 대기 시간의 합을 출력하라.

대기 시간이란 ATM 앞에 도착한 시점부터 이용을 마친 시점까지의 시간을 의미한다.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 1,000)

둘째 줄에 N개의 정수 P_i가 공백으로 구분되어 주어진다. (1 ≤ P_i ≤ 1,000)

## 출력

모든 사람의 대기 시간의 합의 최솟값을 출력한다.

## 예제 입력 1

\`\`\`
5
3 1 4 3 2
\`\`\`

## 예제 출력 1

\`\`\`
32
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 3 2", expectedOutput: "32", isVisible: true },
      { input: "1\n5", expectedOutput: "5", isVisible: false },
      { input: "3\n1 2 3", expectedOutput: "10", isVisible: false },
      { input: "4\n4 1 2 3", expectedOutput: "20", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "잃어버린 괄호",
    description: `수식이 주어진다. 이 수식에는 덧셈(+)과 뺄셈(-) 연산만 있으며, 피연산자는 음이 아닌 정수다. 수식에 괄호를 적절히 추가하여 수식의 결과값을 최소로 만들어라. 괄호는 항상 올바른 수식이 되도록 붙여야 하며, 괄호 안에는 1개 이상의 연산이 있어야 한다.

## 입력

첫째 줄에 수식이 주어진다. 수식의 길이는 100 이하이며 음이 아닌 정수와 +, - 연산자로만 이루어져 있다. 피연산자는 0 이상 99999 이하이며, 앞에 불필요한 0이 붙지 않는다.

## 출력

수식의 최솟값을 출력한다. 최솟값은 -10^9 이상 10^9 이하이다.

## 예제 입력 1

\`\`\`
55-50+40
\`\`\`

## 예제 출력 1

\`\`\`
-35
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "55-50+40", expectedOutput: "-35", isVisible: true },
      { input: "10+20+30", expectedOutput: "60", isVisible: false },
      { input: "10-20-30", expectedOutput: "-40", isVisible: false },
      { input: "1+2-3-4+5", expectedOutput: "-9", isVisible: false },
    ],
    tags: ["그리디", "문자열"],
  },

  {
    title: "로프",
    description: `N개의 로프가 있다. 각 로프는 최대 W_i의 중량을 버틸 수 있다. 로프를 병렬로 k개 사용할 때 각 로프에 w/k의 중량이 걸린다. 모든 로프를 사용하지 않아도 되며, 사용하는 로프는 임의로 선택할 수 있다. 최대 몇 kg의 중량을 버틸 수 있는지 구하라.

## 입력

첫째 줄에 로프의 개수 N이 주어진다. (1 ≤ N ≤ 100,000)

둘째 줄부터 N개의 줄에 각 로프가 버틸 수 있는 최대 중량 W_i가 주어진다. (1 ≤ W_i ≤ 10,000)

## 출력

버틸 수 있는 최대 중량을 출력한다.

## 예제 입력 1

\`\`\`
2
10
15
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
      { input: "2\n10\n15", expectedOutput: "20", isVisible: true },
      { input: "1\n7", expectedOutput: "7", isVisible: false },
      { input: "3\n3\n2\n5", expectedOutput: "6", isVisible: false },
      { input: "4\n1\n2\n3\n4", expectedOutput: "6", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "주유소",
    description: `N개의 도시가 원형으로 연결된 도로가 있다. 각 도시 i에는 연료 f_i가 있고, 다음 도시로 이동하는 데 d_i의 연료가 필요하다. 빈 탱크로 출발하여 모든 도시를 한 바퀴 돌 수 있는 출발 도시 번호를 구하라. 가능한 출발 도시가 여러 개이면 가장 작은 번호를 출력하고, 불가능하면 -1을 출력한다. 도시 번호는 1번부터 시작한다.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 100,000)

둘째 줄에 각 도시의 연료 f_i가 공백으로 구분되어 주어진다.

셋째 줄에 각 도시에서 다음 도시까지의 거리 d_i가 공백으로 구분되어 주어진다.

(0 ≤ f_i ≤ 10,000, 1 ≤ d_i ≤ 10,000)

## 출력

출발 가능한 도시 번호 중 가장 작은 번호를 출력한다. 불가능하면 -1을 출력한다.

## 예제 입력 1

\`\`\`
3
1 4 2
2 3 2
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
      { input: "3\n1 4 2\n2 3 2", expectedOutput: "2", isVisible: true },
      { input: "3\n1 1 1\n2 2 2", expectedOutput: "-1", isVisible: false },
      { input: "3\n3 1 2\n2 2 2", expectedOutput: "1", isVisible: false },
      { input: "3\n1 2 3\n3 2 1", expectedOutput: "2", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "보물",
    description: `길이가 N인 두 배열 A, B가 있다. 두 배열의 원소를 1대1로 대응시켜 곱한 뒤 합한 값을 최소로 만들어라. 즉, A의 원소와 B의 원소를 적절히 매칭했을 때 ∑A_i × B_i의 최솟값을 구하라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 50)

둘째 줄에 배열 A의 원소 N개가 공백으로 구분되어 주어진다.

셋째 줄에 배열 B의 원소 N개가 공백으로 구분되어 주어진다.

(1 ≤ 각 원소 ≤ 100)

## 출력

∑A_i × B_i의 최솟값을 출력한다.

## 예제 입력 1

\`\`\`
3
1 2 3
3 1 2
\`\`\`

## 예제 출력 1

\`\`\`
10
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 2 3\n3 1 2", expectedOutput: "10", isVisible: true },
      { input: "2\n1 2\n3 4", expectedOutput: "10", isVisible: false },
      { input: "4\n1 2 3 4\n1 2 3 4", expectedOutput: "20", isVisible: false },
      { input: "1\n5\n7", expectedOutput: "35", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "신입 사원",
    description: `회사에 N명의 지원자가 있다. 각 지원자에게는 서류 순위와 면접 순위가 있다. 지원자 A가 합격하려면, 서류 순위와 면접 순위 모두에서 A보다 좋은 지원자가 없어야 한다. 최대 몇 명이 합격할 수 있는지 구하라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 100,000)

둘째 줄부터 N개의 줄에 각 지원자의 서류 순위와 면접 순위가 공백으로 구분되어 주어진다. 순위는 1 이상 N 이하이며, 같은 순위는 없다.

## 출력

최대 합격 인원을 출력한다.

## 예제 입력 1

\`\`\`
5
3 2
1 3
4 1
2 4
5 5
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 2\n1 3\n4 1\n2 4\n5 5", expectedOutput: "3", isVisible: true },
      { input: "3\n1 1\n2 2\n3 3", expectedOutput: "1", isVisible: false },
      { input: "4\n2 1\n1 2\n3 3\n4 4", expectedOutput: "2", isVisible: false },
      { input: "2\n1 2\n2 1", expectedOutput: "2", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "강의실 배정",
    description: `N개의 수업이 있다. 각 수업의 시작 시간과 끝나는 시간이 주어질 때, 모든 수업을 진행하기 위해 필요한 최소 강의실 수를 구하라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 200,000)

둘째 줄부터 N개의 줄에 각 수업의 시작 시간과 끝나는 시간이 공백으로 구분되어 주어진다. 시간은 1 이상 10^9 이하의 정수이며, 시작 시간은 끝나는 시간보다 작다.

## 출력

필요한 최소 강의실 수를 출력한다.

## 예제 입력 1

\`\`\`
3
1 3
2 4
3 5
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 3\n2 4\n3 5", expectedOutput: "2", isVisible: true },
      { input: "4\n1 4\n2 5\n3 6\n4 7", expectedOutput: "3", isVisible: false },
      { input: "3\n1 2\n3 4\n5 6", expectedOutput: "1", isVisible: false },
      { input: "5\n1 10\n2 3\n4 5\n6 7\n8 9", expectedOutput: "2", isVisible: false },
    ],
    tags: ["그리디", "우선순위 큐"],
  },

  {
    title: "Fractional Knapsack",
    description: `N개의 물건이 있다. 각 물건에는 무게와 가치가 있다. 배낭의 최대 무게는 W이다. 물건을 쪼개서 넣을 수 있을 때, 배낭에 넣을 수 있는 최대 가치를 소수 둘째 자리까지 출력하라.

## 입력

첫째 줄에 N과 W가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 1,000, 1 ≤ W ≤ 10,000)

둘째 줄부터 N개의 줄에 각 물건의 무게 w_i와 가치 v_i가 공백으로 구분되어 주어진다. (1 ≤ w_i ≤ 10,000, 1 ≤ v_i ≤ 10,000)

## 출력

최대 가치를 소수 둘째 자리까지 출력한다.

## 예제 입력 1

\`\`\`
3 50
10 60
20 100
30 120
\`\`\`

## 예제 출력 1

\`\`\`
240.00
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.01,
    testCases: [
      { input: "3 50\n10 60\n20 100\n30 120", expectedOutput: "240.00", isVisible: true },
      { input: "1 10\n10 100", expectedOutput: "100.00", isVisible: false },
      { input: "2 20\n10 100\n20 80", expectedOutput: "140.00", isVisible: false },
      { input: "3 25\n5 50\n10 60\n20 140", expectedOutput: "190.00", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "큰 수 만들기",
    description: `숫자로 이루어진 문자열 S에서 K개의 숫자를 제거하여 만들 수 있는 가장 큰 수를 구하라. 숫자의 순서는 바꿀 수 없다.

## 입력

첫째 줄에 문자열 S가 주어진다. (1 ≤ |S| ≤ 500,000, S는 숫자로만 이루어짐)

둘째 줄에 K가 주어진다. (1 ≤ K < |S|)

## 출력

가장 큰 수를 출력한다.

## 예제 입력 1

\`\`\`
1924
2
\`\`\`

## 예제 출력 1

\`\`\`
94
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1924\n2", expectedOutput: "94", isVisible: true },
      { input: "1231234\n3", expectedOutput: "3234", isVisible: false },
      { input: "4177252841\n4", expectedOutput: "775841", isVisible: false },
      { input: "9876543\n2", expectedOutput: "98765", isVisible: false },
    ],
    tags: ["그리디", "스택"],
  },

  {
    title: "체육복",
    description: `N명의 학생이 있다. 일부 학생은 체육복을 잃어버렸고(lost 목록), 일부 학생은 여벌 체육복이 있다(reserve 목록). 여벌이 있는 학생은 인접한 번호(앞 또는 뒤)의 학생에게 체육복 하나를 빌려줄 수 있다. 체육 수업에 참여할 수 있는 학생의 최대 수를 구하라. 단, 여벌이 있는 학생도 자신의 체육복을 잃어버렸다면 다른 학생에게 빌려줄 수 없다.

## 입력

첫째 줄에 N, 잃어버린 학생 수 L, 여벌이 있는 학생 수 R이 공백으로 구분되어 주어진다. (2 ≤ N ≤ 30, 1 ≤ L ≤ N, 1 ≤ R ≤ N)

둘째 줄에 잃어버린 학생 번호 L개가 공백으로 구분되어 주어진다.

셋째 줄에 여벌이 있는 학생 번호 R개가 공백으로 구분되어 주어진다.

## 출력

체육 수업에 참여할 수 있는 학생의 최대 수를 출력한다.

## 예제 입력 1

\`\`\`
5 2 3
2 4
1 3 5
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 2 3\n2 4\n1 3 5", expectedOutput: "5", isVisible: true },
      { input: "5 2 1\n2 4\n3", expectedOutput: "4", isVisible: false },
      { input: "3 3 1\n1 2 3\n1", expectedOutput: "2", isVisible: false },
      { input: "4 2 2\n1 3\n2 4", expectedOutput: "4", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "구명보트",
    description: `N명의 사람이 있다. 각 사람의 몸무게가 주어진다. 구명보트는 최대 2명까지 탈 수 있으며, 제한 무게는 limit이다. 모든 사람을 구출하기 위한 최소 구명보트 수를 구하라.

## 입력

첫째 줄에 N과 limit이 공백으로 구분되어 주어진다. (1 ≤ N ≤ 50,000, 40 ≤ limit ≤ 240,000)

둘째 줄에 N명의 몸무게가 공백으로 구분되어 주어진다. (40 ≤ 몸무게 ≤ limit)

## 출력

최소 구명보트 수를 출력한다.

## 예제 입력 1

\`\`\`
5 100
70 50 80 50 30
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 100\n70 50 80 50 30", expectedOutput: "3", isVisible: true },
      { input: "3 100\n70 80 50", expectedOutput: "3", isVisible: false },
      { input: "4 80\n40 40 40 40", expectedOutput: "2", isVisible: false },
      { input: "6 120\n60 50 70 80 40 110", expectedOutput: "4", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "기지국 설치",
    description: `1차원 배열 N칸에 아파트가 있다. 일부 위치에는 이미 기지국이 설치되어 있다. 기지국 하나는 설치된 위치를 중심으로 왼쪽 W칸, 오른쪽 W칸까지 전파를 전달할 수 있다. 아직 전파가 닿지 않는 곳에 기지국을 추가 설치할 때, 필요한 최소 기지국 수를 구하라.

## 입력

첫째 줄에 N과 W가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 200,000, 1 ≤ W ≤ 10,000)

둘째 줄에 설치된 기지국 수 K가 주어진다. (0 ≤ K ≤ N)

셋째 줄에 기지국의 위치 K개가 오름차순으로 공백으로 구분되어 주어진다. K가 0이면 셋째 줄은 빈 줄이다.

## 출력

추가로 설치해야 하는 최소 기지국 수를 구하라.

## 예제 입력 1

\`\`\`
11 1
2
4 8
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
      { input: "11 1\n2\n4 8", expectedOutput: "3", isVisible: true },
      { input: "5 1\n1\n3", expectedOutput: "1", isVisible: false },
      { input: "6 1\n3\n1 3 5", expectedOutput: "0", isVisible: false },
      { input: "10 2\n1\n5", expectedOutput: "1", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "문자열 뒤집기",
    description: `0과 1로 이루어진 문자열이 주어진다. 이 문자열에서 임의의 연속 구간을 선택해서 해당 구간의 모든 문자를 뒤집는(0을 1로, 1을 0으로) 연산을 할 수 있다. 문자열의 모든 문자가 같아지도록 하는 최소 연산 횟수를 구하라.

## 입력

첫째 줄에 문자열이 주어진다. (1 ≤ 길이 ≤ 1,000,000)

## 출력

최소 연산 횟수를 출력한다.

## 예제 입력 1

\`\`\`
0001100
\`\`\`

## 예제 출력 1

\`\`\`
1
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "0001100", expectedOutput: "1", isVisible: true },
      { input: "11011", expectedOutput: "1", isVisible: false },
      { input: "01010101", expectedOutput: "4", isVisible: false },
      { input: "0000", expectedOutput: "0", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "카드 정렬하기",
    description: `N묶음의 카드가 있다. 각 묶음에는 카드가 여러 장 있다. 두 묶음을 합치는 데 드는 비교 횟수는 두 묶음의 카드 수의 합이다. 모든 카드를 하나의 묶음으로 합칠 때 필요한 총 비교 횟수의 최솟값을 구하라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 100,000)

둘째 줄부터 N개의 줄에 각 묶음의 카드 수가 주어진다. (1 ≤ 카드 수 ≤ 1,000)

## 출력

최소 비교 횟수를 출력한다.

## 예제 입력 1

\`\`\`
3
10
20
40
\`\`\`

## 예제 출력 1

\`\`\`
100
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n10\n20\n40", expectedOutput: "100", isVisible: true },
      { input: "2\n1\n1", expectedOutput: "2", isVisible: false },
      { input: "4\n1\n2\n3\n4", expectedOutput: "19", isVisible: false },
      { input: "1\n5", expectedOutput: "0", isVisible: false },
    ],
    tags: ["그리디", "우선순위 큐"],
  },

  {
    title: "수 묶기",
    description: `N개의 수가 주어진다. 수를 두 개씩 묶어 곱한 뒤 나머지 수들과 더한 값을 최대화하라. 홀수 개이면 하나는 그냥 더한다. 같은 수라도 여러 번 묶을 수 없다(각 수는 한 번만 사용). 수는 -10,000 이상 10,000 이하이다.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 50)

둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10,000 ≤ 각 수 ≤ 10,000)

## 출력

최대 합을 출력한다.

## 예제 입력 1

\`\`\`
6
-3 -1 1 2 5 4
\`\`\`

## 예제 출력 1

\`\`\`
25
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n-3 -1 1 2 5 4", expectedOutput: "25", isVisible: true },
      { input: "3\n1 2 3", expectedOutput: "7", isVisible: false },
      { input: "4\n-1 -2 -3 -4", expectedOutput: "14", isVisible: false },
      { input: "5\n0 -1 2 -3 4", expectedOutput: "11", isVisible: false },
    ],
    tags: ["그리디"],
  },

  {
    title: "택배 배달과 수거하기",
    description: `N개의 집이 1차원 직선 위에 1번부터 N번까지 있다. 택배 기사는 창고(0번 위치)에서 출발하여 배달과 수거를 모두 완료한 뒤 창고로 돌아와야 한다. 트럭은 한 번에 최대 C개의 박스를 실을 수 있다. 각 집에는 배달해야 할 박스 수와 수거해야 할 박스 수가 주어진다. 최소 이동 거리를 구하라. 트럭은 배달과 수거를 같은 이동에서 동시에 할 수 있으며, 배달 용량과 수거 용량은 각각 C개이다.

## 입력

첫째 줄에 N과 C가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 100,000, 1 ≤ C ≤ 50)

둘째 줄에 각 집의 배달 박스 수 N개가 공백으로 구분되어 주어진다.

셋째 줄에 각 집의 수거 박스 수 N개가 공백으로 구분되어 주어진다.

(0 ≤ 각 값 ≤ 50)

## 출력

최소 이동 거리를 출력한다.

## 예제 입력 1

\`\`\`
6 4
1 0 3 1 2 0
0 3 0 4 0 0
\`\`\`

## 예제 출력 1

\`\`\`
16
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 4\n1 0 3 1 2 0\n0 3 0 4 0 0", expectedOutput: "16", isVisible: true },
      { input: "3 2\n1 1 1\n1 1 1", expectedOutput: "8", isVisible: false },
      { input: "2 5\n5 5\n0 0", expectedOutput: "6", isVisible: false },
      { input: "4 3\n0 0 0 4\n4 0 0 0", expectedOutput: "16", isVisible: false },
    ],
    tags: ["그리디"],
  },

  // ─── 이분 탐색 19-30 ──────────────────────────────────────────────────────

  {
    title: "나무 자르기",
    description: `N개의 나무가 있다. 절단기 높이를 H로 설정하면 H보다 높은 나무는 H까지 잘려나간다. 잘린 나무의 합이 M 이상이 되도록 하는 높이 H의 최댓값을 구하라.

## 입력

첫째 줄에 N과 M이 공백으로 구분되어 주어진다. (1 ≤ N ≤ 1,000,000, 1 ≤ M ≤ 2,000,000,000)

둘째 줄에 N개의 나무 높이가 공백으로 구분되어 주어진다. (0 ≤ 높이 ≤ 1,000,000,000)

## 출력

절단기 높이의 최댓값을 출력한다.

## 예제 입력 1

\`\`\`
4 7
20 15 10 17
\`\`\`

## 예제 출력 1

\`\`\`
15
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 7\n20 15 10 17", expectedOutput: "15", isVisible: true },
      { input: "5 20\n4 42 40 26 46", expectedOutput: "36", isVisible: false },
      { input: "3 5\n3 3 3", expectedOutput: "1", isVisible: false },
      { input: "2 10\n10 10", expectedOutput: "5", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  {
    title: "랜선 자르기",
    description: `N개의 랜선이 있다. 이 랜선들을 잘라 같은 길이의 랜선 K개를 만들려고 한다. 잘라서 남은 부분은 버린다. 만들 수 있는 랜선의 최대 길이를 정수로 구하라.

## 입력

첫째 줄에 N과 K가 공백으로 구분되어 주어진다. (1 ≤ K ≤ N ≤ 10,000)

둘째 줄부터 N개의 줄에 각 랜선의 길이가 주어진다. (1 ≤ 길이 ≤ 2^31-1)

## 출력

랜선의 최대 길이를 출력한다.

## 예제 입력 1

\`\`\`
4 11
802
743
457
539
\`\`\`

## 예제 출력 1

\`\`\`
200
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 11\n802\n743\n457\n539", expectedOutput: "200", isVisible: true },
      { input: "2 4\n10\n10", expectedOutput: "5", isVisible: false },
      { input: "3 3\n100\n100\n100", expectedOutput: "100", isVisible: false },
      { input: "2 10\n30\n31", expectedOutput: "6", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  {
    title: "예산",
    description: `N개 지방이 각각 원하는 예산을 요청했다. 총 예산이 M일 때, 예산 요청 금액이 상한액보다 작거나 같으면 요청 금액 그대로, 크면 상한액을 배분한다. 모든 요청을 처리하면서 총 예산을 초과하지 않는 상한액의 최댓값을 구하라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 10,000)

둘째 줄에 각 지방의 예산 요청이 공백으로 구분되어 주어진다. (1 ≤ 각 요청 ≤ 100,000)

셋째 줄에 총 예산 M이 주어진다. (1 ≤ M ≤ 10^9)

## 출력

상한액의 최댓값을 출력한다.

## 예제 입력 1

\`\`\`
4
120 110 140 150
485
\`\`\`

## 예제 출력 1

\`\`\`
127
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n120 110 140 150\n485", expectedOutput: "127", isVisible: true },
      { input: "3\n100 100 100\n200", expectedOutput: "66", isVisible: false },
      { input: "2\n50 100\n200", expectedOutput: "100", isVisible: false },
      { input: "5\n10 20 30 40 50\n150", expectedOutput: "50", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  {
    title: "공유기 설치",
    description: `N개의 집이 1차원 직선 위에 있다. C개의 공유기를 집에 설치하려고 한다. 인접한 두 공유기 사이의 거리 중 최솟값을 최대로 하는 배치를 찾아라.

## 입력

첫째 줄에 N과 C가 공백으로 구분되어 주어진다. (2 ≤ C ≤ N ≤ 200,000)

둘째 줄부터 N개의 줄에 각 집의 좌표가 주어진다. (0 ≤ 좌표 ≤ 10^9)

## 출력

인접한 공유기 사이의 최소 거리의 최댓값을 출력한다.

## 예제 입력 1

\`\`\`
5 3
1
2
8
4
9
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
      { input: "5 3\n1\n2\n8\n4\n9", expectedOutput: "3", isVisible: true },
      { input: "4 2\n0\n10\n20\n30", expectedOutput: "30", isVisible: false },
      { input: "3 3\n0\n5\n10", expectedOutput: "5", isVisible: false },
      { input: "6 4\n0\n3\n6\n10\n15\n21", expectedOutput: "6", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  {
    title: "K번째 수 (곱셈 배열)",
    description: `N×N 배열 A가 있다. A[i][j] = i × j (1-인덱스)일 때, 이 배열의 모든 원소를 정렬했을 때 K번째로 작은 수를 구하라.

## 입력

첫째 줄에 N과 K가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 100,000, 1 ≤ K ≤ N^2)

## 출력

K번째로 작은 수를 출력한다.

## 예제 입력 1

\`\`\`
3 7
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 7", expectedOutput: "6", isVisible: true },
      { input: "2 3", expectedOutput: "2", isVisible: false },
      { input: "5 10", expectedOutput: "5", isVisible: false },
      { input: "1 1", expectedOutput: "1", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  {
    title: "징검다리",
    description: `출발점(0)에서 도착점(L)까지 직선 위에 N개의 돌이 있다. 돌 K개를 제거하여 인접한 돌(출발점과 도착점 포함) 사이의 최소 거리를 최대화하라.

## 입력

첫째 줄에 L, N, K가 공백으로 구분되어 주어진다. (1 ≤ L ≤ 10^9, 1 ≤ N ≤ 50,000, 1 ≤ K ≤ N)

둘째 줄부터 N개의 줄에 각 돌의 위치가 주어진다. 위치는 0 초과 L 미만의 정수이며, 위치는 모두 다르다.

## 출력

K개의 돌을 제거한 후 인접한 돌 사이의 최소 거리의 최댓값을 출력한다.

## 예제 입력 1

\`\`\`
25 5 2
2
14
11
21
17
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "25 5 2\n2\n14\n11\n21\n17", expectedOutput: "4", isVisible: true },
      { input: "10 3 1\n2\n5\n8", expectedOutput: "2", isVisible: false },
      { input: "20 4 2\n5\n10\n15\n18", expectedOutput: "5", isVisible: false },
      { input: "30 5 3\n3\n7\n12\n18\n25", expectedOutput: "12", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  {
    title: "입국심사",
    description: `N명이 M개의 심사대에서 입국 심사를 받아야 한다. i번 심사대는 한 명당 t_i분이 걸린다. 모든 N명이 심사를 마치는 데 걸리는 최소 시간을 구하라. 각 심사대는 한 번에 한 명씩 처리한다.

## 입력

첫째 줄에 N과 M이 공백으로 구분되어 주어진다. (1 ≤ N ≤ 1,000,000,000, 1 ≤ M ≤ 100,000)

둘째 줄부터 M개의 줄에 각 심사대의 처리 시간 t_i가 주어진다. (1 ≤ t_i ≤ 1,000,000,000)

## 출력

모든 사람이 심사를 마치는 최소 시간을 출력한다.

## 예제 입력 1

\`\`\`
6 2
7
10
\`\`\`

## 예제 출력 1

\`\`\`
28
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 2\n7\n10", expectedOutput: "28", isVisible: true },
      { input: "1 1\n1", expectedOutput: "1", isVisible: false },
      { input: "10 3\n1\n2\n3", expectedOutput: "6", isVisible: false },
      { input: "1000000000 1\n1000000000", expectedOutput: "1000000000000000000", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  {
    title: "떡볶이 떡 만들기",
    description: `N개의 떡이 있다. 절단기 높이를 H로 설정하면 H보다 높은 떡은 H까지 잘려나간다. 잘린 떡의 합이 M 이상이 되도록 하는 높이 H의 최댓값을 구하라.

## 입력

첫째 줄에 N과 M이 공백으로 구분되어 주어진다. (1 ≤ N ≤ 1,000,000, 1 ≤ M ≤ 2,000,000,000)

둘째 줄에 N개의 떡 높이가 공백으로 구분되어 주어진다. (0 ≤ 높이 ≤ 1,000,000,000)

## 출력

절단기 높이의 최댓값을 출력한다.

## 예제 입력 1

\`\`\`
4 6
19 15 10 17
\`\`\`

## 예제 출력 1

\`\`\`
15
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 6\n19 15 10 17", expectedOutput: "15", isVisible: true },
      { input: "5 20\n4 42 40 26 46", expectedOutput: "36", isVisible: false },
      { input: "3 1\n1 2 3", expectedOutput: "2", isVisible: false },
      { input: "2 10\n20 20", expectedOutput: "15", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  {
    title: "용액",
    description: `N개의 용액이 있다. 각 용액은 정수의 특성값을 가진다. 두 용액을 혼합하면 특성값의 합이 된다. 합이 0에 가장 가까운 두 용액을 찾아라. 용액의 특성값 배열은 오름차순으로 정렬되어 있다.

## 입력

첫째 줄에 N이 주어진다. (2 ≤ N ≤ 100,000)

둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000,000 ≤ 각 값 ≤ 1,000,000,000, 오름차순 정렬)

## 출력

합이 0에 가장 가까운 두 용액의 특성값을 오름차순으로 출력한다.

## 예제 입력 1

\`\`\`
5
-99 -2 -1 4 98
\`\`\`

## 예제 출력 1

\`\`\`
-99 98
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n-99 -2 -1 4 98", expectedOutput: "-99 98", isVisible: true },
      { input: "2\n-1 1", expectedOutput: "-1 1", isVisible: false },
      { input: "4\n-100 -50 50 100", expectedOutput: "-100 100", isVisible: false },
      { input: "3\n1 2 3", expectedOutput: "1 2", isVisible: false },
    ],
    tags: ["이분 탐색", "투 포인터"],
  },

  {
    title: "가장 긴 증가하는 부분 수열 (이분 탐색)",
    description: `N개의 수열이 주어질 때, 가장 긴 증가하는 부분 수열(LIS)의 길이를 구하라. O(N log N) 이분 탐색을 이용하여 풀어라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 100,000)

둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (1 ≤ 각 수 ≤ 1,000,000)

## 출력

LIS의 길이를 출력한다.

## 예제 입력 1

\`\`\`
6
10 20 10 30 20 50
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n10 20 10 30 20 50", expectedOutput: "4", isVisible: true },
      { input: "1\n5", expectedOutput: "1", isVisible: false },
      { input: "5\n5 4 3 2 1", expectedOutput: "1", isVisible: false },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "7", isVisible: false },
    ],
    tags: ["이분 탐색", "DP"],
  },

  {
    title: "두 용액",
    description: `N개의 용액이 있다. 두 용액을 섞었을 때 특성값의 합의 절댓값이 최소가 되는 두 용액을 구하라. 두 용액의 특성값을 오름차순으로 출력하라.

## 입력

첫째 줄에 N이 주어진다. (2 ≤ N ≤ 100,000)

둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000,000 ≤ 각 값 ≤ 1,000,000,000)

## 출력

두 용액의 특성값을 오름차순으로 출력한다.

## 예제 입력 1

\`\`\`
4
-99 -2 -1 4
\`\`\`

## 예제 출력 1

\`\`\`
-2 4
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n-99 -2 -1 4", expectedOutput: "-2 4", isVisible: true },
      { input: "2\n-1 1", expectedOutput: "-1 1", isVisible: false },
      { input: "5\n1 2 3 100 200", expectedOutput: "1 2", isVisible: false },
      { input: "4\n-10 -3 2 7", expectedOutput: "-3 2", isVisible: false },
    ],
    tags: ["이분 탐색", "투 포인터"],
  },

  {
    title: "배열에서 K번째 수",
    description: `N개의 정수로 이루어진 배열에서 K번째로 작은 수를 구하라. 이분 탐색을 활용하여 구하라.

## 입력

첫째 줄에 N과 K가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 5,000,000, 1 ≤ K ≤ N)

둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-10^9 ≤ 각 수 ≤ 10^9)

## 출력

K번째로 작은 수를 출력한다.

## 예제 입력 1

\`\`\`
5 3
3 1 4 1 5
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3\n3 1 4 1 5", expectedOutput: "3", isVisible: true },
      { input: "3 1\n9 7 5", expectedOutput: "5", isVisible: false },
      { input: "4 4\n1 2 3 4", expectedOutput: "4", isVisible: false },
      { input: "6 2\n10 10 10 1 1 1", expectedOutput: "1", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  // ─── 분할 정복 31-38 ──────────────────────────────────────────────────────

  {
    title: "거듭제곱 (빠른 거듭제곱)",
    description: `A^B mod C를 구하라. 분할 정복을 이용한 빠른 거듭제곱을 구현하라.

## 입력

첫째 줄에 A, B, C가 공백으로 구분되어 주어진다. (1 ≤ A, C ≤ 10^9, 1 ≤ B ≤ 10^18)

## 출력

A^B mod C를 출력한다.

## 예제 입력 1

\`\`\`
10 11 12
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
      { input: "10 11 12", expectedOutput: "4", isVisible: true },
      { input: "2 10 1000", expectedOutput: "24", isVisible: false },
      { input: "1000000000 1000000000000000000 1000000007", expectedOutput: "1", isVisible: false },
      { input: "3 7 1000000007", expectedOutput: "2187", isVisible: false },
    ],
    tags: ["분할 정복", "수학"],
  },

  {
    title: "행렬 거듭제곱",
    description: `2×2 정수 행렬 M이 주어질 때, M^N mod (10^9+7)을 구하라. 분할 정복을 이용하라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 10^18)

둘째 줄부터 두 줄에 걸쳐 2×2 행렬이 주어진다. 각 원소는 0 이상 1,000 이하의 정수다.

## 출력

M^N mod (10^9+7)을 2×2 행렬로 출력한다. 각 행을 한 줄에 공백으로 구분하여 출력한다.

## 예제 입력 1

\`\`\`
2
1 2
3 4
\`\`\`

## 예제 출력 1

\`\`\`
7 10
15 22
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n1 2\n3 4", expectedOutput: "7 10\n15 22", isVisible: true },
      { input: "1\n1 0\n0 1", expectedOutput: "1 0\n0 1", isVisible: false },
      { input: "3\n1 1\n1 0", expectedOutput: "3 2\n2 1", isVisible: false },
      { input: "1000000000000000000\n1 1\n1 0", expectedOutput: "525372958 525372957\n525372957 999999942", isVisible: false },
    ],
    tags: ["분할 정복", "수학"],
  },

  {
    title: "피보나치 수 (행렬 거듭제곱)",
    description: `N번째 피보나치 수를 mod (10^9+7)로 구하라. F(1)=1, F(2)=1, F(n)=F(n-1)+F(n-2). 행렬 거듭제곱을 이용하여 O(log N)에 구하라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 10^18)

## 출력

N번째 피보나치 수를 mod 10^9+7로 출력한다.

## 예제 입력 1

\`\`\`
10
\`\`\`

## 예제 출력 1

\`\`\`
55
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10", expectedOutput: "55", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "20", expectedOutput: "6765", isVisible: false },
      { input: "1000000000000000000", expectedOutput: "209783453", isVisible: false },
    ],
    tags: ["분할 정복", "수학", "DP"],
  },

  {
    title: "병합 정렬",
    description: `N개의 수를 병합 정렬을 이용하여 오름차순으로 정렬하라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 500,000)

둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (-1,000,000,000 ≤ 각 수 ≤ 1,000,000,000)

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
    difficulty: 4.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "1 1 3 4 5", isVisible: true },
      { input: "1\n42", expectedOutput: "42", isVisible: false },
      { input: "4\n4 3 2 1", expectedOutput: "1 2 3 4", isVisible: false },
      { input: "6\n-5 3 -1 2 0 4", expectedOutput: "-5 -1 0 2 3 4", isVisible: false },
    ],
    tags: ["분할 정복"],
  },

  {
    title: "병합 정렬과 역전 수",
    description: `N개의 수로 이루어진 수열에서 역전의 수를 구하라. 역전(inversion)이란 i < j이면서 A[i] > A[j]인 쌍 (i, j)의 수를 말한다. 병합 정렬을 이용하여 O(N log N)에 구하라.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 500,000)

둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. (1 ≤ 각 수 ≤ 10^9, 모두 다름)

## 출력

역전의 수를 출력한다.

## 예제 입력 1

\`\`\`
5
3 1 4 2 5
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 2 5", expectedOutput: "3", isVisible: true },
      { input: "4\n4 3 2 1", expectedOutput: "6", isVisible: false },
      { input: "3\n1 2 3", expectedOutput: "0", isVisible: false },
      { input: "6\n6 5 4 3 2 1", expectedOutput: "15", isVisible: false },
    ],
    tags: ["분할 정복"],
  },

  {
    title: "종이 자르기",
    description: `N×M 크기의 종이를 1×1 크기로 모두 자르려고 한다. 한 번 자를 때 종이 한 장을 직선으로 두 조각으로 자른다. 최소 몇 번 잘라야 하는지 구하라.

## 입력

첫째 줄에 N과 M이 공백으로 구분되어 주어진다. (1 ≤ N, M ≤ 10^9)

## 출력

최소 절단 횟수를 출력한다.

## 예제 입력 1

\`\`\`
2 3
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
      { input: "2 3", expectedOutput: "5", isVisible: true },
      { input: "1 1", expectedOutput: "0", isVisible: false },
      { input: "4 4", expectedOutput: "15", isVisible: false },
      { input: "1 1000000000", expectedOutput: "999999999", isVisible: false },
    ],
    tags: ["분할 정복", "수학"],
  },

  {
    title: "가장 가까운 두 점",
    description: `2차원 평면 위의 N개 점 중 가장 가까운 두 점 사이의 거리를 구하라. 분할 정복 알고리즘을 이용하여 O(N log N)에 구하라.

## 입력

첫째 줄에 N이 주어진다. (2 ≤ N ≤ 100,000)

둘째 줄부터 N개의 줄에 각 점의 x좌표와 y좌표가 공백으로 구분되어 주어진다. (-10,000 ≤ x, y ≤ 10,000, 정수)

## 출력

가장 가까운 두 점 사이의 거리를 소수 여섯째 자리까지 출력한다.

## 예제 입력 1

\`\`\`
4
0 0
1 1
2 2
3 3
\`\`\`

## 예제 출력 1

\`\`\`
1.414214
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.000001,
    testCases: [
      { input: "4\n0 0\n1 1\n2 2\n3 3", expectedOutput: "1.414214", isVisible: true },
      { input: "2\n0 0\n3 4", expectedOutput: "5.000000", isVisible: false },
      { input: "3\n0 0\n10 0\n0 10", expectedOutput: "10.000000", isVisible: false },
      { input: "5\n1 1\n1 2\n1 3\n2 1\n2 2", expectedOutput: "1.000000", isVisible: false },
    ],
    tags: ["분할 정복"],
  },

  {
    title: "쿼드트리",
    description: `2^N × 2^N 크기의 흑백 이미지를 쿼드트리로 압축하라. 이미지가 모두 같은 색이면 해당 색(0 또는 1)으로 표현하고, 그렇지 않으면 '('로 시작하여 왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래 순으로 재귀적으로 압축하고 ')'로 닫는다.

## 입력

첫째 줄에 N이 주어진다. (0 ≤ N ≤ 6)

둘째 줄부터 2^N개의 줄에 이미지 정보가 주어진다. 각 줄은 2^N개의 0 또는 1로 이루어진다.

## 출력

압축된 쿼드트리 문자열을 출력한다.

## 예제 입력 1

\`\`\`
2
0011
0011
1100
1100
\`\`\`

## 예제 출력 1

\`\`\`
(0110)
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n0011\n0011\n1100\n1100", expectedOutput: "(0110)", isVisible: true },
      { input: "0\n0", expectedOutput: "0", isVisible: false },
      { input: "1\n01\n10", expectedOutput: "(0110)", isVisible: false },
      { input: "2\n0000\n0000\n0000\n0000", expectedOutput: "0", isVisible: false },
    ],
    tags: ["분할 정복", "재귀"],
  },

  // ─── 백트래킹 39-50 ───────────────────────────────────────────────────────

  {
    title: "N과 M (1)",
    description: `1부터 N까지의 자연수 중에서 M개를 고른 수열을 모두 출력하라. 같은 수를 여러 번 골라서는 안 된다. 수열은 사전 순으로 출력하라.

## 입력

첫째 줄에 N과 M이 공백으로 구분되어 주어진다. (1 ≤ M ≤ N ≤ 8)

## 출력

조건에 맞는 모든 수열을 한 줄에 하나씩 사전 순으로 출력한다.

## 예제 입력 1

\`\`\`
3 1
\`\`\`

## 예제 출력 1

\`\`\`
1
2
3
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 1", expectedOutput: "1\n2\n3", isVisible: true },
      { input: "3 2", expectedOutput: "1 2\n1 3\n2 1\n2 3\n3 1\n3 2", isVisible: false },
      { input: "4 2", expectedOutput: "1 2\n1 3\n1 4\n2 1\n2 3\n2 4\n3 1\n3 2\n3 4\n4 1\n4 2\n4 3", isVisible: false },
      { input: "2 2", expectedOutput: "1 2\n2 1", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "N과 M (2)",
    description: `1부터 N까지의 자연수 중에서 M개를 고른 조합을 모두 출력하라. 고른 수열은 오름차순이어야 하며, 사전 순으로 출력하라.

## 입력

첫째 줄에 N과 M이 공백으로 구분되어 주어진다. (1 ≤ M ≤ N ≤ 8)

## 출력

조건에 맞는 모든 수열을 한 줄에 하나씩 사전 순으로 출력한다.

## 예제 입력 1

\`\`\`
4 2
\`\`\`

## 예제 출력 1

\`\`\`
1 2
1 3
1 4
2 3
2 4
3 4
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 2", expectedOutput: "1 2\n1 3\n1 4\n2 3\n2 4\n3 4", isVisible: true },
      { input: "3 1", expectedOutput: "1\n2\n3", isVisible: false },
      { input: "3 3", expectedOutput: "1 2 3", isVisible: false },
      { input: "5 2", expectedOutput: "1 2\n1 3\n1 4\n1 5\n2 3\n2 4\n2 5\n3 4\n3 5\n4 5", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "N과 M (3)",
    description: `1부터 N까지의 자연수 중에서 M개를 고른 수열을 모두 출력하라. 같은 수를 여러 번 골라도 된다(중복 허용). 수열은 사전 순으로 출력하라.

## 입력

첫째 줄에 N과 M이 공백으로 구분되어 주어진다. (1 ≤ M ≤ N ≤ 7)

## 출력

조건에 맞는 모든 수열을 한 줄에 하나씩 사전 순으로 출력한다.

## 예제 입력 1

\`\`\`
3 1
\`\`\`

## 예제 출력 1

\`\`\`
1
2
3
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 1", expectedOutput: "1\n2\n3", isVisible: true },
      { input: "2 2", expectedOutput: "1 1\n1 2\n2 1\n2 2", isVisible: false },
      { input: "3 2", expectedOutput: "1 1\n1 2\n1 3\n2 1\n2 2\n2 3\n3 1\n3 2\n3 3", isVisible: false },
      { input: "1 3", expectedOutput: "1 1 1", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "N과 M (4)",
    description: `1부터 N까지의 자연수 중에서 M개를 고른 수열을 모두 출력하라. 같은 수를 여러 번 골라도 되며, 고른 수열은 비내림차순이어야 한다. 사전 순으로 출력하라.

## 입력

첫째 줄에 N과 M이 공백으로 구분되어 주어진다. (1 ≤ M ≤ N ≤ 8)

## 출력

조건에 맞는 모든 수열을 한 줄에 하나씩 사전 순으로 출력한다.

## 예제 입력 1

\`\`\`
3 2
\`\`\`

## 예제 출력 1

\`\`\`
1 1
1 2
1 3
2 2
2 3
3 3
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 2", expectedOutput: "1 1\n1 2\n1 3\n2 2\n2 3\n3 3", isVisible: true },
      { input: "2 1", expectedOutput: "1\n2", isVisible: false },
      { input: "2 3", expectedOutput: "1 1 1\n1 1 2\n1 2 2\n2 2 2", isVisible: false },
      { input: "4 2", expectedOutput: "1 1\n1 2\n1 3\n1 4\n2 2\n2 3\n2 4\n3 3\n3 4\n4 4", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "N-Queen",
    description: `N×N 크기의 체스판에 N개의 퀸을 서로 공격할 수 없도록 배치하는 경우의 수를 구하라. 퀸은 상하좌우 및 대각선 방향으로 이동할 수 있다.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 14)

## 출력

N개의 퀸을 배치할 수 있는 경우의 수를 출력한다.

## 예제 입력 1

\`\`\`
8
\`\`\`

## 예제 출력 1

\`\`\`
92
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "8", expectedOutput: "92", isVisible: true },
      { input: "1", expectedOutput: "1", isVisible: false },
      { input: "4", expectedOutput: "2", isVisible: false },
      { input: "10", expectedOutput: "724", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "스도쿠",
    description: `9×9 스도쿠 퍼즐이 주어진다. 빈 칸은 0으로 표시된다. 스도쿠의 규칙에 따라 빈 칸을 채워 완성된 스도쿠를 출력하라.

스도쿠 규칙: 각 행, 각 열, 그리고 각 3×3 블록에 1~9의 숫자가 한 번씩 등장해야 한다. 해는 유일하다.

## 입력

9개의 줄에 각 줄마다 9개의 숫자가 공백으로 구분되어 주어진다. (0은 빈 칸)

## 출력

완성된 스도쿠를 9×9 형태로 출력한다. 각 행의 숫자는 공백으로 구분한다.

## 예제 입력 1

\`\`\`
0 0 0 2 6 0 7 0 1
6 8 0 0 7 0 0 9 0
1 9 0 0 0 4 5 0 0
8 2 0 1 0 0 0 4 0
0 0 4 6 0 2 9 0 0
0 5 0 0 0 3 0 2 8
0 0 9 3 0 0 0 7 4
0 4 0 0 5 0 0 3 6
7 0 3 0 1 8 0 0 0
\`\`\`

## 예제 출력 1

\`\`\`
4 3 5 2 6 9 7 8 1
6 8 2 5 7 1 4 9 3
1 9 7 8 3 4 5 6 2
8 2 6 1 9 5 3 4 7
3 7 4 6 8 2 9 1 5
9 5 1 7 4 3 6 2 8
5 1 9 3 2 6 8 7 4
2 4 8 9 5 7 1 3 6
7 6 3 4 1 8 2 5 9
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "0 0 0 2 6 0 7 0 1\n6 8 0 0 7 0 0 9 0\n1 9 0 0 0 4 5 0 0\n8 2 0 1 0 0 0 4 0\n0 0 4 6 0 2 9 0 0\n0 5 0 0 0 3 0 2 8\n0 0 9 3 0 0 0 7 4\n0 4 0 0 5 0 0 3 6\n7 0 3 0 1 8 0 0 0",
        expectedOutput: "4 3 5 2 6 9 7 8 1\n6 8 2 5 7 1 4 9 3\n1 9 7 8 3 4 5 6 2\n8 2 6 1 9 5 3 4 7\n3 7 4 6 8 2 9 1 5\n9 5 1 7 4 3 6 2 8\n5 1 9 3 2 6 8 7 4\n2 4 8 9 5 7 1 3 6\n7 6 3 4 1 8 2 5 9",
        isVisible: true,
      },
      {
        input: "5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9",
        expectedOutput: "5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9",
        isVisible: false,
      },
      {
        input: "0 0 0 0 0 3 0 8 5\n0 0 1 0 2 0 0 0 0\n0 0 0 5 0 7 0 0 0\n0 0 4 0 0 0 1 0 0\n0 9 0 0 0 0 0 0 0\n5 0 0 0 0 0 0 7 3\n0 0 2 0 1 0 0 0 0\n0 0 0 0 4 0 0 0 9\n0 0 0 0 0 0 0 0 0",
        expectedOutput: "2 4 7 1 6 3 9 8 5\n8 5 1 4 2 9 3 6 7\n3 6 9 5 8 7 2 1 4\n6 7 4 2 3 5 1 9 8\n1 9 3 8 7 4 6 5 2\n5 2 8 6 9 1 4 7 3\n9 3 2 7 1 8 5 4 6\n7 1 5 3 4 6 8 2 9\n4 8 6 9 5 2 7 3 1",
        isVisible: false,
      },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "부분 수열의 합 (백트래킹)",
    description: `N개의 자연수가 주어질 때, 그 합이 S인 부분 집합의 수를 구하라. 공집합은 제외한다.

## 입력

첫째 줄에 N과 S가 공백으로 구분되어 주어진다. (1 ≤ N ≤ 20, 1 ≤ S ≤ 1,000,000)

둘째 줄에 N개의 자연수가 공백으로 구분되어 주어진다. (1 ≤ 각 수 ≤ 100,000)

## 출력

합이 S인 부분 집합의 수를 출력한다.

## 예제 입력 1

\`\`\`
5 10
1 2 3 4 5
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 10\n1 2 3 4 5", expectedOutput: "3", isVisible: true },
      { input: "3 6\n1 2 3", expectedOutput: "1", isVisible: false },
      { input: "4 5\n1 2 3 4", expectedOutput: "2", isVisible: false },
      { input: "3 100\n1 2 3", expectedOutput: "0", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "로또",
    description: `서로 다른 K개의 수가 주어질 때, 이 중 6개를 고르는 모든 경우의 수를 사전 순으로 출력하라.

## 입력

여러 개의 테스트 케이스가 주어진다. 각 줄의 첫 번째 수는 K이고, 이후 K개의 수가 공백으로 구분되어 주어진다. (6 ≤ K ≤ 13, 1 ≤ 각 수 ≤ 49) K가 0이면 종료한다.

## 출력

각 테스트 케이스에 대해 모든 조합을 사전 순으로 출력한다. 각 테스트 케이스 사이에 빈 줄을 출력한다.

## 예제 입력 1

\`\`\`
7 1 2 3 4 5 6 7
0
\`\`\`

## 예제 출력 1

\`\`\`
1 2 3 4 5 6
1 2 3 4 5 7
1 2 3 4 6 7
1 2 3 5 6 7
1 2 4 5 6 7
1 3 4 5 6 7
2 3 4 5 6 7
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      {
        input: "7 1 2 3 4 5 6 7\n0",
        expectedOutput: "1 2 3 4 5 6\n1 2 3 4 5 7\n1 2 3 4 6 7\n1 2 3 5 6 7\n1 2 4 5 6 7\n1 3 4 5 6 7\n2 3 4 5 6 7",
        isVisible: true,
      },
      {
        input: "6 1 2 3 4 5 6\n0",
        expectedOutput: "1 2 3 4 5 6",
        isVisible: false,
      },
      {
        input: "8 1 2 3 4 5 6 7 8\n0",
        expectedOutput: "1 2 3 4 5 6\n1 2 3 4 5 7\n1 2 3 4 5 8\n1 2 3 4 6 7\n1 2 3 4 6 8\n1 2 3 4 7 8\n1 2 3 5 6 7\n1 2 3 5 6 8\n1 2 3 5 7 8\n1 2 3 6 7 8\n1 2 4 5 6 7\n1 2 4 5 6 8\n1 2 4 5 7 8\n1 2 4 6 7 8\n1 2 5 6 7 8\n1 3 4 5 6 7\n1 3 4 5 6 8\n1 3 4 5 7 8\n1 3 4 6 7 8\n1 3 5 6 7 8\n1 4 5 6 7 8\n2 3 4 5 6 7\n2 3 4 5 6 8\n2 3 4 5 7 8\n2 3 4 6 7 8\n2 3 5 6 7 8\n2 4 5 6 7 8\n3 4 5 6 7 8",
        isVisible: false,
      },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "암호 만들기",
    description: `알파벳 소문자로 이루어진 암호를 만들려 한다. 암호는 서로 다른 L개의 알파벳 소문자로 구성되며, 모음(a, e, i, o, u)이 적어도 1개, 자음이 적어도 2개 포함되어야 한다. C개의 후보 문자 중 L개를 골라 사전 순으로 가능한 모든 암호를 출력하라.

## 입력

첫째 줄에 L과 C가 공백으로 구분되어 주어진다. (3 ≤ L ≤ C ≤ 15)

둘째 줄에 C개의 알파벳 소문자가 공백으로 구분되어 주어진다.

## 출력

가능한 모든 암호를 사전 순으로 한 줄에 하나씩 출력한다.

## 예제 입력 1

\`\`\`
4 6
a t c i s w
\`\`\`

## 예제 출력 1

\`\`\`
acis
acit
aciw
acst
acsw
actw
aist
aisw
aitw
astw
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 6\na t c i s w", expectedOutput: "acis\nacit\naciw\nacst\nacsw\nactw\naist\naisw\naitw\nastw", isVisible: true },
      { input: "3 4\na b c e", expectedOutput: "abc\nbce", isVisible: false },
      { input: "3 3\na b c", expectedOutput: "abc", isVisible: false },
      { input: "4 4\na e b c", expectedOutput: "abce", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "연산자 끼워넣기",
    description: `N개의 수와 덧셈(+), 뺄셈(-), 곱셈(×), 나눗셈(÷) 연산자의 개수가 주어진다. N개의 수 사이에 연산자를 하나씩 넣어 만들 수 있는 수식의 최댓값과 최솟값을 구하라. 연산자 우선순위 없이 왼쪽에서 오른쪽으로 계산한다. 나눗셈은 정수 나눗셈이며 음수를 양수로 나눌 때는 절댓값을 나눈 후 음수로 만든다.

## 입력

첫째 줄에 N이 주어진다. (2 ≤ N ≤ 11)

둘째 줄에 N개의 수가 공백으로 구분되어 주어진다. (1 ≤ 각 수 ≤ 100)

셋째 줄에 +, -, ×, ÷ 연산자의 개수가 공백으로 구분되어 주어진다. (연산자 총 개수 = N-1)

## 출력

첫째 줄에 최댓값, 둘째 줄에 최솟값을 출력한다.

## 예제 입력 1

\`\`\`
2
5 6
0 0 1 0
\`\`\`

## 예제 출력 1

\`\`\`
30
30
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n5 6\n0 0 1 0", expectedOutput: "30\n30", isVisible: true },
      { input: "3\n3 4 5\n1 0 1 0", expectedOutput: "35\n17", isVisible: false },
      { input: "4\n1 2 3 4\n1 1 1 0", expectedOutput: "8\n0", isVisible: false },
      { input: "2\n5 6\n1 0 0 0", expectedOutput: "11\n11", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "스타트와 링크",
    description: `N명(N은 짝수)을 두 팀으로 나눈다. 각 팀은 N/2명이다. 각 팀의 능력치는 팀원 쌍의 시너지 합이다. 두 팀의 능력치 차이를 최소화하라.

## 입력

첫째 줄에 N이 주어진다. (4 ≤ N ≤ 20, N은 짝수)

둘째 줄부터 N개의 줄에 N×N 능력치 표가 주어진다. S[i][j]는 i번과 j번이 같은 팀일 때의 시너지다. (0 ≤ S[i][j] ≤ 100, S[i][i] = 0)

## 출력

두 팀의 능력치 차이의 최솟값을 출력한다.

## 예제 입력 1

\`\`\`
4
0 1 2 3
4 0 5 6
7 1 0 2
3 4 5 0
\`\`\`

## 예제 출력 1

\`\`\`
0
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n0 1 2 3\n4 0 5 6\n7 1 0 2\n3 4 5 0", expectedOutput: "0", isVisible: true },
      { input: "4\n0 4 9 2\n4 0 6 10\n9 6 0 1\n2 10 1 0", expectedOutput: "2", isVisible: false },
      { input: "4\n0 6 1 7\n4 0 5 4\n8 8 0 3\n3 10 2 0", expectedOutput: "3", isVisible: false },
      { input: "4\n0 0 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0", expectedOutput: "0", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  {
    title: "단어 수학",
    description: `N개의 단어가 있다. 각 단어는 알파벳 대문자로 이루어져 있다. 각 알파벳에 0~9를 대입할 때(서로 다른 알파벳에는 다른 숫자를, 같은 알파벳에는 같은 숫자를), 모든 단어를 숫자로 변환하여 더한 합을 최대화하라. 각 알파벳은 최대 10종류이며, 단어의 첫 번째 자리에는 0이 올 수 없다.

## 입력

첫째 줄에 N이 주어진다. (1 ≤ N ≤ 10)

둘째 줄부터 N개의 줄에 단어가 주어진다. (단어 길이 ≤ 8, 알파벳 대문자, 최대 10종류 알파벳)

## 출력

최댓값을 출력한다.

## 예제 입력 1

\`\`\`
2
GCF
ACDEB
\`\`\`

## 예제 출력 1

\`\`\`
99437
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\nGCF\nACDEB", expectedOutput: "99437", isVisible: true },
      { input: "1\nABC", expectedOutput: "987", isVisible: false },
      { input: "3\nAA\nBB\nCC", expectedOutput: "264", isVisible: false },
      { input: "2\nABCD\nBCDA", expectedOutput: "18744", isVisible: false },
    ],
    tags: ["백트래킹", "그리디"],
  },
];
