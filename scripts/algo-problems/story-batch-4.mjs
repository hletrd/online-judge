export const problems = [
  // 1. 드래곤 슬레이어
  {
    title: "드래곤 슬레이어",
    description: `용사 아르테아는 마침내 드래곤의 소굴에 도달했다. 용사의 초기 체력은 A, 공격력은 B이다. 드래곤의 체력은 C, 공격력은 D이다. 용사는 물약을 E개 보유하고 있으며, 물약 한 개를 마시면 체력이 H만큼 회복된다.

전투는 턴제로 진행된다. 매 턴 용사가 먼저 공격하고, 드래곤이 반격한다. 용사는 드래곤의 반격으로 체력이 0 이하가 될 때마다 물약을 한 개 마셔 체력을 회복할 수 있다. 물약을 마셔도 체력이 0 이하이면 용사는 사망한다.

용사가 드래곤을 무찌르기 위해 필요한 최소 물약 사용 횟수를 구하여라. 물약을 모두 써도 이길 수 없으면 -1을 출력한다.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <!-- Hero -->
  <circle cx="80" cy="100" r="30" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="80" y="95" text-anchor="middle" fill="white" font-size="11" font-weight="bold">용사</text>
  <text x="80" y="110" text-anchor="middle" fill="white" font-size="10">HP: A</text>
  <!-- Sword -->
  <line x1="110" y1="100" x2="180" y2="100" stroke="#333" stroke-width="3" marker-end="url(#arrow)"/>
  <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#333"/></marker></defs>
  <text x="145" y="90" text-anchor="middle" fill="#333" font-size="10">공격 B</text>
  <!-- Dragon -->
  <ellipse cx="300" cy="100" rx="50" ry="35" fill="#f44336" stroke="#333" stroke-width="2"/>
  <text x="300" y="95" text-anchor="middle" fill="white" font-size="11" font-weight="bold">드래곤</text>
  <text x="300" y="110" text-anchor="middle" fill="white" font-size="10">HP: C</text>
  <!-- Dragon attack back -->
  <line x1="250" y1="115" x2="180" y2="125" stroke="#f44336" stroke-width="2" stroke-dasharray="4"/>
  <text x="210" y="145" text-anchor="middle" fill="#f44336" font-size="10">반격 D</text>
  <!-- Potion -->
  <rect x="30" y="150" width="20" height="30" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/>
  <text x="40" y="165" text-anchor="middle" fill="white" font-size="9">물약</text>
  <text x="40" y="177" text-anchor="middle" fill="white" font-size="8">×E</text>
</svg>

## 입력

첫째 줄에 여섯 정수 A B C D E H가 공백으로 구분되어 주어진다.

## 출력

최소 물약 사용 횟수를 출력한다. 이길 수 없으면 -1을 출력한다.

## 제한

- 1 ≤ A, C ≤ 10000
- 1 ≤ B, D ≤ 1000
- 0 ≤ E ≤ 100
- 1 ≤ H ≤ 10000

## 예제 입력 1

\`\`\`
100 20 80 25 3 50
\`\`\`

## 예제 출력 1

\`\`\`
0
\`\`\`

## 예제 입력 2

\`\`\`
200 15 90 40 2 100
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\`

**설명**: 예제 1에서 용사는 4번 공격해 드래곤을 처치한다. 그 사이 드래곤의 반격을 3번 받아도 체력이 남으므로 물약이 필요 없다. 예제 2에서 용사는 6번 공격해야 드래곤을 처치하는데, 5번째 반격 후 체력이 0 이하가 되어 물약 1개를 사용한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "100 20 80 25 3 50", expectedOutput: "0", isVisible: true },
      { input: "200 15 90 40 2 100", expectedOutput: "1", isVisible: true },
      { input: "50 10 100 30 3 60", expectedOutput: "-1", isVisible: false },
      { input: "30 10 50 10 5 20", expectedOutput: "0", isVisible: false },
    ],
    tags: ["시뮬레이션", "그리디"],
  },

  // 2. 지하 감옥 탈출
  {
    title: "지하 감옥 탈출",
    description: `탐험가 린은 N층짜리 지하 감옥에 갇혔다. 1층부터 N층까지 차례로 돌파해야 탈출할 수 있다. 각 층에는 몬스터가 있으며, 린의 공격력이 해당 층 몬스터의 체력 이상이면 처치할 수 있다. 몬스터를 처치하면 그 층의 보상으로 공격력이 증가한다.

린이 처음 지하 감옥에 진입할 때의 초기 공격력을 최소화하여 N층을 전부 돌파할 수 있는 최솟값을 구하여라.

<svg width="400" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="220" fill="#e3f2fd" rx="10"/>
  <text x="200" y="25" text-anchor="middle" fill="#333" font-size="14" font-weight="bold">지하 감옥</text>
  <!-- Floors -->
  <rect x="60" y="40" width="280" height="40" fill="#2196f3" rx="5" stroke="#333" stroke-width="1"/>
  <text x="200" y="55" text-anchor="middle" fill="white" font-size="11">1층: 몬스터 HP=10, 공격력 보상 +5</text>
  <text x="200" y="72" text-anchor="middle" fill="white" font-size="10">→ 클리어 후 공격력 증가</text>
  <rect x="60" y="90" width="280" height="40" fill="#ff9800" rx="5" stroke="#333" stroke-width="1"/>
  <text x="200" y="105" text-anchor="middle" fill="white" font-size="11">2층: 몬스터 HP=20, 공격력 보상 +8</text>
  <text x="200" y="122" text-anchor="middle" fill="white" font-size="10">→ 공격력이 20 이상이어야 진입 가능</text>
  <rect x="60" y="140" width="280" height="40" fill="#f44336" rx="5" stroke="#333" stroke-width="1"/>
  <text x="200" y="155" text-anchor="middle" fill="white" font-size="11">3층: 몬스터 HP=15, 공격력 보상 +3</text>
  <text x="200" y="172" text-anchor="middle" fill="white" font-size="10">→ 이분 탐색으로 최소 초기 공격력 탐색</text>
  <!-- Arrow -->
  <text x="30" y="185" fill="#333" font-size="20">↓</text>
  <text x="25" y="205" fill="#333" font-size="10">탈출</text>
</svg>

## 입력

첫째 줄에 층 수 N이 주어진다. 다음 N줄에 걸쳐 각 층의 몬스터 체력 H[i]와 클리어 시 공격력 보상 R[i]가 공백으로 구분되어 주어진다.

## 출력

N층을 전부 돌파하기 위한 최소 초기 공격력을 출력한다.

## 제한

- 1 ≤ N ≤ 100000
- 1 ≤ H[i] ≤ 1000000000
- 0 ≤ R[i] ≤ 1000000000

## 예제 입력 1

\`\`\`
4
10 5
20 8
15 3
30 0
\`\`\`

## 예제 출력 1

\`\`\`
15
\`\`\`

## 예제 입력 2

\`\`\`
1
100 0
\`\`\`

## 예제 출력 2

\`\`\`
100
\`\`\`

**설명**: 예제 1에서 초기 공격력 15로 시작하면 1층(HP=10) 처치 후 공격력 20, 2층(HP=20) 처치 후 28, 3층(HP=15) 처치 후 31, 4층(HP=30) 처치 후 탈출. 초기 공격력이 14이면 2층을 돌파할 수 없다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "4\n10 5\n20 8\n15 3\n30 0", expectedOutput: "15", isVisible: true },
      { input: "1\n100 0", expectedOutput: "100", isVisible: true },
      { input: "5\n5 2\n3 3\n8 1\n2 4\n10 0", expectedOutput: "5", isVisible: false },
      { input: "4\n1 1\n1 1\n1 1\n50 0", expectedOutput: "47", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  // 3. 해양 탐사
  {
    title: "해양 탐사",
    description: `해양 탐험가 카렌은 N개의 섬으로 이루어진 군도를 탐험하고 있다. 섬들 사이에는 M개의 해로가 있으며, 각 해로는 두 섬을 연결하고 거리가 주어진다.

본섬(0번 섬)에서 출발하여 가장 멀리 있는 섬까지의 최단 거리를 구하여라.

<svg width="400" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="220" fill="#e3f2fd" rx="10"/>
  <!-- Sea background -->
  <ellipse cx="200" cy="110" rx="180" ry="90" fill="#2196f3" opacity="0.15"/>
  <!-- Islands -->
  <circle cx="80" cy="110" r="22" fill="#4caf50" stroke="#333" stroke-width="2"/>
  <text x="80" y="107" text-anchor="middle" fill="white" font-size="10" font-weight="bold">본섬</text>
  <text x="80" y="120" text-anchor="middle" fill="white" font-size="9">0번</text>
  <circle cx="200" cy="60" r="18" fill="#ff9800" stroke="#333" stroke-width="2"/>
  <text x="200" y="57" text-anchor="middle" fill="white" font-size="10">1번</text>
  <text x="200" y="70" text-anchor="middle" fill="white" font-size="9">섬</text>
  <circle cx="320" cy="100" r="18" fill="#ff9800" stroke="#333" stroke-width="2"/>
  <text x="320" y="97" text-anchor="middle" fill="white" font-size="10">2번</text>
  <text x="320" y="110" text-anchor="middle" fill="white" font-size="9">섬</text>
  <circle cx="240" cy="170" r="18" fill="#f44336" stroke="#333" stroke-width="2"/>
  <text x="240" y="167" text-anchor="middle" fill="white" font-size="10">3번</text>
  <text x="240" y="180" text-anchor="middle" fill="white" font-size="9">섬</text>
  <!-- Routes -->
  <line x1="102" y1="100" x2="182" y2="70" stroke="#333" stroke-width="2"/>
  <text x="135" y="78" text-anchor="middle" fill="#333" font-size="10">2</text>
  <line x1="218" y1="70" x2="302" y2="95" stroke="#333" stroke-width="2"/>
  <text x="265" y="74" text-anchor="middle" fill="#333" font-size="10">3</text>
  <line x1="302" y1="115" x2="258" y2="160" stroke="#333" stroke-width="2"/>
  <text x="288" y="147" text-anchor="middle" fill="#333" font-size="10">1</text>
  <line x1="100" y1="118" x2="222" y2="162" stroke="#333" stroke-width="2" stroke-dasharray="4"/>
  <text x="155" y="150" text-anchor="middle" fill="#333" font-size="10">10</text>
</svg>

## 입력

첫째 줄에 섬의 수 N과 해로의 수 M이 주어진다. 다음 M줄에 걸쳐 해로의 양 끝 섬 번호 U, V와 거리 W가 주어진다.

## 출력

본섬(0번)에서 가장 멀리 있는 섬까지의 최단 거리를 출력한다.

## 제한

- 2 ≤ N ≤ 100000
- 1 ≤ M ≤ 200000
- 0 ≤ U, V < N, U ≠ V
- 1 ≤ W ≤ 100000
- 모든 섬은 본섬에서 도달 가능하다

## 예제 입력 1

\`\`\`
4 4
0 1 2
1 2 3
2 3 1
0 3 10
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\`

## 예제 입력 2

\`\`\`
3 2
0 1 5
1 2 3
\`\`\`

## 예제 출력 2

\`\`\`
8
\`\`\`

**설명**: 예제 1에서 0→1→2→3 경로의 거리는 2+3+1=6이고, 0→3 직접 거리는 10이므로 가장 먼 섬(3번)까지의 최단 거리는 6이다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "4 4\n0 1 2\n1 2 3\n2 3 1\n0 3 10", expectedOutput: "6", isVisible: true },
      { input: "3 2\n0 1 5\n1 2 3", expectedOutput: "8", isVisible: true },
      { input: "5 4\n0 1 3\n0 2 1\n0 3 7\n0 4 4", expectedOutput: "7", isVisible: false },
      { input: "6 5\n0 1 1\n1 2 2\n2 3 3\n3 4 4\n4 5 5", expectedOutput: "15", isVisible: false },
    ],
    tags: ["다익스트라"],
  },

  // 4. 마법 주문
  {
    title: "마법 주문",
    description: `마법사 제이는 주문서에서 마법 주문을 변환하는 법을 배웠다. 문자열 S를 문자열 T로 변환하려고 한다. 단, 한 번의 조작으로 인접한 두 문자를 교환할 수 있다. S와 T는 같은 문자 집합으로 이루어진 애너그램이다.

S를 T로 변환하는 데 필요한 최소 교환 횟수를 구하여라.

<svg width="400" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="180" fill="#e3f2fd" rx="10"/>
  <text x="200" y="25" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">인접 문자 교환으로 문자열 변환</text>
  <!-- Source string "dcba" -->
  <rect x="30" y="50" width="35" height="35" fill="#f44336" rx="5"/><text x="47" y="73" text-anchor="middle" fill="white" font-size="16" font-weight="bold">d</text>
  <rect x="75" y="50" width="35" height="35" fill="#f44336" rx="5"/><text x="92" y="73" text-anchor="middle" fill="white" font-size="16" font-weight="bold">c</text>
  <rect x="120" y="50" width="35" height="35" fill="#f44336" rx="5"/><text x="137" y="73" text-anchor="middle" fill="white" font-size="16" font-weight="bold">b</text>
  <rect x="165" y="50" width="35" height="35" fill="#f44336" rx="5"/><text x="182" y="73" text-anchor="middle" fill="white" font-size="16" font-weight="bold">a</text>
  <text x="107" y="45" text-anchor="middle" fill="#333" font-size="11">S</text>
  <!-- Arrow -->
  <text x="230" y="73" text-anchor="middle" fill="#333" font-size="22">→</text>
  <text x="230" y="90" text-anchor="middle" fill="#333" font-size="10">6회</text>
  <!-- Target string "abcd" -->
  <rect x="255" y="50" width="35" height="35" fill="#4caf50" rx="5"/><text x="272" y="73" text-anchor="middle" fill="white" font-size="16" font-weight="bold">a</text>
  <rect x="300" y="50" width="35" height="35" fill="#4caf50" rx="5"/><text x="317" y="73" text-anchor="middle" fill="white" font-size="16" font-weight="bold">b</text>
  <rect x="345" y="50" width="35" height="35" fill="#4caf50" rx="5"/><text x="362" y="73" text-anchor="middle" fill="white" font-size="16" font-weight="bold">c</text>
  <rect x="390" y="50" width="35" height="35" fill="#4caf50" rx="5"/><text x="407" y="73" text-anchor="middle" fill="white" font-size="16" font-weight="bold">d</text>
  <text x="362" y="45" text-anchor="middle" fill="#333" font-size="11">T</text>
  <!-- Swap arrows -->
  <path d="M 47,90 Q 92,115 137,90" stroke="#2196f3" stroke-width="2" fill="none" marker-end="url(#arr2)"/>
  <defs><marker id="arr2" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#2196f3"/></marker></defs>
  <text x="92" y="130" text-anchor="middle" fill="#2196f3" font-size="10">인접 교환 반복</text>
  <text x="200" y="160" text-anchor="middle" fill="#333" font-size="11">역전쌍의 수 = 최소 교환 횟수</text>
</svg>

## 입력

첫째 줄에 문자열 S, 둘째 줄에 문자열 T가 주어진다. S와 T는 같은 문자 집합으로 이루어진 애너그램이다.

## 출력

S를 T로 변환하는 최소 교환 횟수를 출력한다.

## 제한

- 1 ≤ |S| = |T| ≤ 5000
- S, T는 소문자 알파벳으로만 이루어져 있다

## 예제 입력 1

\`\`\`
dcba
abcd
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\`

## 예제 입력 2

\`\`\`
ba
ab
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\`

**설명**: "dcba"를 "abcd"로 바꾸려면 6번의 인접 교환이 필요하다. 이는 T에서 각 문자의 위치를 기준으로 S를 정렬할 때 발생하는 역전쌍(inversion)의 수와 같다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "dcba\nabcd", expectedOutput: "6", isVisible: true },
      { input: "ba\nab", expectedOutput: "1", isVisible: true },
      { input: "abcd\nabcd", expectedOutput: "0", isVisible: false },
      { input: "abcde\nedcba", expectedOutput: "10", isVisible: false },
    ],
    tags: ["정렬"],
  },

  // 5. 놀이동산 롤러코스터
  {
    title: "놀이동산 롤러코스터",
    description: `놀이동산의 롤러코스터는 키 H cm 이상인 사람만 탑승할 수 있다. N명이 그룹을 이루어 줄을 서 있으며, 같은 그룹은 반드시 함께 탑승해야 한다. 롤러코스터는 한 번에 최대 M명이 탑승할 수 있다.

그룹 중 한 명이라도 키가 H cm 미만이면 해당 그룹은 탑승할 수 없다. 탑승 가능한 그룹들을 순서대로 최대한 태워 운행 횟수를 최소화하여라.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <!-- Roller coaster car -->
  <rect x="260" y="60" width="120" height="50" fill="#f44336" rx="8" stroke="#333" stroke-width="2"/>
  <text x="320" y="80" text-anchor="middle" fill="white" font-size="11" font-weight="bold">롤러코스터</text>
  <text x="320" y="97" text-anchor="middle" fill="white" font-size="10">최대 M명</text>
  <circle cx="275" cy="112" r="8" fill="#333"/><circle cx="365" cy="112" r="8" fill="#333"/>
  <!-- Queue of people -->
  <text x="30" y="30" fill="#333" font-size="11" font-weight="bold">대기줄</text>
  <!-- Group 1: valid -->
  <rect x="20" y="40" width="60" height="50" fill="#4caf50" rx="5" stroke="#333" stroke-width="1"/>
  <text x="50" y="58" text-anchor="middle" fill="white" font-size="9">그룹1</text>
  <text x="50" y="73" text-anchor="middle" fill="white" font-size="9">160cm</text>
  <text x="50" y="86" text-anchor="middle" fill="white" font-size="9">탑승가능</text>
  <!-- Group 2: invalid -->
  <rect x="90" y="40" width="60" height="50" fill="#f44336" rx="5" stroke="#333" stroke-width="1"/>
  <text x="120" y="58" text-anchor="middle" fill="white" font-size="9">그룹2</text>
  <text x="120" y="73" text-anchor="middle" fill="white" font-size="9">140cm</text>
  <text x="120" y="86" text-anchor="middle" fill="white" font-size="9">탑승불가</text>
  <!-- Group 3: valid -->
  <rect x="160" y="40" width="60" height="50" fill="#4caf50" rx="5" stroke="#333" stroke-width="1"/>
  <text x="190" y="58" text-anchor="middle" fill="white" font-size="9">그룹3</text>
  <text x="190" y="73" text-anchor="middle" fill="white" font-size="9">165cm</text>
  <text x="190" y="86" text-anchor="middle" fill="white" font-size="9">탑승가능</text>
  <!-- Height limit sign -->
  <rect x="230" y="130" width="80" height="50" fill="#ff9800" rx="5" stroke="#333" stroke-width="1"/>
  <text x="270" y="150" text-anchor="middle" fill="white" font-size="10" font-weight="bold">키 제한</text>
  <text x="270" y="167" text-anchor="middle" fill="white" font-size="12" font-weight="bold">H cm</text>
</svg>

## 입력

첫째 줄에 키 제한 H, 최대 탑승 인원 M, 사람 수 N이 주어진다. 다음 N줄에 걸쳐 각 사람의 키와 그룹 번호가 주어진다. 줄 서 있는 순서대로 주어진다.

## 출력

최소 운행 횟수를 출력한다. 탑승 가능한 그룹이 없으면 0을 출력한다.

## 제한

- 1 ≤ H ≤ 300
- 1 ≤ M ≤ 100
- 1 ≤ N ≤ 1000
- 1 ≤ 그룹 번호 ≤ 100
- 같은 그룹의 사람들은 연속해서 줄을 선다

## 예제 입력 1

\`\`\`
150 4 10
160 1
170 1
155 1
140 2
180 2
165 3
162 3
158 4
155 4
160 4
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
160 6 10
160 1
170 1
155 1
140 2
180 2
165 3
162 3
158 4
155 4
160 4
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\`

**설명**: 예제 1에서 그룹2(140cm 포함)와 그룹4(158cm 포함)는 탑승 불가. 그룹1(3명)과 그룹3(2명)이 탑승 가능하다. M=4이므로 그룹1은 단독 1회, 그룹3은 1회로 총 2회. 그룹4도 탑승 가능하므로 3회.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      {
        input: "150 4 10\n160 1\n170 1\n155 1\n140 2\n180 2\n165 3\n162 3\n158 4\n155 4\n160 4",
        expectedOutput: "3",
        isVisible: true,
      },
      {
        input: "160 6 10\n160 1\n170 1\n155 1\n140 2\n180 2\n165 3\n162 3\n158 4\n155 4\n160 4",
        expectedOutput: "1",
        isVisible: true,
      },
      {
        input: "200 10 5\n180 1\n175 1\n160 2\n155 2\n190 3",
        expectedOutput: "0",
        isVisible: false,
      },
      {
        input: "150 2 6\n160 1\n155 2\n165 3\n162 4\n158 5\n170 6",
        expectedOutput: "3",
        isVisible: false,
      },
    ],
    tags: ["시뮬레이션", "그리디"],
  },

  // 6. 보드게임 주사위
  {
    title: "보드게임 주사위",
    description: `어린이 보드게임에서 플레이어는 1번 칸에서 시작하여 N×N번 칸(마지막 칸)까지 이동해야 한다. 주사위를 굴려 나온 수(1~6)만큼 칸을 이동한다. 일부 칸에는 특수 효과가 있어 다른 칸으로 이동된다(사다리: 앞으로, 뱀: 뒤로).

주사위를 최소 몇 번 굴려야 마지막 칸에 도달할 수 있는지 구하여라.

<svg width="400" height="210" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="210" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">보드게임 (5×5)</text>
  <!-- Board grid 5x5 -->
  <g transform="translate(30,35)">
    <!-- Rows from bottom to top visually -->
    <rect x="0" y="0" width="30" height="30" fill="#4caf50" stroke="#333" stroke-width="1"/><text x="15" y="20" text-anchor="middle" fill="white" font-size="9">1</text>
    <rect x="30" y="0" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="45" y="20" text-anchor="middle" fill="#333" font-size="9">2</text>
    <rect x="60" y="0" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="75" y="20" text-anchor="middle" fill="#333" font-size="9">3</text>
    <rect x="90" y="0" width="30" height="30" fill="#2196f3" stroke="#333" stroke-width="1"/><text x="105" y="20" text-anchor="middle" fill="white" font-size="9">4→14</text>
    <rect x="120" y="0" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="135" y="20" text-anchor="middle" fill="#333" font-size="9">5</text>
    <rect x="0" y="30" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="15" y="50" text-anchor="middle" fill="#333" font-size="9">6</text>
    <rect x="30" y="30" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="45" y="50" text-anchor="middle" fill="#333" font-size="9">7</text>
    <rect x="60" y="30" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="75" y="50" text-anchor="middle" fill="#333" font-size="9">8</text>
    <rect x="90" y="30" width="30" height="30" fill="#2196f3" stroke="#333" stroke-width="1"/><text x="105" y="50" text-anchor="middle" fill="white" font-size="9">9→20</text>
    <rect x="120" y="30" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="135" y="50" text-anchor="middle" fill="#333" font-size="9">10</text>
    <rect x="0" y="60" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="15" y="80" text-anchor="middle" fill="#333" font-size="9">11</text>
    <rect x="30" y="60" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="45" y="80" text-anchor="middle" fill="#333" font-size="9">12</text>
    <rect x="60" y="60" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="75" y="80" text-anchor="middle" fill="#333" font-size="9">13</text>
    <rect x="90" y="60" width="30" height="30" fill="#2196f3" stroke="#333" stroke-width="1"/><text x="105" y="80" text-anchor="middle" fill="white" font-size="9">14</text>
    <rect x="120" y="60" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="135" y="80" text-anchor="middle" fill="#333" font-size="9">15</text>
    <rect x="0" y="90" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="15" y="110" text-anchor="middle" fill="#333" font-size="9">16</text>
    <rect x="30" y="90" width="30" height="30" fill="#f44336" stroke="#333" stroke-width="1"/><text x="45" y="110" text-anchor="middle" fill="white" font-size="9">17→7</text>
    <rect x="60" y="90" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="75" y="110" text-anchor="middle" fill="#333" font-size="9">18</text>
    <rect x="90" y="90" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="105" y="110" text-anchor="middle" fill="#333" font-size="9">19</text>
    <rect x="120" y="90" width="30" height="30" fill="#2196f3" stroke="#333" stroke-width="1"/><text x="135" y="110" text-anchor="middle" fill="white" font-size="9">20</text>
    <rect x="0" y="120" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="15" y="140" text-anchor="middle" fill="#333" font-size="9">21</text>
    <rect x="30" y="120" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="45" y="140" text-anchor="middle" fill="#333" font-size="9">22</text>
    <rect x="60" y="120" width="30" height="30" fill="#f44336" stroke="#333" stroke-width="1"/><text x="75" y="140" text-anchor="middle" fill="white" font-size="9">23→11</text>
    <rect x="90" y="120" width="30" height="30" fill="white" stroke="#333" stroke-width="1"/><text x="105" y="140" text-anchor="middle" fill="#333" font-size="9">24</text>
    <rect x="120" y="120" width="30" height="30" fill="#f44336" stroke="#333" stroke-width="1"/><text x="135" y="140" text-anchor="middle" fill="white" font-size="8" font-weight="bold">25 목표</text>
  </g>
  <text x="200" y="200" text-anchor="middle" fill="#2196f3" font-size="10">파란칸=사다리(앞으로) 빨간칸=뱀(뒤로)</text>
</svg>

## 입력

첫째 줄에 보드 크기 N이 주어진다. 다음 줄에 특수 칸의 수 K가 주어진다. 다음 K줄에 걸쳐 특수 칸의 번호 A와 이동 목적지 B가 주어진다.

## 출력

최소 주사위 횟수를 출력한다.

## 제한

- 2 ≤ N ≤ 100
- 0 ≤ K ≤ 100
- 특수 칸은 1번과 N²번이 아니다

## 예제 입력 1

\`\`\`
5
4
4 14
9 20
17 7
23 11
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
3
0
\`\`\`

## 예제 출력 2

\`\`\`
2
\`\`\`

**설명**: 예제 1에서 1→4(사다리)→14→20(사다리)→25 경로로 3번 만에 도달 가능하다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "5\n4\n4 14\n9 20\n17 7\n23 11", expectedOutput: "3", isVisible: true },
      { input: "3\n0", expectedOutput: "2", isVisible: true },
      { input: "4\n1\n2 15", expectedOutput: "2", isVisible: false },
      { input: "6\n4\n3 22\n5 8\n27 1\n20 14", expectedOutput: "4", isVisible: false },
    ],
    tags: ["BFS"],
  },

  // 7. 건물 철거
  {
    title: "건물 철거",
    description: `도시 재개발 계획에 따라 일렬로 서 있는 N개의 건물을 모두 철거해야 한다. 철거 장비는 한 번에 연속한 K개의 건물 중 가장 높은 건물을 1층 낮출 수 있다. 모든 건물의 높이를 0으로 만드는 데 필요한 최소 작업 횟수를 구하여라.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">건물 철거 (K=2)</text>
  <!-- Ground line -->
  <line x1="20" y1="170" x2="380" y2="170" stroke="#333" stroke-width="2"/>
  <!-- Buildings -->
  <rect x="40" y="110" width="40" height="60" fill="#2196f3" stroke="#333" stroke-width="1"/>
  <text x="60" y="105" text-anchor="middle" fill="#333" font-size="11">3</text>
  <rect x="100" y="130" width="40" height="40" fill="#2196f3" stroke="#333" stroke-width="1"/>
  <text x="120" y="125" text-anchor="middle" fill="#333" font-size="11">2</text>
  <rect x="160" y="90" width="40" height="80" fill="#f44336" stroke="#333" stroke-width="2"/>
  <text x="180" y="85" text-anchor="middle" fill="#f44336" font-size="11" font-weight="bold">4</text>
  <rect x="220" y="150" width="40" height="20" fill="#2196f3" stroke="#333" stroke-width="1"/>
  <text x="240" y="145" text-anchor="middle" fill="#333" font-size="11">1</text>
  <rect x="280" y="120" width="40" height="50" fill="#2196f3" stroke="#333" stroke-width="1"/>
  <text x="300" y="115" text-anchor="middle" fill="#333" font-size="11">3</text>
  <!-- Crane -->
  <line x1="150" y1="30" x2="150" y2="80" stroke="#ff9800" stroke-width="3"/>
  <line x1="130" y1="30" x2="200" y2="30" stroke="#ff9800" stroke-width="3"/>
  <line x1="200" y1="30" x2="200" y2="50" stroke="#ff9800" stroke-width="2" stroke-dasharray="4"/>
  <text x="170" y="55" text-anchor="middle" fill="#ff9800" font-size="9">최고 건물</text>
  <text x="170" y="67" text-anchor="middle" fill="#ff9800" font-size="9">1층 낮춤</text>
  <!-- Brace showing K=2 -->
  <line x1="160" y1="183" x2="260" y2="183" stroke="#f44336" stroke-width="2"/>
  <text x="210" y="197" text-anchor="middle" fill="#f44336" font-size="10">K=2 범위 선택</text>
</svg>

## 입력

첫째 줄에 건물 수 N과 K가 주어진다. 둘째 줄에 각 건물의 높이 H[i]가 공백으로 구분되어 주어진다.

## 출력

모든 건물을 철거하는 최소 작업 횟수를 출력한다.

## 제한

- 1 ≤ K ≤ N ≤ 100000
- 0 ≤ H[i] ≤ 100000

## 예제 입력 1

\`\`\`
3 2
3 1 2
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\`

## 예제 입력 2

\`\`\`
4 2
5 3 4 2
\`\`\`

## 예제 출력 2

\`\`\`
14
\`\`\`

**설명**: K개의 연속 구간을 선택하면 그 안에서 가장 높은 건물을 1씩 낮출 수 있다. 매 작업마다 건물 높이의 합이 1씩 줄어들므로 최소 작업 횟수는 전체 건물 높이의 합과 같다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "3 2\n3 1 2", expectedOutput: "6", isVisible: true },
      { input: "4 2\n5 3 4 2", expectedOutput: "14", isVisible: true },
      { input: "4 3\n1 1 1 1", expectedOutput: "4", isVisible: false },
      { input: "5 3\n1 0 0 0 1", expectedOutput: "2", isVisible: false },
    ],
    tags: ["그리디"],
  },

  // 8. 마법의 엘리베이터
  {
    title: "마법의 엘리베이터",
    description: `마법사의 탑에는 특별한 엘리베이터가 있다. 현재 N층에 있는 엘리베이터를 0층으로 내려야 한다. 이 엘리베이터는 한 번의 조작으로 현재 층수에서 10의 거듭제곱(1, 10, 100, ...) 단위를 더하거나 빼는 것만 가능하다.

0층에 도달하기 위한 최소 조작 횟수를 구하여라.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <!-- Elevator shaft -->
  <rect x="160" y="20" width="80" height="160" fill="white" stroke="#333" stroke-width="2" rx="5"/>
  <text x="200" y="38" text-anchor="middle" fill="#333" font-size="10">마법의 탑</text>
  <!-- Floor indicators -->
  <text x="155" y="60" text-anchor="end" fill="#333" font-size="10">100층</text>
  <line x1="160" y1="57" x2="240" y2="57" stroke="#ccc" stroke-width="1" stroke-dasharray="2"/>
  <text x="155" y="100" text-anchor="end" fill="#2196f3" font-size="12" font-weight="bold">19층</text>
  <rect x="163" y="88" width="74" height="28" fill="#2196f3" rx="4" stroke="#333" stroke-width="1"/>
  <text x="200" y="107" text-anchor="middle" fill="white" font-size="11" font-weight="bold">현재 위치</text>
  <text x="155" y="170" text-anchor="end" fill="#333" font-size="10">0층 (목표)</text>
  <line x1="160" y1="167" x2="240" y2="167" stroke="#4caf50" stroke-width="2"/>
  <!-- Arrows showing operations -->
  <text x="260" y="55" fill="#333" font-size="10">-10 → 9층</text>
  <text x="260" y="80" fill="#333" font-size="10">-1 → 8층</text>
  <text x="260" y="105" fill="#333" font-size="10">→ 총 3번</text>
  <path d="M245,96 L260,85" stroke="#ff9800" stroke-width="1.5" fill="none"/>
  <!-- Example: 19 -> 20 -> 0 -->
  <text x="30" y="60" fill="#333" font-size="10">19층 예시:</text>
  <text x="30" y="80" fill="#333" font-size="10">19 +1→20</text>
  <text x="30" y="100" fill="#2196f3" font-size="10" font-weight="bold">→ 20 -10→10</text>
  <text x="30" y="120" fill="#333" font-size="10">→ 10 -10→0</text>
  <text x="30" y="140" fill="#4caf50" font-size="10" font-weight="bold">= 3번</text>
</svg>

## 입력

첫째 줄에 현재 층수 N이 주어진다.

## 출력

0층에 도달하기 위한 최소 조작 횟수를 출력한다.

## 제한

- 1 ≤ N ≤ 1000000000

## 예제 입력 1

\`\`\`
19
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
100
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\`

**설명**: 19층에서 +1로 20층, -10으로 10층, -10으로 0층 → 3번. 각 자릿수에 대해 그 값이 5 이하면 빼는 방향으로, 6 이상이면 올림 후 빼는 방향으로 처리하는 그리디 전략이 최적이다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "19", expectedOutput: "3", isVisible: true },
      { input: "100", expectedOutput: "1", isVisible: true },
      { input: "14", expectedOutput: "5", isVisible: false },
      { input: "999", expectedOutput: "2", isVisible: false },
    ],
    tags: ["그리디"],
  },

  // 9. 택시 기사
  {
    title: "택시 기사",
    description: `택시 기사 민준은 좌표 평면 위에서 N명의 손님을 모두 태워 목적지까지 데려다 주어야 한다. 각 손님은 출발지와 목적지 좌표가 있으며, 반드시 출발지에서 태운 후 목적지에서 내려줘야 한다. 택시는 처음 원점(0, 0)에서 출발하며, 이동 거리는 맨해튼 거리를 사용한다.

모든 손님을 태우고 내려주는 최소 총 이동 거리를 구하여라.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <!-- Grid -->
  <defs>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ddd" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect x="20" y="20" width="360" height="170" fill="url(#grid)"/>
  <!-- Axes -->
  <line x1="80" y1="170" x2="380" y2="170" stroke="#333" stroke-width="2" marker-end="url(#ax)"/>
  <line x1="80" y1="170" x2="80" y2="20" stroke="#333" stroke-width="2" marker-end="url(#ax)"/>
  <defs><marker id="ax" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#333"/></marker></defs>
  <text x="75" y="185" text-anchor="middle" fill="#333" font-size="10">0</text>
  <!-- Origin taxi -->
  <circle cx="80" cy="170" r="7" fill="#ff9800" stroke="#333" stroke-width="1.5"/>
  <text x="65" y="165" fill="#ff9800" font-size="9">택시</text>
  <!-- Passenger 1: start (1,3) end (4,5) -->
  <circle cx="110" cy="80" r="6" fill="#2196f3" stroke="#333" stroke-width="1.5"/>
  <text x="112" y="75" fill="#2196f3" font-size="9">A출발</text>
  <circle cx="200" cy="20" r="6" fill="#2196f3" stroke="#333" stroke-width="1.5" stroke-dasharray="3"/>
  <text x="202" y="18" fill="#2196f3" font-size="9">A도착</text>
  <!-- Passenger 2 -->
  <circle cx="140" cy="140" r="6" fill="#f44336" stroke="#333" stroke-width="1.5"/>
  <text x="142" y="138" fill="#f44336" font-size="9">B출발</text>
  <circle cx="260" cy="110" r="6" fill="#f44336" stroke="#333" stroke-width="1.5" stroke-dasharray="3"/>
  <text x="262" y="108" fill="#f44336" font-size="9">B도착</text>
  <!-- Route arrows -->
  <path d="M87,163 L104,88" stroke="#ff9800" stroke-width="1.5" stroke-dasharray="4" fill="none"/>
  <text x="200" y="180" text-anchor="middle" fill="#333" font-size="10">맨해튼 거리 = |x1-x2| + |y1-y2|</text>
</svg>

## 입력

첫째 줄에 손님 수 N이 주어진다. 다음 N줄에 걸쳐 각 손님의 출발지 좌표(sx, sy)와 목적지 좌표(dx, dy)가 공백으로 구분되어 주어진다.

## 출력

최소 총 이동 거리를 출력한다.

## 제한

- 1 ≤ N ≤ 4
- 0 ≤ sx, sy, dx, dy ≤ 20

## 예제 입력 1

\`\`\`
1
0 0 1 1
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\`

## 예제 입력 2

\`\`\`
2
0 1 3 2
2 0 4 3
\`\`\`

## 예제 출력 2

\`\`\`
9
\`\`\`

**설명**: 예제 1에서 택시가 이미 (0,0)에 있고 손님 출발지도 (0,0)이므로 이동 없이 바로 태우고, 목적지 (1,1)까지 맨해튼 거리 2를 이동한다.`,
    difficulty: 7.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "1\n0 0 1 1", expectedOutput: "2", isVisible: true },
      { input: "2\n0 1 3 2\n2 0 4 3", expectedOutput: "9", isVisible: true },
      { input: "3\n1 0 2 2\n0 2 3 1\n1 1 4 4", expectedOutput: "12", isVisible: false },
      { input: "2\n5 5 10 10\n0 0 3 3", expectedOutput: "17", isVisible: false },
    ],
    tags: ["DP", "비트마스크"],
  },

  // 10. 폭탄 해체
  {
    title: "폭탄 해체",
    description: `폭발물 전문가 유나는 폭탄의 N개 전선을 모두 잘라야 한다. 각 전선은 빨간색 또는 파란색이며, 전선들 사이에는 "전선 A를 자르기 전에 전선 B를 반드시 먼저 잘라야 한다"는 M개의 규칙이 있다. 이 규칙을 어기면 폭탄이 폭발한다.

모든 전선을 안전하게 자를 수 있는 순서가 존재하면 YES, 그렇지 않으면 NO를 출력하여라.

<svg width="400" height="190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">폭탄 해체 - 전선 의존 관계</text>
  <!-- Bomb -->
  <circle cx="200" cy="120" r="45" fill="#333" stroke="#555" stroke-width="3"/>
  <text x="200" y="115" text-anchor="middle" fill="white" font-size="12" font-weight="bold">폭탄</text>
  <text x="200" y="132" text-anchor="middle" fill="white" font-size="10">순서 규칙</text>
  <!-- Wires -->
  <line x1="200" y1="75" x2="200" y2="40" stroke="#f44336" stroke-width="5"/>
  <circle cx="200" cy="38" r="6" fill="#f44336" stroke="#333" stroke-width="1.5"/>
  <text x="200" y="28" text-anchor="middle" fill="#f44336" font-size="10">전선1(빨)</text>
  <line x1="160" y1="90" x2="100" y2="55" stroke="#2196f3" stroke-width="5"/>
  <circle cx="97" cy="53" r="6" fill="#2196f3" stroke="#333" stroke-width="1.5"/>
  <text x="75" y="47" text-anchor="middle" fill="#2196f3" font-size="10">전선2(파)</text>
  <line x1="240" y1="90" x2="300" y2="55" stroke="#f44336" stroke-width="5"/>
  <circle cx="303" cy="53" r="6" fill="#f44336" stroke="#333" stroke-width="1.5"/>
  <text x="325" y="47" text-anchor="middle" fill="#f44336" font-size="10">전선3(빨)</text>
  <line x1="170" y1="155" x2="120" y2="175" stroke="#2196f3" stroke-width="5"/>
  <circle cx="118" cy="177" r="6" fill="#2196f3" stroke="#333" stroke-width="1.5"/>
  <text x="100" y="188" text-anchor="middle" fill="#2196f3" font-size="10">전선4(파)</text>
  <!-- Rule arrow -->
  <path d="M200,32 Q260,15 303,47" stroke="#ff9800" stroke-width="2" fill="none" marker-end="url(#ruleArr)"/>
  <defs><marker id="ruleArr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#ff9800"/></marker></defs>
  <text x="255" y="18" text-anchor="middle" fill="#ff9800" font-size="9">1 먼저</text>
</svg>

## 입력

첫째 줄에 전선 수 N과 규칙 수 M이 주어진다. 다음 M줄에 걸쳐 "A B" 형태로 규칙이 주어진다. 전선 A를 자르기 전에 반드시 전선 B를 먼저 잘라야 한다는 의미이다.

## 출력

안전하게 자를 수 있는 순서가 존재하면 YES, 아니면 NO를 출력한다.

## 제한

- 1 ≤ N ≤ 1000
- 0 ≤ M ≤ 10000

## 예제 입력 1

\`\`\`
4 3
1 2
2 3
3 4
\`\`\`

## 예제 출력 1

\`\`\`
YES
\`\`\`

## 예제 입력 2

\`\`\`
3 3
1 2
2 3
3 1
\`\`\`

## 예제 출력 2

\`\`\`
NO
\`\`\`

**설명**: 예제 1은 4→3→2→1 순서로 자르면 된다. 예제 2는 규칙이 순환을 이루므로 어떤 순서로도 모든 규칙을 지킬 수 없다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "4 3\n1 2\n2 3\n3 4", expectedOutput: "YES", isVisible: true },
      { input: "3 3\n1 2\n2 3\n3 1", expectedOutput: "NO", isVisible: true },
      { input: "5 4\n1 3\n2 3\n3 4\n3 5", expectedOutput: "YES", isVisible: false },
      { input: "4 4\n1 2\n3 4\n4 2\n2 3", expectedOutput: "NO", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  // 11. 식목일
  {
    title: "식목일",
    description: `식목일을 맞이하여 일직선으로 이루어진 도로 위의 N개 후보 위치 중 K곳을 골라 나무를 심으려 한다. 나무들 사이의 최소 거리를 최대화하여라.

<svg width="400" height="160" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="160" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">식목일 - 최대 최소 거리</text>
  <!-- Number line -->
  <line x1="30" y1="90" x2="370" y2="90" stroke="#333" stroke-width="2"/>
  <!-- Candidate positions -->
  <circle cx="60" cy="90" r="6" fill="#ccc" stroke="#333" stroke-width="1.5"/>
  <text x="60" y="110" text-anchor="middle" fill="#333" font-size="10">1</text>
  <circle cx="90" cy="90" r="6" fill="#ccc" stroke="#333" stroke-width="1.5"/>
  <text x="90" y="110" text-anchor="middle" fill="#333" font-size="10">2</text>
  <circle cx="150" cy="90" r="6" fill="#ccc" stroke="#333" stroke-width="1.5"/>
  <text x="150" y="110" text-anchor="middle" fill="#333" font-size="10">4</text>
  <circle cx="240" cy="90" r="6" fill="#ccc" stroke="#333" stroke-width="1.5"/>
  <text x="240" y="110" text-anchor="middle" fill="#333" font-size="10">8</text>
  <circle cx="270" cy="90" r="6" fill="#ccc" stroke="#333" stroke-width="1.5"/>
  <text x="270" y="110" text-anchor="middle" fill="#333" font-size="10">9</text>
  <!-- Selected positions (K=3) -->
  <circle cx="60" cy="90" r="9" fill="#4caf50" stroke="#333" stroke-width="2"/>
  <text x="60" y="75" text-anchor="middle" fill="#4caf50" font-size="11" font-weight="bold">✓</text>
  <circle cx="150" cy="90" r="9" fill="#4caf50" stroke="#333" stroke-width="2"/>
  <text x="150" y="75" text-anchor="middle" fill="#4caf50" font-size="11" font-weight="bold">✓</text>
  <circle cx="240" cy="90" r="9" fill="#4caf50" stroke="#333" stroke-width="2"/>
  <text x="240" y="75" text-anchor="middle" fill="#4caf50" font-size="11" font-weight="bold">✓</text>
  <!-- Distance arrows -->
  <line x1="69" y1="130" x2="141" y2="130" stroke="#2196f3" stroke-width="2" marker-start="url(#la)" marker-end="url(#ra)"/>
  <defs>
    <marker id="la" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto-start-reverse"><path d="M0,0 L5,2.5 L0,5 Z" fill="#2196f3"/></marker>
    <marker id="ra" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#2196f3"/></marker>
  </defs>
  <text x="105" y="145" text-anchor="middle" fill="#2196f3" font-size="10">간격=3</text>
  <line x1="159" y1="130" x2="231" y2="130" stroke="#2196f3" stroke-width="2" marker-start="url(#la)" marker-end="url(#ra)"/>
  <text x="195" y="145" text-anchor="middle" fill="#2196f3" font-size="10">간격=4</text>
  <text x="200" y="160" text-anchor="middle" fill="#333" font-size="10">최솟값 3이 최대 → 이분 탐색</text>
</svg>

## 입력

첫째 줄에 후보 위치 수 N과 심을 나무 수 K가 주어진다. 둘째 줄에 N개의 후보 위치 좌표가 공백으로 구분되어 주어진다.

## 출력

나무들 사이의 최소 거리의 최댓값을 출력한다.

## 제한

- 2 ≤ K ≤ N ≤ 200000
- 0 ≤ 좌표 ≤ 1000000000

## 예제 입력 1

\`\`\`
5 3
1 2 4 8 9
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
6 4
1 3 6 7 10 14
\`\`\`

## 예제 출력 2

\`\`\`
4
\`\`\`

**설명**: 예제 1에서 위치 1, 4, 8에 나무를 심으면 최소 간격이 3이다. 이 값이 가능한 최대이다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "5 3\n1 2 4 8 9", expectedOutput: "3", isVisible: true },
      { input: "6 4\n1 3 6 7 10 14", expectedOutput: "4", isVisible: true },
      { input: "5 2\n1 2 3 4 5", expectedOutput: "4", isVisible: false },
      { input: "6 3\n1 10 20 30 40 50", expectedOutput: "19", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  // 12. 요리 레시피
  {
    title: "요리 레시피",
    description: `요리사 하나는 초기 재료 세트로 레시피를 조합하여 다양한 요리를 만들 수 있다. 각 레시피는 필요한 재료 목록과 만들어지는 요리 이름으로 구성된다. 이미 보유한 재료 또는 이전에 만들어진 요리를 재료로 사용할 수 있다.

초기 재료로 만들 수 있는 모든 요리의 수를 구하여라.

<svg width="400" height="190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">레시피 의존 그래프</text>
  <!-- Ingredients -->
  <rect x="20" y="50" width="45" height="30" fill="#4caf50" rx="5" stroke="#333" stroke-width="1"/>
  <text x="42" y="70" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text>
  <rect x="20" y="100" width="45" height="30" fill="#4caf50" rx="5" stroke="#333" stroke-width="1"/>
  <text x="42" y="120" text-anchor="middle" fill="white" font-size="10" font-weight="bold">B</text>
  <!-- Recipe 1: A+B -> C -->
  <rect x="140" y="65" width="60" height="35" fill="#2196f3" rx="5" stroke="#333" stroke-width="1"/>
  <text x="170" y="78" text-anchor="middle" fill="white" font-size="9">A+B</text>
  <text x="170" y="92" text-anchor="middle" fill="white" font-size="9">→ C</text>
  <line x1="65" y1="65" x2="140" y2="80" stroke="#333" stroke-width="1.5" marker-end="url(#ar3)"/>
  <line x1="65" y1="115" x2="140" y2="90" stroke="#333" stroke-width="1.5" marker-end="url(#ar3)"/>
  <defs><marker id="ar3" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#333"/></marker></defs>
  <!-- C node -->
  <rect x="240" y="65" width="45" height="30" fill="#ff9800" rx="5" stroke="#333" stroke-width="1"/>
  <text x="262" y="85" text-anchor="middle" fill="white" font-size="11" font-weight="bold">C</text>
  <line x1="200" y1="82" x2="240" y2="80" stroke="#333" stroke-width="1.5" marker-end="url(#ar3)"/>
  <!-- Recipe 2: C -> D -->
  <rect x="140" y="130" width="60" height="35" fill="#2196f3" rx="5" stroke="#333" stroke-width="1"/>
  <text x="170" y="143" text-anchor="middle" fill="white" font-size="9">C</text>
  <text x="170" y="157" text-anchor="middle" fill="white" font-size="9">→ D</text>
  <line x1="262" y1="95" x2="200" y2="132" stroke="#333" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#ar3)"/>
  <!-- D node -->
  <rect x="240" y="130" width="45" height="30" fill="#f44336" rx="5" stroke="#333" stroke-width="1"/>
  <text x="262" y="150" text-anchor="middle" fill="white" font-size="11" font-weight="bold">D</text>
  <line x1="200" y1="147" x2="240" y2="145" stroke="#333" stroke-width="1.5" marker-end="url(#ar3)"/>
  <!-- Legend -->
  <rect x="310" y="55" width="75" height="20" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/>
  <text x="347" y="69" text-anchor="middle" fill="white" font-size="9">초기 재료</text>
  <rect x="310" y="85" width="75" height="20" fill="#ff9800" rx="3" stroke="#333" stroke-width="1"/>
  <text x="347" y="99" text-anchor="middle" fill="white" font-size="9">완성 요리</text>
  <text x="200" y="185" text-anchor="middle" fill="#333" font-size="10">위상정렬로 의존 관계 처리</text>
</svg>

## 입력

첫째 줄에 초기 재료 수 N이 주어진다. 둘째 줄에 초기 재료 이름이 공백으로 구분되어 주어진다. 셋째 줄에 레시피 수 M이 주어진다. 다음 M줄에 걸쳐 각 레시피의 필요 재료 수 K, 재료 이름 K개, 결과 이름이 주어진다.

## 출력

만들 수 있는 요리(초기 재료 제외)의 수를 출력한다.

## 제한

- 1 ≤ N ≤ 100
- 1 ≤ M ≤ 100
- 재료/요리 이름은 길이 1~10의 알파벳 대문자 문자열

## 예제 입력 1

\`\`\`
2
A B
3
2 A B C
1 C D
2 B D E
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
1
A
2
2 A B C
1 A D
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\`

**설명**: 예제 1에서 A,B로 C를 만들고, C로 D를 만들고, B와 D로 E를 만든다. 총 3개. 예제 2에서 B가 없으므로 A+B→C는 불가. A→D만 가능하여 1개.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "2\nA B\n3\n2 A B C\n1 C D\n2 B D E", expectedOutput: "3", isVisible: true },
      { input: "1\nA\n2\n2 A B C\n1 A D", expectedOutput: "1", isVisible: true },
      { input: "1\nA\n3\n1 B C\n1 C D\n1 A B", expectedOutput: "3", isVisible: false },
      { input: "1\nX\n2\n2 A B C\n1 A D", expectedOutput: "0", isVisible: false },
    ],
    tags: ["위상정렬"],
  },

  // 13. 인터넷 설치
  {
    title: "인터넷 설치",
    description: `스마트 도시 프로젝트의 일환으로 N개의 건물에 인터넷을 설치해야 한다. 이미 K개의 건물에는 인터넷이 연결되어 있다. 나머지 건물들을 연결하는 케이블을 최소 비용으로 설치하려고 한다. 건물 사이에는 케이블을 놓을 수 있는 M개의 경로가 있으며, 각 경로마다 비용이 다르다.

최소 비용으로 모든 건물에 인터넷을 연결하는 비용을 구하여라.

<svg width="400" height="190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">최소 신장 트리 (MST)</text>
  <!-- Buildings -->
  <rect x="30" y="70" width="50" height="40" fill="#4caf50" rx="5" stroke="#333" stroke-width="2"/>
  <text x="55" y="88" text-anchor="middle" fill="white" font-size="10" font-weight="bold">건물1</text>
  <text x="55" y="103" text-anchor="middle" fill="white" font-size="9">인터넷有</text>
  <rect x="30" y="140" width="50" height="40" fill="#ccc" rx="5" stroke="#333" stroke-width="1"/>
  <text x="55" y="158" text-anchor="middle" fill="#333" font-size="10" font-weight="bold">건물3</text>
  <text x="55" y="173" text-anchor="middle" fill="#333" font-size="9">연결 필요</text>
  <rect x="170" y="40" width="50" height="40" fill="#ccc" rx="5" stroke="#333" stroke-width="1"/>
  <text x="195" y="58" text-anchor="middle" fill="#333" font-size="10" font-weight="bold">건물2</text>
  <text x="195" y="73" text-anchor="middle" fill="#333" font-size="9">연결 필요</text>
  <rect x="310" y="70" width="50" height="40" fill="#4caf50" rx="5" stroke="#333" stroke-width="2"/>
  <text x="335" y="88" text-anchor="middle" fill="white" font-size="10" font-weight="bold">건물5</text>
  <text x="335" y="103" text-anchor="middle" fill="white" font-size="9">인터넷有</text>
  <rect x="240" y="140" width="50" height="40" fill="#ccc" rx="5" stroke="#333" stroke-width="1"/>
  <text x="265" y="158" text-anchor="middle" fill="#333" font-size="10" font-weight="bold">건물4</text>
  <text x="265" y="173" text-anchor="middle" fill="#333" font-size="9">연결 필요</text>
  <!-- Cables -->
  <line x1="80" y1="90" x2="170" y2="65" stroke="#2196f3" stroke-width="3"/>
  <text x="122" y="67" text-anchor="middle" fill="#2196f3" font-size="10">3</text>
  <line x1="80" y1="90" x2="80" y2="140" stroke="#f44336" stroke-width="2" stroke-dasharray="4"/>
  <text x="65" y="120" text-anchor="middle" fill="#f44336" font-size="9">비선택</text>
  <line x1="220" y1="65" x2="310" y2="82" stroke="#2196f3" stroke-width="3"/>
  <text x="268" y="64" text-anchor="middle" fill="#2196f3" font-size="10">2</text>
  <line x1="310" y1="110" x2="290" y2="140" stroke="#2196f3" stroke-width="3"/>
  <text x="308" y="132" text-anchor="middle" fill="#2196f3" font-size="10">3</text>
  <text x="200" y="185" text-anchor="middle" fill="#333" font-size="10">초록=인터넷 있는 건물, 파란선=선택된 케이블</text>
</svg>

## 입력

첫째 줄에 건물 수 N, 케이블 경로 수 M, 이미 인터넷이 있는 건물 수 K가 주어진다. 둘째 줄에 인터넷이 이미 있는 K개의 건물 번호가 주어진다. 다음 M줄에 걸쳐 케이블 경로 U, V와 비용 W가 주어진다.

## 출력

모든 건물에 인터넷을 연결하는 최소 비용을 출력한다.

## 제한

- 2 ≤ N ≤ 100000
- 1 ≤ M ≤ 200000
- 1 ≤ K ≤ N
- 1 ≤ W ≤ 100000

## 예제 입력 1

\`\`\`
4 4 1
1
1 2 3
2 3 2
3 4 4
1 4 10
\`\`\`

## 예제 출력 1

\`\`\`
9
\`\`\`

## 예제 입력 2

\`\`\`
3 3 3
1 2 3
1 2 5
2 3 3
1 3 7
\`\`\`

## 예제 출력 2

\`\`\`
0
\`\`\`

**설명**: 예제 1에서 건물1에서 시작하는 MST: 1-2(3), 2-3(2), 3-4(4) = 총 9. 예제 2는 모든 건물이 이미 연결되어 있어 비용이 0이다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "4 4 1\n1\n1 2 3\n2 3 2\n3 4 4\n1 4 10", expectedOutput: "9", isVisible: true },
      { input: "3 3 3\n1 2 3\n1 2 5\n2 3 3\n1 3 7", expectedOutput: "0", isVisible: true },
      { input: "5 5 2\n1 5\n1 2 4\n2 3 3\n3 4 2\n4 5 5\n1 3 7", expectedOutput: "9", isVisible: false },
      { input: "5 4 1\n3\n1 2 1\n2 3 2\n3 4 3\n4 5 4", expectedOutput: "10", isVisible: false },
    ],
    tags: ["MST"],
  },

  // 14. 카드 뒤집기 게임
  {
    title: "카드 뒤집기 게임",
    description: `마법 카드 게임에서 N×M 격자에 카드가 놓여 있다. 각 카드는 앞면(1) 또는 뒷면(0) 상태이다. 한 번의 조작으로 임의의 한 행 전체 또는 한 열 전체를 뒤집을 수 있다(앞면↔뒷면). 조작을 적절히 반복하여 앞면(1)인 카드의 수를 최대화하여라.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">카드 뒤집기 (행/열 전체)</text>
  <text x="80" y="45" text-anchor="middle" fill="#333" font-size="11">초기 상태</text>
  <rect x="30" y="55" width="35" height="35" fill="#f44336" rx="4" stroke="#333" stroke-width="1"/>
  <text x="47" y="78" text-anchor="middle" fill="white" font-size="14" font-weight="bold">0</text>
  <rect x="75" y="55" width="35" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="92" y="78" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <rect x="120" y="55" width="35" height="35" fill="#f44336" rx="4" stroke="#333" stroke-width="1"/>
  <text x="137" y="78" text-anchor="middle" fill="white" font-size="14" font-weight="bold">0</text>
  <rect x="30" y="100" width="35" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="47" y="123" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <rect x="75" y="100" width="35" height="35" fill="#f44336" rx="4" stroke="#333" stroke-width="1"/>
  <text x="92" y="123" text-anchor="middle" fill="white" font-size="14" font-weight="bold">0</text>
  <rect x="120" y="100" width="35" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="137" y="123" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <text x="190" y="98" text-anchor="middle" fill="#ff9800" font-size="24" font-weight="bold">→</text>
  <text x="190" y="118" text-anchor="middle" fill="#ff9800" font-size="9">행0 뒤집기</text>
  <text x="190" y="130" text-anchor="middle" fill="#ff9800" font-size="9">+열1 뒤집기</text>
  <text x="310" y="45" text-anchor="middle" fill="#333" font-size="11">최적 결과</text>
  <rect x="255" y="55" width="35" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="272" y="78" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <rect x="300" y="55" width="35" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="317" y="78" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <rect x="345" y="55" width="35" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="362" y="78" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <rect x="255" y="100" width="35" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="272" y="123" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <rect x="300" y="100" width="35" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="317" y="123" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <rect x="345" y="100" width="35" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="362" y="123" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <text x="200" y="175" text-anchor="middle" fill="#333" font-size="11">행 조합 전체 탐색 (2^N) + 열 그리디 결정</text>
  <text x="200" y="192" text-anchor="middle" fill="#2196f3" font-size="10">초록=앞면(1), 빨강=뒷면(0)</text>
</svg>

## 입력

첫째 줄에 행 수 N과 열 수 M이 주어진다. 다음 N줄에 걸쳐 카드 상태가 0과 1로 이루어진 공백 없는 문자열로 주어진다.

## 출력

앞면(1) 카드의 최대 수를 출력한다.

## 제한

- 1 ≤ N ≤ 20
- 1 ≤ M ≤ 20

## 예제 입력 1

\`\`\`
2 2
00
00
\`\`\`

## 예제 출력 1

\`\`\`
4
\`\`\`

## 예제 입력 2

\`\`\`
2 3
010
101
\`\`\`

## 예제 출력 2

\`\`\`
6
\`\`\`

**설명**: 예제 1에서 두 행을 모두 뒤집으면 모두 1이 된다. 예제 2에서 행0을 뒤집어 [1,0,1]로 만든 뒤 열1을 뒤집으면 모두 1이 된다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "2 2\n00\n00", expectedOutput: "4", isVisible: true },
      { input: "2 3\n010\n101", expectedOutput: "6", isVisible: true },
      { input: "3 3\n101\n010\n101", expectedOutput: "9", isVisible: false },
      { input: "2 2\n10\n01", expectedOutput: "4", isVisible: false },
    ],
    tags: ["비트마스크", "그리디"],
  },

  // 15. 경비원 순찰
  {
    title: "경비원 순찰",
    description: `경비원 루카는 일직선으로 배치된 N개의 체크포인트를 모두 순찰해야 한다. 루카는 현재 위치 P에서 출발하여 왼쪽 또는 오른쪽으로 이동할 수 있으며, 방향을 한 번 바꿀 수 있다. 모든 체크포인트를 방문하는 최소 이동 거리를 구하여라.

<svg width="400" height="160" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="160" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">최소 이동 거리 순찰</text>
  <line x1="20" y1="80" x2="380" y2="80" stroke="#333" stroke-width="2"/>
  <circle cx="50" cy="80" r="8" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="50" y="100" text-anchor="middle" fill="#333" font-size="10">1</text>
  <circle cx="120" cy="80" r="8" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="120" y="100" text-anchor="middle" fill="#333" font-size="10">3</text>
  <circle cx="180" cy="80" r="10" fill="#ff9800" stroke="#333" stroke-width="2"/>
  <text x="180" y="75" text-anchor="middle" fill="#333" font-size="9">루카</text>
  <text x="180" y="100" text-anchor="middle" fill="#ff9800" font-size="10" font-weight="bold">4 (출발)</text>
  <circle cx="260" cy="80" r="8" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="260" y="100" text-anchor="middle" fill="#333" font-size="10">6</text>
  <circle cx="330" cy="80" r="8" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="330" y="100" text-anchor="middle" fill="#333" font-size="10">8</text>
  <path d="M180,60 Q255,40 330,60" stroke="#4caf50" stroke-width="2" fill="none" stroke-dasharray="5"/>
  <text x="255" y="38" text-anchor="middle" fill="#4caf50" font-size="9">오른쪽 먼저(+4)</text>
  <path d="M170,115 Q85,135 50,115" stroke="#f44336" stroke-width="2" fill="none" stroke-dasharray="5"/>
  <text x="100" y="148" text-anchor="middle" fill="#f44336" font-size="9">왼쪽 먼저(+3)</text>
  <text x="200" y="160" text-anchor="middle" fill="#333" font-size="10">min(2×L+R, L+2×R)으로 계산</text>
</svg>

## 입력

첫째 줄에 체크포인트 수 N과 출발 위치 P가 주어진다. 둘째 줄에 N개의 체크포인트 위치가 공백으로 구분되어 주어진다. 출발 위치 P는 체크포인트 중 하나이다.

## 출력

최소 이동 거리를 출력한다.

## 제한

- 1 ≤ N ≤ 100000
- 체크포인트 위치와 P는 1 이상 1000000 이하의 서로 다른 정수

## 예제 입력 1

\`\`\`
6 1
1 2 3 4 5 6
\`\`\`

## 예제 출력 1

\`\`\`
5
\`\`\`

## 예제 입력 2

\`\`\`
5 4
1 3 4 6 8
\`\`\`

## 예제 출력 2

\`\`\`
10
\`\`\`

**설명**: 예제 1에서 출발점이 가장 왼쪽이므로 오른쪽으로만 이동하면 거리 5. 예제 2에서 L=3, R=4이므로 min(2×3+4, 3+2×4)=min(10,11)=10.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "6 1\n1 2 3 4 5 6", expectedOutput: "5", isVisible: true },
      { input: "5 4\n1 3 4 6 8", expectedOutput: "10", isVisible: true },
      { input: "5 5\n2 4 5 7 9", expectedOutput: "10", isVisible: false },
      { input: "7 3\n1 2 3 4 5 6 7", expectedOutput: "8", isVisible: false },
    ],
    tags: ["그리디"],
  },

  // 16. 수상 택시
  {
    title: "수상 택시",
    description: `강을 사이에 두고 왼쪽 강변과 오른쪽 강변에 각각 선착장이 있다. N명의 승객이 각각 왼쪽 강변의 특정 위치에서 오른쪽 강변의 특정 위치로 이동하려 한다. 수상 택시는 수직으로만 이동할 수 있어, 왼쪽과 오른쪽 강변의 위치를 매칭해야 한다. 왼쪽 위치 a에서 오른쪽 위치 b로 가는 비용은 |a-b|이다. 모든 승객을 태우는 최소 총 비용을 구하여라.

<svg width="400" height="190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">수상 택시 최소 비용 매칭</text>
  <rect x="140" y="30" width="120" height="150" fill="#2196f3" opacity="0.2" rx="5"/>
  <text x="200" y="110" text-anchor="middle" fill="#2196f3" font-size="12" opacity="0.7">강</text>
  <text x="80" y="42" text-anchor="middle" fill="#333" font-size="11" font-weight="bold">왼쪽 강변</text>
  <rect x="30" y="55" width="100" height="20" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/>
  <text x="80" y="69" text-anchor="middle" fill="white" font-size="10">선착장 위치 1</text>
  <rect x="30" y="95" width="100" height="20" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/>
  <text x="80" y="109" text-anchor="middle" fill="white" font-size="10">선착장 위치 3</text>
  <rect x="30" y="135" width="100" height="20" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/>
  <text x="80" y="149" text-anchor="middle" fill="white" font-size="10">선착장 위치 5</text>
  <text x="320" y="42" text-anchor="middle" fill="#333" font-size="11" font-weight="bold">오른쪽 강변</text>
  <rect x="270" y="55" width="100" height="20" fill="#ff9800" rx="3" stroke="#333" stroke-width="1"/>
  <text x="320" y="69" text-anchor="middle" fill="white" font-size="10">선착장 위치 2</text>
  <rect x="270" y="95" width="100" height="20" fill="#ff9800" rx="3" stroke="#333" stroke-width="1"/>
  <text x="320" y="109" text-anchor="middle" fill="white" font-size="10">선착장 위치 4</text>
  <rect x="270" y="135" width="100" height="20" fill="#ff9800" rx="3" stroke="#333" stroke-width="1"/>
  <text x="320" y="149" text-anchor="middle" fill="white" font-size="10">선착장 위치 6</text>
  <line x1="130" y1="65" x2="270" y2="65" stroke="#333" stroke-width="2" stroke-dasharray="5"/>
  <line x1="130" y1="105" x2="270" y2="105" stroke="#333" stroke-width="2" stroke-dasharray="5"/>
  <line x1="130" y1="145" x2="270" y2="145" stroke="#333" stroke-width="2" stroke-dasharray="5"/>
  <text x="200" y="180" text-anchor="middle" fill="#333" font-size="10">정렬 후 순서대로 매칭 = 최소 비용</text>
</svg>

## 입력

첫째 줄에 승객 수 N이 주어진다. 다음 N줄에 걸쳐 각 승객의 왼쪽 강변 위치 a와 오른쪽 강변 위치 b가 주어진다.

## 출력

최소 총 비용을 출력한다.

## 제한

- 1 ≤ N ≤ 100000
- 1 ≤ a, b ≤ 1000000000

## 예제 입력 1

\`\`\`
3
1 2
3 4
5 6
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
3
1 2
2 3
3 4
\`\`\`

## 예제 출력 2

\`\`\`
3
\`\`\`

**설명**: 각 승객을 왼쪽 위치 순서대로 오른쪽 위치와 매칭하면 비용의 합이 최소가 된다. 위치를 정렬한 뒤 순서대로 매칭하는 그리디 방법이 최적이다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "3\n1 2\n3 4\n5 6", expectedOutput: "3", isVisible: true },
      { input: "3\n1 2\n2 3\n3 4", expectedOutput: "3", isVisible: true },
      { input: "3\n1 2\n5 4\n9 8", expectedOutput: "3", isVisible: false },
      { input: "4\n3 4\n7 2\n1 8\n5 6", expectedOutput: "4", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 17. 마법의 계단
  {
    title: "마법의 계단",
    description: `마법의 계단에는 N개의 칸이 있으며, 각 칸에는 마법 점수가 적혀 있다. 점수는 양수 또는 음수일 수 있다. 한 번에 1칸 또는 2칸씩 올라갈 수 있으며, 반드시 꼭대기(N번 칸)에 도달해야 한다. 방문한 칸의 점수 합을 최대화하여라.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">마법의 계단 (최대 점수)</text>
  <rect x="30" y="160" width="60" height="25" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/>
  <text x="60" y="177" text-anchor="middle" fill="white" font-size="11" font-weight="bold">+10</text>
  <text x="60" y="156" text-anchor="middle" fill="#333" font-size="9">칸 1</text>
  <rect x="100" y="135" width="60" height="25" fill="#f44336" rx="3" stroke="#333" stroke-width="1"/>
  <text x="130" y="152" text-anchor="middle" fill="white" font-size="11" font-weight="bold">-5</text>
  <text x="130" y="131" text-anchor="middle" fill="#333" font-size="9">칸 2</text>
  <rect x="170" y="110" width="60" height="25" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/>
  <text x="200" y="127" text-anchor="middle" fill="white" font-size="11" font-weight="bold">+20</text>
  <text x="200" y="106" text-anchor="middle" fill="#333" font-size="9">칸 3</text>
  <rect x="240" y="85" width="60" height="25" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/>
  <text x="270" y="102" text-anchor="middle" fill="white" font-size="11" font-weight="bold">+15</text>
  <text x="270" y="81" text-anchor="middle" fill="#333" font-size="9">칸 4</text>
  <rect x="310" y="60" width="60" height="25" fill="#4caf50" rx="3" stroke="#333" stroke-width="2"/>
  <text x="340" y="77" text-anchor="middle" fill="white" font-size="11" font-weight="bold">+5</text>
  <text x="340" y="56" text-anchor="middle" fill="#333" font-size="9">칸 5 (꼭대기)</text>
  <text x="200" y="165" text-anchor="middle" fill="#333" font-size="11">최적 경로: 1→3→4→5 = 10+20+15+5=50</text>
  <text x="200" y="182" text-anchor="middle" fill="#2196f3" font-size="10">dp[i] = max(dp[i-1], dp[i-2]) + score[i]</text>
</svg>

## 입력

첫째 줄에 계단의 칸 수 N이 주어진다. 둘째 줄에 각 칸의 점수 N개가 공백으로 구분되어 주어진다.

## 출력

꼭대기에 도달할 때의 최대 점수를 출력한다.

## 제한

- 1 ≤ N ≤ 100000
- -10000 ≤ 점수 ≤ 10000

## 예제 입력 1

\`\`\`
6
10 20 15 25 10 20
\`\`\`

## 예제 출력 1

\`\`\`
100
\`\`\`

## 예제 입력 2

\`\`\`
4
-5 3 7 2
\`\`\`

## 예제 출력 2

\`\`\`
12
\`\`\`

**설명**: 예제 1에서 dp[i] = max(dp[i-1], dp[i-2]) + score[i] 점화식으로 계산하면 꼭대기의 최대값은 100이다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "6\n10 20 15 25 10 20", expectedOutput: "100", isVisible: true },
      { input: "4\n-5 3 7 2", expectedOutput: "12", isVisible: true },
      { input: "1\n42", expectedOutput: "42", isVisible: false },
      { input: "5\n1 2 3 4 5", expectedOutput: "15", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 18. 퍼즐 게임
  {
    title: "퍼즐 게임",
    description: `클래식 슬라이딩 퍼즐(8퍼즐)은 3×3 격자에 1~8번 조각과 빈 칸(0)으로 구성된다. 빈 칸과 인접한 조각을 이동하여 목표 상태로 만드는 최소 이동 횟수를 구하여라. 도달할 수 없으면 -1을 출력한다.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">8-퍼즐 (슬라이딩 퍼즐)</text>
  <text x="80" y="42" text-anchor="middle" fill="#333" font-size="11">초기 상태</text>
  <rect x="25" y="50" width="35" height="35" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/><text x="42" y="73" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <rect x="65" y="50" width="35" height="35" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/><text x="82" y="73" text-anchor="middle" fill="white" font-size="14" font-weight="bold">2</text>
  <rect x="105" y="50" width="35" height="35" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/><text x="122" y="73" text-anchor="middle" fill="white" font-size="14" font-weight="bold">3</text>
  <rect x="25" y="90" width="35" height="35" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/><text x="42" y="113" text-anchor="middle" fill="white" font-size="14" font-weight="bold">4</text>
  <rect x="65" y="90" width="35" height="35" fill="#ff9800" rx="3" stroke="#333" stroke-width="2"/><text x="82" y="113" text-anchor="middle" fill="white" font-size="14" font-weight="bold">0</text>
  <rect x="105" y="90" width="35" height="35" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/><text x="122" y="113" text-anchor="middle" fill="white" font-size="14" font-weight="bold">5</text>
  <rect x="25" y="130" width="35" height="35" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/><text x="42" y="153" text-anchor="middle" fill="white" font-size="14" font-weight="bold">7</text>
  <rect x="65" y="130" width="35" height="35" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/><text x="82" y="153" text-anchor="middle" fill="white" font-size="14" font-weight="bold">8</text>
  <rect x="105" y="130" width="35" height="35" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/><text x="122" y="153" text-anchor="middle" fill="white" font-size="14" font-weight="bold">6</text>
  <text x="185" y="105" text-anchor="middle" fill="#ff9800" font-size="28">→</text>
  <text x="185" y="125" text-anchor="middle" fill="#333" font-size="9">BFS</text>
  <text x="310" y="42" text-anchor="middle" fill="#333" font-size="11">목표 상태</text>
  <rect x="255" y="50" width="35" height="35" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/><text x="272" y="73" text-anchor="middle" fill="white" font-size="14" font-weight="bold">1</text>
  <rect x="295" y="50" width="35" height="35" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/><text x="312" y="73" text-anchor="middle" fill="white" font-size="14" font-weight="bold">2</text>
  <rect x="335" y="50" width="35" height="35" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/><text x="352" y="73" text-anchor="middle" fill="white" font-size="14" font-weight="bold">3</text>
  <rect x="255" y="90" width="35" height="35" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/><text x="272" y="113" text-anchor="middle" fill="white" font-size="14" font-weight="bold">4</text>
  <rect x="295" y="90" width="35" height="35" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/><text x="312" y="113" text-anchor="middle" fill="white" font-size="14" font-weight="bold">5</text>
  <rect x="335" y="90" width="35" height="35" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/><text x="352" y="113" text-anchor="middle" fill="white" font-size="14" font-weight="bold">6</text>
  <rect x="255" y="130" width="35" height="35" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/><text x="272" y="153" text-anchor="middle" fill="white" font-size="14" font-weight="bold">7</text>
  <rect x="295" y="130" width="35" height="35" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/><text x="312" y="153" text-anchor="middle" fill="white" font-size="14" font-weight="bold">8</text>
  <rect x="335" y="130" width="35" height="35" fill="#ff9800" rx="3" stroke="#333" stroke-width="2"/><text x="352" y="153" text-anchor="middle" fill="white" font-size="14" font-weight="bold">0</text>
  <text x="200" y="192" text-anchor="middle" fill="#333" font-size="10">도달 불가능한 경우 -1 출력</text>
</svg>

## 입력

첫째 줄부터 3줄에 걸쳐 초기 상태의 3×3 격자가 주어진다. 0은 빈 칸이다. 다음 3줄에 걸쳐 목표 상태의 3×3 격자가 주어진다.

## 출력

최소 이동 횟수를 출력한다. 도달 불가능하면 -1을 출력한다.

## 제한

- 입력은 0~8의 숫자로 이루어진 3×3 격자 (중복 없음)

## 예제 입력 1

\`\`\`
1 2 3
4 5 6
7 8 0
1 2 3
4 5 6
7 8 0
\`\`\`

## 예제 출력 1

\`\`\`
0
\`\`\`

## 예제 입력 2

\`\`\`
1 2 3
4 5 6
7 0 8
1 2 3
4 5 6
7 8 0
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\`

**설명**: 예제 1은 이미 목표 상태이므로 0번. 예제 2는 빈 칸을 오른쪽으로 한 번 이동하면 된다.`,
    difficulty: 6.5,
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "1 2 3\n4 5 6\n7 8 0\n1 2 3\n4 5 6\n7 8 0", expectedOutput: "0", isVisible: true },
      { input: "1 2 3\n4 5 6\n7 0 8\n1 2 3\n4 5 6\n7 8 0", expectedOutput: "1", isVisible: true },
      { input: "1 2 3\n4 5 6\n0 7 8\n1 2 3\n4 5 6\n7 8 0", expectedOutput: "2", isVisible: false },
      { input: "1 2 3\n4 5 6\n8 7 0\n1 2 3\n4 5 6\n7 8 0", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["BFS"],
  },

  // 19. 강도 계획
  {
    title: "강도 계획",
    description: `교활한 강도 막스는 일직선으로 늘어선 N개의 가게를 털 계획을 세우고 있다. 인접한 두 가게를 동시에 털면 경보가 울리므로, 인접하지 않은 가게만 선택해야 한다. 각 가게에서 얻을 수 있는 금액이 주어졌을 때, 경보 없이 얻을 수 있는 최대 금액을 구하여라.

<svg width="400" height="170" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="170" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">강도 계획 - 인접 불가</text>
  <rect x="20" y="50" width="55" height="50" fill="#2196f3" rx="5" stroke="#333" stroke-width="2"/>
  <text x="47" y="72" text-anchor="middle" fill="white" font-size="10" font-weight="bold">가게1</text>
  <text x="47" y="90" text-anchor="middle" fill="white" font-size="12" font-weight="bold">2</text>
  <rect x="85" y="50" width="55" height="50" fill="#ccc" rx="5" stroke="#333" stroke-width="1"/>
  <text x="112" y="72" text-anchor="middle" fill="#333" font-size="10">가게2</text>
  <text x="112" y="90" text-anchor="middle" fill="#333" font-size="12">7</text>
  <rect x="150" y="50" width="55" height="50" fill="#2196f3" rx="5" stroke="#333" stroke-width="2"/>
  <text x="177" y="72" text-anchor="middle" fill="white" font-size="10" font-weight="bold">가게3</text>
  <text x="177" y="90" text-anchor="middle" fill="white" font-size="12" font-weight="bold">9</text>
  <rect x="215" y="50" width="55" height="50" fill="#ccc" rx="5" stroke="#333" stroke-width="1"/>
  <text x="242" y="72" text-anchor="middle" fill="#333" font-size="10">가게4</text>
  <text x="242" y="90" text-anchor="middle" fill="#333" font-size="12">3</text>
  <rect x="280" y="50" width="55" height="50" fill="#2196f3" rx="5" stroke="#333" stroke-width="2"/>
  <text x="307" y="72" text-anchor="middle" fill="white" font-size="10" font-weight="bold">가게5</text>
  <text x="307" y="90" text-anchor="middle" fill="white" font-size="12" font-weight="bold">1</text>
  <text x="112" y="120" text-anchor="middle" fill="#f44336" font-size="18">✗</text>
  <text x="242" y="120" text-anchor="middle" fill="#f44336" font-size="18">✗</text>
  <text x="47" y="120" text-anchor="middle" fill="#4caf50" font-size="18">✓</text>
  <text x="177" y="120" text-anchor="middle" fill="#4caf50" font-size="18">✓</text>
  <text x="307" y="120" text-anchor="middle" fill="#4caf50" font-size="18">✓</text>
  <text x="200" y="155" text-anchor="middle" fill="#333" font-size="11">선택: 1,3,5번 가게 → 합계 2+9+1=12</text>
  <text x="200" y="170" text-anchor="middle" fill="#2196f3" font-size="10">dp[i] = max(dp[i-1], dp[i-2] + amount[i])</text>
</svg>

## 입력

첫째 줄에 가게 수 N이 주어진다. 둘째 줄에 각 가게의 금액이 공백으로 구분되어 주어진다.

## 출력

얻을 수 있는 최대 금액을 출력한다.

## 제한

- 1 ≤ N ≤ 100000
- 0 ≤ 금액 ≤ 1000000

## 예제 입력 1

\`\`\`
5
2 7 9 3 1
\`\`\`

## 예제 출력 1

\`\`\`
12
\`\`\`

## 예제 입력 2

\`\`\`
4
1 2 3 1
\`\`\`

## 예제 출력 2

\`\`\`
4
\`\`\`

**설명**: 예제 1에서 가게 1, 3, 5를 선택하면 2+9+1=12. 예제 2에서 가게 1, 3을 선택하면 1+3=4가 최대이다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "5\n2 7 9 3 1", expectedOutput: "12", isVisible: true },
      { input: "4\n1 2 3 1", expectedOutput: "4", isVisible: true },
      { input: "1\n5", expectedOutput: "5", isVisible: false },
      { input: "7\n6 7 1 30 8 2 4", expectedOutput: "41", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 20. 비행기 좌석
  {
    title: "비행기 좌석",
    description: `N명의 승객이 비행기에 탑승한다. 1번 승객은 자신의 좌석을 잃어버려 무작위로 좌석을 선택한다. 2번부터 N번 승객은 순서대로 탑승하며, 자신의 좌석이 비어 있으면 자신의 자리에 앉고, 이미 누군가 앉아 있으면 남은 빈 좌석 중 무작위로 선택하여 앉는다.

N번 마지막 승객이 자신의 좌석에 앉게 될 확률을 구하여라.

<svg width="400" height="185" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="185" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">비행기 좌석 확률</text>
  <rect x="20" y="40" width="50" height="35" fill="#f44336" rx="4" stroke="#333" stroke-width="1.5"/>
  <text x="45" y="53" text-anchor="middle" fill="white" font-size="9" font-weight="bold">1번 승객</text>
  <text x="45" y="67" text-anchor="middle" fill="white" font-size="9">랜덤 착석</text>
  <rect x="80" y="40" width="50" height="35" fill="#2196f3" rx="4" stroke="#333" stroke-width="1.5"/>
  <text x="105" y="53" text-anchor="middle" fill="white" font-size="9">2번 승객</text>
  <text x="105" y="67" text-anchor="middle" fill="white" font-size="9">본인 자리</text>
  <rect x="140" y="40" width="50" height="35" fill="#2196f3" rx="4" stroke="#333" stroke-width="1.5"/>
  <text x="165" y="53" text-anchor="middle" fill="white" font-size="9">3번 승객</text>
  <text x="165" y="67" text-anchor="middle" fill="white" font-size="9">본인 자리</text>
  <text x="220" y="62" text-anchor="middle" fill="#333" font-size="16">...</text>
  <rect x="250" y="40" width="60" height="35" fill="#4caf50" rx="4" stroke="#333" stroke-width="2"/>
  <text x="280" y="53" text-anchor="middle" fill="white" font-size="9" font-weight="bold">N번 승객</text>
  <text x="280" y="67" text-anchor="middle" fill="white" font-size="9">본인 자리?</text>
  <text x="340" y="57" text-anchor="middle" fill="#333" font-size="24">?</text>
  <rect x="20" y="95" width="360" height="75" fill="white" rx="8" stroke="#2196f3" stroke-width="2"/>
  <text x="200" y="115" text-anchor="middle" fill="#333" font-size="12" font-weight="bold">수학적 증명</text>
  <text x="200" y="133" text-anchor="middle" fill="#333" font-size="11">P(N번이 자기 자리 착석) = 1/2</text>
  <text x="200" y="150" text-anchor="middle" fill="#2196f3" font-size="10">N ≥ 2일 때 항상 성립</text>
  <text x="200" y="165" text-anchor="middle" fill="#333" font-size="10">귀납법으로 증명 가능한 고전 확률 문제</text>
</svg>

## 입력

첫째 줄에 승객 수 N이 주어진다.

## 출력

N번 마지막 승객이 자신의 좌석에 앉을 확률을 소수점 6자리까지 출력한다.

## 제한

- 1 ≤ N ≤ 1000000

## 예제 입력 1

\`\`\`
1
\`\`\`

## 예제 출력 1

\`\`\`
1.000000
\`\`\`

## 예제 입력 2

\`\`\`
5
\`\`\`

## 예제 출력 2

\`\`\`
0.500000
\`\`\`

**설명**: N=1이면 유일한 승객이 자신의 자리에 반드시 앉으므로 확률 1. N≥2이면 최종 결과가 1번 좌석 또는 N번 좌석 중 하나에 귀착되므로 확률은 항상 1/2이다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.000001,
    floatRelativeError: null,
    testCases: [
      { input: "1", expectedOutput: "1.000000", isVisible: true },
      { input: "5", expectedOutput: "0.500000", isVisible: true },
      { input: "2", expectedOutput: "0.500000", isVisible: false },
      { input: "1000000", expectedOutput: "0.500000", isVisible: false },
    ],
    tags: ["수학"],
  },

  // 21. 편의점 알바
  {
    title: "편의점 알바",
    description: `24시간 편의점에서 하루 운영을 위해 아르바이트생을 구한다. N명의 지원자가 있으며, 각 지원자는 근무 가능한 시간대 [시작, 종료)가 주어진다. 24시간(0~24시) 동안 빈 시간 없이 운영하려면 최소 몇 명을 고용해야 하는지 구하여라. 불가능하면 -1을 출력한다.

<svg width="400" height="185" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="185" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">24시간 타임라인 커버</text>
  <line x1="20" y1="60" x2="380" y2="60" stroke="#333" stroke-width="2"/>
  <text x="20" y="75" text-anchor="middle" fill="#333" font-size="9">0</text>
  <text x="182" y="75" text-anchor="middle" fill="#333" font-size="9">12</text>
  <text x="377" y="75" text-anchor="middle" fill="#333" font-size="9">24</text>
  <rect x="20" y="85" width="120" height="18" fill="#2196f3" rx="3" stroke="#333" stroke-width="1"/>
  <text x="80" y="98" text-anchor="middle" fill="white" font-size="9">알바A: 0~8</text>
  <rect x="140" y="85" width="120" height="18" fill="#4caf50" rx="3" stroke="#333" stroke-width="1"/>
  <text x="200" y="98" text-anchor="middle" fill="white" font-size="9">알바B: 8~16</text>
  <rect x="260" y="85" width="120" height="18" fill="#ff9800" rx="3" stroke="#333" stroke-width="1"/>
  <text x="320" y="98" text-anchor="middle" fill="white" font-size="9">알바C: 16~24</text>
  <text x="200" y="122" text-anchor="middle" fill="#333" font-size="10">→ 3명으로 24시간 커버 가능</text>
  <rect x="20" y="135" width="120" height="18" fill="#2196f3" rx="3"/>
  <text x="80" y="148" text-anchor="middle" fill="white" font-size="9">알바X: 0~8</text>
  <rect x="150" y="135" width="120" height="18" fill="#4caf50" rx="3"/>
  <text x="210" y="148" text-anchor="middle" fill="white" font-size="9">알바Y: 9~24</text>
  <rect x="138" y="130" width="15" height="28" fill="#f44336" opacity="0.7" rx="2"/>
  <text x="145" y="170" text-anchor="middle" fill="#f44336" font-size="9" font-weight="bold">공백!</text>
  <text x="200" y="183" text-anchor="middle" fill="#333" font-size="10">그리디: 현재 커버된 끝점에서 가장 멀리 닿는 구간 선택</text>
</svg>

## 입력

첫째 줄에 지원자 수 N이 주어진다. 다음 N줄에 걸쳐 각 지원자의 근무 가능 시작 시간과 종료 시간이 주어진다.

## 출력

최소 고용 인원을 출력한다. 불가능하면 -1을 출력한다.

## 제한

- 1 ≤ N ≤ 1000
- 0 ≤ 시작 시간 < 종료 시간 ≤ 24

## 예제 입력 1

\`\`\`
3
0 8
8 16
16 24
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
3
0 10
5 20
15 24
\`\`\`

## 예제 출력 2

\`\`\`
3
\`\`\`

**설명**: 예제 1에서 세 명이 8시간씩 나누어 딱 맞게 커버한다. 예제 2에서 그리디로 [0,10)→[5,20)→[15,24)를 선택하면 3명이 필요하다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "3\n0 8\n8 16\n16 24", expectedOutput: "3", isVisible: true },
      { input: "3\n0 10\n5 20\n15 24", expectedOutput: "3", isVisible: true },
      { input: "3\n0 12\n8 24\n0 24", expectedOutput: "1", isVisible: false },
      { input: "3\n0 8\n9 16\n16 24", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["그리디", "정렬"],
  },

  // 22. 미로 생성기
  {
    title: "미로 생성기",
    description: `마법사가 N×M 격자로 이루어진 미로를 생성했다. 미로의 각 칸은 길(0) 또는 벽(1)이다. 입구(0,0)에서 출구(N-1,M-1)까지 이동하는 최소 칸 수를 구하여라. 이동은 상하좌우로만 가능하다.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">미로 탈출 (BFS 최단 경로)</text>
  <g transform="translate(60, 35)">
    <rect x="0" y="0" width="40" height="40" fill="#4caf50" stroke="#333" stroke-width="1"/>
    <text x="20" y="25" text-anchor="middle" fill="white" font-size="11" font-weight="bold">입구</text>
    <rect x="40" y="0" width="40" height="40" fill="white" stroke="#333" stroke-width="1"/>
    <text x="60" y="25" text-anchor="middle" fill="#333" font-size="11">0</text>
    <rect x="80" y="0" width="40" height="40" fill="#333" stroke="#333" stroke-width="1"/>
    <text x="100" y="25" text-anchor="middle" fill="white" font-size="11">■</text>
    <rect x="120" y="0" width="40" height="40" fill="white" stroke="#333" stroke-width="1"/>
    <text x="140" y="25" text-anchor="middle" fill="#333" font-size="11">0</text>
    <rect x="0" y="40" width="40" height="40" fill="#333" stroke="#333" stroke-width="1"/>
    <rect x="40" y="40" width="40" height="40" fill="#2196f3" stroke="#333" stroke-width="2"/>
    <text x="60" y="65" text-anchor="middle" fill="white" font-size="11">↓</text>
    <rect x="80" y="40" width="40" height="40" fill="#2196f3" stroke="#333" stroke-width="2"/>
    <text x="100" y="65" text-anchor="middle" fill="white" font-size="11">→</text>
    <rect x="120" y="40" width="40" height="40" fill="#2196f3" stroke="#333" stroke-width="2"/>
    <text x="140" y="65" text-anchor="middle" fill="white" font-size="11">↓</text>
    <rect x="0" y="80" width="40" height="40" fill="#333" stroke="#333" stroke-width="1"/>
    <rect x="40" y="80" width="40" height="40" fill="#333" stroke="#333" stroke-width="1"/>
    <rect x="80" y="80" width="40" height="40" fill="white" stroke="#333" stroke-width="1"/>
    <rect x="120" y="80" width="40" height="40" fill="#2196f3" stroke="#333" stroke-width="2"/>
    <text x="140" y="105" text-anchor="middle" fill="white" font-size="11">↓</text>
    <rect x="0" y="120" width="40" height="40" fill="white" stroke="#333" stroke-width="1"/>
    <rect x="40" y="120" width="40" height="40" fill="white" stroke="#333" stroke-width="1"/>
    <rect x="80" y="120" width="40" height="40" fill="white" stroke="#333" stroke-width="1"/>
    <rect x="120" y="120" width="40" height="40" fill="#f44336" stroke="#333" stroke-width="2"/>
    <text x="140" y="145" text-anchor="middle" fill="white" font-size="10" font-weight="bold">출구</text>
  </g>
  <text x="200" y="192" text-anchor="middle" fill="#333" font-size="10">파란 칸 = 최단 경로 (6칸)</text>
</svg>

## 입력

첫째 줄에 행 수 N과 열 수 M이 주어진다. 다음 N줄에 걸쳐 미로 상태가 0과 1의 문자열로 주어진다.

## 출력

최소 이동 칸 수를 출력한다. 도달 불가능하면 -1을 출력한다.

## 제한

- 2 ≤ N, M ≤ 1000
- 시작과 끝 칸은 항상 길(0)이다

## 예제 입력 1

\`\`\`
4 4
0010
1000
1101
0000
\`\`\`

## 예제 출력 1

\`\`\`
6
\`\`\`

## 예제 입력 2

\`\`\`
3 3
000
110
110
\`\`\`

## 예제 출력 2

\`\`\`
4
\`\`\`

**설명**: 예제 1에서 (0,0)→(0,1)→(1,1)→(1,2)→(1,3)→(2,3)→(3,3) 경로로 6칸 이동. 예제 2에서 (0,0)을 포함해 4칸이 최단이다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "4 4\n0010\n1000\n1101\n0000", expectedOutput: "6", isVisible: true },
      { input: "3 3\n000\n110\n110", expectedOutput: "4", isVisible: true },
      { input: "3 3\n000\n111\n000", expectedOutput: "-1", isVisible: false },
      { input: "3 3\n000\n000\n000", expectedOutput: "4", isVisible: false },
    ],
    tags: ["DFS", "구현"],
  },

  // 23. 공 던지기
  {
    title: "공 던지기",
    description: `N명이 원형으로 앉아 공 던지기 게임을 하고 있다. 1번부터 N번까지 번호가 붙어 있으며, 1번이 공을 가지고 시작한다. 공을 가진 사람은 시계 방향으로 M번째 사람에게 공을 던진다. 이 과정을 K번 반복했을 때, 마지막에 공을 가지고 있는 사람의 번호를 구하여라.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">원형 공 던지기 (N=5, M=2)</text>
  <circle cx="200" cy="110" r="65" fill="none" stroke="#ccc" stroke-width="1" stroke-dasharray="5"/>
  <circle cx="200" cy="45" r="15" fill="#ff9800" stroke="#333" stroke-width="2"/>
  <text x="200" y="50" text-anchor="middle" fill="white" font-size="12" font-weight="bold">1</text>
  <text x="200" y="35" text-anchor="middle" fill="#ff9800" font-size="9">공 소지</text>
  <circle cx="262" cy="72" r="15" fill="#2196f3" stroke="#333" stroke-width="1.5"/>
  <text x="262" y="77" text-anchor="middle" fill="white" font-size="12" font-weight="bold">2</text>
  <circle cx="285" cy="140" r="15" fill="#2196f3" stroke="#333" stroke-width="1.5"/>
  <text x="285" y="145" text-anchor="middle" fill="white" font-size="12" font-weight="bold">3</text>
  <circle cx="138" cy="140" r="15" fill="#4caf50" stroke="#333" stroke-width="2"/>
  <text x="138" y="145" text-anchor="middle" fill="white" font-size="12" font-weight="bold">4</text>
  <text x="110" y="165" text-anchor="middle" fill="#4caf50" font-size="9">K=1 후</text>
  <circle cx="115" cy="72" r="15" fill="#2196f3" stroke="#333" stroke-width="1.5"/>
  <text x="115" y="77" text-anchor="middle" fill="white" font-size="12" font-weight="bold">5</text>
  <text x="200" y="185" text-anchor="middle" fill="#333" font-size="10">1→3→5→2→4→... 순서로 전달 (M=2씩 건너뜀)</text>
</svg>

## 입력

첫째 줄에 사람 수 N, 건너뛸 수 M, 반복 횟수 K가 공백으로 구분되어 주어진다.

## 출력

K번 후 공을 가진 사람의 번호를 출력한다.

## 제한

- 2 ≤ N ≤ 1000000
- 1 ≤ M ≤ 1000000
- 1 ≤ K ≤ 1000000

## 예제 입력 1

\`\`\`
5 2 3
\`\`\`

## 예제 출력 1

\`\`\`
2
\`\`\`

## 예제 입력 2

\`\`\`
7 3 5
\`\`\`

## 예제 출력 2

\`\`\`
2
\`\`\`

**설명**: 예제 1에서 5명이 M=2씩 K=3번 전달: 1→3→5→2. 마지막은 2번. 공식: (M×K mod N) + 1 = (6 mod 5) + 1 = 2.`,
    difficulty: 3.0,
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "5 2 3", expectedOutput: "2", isVisible: true },
      { input: "7 3 5", expectedOutput: "2", isVisible: true },
      { input: "6 4 2", expectedOutput: "3", isVisible: false },
      { input: "10 3 7", expectedOutput: "2", isVisible: false },
    ],
    tags: ["구현"],
  },

  // 24. 왕국의 도로
  {
    title: "왕국의 도로",
    description: `왕국에는 N개의 도시와 M개의 양방향 도로가 있다. 도로 중 그 도로를 제거하면 일부 도시가 다른 도시와 연결되지 않게 되는 도로를 '다리(bridge)'라고 한다. 모든 다리의 수를 구하여라.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">그래프에서 다리(Bridge) 찾기</text>
  <circle cx="80" cy="80" r="20" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="80" y="85" text-anchor="middle" fill="white" font-size="12" font-weight="bold">1</text>
  <circle cx="180" cy="60" r="20" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="180" y="65" text-anchor="middle" fill="white" font-size="12" font-weight="bold">2</text>
  <circle cx="180" cy="140" r="20" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="180" y="145" text-anchor="middle" fill="white" font-size="12" font-weight="bold">3</text>
  <circle cx="290" cy="100" r="20" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="290" y="105" text-anchor="middle" fill="white" font-size="12" font-weight="bold">4</text>
  <circle cx="370" cy="100" r="20" fill="#f44336" stroke="#333" stroke-width="2"/>
  <text x="370" y="105" text-anchor="middle" fill="white" font-size="12" font-weight="bold">5</text>
  <line x1="100" y1="80" x2="160" y2="65" stroke="#333" stroke-width="2"/>
  <line x1="100" y1="90" x2="160" y2="135" stroke="#333" stroke-width="2"/>
  <line x1="180" y1="80" x2="180" y2="120" stroke="#333" stroke-width="2"/>
  <line x1="200" y1="65" x2="270" y2="95" stroke="#333" stroke-width="2"/>
  <line x1="200" y1="140" x2="270" y2="108" stroke="#333" stroke-width="2"/>
  <line x1="310" y1="100" x2="350" y2="100" stroke="#f44336" stroke-width="4"/>
  <text x="330" y="90" text-anchor="middle" fill="#f44336" font-size="10" font-weight="bold">다리!</text>
  <text x="140" y="190" text-anchor="middle" fill="#333" font-size="10">1-2-3-4 사이클 → 내부 도로는 다리 아님</text>
  <text x="330" y="175" text-anchor="middle" fill="#f44336" font-size="10" font-weight="bold">4-5 = 다리</text>
  <text x="200" y="195" text-anchor="middle" fill="#2196f3" font-size="10">Tarjan 알고리즘으로 O(V+E) 탐색</text>
</svg>

## 입력

첫째 줄에 도시 수 N과 도로 수 M이 주어진다. 다음 M줄에 걸쳐 도로로 연결된 두 도시 번호 U, V가 주어진다.

## 출력

다리의 수를 출력한다.

## 제한

- 1 ≤ N ≤ 100000
- 1 ≤ M ≤ 200000
- 그래프는 연결되어 있다

## 예제 입력 1

\`\`\`
4 3
1 2
2 3
3 4
\`\`\`

## 예제 출력 1

\`\`\`
3
\`\`\`

## 예제 입력 2

\`\`\`
4 4
1 2
2 3
3 1
3 4
\`\`\`

## 예제 출력 2

\`\`\`
1
\`\`\`

**설명**: 예제 1에서 1-2-3-4 체인이므로 모든 도로가 다리이다. 예제 2에서 1-2-3이 사이클을 이루므로 그 도로들은 다리가 아니다. 3-4만 다리이다.`,
    difficulty: 7.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "4 3\n1 2\n2 3\n3 4", expectedOutput: "3", isVisible: true },
      { input: "4 4\n1 2\n2 3\n3 1\n3 4", expectedOutput: "1", isVisible: true },
      { input: "5 5\n1 2\n2 3\n3 4\n4 2\n4 5", expectedOutput: "2", isVisible: false },
      { input: "4 4\n1 2\n2 3\n3 4\n4 1", expectedOutput: "0", isVisible: false },
    ],
    tags: ["그래프", "DFS"],
  },

  // 25. 던전 RPG
  {
    title: "던전 RPG",
    description: `던전은 N개의 방으로 이루어진 트리 구조이다. 루트(1번 방)에서 탐험을 시작하며, 초기 체력은 H이다. 각 방에는 몬스터가 있어 입장 시 체력이 damage[i]만큼 감소한다(체력이 0 이하가 되면 진입 불가). 몬스터를 처치하면 exp[i]의 경험치를 얻고 recovery[i]만큼 체력이 회복된다. 자식 방은 부모 방을 클리어한 후에만 진입할 수 있다. 최대 경험치를 구하여라.

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="10"/>
  <text x="200" y="22" text-anchor="middle" fill="#333" font-size="13" font-weight="bold">던전 트리 DP</text>
  <circle cx="200" cy="55" r="25" fill="#2196f3" stroke="#333" stroke-width="2"/>
  <text x="200" y="50" text-anchor="middle" fill="white" font-size="10" font-weight="bold">방 1</text>
  <text x="200" y="63" text-anchor="middle" fill="white" font-size="9">HP-3,+5,EXP5</text>
  <circle cx="100" cy="130" r="25" fill="#ff9800" stroke="#333" stroke-width="2"/>
  <text x="100" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="bold">방 2</text>
  <text x="100" y="138" text-anchor="middle" fill="white" font-size="9">HP-2,+1,EXP8</text>
  <circle cx="300" cy="130" r="25" fill="#ff9800" stroke="#333" stroke-width="2"/>
  <text x="300" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="bold">방 3</text>
  <text x="300" y="138" text-anchor="middle" fill="white" font-size="9">HP-5,+3,EXP10</text>
  <circle cx="300" cy="185" r="15" fill="#f44336" stroke="#333" stroke-width="2"/>
  <text x="300" y="181" text-anchor="middle" fill="white" font-size="9" font-weight="bold">방 4</text>
  <text x="300" y="193" text-anchor="middle" fill="white" font-size="8">HP-1,+2,EXP15</text>
  <line x1="180" y1="72" x2="120" y2="113" stroke="#333" stroke-width="2"/>
  <line x1="220" y1="72" x2="280" y2="113" stroke="#333" stroke-width="2"/>
  <line x1="300" y1="155" x2="300" y2="170" stroke="#333" stroke-width="2"/>
  <rect x="10" y="50" width="65" height="30" fill="#4caf50" rx="4" stroke="#333" stroke-width="1"/>
  <text x="42" y="63" text-anchor="middle" fill="white" font-size="9" font-weight="bold">초기 HP</text>
  <text x="42" y="75" text-anchor="middle" fill="white" font-size="11" font-weight="bold">= 10</text>
</svg>

## 입력

첫째 줄에 방 수 N과 초기 체력 H가 주어진다. 다음 N줄에 걸쳐 각 방의 피해량 damage[i], 회복량 recovery[i], 경험치 exp[i]가 주어진다. 마지막으로 N-1줄에 걸쳐 부모-자식 관계(부모 번호 자식 번호)가 주어진다.

## 출력

획득 가능한 최대 경험치를 출력한다.

## 제한

- 1 ≤ N ≤ 1000
- 1 ≤ H ≤ 10000
- 1 ≤ damage[i] ≤ 10000
- 0 ≤ recovery[i] ≤ 10000
- 0 ≤ exp[i] ≤ 10000

## 예제 입력 1

\`\`\`
3 10
3 5 5
2 1 8
5 3 10
1 2
1 3
\`\`\`

## 예제 출력 1

\`\`\`
23
\`\`\`

## 예제 입력 2

\`\`\`
3 20
5 10 5
3 2 10
10 5 20
1 2
2 3
\`\`\`

## 예제 출력 2

\`\`\`
35
\`\`\`

**설명**: 예제 1에서 방1(10→7→12,EXP5) 진입 후, 방2(12→10→11,EXP8), 방3(11→6→9,EXP10) 모두 방문 가능. 총 5+8+10=23. 예제 2에서 1→2→3 모두 방문: 5+10+20=35.`,
    difficulty: 7.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    floatRelativeError: null,
    testCases: [
      { input: "3 10\n3 5 5\n2 1 8\n5 3 10\n1 2\n1 3", expectedOutput: "23", isVisible: true },
      { input: "3 20\n5 10 5\n3 2 10\n10 5 20\n1 2\n2 3", expectedOutput: "35", isVisible: true },
      { input: "4 10\n3 5 5\n2 1 8\n5 3 10\n1 2 15\n1 2\n1 3\n3 4", expectedOutput: "38", isVisible: false },
      { input: "3 5\n3 1 10\n10 5 50\n1 2 20\n1 2\n1 3", expectedOutput: "10", isVisible: false },
    ],
    tags: ["트리", "DP"],
  },
];
