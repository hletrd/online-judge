export const problems = [
  // 1. 우체부의 하루
  {
    title: "우체부의 하루",
    description: `민준이는 마을의 우체부이다. 마을에는 N개의 집이 있고, 각 집의 위치는 1차원 수직선 위의 좌표로 나타낼 수 있다. 민준이는 우체국 위치를 하나 정해서 그곳에서 출발하여 모든 집에 편지를 배달하고 싶다. 우체국에서 각 집까지의 거리의 합이 최소가 되도록 우체국 위치를 정할 때, 그 최솟값을 구하시오.

우체국은 정수 좌표에 위치하지 않아도 되지만, 집의 좌표 범위 안에 있어야 한다. 단, 거리의 합이 최솟값이 되는 우체국 위치는 항상 집들 중 하나의 좌표에 위치함이 알려져 있다.

<svg width="400" height="120" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="120" fill="#e3f2fd" rx="8"/>
  <line x1="30" y1="70" x2="370" y2="70" stroke="#333" stroke-width="2"/>
  <line x1="370" y1="65" x2="370" y2="75" stroke="#333" stroke-width="2"/>
  <circle cx="80" cy="70" r="7" fill="#2196f3"/>
  <text x="80" y="55" text-anchor="middle" font-size="12" fill="#333">집1(1)</text>
  <circle cx="160" cy="70" r="7" fill="#2196f3"/>
  <text x="160" y="55" text-anchor="middle" font-size="12" fill="#333">집2(4)</text>
  <circle cx="240" cy="70" r="7" fill="#2196f3"/>
  <text x="240" y="55" text-anchor="middle" font-size="12" fill="#333">집3(7)</text>
  <circle cx="310" cy="70" r="7" fill="#2196f3"/>
  <text x="310" y="55" text-anchor="middle" font-size="12" fill="#333">집4(10)</text>
  <rect x="195" y="55" width="30" height="25" fill="#ff9800" rx="3"/>
  <text x="210" y="72" text-anchor="middle" font-size="11" fill="white" font-weight="bold">우체국</text>
  <text x="210" y="100" text-anchor="middle" font-size="11" fill="#f44336">최적 위치: 중앙값</text>
</svg>

## 입력

첫째 줄에 집의 수 N이 주어진다. 둘째 줄에 N개의 집 좌표가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100,000
- 1 ≤ 각 좌표 ≤ 1,000,000

## 출력

모든 집까지의 거리 합의 최솟값을 출력한다.`,
    difficulty: 3.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n1 4 7 10", expectedOutput: "12", isVisible: true },
      { input: "3\n1 2 3", expectedOutput: "2", isVisible: false },
      { input: "1\n5", expectedOutput: "0", isVisible: false },
      { input: "5\n1 3 5 7 9", expectedOutput: "12", isVisible: false },
    ],
    tags: ["정렬", "수학"],
  },

  // 2. 해적의 보물 나누기
  {
    title: "해적의 보물 나누기",
    description: `해적 선장 철수는 항해 끝에 M개의 보물을 획득하였다. 각 보물에는 금화 가치가 있다. 철수는 N명의 해적을 두 그룹으로 나누고, 각 그룹에 보물을 몇 개씩 나눠 주려고 한다. 단, 모든 보물은 반드시 어느 한 그룹에 귀속되어야 한다.

두 그룹이 받는 보물의 가치 합 차이가 최소가 되도록 보물을 나눌 때, 그 최솟값을 구하시오.

<svg width="400" height="160" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="160" fill="#e3f2fd" rx="8"/>
  <rect x="30" y="30" width="140" height="100" fill="#2196f3" rx="6" opacity="0.2"/>
  <text x="100" y="55" text-anchor="middle" font-size="13" fill="#2196f3" font-weight="bold">그룹 A</text>
  <rect x="55" y="65" width="35" height="30" fill="#ff9800" rx="4"/>
  <text x="72" y="85" text-anchor="middle" font-size="12" fill="white">3</text>
  <rect x="100" y="65" width="35" height="30" fill="#ff9800" rx="4"/>
  <text x="117" y="85" text-anchor="middle" font-size="12" fill="white">7</text>
  <rect x="230" y="30" width="140" height="100" fill="#4caf50" rx="6" opacity="0.2"/>
  <text x="300" y="55" text-anchor="middle" font-size="13" fill="#4caf50" font-weight="bold">그룹 B</text>
  <rect x="255" y="65" width="35" height="30" fill="#ff9800" rx="4"/>
  <text x="272" y="85" text-anchor="middle" font-size="12" fill="white">5</text>
  <rect x="300" y="65" width="35" height="30" fill="#ff9800" rx="4"/>
  <text x="317" y="85" text-anchor="middle" font-size="12" fill="white">4</text>
  <text x="200" y="145" text-anchor="middle" font-size="11" fill="#f44336">|10 - 9| = 1 (최소 차이)</text>
</svg>

## 입력

첫째 줄에 보물의 수 M이 주어진다. 둘째 줄에 M개의 보물 가치가 공백으로 구분되어 주어진다.

- 1 ≤ M ≤ 20
- 1 ≤ 각 보물 가치 ≤ 100

## 출력

두 그룹의 보물 가치 합 차이의 최솟값을 출력한다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4\n3 7 5 4", expectedOutput: "1", isVisible: true },
      { input: "3\n1 2 3", expectedOutput: "0", isVisible: false },
      { input: "1\n10", expectedOutput: "10", isVisible: false },
      { input: "5\n3 1 4 1 5", expectedOutput: "0", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 3. 엘리베이터 운행
  {
    title: "엘리베이터 운행",
    description: `다운타운 빌딩의 엘리베이터는 매우 특이하다. 위로 이동 버튼을 누르면 항상 U층을 올라가고, 아래로 이동 버튼을 누르면 항상 D층을 내려간다. 단, 건물 밖으로 나가는 이동은 불가능하다.

건물은 1층부터 F층까지 있다. 민수는 현재 S층에 있고 G층으로 이동하고 싶다. 버튼을 최소 몇 번 눌러야 목표 층에 도달할 수 있는지 구하시오. 만약 도달할 수 없다면 "use the stairs"를 출력한다.

<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="8"/>
  <rect x="50" y="20" width="60" height="160" fill="#333" rx="4" opacity="0.15"/>
  <rect x="55" y="25" width="50" height="20" fill="#2196f3" rx="2" opacity="0.5"/>
  <text x="80" y="40" text-anchor="middle" font-size="10" fill="white">F층</text>
  <rect x="55" y="65" width="50" height="20" fill="#4caf50" rx="2"/>
  <text x="80" y="79" text-anchor="middle" font-size="10" fill="white">G층(목표)</text>
  <rect x="55" y="105" width="50" height="20" fill="#ff9800" rx="2"/>
  <text x="80" y="119" text-anchor="middle" font-size="10" fill="white">S층(출발)</text>
  <rect x="55" y="145" width="50" height="20" fill="#e3f2fd" rx="2" stroke="#333"/>
  <text x="80" y="159" text-anchor="middle" font-size="10" fill="#333">1층</text>
  <text x="160" y="80" font-size="12" fill="#333">▲ U층 이동</text>
  <text x="160" y="130" font-size="12" fill="#333">▼ D층 이동</text>
  <text x="160" y="170" font-size="11" fill="#f44336">BFS로 최소 횟수 탐색</text>
</svg>

## 입력

첫째 줄에 건물 층수 F, 시작 층 S, 목표 층 G, 위 버튼 이동 층수 U, 아래 버튼 이동 층수 D가 공백으로 구분되어 주어진다.

- 1 ≤ F ≤ 1,000
- 1 ≤ S, G ≤ F
- 0 ≤ U, D ≤ 1,000

## 출력

목표 층에 도달하기 위한 최소 버튼 횟수를 출력한다. 도달할 수 없으면 \`use the stairs\`를 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "10 1 10 2 1", expectedOutput: "6", isVisible: true },
      { input: "100 2 1 1 0", expectedOutput: "1", isVisible: false },
      { input: "100 1 100 3 5", expectedOutput: "use the stairs", isVisible: false },
      { input: "10 5 5 3 2", expectedOutput: "0", isVisible: false },
    ],
    tags: ["BFS"],
  },

  // 4. 뱀과 사다리 게임
  {
    title: "뱀과 사다리 게임",
    description: `클래식 보드게임인 뱀과 사다리 게임을 한다. 10×10 보드에서 1번 칸에서 시작해 100번 칸에 도달하면 이긴다.

매 턴마다 주사위(1~6)를 굴려 해당 칸 수만큼 앞으로 이동한다. 사다리가 있는 칸에 도착하면 사다리 위쪽 칸으로 이동하고, 뱀이 있는 칸에 도착하면 뱀의 꼬리 칸으로 이동한다. 이동 후 100번 칸을 초과하면 이동하지 않는다.

1번 칸에서 출발하여 100번 칸에 도달하기 위한 주사위 최소 횟수를 구하시오.

<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="8"/>
  <rect x="20" y="20" width="170" height="160" fill="white" rx="4" stroke="#333"/>
  <text x="105" y="40" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">10×10 보드</text>
  <rect x="30" y="50" width="20" height="20" fill="#4caf50" rx="2"/>
  <text x="40" y="65" text-anchor="middle" font-size="9" fill="white">1</text>
  <rect x="155" y="50" width="20" height="20" fill="#f44336" rx="2"/>
  <text x="165" y="65" text-anchor="middle" font-size="9" fill="white">100</text>
  <line x1="60" y1="130" x2="100" y2="90" stroke="#4caf50" stroke-width="3" marker-end="url(#arr)"/>
  <text x="65" y="150" font-size="10" fill="#4caf50">사다리(↑)</text>
  <line x1="130" y1="90" x2="110" y2="140" stroke="#f44336" stroke-width="3"/>
  <text x="120" y="175" font-size="10" fill="#f44336">뱀(↓)</text>
  <text x="280" y="80" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">주사위</text>
  <rect x="250" y="90" width="60" height="60" fill="#ff9800" rx="6"/>
  <circle cx="268" cy="108" r="5" fill="white"/>
  <circle cx="292" cy="108" r="5" fill="white"/>
  <circle cx="280" cy="120" r="5" fill="white"/>
  <text x="280" y="170" text-anchor="middle" font-size="11" fill="#2196f3">BFS 최소 횟수</text>
</svg>

## 입력

첫째 줄에 사다리의 수 N이 주어진다. 다음 N줄에 사다리의 시작 칸과 도착 칸이 주어진다. 다음 줄에 뱀의 수 M이 주어진다. 다음 M줄에 뱀의 머리 칸과 꼬리 칸이 주어진다.

- 1 ≤ N, M ≤ 15
- 사다리의 도착 칸은 시작 칸보다 크다.
- 뱀의 꼬리 칸은 머리 칸보다 작다.
- 1번 칸과 100번 칸에는 뱀이나 사다리가 없다.

## 출력

1번 칸에서 100번 칸에 도달하기 위한 최소 주사위 횟수를 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n32 62\n42 68\n12 98\n2\n95 13\n97 25", expectedOutput: "3", isVisible: true },
      { input: "1\n2 99\n1\n99 2", expectedOutput: "2", isVisible: false },
      { input: "0\n0", expectedOutput: "15", isVisible: false },
      { input: "2\n4 14\n9 31\n2\n17 7\n54 34", expectedOutput: "6", isVisible: false },
    ],
    tags: ["BFS"],
  },

  // 5. 정원 가꾸기
  {
    title: "정원 가꾸기",
    description: `영희는 N×M 크기의 정원을 가지고 있다. 각 칸에는 잡초가 있고 제거 비용이 적혀 있다. 영희는 K행 L열 크기의 직사각형 영역을 선택하여 그 안의 잡초를 모두 제거하려고 한다.

잡초 제거 비용의 합이 최소인 K×L 직사각형 영역을 선택할 때, 그 비용의 합을 구하시오.

<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="8"/>
  <text x="200" y="25" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">N×M 정원</text>
  <g transform="translate(60, 35)">
    <rect x="0" y="0" width="35" height="35" fill="#4caf50" rx="2" stroke="#333" stroke-width="1"/>
    <text x="17" y="22" text-anchor="middle" font-size="12" fill="white">2</text>
    <rect x="35" y="0" width="35" height="35" fill="#4caf50" rx="2" stroke="#333" stroke-width="1"/>
    <text x="52" y="22" text-anchor="middle" font-size="12" fill="white">3</text>
    <rect x="70" y="0" width="35" height="35" fill="#ff9800" rx="2" stroke="#f44336" stroke-width="2"/>
    <text x="87" y="22" text-anchor="middle" font-size="12" fill="white">1</text>
    <rect x="105" y="0" width="35" height="35" fill="#ff9800" rx="2" stroke="#f44336" stroke-width="2"/>
    <text x="122" y="22" text-anchor="middle" font-size="12" fill="white">4</text>
    <rect x="0" y="35" width="35" height="35" fill="#4caf50" rx="2" stroke="#333" stroke-width="1"/>
    <text x="17" y="57" text-anchor="middle" font-size="12" fill="white">5</text>
    <rect x="35" y="35" width="35" height="35" fill="#4caf50" rx="2" stroke="#333" stroke-width="1"/>
    <text x="52" y="57" text-anchor="middle" font-size="12" fill="white">6</text>
    <rect x="70" y="35" width="35" height="35" fill="#ff9800" rx="2" stroke="#f44336" stroke-width="2"/>
    <text x="87" y="57" text-anchor="middle" font-size="12" fill="white">2</text>
    <rect x="105" y="35" width="35" height="35" fill="#ff9800" rx="2" stroke="#f44336" stroke-width="2"/>
    <text x="122" y="57" text-anchor="middle" font-size="12" fill="white">1</text>
    <rect x="0" y="70" width="35" height="35" fill="#4caf50" rx="2" stroke="#333" stroke-width="1"/>
    <text x="17" y="92" text-anchor="middle" font-size="12" fill="white">7</text>
    <rect x="35" y="70" width="35" height="35" fill="#4caf50" rx="2" stroke="#333" stroke-width="1"/>
    <text x="52" y="92" text-anchor="middle" font-size="12" fill="white">8</text>
    <rect x="70" y="70" width="35" height="35" fill="#4caf50" rx="2" stroke="#333" stroke-width="1"/>
    <text x="87" y="92" text-anchor="middle" font-size="12" fill="white">9</text>
    <rect x="105" y="70" width="35" height="35" fill="#4caf50" rx="2" stroke="#333" stroke-width="1"/>
    <text x="122" y="92" text-anchor="middle" font-size="12" fill="white">3</text>
  </g>
  <text x="200" y="170" text-anchor="middle" font-size="11" fill="#f44336">빨간 테두리: 선택된 2×2 영역 (합=8)</text>
</svg>

## 입력

첫째 줄에 N, M, K, L이 공백으로 구분되어 주어진다. 다음 N줄에 M개의 정수가 공백으로 구분되어 주어진다.

- 1 ≤ K ≤ N ≤ 300
- 1 ≤ L ≤ M ≤ 300
- 1 ≤ 각 칸의 비용 ≤ 100

## 출력

비용 합이 최소인 K×L 직사각형 영역의 비용 합을 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4 2 2\n2 3 1 4\n5 6 2 1\n7 8 9 3", expectedOutput: "8", isVisible: true },
      { input: "2 2 1 1\n3 1\n4 2", expectedOutput: "1", isVisible: false },
      { input: "3 3 2 2\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "12", isVisible: false },
      { input: "4 4 2 3\n1 2 3 4\n5 6 7 8\n9 1 2 3\n4 5 6 7", expectedOutput: "14", isVisible: false },
    ],
    tags: ["DP", "구현"],
  },

  // 6. 다리 놓기
  {
    title: "다리 놓기",
    description: `강 서쪽에 N개의 도시, 동쪽에 M개의 도시가 있다. 서쪽 도시는 위에서 아래로 1번부터 N번, 동쪽 도시는 위에서 아래로 1번부터 M번까지 번호가 붙어 있다. 강을 가로지르는 다리를 놓으려 하는데, 다리끼리 교차하면 안 된다.

서쪽 i번 도시와 동쪽 j번 도시를 연결하는 다리를 놓을 계획이 C개 있을 때, 교차하지 않게 놓을 수 있는 다리의 최대 수를 구하시오.

<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="8"/>
  <rect x="30" y="20" width="8" height="160" fill="#4caf50" rx="2"/>
  <circle cx="34" cy="50" r="10" fill="#2196f3"/>
  <text x="34" y="55" text-anchor="middle" font-size="10" fill="white">1</text>
  <circle cx="34" cy="100" r="10" fill="#2196f3"/>
  <text x="34" y="105" text-anchor="middle" font-size="10" fill="white">2</text>
  <circle cx="34" cy="150" r="10" fill="#2196f3"/>
  <text x="34" y="155" text-anchor="middle" font-size="10" fill="white">3</text>
  <rect x="362" y="20" width="8" height="160" fill="#4caf50" rx="2"/>
  <circle cx="366" cy="60" r="10" fill="#ff9800"/>
  <text x="366" y="65" text-anchor="middle" font-size="10" fill="white">1</text>
  <circle cx="366" cy="110" r="10" fill="#ff9800"/>
  <text x="366" y="115" text-anchor="middle" font-size="10" fill="white">2</text>
  <circle cx="366" cy="155" r="10" fill="#ff9800"/>
  <text x="366" y="160" text-anchor="middle" font-size="10" fill="white">3</text>
  <line x1="44" y1="50" x2="356" y2="60" stroke="#4caf50" stroke-width="2"/>
  <line x1="44" y1="100" x2="356" y2="110" stroke="#4caf50" stroke-width="2"/>
  <line x1="44" y1="50" x2="356" y2="155" stroke="#f44336" stroke-width="1" stroke-dasharray="5,3"/>
  <text x="200" y="30" text-anchor="middle" font-size="11" fill="#333">강</text>
  <text x="200" y="185" text-anchor="middle" font-size="11" fill="#f44336">교차하는 다리는 제거</text>
</svg>

## 입력

첫째 줄에 서쪽 도시 수 N, 동쪽 도시 수 M, 다리 계획 수 C가 주어진다. 다음 C줄에 서쪽 도시 번호와 동쪽 도시 번호가 주어진다.

- 1 ≤ N, M ≤ 1,000
- 1 ≤ C ≤ 10,000

## 출력

교차하지 않게 놓을 수 있는 다리의 최대 수를 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 3 5\n1 2\n3 3\n2 3\n1 1\n2 1", expectedOutput: "2", isVisible: true },
      { input: "2 2 3\n1 1\n1 2\n2 1", expectedOutput: "2", isVisible: false },
      { input: "4 4 4\n1 4\n2 3\n3 2\n4 1", expectedOutput: "1", isVisible: false },
      { input: "3 4 6\n1 1\n2 2\n3 4\n1 3\n2 1\n3 3", expectedOutput: "3", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 7. 요리 대회
  {
    title: "요리 대회",
    description: `국제 요리 대회에 참가한 지수는 N개의 재료 중 정확히 K개를 골라 요리를 만들어야 한다. 각 재료에는 맛 점수가 있고, K개 재료의 맛 점수 합을 최대로 하고 싶다.

단, 함께 쓰면 맛이 충돌하는 재료 쌍 M개가 있다. 선택한 재료 중 충돌하는 쌍이 하나라도 있으면 요리를 완성할 수 없다. 요리를 완성할 수 있는 경우 중 맛 점수 합의 최댓값을 구하시오. 불가능하면 -1을 출력한다.

<svg width="400" height="180" viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="180" fill="#e3f2fd" rx="8"/>
  <text x="200" y="25" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">재료 선택</text>
  <circle cx="70" cy="80" r="28" fill="#4caf50"/>
  <text x="70" y="76" text-anchor="middle" font-size="11" fill="white">재료1</text>
  <text x="70" y="92" text-anchor="middle" font-size="11" fill="white">맛:9</text>
  <circle cx="160" cy="80" r="28" fill="#2196f3"/>
  <text x="160" y="76" text-anchor="middle" font-size="11" fill="white">재료2</text>
  <text x="160" y="92" text-anchor="middle" font-size="11" fill="white">맛:7</text>
  <circle cx="250" cy="80" r="28" fill="#ff9800"/>
  <text x="250" y="76" text-anchor="middle" font-size="11" fill="white">재료3</text>
  <text x="250" y="92" text-anchor="middle" font-size="11" fill="white">맛:5</text>
  <circle cx="340" cy="80" r="28" fill="#f44336"/>
  <text x="340" y="76" text-anchor="middle" font-size="11" fill="white">재료4</text>
  <text x="340" y="92" text-anchor="middle" font-size="11" fill="white">맛:3</text>
  <line x1="98" y1="80" x2="132" y2="80" stroke="#f44336" stroke-width="2.5" stroke-dasharray="4,2"/>
  <text x="115" y="70" text-anchor="middle" font-size="10" fill="#f44336">충돌!</text>
  <line x1="278" y1="80" x2="312" y2="80" stroke="#f44336" stroke-width="2.5" stroke-dasharray="4,2"/>
  <text x="295" y="70" text-anchor="middle" font-size="10" fill="#f44336">충돌!</text>
  <text x="200" y="155" text-anchor="middle" font-size="11" fill="#333">K=2 선택 시: 재료1+재료3 = 14</text>
</svg>

## 입력

첫째 줄에 재료 수 N과 선택할 재료 수 K, 충돌 쌍 수 M이 주어진다. 둘째 줄에 N개의 맛 점수가 주어진다. 다음 M줄에 충돌 쌍 (a, b)가 주어진다.

- 1 ≤ K ≤ N ≤ 15
- 0 ≤ M ≤ 30
- 1 ≤ 맛 점수 ≤ 100

## 출력

조건을 만족하는 K개 선택의 맛 점수 합 최댓값을 출력한다. 불가능하면 \`-1\`을 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 2 2\n9 7 5 3\n1 2\n3 4", expectedOutput: "14", isVisible: true },
      { input: "3 3 1\n5 4 3\n1 2", expectedOutput: "-1", isVisible: false },
      { input: "4 2 0\n10 8 6 4", expectedOutput: "18", isVisible: false },
      { input: "5 3 3\n10 9 8 7 6\n1 2\n1 3\n2 3", expectedOutput: "23", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  // 8. 수상한 미술관
  {
    title: "수상한 미술관",
    description: `유명한 미술관이 트리 구조로 연결된 N개의 방으로 이루어져 있다. 도둑 상진이는 보물이 있는 방 T에 도달하려고 한다. 미술관에는 경비원이 일부 방을 지키고 있다.

상진이는 1번 방(입구)에서 출발하여 경비원이 있는 방을 지나지 않고 T번 방에 도달할 수 있는지 구하시오. 경비원이 있는 방에는 절대 들어갈 수 없다.

<svg width="400" height="190" viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="8"/>
  <circle cx="200" cy="35" r="22" fill="#4caf50"/>
  <text x="200" y="40" text-anchor="middle" font-size="12" fill="white" font-weight="bold">1(입구)</text>
  <line x1="178" y1="54" x2="120" y2="88" stroke="#333" stroke-width="1.5"/>
  <line x1="222" y1="54" x2="280" y2="88" stroke="#333" stroke-width="1.5"/>
  <circle cx="110" cy="100" r="20" fill="#2196f3"/>
  <text x="110" y="105" text-anchor="middle" font-size="12" fill="white">2</text>
  <circle cx="290" cy="100" r="20" fill="#f44336"/>
  <text x="290" y="100" text-anchor="middle" font-size="10" fill="white">3(경비)</text>
  <line x1="100" y1="119" x2="80" y2="150" stroke="#333" stroke-width="1.5"/>
  <line x1="120" y1="119" x2="150" y2="150" stroke="#333" stroke-width="1.5"/>
  <circle cx="70" cy="163" r="20" fill="#ff9800"/>
  <text x="70" y="168" text-anchor="middle" font-size="12" fill="white">4</text>
  <circle cx="155" cy="163" r="20" fill="#2196f3"/>
  <text x="155" y="163" text-anchor="middle" font-size="10" fill="white">5(보물)</text>
  <text x="310" y="170" text-anchor="middle" font-size="11" fill="#4caf50">1→2→5: 도달 가능</text>
</svg>

## 입력

첫째 줄에 방의 수 N과 보물방 번호 T, 경비원의 수 G가 주어진다. 다음 줄에 G개의 경비원이 지키는 방 번호가 주어진다. 다음 N-1줄에 트리의 간선 (u, v)가 주어진다.

- 1 ≤ N ≤ 100,000
- 1번 방과 T번 방에는 경비원이 없다.
- 경비원의 방 번호는 서로 다르다.

## 출력

도달 가능하면 \`YES\`, 불가능하면 \`NO\`를 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 5 1\n3\n1 2\n1 3\n2 4\n2 5", expectedOutput: "YES", isVisible: true },
      { input: "5 4 1\n2\n1 2\n2 3\n3 4\n3 5", expectedOutput: "NO", isVisible: false },
      { input: "3 3 0\n\n1 2\n1 3", expectedOutput: "YES", isVisible: false },
      { input: "6 6 2\n2 4\n1 2\n1 3\n3 4\n3 5\n5 6", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["트리", "DFS"],
  },

  // 9. 주차장 관리
  {
    title: "주차장 관리",
    description: `주차장에는 1번부터 N번까지 번호가 붙은 N개의 주차 칸이 있다. 차량이 도착하면 빈 칸 중 번호가 가장 작은 칸에 주차한다. 차량이 출발하면 해당 칸이 비워진다.

Q개의 이벤트가 순서대로 주어질 때, 각 차량이 주차되는 칸 번호를 출력하시오.

<svg width="400" height="160" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="160" fill="#e3f2fd" rx="8"/>
  <text x="200" y="25" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">주차장 (N=5칸)</text>
  <rect x="30" y="40" width="60" height="60" fill="#4caf50" rx="4"/>
  <text x="60" y="68" text-anchor="middle" font-size="11" fill="white">1번칸</text>
  <text x="60" y="85" text-anchor="middle" font-size="10" fill="white">비어있음</text>
  <rect x="100" y="40" width="60" height="60" fill="#ff9800" rx="4"/>
  <text x="130" y="68" text-anchor="middle" font-size="11" fill="white">2번칸</text>
  <text x="130" y="85" text-anchor="middle" font-size="10" fill="white">A차</text>
  <rect x="170" y="40" width="60" height="60" fill="#ff9800" rx="4"/>
  <text x="200" y="68" text-anchor="middle" font-size="11" fill="white">3번칸</text>
  <text x="200" y="85" text-anchor="middle" font-size="10" fill="white">B차</text>
  <rect x="240" y="40" width="60" height="60" fill="#4caf50" rx="4"/>
  <text x="270" y="68" text-anchor="middle" font-size="11" fill="white">4번칸</text>
  <text x="270" y="85" text-anchor="middle" font-size="10" fill="white">비어있음</text>
  <rect x="310" y="40" width="60" height="60" fill="#4caf50" rx="4"/>
  <text x="340" y="68" text-anchor="middle" font-size="11" fill="white">5번칸</text>
  <text x="340" y="85" text-anchor="middle" font-size="10" fill="white">비어있음</text>
  <text x="200" y="135" text-anchor="middle" font-size="11" fill="#2196f3">새 차 도착 → 1번칸(최소 번호) 배정</text>
</svg>

## 입력

첫째 줄에 주차 칸 수 N과 이벤트 수 Q가 주어진다. 다음 Q줄에 이벤트가 주어진다. 이벤트는 \`park 차량번호\` (주차) 또는 \`leave 차량번호\` (출발) 형식이다.

- 1 ≤ N ≤ 100,000
- 1 ≤ Q ≤ 200,000
- 차량 번호는 양의 정수이다.
- 같은 차량이 중복 주차되거나, 없는 차량이 출발하는 경우는 없다.

## 출력

\`park\` 이벤트가 발생할 때마다 배정된 주차 칸 번호를 한 줄씩 출력한다. 빈 칸이 없으면 \`0\`을 출력한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 5\npark 1\npark 2\nleave 1\npark 3\npark 4", expectedOutput: "1\n2\n1\n0", isVisible: true },
      { input: "2 4\npark 10\npark 20\nleave 10\npark 30", expectedOutput: "1\n2\n1", isVisible: false },
      { input: "1 3\npark 5\npark 6\nleave 5", expectedOutput: "1\n0", isVisible: false },
      { input: "5 6\npark 1\npark 2\npark 3\nleave 2\npark 4\npark 5", expectedOutput: "1\n2\n3\n2\n4", isVisible: false },
    ],
    tags: ["구현", "우선순위 큐"],
  },

  // 10. 시간 여행
  {
    title: "시간 여행",
    description: `미래 세계에는 N개의 도시와 M개의 도로, K개의 웜홀이 있다. 도로는 양방향이고 양수 가중치(이동 시간)를 가진다. 웜홀은 단방향이고 음수 가중치(시간 역행)를 가진다.

현재 1번 도시에 있다. 어떤 경로를 따라 이동하면 출발 시점보다 과거로 돌아올 수 있는지 판별하시오. 즉, 음수 사이클이 존재하는지 확인하시오.

<svg width="400" height="190" viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="8"/>
  <circle cx="80" cy="80" r="25" fill="#2196f3"/>
  <text x="80" y="85" text-anchor="middle" font-size="12" fill="white">도시1</text>
  <circle cx="200" cy="50" r="25" fill="#2196f3"/>
  <text x="200" y="55" text-anchor="middle" font-size="12" fill="white">도시2</text>
  <circle cx="320" cy="80" r="25" fill="#2196f3"/>
  <text x="320" y="85" text-anchor="middle" font-size="12" fill="white">도시3</text>
  <circle cx="200" cy="150" r="25" fill="#2196f3"/>
  <text x="200" y="155" text-anchor="middle" font-size="12" fill="white">도시4</text>
  <line x1="105" y1="68" x2="175" y2="58" stroke="#333" stroke-width="1.5"/>
  <text x="135" y="55" text-anchor="middle" font-size="10" fill="#333">+3</text>
  <line x1="225" y1="62" x2="295" y2="72" stroke="#333" stroke-width="1.5"/>
  <text x="265" y="58" text-anchor="middle" font-size="10" fill="#333">+5</text>
  <line x1="105" y1="93" x2="175" y2="137" stroke="#333" stroke-width="1.5"/>
  <text x="130" y="125" text-anchor="middle" font-size="10" fill="#333">+2</text>
  <line x1="225" y1="137" x2="295" y2="93" stroke="#333" stroke-width="1.5"/>
  <text x="270" y="125" text-anchor="middle" font-size="10" fill="#333">+1</text>
  <path d="M 225 150 Q 360 170 335 100" stroke="#f44336" stroke-width="2" fill="none" marker-end="url(#arr)"/>
  <text x="360" y="140" text-anchor="middle" font-size="10" fill="#f44336">웜홀</text>
  <text x="370" y="155" text-anchor="middle" font-size="10" fill="#f44336">-8</text>
</svg>

## 입력

첫째 줄에 테스트 케이스 수 TC가 주어진다. 각 테스트 케이스의 첫째 줄에 도시 수 N, 도로 수 M, 웜홀 수 K가 주어진다. 다음 M줄에 도로 정보 (S E W), 다음 K줄에 웜홀 정보 (S E W)가 주어진다.

- 1 ≤ N ≤ 500
- 1 ≤ M ≤ 2,500
- 1 ≤ K ≤ 300
- 1 ≤ W (도로) ≤ 10,000
- 1 ≤ W (웜홀) ≤ 10,000 (음수 가중치는 입력 시 양수로 주어지며 실제로 빼야 함)

## 출력

음수 사이클이 존재하면 \`YES\`, 없으면 \`NO\`를 출력한다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n3 3 1\n1 2 2\n1 3 4\n2 3 1\n3 1 3\n3 3 2\n1 2 3\n2 3 4\n1 3 8\n3 1 4\n2 3 2", expectedOutput: "NO\nYES", isVisible: true },
      { input: "1\n4 4 1\n1 2 4\n2 3 3\n3 4 1\n4 1 2\n4 1 10", expectedOutput: "NO", isVisible: false },
      { input: "1\n2 1 1\n1 2 5\n2 1 3", expectedOutput: "YES", isVisible: false },
      { input: "1\n1 0 1\n1 1 1", expectedOutput: "YES", isVisible: false },
    ],
    tags: ["그래프", "벨만-포드"],
  },

  // 11. 보석 도둑
  {
    title: "보석 도둑",
    description: `보석 박물관에 잠입한 도둑 지훈이는 N개의 보석을 훔치려 한다. 각 보석에는 무게와 가치가 있다. 지훈이는 K개의 가방을 가지고 있으며, 각 가방에는 최대 용량이 있다.

각 가방에는 보석을 하나만 넣을 수 있다. 훔칠 수 있는 보석의 가치 합을 최대화하시오.

<svg width="400" height="175" viewBox="0 0 400 175" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="175" fill="#e3f2fd" rx="8"/>
  <text x="100" y="25" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">보석</text>
  <text x="300" y="25" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">가방</text>
  <polygon points="70,60 85,40 100,60 95,80 75,80" fill="#2196f3"/>
  <text x="85" y="100" text-anchor="middle" font-size="10" fill="#333">무게5 가치3</text>
  <polygon points="150,60 165,40 180,60 175,80 155,80" fill="#ff9800"/>
  <text x="165" y="100" text-anchor="middle" font-size="10" fill="#333">무게3 가치1</text>
  <polygon points="30,135 50,110 70,135 65,155 35,155" fill="#f44336"/>
  <text x="50" y="165" text-anchor="middle" font-size="10" fill="#333">무게2 가치4</text>
  <ellipse cx="260" cy="70" rx="25" ry="35" fill="none" stroke="#4caf50" stroke-width="2"/>
  <text x="260" y="55" text-anchor="middle" font-size="10" fill="#4caf50">용량5</text>
  <ellipse cx="340" cy="70" rx="25" ry="35" fill="none" stroke="#4caf50" stroke-width="2"/>
  <text x="340" y="55" text-anchor="middle" font-size="10" fill="#4caf50">용량2</text>
  <line x1="100" y1="70" x2="235" y2="70" stroke="#2196f3" stroke-dasharray="4,3" stroke-width="1.5"/>
  <line x1="65" y1="135" x2="315" y2="80" stroke="#f44336" stroke-dasharray="4,3" stroke-width="1.5"/>
</svg>

## 입력

첫째 줄에 보석의 수 N과 가방의 수 K가 주어진다. 다음 N줄에 각 보석의 무게와 가치가 주어진다. 다음 K줄에 각 가방의 최대 용량이 주어진다.

- 1 ≤ N, K ≤ 300,000
- 0 ≤ 무게, 가치 ≤ 1,000,000
- 1 ≤ 용량 ≤ 1,000,000

## 출력

훔칠 수 있는 보석 가치 합의 최댓값을 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 2\n5 3\n3 1\n2 4\n5\n2", expectedOutput: "7", isVisible: true },
      { input: "2 1\n1 10\n5 5\n3", expectedOutput: "5", isVisible: false },
      { input: "4 3\n1 2\n2 4\n3 6\n4 8\n1\n2\n3", expectedOutput: "18", isVisible: false },
      { input: "2 2\n10 5\n5 3\n4\n4", expectedOutput: "6", isVisible: false },
    ],
    tags: ["그리디", "정렬"],
  },

  // 12. 미로의 함정
  {
    title: "미로의 함정",
    description: `N×M 크기의 미로가 있다. 미로에는 빈 칸(.), 벽(#), 함정(T)이 있다. 함정을 밟으면 3턴 동안 움직이지 못한다(현재 턴 포함). 시작(S)에서 출구(E)까지 이동하는 데 걸리는 최소 시간을 구하시오.

각 턴마다 상하좌우 중 하나로 이동할 수 있으며, 벽은 통과할 수 없다. 함정은 여러 번 밟을 수 있다.

<svg width="400" height="190" viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="8"/>
  <text x="200" y="22" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">미로 예시</text>
  <g transform="translate(90, 30)">
    <rect x="0" y="0" width="40" height="40" fill="#4caf50" rx="2" stroke="#333"/>
    <text x="20" y="25" text-anchor="middle" font-size="14" fill="white" font-weight="bold">S</text>
    <rect x="40" y="0" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="80" y="0" width="40" height="40" fill="#333" rx="2" stroke="#333"/>
    <rect x="120" y="0" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="0" y="40" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="40" y="40" width="40" height="40" fill="#f44336" rx="2" stroke="#333"/>
    <text x="60" y="65" text-anchor="middle" font-size="14" fill="white" font-weight="bold">T</text>
    <rect x="80" y="40" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="120" y="40" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="0" y="80" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="40" y="80" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="80" y="80" width="40" height="40" fill="#333" rx="2" stroke="#333"/>
    <rect x="120" y="80" width="40" height="40" fill="#2196f3" rx="2" stroke="#333"/>
    <text x="140" y="105" text-anchor="middle" font-size="14" fill="white" font-weight="bold">E</text>
  </g>
  <text x="200" y="170" text-anchor="middle" font-size="11" fill="#f44336">T 밟으면 3턴 정지</text>
</svg>

## 입력

첫째 줄에 N, M이 주어진다. 다음 N줄에 미로 정보가 주어진다.

- 1 ≤ N, M ≤ 50
- S, E는 각각 정확히 하나씩 존재
- 항상 도달 가능함이 보장됨

## 출력

S에서 E까지 이동하는 데 걸리는 최소 시간(턴 수)을 출력한다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4\nS...\n.T..\n...E", expectedOutput: "7", isVisible: true },
      { input: "2 2\nSE\n..", expectedOutput: "1", isVisible: false },
      { input: "3 3\nS..\n...\n..E", expectedOutput: "4", isVisible: false },
      { input: "2 5\nS.T.E\n.....", expectedOutput: "6", isVisible: false },
    ],
    tags: ["BFS"],
  },

  // 13. 놀이터 시소
  {
    title: "놀이터 시소",
    description: `놀이터에 N명의 아이들이 있다. 각 아이의 몸무게가 주어진다. 아이들을 시소 양쪽으로 나누어 앉힐 때, 양쪽 토크(무게 × 시소 중심으로부터 거리)의 차이를 최소화하려 한다.

시소 양쪽은 길이가 같아 거리는 동일하므로, 실제로는 양쪽 몸무게 합의 차이를 최소화하면 된다. 아이를 모두 시소에 태워야 하며, 각 쪽에 최소 1명씩 있어야 한다. 차이의 최솟값을 구하시오.

<svg width="400" height="170" viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="170" fill="#e3f2fd" rx="8"/>
  <line x1="60" y1="100" x2="340" y2="100" stroke="#333" stroke-width="5" stroke-linecap="round"/>
  <polygon points="200,100 190,130 210,130" fill="#333"/>
  <circle cx="90" cy="85" r="18" fill="#2196f3"/>
  <text x="90" y="90" text-anchor="middle" font-size="11" fill="white">30kg</text>
  <circle cx="130" cy="85" r="18" fill="#2196f3"/>
  <text x="130" y="90" text-anchor="middle" font-size="11" fill="white">20kg</text>
  <circle cx="300" cy="85" r="18" fill="#ff9800"/>
  <text x="300" y="90" text-anchor="middle" font-size="11" fill="white">25kg</text>
  <text x="110" y="150" text-anchor="middle" font-size="11" fill="#2196f3">왼쪽: 50kg</text>
  <text x="300" y="150" text-anchor="middle" font-size="11" fill="#ff9800">오른쪽: 25kg</text>
  <text x="200" y="165" text-anchor="middle" font-size="11" fill="#f44336">차이: 25 (최소화 목표)</text>
</svg>

## 입력

첫째 줄에 아이 수 N이 주어진다. 둘째 줄에 N개의 몸무게가 주어진다.

- 2 ≤ N ≤ 20
- 1 ≤ 몸무게 ≤ 100

## 출력

시소 양쪽 몸무게 합 차이의 최솟값을 출력한다.`,
    difficulty: 6.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n30 20 25", expectedOutput: "15", isVisible: true },
      { input: "4\n1 2 3 4", expectedOutput: "0", isVisible: false },
      { input: "2\n10 15", expectedOutput: "5", isVisible: false },
      { input: "5\n3 1 4 1 5", expectedOutput: "0", isVisible: false },
    ],
    tags: ["DP", "백트래킹"],
  },

  // 14. 꽃집 배치
  {
    title: "꽃집 배치",
    description: `꽃집에 N개의 화분이 있고, M칸짜리 선반이 있다. 각 화분에는 매력도가 있다. 화분은 원래 순서를 유지하면서 선반에 일부를 배치할 수 있다. 선반에 배치된 화분 사이에는 빈칸이 없어야 한다(연속 배치).

선반에 배치된 화분들의 매력도 합이 최대가 되도록 화분을 선택할 때, 그 최댓값을 구하시오. 단, 배치할 화분 수는 M칸을 초과할 수 없으며, 화분을 하나도 놓지 않는 것도 가능하다(이 경우 0).

<svg width="400" height="165" viewBox="0 0 400 165" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="165" fill="#e3f2fd" rx="8"/>
  <text x="200" y="22" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">화분 5개, 선반 3칸</text>
  <g transform="translate(20, 35)">
    <rect x="0" y="0" width="50" height="50" fill="#ff9800" rx="4" stroke="#333"/>
    <text x="25" y="30" text-anchor="middle" font-size="14" fill="white">🌸</text>
    <text x="25" y="62" text-anchor="middle" font-size="11" fill="#333">매력:4</text>
    <rect x="60" y="0" width="50" height="50" fill="#4caf50" rx="4" stroke="#333"/>
    <text x="85" y="30" text-anchor="middle" font-size="14" fill="white">🌼</text>
    <text x="85" y="62" text-anchor="middle" font-size="11" fill="#333">매력:7</text>
    <rect x="120" y="0" width="50" height="50" fill="#2196f3" rx="4" stroke="#f44336" stroke-width="2.5"/>
    <text x="145" y="30" text-anchor="middle" font-size="14" fill="white">🌺</text>
    <text x="145" y="62" text-anchor="middle" font-size="11" fill="#333">매력:9</text>
    <rect x="180" y="0" width="50" height="50" fill="#2196f3" rx="4" stroke="#f44336" stroke-width="2.5"/>
    <text x="205" y="30" text-anchor="middle" font-size="14" fill="white">🌷</text>
    <text x="205" y="62" text-anchor="middle" font-size="11" fill="#333">매력:6</text>
    <rect x="240" y="0" width="50" height="50" fill="#2196f3" rx="4" stroke="#f44336" stroke-width="2.5"/>
    <text x="265" y="30" text-anchor="middle" font-size="14" fill="white">🌻</text>
    <text x="265" y="62" text-anchor="middle" font-size="11" fill="#333">매력:3</text>
  </g>
  <text x="200" y="125" text-anchor="middle" font-size="11" fill="#f44336">선택(빨간 테두리): 9+6+3=18</text>
  <text x="200" y="148" text-anchor="middle" font-size="11" fill="#2196f3">연속 3개 = 최댓값</text>
</svg>

## 입력

첫째 줄에 화분 수 N과 선반 칸 수 M이 주어진다. 둘째 줄에 N개의 매력도가 주어진다.

- 1 ≤ M ≤ N ≤ 100,000
- 1 ≤ 매력도 ≤ 1,000

## 출력

배치할 수 있는 매력도 합의 최댓값을 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3\n4 7 9 6 3", expectedOutput: "22", isVisible: true },
      { input: "4 2\n1 5 3 2", expectedOutput: "8", isVisible: false },
      { input: "3 3\n2 4 6", expectedOutput: "12", isVisible: false },
      { input: "6 2\n1 2 3 4 5 6", expectedOutput: "11", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 15. 정전 복구
  {
    title: "정전 복구",
    description: `폭풍으로 도시의 전력망이 파손되었다. 도시는 N개의 지역으로 구성되어 있으며, 지역 1에는 발전소가 있다. 각 지역 사이에는 전선을 설치할 수 있고, 설치 비용이 다르다.

모든 지역에 전기를 공급하기 위해 최소 비용으로 전선을 설치하시오.

<svg width="400" height="190" viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="8"/>
  <circle cx="200" cy="40" r="22" fill="#ff9800"/>
  <text x="200" y="45" text-anchor="middle" font-size="11" fill="white">발전소(1)</text>
  <circle cx="80" cy="120" r="20" fill="#2196f3"/>
  <text x="80" y="125" text-anchor="middle" font-size="11" fill="white">2</text>
  <circle cx="200" cy="150" r="20" fill="#2196f3"/>
  <text x="200" y="155" text-anchor="middle" font-size="11" fill="white">3</text>
  <circle cx="320" cy="120" r="20" fill="#2196f3"/>
  <text x="320" y="125" text-anchor="middle" font-size="11" fill="white">4</text>
  <line x1="178" y1="55" x2="100" y2="102" stroke="#4caf50" stroke-width="2.5"/>
  <text x="125" y="72" text-anchor="middle" font-size="11" fill="#4caf50" font-weight="bold">4</text>
  <line x1="200" y1="62" x2="200" y2="130" stroke="#4caf50" stroke-width="2.5"/>
  <text x="215" y="100" text-anchor="middle" font-size="11" fill="#4caf50" font-weight="bold">3</text>
  <line x1="222" y1="55" x2="300" y2="102" stroke="#4caf50" stroke-width="2.5"/>
  <text x="275" y="72" text-anchor="middle" font-size="11" fill="#4caf50" font-weight="bold">5</text>
  <line x1="100" y1="120" x2="180" y2="145" stroke="#e3f2fd" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="130" y="140" text-anchor="middle" font-size="10" fill="#999">7</text>
  <line x1="220" y1="145" x2="300" y2="120" stroke="#e3f2fd" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="270" y="140" text-anchor="middle" font-size="10" fill="#999">6</text>
  <text x="200" y="180" text-anchor="middle" font-size="11" fill="#f44336">최소 신장 트리 = 4+3+5 = 12</text>
</svg>

## 입력

첫째 줄에 지역 수 N과 전선 수 M이 주어진다. 다음 M줄에 전선 정보 (A B C) — A지역과 B지역을 연결하는 비용 C가 주어진다.

- 2 ≤ N ≤ 1,000
- 1 ≤ M ≤ 100,000
- 1 ≤ C ≤ 10,000
- 연결 그래프가 보장된다.

## 출력

모든 지역에 전기를 공급하기 위한 최소 전선 설치 비용을 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 5\n1 2 4\n1 3 3\n1 4 5\n2 3 7\n3 4 6", expectedOutput: "12", isVisible: true },
      { input: "3 3\n1 2 1\n2 3 2\n1 3 5", expectedOutput: "3", isVisible: false },
      { input: "2 1\n1 2 10", expectedOutput: "10", isVisible: false },
      { input: "5 7\n1 2 3\n1 3 8\n2 4 5\n3 4 2\n3 5 4\n4 5 6\n2 5 9", expectedOutput: "14", isVisible: false },
    ],
    tags: ["그래프", "MST"],
  },

  // 16. 버스 노선
  {
    title: "버스 노선",
    description: `원형 버스 노선에 N개의 정류장이 번호 순서대로 배치되어 있다(1번 → 2번 → ... → N번 → 1번 순환). Q개의 승객이 특정 정류장에서 탑승하고 특정 정류장에서 하차한다. 버스에 동시에 탑승하는 승객 수의 최댓값을 구하고, 그 값 이상을 수용할 수 있는 최소 버스 용량을 구하시오.

<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#e3f2fd" rx="8"/>
  <circle cx="200" cy="100" r="70" fill="none" stroke="#333" stroke-width="2"/>
  <circle cx="200" cy="30" r="15" fill="#2196f3"/>
  <text x="200" y="35" text-anchor="middle" font-size="11" fill="white">1</text>
  <circle cx="270" cy="55" r="15" fill="#2196f3"/>
  <text x="270" y="60" text-anchor="middle" font-size="11" fill="white">2</text>
  <circle cx="270" cy="145" r="15" fill="#2196f3"/>
  <text x="270" y="150" text-anchor="middle" font-size="11" fill="white">3</text>
  <circle cx="200" cy="170" r="15" fill="#2196f3"/>
  <text x="200" y="175" text-anchor="middle" font-size="11" fill="white">4</text>
  <circle cx="130" cy="145" r="15" fill="#2196f3"/>
  <text x="130" y="150" text-anchor="middle" font-size="11" fill="white">5</text>
  <circle cx="130" cy="55" r="15" fill="#2196f3"/>
  <text x="130" y="60" text-anchor="middle" font-size="11" fill="white">6</text>
  <text x="200" y="102" text-anchor="middle" font-size="12" fill="#ff9800" font-weight="bold">버스</text>
  <text x="200" y="118" text-anchor="middle" font-size="11" fill="#333">→ 방향</text>
</svg>

## 입력

첫째 줄에 정류장 수 N과 승객 수 Q가 주어진다. 다음 Q줄에 각 승객의 탑승 정류장 S와 하차 정류장 E가 주어진다. (S ≠ E, 버스는 S에서 탑승하여 순방향으로 이동해 E에 하차)

- 2 ≤ N ≤ 1,000
- 1 ≤ Q ≤ 100,000
- 1 ≤ S, E ≤ N

## 출력

필요한 최소 버스 용량을 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 3\n1 3\n2 4\n3 5", expectedOutput: "2", isVisible: true },
      { input: "4 4\n1 3\n1 3\n2 4\n3 1", expectedOutput: "2", isVisible: false },
      { input: "3 3\n1 2\n2 3\n3 1", expectedOutput: "1", isVisible: false },
      { input: "6 4\n1 4\n2 5\n3 6\n4 2", expectedOutput: "2", isVisible: false },
    ],
    tags: ["시뮬레이션", "구현"],
  },

  // 17. 외계 신호 해독
  {
    title: "외계 신호 해독",
    description: `우주 탐사대가 외계 문명의 신호를 수신했다. 신호는 0과 1로 이루어진 긴 문자열 S이고, 특정 패턴 P가 신호 안에 몇 번 나타나는지 파악해야 한다. 패턴은 겹쳐서 등장할 수도 있다.

<svg width="400" height="165" viewBox="0 0 400 165" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="165" fill="#e3f2fd" rx="8"/>
  <text x="200" y="25" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">신호 스트림</text>
  <rect x="20" y="40" width="360" height="35" fill="#333" rx="4"/>
  <text x="30" y="63" font-size="14" fill="#4caf50" font-family="monospace">0 0 1 0 1 0 1 1 0 0 1 0 1</text>
  <rect x="63" y="90" width="105" height="30" fill="#ff9800" rx="3" opacity="0.7"/>
  <text x="115" y="110" text-anchor="middle" font-size="13" fill="white" font-family="monospace">0 1 0 1</text>
  <rect x="111" y="90" width="105" height="30" fill="#f44336" rx="3" opacity="0.7"/>
  <text x="163" y="110" text-anchor="middle" font-size="13" fill="white" font-family="monospace">0 1 0 1</text>
  <text x="20" y="140" font-size="11" fill="#333">패턴 "0101" → 2번 등장 (겹침 허용)</text>
  <text x="200" y="158" text-anchor="middle" font-size="11" fill="#2196f3">KMP 알고리즘</text>
</svg>

## 입력

첫째 줄에 신호 문자열 S가 주어진다. 둘째 줄에 패턴 문자열 P가 주어진다.

- 1 ≤ |P| ≤ |S| ≤ 1,000,000
- S와 P는 0과 1로만 이루어진다.

## 출력

S에서 P가 등장하는 횟수를 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "00101011001\n0101", expectedOutput: "2", isVisible: true },
      { input: "10101010\n101", expectedOutput: "3", isVisible: false },
      { input: "0000\n00", expectedOutput: "3", isVisible: false },
      { input: "1\n1", expectedOutput: "1", isVisible: false },
    ],
    tags: ["문자열", "KMP"],
  },

  // 18. 산타의 선물 배달
  {
    title: "산타의 선물 배달",
    description: `크리스마스 이브, 산타 할아버지는 루트(1번)에서 출발하여 트리 구조로 연결된 N개의 집을 모두 방문하고 다시 루트로 돌아와야 한다. 각 간선의 길이가 주어질 때, 산타가 이동해야 하는 최소 거리를 구하시오.

트리이므로 모든 간선을 정확히 두 번(왕복) 방문하는 것이 최적이다.

<svg width="400" height="190" viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="8"/>
  <circle cx="200" cy="30" r="22" fill="#ff9800"/>
  <text x="200" y="35" text-anchor="middle" font-size="11" fill="white">산타출발(1)</text>
  <line x1="178" y1="48" x2="110" y2="88" stroke="#333" stroke-width="1.5"/>
  <text x="133" y="72" text-anchor="middle" font-size="11" fill="#2196f3">3</text>
  <line x1="200" y1="52" x2="200" y2="90" stroke="#333" stroke-width="1.5"/>
  <text x="212" y="75" text-anchor="middle" font-size="11" fill="#2196f3">2</text>
  <line x1="222" y1="48" x2="290" y2="88" stroke="#333" stroke-width="1.5"/>
  <text x="267" y="72" text-anchor="middle" font-size="11" fill="#2196f3">5</text>
  <circle cx="100" cy="100" r="20" fill="#2196f3"/>
  <text x="100" y="105" text-anchor="middle" font-size="12" fill="white">2</text>
  <circle cx="200" cy="102" r="20" fill="#2196f3"/>
  <text x="200" y="107" text-anchor="middle" font-size="12" fill="white">3</text>
  <circle cx="300" cy="100" r="20" fill="#2196f3"/>
  <text x="300" y="105" text-anchor="middle" font-size="12" fill="white">4</text>
  <line x1="100" y1="120" x2="80" y2="155" stroke="#333" stroke-width="1.5"/>
  <text x="81" y="142" text-anchor="middle" font-size="11" fill="#2196f3">1</text>
  <circle cx="70" cy="165" r="18" fill="#4caf50"/>
  <text x="70" y="170" text-anchor="middle" font-size="11" fill="white">5</text>
  <text x="300" y="175" text-anchor="middle" font-size="11" fill="#f44336">총 거리: (3+2+5+1)×2 = 22</text>
</svg>

## 입력

첫째 줄에 집의 수 N이 주어진다. 다음 N-1줄에 간선 정보 (U V W) — U와 V를 잇는 길이 W의 간선이 주어진다.

- 2 ≤ N ≤ 100,000
- 1 ≤ W ≤ 100,000

## 출력

산타가 이동해야 하는 최소 총 거리를 출력한다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n1 2 3\n1 3 2\n1 4 5\n2 5 1", expectedOutput: "22", isVisible: true },
      { input: "2\n1 2 10", expectedOutput: "20", isVisible: false },
      { input: "4\n1 2 1\n2 3 2\n3 4 3", expectedOutput: "12", isVisible: false },
      { input: "6\n1 2 4\n1 3 3\n2 4 2\n2 5 5\n3 6 1", expectedOutput: "30", isVisible: false },
    ],
    tags: ["트리", "DFS"],
  },

  // 19. 자동판매기
  {
    title: "자동판매기",
    description: `자동판매기에서 음료를 사려는 승현이는 거스름돈을 최소한의 동전으로 받고 싶다. N종류의 동전이 있고 각 동전은 무한히 사용할 수 있다. 음료 가격이 P원일 때, 승현이가 낸 금액은 항상 P원 이상이다. 거스름돈을 최소 동전 수로 줄 수 있는 방법을 구하시오.

단, 거스름돈은 (낸 금액 - P)원이다.

<svg width="400" height="175" viewBox="0 0 400 175" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="175" fill="#e3f2fd" rx="8"/>
  <rect x="30" y="25" width="100" height="130" fill="#333" rx="6"/>
  <rect x="40" y="35" width="80" height="60" fill="#555" rx="3"/>
  <text x="80" y="58" text-anchor="middle" font-size="11" fill="#4caf50">음료</text>
  <text x="80" y="75" text-anchor="middle" font-size="10" fill="#ff9800">P = 120원</text>
  <rect x="40" y="110" width="80" height="30" fill="#2196f3" rx="3"/>
  <text x="80" y="130" text-anchor="middle" font-size="11" fill="white">투입: 500원</text>
  <text x="80" y="165" text-anchor="middle" font-size="10" fill="#333">잔돈: 380원</text>
  <circle cx="210" cy="70" r="25" fill="#ff9800" stroke="#333"/>
  <text x="210" y="75" text-anchor="middle" font-size="13" fill="white">100</text>
  <circle cx="270" cy="70" r="20" fill="#ff9800" stroke="#333"/>
  <text x="270" y="75" text-anchor="middle" font-size="12" fill="white">50</text>
  <circle cx="320" cy="70" r="15" fill="#ff9800" stroke="#333"/>
  <text x="320" y="75" text-anchor="middle" font-size="11" fill="white">10</text>
  <text x="260" y="130" text-anchor="middle" font-size="11" fill="#333">380 = 100×3 + 50×1 + 10×3</text>
  <text x="260" y="150" text-anchor="middle" font-size="11" fill="#f44336">최소: 7개</text>
</svg>

## 입력

첫째 줄에 동전 종류 수 N과 음료 가격 P가 주어진다. 둘째 줄에 N개의 동전 금액이 주어진다. 셋째 줄에 승현이가 낸 금액 A가 주어진다.

- 1 ≤ N ≤ 10
- 1 ≤ P ≤ A ≤ 100,000
- 1 ≤ 동전 금액 ≤ 10,000
- 1원 동전이 반드시 포함된다.

## 출력

거스름돈을 줄 수 있는 최소 동전 수를 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 120\n1 50 100\n500", expectedOutput: "7", isVisible: true },
      { input: "2 1\n1 5\n11", expectedOutput: "2", isVisible: false },
      { input: "1 100\n1\n101", expectedOutput: "1", isVisible: false },
      { input: "4 270\n1 10 50 100\n1000", expectedOutput: "8", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 20. 댐 건설
  {
    title: "댐 건설",
    description: `강의 단면을 N개의 구간으로 나타낸 높이 배열이 있다. 댐을 높이 H로 설치하면 각 구간에서 H보다 낮은 부분이 물로 채워진다. 즉, i번째 구간의 물의 양은 max(0, H - height[i])이다.

댐 높이 H를 1~MAX로 이분 탐색하여 고이는 물의 총 양이 목표값 W 이상이 되는 최소 H를 구하시오.

<svg width="400" height="190" viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="8"/>
  <text x="200" y="22" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">강 단면도</text>
  <line x1="30" y1="160" x2="370" y2="160" stroke="#333" stroke-width="1"/>
  <rect x="40" y="100" width="30" height="60" fill="#4caf50" rx="2"/>
  <text x="55" y="170" text-anchor="middle" font-size="9" fill="#333">h=6</text>
  <rect x="80" y="120" width="30" height="40" fill="#4caf50" rx="2"/>
  <text x="95" y="170" text-anchor="middle" font-size="9" fill="#333">h=4</text>
  <rect x="120" y="130" width="30" height="30" fill="#4caf50" rx="2"/>
  <text x="135" y="170" text-anchor="middle" font-size="9" fill="#333">h=3</text>
  <rect x="160" y="80" width="30" height="80" fill="#4caf50" rx="2"/>
  <text x="175" y="170" text-anchor="middle" font-size="9" fill="#333">h=8</text>
  <rect x="200" y="110" width="30" height="50" fill="#4caf50" rx="2"/>
  <text x="215" y="170" text-anchor="middle" font-size="9" fill="#333">h=5</text>
  <rect x="240" y="140" width="30" height="20" fill="#4caf50" rx="2"/>
  <text x="255" y="170" text-anchor="middle" font-size="9" fill="#333">h=2</text>
  <rect x="280" y="100" width="30" height="60" fill="#4caf50" rx="2"/>
  <text x="295" y="170" text-anchor="middle" font-size="9" fill="#333">h=6</text>
  <line x1="30" y1="100" x2="370" y2="100" stroke="#2196f3" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="375" y="105" font-size="10" fill="#2196f3">H=6</text>
  <rect x="80" y="100" width="30" height="20" fill="#2196f3" opacity="0.5"/>
  <rect x="120" y="100" width="30" height="30" fill="#2196f3" opacity="0.5"/>
  <rect x="200" y="100" width="30" height="10" fill="#2196f3" opacity="0.5"/>
  <rect x="240" y="100" width="30" height="40" fill="#2196f3" opacity="0.5"/>
</svg>

## 입력

첫째 줄에 구간 수 N과 목표 물의 양 W가 주어진다. 둘째 줄에 N개의 구간 높이가 주어진다.

- 1 ≤ N ≤ 100,000
- 1 ≤ W ≤ 10^14
- 1 ≤ 각 높이 ≤ 10^9

## 출력

고이는 물의 양이 W 이상이 되는 최소 댐 높이 H를 출력한다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7 15\n6 4 3 8 5 2 6", expectedOutput: "6", isVisible: true },
      { input: "3 4\n1 2 3", expectedOutput: "3", isVisible: false },
      { input: "5 10\n5 5 5 5 5", expectedOutput: "7", isVisible: false },
      { input: "4 6\n3 1 2 4", expectedOutput: "4", isVisible: false },
    ],
    tags: ["이분 탐색"],
  },

  // 21. 패턴 잠금
  {
    title: "패턴 잠금",
    description: `스마트폰의 3×3 점 격자에서 L개의 점을 연결하는 잠금 패턴을 만들 때, 유효한 패턴의 수를 구하시오.

패턴 규칙:
- 점은 한 번씩만 사용한다.
- 두 점 사이의 직선상에 아직 방문하지 않은 점이 있으면 그 점을 먼저 방문해야만 연결할 수 있다.
- 예: 1→3 연결 시 2가 미방문이면 불가능.

<svg width="400" height="175" viewBox="0 0 400 175" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="175" fill="#e3f2fd" rx="8"/>
  <text x="200" y="22" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">3×3 잠금 격자</text>
  <g transform="translate(80, 35)">
    <circle cx="0" cy="0" r="14" fill="#2196f3"/>
    <text x="0" y="5" text-anchor="middle" font-size="12" fill="white">1</text>
    <circle cx="60" cy="0" r="14" fill="#2196f3"/>
    <text x="60" y="5" text-anchor="middle" font-size="12" fill="white">2</text>
    <circle cx="120" cy="0" r="14" fill="#2196f3"/>
    <text x="120" y="5" text-anchor="middle" font-size="12" fill="white">3</text>
    <circle cx="0" cy="60" r="14" fill="#2196f3"/>
    <text x="0" y="65" text-anchor="middle" font-size="12" fill="white">4</text>
    <circle cx="60" cy="60" r="14" fill="#ff9800"/>
    <text x="60" y="65" text-anchor="middle" font-size="12" fill="white">5</text>
    <circle cx="120" cy="60" r="14" fill="#2196f3"/>
    <text x="120" y="65" text-anchor="middle" font-size="12" fill="white">6</text>
    <circle cx="0" cy="120" r="14" fill="#2196f3"/>
    <text x="0" y="125" text-anchor="middle" font-size="12" fill="white">7</text>
    <circle cx="60" cy="120" r="14" fill="#2196f3"/>
    <text x="60" y="125" text-anchor="middle" font-size="12" fill="white">8</text>
    <circle cx="120" cy="120" r="14" fill="#2196f3"/>
    <text x="120" y="125" text-anchor="middle" font-size="12" fill="white">9</text>
    <line x1="0" y1="0" x2="60" y2="60" stroke="#f44336" stroke-width="2"/>
    <line x1="60" y1="60" x2="120" y2="120" stroke="#f44336" stroke-width="2"/>
  </g>
</svg>

## 입력

L이 주어진다.

- 1 ≤ L ≤ 9

## 출력

길이 L인 유효한 패턴의 수를 출력한다.`,
    difficulty: 6.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1", expectedOutput: "9", isVisible: true },
      { input: "2", expectedOutput: "56", isVisible: false },
      { input: "3", expectedOutput: "320", isVisible: false },
      { input: "4", expectedOutput: "1624", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  // 22. 음식 배달 앱
  {
    title: "음식 배달 앱",
    description: `배달 앱에 N개의 식당과 M명의 고객이 있다. 각 식당은 (x, y) 좌표에 위치하고 조리 시간이 있다. 각 고객도 (x, y) 좌표에 위치한다. 배달 시간 = 맨해튼 거리 + 조리 시간이다. 각 고객에게 배달 시간이 가장 짧은 식당의 번호를 출력하시오. 동점이면 번호가 작은 식당을 선택한다.

<svg width="400" height="180" viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="180" fill="#e3f2fd" rx="8"/>
  <rect x="20" y="20" width="360" height="130" fill="white" rx="4" stroke="#ccc"/>
  <rect x="60" y="55" width="35" height="30" fill="#ff9800" rx="3"/>
  <text x="77" y="70" text-anchor="middle" font-size="10" fill="white">식당A</text>
  <text x="77" y="82" text-anchor="middle" font-size="9" fill="white">조리5</text>
  <rect x="260" y="40" width="35" height="30" fill="#ff9800" rx="3"/>
  <text x="277" y="55" text-anchor="middle" font-size="10" fill="white">식당B</text>
  <text x="277" y="67" text-anchor="middle" font-size="9" fill="white">조리2</text>
  <circle cx="170" cy="110" r="15" fill="#2196f3"/>
  <text x="170" y="115" text-anchor="middle" font-size="10" fill="white">고객1</text>
  <line x1="95" y1="70" x2="155" y2="100" stroke="#4caf50" stroke-dasharray="4,2"/>
  <line x1="277" y1="70" x2="185" y2="100" stroke="#f44336" stroke-dasharray="4,2"/>
  <text x="200" y="165" text-anchor="middle" font-size="11" fill="#333">각 고객에게 최적 식당 매칭</text>
</svg>

## 입력

첫째 줄에 식당 수 N이 주어진다. 다음 N줄에 식당 좌표 (xi yi)와 조리 시간 ci가 주어진다. 다음 줄에 고객 수 M이 주어진다. 다음 M줄에 고객 좌표 (xj yj)가 주어진다.

- 1 ≤ N, M ≤ 100,000
- 0 ≤ 좌표 ≤ 10,000
- 0 ≤ 조리 시간 ≤ 10,000

## 출력

M줄에 걸쳐 각 고객에게 가장 빠른 식당 번호(1-indexed)를 출력한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n0 0 5\n10 0 2\n2\n5 0\n8 0", expectedOutput: "1\n2", isVisible: true },
      { input: "3\n1 1 0\n2 2 0\n3 3 0\n1\n2 2", expectedOutput: "2", isVisible: false },
      { input: "2\n0 0 10\n0 10 0\n1\n0 5", expectedOutput: "2", isVisible: false },
      { input: "1\n5 5 3\n2\n0 0\n10 10", expectedOutput: "1\n1", isVisible: false },
    ],
    tags: ["정렬", "그리디"],
  },

  // 23. 감옥 탈출
  {
    title: "감옥 탈출",
    description: `N×M 크기의 감옥 지도가 있다. 각 칸은 빈 칸(.), 벽(#), 문(@), 열쇠(a~f), 출구(E), 시작 위치(S) 중 하나이다. 문을 열려면 대응하는 열쇠(a→A, b→B, ..., f→F)가 필요하다.

S에서 E까지 최소 이동 횟수로 탈출하시오. 불가능하면 -1을 출력한다.

<svg width="400" height="190" viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#e3f2fd" rx="8"/>
  <text x="200" y="22" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">감옥 탈출 예시</text>
  <g transform="translate(80, 32)">
    <rect x="0" y="0" width="40" height="40" fill="#4caf50" rx="2" stroke="#333"/>
    <text x="20" y="25" text-anchor="middle" font-size="16" fill="white" font-weight="bold">S</text>
    <rect x="40" y="0" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <text x="60" y="25" text-anchor="middle" font-size="16" fill="#4caf50">a</text>
    <rect x="80" y="0" width="40" height="40" fill="#333" rx="2" stroke="#333"/>
    <text x="100" y="25" text-anchor="middle" font-size="16" fill="white">#</text>
    <rect x="120" y="0" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <text x="140" y="25" text-anchor="middle" font-size="16" fill="#2196f3">E</text>
    <rect x="0" y="40" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="40" y="40" width="40" height="40" fill="#ff9800" rx="2" stroke="#333"/>
    <text x="60" y="65" text-anchor="middle" font-size="16" fill="white">A</text>
    <rect x="80" y="40" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="120" y="40" width="40" height="40" fill="#333" rx="2" stroke="#333"/>
    <text x="140" y="65" text-anchor="middle" font-size="16" fill="white">#</text>
    <rect x="0" y="80" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="40" y="80" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="80" y="80" width="40" height="40" fill="white" rx="2" stroke="#333"/>
    <rect x="120" y="80" width="40" height="40" fill="white" rx="2" stroke="#333"/>
  </g>
  <text x="200" y="170" text-anchor="middle" font-size="11" fill="#f44336">a 열쇠로 A 문 통과 후 탈출</text>
</svg>

## 입력

첫째 줄에 N, M이 주어진다. 다음 N줄에 M개의 문자가 주어진다.

- 1 ≤ N, M ≤ 50
- 열쇠는 a~f, 문은 A~F로 표기

## 출력

최소 이동 횟수를 출력한다. 불가능하면 \`-1\`을 출력한다.`,
    difficulty: 7.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 4\nSa#E\n.A.#\n....", expectedOutput: "6", isVisible: true },
      { input: "1 3\nS.E", expectedOutput: "2", isVisible: false },
      { input: "3 3\nS#E\n...\n...", expectedOutput: "-1", isVisible: false },
      { input: "4 6\nS....E\n.####.\n.#ab#.\n.####.", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["BFS", "비트마스크"],
  },

  // 24. 축제 불꽃놀이
  {
    title: "축제 불꽃놀이",
    description: `여름 축제에서 N개의 불꽃이 밤하늘을 수놓는다. 각 불꽃은 시작 시각 si, 종료 시각 ei(si ≤ t < ei인 구간에 표시됨)와 높이, 색상 정보가 있다. 가장 많은 불꽃이 동시에 보이는 순간에 표시되는 불꽃의 수를 구하시오.

<svg width="400" height="175" viewBox="0 0 400 175" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="175" fill="#333" rx="8"/>
  <text x="200" y="22" text-anchor="middle" font-size="12" fill="white" font-weight="bold">불꽃놀이 타임라인</text>
  <line x1="30" y1="150" x2="370" y2="150" stroke="#555" stroke-width="1"/>
  <text x="30" y="165" font-size="10" fill="#aaa">t=0</text>
  <text x="100" y="165" font-size="10" fill="#aaa">t=2</text>
  <text x="190" y="165" font-size="10" fill="#aaa">t=5</text>
  <text x="280" y="165" font-size="10" fill="#aaa">t=8</text>
  <rect x="30" y="50" width="180" height="18" fill="#f44336" rx="3"/>
  <text x="35" y="63" font-size="10" fill="white">불꽃1 [0, 6)</text>
  <rect x="100" y="75" width="240" height="18" fill="#ff9800" rx="3"/>
  <text x="105" y="88" font-size="10" fill="white">불꽃2 [2, 10)</text>
  <rect x="190" y="100" width="120" height="18" fill="#2196f3" rx="3"/>
  <text x="195" y="113" font-size="10" fill="white">불꽃3 [5, 9)</text>
  <line x1="190" y1="40" x2="190" y2="145" stroke="#4caf50" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="193" y="45" font-size="10" fill="#4caf50">t=5: 3개 겹침</text>
</svg>

## 입력

첫째 줄에 불꽃 수 N이 주어진다. 다음 N줄에 시작 시각 si와 종료 시각 ei가 주어진다.

- 1 ≤ N ≤ 100,000
- 0 ≤ si < ei ≤ 1,000,000,000

## 출력

동시에 보이는 불꽃 수의 최댓값을 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n0 6\n2 10\n5 9", expectedOutput: "3", isVisible: true },
      { input: "2\n0 5\n5 10", expectedOutput: "1", isVisible: false },
      { input: "4\n1 4\n2 5\n3 6\n4 7", expectedOutput: "3", isVisible: false },
      { input: "1\n0 1000000000", expectedOutput: "1", isVisible: false },
    ],
    tags: ["정렬", "구현"],
  },

  // 25. 우주 탐사선
  {
    title: "우주 탐사선",
    description: `탐사선이 지구(1번 행성)에서 목적지 행성(D번)으로 여행한다. N개의 행성과 M개의 항로(단방향)가 있으며, 각 항로에는 연료 비용이 있다. 일부 행성에는 연료 충전소가 있다.

연료 충전소가 있는 행성을 지나면 남은 연료가 FULL(=100)이 된다. 지구와 목적지도 충전소가 있다고 가정한다. 탐사선이 지구에서 출발할 때 연료는 100이다. 목적지까지 최소 연료를 소모하며 도달하는 방법을 구하시오. 단, 각 구간에서 필요한 연료는 해당 항로 비용이다. 도달 불가능하면 -1을 출력한다.

<svg width="400" height="190" viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="190" fill="#333" rx="8"/>
  <circle cx="60" cy="100" r="25" fill="#2196f3"/>
  <text x="60" y="97" text-anchor="middle" font-size="11" fill="white">지구</text>
  <text x="60" y="112" text-anchor="middle" font-size="9" fill="#4caf50">연료충전</text>
  <circle cx="200" cy="50" r="22" fill="#ff9800"/>
  <text x="200" y="47" text-anchor="middle" font-size="11" fill="white">행성2</text>
  <text x="200" y="62" text-anchor="middle" font-size="9" fill="#4caf50">충전소</text>
  <circle cx="200" cy="150" r="22" fill="#555"/>
  <text x="200" y="155" text-anchor="middle" font-size="11" fill="white">행성3</text>
  <circle cx="340" cy="100" r="25" fill="#f44336"/>
  <text x="340" y="97" text-anchor="middle" font-size="11" fill="white">목적지</text>
  <text x="340" y="112" text-anchor="middle" font-size="9" fill="#4caf50">연료충전</text>
  <line x1="85" y1="88" x2="178" y2="62" stroke="#aaa" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="120" y="68" text-anchor="middle" font-size="10" fill="#ff9800">30</text>
  <line x1="85" y1="112" x2="178" y2="138" stroke="#aaa" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="120" y="135" text-anchor="middle" font-size="10" fill="#ff9800">50</text>
  <line x1="222" y1="62" x2="315" y2="88" stroke="#aaa" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="280" y="65" text-anchor="middle" font-size="10" fill="#ff9800">20</text>
  <line x1="222" y1="138" x2="315" y2="112" stroke="#aaa" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="280" y="140" text-anchor="middle" font-size="10" fill="#ff9800">40</text>
</svg>

## 입력

첫째 줄에 행성 수 N, 항로 수 M, 목적지 D가 주어진다. 둘째 줄에 연료 충전소가 있는 행성 번호들이 주어진다(첫 번째 숫자는 충전소 수). 다음 M줄에 항로 정보 (A B C) — A→B 이동에 연료 C 소모.

- 2 ≤ N ≤ 1,000
- 1 ≤ M ≤ 10,000
- 1 ≤ C ≤ 100
- 지구(1번)와 목적지(D번)는 항상 충전소 보유

## 출력

최소 연료 소모량을 출력한다. 도달 불가능하면 \`-1\`을 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 4 4\n1 2\n1 2 30\n1 3 50\n2 4 20\n3 4 40", expectedOutput: "50", isVisible: true },
      { input: "3 2 3\n0\n1 2 60\n2 3 60", expectedOutput: "120", isVisible: false },
      { input: "2 1 2\n0\n1 2 40", expectedOutput: "40", isVisible: false },
      { input: "4 3 4\n0\n1 2 30\n2 3 30\n2 4 80", expectedOutput: "110", isVisible: false },
    ],
    tags: ["다익스트라"],
  },
];
