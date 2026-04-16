export const problems = [
  // 1. 토끼와 거북이의 경주
  {
    title: "토끼와 거북이의 경주",
    description: `옛날 옛적, 토끼와 거북이가 경주를 하기로 했다. 토끼는 1초 동안 전속력으로 달린 뒤 반드시 b초 동안 쉬어야 한다. 거북이는 지치지 않고 꾸준히 달린다. 과연 누가 먼저 결승선에 도달할까?

<div align="center">
<svg width="380" height="160" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:13px">
  <!-- Track -->
  <rect x="20" y="70" width="340" height="20" rx="4" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5"/>
  <!-- Start line -->
  <line x1="50" y1="60" x2="50" y2="100" stroke="#333" stroke-width="2"/>
  <text x="44" y="115" fill="#333" font-size="11">출발</text>
  <!-- Finish line -->
  <line x1="330" y1="60" x2="330" y2="100" stroke="#f44336" stroke-width="2"/>
  <text x="322" y="115" fill="#f44336" font-size="11">결승</text>
  <!-- Rabbit -->
  <ellipse cx="120" cy="58" rx="16" ry="12" fill="#fff9c4" stroke="#ff9800" stroke-width="1.5"/>
  <text x="111" y="63" fill="#333" font-size="14">🐰</text>
  <text x="106" y="45" fill="#ff9800" font-size="11">토끼(쉬는 중)</text>
  <!-- Turtle -->
  <ellipse cx="90" cy="88" rx="16" ry="12" fill="#c8e6c9" stroke="#4caf50" stroke-width="1.5"/>
  <text x="80" y="93" fill="#333" font-size="14">🐢</text>
  <text x="76" y="130" fill="#4caf50" font-size="11">거북이(꾸준히)</text>
  <!-- speed labels -->
  <text x="150" y="48" fill="#ff9800" font-size="11">속도 a m/s, b초 휴식</text>
  <text x="150" y="140" fill="#4caf50" font-size="11">속도 c m/s (일정)</text>
  <!-- Distance D -->
  <text x="165" y="155" fill="#2196f3" font-size="12">거리 D</text>
</svg>
</div>

## 입력

첫째 줄에 네 정수 a, b, c, D가 주어진다.

- 토끼는 1초 동안 a미터 달리고, b초 동안 쉰다. (쉬기 → 달리기 → 쉬기 반복)
- 거북이는 매초 c미터를 꾸준히 이동한다.
- 1 ≤ a, c ≤ 100
- 0 ≤ b ≤ 100
- 1 ≤ D ≤ 10000

## 출력

먼저 결승선(D미터 이상)에 도달한 쪽을 출력한다. 동시에 도달하면 \`TIE\`, 토끼가 먼저면 \`RABBIT\`, 거북이가 먼저면 \`TURTLE\`을 출력한다.

## 예제 입력 1

\`\`\`
4 2 2 100
\`\`\`

## 예제 출력 1

\`\`\`
TURTLE
\`\`\``,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 2 2 100", expectedOutput: "TURTLE", isVisible: true },
      { input: "10 5 1 100", expectedOutput: "RABBIT", isVisible: false },
      { input: "3 2 1 10", expectedOutput: "TIE", isVisible: false },
      { input: "1 1 1 5", expectedOutput: "TURTLE", isVisible: false },
      { input: "5 0 5 100", expectedOutput: "TIE", isVisible: false },
    ],
    tags: ["시뮬레이션"],
  },

  // 2. 보물섬 탐험
  {
    title: "보물섬 탐험",
    description: `모험가 지호는 보물섬 지도를 손에 넣었다. 지도는 N×M 격자로 표현되며, 각 칸은 땅(L) 또는 바다(W)로 이루어진다. 바다를 건너지 않고 땅만을 통해 이동할 수 있을 때, 서로 가장 멀리 떨어진 두 육지 칸 사이의 거리를 구하라.

<div align="center">
<svg width="320" height="220" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:13px">
  <!-- Grid 4x4 example -->
  <g transform="translate(60,30)">
    <!-- cells -->
    <rect x="0"  y="0"  width="40" height="40" fill="#2196f3" opacity="0.5"/>
    <rect x="40" y="0"  width="40" height="40" fill="#795548" opacity="0.7"/>
    <rect x="80" y="0"  width="40" height="40" fill="#795548" opacity="0.7"/>
    <rect x="120" y="0" width="40" height="40" fill="#2196f3" opacity="0.5"/>
    <rect x="0"  y="40" width="40" height="40" fill="#795548" opacity="0.7"/>
    <rect x="40" y="40" width="40" height="40" fill="#795548" opacity="0.7"/>
    <rect x="80" y="40" width="40" height="40" fill="#2196f3" opacity="0.5"/>
    <rect x="120" y="40" width="40" height="40" fill="#795548" opacity="0.7"/>
    <rect x="0"  y="80" width="40" height="40" fill="#2196f3" opacity="0.5"/>
    <rect x="40" y="80" width="40" height="40" fill="#795548" opacity="0.7"/>
    <rect x="80" y="80" width="40" height="40" fill="#2196f3" opacity="0.5"/>
    <rect x="120" y="80" width="40" height="40" fill="#795548" opacity="0.7"/>
    <!-- labels -->
    <text x="15" y="25" fill="white" font-weight="bold">W</text>
    <text x="55" y="25" fill="white" font-weight="bold">L</text>
    <text x="95" y="25" fill="white" font-weight="bold">L</text>
    <text x="135" y="25" fill="white" font-weight="bold">W</text>
    <text x="15" y="65" fill="white" font-weight="bold">L</text>
    <text x="55" y="65" fill="white" font-weight="bold">L</text>
    <text x="95" y="65" fill="white" font-weight="bold">W</text>
    <text x="135" y="65" fill="white" font-weight="bold">L</text>
    <text x="15" y="105" fill="white" font-weight="bold">W</text>
    <text x="55" y="105" fill="white" font-weight="bold">L</text>
    <text x="95" y="105" fill="white" font-weight="bold">W</text>
    <text x="135" y="105" fill="white" font-weight="bold">L</text>
    <!-- grid lines -->
    <rect x="0" y="0" width="160" height="120" fill="none" stroke="#333" stroke-width="1.5"/>
    <line x1="40" y1="0" x2="40" y2="120" stroke="#333" stroke-width="1"/>
    <line x1="80" y1="0" x2="80" y2="120" stroke="#333" stroke-width="1"/>
    <line x1="120" y1="0" x2="120" y2="120" stroke="#333" stroke-width="1"/>
    <line x1="0" y1="40" x2="160" y2="40" stroke="#333" stroke-width="1"/>
    <line x1="0" y1="80" x2="160" y2="80" stroke="#333" stroke-width="1"/>
    <!-- distance arrow -->
    <circle cx="60" cy="20" r="6" fill="none" stroke="#f44336" stroke-width="2"/>
    <circle cx="60" cy="100" r="6" fill="none" stroke="#f44336" stroke-width="2"/>
    <line x1="60" y1="20" x2="60" y2="100" stroke="#f44336" stroke-width="1.5" stroke-dasharray="4,3"/>
  </g>
  <text x="100" y="175" fill="#2196f3" font-weight="bold">W = 바다</text>
  <text x="200" y="175" fill="#795548" font-weight="bold">L = 땅</text>
  <text x="100" y="200" fill="#f44336" font-size="12">최대 거리 탐색</text>
</svg>
</div>

## 입력

첫째 줄에 N과 M이 주어진다. 둘째 줄부터 N줄에 걸쳐 지도 정보가 주어진다.

- 1 ≤ N, M ≤ 50
- 지도는 L(땅)과 W(바다)로만 이루어진다.

## 출력

가장 멀리 떨어진 두 육지 칸 사이의 최단 거리(BFS 기준)를 출력한다.

## 예제 입력 1

\`\`\`
3 4
WLLW
LLWL
WLWL
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
      { input: "3 4\nWLLW\nLLWL\nWLWL", expectedOutput: "3", isVisible: true },
      { input: "1 4\nLLLL", expectedOutput: "3", isVisible: false },
      { input: "4 4\nLWLL\nLLLL\nLLWL\nWLLL", expectedOutput: "6", isVisible: false },
      { input: "2 2\nLL\nLL", expectedOutput: "2", isVisible: false },
    ],
    tags: ["BFS", "그래프"],
  },

  // 3. 피자 배달 거리
  {
    title: "피자 배달 거리",
    description: `N×N 도시에 집과 피자 가게가 있다. 피자 가게 M개 중 K개만 살아남아야 한다고 할 때, 모든 집에서 가장 가까운 피자 가게까지의 거리 합(맨해튼 거리)이 최소가 되도록 K개를 선택하라.

<div align="center">
<svg width="360" height="200" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- 5x5 grid -->
  <g transform="translate(20,15)">
    <rect x="0" y="0" width="200" height="200" fill="#f9f9f9" stroke="#ccc" stroke-width="1"/>
    <!-- grid lines -->
    <line x1="40" y1="0" x2="40" y2="200" stroke="#eee" stroke-width="1"/>
    <line x1="80" y1="0" x2="80" y2="200" stroke="#eee" stroke-width="1"/>
    <line x1="120" y1="0" x2="120" y2="200" stroke="#eee" stroke-width="1"/>
    <line x1="160" y1="0" x2="160" y2="200" stroke="#eee" stroke-width="1"/>
    <line x1="0" y1="40" x2="200" y2="40" stroke="#eee" stroke-width="1"/>
    <line x1="0" y1="80" x2="200" y2="80" stroke="#eee" stroke-width="1"/>
    <line x1="0" y1="120" x2="200" y2="120" stroke="#eee" stroke-width="1"/>
    <line x1="0" y1="160" x2="200" y2="160" stroke="#eee" stroke-width="1"/>
    <!-- Houses (row,col): (0,0) and (4,4) -->
    <text x="8" y="28" font-size="18">🏠</text>
    <text x="168" y="188" font-size="18">🏠</text>
    <!-- Pizza shops (1,2) and (3,3) -->
    <text x="48" y="68" font-size="18">🍕</text>
    <text x="128" y="148" font-size="18">🍕</text>
    <!-- dashed lines for distances -->
    <line x1="20" y1="20" x2="60" y2="60" stroke="#f44336" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="180" y1="180" x2="140" y2="140" stroke="#f44336" stroke-width="1.5" stroke-dasharray="4,3"/>
  </g>
  <text x="235" y="50" fill="#333">🏠 = 집</text>
  <text x="235" y="80" fill="#333">🍕 = 피자 가게</text>
  <text x="235" y="115" fill="#f44336" font-size="11">거리 = |행차| + |열차|</text>
  <text x="235" y="140" fill="#2196f3" font-size="11">(맨해튼 거리)</text>
</svg>
</div>

## 입력

첫째 줄에 N과 K가 주어진다. 둘째 줄부터 N개의 줄에 N개의 정수가 공백으로 구분되어 주어진다. 0은 빈 칸, 1은 집, 2는 피자 가게를 나타낸다.

- 2 ≤ N ≤ 15
- 1 ≤ K ≤ M (M = 피자 가게 수, M ≤ 13)
- 집과 피자 가게의 수는 각각 1 이상

## 출력

모든 집의 피자 배달 거리 합의 최솟값을 출력한다.

## 예제 입력 1

\`\`\`
5 2
1 0 0 0 0
0 0 2 0 0
0 0 0 0 0
0 0 0 2 0
0 0 0 0 1
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\``,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 2\n1 0 0 0 0\n0 0 2 0 0\n0 0 0 0 0\n0 0 0 2 0\n0 0 0 0 1", expectedOutput: "5", isVisible: true },
      { input: "5 1\n1 0 0 0 0\n0 0 2 0 0\n0 0 0 0 0\n0 0 0 2 0\n0 0 0 0 1", expectedOutput: "8", isVisible: false },
      { input: "5 2\n0 2 0 0 0\n1 0 0 0 1\n0 0 0 0 0\n0 0 0 2 0\n0 0 1 0 0", expectedOutput: "7", isVisible: false },
      { input: "4 1\n0 0 0 2\n0 1 0 0\n0 0 0 0\n2 0 1 0", expectedOutput: "5", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  // 4. 전깃줄 정리
  {
    title: "전깃줄 정리",
    description: `두 전봇대 A와 B 사이에 N개의 전깃줄이 연결되어 있다. 각 전깃줄은 A의 i번 위치에서 B의 j번 위치로 이어진다. 전깃줄이 서로 교차하지 않으려면 최소 몇 개를 제거해야 할까?

<div align="center">
<svg width="340" height="200" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Left pole -->
  <rect x="40" y="20" width="10" height="160" rx="3" fill="#795548"/>
  <!-- Right pole -->
  <rect x="290" y="20" width="10" height="160" rx="3" fill="#795548"/>
  <!-- Wires (crossing ones in red, kept ones in blue) -->
  <!-- kept: (2,2),(5,4),(6,6),(7,7) -->
  <line x1="50" y1="40"  x2="290" y2="40"  stroke="#2196f3" stroke-width="1.8"/>
  <line x1="50" y1="100" x2="290" y2="80"  stroke="#2196f3" stroke-width="1.8"/>
  <line x1="50" y1="120" x2="290" y2="120" stroke="#2196f3" stroke-width="1.8"/>
  <line x1="50" y1="140" x2="290" y2="140" stroke="#2196f3" stroke-width="1.8"/>
  <!-- crossing (removed): (1,8),(3,9),(4,1) -->
  <line x1="50" y1="20"  x2="290" y2="160" stroke="#f44336" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.7"/>
  <line x1="50" y1="60"  x2="290" y2="180" stroke="#f44336" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.7"/>
  <line x1="50" y1="80"  x2="290" y2="20"  stroke="#f44336" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.7"/>
  <!-- Connection dots on left pole -->
  <circle cx="45" cy="20"  r="4" fill="#333"/>
  <circle cx="45" cy="40"  r="4" fill="#2196f3"/>
  <circle cx="45" cy="60"  r="4" fill="#f44336"/>
  <circle cx="45" cy="80"  r="4" fill="#f44336"/>
  <circle cx="45" cy="100" r="4" fill="#2196f3"/>
  <circle cx="45" cy="120" r="4" fill="#2196f3"/>
  <circle cx="45" cy="140" r="4" fill="#2196f3"/>
  <!-- labels -->
  <text x="10" y="24" fill="#333" font-size="11">1</text>
  <text x="10" y="44" fill="#333" font-size="11">2</text>
  <text x="10" y="64" fill="#333" font-size="11">3</text>
  <text x="10" y="84" fill="#333" font-size="11">4</text>
  <text x="10" y="104" fill="#333" font-size="11">5</text>
  <text x="10" y="124" fill="#333" font-size="11">6</text>
  <text x="10" y="144" fill="#333" font-size="11">7</text>
  <text x="100" y="190" fill="#2196f3" font-size="11">파란선 = 유지</text>
  <text x="210" y="190" fill="#f44336" font-size="11">빨간선 = 제거</text>
</svg>
</div>

## 입력

첫째 줄에 전깃줄의 수 N이 주어진다. 다음 N개의 줄에 각 전깃줄이 A전봇대의 몇 번 위치에서 B전봇대의 몇 번 위치로 연결되는지 주어진다.

- 1 ≤ N ≤ 100
- 각 위치 번호는 1 이상 500 이하이며, 같은 위치에 두 전깃줄이 연결되지 않는다.

## 출력

교차하지 않게 하기 위해 제거해야 하는 전깃줄의 최소 수를 출력한다.

## 예제 입력 1

\`\`\`
8
1 8
2 2
3 9
4 1
5 4
6 6
7 7
8 10
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
      { input: "8\n1 8\n2 2\n3 9\n4 1\n5 4\n6 6\n7 7\n8 10", expectedOutput: "3", isVisible: true },
      { input: "2\n1 2\n2 1", expectedOutput: "1", isVisible: false },
      { input: "3\n1 1\n2 2\n3 3", expectedOutput: "0", isVisible: false },
      { input: "4\n1 4\n2 3\n3 2\n4 1", expectedOutput: "3", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 5. 돌다리 건너기
  {
    title: "돌다리 건너기",
    description: `강 위에 돌 N개가 일렬로 놓여 있다. 각 돌에는 숫자가 적혀 있는데, 그 숫자만큼 앞으로 점프할 수 있다. 첫 번째 돌에서 시작해서 마지막 돌(N번째)까지 도달할 수 있을까?

<div align="center">
<svg width="360" height="140" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:13px">
  <!-- River background -->
  <rect x="0" y="60" width="360" height="60" fill="#e3f2fd" rx="4"/>
  <text x="10" y="105" fill="#2196f3" font-size="11" opacity="0.6">~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~</text>
  <!-- Stones -->
  <ellipse cx="40"  cy="80" rx="22" ry="14" fill="#9e9e9e" stroke="#616161" stroke-width="1.5"/>
  <ellipse cx="100" cy="80" rx="22" ry="14" fill="#9e9e9e" stroke="#616161" stroke-width="1.5"/>
  <ellipse cx="160" cy="80" rx="22" ry="14" fill="#9e9e9e" stroke="#616161" stroke-width="1.5"/>
  <ellipse cx="220" cy="80" rx="22" ry="14" fill="#bdbdbd" stroke="#9e9e9e" stroke-width="1.5" stroke-dasharray="4,2"/>
  <ellipse cx="280" cy="80" rx="22" ry="14" fill="#9e9e9e" stroke="#616161" stroke-width="1.5"/>
  <ellipse cx="340" cy="80" rx="22" ry="14" fill="#4caf50" stroke="#388e3c" stroke-width="1.5"/>
  <!-- Numbers on stones -->
  <text x="34"  y="85" fill="white" font-weight="bold">2</text>
  <text x="94"  y="85" fill="white" font-weight="bold">3</text>
  <text x="154" y="85" fill="white" font-weight="bold">1</text>
  <text x="214" y="85" fill="#333" font-weight="bold">0</text>
  <text x="274" y="85" fill="white" font-weight="bold">4</text>
  <text x="330" y="85" fill="white" font-weight="bold">도착</text>
  <!-- Jump arrows -->
  <path d="M 40 62 Q 70 30 100 62" fill="none" stroke="#ff9800" stroke-width="2" marker-end="url(#arr)"/>
  <path d="M 100 62 Q 160 15 220 62" fill="none" stroke="#ff9800" stroke-width="2"/>
  <!-- Person on first stone -->
  <text x="28" y="60" font-size="16">🧍</text>
  <!-- Labels -->
  <text x="25"  y="115" fill="#333" font-size="10">1번</text>
  <text x="85"  y="115" fill="#333" font-size="10">2번</text>
  <text x="145" y="115" fill="#333" font-size="10">3번</text>
  <text x="205" y="115" fill="#333" font-size="10">4번</text>
  <text x="265" y="115" fill="#333" font-size="10">5번</text>
  <text x="325" y="115" fill="#4caf50" font-size="10">6번</text>
</svg>
</div>

## 입력

첫째 줄에 돌의 수 N이 주어진다. 둘째 줄에 N개의 정수가 공백으로 구분되어 주어진다. i번째 정수는 i번 돌에서 앞으로 점프할 수 있는 최대 칸 수이다.

- 1 ≤ N ≤ 1000
- 0 ≤ 각 돌의 숫자 ≤ 100

## 출력

마지막 돌에 도달할 수 있으면 \`YES\`, 없으면 \`NO\`를 출력한다.

## 예제 입력 1

\`\`\`
5
2 3 1 1 4
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n2 3 1 1 4", expectedOutput: "YES", isVisible: true },
      { input: "5\n3 2 1 0 4", expectedOutput: "NO", isVisible: false },
      { input: "4\n1 1 1 1", expectedOutput: "YES", isVisible: false },
      { input: "4\n0 1 1 1", expectedOutput: "NO", isVisible: false },
      { input: "1\n0", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 6. 아이스크림 가게
  {
    title: "아이스크림 가게",
    description: `더운 여름, 지수는 아이스크림 가게에서 서로 다른 맛 두 가지를 골라 먹으려 한다. 예산이 정확히 M원일 때, 두 아이스크림의 가격 합이 정확히 M원이 되는 조합이 몇 가지인지 구하라.

<div align="center">
<svg width="360" height="160" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Ice cream cones -->
  <!-- cone 1 -->
  <ellipse cx="50" cy="60" rx="22" ry="18" fill="#f48fb1"/>
  <polygon points="28,72 50,120 72,72" fill="#ff9800"/>
  <text x="38" y="65" fill="white" font-weight="bold">1000</text>
  <!-- cone 2 -->
  <ellipse cx="120" cy="60" rx="22" ry="18" fill="#80cbc4"/>
  <polygon points="98,72 120,120 142,72" fill="#ff9800"/>
  <text x="108" y="65" fill="white" font-weight="bold">2000</text>
  <!-- cone 3 -->
  <ellipse cx="190" cy="60" rx="22" ry="18" fill="#a5d6a7"/>
  <polygon points="168,72 190,120 212,72" fill="#ff9800"/>
  <text x="178" y="65" fill="white" font-weight="bold">3000</text>
  <!-- cone 4 -->
  <ellipse cx="260" cy="60" rx="22" ry="18" fill="#fff176"/>
  <polygon points="238,72 260,120 282,72" fill="#ff9800"/>
  <text x="248" y="65" fill="white" font-weight="bold">4000</text>
  <!-- cone 5 -->
  <ellipse cx="330" cy="60" rx="22" ry="18" fill="#ce93d8"/>
  <polygon points="308,72 330,120 352,72" fill="#ff9800"/>
  <text x="318" y="65" fill="white" font-weight="bold">5000</text>
  <!-- budget label -->
  <text x="100" y="150" fill="#2196f3" font-size="14" font-weight="bold">예산: 5000원 → 조합: (1+4), (2+3) = 2가지</text>
</svg>
</div>

## 입력

첫째 줄에 아이스크림의 종류 수 N과 예산 M이 주어진다. 둘째 줄에 N개의 아이스크림 가격이 공백으로 구분되어 주어진다. 가격은 모두 서로 다르다.

- 2 ≤ N ≤ 300000
- 1 ≤ M ≤ 2000000000
- 1 ≤ 각 가격 ≤ 1000000000

## 출력

가격 합이 정확히 M원인 두 아이스크림의 조합 수를 출력한다.

## 예제 입력 1

\`\`\`
5 5000
1000 2000 3000 4000 5000
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 5000\n1000 2000 3000 4000 5000", expectedOutput: "2", isVisible: true },
      { input: "3 10\n1 2 3", expectedOutput: "0", isVisible: false },
      { input: "4 6\n1 2 3 4", expectedOutput: "2", isVisible: false },
      { input: "5 7\n1 2 3 4 5", expectedOutput: "2", isVisible: false },
    ],
    tags: ["정렬", "투 포인터"],
  },

  // 7. 비밀 편지
  {
    title: "비밀 편지",
    description: `서연이는 친구에게 비밀 편지를 보내기 위해 간단한 암호를 사용한다. 암호화 방법은 다음과 같다: 먼저 각 소문자 알파벳을 K칸 뒤로 밀고(z 다음은 a), 그 결과를 통째로 뒤집는다. 암호문이 주어졌을 때 원래 메시지를 복원하라.

<div align="center">
<svg width="360" height="160" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:13px">
  <!-- Original text box -->
  <rect x="10" y="20" width="100" height="40" rx="6" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5"/>
  <text x="30" y="45" fill="#2196f3" font-weight="bold" font-size="16">"hello"</text>
  <!-- Step 1: shift -->
  <rect x="130" y="20" width="100" height="40" rx="6" fill="#fff3e0" stroke="#ff9800" stroke-width="1.5"/>
  <text x="148" y="45" fill="#ff9800" font-weight="bold" font-size="16">"khoor"</text>
  <!-- Step 2: reverse -->
  <rect x="250" y="20" width="100" height="40" rx="6" fill="#fce4ec" stroke="#f44336" stroke-width="1.5"/>
  <text x="265" y="45" fill="#f44336" font-weight="bold" font-size="16">"roohk"</text>
  <!-- Arrows -->
  <line x1="110" y1="40" x2="130" y2="40" stroke="#333" stroke-width="2" marker-end="url(#a)"/>
  <line x1="230" y1="40" x2="250" y2="40" stroke="#333" stroke-width="2"/>
  <polygon points="246,35 258,40 246,45" fill="#333"/>
  <!-- Labels -->
  <text x="112" y="30" fill="#ff9800" font-size="10">K=3 이동</text>
  <text x="232" y="30" fill="#f44336" font-size="10">뒤집기</text>
  <!-- Decrypt direction -->
  <path d="M 350 80 Q 180 130 10 80" fill="none" stroke="#4caf50" stroke-width="2" stroke-dasharray="5,4"/>
  <polygon points="14,74 10,82 18,82" fill="#4caf50"/>
  <text x="130" y="125" fill="#4caf50" font-size="12">복호화: 뒤집기 → K칸 앞으로</text>
  <!-- Original label -->
  <text x="28" y="15" fill="#2196f3" font-size="11">원문</text>
  <text x="267" y="15" fill="#f44336" font-size="11">암호문(입력)</text>
</svg>
</div>

## 입력

첫째 줄에 암호문 S와 정수 K가 주어진다. S는 소문자 알파벳으로만 이루어진다.

- 1 ≤ |S| ≤ 100
- 1 ≤ K ≤ 25

## 출력

복호화된 원래 메시지를 출력한다.

## 예제 입력 1

\`\`\`
roohk 3
\`\`\`

## 예제 출력 1

\`\`\`
hello
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "roohk 3", expectedOutput: "hello", isVisible: true },
      { input: "dcb 1", expectedOutput: "abc", isVisible: false },
      { input: "iqwtb 5", expectedOutput: "world", isVisible: false },
      { input: "a 1", expectedOutput: "z", isVisible: false },
    ],
    tags: ["문자열"],
  },

  // 8. 로봇 청소기
  {
    title: "로봇 청소기",
    description: `스마트 로봇 청소기가 N×M 방을 청소한다. 로봇은 다음 규칙으로 움직인다: ① 현재 방향 기준으로 왼쪽 방향부터 차례로 살피다가 아직 청소하지 않은 빈 칸이 있으면 이동해 청소한다. ② 4방향 모두 청소했거나 벽이면, 현재 방향 반대로 한 칸 후진한다. ③ 후진도 못 하면 종료한다. 청소한 칸 수를 구하라.

<div align="center">
<svg width="340" height="200" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:11px">
  <!-- 5x5 grid -->
  <g transform="translate(20,20)">
    <!-- walls (row1 and borders) -->
    <rect x="0"   y="0"   width="60" height="60" fill="#616161"/>
    <rect x="60"  y="0"   width="60" height="60" fill="#616161"/>
    <rect x="120" y="0"   width="60" height="60" fill="#616161"/>
    <rect x="180" y="0"   width="60" height="60" fill="#616161"/>
    <rect x="240" y="0"   width="60" height="60" fill="#616161"/>
    <rect x="0"   y="60"  width="60" height="60" fill="#616161"/>
    <rect x="60"  y="60"  width="60" height="60" fill="#e3f2fd"/>
    <rect x="120" y="60"  width="60" height="60" fill="#e3f2fd"/>
    <rect x="180" y="60"  width="60" height="60" fill="#e3f2fd"/>
    <rect x="240" y="60"  width="60" height="60" fill="#616161"/>
    <rect x="0"   y="120" width="60" height="60" fill="#616161"/>
    <rect x="60"  y="120" width="60" height="60" fill="#e3f2fd"/>
    <rect x="120" y="120" width="60" height="60" fill="#e3f2fd"/>
    <rect x="180" y="120" width="60" height="60" fill="#e3f2fd"/>
    <rect x="240" y="120" width="60" height="60" fill="#616161"/>
    <rect x="0"   y="180" width="60" height="60" fill="#616161"/>
    <rect x="60"  y="180" width="60" height="60" fill="#616161"/>
    <rect x="120" y="180" width="60" height="60" fill="#616161"/>
    <rect x="180" y="180" width="60" height="60" fill="#616161"/>
    <rect x="240" y="180" width="60" height="60" fill="#616161"/>
    <!-- Robot -->
    <text x="72" y="105" font-size="24">🤖</text>
    <!-- Direction arrow (facing north) -->
    <polygon points="90,66 86,78 94,78" fill="#f44336"/>
    <!-- Cleaned marks -->
    <text x="128" y="105" fill="#4caf50" font-size="20">✓</text>
    <text x="128" y="165" fill="#4caf50" font-size="20">✓</text>
  </g>
  <text x="20" y="195" fill="#616161">■ = 벽</text>
  <text x="100" y="195" fill="#e3f2fd" stroke="#333" stroke-width="0.5">■</text>
  <text x="115" y="195" fill="#333"> = 빈칸</text>
  <text x="235" y="195" fill="#f44336">▲ = 방향</text>
</svg>
</div>

## 입력

첫째 줄에 N과 M이 주어진다. 둘째 줄에 로봇의 시작 위치 r, c와 방향 d가 주어진다 (0=북, 1=동, 2=남, 3=서). 셋째 줄부터 N개의 줄에 방의 상태가 주어진다. 0은 빈 칸, 1은 벽이다.

- 3 ≤ N, M ≤ 50
- 방의 가장자리는 모두 벽이다.

## 출력

로봇이 청소한 칸의 수를 출력한다.

## 예제 입력 1

\`\`\`
5 5
1 1 0
1 1 1 1 1
1 0 0 0 1
1 0 0 0 1
1 0 0 0 1
1 1 1 1 1
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
      { input: "5 5\n1 1 0\n1 1 1 1 1\n1 0 0 0 1\n1 0 0 0 1\n1 0 0 0 1\n1 1 1 1 1", expectedOutput: "9", isVisible: true },
      { input: "3 3\n1 1 0\n1 1 1\n1 0 1\n1 1 1", expectedOutput: "1", isVisible: false },
      { input: "4 4\n1 1 0\n1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1", expectedOutput: "4", isVisible: false },
    ],
    tags: ["시뮬레이션", "구현"],
  },

  // 9. 놀이공원 줄서기
  {
    title: "놀이공원 줄서기",
    description: `놀이공원에서 N명이 키 순서와 상관없이 일렬로 줄을 서 있다. 앞에 자신보다 키가 큰 사람이 있으면 그 사람에게 가려져 뒤에서 볼 수 없다. 각 사람이 자기 앞에서 볼 수 있는 사람 수를 구하라.

<div align="center">
<svg width="340" height="160" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- People as bars -->
  <rect x="30"  y="60"  width="30" height="70" fill="#2196f3" rx="3"/>
  <rect x="80"  y="90"  width="30" height="40" fill="#ff9800" rx="3"/>
  <rect x="130" y="75"  width="30" height="55" fill="#4caf50" rx="3"/>
  <rect x="180" y="40"  width="30" height="90" fill="#f44336" rx="3"/>
  <rect x="230" y="80"  width="30" height="50" fill="#9c27b0" rx="3"/>
  <!-- Height labels -->
  <text x="36"  y="56"  fill="#333">5</text>
  <text x="86"  y="86"  fill="#333">3</text>
  <text x="136" y="71"  fill="#333">4</text>
  <text x="186" y="36"  fill="#333">6</text>
  <text x="236" y="76"  fill="#333">4</text>
  <!-- Person numbers -->
  <text x="38"  y="148" fill="#333">1번</text>
  <text x="88"  y="148" fill="#333">2번</text>
  <text x="138" y="148" fill="#333">3번</text>
  <text x="188" y="148" fill="#333">4번</text>
  <text x="238" y="148" fill="#333">5번</text>
  <!-- Visible count labels -->
  <text x="36"  y="72"  fill="white" font-size="11">0</text>
  <text x="86"  y="102" fill="white" font-size="11">1</text>
  <text x="136" y="87"  fill="white" font-size="11">2</text>
  <text x="186" y="52"  fill="white" font-size="11">2</text>
  <text x="236" y="92"  fill="white" font-size="11">1</text>
  <!-- eye icon -->
  <text x="270" y="80" font-size="14">👁</text>
  <text x="285" y="80" fill="#333" font-size="11">= 보이는 수</text>
  <text x="10"  y="20"  fill="#333" font-size="12">키: 5 3 4 6 4 → 보이는 수: 0 1 2 2 1</text>
</svg>
</div>

## 입력

첫째 줄에 N이 주어진다. 둘째 줄에 N명의 키가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 500000
- 1 ≤ 키 ≤ 1000000000

## 출력

각 사람이 자기 앞에서 볼 수 있는 사람 수를 공백으로 구분해 출력한다.

## 예제 입력 1

\`\`\`
5
5 3 4 6 4
\`\`\`

## 예제 출력 1

\`\`\`
0 1 2 2 1
\`\`\``,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n5 3 4 6 4", expectedOutput: "0 1 2 2 1", isVisible: true },
      { input: "3\n1 2 3", expectedOutput: "0 1 1", isVisible: false },
      { input: "4\n4 3 2 1", expectedOutput: "0 1 1 1", isVisible: false },
      { input: "1\n7", expectedOutput: "0", isVisible: false },
    ],
    tags: ["스택"],
  },

  // 10. 크리스마스 선물 포장
  {
    title: "크리스마스 선물 포장",
    description: `산타 할아버지가 N개의 선물을 상자에 담으려 한다. 상자 하나의 용량은 C킬로그램이다. First Fit 전략으로 선물을 넣는다: 각 선물을 첫 번째로 들어갈 수 있는 상자에 넣고, 안 되면 새 상자를 연다. 필요한 상자의 최소 수를 구하라.

<div align="center">
<svg width="360" height="160" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Conveyor belt -->
  <rect x="10" y="80" width="240" height="12" fill="#795548" rx="3"/>
  <circle cx="20"  cy="91" r="8" fill="#616161"/>
  <circle cx="60"  cy="91" r="8" fill="#616161"/>
  <circle cx="100" cy="91" r="8" fill="#616161"/>
  <circle cx="140" cy="91" r="8" fill="#616161"/>
  <circle cx="180" cy="91" r="8" fill="#616161"/>
  <circle cx="220" cy="91" r="8" fill="#616161"/>
  <!-- Gifts on belt -->
  <rect x="15" y="58" width="24" height="22" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5" rx="2"/>
  <text x="20" y="74" fill="#2196f3" font-size="10">4kg</text>
  <rect x="55" y="58" width="24" height="22" fill="#fce4ec" stroke="#f44336" stroke-width="1.5" rx="2"/>
  <text x="60" y="74" fill="#f44336" font-size="10">8kg</text>
  <rect x="95" y="62" width="18" height="18" fill="#e8f5e9" stroke="#4caf50" stroke-width="1.5" rx="2"/>
  <text x="98" y="75" fill="#4caf50" font-size="10">1kg</text>
  <rect x="135" y="58" width="24" height="22" fill="#fff3e0" stroke="#ff9800" stroke-width="1.5" rx="2"/>
  <text x="140" y="74" fill="#ff9800" font-size="10">4kg</text>
  <rect x="175" y="62" width="18" height="18" fill="#f3e5f5" stroke="#9c27b0" stroke-width="1.5" rx="2"/>
  <text x="178" y="75" fill="#9c27b0" font-size="10">2kg</text>
  <!-- Boxes -->
  <rect x="265" y="30" width="50" height="60" fill="#fff9c4" stroke="#ff9800" stroke-width="2" rx="3"/>
  <text x="272" y="55" fill="#333" font-size="10">상자1</text>
  <text x="272" y="70" fill="#ff9800" font-size="10">C=10</text>
  <rect x="315" y="40" width="40" height="50" fill="#e8f5e9" stroke="#4caf50" stroke-width="2" rx="3"/>
  <text x="320" y="62" fill="#333" font-size="10">상자2</text>
  <text x="265" y="115" fill="#333" font-size="11">선물: 4,8,1,4,2 → 상자 2개</text>
</svg>
</div>

## 입력

첫째 줄에 선물 수 N과 상자 용량 C가 주어진다. 둘째 줄에 N개 선물의 무게가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 10000
- 1 ≤ C ≤ 10000
- 1 ≤ 각 선물 무게 ≤ C

## 출력

필요한 상자의 최소 수를 출력한다.

## 예제 입력 1

\`\`\`
6 10
4 8 1 4 2 1
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\``,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 10\n4 8 1 4 2 1", expectedOutput: "2", isVisible: true },
      { input: "7 10\n2 5 4 7 1 3 8", expectedOutput: "4", isVisible: false },
      { input: "5 3\n1 1 1 1 1", expectedOutput: "2", isVisible: false },
      { input: "3 5\n5 5 5", expectedOutput: "3", isVisible: false },
    ],
    tags: ["그리디"],
  },

  // 11. 열쇠와 문
  {
    title: "열쇠와 문",
    description: `마법사 린이 탈출해야 하는 미로가 있다. 미로에는 열쇠(소문자 a~f)와 대응하는 문(대문자 A~F)이 있다. 열쇠를 먹으면 같은 알파벳 대문자 문을 열 수 있다. S에서 출발해 E까지 가는 최소 이동 횟수를 구하라. 이동 불가능하면 -1을 출력한다.

<div align="center">
<svg width="340" height="200" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:13px">
  <!-- 4x5 maze -->
  <g transform="translate(20,20)">
    <!-- Walls -->
    <rect x="0"   y="0"   width="60" height="40" fill="#616161"/>
    <rect x="60"  y="0"   width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="120" y="0"   width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="180" y="0"   width="60" height="40" fill="#616161"/>
    <rect x="240" y="0"   width="60" height="40" fill="#616161"/>
    <rect x="0"   y="40"  width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="60"  y="40"  width="60" height="40" fill="#616161"/>
    <rect x="120" y="40"  width="60" height="40" fill="#616161"/>
    <rect x="180" y="40"  width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="240" y="40"  width="60" height="40" fill="#616161"/>
    <rect x="0"   y="80"  width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="60"  y="80"  width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="120" y="80"  width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="180" y="80"  width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="240" y="80"  width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="0"   y="120" width="60" height="40" fill="#616161"/>
    <rect x="60"  y="120" width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="120" y="120" width="60" height="40" fill="#fff3e0" stroke="#ff9800" stroke-width="2"/>
    <rect x="180" y="120" width="60" height="40" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="240" y="120" width="60" height="40" fill="#e8f5e9" stroke="#4caf50" stroke-width="2"/>
    <!-- Labels -->
    <text x="25"  y="25"  fill="white" font-weight="bold" font-size="11">벽</text>
    <text x="72"  y="25"  fill="#2196f3" font-weight="bold">S</text>
    <text x="135" y="25"  fill="#ff9800" font-weight="bold">a</text>
    <text x="16"  y="65"  fill="#333" font-weight="bold" font-size="11">.</text>
    <text x="192" y="65"  fill="#333" font-weight="bold" font-size="11">.</text>
    <text x="16"  y="105" fill="#333">.</text>
    <text x="76"  y="105" fill="#333">.</text>
    <text x="136" y="105" fill="#333">.</text>
    <text x="192" y="105" fill="#333">.</text>
    <text x="252" y="105" fill="#333">.</text>
    <text x="132" y="145" fill="#ff9800" font-weight="bold">A</text>
    <text x="192" y="145" fill="#333">.</text>
    <text x="252" y="145" fill="#4caf50" font-weight="bold">E</text>
  </g>
  <text x="20"  y="188" fill="#ff9800" font-size="11">A = 문(열쇠 a 필요)</text>
  <text x="190" y="188" fill="#4caf50" font-size="11">E = 출구</text>
</svg>
</div>

## 입력

첫째 줄에 N과 M이 주어진다. 다음 N줄에 미로가 주어진다. S는 출발지, E는 도착지, a~f는 열쇠, A~F는 문, #는 벽, .는 빈 칸이다.

- 1 ≤ N, M ≤ 50

## 출력

최소 이동 횟수를 출력한다. 이동 불가능하면 \`-1\`을 출력한다.

## 예제 입력 1

\`\`\`
4 5
.Sa.
.##.
..A.
...E
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\``,
    difficulty: 7.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 5\n.Sa.\n.##.\n..A.\n...E", expectedOutput: "6", isVisible: true },
      { input: "3 3\nS..\n...\n..E", expectedOutput: "4", isVisible: false },
      { input: "3 3\nSa.\nA##\n..E", expectedOutput: "6", isVisible: false },
      { input: "3 3\nS..\nA##\n..E", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["BFS", "비트마스크"],
  },

  // 12. 바이러스 전파
  {
    title: "바이러스 전파",
    description: `컴퓨터 연구소에 N대의 컴퓨터가 네트워크로 연결되어 있다. 1번 컴퓨터가 바이러스에 감염되었을 때, 네트워크를 통해 감염될 수 있는 컴퓨터의 수를 구하라. (1번 컴퓨터 제외)

<div align="center">
<svg width="320" height="190" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Edges -->
  <line x1="80"  y1="80"  x2="150" y2="50"  stroke="#2196f3" stroke-width="1.5"/>
  <line x1="80"  y1="80"  x2="150" y2="120" stroke="#2196f3" stroke-width="1.5"/>
  <line x1="150" y1="50"  x2="230" y2="80"  stroke="#2196f3" stroke-width="1.5"/>
  <line x1="150" y1="120" x2="230" y2="80"  stroke="#2196f3" stroke-width="1.5"/>
  <line x1="150" y1="50"  x2="150" y2="120" stroke="#2196f3" stroke-width="1.5"/>
  <line x1="230" y1="80"  x2="270" y2="150" stroke="#9e9e9e" stroke-width="1.5" stroke-dasharray="5,4"/>
  <!-- Nodes -->
  <circle cx="80"  cy="80"  r="22" fill="#f44336" stroke="#c62828" stroke-width="2"/>
  <circle cx="150" cy="50"  r="22" fill="#ff9800" stroke="#e65100" stroke-width="2"/>
  <circle cx="150" cy="120" r="22" fill="#ff9800" stroke="#e65100" stroke-width="2"/>
  <circle cx="230" cy="80"  r="22" fill="#ff9800" stroke="#e65100" stroke-width="2"/>
  <circle cx="270" cy="150" r="18" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="2"/>
  <!-- Labels -->
  <text x="72"  y="85"  fill="white" font-weight="bold">1</text>
  <text x="142" y="55"  fill="white" font-weight="bold">2</text>
  <text x="142" y="125" fill="white" font-weight="bold">5</text>
  <text x="222" y="85"  fill="white" font-weight="bold">3</text>
  <text x="263" y="155" fill="#333" font-weight="bold">4</text>
  <!-- Legend -->
  <circle cx="30" cy="160" r="10" fill="#f44336"/>
  <text x="44" y="165" fill="#f44336">바이러스 원점</text>
  <circle cx="30" cy="180" r="10" fill="#ff9800"/>
  <text x="44" y="185" fill="#ff9800">감염됨 (3대)</text>
</svg>
</div>

## 입력

첫째 줄에 컴퓨터 수 N, 둘째 줄에 연결 수 E가 주어진다. 다음 E줄에 연결된 두 컴퓨터 번호가 주어진다.

- 1 ≤ N ≤ 100
- 0 ≤ E ≤ N×(N-1)/2

## 출력

1번 컴퓨터로부터 감염될 수 있는 컴퓨터의 수를 출력한다.

## 예제 입력 1

\`\`\`
7
6
1 2
2 3
1 5
5 2
5 6
4 7
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\``,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7\n6\n1 2\n2 3\n1 5\n5 2\n5 6\n4 7", expectedOutput: "4", isVisible: true },
      { input: "4\n2\n1 2\n2 3", expectedOutput: "2", isVisible: false },
      { input: "3\n0", expectedOutput: "0", isVisible: false },
      { input: "5\n4\n1 2\n1 3\n1 4\n1 5", expectedOutput: "4", isVisible: false },
    ],
    tags: ["그래프", "BFS"],
  },

  // 13. 사다리 타기
  {
    title: "사다리 타기",
    description: `N명이 세로 사다리를 탄다. 사다리에는 M개의 가로줄이 있어 이웃한 세로줄을 연결한다. 각 참가자가 사다리를 타면 어느 위치에 도달하는지 구하라.

<div align="center">
<svg width="280" height="200" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:13px">
  <!-- Vertical lines -->
  <line x1="50"  y1="20" x2="50"  y2="170" stroke="#333" stroke-width="2.5"/>
  <line x1="120" y1="20" x2="120" y2="170" stroke="#333" stroke-width="2.5"/>
  <line x1="190" y1="20" x2="190" y2="170" stroke="#333" stroke-width="2.5"/>
  <line x1="260" y1="20" x2="260" y2="170" stroke="#333" stroke-width="2.5"/>
  <!-- Horizontal rungs -->
  <line x1="50"  y1="60"  x2="120" y2="60"  stroke="#2196f3" stroke-width="2.5"/>
  <line x1="120" y1="100" x2="190" y2="100" stroke="#2196f3" stroke-width="2.5"/>
  <line x1="190" y1="130" x2="260" y2="130" stroke="#2196f3" stroke-width="2.5"/>
  <line x1="50"  y1="150" x2="120" y2="150" stroke="#2196f3" stroke-width="2.5"/>
  <!-- Person at top -->
  <text x="36"  y="20" fill="#f44336" font-weight="bold">A</text>
  <text x="106" y="20" fill="#333" font-weight="bold">B</text>
  <text x="176" y="20" fill="#333" font-weight="bold">C</text>
  <text x="246" y="20" fill="#333" font-weight="bold">D</text>
  <!-- Results at bottom -->
  <text x="36"  y="190" fill="#f44336" font-weight="bold">2</text>
  <text x="106" y="190" fill="#333" font-weight="bold">1</text>
  <text x="176" y="190" fill="#333" font-weight="bold">4</text>
  <text x="246" y="190" fill="#333" font-weight="bold">3</text>
  <!-- A path -->
  <polyline points="50,20 50,60 120,60 120,100 190,100 190,130 260,130 260,170" fill="none" stroke="#f44336" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.7"/>
</svg>
</div>

## 입력

첫째 줄에 참가자 수 N과 가로줄 수 M이 주어진다. 다음 M줄에 가로줄의 위치 r과 l이 주어진다. r은 위에서 r번째 행, l은 l번과 l+1번 세로줄 사이 가로줄을 의미한다.

- 2 ≤ N ≤ 10
- 0 ≤ M ≤ 15

## 출력

N줄에 걸쳐 1번부터 N번 참가자가 도달하는 위치를 출력한다.

## 예제 입력 1

\`\`\`
4 3
1 1
2 2
3 3
\`\`\`

## 예제 출력 1

\`\`\`
3
1
2
4
\`\`\``,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 3\n1 1\n2 2\n3 3", expectedOutput: "3\n1\n2\n4", isVisible: true },
      { input: "3 0", expectedOutput: "1\n2\n3", isVisible: false },
      { input: "3 2\n1 1\n2 2", expectedOutput: "2\n3\n1", isVisible: false },
      { input: "2 1\n1 1", expectedOutput: "2\n1", isVisible: false },
    ],
    tags: ["시뮬레이션"],
  },

  // 14. 지뢰 찾기
  {
    title: "지뢰 찾기",
    description: `클래식 지뢰 찾기 게임이다. N×M 격자에 지뢰(*)가 심어져 있다. 지뢰가 없는 칸에는 상하좌우 및 대각선 방향으로 인접한 지뢰의 수를 표시해야 한다.

<div align="center">
<svg width="300" height="180" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:14px">
  <!-- Input grid -->
  <text x="30" y="20" fill="#333" font-size="12">입력</text>
  <g transform="translate(10,30)">
    <rect x="0"  y="0"  width="35" height="35" fill="#f44336" stroke="#333" stroke-width="1"/>
    <rect x="35" y="0"  width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <rect x="70" y="0"  width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <rect x="0"  y="35" width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <rect x="35" y="35" width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <rect x="70" y="35" width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <text x="13"  y="23" fill="white" font-weight="bold">*</text>
    <text x="48"  y="23" fill="#333">.</text>
    <text x="83"  y="23" fill="#333">.</text>
    <text x="13"  y="58" fill="#333">.</text>
    <text x="48"  y="58" fill="#333">.</text>
    <text x="83"  y="58" fill="#333">.</text>
  </g>
  <!-- Arrow -->
  <text x="125" y="75" fill="#333" font-size="20">→</text>
  <!-- Output grid -->
  <text x="165" y="20" fill="#333" font-size="12">출력</text>
  <g transform="translate(150,30)">
    <rect x="0"  y="0"  width="35" height="35" fill="#f44336" stroke="#333" stroke-width="1"/>
    <rect x="35" y="0"  width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <rect x="70" y="0"  width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <rect x="0"  y="35" width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <rect x="35" y="35" width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <rect x="70" y="35" width="35" height="35" fill="#e3f2fd" stroke="#333" stroke-width="1"/>
    <text x="13"  y="23" fill="white" font-weight="bold">*</text>
    <text x="48"  y="23" fill="#2196f3" font-weight="bold">1</text>
    <text x="83"  y="23" fill="#333">0</text>
    <text x="13"  y="58" fill="#2196f3" font-weight="bold">1</text>
    <text x="48"  y="58" fill="#2196f3" font-weight="bold">1</text>
    <text x="83"  y="58" fill="#333">0</text>
  </g>
  <text x="30" y="155" fill="#333" font-size="12">* = 지뢰, 숫자 = 인접 지뢰 수</text>
</svg>
</div>

## 입력

첫째 줄에 N과 M이 주어진다. 다음 N줄에 격자 정보가 주어진다. \`*\`는 지뢰, \`.\`는 빈 칸이다.

- 1 ≤ N, M ≤ 20

## 출력

지뢰는 \`*\` 그대로, 빈 칸은 인접 지뢰 수(0~8)로 바꿔 출력한다.

## 예제 입력 1

\`\`\`
4 4
*...
....
.*..
....
\`\`\`

## 예제 출력 1

\`\`\`
*100
2210
1*10
1110
\`\`\``,
    difficulty: 3.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 4\n*...\n....\n.*..\n....", expectedOutput: "*100\n2210\n1*10\n1110", isVisible: true },
      { input: "3 3\n*.*\n...\n.*.", expectedOutput: "*2*\n232\n1*1", isVisible: false },
      { input: "2 2\n..\n..", expectedOutput: "00\n00", isVisible: false },
      { input: "1 3\n*.*", expectedOutput: "*2*", isVisible: false },
    ],
    tags: ["구현"],
  },

  // 15. 택배 상자 정리
  {
    title: "택배 상자 정리",
    description: `물류 창고에 N개의 택배 상자가 컨베이어 벨트를 통해 1번부터 N번 순서로 들어온다. 트럭에는 반드시 1번부터 N번 순서로 실어야 한다. 임시 보관 스택을 이용할 수 있을 때, 순서대로 실을 수 있는지 판별하라.

<div align="center">
<svg width="360" height="160" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Conveyor belt -->
  <rect x="10" y="50" width="150" height="12" fill="#795548" rx="2"/>
  <text x="10" y="42" fill="#333">컨베이어 (순서대로 도착)</text>
  <!-- Boxes on belt -->
  <rect x="15"  y="28" width="28" height="22" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5" rx="2"/>
  <text x="24"  y="44" fill="#2196f3" font-weight="bold">2</text>
  <rect x="55"  y="28" width="28" height="22" fill="#fff3e0" stroke="#ff9800" stroke-width="1.5" rx="2"/>
  <text x="64"  y="44" fill="#ff9800" font-weight="bold">1</text>
  <rect x="95"  y="28" width="28" height="22" fill="#e8f5e9" stroke="#4caf50" stroke-width="1.5" rx="2"/>
  <text x="104" y="44" fill="#4caf50" font-weight="bold">4</text>
  <rect x="135" y="28" width="28" height="22" fill="#fce4ec" stroke="#f44336" stroke-width="1.5" rx="2"/>
  <text x="144" y="44" fill="#f44336" font-weight="bold">3</text>
  <!-- Stack -->
  <rect x="185" y="30" width="60" height="90" fill="#f5f5f5" stroke="#9e9e9e" stroke-width="1.5" rx="3"/>
  <text x="196" y="25" fill="#333">임시 스택</text>
  <rect x="190" y="80" width="50" height="25" fill="#fff3e0" stroke="#ff9800" stroke-width="1.5" rx="2"/>
  <text x="205" y="97" fill="#ff9800" font-weight="bold">1</text>
  <!-- Truck -->
  <rect x="270" y="50" width="80" height="60" fill="#fff9c4" stroke="#ff9800" stroke-width="2" rx="4"/>
  <text x="293" y="75" fill="#333">트럭</text>
  <text x="282" y="95" fill="#ff9800" font-size="11">1→2→3→4</text>
  <!-- Arrow belt to stack -->
  <line x1="167" y1="62" x2="182" y2="62" stroke="#333" stroke-width="1.5"/>
  <polygon points="180,57 186,62 180,67" fill="#333"/>
  <!-- Arrow stack to truck -->
  <line x1="248" y1="80" x2="265" y2="80" stroke="#333" stroke-width="1.5"/>
  <polygon points="263,75 269,80 263,85" fill="#333"/>
</svg>
</div>

## 입력

첫째 줄에 N이 주어진다. 둘째 줄에 1~N의 순열이 공백으로 주어진다 (상자가 도착하는 순서).

- 1 ≤ N ≤ 100000

## 출력

트럭에 1번부터 순서대로 실을 수 있으면 \`YES\`, 없으면 \`NO\`를 출력한다.

## 예제 입력 1

\`\`\`
4
2 1 4 3
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
      { input: "4\n2 1 4 3", expectedOutput: "YES", isVisible: true },
      { input: "3\n2 3 1", expectedOutput: "NO", isVisible: false },
      { input: "5\n5 4 3 2 1", expectedOutput: "YES", isVisible: false },
      { input: "5\n2 4 3 1 5", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["스택"],
  },

  // 16. 빗물 고이기
  {
    title: "빗물 고이기",
    description: `어느 마을 골목에 높이가 다른 담벼락이 일렬로 늘어서 있다. 비가 온 뒤, 담벼락 사이에 고인 빗물의 총량을 구하라.

<div align="center">
<svg width="360" height="170" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Heights: 0,1,0,2,1,0,1,3,2,1,2,1 -->
  <!-- Scale: each unit = 20px, x spacing = 28px -->
  <g transform="translate(20,10)">
    <!-- Water level fills -->
    <rect x="0"   y="100" width="28" height="20"  fill="#2196f3" opacity="0.4"/>
    <rect x="28"  y="80"  width="28" height="20"  fill="#e3f2fd" stroke="#ccc" stroke-width="0"/>
    <rect x="56"  y="60"  width="28" height="40"  fill="#2196f3" opacity="0.4"/>
    <rect x="84"  y="60"  width="28" height="20"  fill="#e3f2fd"/>
    <rect x="112" y="40"  width="28" height="60"  fill="#2196f3" opacity="0.4"/>
    <rect x="140" y="20"  width="28" height="80"  fill="#e3f2fd"/>
    <rect x="168" y="40"  width="28" height="60"  fill="#2196f3" opacity="0.4"/>
    <rect x="196" y="40"  width="28" height="60"  fill="#2196f3" opacity="0.4"/>
    <rect x="224" y="60"  width="28" height="40"  fill="#2196f3" opacity="0.4"/>
    <rect x="252" y="40"  width="28" height="60"  fill="#e3f2fd"/>
    <rect x="280" y="60"  width="28" height="40"  fill="#2196f3" opacity="0.4"/>
    <!-- Wall blocks -->
    <rect x="28"  y="100" width="28" height="20" fill="#795548"/>
    <rect x="84"  y="80"  width="28" height="40" fill="#795548"/>
    <rect x="112" y="100" width="28" height="20" fill="#795548"/>
    <rect x="140" y="20"  width="28" height="100" fill="#795548"/>
    <rect x="168" y="100" width="28" height="20" fill="#795548"/>
    <rect x="196" y="40"  width="28" height="80" fill="#795548"/>
    <rect x="224" y="80"  width="28" height="40" fill="#795548"/>
    <rect x="252" y="100" width="28" height="20" fill="#795548"/>
    <rect x="280" y="40"  width="28" height="80" fill="#795548"/>
    <rect x="308" y="80"  width="28" height="40" fill="#795548"/>
    <!-- Ground -->
    <rect x="0" y="120" width="336" height="8" fill="#9e9e9e"/>
    <!-- Height labels -->
    <text x="3"   y="118" fill="#333">0</text>
    <text x="33"  y="98"  fill="#333">1</text>
    <text x="61"  y="118" fill="#333">0</text>
    <text x="89"  y="78"  fill="#333">2</text>
    <text x="117" y="98"  fill="#333">1</text>
    <text x="145" y="18"  fill="#333">3</text>
    <text x="173" y="98"  fill="#333">1</text>
    <text x="201" y="38"  fill="#333">2</text>
    <text x="229" y="78"  fill="#333">1</text>
    <text x="257" y="98"  fill="#333">2</text>
    <text x="285" y="78"  fill="#333">1</text>
  </g>
  <text x="20" y="158" fill="#2196f3" font-size="12">고인 물 = 6 단위</text>
</svg>
</div>

## 입력

첫째 줄에 블록의 수 N이 주어진다. 둘째 줄에 각 블록의 높이가 공백으로 주어진다.

- 1 ≤ N ≤ 100000
- 0 ≤ 높이 ≤ 100000

## 출력

고인 빗물의 총량을 출력한다.

## 예제 입력 1

\`\`\`
12
0 1 0 2 1 0 1 3 2 1 2 1
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6", isVisible: true },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9", isVisible: false },
      { input: "5\n3 0 2 0 4", expectedOutput: "7", isVisible: false },
      { input: "3\n2 0 2", expectedOutput: "2", isVisible: false },
      { input: "5\n1 2 3 4 5", expectedOutput: "0", isVisible: false },
    ],
    tags: ["스택", "구현"],
  },

  // 17. 마법사의 탑
  {
    title: "마법사의 탑",
    description: `마법사 민준이 N층짜리 탑을 오르려 한다. 각 층에는 체력이 h인 몬스터가 있다. 민준의 공격력은 A이며, 매 공격마다 1턴이 소비된다. K개의 물약이 있는데, 물약을 사용하면 해당 층에서만 공격력이 2배가 된다. 모든 층을 클리어하는 최소 턴 수를 구하라.

<div align="center">
<svg width="300" height="210" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Tower floors -->
  <rect x="90" y="10"  width="120" height="40" fill="#fce4ec" stroke="#f44336" stroke-width="1.5" rx="3"/>
  <rect x="90" y="60"  width="120" height="40" fill="#fff3e0" stroke="#ff9800" stroke-width="1.5" rx="3"/>
  <rect x="90" y="110" width="120" height="40" fill="#e8f5e9" stroke="#4caf50" stroke-width="1.5" rx="3"/>
  <rect x="90" y="160" width="120" height="40" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5" rx="3"/>
  <!-- Monster HP labels -->
  <text x="120" y="35" fill="#f44336" font-weight="bold">3층 HP:50  💀</text>
  <text x="120" y="85" fill="#ff9800" font-weight="bold">2층 HP:20  👾</text>
  <text x="120" y="135" fill="#4caf50" font-weight="bold">1층 HP:30  🐉</text>
  <!-- Wizard -->
  <text x="20" y="185" font-size="24">🧙</text>
  <text x="15" y="200" fill="#2196f3" font-size="10">공격력 A=10</text>
  <text x="15" y="215" fill="#ff9800" font-size="10">물약 K개</text>
  <!-- Potion label -->
  <text x="220" y="130" font-size="20">🧪</text>
  <text x="215" y="145" fill="#9c27b0" font-size="10">물약=2배</text>
  <!-- Arrow up -->
  <line x1="55" y1="190" x2="55" y2="20" stroke="#333" stroke-width="1.5"/>
  <polygon points="50,24 55,12 60,24" fill="#333"/>
</svg>
</div>

## 입력

첫째 줄에 층 수 N, 공격력 A, 물약 수 K가 주어진다. 둘째 줄에 각 층 몬스터의 체력이 아래 층부터 순서대로 주어진다.

- 1 ≤ N ≤ 1000
- 1 ≤ A ≤ 1000
- 0 ≤ K ≤ N
- 1 ≤ 각 체력 ≤ 100000

## 출력

모든 층을 클리어하는 최소 턴 수를 출력한다.

## 예제 입력 1

\`\`\`
3 10 1
50 20 15
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
      { input: "3 10 1\n50 20 15", expectedOutput: "7", isVisible: true },
      { input: "3 10 2\n50 20 15", expectedOutput: "6", isVisible: false },
      { input: "4 5 2\n30 20 15 10", expectedOutput: "10", isVisible: false },
      { input: "3 10 0\n20 30 10", expectedOutput: "6", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 18. 기차 여행
  {
    title: "기차 여행",
    description: `여행을 떠난 지호는 기차를 타고 목적지에 가려 한다. N개의 역과 M개의 노선이 있으며, 각 노선에는 소요 시간이 있다. 출발역에서 도착역까지 가장 빠른 경로를 찾아라.

<div align="center">
<svg width="340" height="190" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Edges -->
  <line x1="60"  y1="95"  x2="150" y2="50"  stroke="#9e9e9e" stroke-width="1.5"/>
  <line x1="60"  y1="95"  x2="150" y2="140" stroke="#2196f3" stroke-width="2.5"/>
  <line x1="150" y1="50"  x2="240" y2="95"  stroke="#9e9e9e" stroke-width="1.5"/>
  <line x1="150" y1="140" x2="240" y2="95"  stroke="#2196f3" stroke-width="2.5"/>
  <line x1="240" y1="95"  x2="310" y2="95"  stroke="#2196f3" stroke-width="2.5"/>
  <!-- Edge weight labels -->
  <text x="90"  y="60"  fill="#9e9e9e">10</text>
  <text x="85"  y="130" fill="#2196f3" font-weight="bold">5</text>
  <text x="190" y="55"  fill="#9e9e9e">3</text>
  <text x="185" y="140" fill="#2196f3" font-weight="bold">8</text>
  <text x="265" y="88"  fill="#2196f3" font-weight="bold">2</text>
  <!-- Nodes -->
  <circle cx="60"  cy="95"  r="22" fill="#f44336" stroke="#c62828" stroke-width="2"/>
  <circle cx="150" cy="50"  r="22" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5"/>
  <circle cx="150" cy="140" r="22" fill="#fff3e0" stroke="#ff9800" stroke-width="1.5"/>
  <circle cx="240" cy="95"  r="22" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5"/>
  <circle cx="310" cy="95"  r="22" fill="#4caf50" stroke="#388e3c" stroke-width="2"/>
  <!-- Labels -->
  <text x="51"  y="100" fill="white" font-weight="bold">출발</text>
  <text x="143" y="55"  fill="#333" font-weight="bold">2</text>
  <text x="143" y="145" fill="#333" font-weight="bold">3</text>
  <text x="233" y="100" fill="#333" font-weight="bold">4</text>
  <text x="300" y="100" fill="white" font-weight="bold">도착</text>
  <!-- Shortest path label -->
  <text x="30" y="178" fill="#2196f3" font-size="12">최단 경로: 출발→3→4→도착 = 15분</text>
</svg>
</div>

## 입력

첫째 줄에 역의 수 N과 노선의 수 M이 주어진다. 다음 M줄에 노선 정보 u v w가 주어진다 (u와 v를 잇는 양방향 노선, 소요 시간 w). 마지막 줄에 출발역 S와 도착역 T가 주어진다.

- 1 ≤ N ≤ 1000
- 1 ≤ M ≤ 10000
- 1 ≤ w ≤ 100000
- S ≠ T

## 출력

출발역에서 도착역까지의 최소 소요 시간을 출력한다. 도달할 수 없으면 \`-1\`을 출력한다.

## 예제 입력 1

\`\`\`
5 5
1 2 10
1 3 5
2 4 3
3 4 8
4 5 2
1 5
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
      { input: "5 5\n1 2 10\n1 3 5\n2 4 3\n3 4 8\n4 5 2\n1 5", expectedOutput: "15", isVisible: true },
      { input: "4 4\n1 2 3\n2 3 2\n3 4 1\n1 4 10\n1 4", expectedOutput: "6", isVisible: false },
      { input: "3 1\n1 2 5\n1 3", expectedOutput: "-1", isVisible: false },
      { input: "2 1\n1 2 7\n2 1", expectedOutput: "7", isVisible: false },
    ],
    tags: ["그래프", "다익스트라"],
  },

  // 19. 농장 울타리
  {
    title: "농장 울타리",
    description: `농부 철수는 N그루의 나무를 모두 감싸는 울타리를 치려 한다. 나무를 모두 포함하는 볼록 다각형 울타리의 최소 둘레를 구하라.

<div align="center">
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Convex hull fence -->
  <polygon points="40,160 80,40 200,20 260,100 220,170 80,180" fill="none" stroke="#795548" stroke-width="2.5" stroke-dasharray="7,4"/>
  <!-- Trees (points) -->
  <circle cx="40"  cy="160" r="6" fill="#4caf50"/>
  <circle cx="80"  cy="40"  r="6" fill="#4caf50"/>
  <circle cx="200" cy="20"  r="6" fill="#4caf50"/>
  <circle cx="260" cy="100" r="6" fill="#4caf50"/>
  <circle cx="220" cy="170" r="6" fill="#4caf50"/>
  <circle cx="80"  cy="180" r="6" fill="#4caf50"/>
  <!-- Interior trees -->
  <circle cx="120" cy="100" r="5" fill="#4caf50" opacity="0.5"/>
  <circle cx="160" cy="120" r="5" fill="#4caf50" opacity="0.5"/>
  <circle cx="140" cy="60"  r="5" fill="#4caf50" opacity="0.5"/>
  <!-- Tree icons -->
  <text x="34"  cy="155" font-size="14">🌳</text>
  <text x="73"  y="36"   font-size="14">🌳</text>
  <text x="193" y="16"   font-size="14">🌳</text>
  <text x="253" y="96"   font-size="14">🌳</text>
  <text x="213" y="166"  font-size="14">🌳</text>
  <text x="73"  y="176"  font-size="14">🌳</text>
  <!-- Label -->
  <text x="20"  y="200" fill="#795548" font-size="12">볼록 껍질 = 최소 울타리 둘레</text>
</svg>
</div>

## 입력

첫째 줄에 나무의 수 N이 주어진다. 다음 N줄에 각 나무의 좌표 x, y가 주어진다.

- 3 ≤ N ≤ 10000
- 0 ≤ x, y ≤ 100000
- 세 점이 일직선 위에 있는 경우는 없다.

## 출력

울타리의 최소 둘레를 출력한다. 절댓값 오차 0.01 이하이면 정답으로 인정한다.

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
14.00
\`\`\``,
    difficulty: 6.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.01,
    testCases: [
      { input: "4\n0 0\n4 0\n4 3\n0 3", expectedOutput: "14.00", isVisible: true },
      { input: "3\n0 0\n2 0\n1 2", expectedOutput: "6.47", isVisible: false },
      { input: "5\n0 0\n3 0\n3 4\n0 4\n1 2", expectedOutput: "14.00", isVisible: false },
      { input: "4\n0 0\n2 0\n2 2\n0 2", expectedOutput: "8.00", isVisible: false },
    ],
    tags: ["기하"],
  },

  // 20. 카드 게임
  {
    title: "카드 게임",
    description: `두 플레이어 A와 B가 카드 게임을 한다. 각자 N장의 카드를 들고 있으며, 매 라운드마다 동시에 한 장씩 내서 큰 쪽이 1점을 얻는다. 플레이어 A가 이길 수 있는 라운드 수를 최대화할 때, 최대 몇 번 이길 수 있을까? (B의 전략은 고정되어 있어 항상 오름차순으로 낸다)

<div align="center">
<svg width="340" height="170" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:13px">
  <!-- Player A hand -->
  <text x="20" y="25" fill="#2196f3" font-weight="bold">플레이어 A</text>
  <rect x="20"  y="35" width="36" height="50" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5" rx="4"/>
  <text x="30"  y="66" fill="#2196f3" font-weight="bold" font-size="16">5</text>
  <rect x="64"  y="35" width="36" height="50" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5" rx="4"/>
  <text x="74"  y="66" fill="#2196f3" font-weight="bold" font-size="16">3</text>
  <rect x="108" y="35" width="36" height="50" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5" rx="4"/>
  <text x="118" y="66" fill="#2196f3" font-weight="bold" font-size="16">1</text>
  <!-- Player B hand -->
  <text x="200" y="25" fill="#f44336" font-weight="bold">플레이어 B</text>
  <rect x="200" y="35" width="36" height="50" fill="#fce4ec" stroke="#f44336" stroke-width="1.5" rx="4"/>
  <text x="210" y="66" fill="#f44336" font-weight="bold" font-size="16">4</text>
  <rect x="244" y="35" width="36" height="50" fill="#fce4ec" stroke="#f44336" stroke-width="1.5" rx="4"/>
  <text x="254" y="66" fill="#f44336" font-weight="bold" font-size="16">2</text>
  <rect x="288" y="35" width="36" height="50" fill="#fce4ec" stroke="#f44336" stroke-width="1.5" rx="4"/>
  <text x="298" y="66" fill="#f44336" font-weight="bold" font-size="16">6</text>
  <!-- Result -->
  <text x="30"  y="120" fill="#333">B=2: A가 3으로 이김 ✓</text>
  <text x="30"  y="140" fill="#333">B=4: A가 5로 이김 ✓</text>
  <text x="30"  y="160" fill="#333">B=6: A는 질 수밖에 없음 ✗</text>
  <text x="220" y="140" fill="#4caf50" font-size="16" font-weight="bold">최대 2승</text>
</svg>
</div>

## 입력

첫째 줄에 카드 수 N이 주어진다. 둘째 줄에 A의 카드 N개, 셋째 줄에 B의 카드 N개가 주어진다. 모든 카드 번호는 서로 다르다.

- 1 ≤ N ≤ 100000
- 1 ≤ 카드 번호 ≤ 10000000

## 출력

A가 이길 수 있는 최대 라운드 수를 출력한다.

## 예제 입력 1

\`\`\`
3
5 3 1
4 2 6
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
      { input: "3\n5 3 1\n4 2 6", expectedOutput: "2", isVisible: true },
      { input: "3\n1 2 3\n4 5 6", expectedOutput: "0", isVisible: false },
      { input: "3\n6 5 4\n1 2 3", expectedOutput: "3", isVisible: false },
      { input: "4\n3 5 8 1\n4 6 2 7", expectedOutput: "3", isVisible: false },
    ],
    tags: ["그리디", "정렬"],
  },

  // 21. 미로 속 치즈
  {
    title: "미로 속 치즈",
    description: `생쥐 미미가 미로에 갇혔다. S에서 출발해 먼저 치즈(C)를 먹고, 그 다음 탈출구(E)까지 가야 한다. 최단 이동 거리를 구하라.

<div align="center">
<svg width="280" height="200" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:13px">
  <!-- 4x4 maze grid -->
  <g transform="translate(30,20)">
    <!-- Row 0 -->
    <rect x="0"   y="0"   width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="50"  y="0"   width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="100" y="0"   width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="150" y="0"   width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <!-- Row 1 -->
    <rect x="0"   y="50"  width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="50"  y="50"  width="50" height="50" fill="#616161"/>
    <rect x="100" y="50"  width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="150" y="50"  width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <!-- Row 2 -->
    <rect x="0"   y="100" width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="50"  y="100" width="50" height="50" fill="#fff3e0" stroke="#ff9800" stroke-width="2"/>
    <rect x="100" y="100" width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="150" y="100" width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <!-- Row 3 -->
    <rect x="0"   y="150" width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="50"  y="150" width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="100" y="150" width="50" height="50" fill="#e3f2fd" stroke="#9e9e9e" stroke-width="1"/>
    <rect x="150" y="150" width="50" height="50" fill="#e8f5e9" stroke="#4caf50" stroke-width="2"/>
    <!-- Cell labels -->
    <text x="16"  y="31"  fill="#f44336" font-weight="bold" font-size="16">S</text>
    <text x="162" y="131" fill="#ff9800" font-weight="bold" font-size="14">🧀</text>
    <text x="162" y="181" fill="#4caf50" font-weight="bold" font-size="16">E</text>
  </g>
  <text x="30" y="192" fill="#f44336" font-size="11">S→🧀: 이동 후 E까지 최단 경로</text>
</svg>
</div>

## 입력

첫째 줄에 N과 M이 주어진다. 다음 N줄에 미로가 주어진다. S는 출발, C는 치즈, E는 탈출구, #는 벽, .은 빈 칸이다.

- 3 ≤ N, M ≤ 100

## 출력

S에서 C를 거쳐 E까지 가는 최단 이동 거리를 출력한다. 불가능하면 \`-1\`을 출력한다.

## 예제 입력 1

\`\`\`
3 3
S..
.C.
..E
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
      { input: "3 3\nS..\n.C.\n..E", expectedOutput: "4", isVisible: true },
      { input: "4 4\nS...\n.##.\n.C..\n...E", expectedOutput: "7", isVisible: false },
      { input: "3 4\nS#C.\n....\nE...", expectedOutput: "8", isVisible: false },
      { input: "3 3\nS..\n###\n.CE", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["BFS"],
  },

  // 22. 공장 로봇 팔
  {
    title: "공장 로봇 팔",
    description: `공장에 N개의 기둥이 있고 각 기둥에는 상자가 쌓여 있다. 로봇 팔은 명령 "MOVE a b"를 받으면 a번 기둥의 맨 위 상자를 b번 기둥 맨 위에 올린다. 모든 명령을 수행한 후 각 기둥의 상태를 출력하라.

<div align="center">
<svg width="320" height="180" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Crane arm -->
  <rect x="130" y="10" width="80" height="8" fill="#616161" rx="2"/>
  <rect x="165" y="10" width="8"  height="30" fill="#9e9e9e" rx="2"/>
  <!-- Gripped box -->
  <rect x="153" y="38" width="34" height="22" fill="#fff3e0" stroke="#ff9800" stroke-width="2" rx="2"/>
  <text x="162" y="54" fill="#ff9800" font-weight="bold">📦</text>
  <!-- Columns -->
  <rect x="30"  y="160" width="60" height="6" fill="#795548" rx="2"/>
  <rect x="130" y="160" width="60" height="6" fill="#795548" rx="2"/>
  <rect x="230" y="160" width="60" height="6" fill="#795548" rx="2"/>
  <!-- Boxes on columns -->
  <rect x="40"  y="120" width="40" height="25" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5" rx="2"/>
  <rect x="40"  y="95"  width="40" height="25" fill="#e8f5e9" stroke="#4caf50" stroke-width="1.5" rx="2"/>
  <rect x="240" y="120" width="40" height="25" fill="#fce4ec" stroke="#f44336" stroke-width="1.5" rx="2"/>
  <text x="52"  y="137" fill="#2196f3" font-weight="bold">1</text>
  <text x="52"  y="112" fill="#4caf50" font-weight="bold">2</text>
  <text x="252" y="137" fill="#f44336" font-weight="bold">4</text>
  <!-- Column numbers -->
  <text x="52"  y="178" fill="#333">기둥1</text>
  <text x="152" y="178" fill="#333">기둥2</text>
  <text x="252" y="178" fill="#333">기둥3</text>
  <!-- Arrow -->
  <line x1="168" y1="60" x2="168" y2="92" stroke="#ff9800" stroke-width="1.5" stroke-dasharray="4,3"/>
  <polygon points="163,90 168,100 173,90" fill="#ff9800"/>
</svg>
</div>

## 입력

첫째 줄에 기둥 수 N이 주어진다. 다음 N줄에 각 기둥에 쌓인 상자들이 아래부터 위 순서로 공백으로 구분되어 주어진다. (빈 기둥은 0) 그 다음 줄에 명령 수 Q가 주어지고, 다음 Q줄에 "MOVE a b" 명령이 주어진다.

- 1 ≤ N ≤ 10
- 0 ≤ 상자 수 ≤ 10
- 1 ≤ Q ≤ 100

## 출력

N줄에 걸쳐 각 기둥의 상자를 아래부터 위 순서로 출력한다. 빈 기둥은 \`empty\`를 출력한다.

## 예제 입력 1

\`\`\`
3
1 2 3
4 5
6
2
MOVE 1 3
MOVE 2 1
\`\`\`

## 예제 출력 1

\`\`\`
1 2 5
4
6 3
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n1 2 3\n4 5\n6\n2\nMOVE 1 3\nMOVE 2 1", expectedOutput: "1 2 5\n4\n6 3", isVisible: true },
      { input: "2\n1\n2\n2\nMOVE 1 2\nMOVE 2 1", expectedOutput: "1\n2", isVisible: false },
      { input: "3\n1 2\n0\n3\n1\nMOVE 1 2", expectedOutput: "1\n2\n3", isVisible: false },
      { input: "2\n1 2 3\n4\n3\nMOVE 1 2\nMOVE 1 2\nMOVE 2 1", expectedOutput: "1 2\n4 3", isVisible: false },
    ],
    tags: ["시뮬레이션", "구현"],
  },

  // 23. 학교 소풍
  {
    title: "학교 소풍",
    description: `소풍날 N명의 학생이 짝을 짓는다. 각 학생은 짝이 되고 싶은 학생 목록을 제출했다. 서로 짝이 되고 싶은 학생끼리만 매칭할 때, 짝의 수를 최대로 하는 매칭 수를 구하라.

<div align="center">
<svg width="300" height="180" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Student nodes -->
  <circle cx="50"  cy="60"  r="22" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5"/>
  <circle cx="50"  cy="130" r="22" fill="#e3f2fd" stroke="#2196f3" stroke-width="1.5"/>
  <circle cx="150" cy="40"  r="22" fill="#e8f5e9" stroke="#4caf50" stroke-width="1.5"/>
  <circle cx="150" cy="100" r="22" fill="#e8f5e9" stroke="#4caf50" stroke-width="1.5"/>
  <circle cx="150" cy="160" r="22" fill="#e8f5e9" stroke="#4caf50" stroke-width="1.5"/>
  <!-- Mutual like edges (solid) -->
  <line x1="72"  y1="55"  x2="128" y2="45"  stroke="#f44336" stroke-width="2.5"/>
  <line x1="72"  y1="120" x2="128" y2="105" stroke="#f44336" stroke-width="2.5"/>
  <!-- One-way edges (dashed) -->
  <line x1="72"  y1="65"  x2="128" y2="95"  stroke="#9e9e9e" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="72"  y1="135" x2="128" y2="155" stroke="#9e9e9e" stroke-width="1.5" stroke-dasharray="5,3"/>
  <!-- Labels -->
  <text x="41"  y="65"  fill="#2196f3" font-weight="bold">1</text>
  <text x="41"  y="135" fill="#2196f3" font-weight="bold">2</text>
  <text x="141" y="45"  fill="#4caf50" font-weight="bold">3</text>
  <text x="141" y="105" fill="#4caf50" font-weight="bold">4</text>
  <text x="141" y="165" fill="#4caf50" font-weight="bold">5</text>
  <!-- Legend -->
  <line x1="200" y1="60" x2="240" y2="60" stroke="#f44336" stroke-width="2.5"/>
  <text x="245" y="65" fill="#f44336">상호 희망</text>
  <line x1="200" y1="90" x2="240" y2="90" stroke="#9e9e9e" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="245" y="95" fill="#9e9e9e">일방적</text>
  <text x="195" y="130" fill="#f44336" font-weight="bold">최대 2쌍</text>
</svg>
</div>

## 입력

첫째 줄에 학생 수 N이 주어진다. 다음 N줄에 i번 학생이 짝을 희망하는 학생 번호들이 주어진다 (빈 줄 가능).

- 2 ≤ N ≤ 10

## 출력

짝지을 수 있는 최대 쌍의 수를 출력한다.

## 예제 입력 1

\`\`\`
5
2 3
1 4
1
2 3
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
      { input: "5\n2 3\n1 4\n1\n2 3\n", expectedOutput: "2", isVisible: true },
      { input: "4\n2\n1\n4\n3", expectedOutput: "2", isVisible: false },
      { input: "4\n2\n3\n1\n", expectedOutput: "0", isVisible: false },
      { input: "3\n2 3\n1 3\n1 2", expectedOutput: "1", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  // 24. 금고 비밀번호
  {
    title: "금고 비밀번호",
    description: `박물관에 4자리 다이얼 자물쇠가 달린 금고가 있다. 한 번의 조작으로 임의의 한 자리를 1 증가 또는 감소(0↔9 순환)할 수 있다. 위험 번호 목록이 주어질 때, 현재 비밀번호에서 목표 비밀번호까지 위험 번호를 거치지 않고 최소 몇 번 조작해야 할까?

<div align="center">
<svg width="340" height="160" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:13px">
  <!-- Lock body -->
  <rect x="90" y="30" width="160" height="100" rx="12" fill="#9e9e9e" stroke="#616161" stroke-width="2"/>
  <!-- Dials -->
  <rect x="100" y="50" width="32" height="44" rx="6" fill="#333" stroke="#555" stroke-width="1"/>
  <rect x="140" y="50" width="32" height="44" rx="6" fill="#333" stroke="#555" stroke-width="1"/>
  <rect x="180" y="50" width="32" height="44" rx="6" fill="#333" stroke="#555" stroke-width="1"/>
  <rect x="220" y="50" width="32" height="44" rx="6" fill="#333" stroke="#555" stroke-width="1"/>
  <!-- Digit display -->
  <text x="107" y="79" fill="#ff9800" font-size="22" font-weight="bold">0</text>
  <text x="147" y="79" fill="#ff9800" font-size="22" font-weight="bold">0</text>
  <text x="187" y="79" fill="#ff9800" font-size="22" font-weight="bold">0</text>
  <text x="227" y="79" fill="#ff9800" font-size="22" font-weight="bold">0</text>
  <!-- Up/down arrows on dials -->
  <text x="112" y="50" fill="#ccc" font-size="10">▲</text>
  <text x="112" y="102" fill="#ccc" font-size="10">▼</text>
  <!-- Target label -->
  <text x="90"  y="148" fill="#2196f3" font-size="13">0000 → 8888 = 최소 8번 조작</text>
  <!-- Forbidden label -->
  <text x="90"  y="165" fill="#f44336" font-size="11">⚠ 위험 번호는 통과 불가</text>
</svg>
</div>

## 입력

첫째 줄에 시작 비밀번호와 목표 비밀번호가 주어진다. 둘째 줄에 위험 번호의 수 M이 주어진다. 다음 M줄에 위험 번호가 주어진다. 모든 번호는 4자리 문자열이다.

- 0 ≤ M ≤ 100

## 출력

최소 조작 횟수를 출력한다. 불가능하면 \`-1\`을 출력한다.

## 예제 입력 1

\`\`\`
0000 8888
0
\`\`\`

## 예제 출력 1

\`\`\`
8
\`\`\``,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "0000 8888\n0", expectedOutput: "8", isVisible: true },
      { input: "0000 0000\n0", expectedOutput: "0", isVisible: false },
      { input: "1234 5678\n0", expectedOutput: "16", isVisible: false },
      { input: "0000 0002\n1\n0001", expectedOutput: "4", isVisible: false },
      { input: "0000 0001\n8\n0001 0009 1000 9000 0010 0090 0100 0900", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["BFS"],
  },

  // 25. 도서관 책 정리
  {
    title: "도서관 책 정리",
    description: `사서 지은이가 책장의 N권의 책을 높이 순서로 정렬하려 한다. 한 번의 swap으로 임의의 두 책의 위치를 바꿀 수 있다. K번 이하의 swap으로 높이순 정렬이 가능한지 판별하라.

<div align="center">
<svg width="340" height="180" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif;font-size:12px">
  <!-- Bookshelf before -->
  <rect x="10" y="140" width="140" height="8" fill="#795548" rx="2"/>
  <text x="35" y="135" fill="#333" font-size="11">정렬 전</text>
  <!-- Books before (heights: 3,1,2,5,4) -->
  <rect x="20"  y="80"  width="18" height="60" fill="#f44336" rx="2"/>
  <rect x="42"  y="120" width="18" height="20" fill="#ff9800" rx="2"/>
  <rect x="64"  y="100" width="18" height="40" fill="#4caf50" rx="2"/>
  <rect x="86"  y="40"  width="18" height="100" fill="#2196f3" rx="2"/>
  <rect x="108" y="60"  width="18" height="80" fill="#9c27b0" rx="2"/>
  <text x="25"  y="155" fill="white" font-size="10">3</text>
  <text x="47"  y="155" fill="white" font-size="10">1</text>
  <text x="69"  y="155" fill="white" font-size="10">2</text>
  <text x="91"  y="155" fill="white" font-size="10">5</text>
  <text x="113" y="155" fill="white" font-size="10">4</text>
  <!-- Arrow -->
  <text x="158" y="100" fill="#333" font-size="20">→</text>
  <text x="151" y="118" fill="#ff9800" font-size="11">3번 swap</text>
  <!-- Bookshelf after -->
  <rect x="185" y="140" width="140" height="8" fill="#795548" rx="2"/>
  <text x="210" y="135" fill="#333" font-size="11">정렬 후</text>
  <!-- Books after (1,2,3,4,5) -->
  <rect x="195" y="120" width="18" height="20" fill="#ff9800" rx="2"/>
  <rect x="217" y="100" width="18" height="40" fill="#4caf50" rx="2"/>
  <rect x="239" y="80"  width="18" height="60" fill="#f44336" rx="2"/>
  <rect x="261" y="60"  width="18" height="80" fill="#9c27b0" rx="2"/>
  <rect x="283" y="40"  width="18" height="100" fill="#2196f3" rx="2"/>
  <text x="200" y="155" fill="white" font-size="10">1</text>
  <text x="222" y="155" fill="white" font-size="10">2</text>
  <text x="244" y="155" fill="white" font-size="10">3</text>
  <text x="266" y="155" fill="white" font-size="10">4</text>
  <text x="288" y="155" fill="white" font-size="10">5</text>
</svg>
</div>

## 입력

첫째 줄에 책의 수 N과 최대 swap 횟수 K가 주어진다. 둘째 줄에 N권의 책 높이가 공백으로 주어진다. 높이는 모두 서로 다르다.

- 1 ≤ N ≤ 500
- 0 ≤ K ≤ N

## 출력

K번 이하의 swap으로 정렬 가능하면 \`YES\`, 불가능하면 \`NO\`를 출력한다.

## 예제 입력 1

\`\`\`
5 3
3 1 2 5 4
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
      { input: "5 3\n3 1 2 5 4", expectedOutput: "YES", isVisible: true },
      { input: "5 2\n2 3 4 5 1", expectedOutput: "NO", isVisible: false },
      { input: "5 0\n1 2 3 4 5", expectedOutput: "YES", isVisible: false },
      { input: "3 1\n3 2 1", expectedOutput: "YES", isVisible: false },
      { input: "4 1\n4 3 2 1", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["정렬", "구현"],
  },
];
