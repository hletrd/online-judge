export const problems = [
  // 1. 전염병 시뮬레이션
  {
    title: "전염병 시뮬레이션",
    description: `어느 마을에 전염병이 발생하였다. 마을은 N×N 크기의 격자로 이루어져 있으며, 각 칸에는 한 명의 주민이 살고 있다. 처음에 일부 주민이 감염된 상태이다.

매일 감염된 주민은 상하좌우로 인접한 주민에게 바이러스를 전파한다. T일이 지난 후 감염된 주민의 수를 구하시오.

<svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="120" fill="#e8f5e9" rx="8"/>
  <text x="100" y="14" text-anchor="middle" font-size="11" fill="#333" font-weight="bold">전염병 격자 (N=3)</text>
  <g transform="translate(46,20)">
    <rect x="0" y="0" width="32" height="32" fill="#fff" stroke="#888"/>
    <rect x="32" y="0" width="32" height="32" fill="#f44336" stroke="#888"/>
    <rect x="64" y="0" width="32" height="32" fill="#fff" stroke="#888"/>
    <rect x="0" y="32" width="32" height="32" fill="#fff" stroke="#888"/>
    <rect x="32" y="32" width="32" height="32" fill="#fff" stroke="#888"/>
    <rect x="64" y="32" width="32" height="32" fill="#fff" stroke="#888"/>
    <rect x="0" y="64" width="32" height="32" fill="#fff" stroke="#888"/>
    <rect x="32" y="64" width="32" height="32" fill="#f44336" stroke="#888"/>
    <rect x="64" y="64" width="32" height="32" fill="#fff" stroke="#888"/>
  </g>
  <text x="100" y="112" text-anchor="middle" font-size="10" fill="#f44336">빨간 칸: 초기 감염자</text>
</svg>

## 입력

첫째 줄에 격자 크기 N, 초기 감염자 수 K, 일수 T가 주어진다. 다음 K줄에 초기 감염자의 행 번호와 열 번호가 주어진다.

- 1 ≤ N ≤ 100
- 1 ≤ K ≤ N×N
- 0 ≤ T ≤ 100

## 출력

T일 후 감염된 주민의 수를 출력한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 1 1\n1 1", expectedOutput: "3", isVisible: true },
      { input: "4 1 2\n1 1", expectedOutput: "6", isVisible: false },
      { input: "3 1 0\n2 2", expectedOutput: "1", isVisible: false },
      { input: "5 2 3\n1 1\n5 5", expectedOutput: "20", isVisible: false },
    ],
    tags: ["BFS", "시뮬레이션"],
  },

  // 2. 화물 적재
  {
    title: "화물 적재",
    description: `물류 회사에서 일하는 지훈이는 트럭에 화물을 싣는 일을 담당한다. 트럭의 최대 적재 무게는 W이고, 화물은 N개가 있다. 각 화물에는 무게와 긴급도가 있다.

트럭에 실을 화물의 긴급도 합이 최대가 되도록 화물을 선택하시오. 단, 선택한 화물의 무게 합이 W를 초과할 수 없다.

<svg width="340" height="160" viewBox="0 0 340 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="160" fill="#fff8e1" rx="8"/>
  <rect x="20" y="80" width="180" height="60" fill="#607d8b" rx="4"/>
  <rect x="20" y="70" width="40" height="15" fill="#455a64" rx="2"/>
  <circle cx="60" cy="145" r="12" fill="#333"/>
  <circle cx="160" cy="145" r="12" fill="#333"/>
  <text x="110" y="115" text-anchor="middle" font-size="11" fill="white">최대 W kg</text>
  <rect x="50" y="40" width="38" height="38" fill="#ff9800" rx="4"/>
  <text x="69" y="56" text-anchor="middle" font-size="9" fill="white">무게:3</text>
  <text x="69" y="70" text-anchor="middle" font-size="9" fill="white">긴급:5</text>
  <rect x="100" y="45" width="38" height="38" fill="#f44336" rx="4"/>
  <text x="119" y="61" text-anchor="middle" font-size="9" fill="white">무게:4</text>
  <text x="119" y="75" text-anchor="middle" font-size="9" fill="white">긴급:7</text>
  <rect x="150" y="38" width="38" height="38" fill="#4caf50" rx="4"/>
  <text x="169" y="54" text-anchor="middle" font-size="9" fill="white">무게:2</text>
  <text x="169" y="68" text-anchor="middle" font-size="9" fill="white">긴급:4</text>
  <text x="260" y="100" text-anchor="middle" font-size="11" fill="#333">0-1 배낭</text>
  <text x="260" y="118" text-anchor="middle" font-size="11" fill="#f44336">긴급도 합 최대화</text>
</svg>

## 입력

첫째 줄에 화물의 수 N과 최대 적재 무게 W가 주어진다. 다음 N줄에 각 화물의 무게와 긴급도가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100
- 1 ≤ W ≤ 10,000
- 1 ≤ 무게 ≤ 1,000
- 1 ≤ 긴급도 ≤ 1,000

## 출력

선택한 화물의 긴급도 합의 최댓값을 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 5\n3 5\n4 7\n2 4", expectedOutput: "9", isVisible: true },
      { input: "4 7\n2 3\n3 4\n4 5\n5 6", expectedOutput: "9", isVisible: false },
      { input: "1 10\n5 8", expectedOutput: "8", isVisible: false },
      { input: "5 10\n3 4\n4 5\n5 7\n2 3\n6 8", expectedOutput: "16", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 3. 회전초밥
  {
    title: "회전초밥",
    description: `회전초밥 음식점에서 아르바이트하는 수아는 오늘도 바쁜 하루를 보내고 있다. 벨트 위에는 N개의 초밥이 원형으로 놓여 있고, 각 초밥에는 종류 번호가 붙어 있다. 손님은 연속으로 K개의 초밥을 먹을 수 있으며, 쿠폰으로 추가로 c번 종류의 초밥 한 개를 무료로 먹을 수 있다.

손님이 먹을 수 있는 초밥 종류의 최대 가짓수를 구하시오.

<svg width="340" height="160" viewBox="0 0 340 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="160" fill="#fce4ec" rx="8"/>
  <ellipse cx="170" cy="80" rx="130" ry="55" fill="none" stroke="#e91e63" stroke-width="3"/>
  <circle cx="170" cy="25" r="14" fill="#ff9800"/>
  <text x="170" y="30" text-anchor="middle" font-size="10" fill="white">연어</text>
  <circle cx="270" cy="55" r="14" fill="#4caf50"/>
  <text x="270" y="60" text-anchor="middle" font-size="10" fill="white">참치</text>
  <circle cx="300" cy="100" r="14" fill="#2196f3"/>
  <text x="300" y="105" text-anchor="middle" font-size="10" fill="white">문어</text>
  <circle cx="230" cy="140" r="14" fill="#ff9800"/>
  <text x="230" y="145" text-anchor="middle" font-size="10" fill="white">연어</text>
  <circle cx="110" cy="140" r="14" fill="#9c27b0"/>
  <text x="110" y="145" text-anchor="middle" font-size="10" fill="white">새우</text>
  <circle cx="40" cy="100" r="14" fill="#4caf50"/>
  <text x="40" y="105" text-anchor="middle" font-size="10" fill="white">참치</text>
  <circle cx="70" cy="55" r="14" fill="#f44336"/>
  <text x="70" y="60" text-anchor="middle" font-size="10" fill="white">광어</text>
  <text x="170" y="85" text-anchor="middle" font-size="11" fill="#333">연속 K개 선택</text>
</svg>

## 입력

첫째 줄에 벨트 위 초밥 수 N, 연속으로 먹는 초밥 수 K, 쿠폰 초밥 종류 c가 주어진다. 둘째 줄에 N개의 초밥 종류 번호가 공백으로 구분되어 주어진다.

- 2 ≤ K ≤ N ≤ 3,000
- 1 ≤ 초밥 종류 번호 ≤ 3,000
- 1 ≤ c ≤ 3,000

## 출력

먹을 수 있는 초밥 종류의 최대 가짓수를 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "7 4 2\n7 9 7 30 2 7 9", expectedOutput: "4", isVisible: true },
      { input: "5 3 3\n1 2 4 1 2", expectedOutput: "4", isVisible: false },
      { input: "4 2 5\n1 1 1 1", expectedOutput: "2", isVisible: false },
      { input: "6 3 4\n1 2 3 4 5 6", expectedOutput: "4", isVisible: false },
    ],
    tags: ["투 포인터"],
  },

  // 4. 우산 대여소
  {
    title: "우산 대여소",
    description: `등산로에는 N개의 우산 대여소가 일렬로 놓여 있고, 각 대여소의 위치는 1차원 수직선 위의 좌표로 주어진다. 비가 내리는 구간이 M개 있고, 각 구간은 [l, r]로 나타낸다.

비가 내리는 구간을 모두 우산으로 커버하려면 최소 몇 개의 우산을 빌려야 하는지 구하시오. 각 대여소에서 우산을 빌리면, 다음 대여소에 도달할 때까지 해당 우산으로 비를 막을 수 있다.

<svg width="340" height="130" viewBox="0 0 340 130" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="130" fill="#e3f2fd" rx="8"/>
  <line x1="20" y1="70" x2="320" y2="70" stroke="#333" stroke-width="2"/>
  <circle cx="60" cy="70" r="7" fill="#2196f3"/>
  <text x="60" y="55" text-anchor="middle" font-size="10" fill="#2196f3">1</text>
  <circle cx="130" cy="70" r="7" fill="#2196f3"/>
  <text x="130" y="55" text-anchor="middle" font-size="10" fill="#2196f3">3</text>
  <circle cx="200" cy="70" r="7" fill="#2196f3"/>
  <text x="200" y="55" text-anchor="middle" font-size="10" fill="#2196f3">5</text>
  <circle cx="280" cy="70" r="7" fill="#2196f3"/>
  <text x="280" y="55" text-anchor="middle" font-size="10" fill="#2196f3">8</text>
  <rect x="100" y="78" width="130" height="8" fill="#29b6f6" opacity="0.5" rx="2"/>
  <text x="165" y="105" text-anchor="middle" font-size="10" fill="#0288d1">비 구간 [3, 7]</text>
  <text x="170" y="120" text-anchor="middle" font-size="10" fill="#f44336">대여소 3에서 빌리면 해결</text>
</svg>

## 입력

첫째 줄에 대여소 수 N과 비 구간 수 M이 주어진다. 둘째 줄에 N개의 대여소 위치가 공백으로 구분되어 주어진다. 다음 M줄에 비 구간의 시작 위치와 끝 위치가 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ M ≤ 1,000
- 1 ≤ 대여소 위치 ≤ 10,000
- 비 구간의 시작은 끝보다 작다.

## 출력

최소로 빌려야 하는 우산의 수를 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 1\n1 3 5\n2 4", expectedOutput: "1", isVisible: true },
      { input: "3 2\n1 4 7\n2 3\n5 6", expectedOutput: "2", isVisible: false },
      { input: "3 1\n1 5 9\n2 8", expectedOutput: "2", isVisible: false },
      { input: "4 2\n1 3 6 9\n2 5\n7 8", expectedOutput: "3", isVisible: false },
    ],
    tags: ["그리디"],
  },

  // 5. 타일 공사
  {
    title: "타일 공사",
    description: `건설 회사에 다니는 재호는 1×N 크기의 복도 바닥에 타일을 시공하는 일을 맡았다. 사용 가능한 타일 색상은 C가지이며, 각 칸을 하나의 색으로 칠해야 한다.

미관을 위해 인접한 두 칸은 반드시 서로 다른 색이어야 한다. 가능한 타일 배색의 경우의 수를 구하시오. 경우의 수가 매우 클 수 있으므로 1,000,000,007로 나눈 나머지를 출력한다.

<svg width="340" height="120" viewBox="0 0 340 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="120" fill="#f3e5f5" rx="8"/>
  <text x="170" y="20" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">1×5 바닥 (C=3색)</text>
  <rect x="30" y="35" width="50" height="40" fill="#f44336" rx="3"/>
  <rect x="85" y="35" width="50" height="40" fill="#4caf50" rx="3"/>
  <rect x="140" y="35" width="50" height="40" fill="#f44336" rx="3"/>
  <rect x="195" y="35" width="50" height="40" fill="#2196f3" rx="3"/>
  <rect x="250" y="35" width="50" height="40" fill="#4caf50" rx="3"/>
  <text x="55" y="60" text-anchor="middle" font-size="13" fill="white">A</text>
  <text x="110" y="60" text-anchor="middle" font-size="13" fill="white">B</text>
  <text x="165" y="60" text-anchor="middle" font-size="13" fill="white">A</text>
  <text x="220" y="60" text-anchor="middle" font-size="13" fill="white">C</text>
  <text x="275" y="60" text-anchor="middle" font-size="13" fill="white">B</text>
  <text x="170" y="100" text-anchor="middle" font-size="11" fill="#6a1b9a">인접한 칸은 다른 색</text>
</svg>

## 입력

첫째 줄에 바닥 길이 N과 색상 수 C가 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ C ≤ 1,000

## 출력

가능한 배색의 경우의 수를 1,000,000,007로 나눈 나머지를 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 3", expectedOutput: "12", isVisible: true },
      { input: "1 5", expectedOutput: "5", isVisible: false },
      { input: "2 2", expectedOutput: "2", isVisible: false },
      { input: "5 3", expectedOutput: "48", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 6. 놀이공원 관람차
  {
    title: "놀이공원 관람차",
    description: `놀이공원의 인기 어트랙션인 관람차에는 N개의 곤돌라가 있다. 각 곤돌라는 정원이 정해져 있으며, 매 분마다 순서대로 다음 곤돌라가 탑승구에 도착한다. N개의 곤돌라가 모두 지나가면 처음 곤돌라부터 다시 반복된다.

M명이 줄을 서 있고, 각 곤돌라의 정원만큼 앞에서부터 탑승한다. 마지막 손님이 탑승하는 곤돌라 번호와 그 곤돌라가 몇 번째로 도착했을 때 탑승하는지 출력하시오.

<svg width="340" height="160" viewBox="0 0 340 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="160" fill="#e8eaf6" rx="8"/>
  <ellipse cx="170" cy="60" rx="120" ry="40" fill="none" stroke="#3f51b5" stroke-width="2" stroke-dasharray="6,3"/>
  <rect x="70" y="42" width="30" height="22" fill="#3f51b5" rx="3"/>
  <text x="85" y="57" text-anchor="middle" font-size="9" fill="white">곤1</text>
  <rect x="150" y="18" width="30" height="22" fill="#3f51b5" rx="3"/>
  <text x="165" y="33" text-anchor="middle" font-size="9" fill="white">곤2</text>
  <rect x="235" y="42" width="30" height="22" fill="#3f51b5" rx="3"/>
  <text x="250" y="57" text-anchor="middle" font-size="9" fill="white">곤3</text>
  <line x1="100" y1="115" x2="240" y2="115" stroke="#333" stroke-width="2"/>
  <circle cx="110" cy="115" r="8" fill="#ff9800"/>
  <circle cx="130" cy="115" r="8" fill="#ff9800"/>
  <circle cx="150" cy="115" r="8" fill="#ff9800"/>
  <circle cx="170" cy="115" r="8" fill="#bdbdbd"/>
  <text x="170" y="140" text-anchor="middle" font-size="11" fill="#333">M명 대기 중</text>
</svg>

## 입력

첫째 줄에 곤돌라 수 N과 대기 인원 M이 주어진다. 둘째 줄에 N개의 곤돌라 정원이 순서대로 주어진다.

- 1 ≤ N ≤ 1,000
- 1 ≤ M ≤ 1,000,000
- 1 ≤ 각 곤돌라 정원 ≤ 1,000

## 출력

마지막 손님이 탑승하는 곤돌라 번호와 도착 횟수를 공백으로 구분하여 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3 5\n2 3 2", expectedOutput: "2 1", isVisible: true },
      { input: "3 8\n2 3 2", expectedOutput: "1 2", isVisible: false },
      { input: "3 9\n3 3 3", expectedOutput: "3 1", isVisible: false },
      { input: "4 10\n1 2 3 4", expectedOutput: "4 1", isVisible: false },
    ],
    tags: ["시뮬레이션"],
  },

  // 7. 보물 지도
  {
    title: "보물 지도",
    description: `탐험가 민호는 N×M 크기의 섬 지도를 손에 넣었다. 각 칸에는 보물 가치가 적혀 있고, 일부 칸은 통행 불가 지형(0)이다. 민호는 섬의 왼쪽 위 (1,1)에서 출발하여 오른쪽 아래 (N,M)까지 갔다가 다시 (1,1)로 돌아온다.

갈 때와 올 때 같은 칸을 두 번 이상 방문하면 보물은 처음 방문할 때만 획득할 수 있다. 이동은 상하좌우로만 가능하다. 왕복하여 얻을 수 있는 보물 가치의 최댓값을 구하시오.

<svg width="240" height="100" viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="100" fill="#fff9c4" rx="8"/>
  <text x="120" y="13" text-anchor="middle" font-size="11" fill="#333" font-weight="bold">보물 지도 (N×M)</text>
  <g transform="translate(20,20)">
    <rect x="0" y="0" width="44" height="30" fill="#ffe082" stroke="#f9a825"/>
    <rect x="44" y="0" width="44" height="30" fill="#ffe082" stroke="#f9a825"/>
    <rect x="88" y="0" width="44" height="30" fill="#616161" stroke="#333"/>
    <rect x="132" y="0" width="44" height="30" fill="#ffe082" stroke="#f9a825"/>
    <rect x="0" y="30" width="44" height="30" fill="#ffe082" stroke="#f9a825"/>
    <rect x="44" y="30" width="44" height="30" fill="#ffe082" stroke="#f9a825"/>
    <rect x="88" y="30" width="44" height="30" fill="#ffe082" stroke="#f9a825"/>
    <rect x="132" y="30" width="44" height="30" fill="#ffe082" stroke="#f9a825"/>
    <text x="110" y="19" text-anchor="middle" font-size="11" fill="white">✕</text>
  </g>
  <text x="120" y="90" text-anchor="middle" font-size="10" fill="#f57f17">왕복 경로로 가치 최대화</text>
</svg>

## 입력

첫째 줄에 N과 M이 주어진다. 다음 N줄에 M개의 정수가 주어진다. 0은 통행 불가, 1 이상은 보물 가치이다.

- 2 ≤ N, M ≤ 20
- 0 ≤ 각 칸의 가치 ≤ 100
- (1,1)과 (N,M)은 항상 통행 가능하다.

## 출력

왕복 경로에서 얻을 수 있는 보물 가치의 최댓값을 출력한다.`,
    difficulty: 7.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 4\n3 1 0 2\n2 4 5 3", expectedOutput: "18", isVisible: true },
      { input: "2 2\n1 2\n3 4", expectedOutput: "10", isVisible: false },
      { input: "3 3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "42", isVisible: false },
      { input: "2 3\n1 3 2\n4 5 6", expectedOutput: "21", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 8. 캠프파이어
  {
    title: "캠프파이어",
    description: `야영 캠프에서 N명의 참가자가 원형으로 앉아 캠프파이어를 즐기려고 한다. 참가자들 사이에는 친밀도가 있으며, 서로 인접하여 앉는 두 사람의 친밀도가 더해진다.

참가자들을 원형으로 배치하여 인접한 모든 쌍의 친밀도 합이 최대가 되도록 하시오. 원형 배치이므로 첫 번째 사람과 마지막 사람도 인접한다.

<svg width="340" height="160" viewBox="0 0 340 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="160" fill="#fbe9e7" rx="8"/>
  <circle cx="170" cy="80" r="55" fill="none" stroke="#ff5722" stroke-width="2" stroke-dasharray="6,3"/>
  <circle cx="170" cy="25" r="16" fill="#ff5722"/>
  <text x="170" y="30" text-anchor="middle" font-size="10" fill="white">민준</text>
  <circle cx="225" cy="60" r="16" fill="#ff5722"/>
  <text x="225" y="65" text-anchor="middle" font-size="10" fill="white">수아</text>
  <circle cx="225" cy="100" r="16" fill="#ff5722"/>
  <text x="225" y="105" text-anchor="middle" font-size="10" fill="white">지훈</text>
  <circle cx="170" cy="135" r="16" fill="#ff5722"/>
  <text x="170" y="140" text-anchor="middle" font-size="10" fill="white">예린</text>
  <circle cx="115" cy="100" r="16" fill="#ff5722"/>
  <text x="115" y="105" text-anchor="middle" font-size="10" fill="white">건우</text>
  <circle cx="115" cy="60" r="16" fill="#ff5722"/>
  <text x="115" y="65" text-anchor="middle" font-size="10" fill="white">하은</text>
  <text x="170" y="80" text-anchor="middle" font-size="20" fill="#ff9800">🔥</text>
</svg>

## 입력

첫째 줄에 참가자 수 N이 주어진다. 다음 N줄에 N개의 정수로 친밀도 행렬이 주어진다. i번째 줄 j번째 값은 i번 참가자와 j번 참가자의 친밀도이다.

- 3 ≤ N ≤ 10
- 0 ≤ 친밀도 ≤ 100
- 친밀도 행렬은 대칭이다.

## 출력

원형 배치에서 인접 쌍의 친밀도 합의 최댓값을 출력한다.`,
    difficulty: 6.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "3\n0 5 3\n5 0 8\n3 8 0", expectedOutput: "16", isVisible: true },
      { input: "4\n0 1 2 3\n1 0 4 5\n2 4 0 6\n3 5 6 0", expectedOutput: "14", isVisible: false },
      { input: "3\n0 1 1\n1 0 1\n1 1 0", expectedOutput: "3", isVisible: false },
      { input: "4\n0 3 2 1\n3 0 5 4\n2 5 0 6\n1 4 6 0", expectedOutput: "15", isVisible: false },
    ],
    tags: ["백트래킹"],
  },

  // 9. 신호등
  {
    title: "신호등",
    description: `자동차 경주를 즐기는 도현이는 일직선으로 나열된 N개의 교차로를 지나야 한다. 출발점은 교차로 1번 바로 앞이다. 각 교차로에는 신호등이 있으며, 신호 주기(초록 시간 + 빨간 시간)와 처음 신호 색, 남은 시간이 주어진다.

도현이는 초당 1칸씩 이동하며, 교차로에 도착했을 때 빨간불이면 초록불로 바뀔 때까지 대기한다. 교차로 N번을 통과하는 최소 시간을 구하시오.

<svg width="340" height="130" viewBox="0 0 340 130" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="130" fill="#f1f8e9" rx="8"/>
  <line x1="20" y1="70" x2="320" y2="70" stroke="#795548" stroke-width="6"/>
  <rect x="55" y="40" width="18" height="35" fill="#333" rx="2"/>
  <circle cx="64" cy="48" r="6" fill="#f44336"/>
  <circle cx="64" cy="62" r="6" fill="#4caf50"/>
  <text x="64" y="95" text-anchor="middle" font-size="9" fill="#333">교차로1</text>
  <rect x="145" y="40" width="18" height="35" fill="#333" rx="2"/>
  <circle cx="154" cy="48" r="6" fill="#bdbdbd"/>
  <circle cx="154" cy="62" r="6" fill="#4caf50"/>
  <text x="154" y="95" text-anchor="middle" font-size="9" fill="#333">교차로2</text>
  <rect x="235" y="40" width="18" height="35" fill="#333" rx="2"/>
  <circle cx="244" cy="48" r="6" fill="#f44336"/>
  <circle cx="244" cy="62" r="6" fill="#bdbdbd"/>
  <text x="244" y="95" text-anchor="middle" font-size="9" fill="#333">교차로3</text>
  <circle cx="25" cy="70" r="8" fill="#ff9800"/>
  <text x="25" y="74" text-anchor="middle" font-size="9" fill="white">차</text>
  <text x="170" y="118" text-anchor="middle" font-size="10" fill="#558b2f">빨간불 → 대기</text>
</svg>

## 입력

첫째 줄에 교차로 수 N이 주어진다. 다음 N줄에 교차로까지의 거리 d, 초록 시간 g, 빨간 시간 r, 현재 신호 색(G/R), 현재 신호의 남은 시간 t가 주어진다.

- 1 ≤ N ≤ 100
- 1 ≤ d ≤ 1,000
- 1 ≤ g, r ≤ 100
- 1 ≤ t ≤ g 또는 t ≤ r

## 출력

마지막 교차로를 통과하는 최소 시간을 출력한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "1\n5 4 3 G 4", expectedOutput: "7", isVisible: true },
      { input: "1\n3 5 3 G 5", expectedOutput: "3", isVisible: false },
      { input: "1\n4 3 4 R 3", expectedOutput: "4", isVisible: false },
      { input: "2\n3 2 3 G 2\n4 3 2 R 1", expectedOutput: "11", isVisible: false },
    ],
    tags: ["시뮬레이션"],
  },

  // 10. 빵집 투어
  {
    title: "빵집 투어",
    description: `원형 도로 위에 N개의 빵집이 있다. 각 빵집에서는 빵을 살 수 있고, 한 칸 이동하는 데 연료가 1 소비된다. 각 빵집에서 판매하는 빵의 수가 주어질 때, 어느 빵집에서 출발하면 원형 도로를 한 바퀴 돌아 출발점으로 돌아올 수 있는지 구하시오.

각 빵집에서는 빵을 사서 연료로 바꿀 수 있다. 빵 1개 = 연료 1. 처음 연료는 0이며, 출발 빵집에서는 빵을 먼저 구매한 후 출발한다. 가능한 출발 빵집 번호를 오름차순으로 모두 출력한다.

<svg width="260" height="150" viewBox="0 0 260 150" xmlns="http://www.w3.org/2000/svg">
  <rect width="260" height="150" fill="#e8f5e9" rx="8"/>
  <circle cx="130" cy="75" r="52" fill="none" stroke="#388e3c" stroke-width="2"/>
  <circle cx="130" cy="23" r="15" fill="#a5d6a7" stroke="#388e3c"/>
  <text x="130" y="27" text-anchor="middle" font-size="9" fill="#1b5e20">1:빵3</text>
  <circle cx="178" cy="44" r="15" fill="#a5d6a7" stroke="#388e3c"/>
  <text x="178" y="48" text-anchor="middle" font-size="9" fill="#1b5e20">2:빵1</text>
  <circle cx="193" cy="100" r="15" fill="#a5d6a7" stroke="#388e3c"/>
  <text x="193" y="104" text-anchor="middle" font-size="9" fill="#1b5e20">3:빵4</text>
  <circle cx="82" cy="44" r="15" fill="#a5d6a7" stroke="#388e3c"/>
  <text x="82" y="48" text-anchor="middle" font-size="9" fill="#1b5e20">4:빵2</text>
  <circle cx="67" cy="100" r="15" fill="#ffcc80" stroke="#f57c00" stroke-width="2"/>
  <text x="67" y="104" text-anchor="middle" font-size="9" fill="#bf360c">5:빵5</text>
  <text x="130" y="142" text-anchor="middle" font-size="10" fill="#388e3c">원형 순환 — 한 바퀴 가능?</text>
</svg>

## 입력

첫째 줄에 빵집 수 N이 주어진다. 둘째 줄에 N개의 빵집에서 판매하는 빵의 수가 순서대로 주어진다. 빵집은 원형으로 배열되며, i번 빵집 다음은 i+1번 빵집, N번 빵집 다음은 1번 빵집이다.

- 2 ≤ N ≤ 1,000
- 1 ≤ 각 빵집의 빵 수 ≤ 100

## 출력

원형 한 바퀴 완주가 가능한 출발 빵집 번호를 오름차순으로 출력한다. 없으면 -1을 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5\n3 1 4 2 5", expectedOutput: "1 2 3 4 5", isVisible: true },
      { input: "3\n1 1 1", expectedOutput: "1 2 3", isVisible: false },
      { input: "4\n1 1 1 1", expectedOutput: "1 2 3 4", isVisible: false },
      { input: "3\n1 1 3", expectedOutput: "1 2 3", isVisible: false },
    ],
    tags: ["그리디"],
  },

  // 11. 별자리 만들기
  {
    title: "별자리 만들기",
    description: `천문학자 지우는 밤하늘의 N개의 별을 연결하여 별자리를 만들려고 한다. 각 별의 좌표가 주어질 때, 모든 별을 하나의 별자리로 이어주는 선분들의 총 길이가 최소가 되도록 연결하시오.

두 별 사이의 거리는 유클리드 거리이다. 최솟값을 소수점 둘째 자리까지 출력한다.

<svg width="340" height="160" viewBox="0 0 340 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="160" fill="#1a237e" rx="8"/>
  <circle cx="80" cy="40" r="4" fill="white"/>
  <circle cx="80" cy="40" r="8" fill="none" stroke="white" stroke-width="0.5" opacity="0.4"/>
  <circle cx="180" cy="30" r="4" fill="white"/>
  <circle cx="180" cy="30" r="8" fill="none" stroke="white" stroke-width="0.5" opacity="0.4"/>
  <circle cx="260" cy="70" r="4" fill="white"/>
  <circle cx="260" cy="70" r="8" fill="none" stroke="white" stroke-width="0.5" opacity="0.4"/>
  <circle cx="130" cy="110" r="4" fill="white"/>
  <circle cx="130" cy="110" r="8" fill="none" stroke="white" stroke-width="0.5" opacity="0.4"/>
  <circle cx="220" cy="130" r="4" fill="white"/>
  <circle cx="220" cy="130" r="8" fill="none" stroke="white" stroke-width="0.5" opacity="0.4"/>
  <line x1="80" y1="40" x2="180" y2="30" stroke="#ffd54f" stroke-width="1.5"/>
  <line x1="180" y1="30" x2="260" y2="70" stroke="#ffd54f" stroke-width="1.5"/>
  <line x1="80" y1="40" x2="130" y2="110" stroke="#ffd54f" stroke-width="1.5"/>
  <line x1="130" y1="110" x2="220" y2="130" stroke="#ffd54f" stroke-width="1.5"/>
  <text x="170" y="152" text-anchor="middle" font-size="11" fill="#ffd54f">MST — 최소 연결 비용</text>
</svg>

## 입력

첫째 줄에 별의 수 N이 주어진다. 다음 N줄에 각 별의 x좌표와 y좌표가 주어진다.

- 2 ≤ N ≤ 1,000
- 0 ≤ x, y ≤ 10,000

## 출력

별자리를 만드는 데 필요한 선분의 총 길이 최솟값을 소수점 둘째 자리까지 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "float",
    floatAbsoluteError: 0.01,
    testCases: [
      { input: "4\n0 0\n1 0\n1 1\n0 1", expectedOutput: "3.00", isVisible: true },
      { input: "3\n0 0\n3 0\n0 4", expectedOutput: "7.00", isVisible: false },
      { input: "2\n0 0\n3 4", expectedOutput: "5.00", isVisible: false },
      { input: "5\n0 0\n2 0\n2 2\n0 2\n1 1", expectedOutput: "5.66", isVisible: false },
    ],
    tags: ["MST"],
  },

  // 12. 영화관 좌석
  {
    title: "영화관 좌석",
    description: `영화관에는 M개의 좌석이 일렬로 번호 1번부터 M번까지 배열되어 있다. N명의 관객이 순서대로 입장하며, 각 관객은 선호하는 좌석 번호가 있다.

선호 좌석이 비어 있으면 그 자리에 앉는다. 이미 사람이 앉아 있으면 가장 가까운 빈 좌석에 앉는다. 가장 가까운 빈 좌석이 여러 개이면 번호가 작은 쪽에 앉는다. N명 관객이 각각 앉은 좌석 번호를 순서대로 출력하시오.

<svg width="300" height="110" viewBox="0 0 300 110" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="110" fill="#f8f9fa" rx="8"/>
  <text x="150" y="16" text-anchor="middle" font-size="11" fill="#333" font-weight="bold">영화관 좌석 배치</text>
  <rect x="15" y="25" width="34" height="34" fill="#4caf50" rx="3"/>
  <text x="32" y="47" text-anchor="middle" font-size="11" fill="white">1</text>
  <rect x="55" y="25" width="34" height="34" fill="#f44336" rx="3"/>
  <text x="72" y="47" text-anchor="middle" font-size="11" fill="white">2</text>
  <rect x="95" y="25" width="34" height="34" fill="#4caf50" rx="3"/>
  <text x="112" y="47" text-anchor="middle" font-size="11" fill="white">3</text>
  <rect x="135" y="25" width="34" height="34" fill="#f44336" rx="3"/>
  <text x="152" y="47" text-anchor="middle" font-size="11" fill="white">4</text>
  <rect x="175" y="25" width="34" height="34" fill="#4caf50" rx="3"/>
  <text x="192" y="47" text-anchor="middle" font-size="11" fill="white">5</text>
  <rect x="215" y="25" width="34" height="34" fill="#4caf50" rx="3"/>
  <text x="232" y="47" text-anchor="middle" font-size="11" fill="white">6</text>
  <rect x="255" y="25" width="34" height="34" fill="#4caf50" rx="3"/>
  <text x="272" y="47" text-anchor="middle" font-size="11" fill="white">7</text>
  <text x="150" y="90" text-anchor="middle" font-size="10" fill="#333">빨강: 점유 / 초록: 빈 좌석</text>
</svg>

## 입력

첫째 줄에 관객 수 N과 좌석 수 M이 주어진다. 둘째 줄에 N명의 관객이 선호하는 좌석 번호가 순서대로 주어진다.

- 1 ≤ N ≤ M ≤ 1,000

## 출력

각 관객이 앉은 좌석 번호를 공백으로 구분하여 한 줄로 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 7\n3 3 3 3 3", expectedOutput: "3 2 4 1 5", isVisible: true },
      { input: "3 5\n1 2 3", expectedOutput: "1 2 3", isVisible: false },
      { input: "4 4\n2 2 2 2", expectedOutput: "2 1 3 4", isVisible: false },
      { input: "3 5\n5 5 5", expectedOutput: "5 4 3", isVisible: false },
    ],
    tags: ["구현"],
  },
];
