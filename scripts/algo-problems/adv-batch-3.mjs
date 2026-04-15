export const problems = [
  // ─── BFS/DFS 기초 (1–15) ──────────────────────────────────────────────────
  {
    title: "DFS와 BFS",
    description: `그래프를 DFS와 BFS로 탐색한 결과를 출력하는 프로그램을 작성하시오. 인접 정점은 번호가 작은 것부터 방문한다.

## 입력

첫째 줄에 정점의 개수 N, 간선의 개수 M, 탐색을 시작할 정점 번호 V가 주어진다.

다음 M개 줄에는 간선이 연결하는 두 정점 번호가 주어진다. 간선은 양방향이다.

- 1 ≤ N ≤ 1,000
- 0 ≤ M ≤ 10,000
- 1 ≤ V ≤ N

## 출력

첫째 줄에 DFS로 방문한 정점 번호를 공백으로 구분해 출력한다.
둘째 줄에 BFS로 방문한 정점 번호를 공백으로 구분해 출력한다.

## 예제 입력 1

\`\`\`
4 5 1
1 2
1 3
1 4
2 4
3 4
\`\`\`

## 예제 출력 1

\`\`\`
1 2 4 3
1 2 3 4
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 5 1\n1 2\n1 3\n1 4\n2 4\n3 4", expectedOutput: "1 2 4 3\n1 2 3 4", isVisible: true },
      { input: "5 5 3\n5 4\n5 2\n1 2\n3 4\n3 1", expectedOutput: "3 1 2 5 4\n3 1 4 2 5", isVisible: false },
      { input: "3 0 1", expectedOutput: "1\n1", isVisible: false },
      { input: "6 6 1\n1 2\n1 3\n2 4\n2 5\n3 6\n4 6", expectedOutput: "1 2 4 6 3 5\n1 2 3 4 5 6", isVisible: false },
    ],
    tags: ["그래프", "BFS", "DFS"],
  },

  {
    title: "연결 요소의 개수",
    description: `방향 없는 그래프가 주어졌을 때 연결 요소의 개수를 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정점의 개수 N과 간선의 개수 M이 주어진다.

다음 M개 줄에는 간선이 연결하는 두 정점 번호가 주어진다.

- 1 ≤ N ≤ 1,000
- 0 ≤ M ≤ N*(N-1)/2

## 출력

첫째 줄에 연결 요소의 개수를 출력한다.

## 예제 입력 1

\`\`\`
6 5
1 2
2 5
5 1
3 4
4 6
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 5\n1 2\n2 5\n5 1\n3 4\n4 6", expectedOutput: "2", isVisible: true },
      { input: "5 0", expectedOutput: "5", isVisible: false },
      { input: "4 4\n1 2\n2 3\n3 4\n4 1", expectedOutput: "1", isVisible: false },
      { input: "7 4\n1 2\n3 4\n5 6\n6 7", expectedOutput: "3", isVisible: false },
    ],
    tags: ["그래프", "BFS", "DFS"],
  },

  {
    title: "그래프 경로 존재 여부",
    description: `무방향 그래프에서 두 정점 s와 t 사이에 경로가 존재하는지 판별하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정점의 개수 N, 간선의 개수 M, 출발 정점 s, 도착 정점 t가 주어진다.

다음 M개 줄에는 간선이 연결하는 두 정점 번호가 주어진다.

- 1 ≤ N ≤ 1,000
- 0 ≤ M ≤ N*(N-1)/2
- 1 ≤ s, t ≤ N

## 출력

경로가 존재하면 \`YES\`, 없으면 \`NO\`를 출력한다.

## 예제 입력 1

\`\`\`
5 4 1 5
1 2
2 3
3 4
4 5
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 4 1 5\n1 2\n2 3\n3 4\n4 5", expectedOutput: "YES", isVisible: true },
      { input: "5 3 1 5\n1 2\n2 3\n4 5", expectedOutput: "NO", isVisible: false },
      { input: "3 0 1 3", expectedOutput: "NO", isVisible: false },
      { input: "4 4 2 4\n1 2\n2 3\n3 4\n1 4", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["그래프", "BFS", "DFS"],
  },

  {
    title: "미로 탐색",
    description: `N×M 크기의 미로에서 (1,1)에서 출발하여 (N,M)까지의 최단 경로를 구하는 프로그램을 작성하시오. 이동은 상하좌우 4방향이다.

미로의 각 칸은 0 또는 1로 표시되며, 1은 이동 가능한 칸, 0은 벽이다. 시작과 끝은 항상 1이다.

## 입력

첫째 줄에 N과 M이 주어진다.

다음 N개 줄에 미로 정보가 주어진다. 각 줄은 M개의 숫자(0 또는 1)로 이루어지며, 붙여 씌어 있다.

- 2 ≤ N, M ≤ 100

## 출력

(1,1)에서 (N,M)까지의 최단 경로에서 방문한 칸의 수(시작과 끝 포함)를 출력한다.

## 예제 입력 1

\`\`\`
4 6
101111
101010
101011
111011
\`\`\`

## 예제 출력 1

\`\`\`
15
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 6\n101111\n101010\n101011\n111011", expectedOutput: "15", isVisible: true },
      { input: "2 2\n11\n11", expectedOutput: "3", isVisible: false },
      { input: "3 3\n111\n010\n111", expectedOutput: "7", isVisible: false },
      { input: "5 5\n11111\n10001\n10101\n10001\n11111", expectedOutput: "17", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "섬의 개수",
    description: `N×M 크기의 격자 지도에서 섬의 개수를 세는 프로그램을 작성하시오.

격자의 각 칸은 0(바다) 또는 1(땅)로 표시된다. 상하좌우와 대각선 8방향으로 연결된 땅 덩어리를 하나의 섬으로 간주한다.

## 입력

첫째 줄에 N과 M이 주어진다.

다음 N개 줄에 M개의 0 또는 1이 공백 없이 주어진다.

- 1 ≤ N, M ≤ 50

## 출력

섬의 개수를 출력한다.

## 예제 입력 1

\`\`\`
5 5
11000
11010
00011
00011
00000
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
      { input: "5 5\n11000\n11010\n00011\n00011\n00000", expectedOutput: "3", isVisible: true },
      { input: "3 3\n110\n010\n011", expectedOutput: "1", isVisible: false },
      { input: "4 4\n1001\n0110\n1001\n0110", expectedOutput: "8", isVisible: false },
      { input: "2 2\n00\n00", expectedOutput: "0", isVisible: false },
    ],
    tags: ["그래프", "DFS"],
  },

  {
    title: "단지번호 붙이기",
    description: `N×N 크기의 지도에서 연결된 집 그룹(단지)의 수와 각 단지에 속하는 집의 수를 출력하는 프로그램을 작성하시오.

지도의 각 칸은 0(빈 땅) 또는 1(집)로 표시된다. 상하좌우로 연결된 집의 그룹을 하나의 단지로 간주한다.

## 입력

첫째 줄에 N이 주어진다.

다음 N개 줄에 N개의 0 또는 1이 공백 없이 주어진다.

- 5 ≤ N ≤ 25

## 출력

첫째 줄에 단지의 수를 출력한다.
둘째 줄부터 각 단지에 속하는 집의 수를 오름차순으로 한 줄에 하나씩 출력한다.

## 예제 입력 1

\`\`\`
7
0110100
0110101
1110101
0000111
0100000
0111110
0111000
\`\`\`

## 예제 출력 1

\`\`\`
3
7
8
9
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7\n0110100\n0110101\n1110101\n0000111\n0100000\n0111110\n0111000", expectedOutput: "3\n7\n8\n9", isVisible: true },
      { input: "5\n10000\n10000\n10000\n10000\n10000", expectedOutput: "1\n5", isVisible: false },
      { input: "5\n11011\n00000\n11011\n00000\n11011", expectedOutput: "6\n2\n2\n2\n2\n2\n2", isVisible: false },
      { input: "5\n00000\n00000\n00000\n00000\n00000", expectedOutput: "0", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "토마토 (2D)",
    description: `M×N 상자에 토마토가 들어있다. 값이 1이면 익은 토마토, 0이면 익지 않은 토마토, -1이면 빈 칸이다.

익은 토마토는 하루가 지나면 인접한(상하좌우) 익지 않은 토마토를 익힌다. 모든 토마토가 익을 때까지 걸리는 최소 일수를 구하시오. 모두 익힐 수 없으면 -1을 출력한다.

## 입력

첫째 줄에 상자의 크기 M(열)과 N(행)이 주어진다.

다음 N개 줄에 M개의 값이 공백으로 구분되어 주어진다.

- 2 ≤ M, N ≤ 1,000

## 출력

최소 일수를 출력한다. 모두 익힐 수 없으면 -1을 출력한다.

## 예제 입력 1

\`\`\`
6 4
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 1
\`\`\`

## 예제 출력 1

\`\`\`
8
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 4\n0 0 0 0 0 0\n0 0 0 0 0 0\n0 0 0 0 0 0\n0 0 0 0 0 1", expectedOutput: "8", isVisible: true },
      { input: "6 4\n0 -1 0 0 0 0\n-1 0 0 0 0 0\n0 0 0 0 -1 0\n0 0 0 0 -1 1", expectedOutput: "-1", isVisible: false },
      { input: "3 3\n1 1 1\n1 1 1\n1 1 1", expectedOutput: "0", isVisible: false },
      { input: "4 3\n0 0 0 0\n0 0 0 0\n1 0 0 0", expectedOutput: "5", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "토마토 (3D)",
    description: `M×N×H 크기의 3차원 상자에 토마토가 있다. 값이 1이면 익은 토마토, 0이면 익지 않은 토마토, -1이면 빈 칸이다.

익은 토마토는 하루가 지나면 인접한(상하좌우앞뒤, 6방향) 익지 않은 토마토를 익힌다. 모든 토마토가 익는 최소 일수를 구하시오.

## 입력

첫째 줄에 M(열), N(행), H(층)이 주어진다.

다음 H개 층에 대해 N×M 행렬이 주어지며, 층 사이에는 빈 줄이 없다.

- 1 ≤ M, N, H ≤ 100

## 출력

최소 일수를 출력한다. 모두 익힐 수 없으면 -1을 출력한다.

## 예제 입력 1

\`\`\`
5 3 2
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 1
\`\`\`

## 예제 출력 1

\`\`\`
9
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3 2\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 1", expectedOutput: "9", isVisible: true },
      { input: "3 3 3\n1 1 1\n1 1 1\n1 1 1\n1 1 1\n1 1 1\n1 1 1\n1 1 1\n1 1 1\n1 1 1", expectedOutput: "0", isVisible: false },
      { input: "2 2 2\n0 0\n0 0\n0 0\n0 1", expectedOutput: "3", isVisible: false },
      { input: "2 2 2\n0 0\n0 -1\n0 0\n-1 0", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "나이트의 이동",
    description: `체스판 위에 나이트가 있다. 나이트는 L자 형태로 이동한다. L×L 크기의 체스판에서 나이트가 시작 위치에서 목표 위치까지 이동하는 최소 횟수를 구하시오.

나이트는 (r, c)에서 (r±1, c±2) 또는 (r±2, c±1)으로 이동할 수 있다.

## 입력

첫째 줄에 테스트 케이스의 수 T가 주어진다.

각 테스트 케이스의 첫째 줄에 체스판 크기 L이 주어진다.
다음 줄에 나이트의 현재 위치 (r1, c1)이 주어진다.
다음 줄에 목표 위치 (r2, c2)가 주어진다.

- 1 ≤ L ≤ 300
- 0 ≤ r1, c1, r2, c2 < L

## 출력

각 테스트 케이스마다 최소 이동 횟수를 출력한다.

## 예제 입력 1

\`\`\`
3
8
0 0
7 0
100
0 0
99 99
3
0 0
2 2
\`\`\`

## 예제 출력 1

\`\`\`
5
66
4
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n8\n0 0\n7 0\n100\n0 0\n99 99\n3\n0 0\n2 2", expectedOutput: "5\n66\n4", isVisible: true },
      { input: "1\n5\n0 0\n4 4", expectedOutput: "4", isVisible: false },
      { input: "2\n1\n0 0\n0 0\n300\n0 0\n299 299", expectedOutput: "0\n200", isVisible: false },
      { input: "1\n4\n1 1\n2 3", expectedOutput: "1", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "숨바꼭질",
    description: `수빈이는 동생과 숨바꼭질을 한다. 수빈이는 수직선 위 N에 있고, 동생은 K에 있다.

수빈이는 1초에 위치 X에서 X-1, X+1, 또는 2*X로 이동할 수 있다. 수빈이가 동생을 찾는 최소 시간을 구하시오.

## 입력

첫째 줄에 수빈이의 위치 N과 동생의 위치 K가 주어진다.

- 0 ≤ N, K ≤ 100,000

## 출력

수빈이가 동생을 찾는 최소 시간을 출력한다.

## 예제 입력 1

\`\`\`
5 17
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 17", expectedOutput: "4", isVisible: true },
      { input: "5 5", expectedOutput: "0", isVisible: false },
      { input: "0 100000", expectedOutput: "18", isVisible: false },
      { input: "10 1", expectedOutput: "9", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "이분 그래프 판별",
    description: `그래프가 이분 그래프인지 판별하는 프로그램을 작성하시오.

이분 그래프란 모든 정점을 두 그룹으로 나누어, 같은 그룹 안의 정점들이 인접하지 않도록 만들 수 있는 그래프이다.

그래프가 여러 개의 연결 요소로 이루어져 있을 수 있다.

## 입력

첫째 줄에 테스트 케이스의 수 K가 주어진다.

각 테스트 케이스의 첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 두 정점 번호가 주어진다.

- 1 ≤ N ≤ 20,000
- 0 ≤ M ≤ 200,000

## 출력

각 테스트 케이스마다 이분 그래프이면 \`YES\`, 아니면 \`NO\`를 출력한다.

## 예제 입력 1

\`\`\`
2
3 2
1 3
2 3
4 4
1 2
2 3
3 4
4 2
\`\`\`

## 예제 출력 1

\`\`\`
YES
NO
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n3 2\n1 3\n2 3\n4 4\n1 2\n2 3\n3 4\n4 2", expectedOutput: "YES\nNO", isVisible: true },
      { input: "1\n6 6\n1 2\n2 3\n3 4\n4 5\n5 6\n6 1", expectedOutput: "YES", isVisible: false },
      { input: "1\n5 5\n1 2\n2 3\n3 4\n4 5\n5 1", expectedOutput: "NO", isVisible: false },
      { input: "1\n4 0", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "영역 구하기",
    description: `N×M 직사각형 영역에 K개의 직사각형이 칠해져 있다. 칠해지지 않은 영역이 몇 개로 나뉘는지, 각 영역의 넓이는 얼마인지 구하시오.

## 입력

첫째 줄에 N(세로), M(가로), K가 주어진다.

다음 K개 줄에 각 직사각형을 나타내는 4개의 정수 x1, y1, x2, y2가 주어진다. (x1, y1)이 왼쪽 아래, (x2, y2)가 오른쪽 위 꼭짓점이다.

- 1 ≤ M, N ≤ 100
- 1 ≤ K ≤ 100

## 출력

첫째 줄에 분리된 영역의 수를 출력한다.
둘째 줄에 각 영역의 넓이를 오름차순으로 공백으로 구분해 출력한다.

## 예제 입력 1

\`\`\`
7 7 3
0 2 4 4
1 1 2 5
4 0 6 2
\`\`\`

## 예제 출력 1

\`\`\`
3
1 4 13
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7 7 3\n0 2 4 4\n1 1 2 5\n4 0 6 2", expectedOutput: "3\n1 4 13", isVisible: true },
      { input: "5 5 1\n0 0 5 5", expectedOutput: "0\n", isVisible: false },
      { input: "10 10 2\n0 0 5 5\n5 5 10 10", expectedOutput: "3\n25 25 50", isVisible: false },
      { input: "5 5 0", expectedOutput: "1\n25", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "안전 영역",
    description: `N×N 크기의 지도에 높이 값이 주어진다. 비의 높이가 h일 때, 높이가 h 이하인 모든 칸은 잠긴다. 잠기지 않은 안전 영역의 수가 최대가 되도록 하는 h를 찾고, 그 때의 안전 영역 수를 출력하시오.

## 입력

첫째 줄에 N이 주어진다.

다음 N개 줄에 각 칸의 높이가 공백으로 구분되어 주어진다.

- 2 ≤ N ≤ 100
- 높이는 1 이상 100 이하인 정수

## 출력

안전 영역의 최대 수를 출력한다.

## 예제 입력 1

\`\`\`
5
6 8 2 6 2
3 2 3 4 6
6 7 3 3 2
7 2 5 3 6
8 9 5 2 7
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
      { input: "5\n6 8 2 6 2\n3 2 3 4 6\n6 7 3 3 2\n7 2 5 3 6\n8 9 5 2 7", expectedOutput: "5", isVisible: true },
      { input: "2\n1 1\n1 1", expectedOutput: "1", isVisible: false },
      { input: "3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "1", isVisible: false },
      { input: "4\n5 1 5 5\n1 1 1 5\n5 1 5 5\n5 5 5 5", expectedOutput: "2", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "촌수 계산",
    description: `가족 관계 트리에서 두 사람의 촌수를 구하는 프로그램을 작성하시오.

촌수는 두 사람 사이의 간선 수이다. 관계가 없으면 -1을 출력한다.

## 입력

첫째 줄에 전체 사람의 수 N이 주어진다.
둘째 줄에 촌수를 구해야 하는 두 사람 A, B가 주어진다.
셋째 줄에 부모-자식 쌍의 수 M이 주어진다.
다음 M개 줄에 각 부모-자식 쌍이 주어진다.

- 1 ≤ N ≤ 100
- 1 ≤ A, B ≤ N

## 출력

두 사람의 촌수를 출력한다. 관계가 없으면 -1을 출력한다.

## 예제 입력 1

\`\`\`
9
7 3
7
1 2
1 3
2 7
2 8
3 9
4 5
4 6
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
      { input: "9\n7 3\n7\n1 2\n1 3\n2 7\n2 8\n3 9\n4 5\n4 6", expectedOutput: "3", isVisible: true },
      { input: "9\n7 5\n7\n1 2\n1 3\n2 7\n2 8\n3 9\n4 5\n4 6", expectedOutput: "-1", isVisible: false },
      { input: "4\n1 4\n3\n1 2\n2 3\n3 4", expectedOutput: "3", isVisible: false },
      { input: "3\n1 1\n2\n1 2\n2 3", expectedOutput: "0", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "트리의 부모 찾기",
    description: `루트가 1인 트리가 주어진다. 각 노드의 부모 노드 번호를 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 노드의 수 N이 주어진다.

다음 N-1개 줄에 트리 상에서 연결된 두 노드 번호가 주어진다.

- 2 ≤ N ≤ 100,000

## 출력

2번 노드부터 N번 노드까지 순서대로 각 노드의 부모 번호를 한 줄에 하나씩 출력한다.

## 예제 입력 1

\`\`\`
7
1 6
6 3
3 5
4 1
2 4
4 7
\`\`\`

## 예제 출력 1

\`\`\`
4
6
1
3
1
3
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7\n1 6\n6 3\n3 5\n4 1\n2 4\n4 7", expectedOutput: "4\n6\n1\n3\n1\n3", isVisible: true },
      { input: "4\n1 2\n2 3\n3 4", expectedOutput: "1\n2\n3", isVisible: false },
      { input: "5\n1 2\n1 3\n1 4\n1 5", expectedOutput: "1\n1\n1\n1", isVisible: false },
      { input: "6\n1 2\n1 3\n2 4\n2 5\n3 6", expectedOutput: "1\n1\n2\n2\n3", isVisible: false },
    ],
    tags: ["그래프", "BFS", "트리"],
  },

  // ─── 최단 경로 (16–30) ────────────────────────────────────────────────────
  {
    title: "다익스트라 (기본)",
    description: `방향 가중 그래프에서 정점 1에서 정점 N까지의 최단 거리를 구하는 프로그램을 작성하시오. 간선의 가중치는 양수이다.

도달할 수 없으면 \`-1\`을 출력한다.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 출발 정점 u, 도착 정점 v, 가중치 w가 주어진다.

- 1 ≤ N ≤ 20,000
- 1 ≤ M ≤ 300,000
- 1 ≤ w ≤ 10,000

## 출력

정점 1에서 정점 N까지의 최단 거리를 출력한다. 도달할 수 없으면 -1을 출력한다.

## 예제 입력 1

\`\`\`
5 6
1 2 2
1 3 3
2 3 1
2 4 5
3 4 1
4 5 3
\`\`\`

## 예제 출력 1

\`\`\`
9
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 6\n1 2 2\n1 3 3\n2 3 1\n2 4 5\n3 4 1\n4 5 3", expectedOutput: "9", isVisible: true },
      { input: "3 2\n1 2 5\n2 3 10", expectedOutput: "15", isVisible: false },
      { input: "3 1\n1 2 5", expectedOutput: "-1", isVisible: false },
      { input: "4 5\n1 2 1\n1 3 4\n2 3 2\n2 4 6\n3 4 1", expectedOutput: "4", isVisible: false },
    ],
    tags: ["그래프", "다익스트라"],
  },

  {
    title: "최단 경로 (모든 정점)",
    description: `방향 가중 그래프에서 시작점 v에서 모든 정점까지의 최단 거리를 구하는 프로그램을 작성하시오.

도달할 수 없는 정점에 대해서는 \`INF\`를 출력한다.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.
둘째 줄에 시작 정점 번호 v가 주어진다.

다음 M개 줄에 간선의 출발 정점 u, 도착 정점 w, 가중치 d가 주어진다. 같은 두 정점 사이에 여러 간선이 있을 수 있다.

- 1 ≤ N ≤ 20,000
- 1 ≤ M ≤ 300,000
- 1 ≤ d ≤ 10,000

## 출력

1번 정점부터 N번 정점까지 차례로 최단 거리를 한 줄에 하나씩 출력한다.

## 예제 입력 1

\`\`\`
5 6
1
5 1 1
1 2 2
1 3 3
2 3 4
2 4 5
3 4 6
\`\`\`

## 예제 출력 1

\`\`\`
0
2
3
7
INF
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 6\n1\n5 1 1\n1 2 2\n1 3 3\n2 3 4\n2 4 5\n3 4 6", expectedOutput: "0\n2\n3\n7\nINF", isVisible: true },
      { input: "3 3\n1\n1 2 3\n1 3 10\n2 3 5", expectedOutput: "0\n3\n8", isVisible: false },
      { input: "4 2\n2\n2 3 5\n3 4 2", expectedOutput: "INF\n0\n5\n7", isVisible: false },
      { input: "3 0\n1", expectedOutput: "0\nINF\nINF", isVisible: false },
    ],
    tags: ["그래프", "다익스트라"],
  },

  {
    title: "플로이드-워셜",
    description: `N개의 정점과 방향 가중 간선으로 이루어진 그래프에서 모든 쌍의 최단 거리를 구하는 프로그램을 작성하시오.

경로가 존재하지 않으면 \`0\`을 출력한다. 자기 자신으로의 거리는 0이다.

## 입력

첫째 줄에 정점의 수 N이 주어진다.
둘째 줄에 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 출발 정점 a, 도착 정점 b, 가중치 c가 주어진다. 같은 두 정점 사이에 여러 간선이 있을 수 있으며, 가장 짧은 것만 고려한다.

- 1 ≤ N ≤ 100
- 1 ≤ M ≤ 100 * 100
- 1 ≤ c ≤ 10,000

## 출력

N개의 줄에 각각 N개의 최단 거리를 공백으로 구분해 출력한다. 경로가 없으면 0을 출력한다.

## 예제 입력 1

\`\`\`
4
7
1 2 4
1 4 6
2 1 3
2 3 7
3 1 5
3 4 2
4 3 1
\`\`\`

## 예제 출력 1

\`\`\`
0 4 7 6
3 0 7 9
5 9 0 2
6 10 1 0
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n7\n1 2 4\n1 4 6\n2 1 3\n2 3 7\n3 1 5\n3 4 2\n4 3 1", expectedOutput: "0 4 7 6\n3 0 7 9\n5 9 0 2\n6 10 1 0", isVisible: true },
      { input: "3\n3\n1 2 5\n2 3 3\n1 3 10", expectedOutput: "0 5 8\n0 0 3\n0 0 0", isVisible: false },
      { input: "3\n0", expectedOutput: "0 0 0\n0 0 0\n0 0 0", isVisible: false },
      { input: "3\n4\n1 2 2\n2 3 3\n3 1 4\n1 3 100", expectedOutput: "0 2 5\n7 0 3\n4 6 0", isVisible: false },
    ],
    tags: ["그래프", "플로이드"],
  },

  {
    title: "경로 찾기",
    description: `방향 그래프가 주어졌을 때, 모든 정점 쌍 (i, j)에 대해 i에서 j로 가는 경로가 존재하는지 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정점의 수 N이 주어진다.
둘째 줄에 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 출발 정점과 도착 정점이 주어진다.

- 1 ≤ N ≤ 100
- 1 ≤ M ≤ N*(N-1)

## 출력

N×N 행렬을 출력한다. i에서 j로 가는 경로가 존재하면 1, 없으면 0을 출력한다. 자기 자신으로의 경로는 1이다.

## 예제 입력 1

\`\`\`
4
5
1 2
1 3
2 3
3 4
4 2
\`\`\`

## 예제 출력 1

\`\`\`
1 1 1 1
0 1 1 1
0 1 1 1
0 1 1 1
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n5\n1 2\n1 3\n2 3\n3 4\n4 2", expectedOutput: "1 1 1 1\n0 1 1 1\n0 1 1 1\n0 1 1 1", isVisible: true },
      { input: "3\n0", expectedOutput: "1 0 0\n0 1 0\n0 0 1", isVisible: false },
      { input: "3\n3\n1 2\n2 3\n3 1", expectedOutput: "1 1 1\n1 1 1\n1 1 1", isVisible: false },
      { input: "4\n2\n1 2\n3 4", expectedOutput: "1 1 0 0\n0 1 0 0\n0 0 1 1\n0 0 0 1", isVisible: false },
    ],
    tags: ["그래프", "플로이드"],
  },

  {
    title: "특정 정점 경유",
    description: `방향 가중 그래프에서 1번 정점에서 출발하여 v1을 거쳐 v2를 거쳐 N번 정점에 도달하는 최단 경로, 또는 1번 정점에서 v2를 거쳐 v1을 거쳐 N번 정점에 도달하는 최단 경로 중 더 짧은 것을 구하시오.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 E가 주어진다.

다음 E개 줄에 간선의 출발 정점 a, 도착 정점 b, 가중치 c가 주어진다.

마지막 줄에 v1과 v2가 주어진다.

- 1 ≤ N ≤ 800
- 1 ≤ E ≤ 200,000
- 1 ≤ c ≤ 1,000

## 출력

최단 경로의 거리를 출력한다. 경로가 존재하지 않으면 -1을 출력한다.

## 예제 입력 1

\`\`\`
4 6
1 2 3
2 3 3
3 4 1
1 3 10
1 4 20
2 4 5
2 3
\`\`\`

## 예제 출력 1

\`\`\`
7
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 6\n1 2 3\n2 3 3\n3 4 1\n1 3 10\n1 4 20\n2 4 5\n2 3", expectedOutput: "7", isVisible: true },
      { input: "3 2\n1 2 5\n2 3 5\n2 3", expectedOutput: "10", isVisible: false },
      { input: "3 2\n1 2 5\n2 3 5\n3 2", expectedOutput: "-1", isVisible: false },
      { input: "5 7\n1 2 2\n1 3 3\n2 4 4\n3 4 1\n4 5 2\n2 5 10\n3 5 8\n2 3", expectedOutput: "8", isVisible: false },
    ],
    tags: ["그래프", "다익스트라"],
  },

  {
    title: "최소 비용 구하기",
    description: `N개의 도시가 있고, 도시 A에서 도시 B로 가는 버스가 M개 있다. 도시 A에서 도시 B까지 가는 데 드는 최소 비용을 구하시오.

## 입력

첫째 줄에 도시의 수 N이 주어진다.
둘째 줄에 버스 노선의 수 M이 주어진다.
다음 M개 줄에 출발 도시, 도착 도시, 비용이 주어진다.
마지막 줄에 출발 도시 A와 도착 도시 B가 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ M ≤ 100,000
- 0 ≤ 비용 ≤ 100,000

## 출력

A에서 B까지 가는 최소 비용을 출력한다.

## 예제 입력 1

\`\`\`
5
8
1 2 2
1 3 3
1 4 1
2 3 4
3 4 1
3 5 1
4 5 2
3 5 1
1 5
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
      { input: "5\n8\n1 2 2\n1 3 3\n1 4 1\n2 3 4\n3 4 1\n3 5 1\n4 5 2\n3 5 1\n1 5", expectedOutput: "4", isVisible: true },
      { input: "3\n3\n1 2 5\n2 3 3\n1 3 10\n1 3", expectedOutput: "8", isVisible: false },
      { input: "4\n4\n1 2 1\n2 3 2\n3 4 3\n1 4 10\n1 4", expectedOutput: "6", isVisible: false },
      { input: "2\n1\n1 2 7\n1 2", expectedOutput: "7", isVisible: false },
    ],
    tags: ["그래프", "다익스트라"],
  },

  {
    title: "벨만-포드",
    description: `방향 가중 그래프 (음수 간선 가능)에서 시작 정점 S에서 모든 정점까지의 최단 거리를 구하는 프로그램을 작성하시오.

음수 사이클이 존재하면 \`-1\`을 출력한다. 도달할 수 없는 정점의 거리는 출력하지 않는다.

## 입력

첫째 줄에 정점의 수 N, 간선의 수 M, 시작 정점 S가 주어진다.

다음 M개 줄에 간선의 출발 정점 u, 도착 정점 v, 가중치 w가 주어진다.

- 1 ≤ N ≤ 500
- 1 ≤ M ≤ 6,000
- -10,000 ≤ w ≤ 10,000

## 출력

음수 사이클이 있으면 \`-1\`을 출력한다. 없으면 시작 정점을 제외한 각 정점까지의 최단 거리를 정점 번호 순으로 한 줄에 하나씩 출력한다. 도달할 수 없으면 \`INF\`를 출력한다.

## 예제 입력 1

\`\`\`
5 5 1
1 2 -1
2 3 -2
3 4 -3
4 5 5
5 1 3
\`\`\`

## 예제 출력 1

\`\`\`
-1
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 5 1\n1 2 -1\n2 3 -2\n3 4 -3\n4 5 5\n5 1 3", expectedOutput: "-1", isVisible: true },
      { input: "3 3 1\n1 2 5\n2 3 -3\n1 3 10", expectedOutput: "5\n2", isVisible: false },
      { input: "4 4 1\n1 2 3\n2 3 2\n1 3 10\n3 4 1", expectedOutput: "3\n5\n6", isVisible: false },
      { input: "3 2 1\n1 2 4\n1 3 7", expectedOutput: "4\n7", isVisible: false },
    ],
    tags: ["그래프", "벨만-포드"],
  },

  {
    title: "타임머신",
    description: `N개의 도시와 M개의 버스 노선이 있다. 일부 버스는 음수 비용을 가질 수 있다. 1번 도시에서 출발하여 각 도시까지의 최소 비용을 구하시오.

음수 사이클이 존재하는 경우 \`IMPOSSIBLE\`을 출력한다.

## 입력

첫째 줄에 도시의 수 N과 버스 노선의 수 M이 주어진다.

다음 M개 줄에 버스 노선의 출발 도시 A, 도착 도시 B, 비용 C가 주어진다.

- 1 ≤ N ≤ 500
- 1 ≤ M ≤ 6,000
- -10,000 ≤ C ≤ 10,000

## 출력

음수 사이클이 있으면 \`IMPOSSIBLE\`을 출력한다. 없으면 2번 도시부터 N번 도시까지 차례로 최솟값을 출력한다. 도달할 수 없으면 \`INF\`를 출력한다.

## 예제 입력 1

\`\`\`
3 4
1 2 4
1 3 3
2 3 -1
3 2 -2
\`\`\`

## 예제 출력 1

\`\`\`
IMPOSSIBLE
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4\n1 2 4\n1 3 3\n2 3 -1\n3 2 -2", expectedOutput: "IMPOSSIBLE", isVisible: true },
      { input: "3 3\n1 2 5\n1 3 10\n2 3 3", expectedOutput: "5\n8", isVisible: false },
      { input: "4 4\n1 2 1\n2 3 2\n3 4 3\n1 4 100", expectedOutput: "1\n3\n6", isVisible: false },
      { input: "3 1\n1 2 7", expectedOutput: "7\nINF", isVisible: false },
    ],
    tags: ["그래프", "벨만-포드"],
  },

  {
    title: "최단 경로 역추적",
    description: `방향 가중 그래프에서 1번 정점에서 N번 정점까지의 최단 경로 길이와 실제 경로를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 출발 정점 u, 도착 정점 v, 가중치 w가 주어진다. 가중치는 양수이다.

- 1 ≤ N ≤ 1,000
- 1 ≤ M ≤ N*(N-1)
- 1 ≤ w ≤ 1,000

## 출력

첫째 줄에 최단 경로의 길이를 출력한다.
둘째 줄에 경로에 포함된 정점 번호를 공백으로 구분해 출력한다.

도달할 수 없으면 \`-1\`을 출력한다.

## 예제 입력 1

\`\`\`
5 7
1 2 3
1 3 5
2 3 1
2 4 6
3 4 2
3 5 8
4 5 4
\`\`\`

## 예제 출력 1

\`\`\`
10
1 2 3 4 5
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 7\n1 2 3\n1 3 5\n2 3 1\n2 4 6\n3 4 2\n3 5 8\n4 5 4", expectedOutput: "10\n1 2 3 4 5", isVisible: true },
      { input: "3 2\n1 2 5\n2 3 3", expectedOutput: "8\n1 2 3", isVisible: false },
      { input: "3 1\n1 2 5", expectedOutput: "-1", isVisible: false },
      { input: "4 4\n1 2 1\n1 3 4\n2 4 3\n3 4 1", expectedOutput: "4\n1 2 4", isVisible: false },
    ],
    tags: ["그래프", "다익스트라"],
  },

  {
    title: "K번째 최단 경로",
    description: `방향 가중 그래프에서 정점 s에서 정점 t까지의 K번째 최단 경로의 길이를 구하는 프로그램을 작성하시오.

경로는 같은 정점을 여러 번 방문할 수 있다. K번째 최단 경로가 존재하지 않으면 \`-1\`을 출력한다.

## 입력

첫째 줄에 정점의 수 N, 간선의 수 M, K가 주어진다.
둘째 줄에 출발 정점 s, 도착 정점 t가 주어진다.

다음 M개 줄에 간선의 출발 정점, 도착 정점, 가중치가 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ M ≤ 2,000
- 1 ≤ K ≤ 10
- 1 ≤ 가중치 ≤ 1,000

## 출력

K번째 최단 경로의 길이를 출력한다. 존재하지 않으면 -1을 출력한다.

## 예제 입력 1

\`\`\`
4 6 2
1 4
1 2 1
1 3 2
2 4 5
3 4 3
2 3 1
3 2 1
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 6 2\n1 4\n1 2 1\n1 3 2\n2 4 5\n3 4 3\n2 3 1\n3 2 1", expectedOutput: "6", isVisible: true },
      { input: "3 3 1\n1 3\n1 2 2\n2 3 3\n1 3 10", expectedOutput: "5", isVisible: false },
      { input: "3 3 5\n1 3\n1 2 2\n2 3 3\n1 3 10", expectedOutput: "22", isVisible: false },
      { input: "2 1 3\n1 2\n1 2 1", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["그래프", "다익스트라", "우선순위 큐"],
  },

  {
    title: "웜홀",
    description: `농부 존의 농장에는 N개의 지점과 M개의 양방향 도로, W개의 단방향 웜홀이 있다. 웜홀을 통과하면 시간이 음수만큼 감소한다. 어떤 지점에서 출발해 동일 지점으로 돌아올 때 시간이 되돌아가는지 판별하시오.

## 입력

첫째 줄에 테스트 케이스 수 TC가 주어진다.

각 테스트 케이스의 첫째 줄에 지점 수 N, 도로 수 M, 웜홀 수 W가 주어진다.
다음 M개 줄에 양방향 도로의 두 지점과 이동 시간이 주어진다.
다음 W개 줄에 웜홀의 출발 지점, 도착 지점, 감소 시간이 주어진다.

- 1 ≤ N ≤ 500
- 1 ≤ M ≤ 2,500
- 1 ≤ W ≤ 200
- 1 ≤ 이동시간 ≤ 10,000
- 1 ≤ 감소시간 ≤ 10,000

## 출력

각 테스트 케이스마다 시간이 되돌아갈 수 있으면 \`YES\`, 없으면 \`NO\`를 출력한다.

## 예제 입력 1

\`\`\`
2
3 3 1
1 2 2
1 3 4
2 3 1
3 1 3
3 3 2
1 2 4
1 3 8
2 3 1
3 1 5
3 2 5
\`\`\`

## 예제 출력 1

\`\`\`
NO
YES
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n3 3 1\n1 2 2\n1 3 4\n2 3 1\n3 1 3\n3 3 2\n1 2 4\n1 3 8\n2 3 1\n3 1 5\n3 2 5", expectedOutput: "NO\nYES", isVisible: true },
      { input: "1\n2 1 1\n1 2 10\n2 1 5", expectedOutput: "YES", isVisible: false },
      { input: "1\n4 4 1\n1 2 3\n2 3 4\n3 4 5\n4 1 6\n2 4 100", expectedOutput: "NO", isVisible: false },
      { input: "1\n3 2 1\n1 2 5\n2 3 5\n3 1 1", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["그래프", "벨만-포드"],
  },

  {
    title: "알고스팟 미로",
    description: `N×M 격자 미로에서 (0,0)에서 (N-1,M-1)까지 이동한다. 0은 빈 방, 1은 벽이다. 벽을 부수고 이동할 수 있으며, 부순 벽의 수를 최소화하시오. 이동은 상하좌우 4방향이다.

## 입력

첫째 줄에 N과 M이 주어진다.

다음 N개 줄에 M개의 0 또는 1이 공백 없이 주어진다.

- 1 ≤ N, M ≤ 100

## 출력

(0,0)에서 (N-1,M-1)까지 이동하면서 부수어야 하는 벽의 최소 수를 출력한다.

## 예제 입력 1

\`\`\`
3 3
011
111
110
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
      { input: "3 3\n011\n111\n110", expectedOutput: "3", isVisible: true },
      { input: "2 2\n00\n00", expectedOutput: "0", isVisible: false },
      { input: "3 3\n111\n111\n111", expectedOutput: "4", isVisible: false },
      { input: "4 4\n0110\n1110\n1100\n0001", expectedOutput: "3", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "녹색 옷 입은 애가 젤다지?",
    description: `N×N 격자가 있다. 각 칸에는 이동 비용이 있다. (0,0)에서 (N-1,N-1)까지 이동하는 최소 비용 경로를 구하시오. 이동은 상하좌우 4방향이다.

## 입력

첫째 줄에 N이 주어진다.

다음 N개 줄에 각 칸의 비용이 공백으로 구분되어 주어진다.

- 2 ≤ N ≤ 125
- 1 ≤ 비용 ≤ 100

## 출력

최소 비용을 출력한다.

## 예제 입력 1

\`\`\`
4
1 2 3 1
1 3 1 1
1 1 1 5
1 2 2 1
\`\`\`

## 예제 출력 1

\`\`\`
9
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n1 2 3 1\n1 3 1 1\n1 1 1 5\n1 2 2 1", expectedOutput: "9", isVisible: true },
      { input: "2\n1 2\n3 1", expectedOutput: "4", isVisible: false },
      { input: "3\n1 1 1\n1 100 1\n1 1 1", expectedOutput: "5", isVisible: false },
      { input: "3\n9 1 1\n1 9 1\n1 1 9", expectedOutput: "13", isVisible: false },
    ],
    tags: ["그래프", "다익스트라"],
  },

  {
    title: "벽 부수고 이동하기",
    description: `N×M 미로에서 (1,1)에서 (N,M)까지 이동하는 최단 거리를 구하시오. 1은 벽, 0은 빈 칸이다. 벽을 최대 1개 부수고 이동할 수 있다. 도달할 수 없으면 -1을 출력한다.

## 입력

첫째 줄에 N과 M이 주어진다.

다음 N개 줄에 M개의 0 또는 1이 공백 없이 주어진다.

- 1 ≤ N, M ≤ 1,000

## 출력

최단 거리를 출력한다. 도달할 수 없으면 -1을 출력한다.

## 예제 입력 1

\`\`\`
6 4
0100
1110
1000
0000
0111
0000
\`\`\`

## 예제 출력 1

\`\`\`
15
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 4\n0100\n1110\n1000\n0000\n0111\n0000", expectedOutput: "15", isVisible: true },
      { input: "4 4\n0000\n0000\n0000\n0000", expectedOutput: "7", isVisible: false },
      { input: "4 4\n0111\n1111\n1111\n1110", expectedOutput: "-1", isVisible: false },
      { input: "3 3\n010\n010\n010", expectedOutput: "5", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  {
    title: "거의 최단 경로",
    description: `방향 가중 그래프에서 s에서 t까지 최단 경로를 구한 뒤, 그 최단 경로에 사용된 모든 간선을 제거하고 새로운 최단 경로를 구하시오.

경로가 없으면 \`-1\`을 출력한다.

## 입력

여러 테스트 케이스가 주어진다. 각 테스트 케이스의 첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다. (0 0이 주어지면 종료)

둘째 줄에 시작 정점 s와 도착 정점 t가 주어진다.

다음 M개 줄에 간선의 출발 정점 u, 도착 정점 v, 가중치 d가 주어진다.

- 1 ≤ N ≤ 500
- 1 ≤ M ≤ 10,000
- 1 ≤ d ≤ 10,000

## 출력

각 테스트 케이스마다 거의 최단 경로의 길이를 출력한다.

## 예제 입력 1

\`\`\`
7 9
0 6
0 1 1
0 2 2
0 3 3
1 4 4
2 4 3
3 5 2
4 6 4
5 6 1
4 5 2
0 0
\`\`\`

## 예제 출력 1

\`\`\`
11
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7 9\n0 6\n0 1 1\n0 2 2\n0 3 3\n1 4 4\n2 4 3\n3 5 2\n4 6 4\n5 6 1\n4 5 2\n0 0", expectedOutput: "11", isVisible: true },
      { input: "4 4\n0 3\n0 1 1\n1 3 1\n0 2 2\n2 3 2\n0 0", expectedOutput: "4", isVisible: false },
      { input: "3 2\n0 2\n0 1 1\n1 2 1\n0 0", expectedOutput: "-1", isVisible: false },
      { input: "5 6\n0 4\n0 1 1\n1 2 1\n2 4 1\n0 3 2\n3 4 2\n1 3 1\n0 0", expectedOutput: "4", isVisible: false },
    ],
    tags: ["그래프", "다익스트라"],
  },

  // ─── MST / 위상정렬 / 그래프 응용 (31–50) ────────────────────────────────
  {
    title: "최소 신장 트리 (크루스칼)",
    description: `N개의 정점과 M개의 무방향 가중 간선으로 이루어진 그래프에서 최소 신장 트리(MST)의 비용을 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정점의 수 V와 간선의 수 E가 주어진다.

다음 E개 줄에 간선이 연결하는 두 정점 번호와 가중치가 주어진다.

- 1 ≤ V ≤ 10,000
- 1 ≤ E ≤ 100,000
- 1 ≤ 가중치 ≤ 100

## 출력

MST의 비용을 출력한다.

## 예제 입력 1

\`\`\`
3 3
1 2 1
2 3 2
1 3 3
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 3\n1 2 1\n2 3 2\n1 3 3", expectedOutput: "3", isVisible: true },
      { input: "4 5\n1 2 3\n1 3 1\n2 3 2\n2 4 4\n3 4 5", expectedOutput: "8", isVisible: false },
      { input: "5 7\n1 2 1\n1 3 4\n2 3 2\n2 4 5\n3 4 1\n3 5 3\n4 5 2", expectedOutput: "7", isVisible: false },
      { input: "2 1\n1 2 10", expectedOutput: "10", isVisible: false },
    ],
    tags: ["그래프", "MST", "유니온파인드"],
  },

  {
    title: "네트워크 연결",
    description: `N개의 컴퓨터와 M개의 연결 비용이 주어진다. 모든 컴퓨터를 최소 비용으로 연결하는 프로그램을 작성하시오.

## 입력

첫째 줄에 컴퓨터의 수 N이 주어진다.
둘째 줄에 연결 정보의 수 M이 주어진다.

다음 M개 줄에 연결 가능한 두 컴퓨터 번호와 비용이 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ M ≤ 100,000
- 비용 ≤ 1,000

## 출력

모든 컴퓨터를 연결하는 최소 비용을 출력한다.

## 예제 입력 1

\`\`\`
6
9
1 2 5
1 3 4
2 3 2
2 4 7
3 4 6
3 5 11
4 5 3
4 6 8
5 6 8
\`\`\`

## 예제 출력 1

\`\`\`
23
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n9\n1 2 5\n1 3 4\n2 3 2\n2 4 7\n3 4 6\n3 5 11\n4 5 3\n4 6 8\n5 6 8", expectedOutput: "23", isVisible: true },
      { input: "3\n3\n1 2 1\n2 3 2\n1 3 3", expectedOutput: "3", isVisible: false },
      { input: "4\n4\n1 2 3\n2 3 4\n3 4 5\n1 4 100", expectedOutput: "12", isVisible: false },
      { input: "2\n1\n1 2 7", expectedOutput: "7", isVisible: false },
    ],
    tags: ["그래프", "MST"],
  },

  {
    title: "도시 분할 계획",
    description: `N개의 집과 M개의 길로 이루어진 마을이 있다. 마을을 두 개로 분할하여 각 마을 안의 집들이 서로 연결되도록 하려 한다. 두 마을에 존재하는 길의 유지 비용의 합이 최솟값이 되도록 하시오.

MST를 구한 뒤 가장 비용이 큰 간선을 제거한다.

## 입력

첫째 줄에 집의 수 N과 길의 수 M이 주어진다.

다음 M개 줄에 길의 양 끝 집 번호와 유지 비용이 주어진다.

- 2 ≤ N ≤ 100,000
- N-1 ≤ M ≤ 1,000,000
- 1 ≤ 비용 ≤ 1,000,000

## 출력

최소 유지 비용을 출력한다.

## 예제 입력 1

\`\`\`
7 12
1 2 3
1 3 2
3 2 1
2 5 2
3 4 4
7 3 6
5 4 3
6 4 4
6 5 6
5 7 5
6 7 4
7 4 3
\`\`\`

## 예제 출력 1

\`\`\`
8
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7 12\n1 2 3\n1 3 2\n3 2 1\n2 5 2\n3 4 4\n7 3 6\n5 4 3\n6 4 4\n6 5 6\n5 7 5\n6 7 4\n7 4 3", expectedOutput: "8", isVisible: true },
      { input: "4 5\n1 2 1\n2 3 2\n3 4 3\n1 4 10\n2 4 5", expectedOutput: "3", isVisible: false },
      { input: "3 3\n1 2 1\n2 3 2\n1 3 3", expectedOutput: "1", isVisible: false },
      { input: "2 1\n1 2 5", expectedOutput: "0", isVisible: false },
    ],
    tags: ["그래프", "MST"],
  },

  {
    title: "위상 정렬",
    description: `방향 비순환 그래프(DAG)에서 위상 정렬 순서를 구하는 프로그램을 작성하시오. 여러 가지 위상 정렬이 가능한 경우 번호가 작은 정점을 우선 출력한다.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 방향이 주어진다 (A B이면 A가 B보다 먼저).

- 1 ≤ N ≤ 32,000
- 1 ≤ M ≤ 100,000

## 출력

위상 정렬한 결과를 공백으로 구분해 출력한다.

## 예제 입력 1

\`\`\`
4 4
1 2
3 1
3 4
4 2
\`\`\`

## 예제 출력 1

\`\`\`
3 1 4 2
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 4\n1 2\n3 1\n3 4\n4 2", expectedOutput: "3 1 4 2", isVisible: true },
      { input: "3 3\n1 2\n2 3\n1 3", expectedOutput: "1 2 3", isVisible: false },
      { input: "5 4\n1 3\n2 3\n3 4\n3 5", expectedOutput: "1 2 3 4 5", isVisible: false },
      { input: "3 0", expectedOutput: "1 2 3", isVisible: false },
    ],
    tags: ["그래프", "위상정렬"],
  },

  {
    title: "줄 세우기",
    description: `N명의 학생과 M개의 키 순서 관계가 주어진다. 각 관계는 학생 A가 학생 B보다 앞에 서야 함을 의미한다. 가능한 줄 세우기 순서를 구하시오.

## 입력

첫째 줄에 학생의 수 N과 관계의 수 M이 주어진다.

다음 M개 줄에 A B가 주어진다 (A가 B보다 앞에 섬).

- 1 ≤ N ≤ 32,000
- 1 ≤ M ≤ 100,000

## 출력

줄 세운 결과를 한 줄에 공백으로 구분해 출력한다.

## 예제 입력 1

\`\`\`
4 2
4 2
3 1
\`\`\`

## 예제 출력 1

\`\`\`
3 4 1 2
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 2\n4 2\n3 1", expectedOutput: "3 4 1 2", isVisible: true },
      { input: "5 5\n1 2\n2 3\n3 4\n4 5\n1 5", expectedOutput: "1 2 3 4 5", isVisible: false },
      { input: "3 3\n3 1\n1 2\n3 2", expectedOutput: "3 1 2", isVisible: false },
      { input: "4 0", expectedOutput: "1 2 3 4", isVisible: false },
    ],
    tags: ["그래프", "위상정렬"],
  },

  {
    title: "작업 순서",
    description: `N개의 작업이 있고, 각 작업은 수행 시간과 선행 작업이 있다. 모든 선행 작업이 끝나야 해당 작업을 시작할 수 있다. 각 작업이 완료되는 최소 시간을 구하시오.

## 입력

첫째 줄에 작업의 수 N과 간선의 수 M이 주어진다.

둘째 줄에 각 작업의 수행 시간이 공백으로 구분되어 주어진다.

다음 M개 줄에 선행 관계 A B가 주어진다 (A가 끝나야 B 시작 가능).

- 1 ≤ N ≤ 10,000
- 0 ≤ M ≤ 100,000
- 1 ≤ 수행 시간 ≤ 1,000

## 출력

각 작업이 완료되는 최소 시간을 순서대로 한 줄에 하나씩 출력한다.

## 예제 입력 1

\`\`\`
5 5
5 2 3 8 4
1 2
1 3
3 4
2 4
4 5
\`\`\`

## 예제 출력 1

\`\`\`
5
7
8
16
20
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 5\n5 2 3 8 4\n1 2\n1 3\n3 4\n2 4\n4 5", expectedOutput: "5\n7\n8\n16\n20", isVisible: true },
      { input: "3 2\n4 3 2\n1 2\n2 3", expectedOutput: "4\n7\n9", isVisible: false },
      { input: "4 4\n1 2 3 4\n1 3\n2 3\n3 4\n1 4", expectedOutput: "1\n2\n5\n9", isVisible: false },
      { input: "3 0\n5 3 7", expectedOutput: "5\n3\n7", isVisible: false },
    ],
    tags: ["그래프", "위상정렬", "DP"],
  },

  {
    title: "게임 개발",
    description: `N개의 건물이 있다. 각 건물에는 건설 시간과 선행 건물이 있다. 모든 선행 건물이 완성되어야 해당 건물을 짓기 시작할 수 있다. 각 건물을 완성하는 데 걸리는 최소 시간을 구하시오.

## 입력

첫째 줄에 건물의 수 N이 주어진다.

다음 N개 줄에 건물 i의 건설 시간, 선행 건물의 수, 선행 건물 번호들이 주어진다. 선행 건물 수 다음에 선행 건물 번호들이 주어지며, 마지막에 -1이 있다.

- 1 ≤ N ≤ 500

## 출력

각 건물이 완성되는 최소 시간을 순서대로 한 줄에 하나씩 출력한다.

## 예제 입력 1

\`\`\`
5
10 -1
10 1 1 -1
4 1 1 -1
4 1 2 -1
3 2 3 4 -1
\`\`\`

## 예제 출력 1

\`\`\`
10
20
14
24
27
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n10 -1\n10 1 1 -1\n4 1 1 -1\n4 1 2 -1\n3 2 3 4 -1", expectedOutput: "10\n20\n14\n24\n27", isVisible: true },
      { input: "3\n5 -1\n3 -1\n4 2 1 2 -1", expectedOutput: "5\n3\n9", isVisible: false },
      { input: "4\n2 -1\n3 1 1 -1\n5 1 2 -1\n1 1 1 -1", expectedOutput: "2\n5\n10\n3", isVisible: false },
      { input: "2\n7 -1\n4 1 1 -1", expectedOutput: "7\n11", isVisible: false },
    ],
    tags: ["그래프", "위상정렬", "DP"],
  },

  {
    title: "사이클 판별 (방향 그래프)",
    description: `방향 그래프에 사이클이 존재하는지 판별하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 출발 정점과 도착 정점이 주어진다.

- 1 ≤ N ≤ 10,000
- 1 ≤ M ≤ 100,000

## 출력

사이클이 존재하면 \`YES\`, 없으면 \`NO\`를 출력한다.

## 예제 입력 1

\`\`\`
4 4
1 2
2 3
3 4
4 2
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 4\n1 2\n2 3\n3 4\n4 2", expectedOutput: "YES", isVisible: true },
      { input: "3 3\n1 2\n2 3\n1 3", expectedOutput: "NO", isVisible: false },
      { input: "5 5\n1 2\n2 3\n3 4\n4 5\n5 1", expectedOutput: "YES", isVisible: false },
      { input: "4 3\n1 2\n3 4\n2 4", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["그래프", "DFS"],
  },

  {
    title: "사이클 판별 (무향 그래프)",
    description: `무방향 그래프에 사이클이 존재하는지 판별하는 프로그램을 작성하시오. Union-Find를 활용하시오.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 두 정점 번호가 주어진다.

- 1 ≤ N ≤ 10,000
- 1 ≤ M ≤ 100,000

## 출력

사이클이 존재하면 \`YES\`, 없으면 \`NO\`를 출력한다.

## 예제 입력 1

\`\`\`
4 4
1 2
2 3
3 4
4 1
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 4\n1 2\n2 3\n3 4\n4 1", expectedOutput: "YES", isVisible: true },
      { input: "4 3\n1 2\n2 3\n3 4", expectedOutput: "NO", isVisible: false },
      { input: "5 5\n1 2\n2 3\n3 1\n4 5\n1 4", expectedOutput: "YES", isVisible: false },
      { input: "3 2\n1 2\n2 3", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["그래프", "유니온파인드"],
  },

  {
    title: "트리의 지름",
    description: `가중 트리에서 가장 먼 두 노드 사이의 거리를 구하는 프로그램을 작성하시오. 이 거리를 트리의 지름이라 한다.

## 입력

첫째 줄에 노드의 수 N이 주어진다.

다음 N-1개 줄에 간선의 두 노드 번호와 가중치가 주어진다.

- 1 ≤ N ≤ 10,000
- 1 ≤ 가중치 ≤ 100

## 출력

트리의 지름을 출력한다.

## 예제 입력 1

\`\`\`
5
1 2 3
2 3 4
3 4 2
3 5 6
\`\`\`

## 예제 출력 1

\`\`\`
13
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 2 3\n2 3 4\n3 4 2\n3 5 6", expectedOutput: "13", isVisible: true },
      { input: "3\n1 2 5\n2 3 3", expectedOutput: "8", isVisible: false },
      { input: "4\n1 2 1\n1 3 2\n1 4 3", expectedOutput: "5", isVisible: false },
      { input: "6\n1 2 3\n1 3 1\n2 4 5\n2 5 4\n3 6 2", expectedOutput: "12", isVisible: false },
    ],
    tags: ["그래프", "트리", "BFS"],
  },

  {
    title: "최소 스패닝 트리 (프림)",
    description: `N개의 정점과 M개의 무방향 가중 간선으로 이루어진 그래프에서 프림 알고리즘을 사용하여 최소 신장 트리(MST)의 비용을 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정점의 수 V와 간선의 수 E가 주어진다.

다음 E개 줄에 간선이 연결하는 두 정점 번호와 가중치가 주어진다.

- 1 ≤ V ≤ 10,000
- 1 ≤ E ≤ 100,000
- 1 ≤ 가중치 ≤ 100

## 출력

MST의 비용을 출력한다.

## 예제 입력 1

\`\`\`
4 6
1 2 4
1 3 2
1 4 7
2 3 1
2 4 5
3 4 3
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 6\n1 2 4\n1 3 2\n1 4 7\n2 3 1\n2 4 5\n3 4 3", expectedOutput: "6", isVisible: true },
      { input: "3 3\n1 2 1\n2 3 2\n1 3 3", expectedOutput: "3", isVisible: false },
      { input: "5 7\n1 2 1\n1 3 4\n2 3 2\n2 4 5\n3 4 1\n3 5 3\n4 5 2", expectedOutput: "7", isVisible: false },
      { input: "2 1\n1 2 10", expectedOutput: "10", isVisible: false },
    ],
    tags: ["그래프", "MST"],
  },

  {
    title: "이중 연결 요소",
    description: `무방향 그래프에서 단절점(articulation point)의 개수를 구하는 프로그램을 작성하시오.

단절점이란 해당 정점을 제거했을 때 그래프가 두 개 이상의 연결 요소로 나뉘는 정점이다.

## 입력

첫째 줄에 정점의 수 V와 간선의 수 E가 주어진다.

다음 E개 줄에 간선의 두 정점 번호가 주어진다.

- 1 ≤ V ≤ 10,000
- 1 ≤ E ≤ 100,000

## 출력

첫째 줄에 단절점의 수를 출력한다.
둘째 줄에 단절점 번호를 오름차순으로 공백으로 구분해 출력한다.

## 예제 입력 1

\`\`\`
7 7
1 4
4 3
4 7
7 5
7 6
3 2
2 1
\`\`\`

## 예제 출력 1

\`\`\`
3
1 4 7
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7 7\n1 4\n4 3\n4 7\n7 5\n7 6\n3 2\n2 1", expectedOutput: "3\n1 4 7", isVisible: true },
      { input: "4 4\n1 2\n2 3\n3 4\n4 1", expectedOutput: "0\n", isVisible: false },
      { input: "5 4\n1 2\n2 3\n3 4\n4 5", expectedOutput: "3\n2 3 4", isVisible: false },
      { input: "6 6\n1 2\n2 3\n3 1\n3 4\n4 5\n5 6", expectedOutput: "2\n3 4", isVisible: false },
    ],
    tags: ["그래프", "DFS"],
  },

  {
    title: "강한 연결 요소 (SCC) 개수",
    description: `방향 그래프의 강한 연결 요소(SCC) 개수를 구하는 프로그램을 작성하시오.

강한 연결 요소란 모든 정점 쌍 (u, v)에 대해 u에서 v로, v에서 u로 경로가 존재하는 최대 정점 집합이다.

## 입력

첫째 줄에 정점의 수 V와 간선의 수 E가 주어진다.

다음 E개 줄에 간선의 출발 정점과 도착 정점이 주어진다.

- 1 ≤ V ≤ 10,000
- 1 ≤ E ≤ 100,000

## 출력

SCC의 개수를 출력한다.

## 예제 입력 1

\`\`\`
6 9
1 2
2 3
3 1
3 4
4 5
5 6
6 4
2 5
5 2
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 9\n1 2\n2 3\n3 1\n3 4\n4 5\n5 6\n6 4\n2 5\n5 2", expectedOutput: "3", isVisible: true },
      { input: "4 4\n1 2\n2 3\n3 4\n4 1", expectedOutput: "1", isVisible: false },
      { input: "4 2\n1 2\n3 4", expectedOutput: "4", isVisible: false },
      { input: "5 5\n1 2\n2 3\n3 1\n4 5\n5 4", expectedOutput: "3", isVisible: false },
    ],
    tags: ["그래프", "DFS"],
  },

  {
    title: "오일러 경로",
    description: `무방향 그래프에서 오일러 경로가 존재하는지 판별하는 프로그램을 작성하시오.

오일러 경로란 그래프의 모든 간선을 정확히 한 번씩 방문하는 경로이다.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 두 정점 번호가 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ M ≤ 10,000

## 출력

오일러 경로가 존재하면 \`YES\`, 없으면 \`NO\`를 출력한다.

## 예제 입력 1

\`\`\`
5 5
1 2
2 3
3 4
4 5
5 1
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 5\n1 2\n2 3\n3 4\n4 5\n5 1", expectedOutput: "YES", isVisible: true },
      { input: "4 4\n1 2\n2 3\n3 4\n4 1", expectedOutput: "YES", isVisible: false },
      { input: "4 4\n1 2\n2 3\n3 1\n3 4", expectedOutput: "YES", isVisible: false },
      { input: "4 5\n1 2\n2 3\n3 1\n1 4\n2 4", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["그래프"],
  },

  {
    title: "이분 매칭",
    description: `이분 그래프에서 최대 매칭의 수를 구하는 프로그램을 작성하시오.

N명의 학생과 M개의 작업이 있다. 각 학생이 할 수 있는 작업 목록이 주어질 때, 최대 몇 명의 학생이 서로 다른 작업을 맡을 수 있는지 구하시오.

## 입력

첫째 줄에 학생의 수 N과 작업의 수 M이 주어진다.

다음 N개 줄에 학생 i가 할 수 있는 작업의 수 k와 작업 번호들이 주어진다.

- 1 ≤ N, M ≤ 200

## 출력

최대 매칭의 수를 출력한다.

## 예제 입력 1

\`\`\`
3 3
2 1 2
1 2
2 2 3
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 3\n2 1 2\n1 2\n2 2 3", expectedOutput: "3", isVisible: true },
      { input: "2 2\n2 1 2\n2 1 2", expectedOutput: "2", isVisible: false },
      { input: "3 2\n1 1\n1 1\n1 2", expectedOutput: "2", isVisible: false },
      { input: "4 4\n1 1\n2 1 2\n2 2 3\n2 3 4", expectedOutput: "4", isVisible: false },
    ],
    tags: ["그래프", "매칭"],
  },

  {
    title: "최대 유량 (기본)",
    description: `소스 S에서 싱크 T까지의 최대 유량을 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 출발 정점 u, 도착 정점 v, 용량 c가 주어진다.

마지막 줄에 소스 S와 싱크 T가 주어진다.

- 2 ≤ N ≤ 50
- 1 ≤ M ≤ 1,000
- 1 ≤ c ≤ 1,000

## 출력

최대 유량을 출력한다.

## 예제 입력 1

\`\`\`
6 9
1 2 12
1 3 13
2 4 10
3 2 4
3 5 14
4 6 7
5 4 7
5 6 4
4 3 1
1 6
\`\`\`

## 예제 출력 1

\`\`\`
23
\`\`\``,
    difficulty: 7.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 9\n1 2 12\n1 3 13\n2 4 10\n3 2 4\n3 5 14\n4 6 7\n5 4 7\n5 6 4\n4 3 1\n1 6", expectedOutput: "23", isVisible: true },
      { input: "4 5\n1 2 10\n1 3 10\n2 4 10\n3 4 10\n2 3 1\n1 4", expectedOutput: "20", isVisible: false },
      { input: "2 1\n1 2 5\n1 2", expectedOutput: "5", isVisible: false },
      { input: "4 4\n1 2 3\n2 4 4\n1 3 2\n3 4 5\n1 4", expectedOutput: "5", isVisible: false },
    ],
    tags: ["그래프", "네트워크 플로우"],
  },

  {
    title: "LCA (최소 공통 조상)",
    description: `루트가 1인 트리에서 두 노드의 최소 공통 조상(LCA)을 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 노드의 수 N이 주어진다.

다음 N-1개 줄에 트리의 간선이 주어진다.

다음 줄에 쿼리의 수 M이 주어진다.

다음 M개 줄에 두 노드 번호가 주어진다.

- 1 ≤ N ≤ 50,000
- 1 ≤ M ≤ 10,000

## 출력

각 쿼리마다 LCA를 출력한다.

## 예제 입력 1

\`\`\`
7
1 2
1 3
2 4
2 5
3 6
3 7
3
4 5
3 7
6 2
\`\`\`

## 예제 출력 1

\`\`\`
2
3
1
\`\`\``,
    difficulty: 6.0,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n3\n4 5\n3 7\n6 2", expectedOutput: "2\n3\n1", isVisible: true },
      { input: "5\n1 2\n2 3\n3 4\n4 5\n2\n1 5\n2 4", expectedOutput: "1\n2", isVisible: false },
      { input: "4\n1 2\n1 3\n1 4\n2\n2 3\n3 4", expectedOutput: "1\n1", isVisible: false },
      { input: "6\n1 2\n1 3\n2 4\n2 5\n3 6\n3\n4 6\n5 6\n4 5", expectedOutput: "1\n1\n2", isVisible: false },
    ],
    tags: ["그래프", "트리"],
  },

  {
    title: "트리에서의 거리",
    description: `가중 트리에서 두 노드 사이의 거리를 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 노드의 수 N이 주어진다.

다음 N-1개 줄에 간선의 두 노드 번호와 가중치가 주어진다.

다음 줄에 쿼리의 수 Q가 주어진다.

다음 Q개 줄에 두 노드 번호 u와 v가 주어진다.

- 1 ≤ N ≤ 40,000
- 1 ≤ Q ≤ 10,000
- 1 ≤ 가중치 ≤ 1,000

## 출력

각 쿼리마다 두 노드 사이의 거리를 출력한다.

## 예제 입력 1

\`\`\`
7
1 2 3
1 3 5
2 4 2
2 5 4
3 6 1
3 7 6
3
4 7
2 6
1 5
\`\`\`

## 예제 출력 1

\`\`\`
16
9
7
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7\n1 2 3\n1 3 5\n2 4 2\n2 5 4\n3 6 1\n3 7 6\n3\n4 7\n2 6\n1 5", expectedOutput: "16\n9\n7", isVisible: true },
      { input: "4\n1 2 1\n2 3 2\n3 4 3\n2\n1 4\n2 3", expectedOutput: "6\n2", isVisible: false },
      { input: "5\n1 2 3\n1 3 1\n3 4 2\n3 5 4\n2\n2 4\n4 5", expectedOutput: "6\n6", isVisible: false },
      { input: "3\n1 2 5\n2 3 7\n1\n1 3", expectedOutput: "12", isVisible: false },
    ],
    tags: ["그래프", "트리", "LCA"],
  },

  {
    title: "네트워크 분리",
    description: `무방향 연결 그래프에서 단절선(bridge)의 개수를 구하는 프로그램을 작성하시오.

단절선이란 해당 간선을 제거했을 때 그래프가 두 개 이상의 연결 요소로 나뉘는 간선이다.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 두 정점 번호가 주어진다.

- 1 ≤ N ≤ 10,000
- 1 ≤ M ≤ 100,000

## 출력

단절선의 수를 출력한다.

## 예제 입력 1

\`\`\`
7 7
1 2
2 3
3 1
3 4
4 5
5 6
6 7
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
      { input: "7 7\n1 2\n2 3\n3 1\n3 4\n4 5\n5 6\n6 7", expectedOutput: "4", isVisible: true },
      { input: "4 4\n1 2\n2 3\n3 4\n4 1", expectedOutput: "0", isVisible: false },
      { input: "5 4\n1 2\n2 3\n3 4\n4 5", expectedOutput: "4", isVisible: false },
      { input: "6 7\n1 2\n2 3\n3 1\n3 4\n4 5\n5 6\n6 4", expectedOutput: "1", isVisible: false },
    ],
    tags: ["그래프", "DFS"],
  },

  {
    title: "그래프 색칠",
    description: `무방향 그래프를 인접한 정점끼리 서로 다른 색이 되도록 색칠할 때 필요한 최소 색의 수를 구하는 프로그램을 작성하시오. 백트래킹을 사용하시오.

## 입력

첫째 줄에 정점의 수 N과 간선의 수 M이 주어진다.

다음 M개 줄에 간선의 두 정점 번호가 주어진다.

- 1 ≤ N ≤ 20
- 1 ≤ M ≤ N*(N-1)/2

## 출력

필요한 최소 색의 수를 출력한다.

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
4
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 5000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 6\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4", expectedOutput: "4", isVisible: true },
      { input: "4 4\n1 2\n2 3\n3 4\n4 1", expectedOutput: "2", isVisible: false },
      { input: "5 6\n1 2\n2 3\n3 1\n1 4\n2 5\n4 5", expectedOutput: "3", isVisible: false },
      { input: "3 3\n1 2\n2 3\n3 1", expectedOutput: "3", isVisible: false },
    ],
    tags: ["그래프", "백트래킹"],
  },
];
