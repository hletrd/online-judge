export const problems = [
  // 1. 수족관 물 채우기
  {
    title: "수족관 물 채우기",
    description: `해양 탐험가 지수는 새로운 수족관을 설치했다. 수족관의 단면은 N개의 칸으로 나뉘어 있으며, 각 칸의 바닥 높이가 주어진다. 수족관에 물을 가득 채울 때 고이는 물의 총량을 구하시오.

물은 각 위치에서 왼쪽과 오른쪽 중 더 낮은 쪽의 최대 높이까지 채워진다. 즉, 각 칸에 고이는 물의 양은 (왼쪽 최대 높이와 오른쪽 최대 높이 중 작은 값) - (해당 칸의 높이)이며, 이 값이 0 이하이면 물이 고이지 않는다.

<svg width="360" height="130" viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="130" fill="#e3f2fd" rx="8"/>
  <rect x="20" y="80" width="30" height="30" fill="#78909c"/>
  <rect x="50" y="100" width="30" height="10" fill="#78909c"/>
  <rect x="80" y="60" width="30" height="50" fill="#78909c"/>
  <rect x="110" y="90" width="30" height="20" fill="#78909c"/>
  <rect x="140" y="70" width="30" height="40" fill="#78909c"/>
  <rect x="170" y="50" width="30" height="60" fill="#78909c"/>
  <rect x="50" y="60" width="30" height="40" fill="#42a5f5" opacity="0.6"/>
  <rect x="110" y="60" width="30" height="30" fill="#42a5f5" opacity="0.6"/>
  <text x="180" y="25" text-anchor="middle" font-size="13" fill="#1565c0" font-weight="bold">수족관 단면</text>
  <text x="35" y="120" text-anchor="middle" font-size="9" fill="white">3</text>
  <text x="65" y="108" text-anchor="middle" font-size="9" fill="white">1</text>
  <text x="95" y="90" text-anchor="middle" font-size="9" fill="white">5</text>
  <text x="125" y="98" text-anchor="middle" font-size="9" fill="white">2</text>
  <text x="155" y="98" text-anchor="middle" font-size="9" fill="white">4</text>
  <text x="185" y="80" text-anchor="middle" font-size="9" fill="white">6</text>
  <text x="110" y="50" text-anchor="middle" font-size="11" fill="#1565c0">물(파랑)</text>
</svg>

## 입력

첫째 줄에 칸의 수 N이 주어진다. 둘째 줄에 N개의 칸 높이가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 100,000
- 0 ≤ 각 칸의 높이 ≤ 100,000

## 출력

수족관에 고이는 물의 총량을 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n3 1 5 2 4 6", expectedOutput: "7", isVisible: true },
      { input: "4\n0 3 0 3", expectedOutput: "6", isVisible: false },
      { input: "3\n3 2 1", expectedOutput: "0", isVisible: false },
      { input: "8\n0 1 0 2 1 0 1 3", expectedOutput: "8", isVisible: false },
    ],
    tags: ["스택"],
  },

  // 2. 미로 속 보물찾기
  {
    title: "미로 속 보물찾기",
    description: `모험가 현우는 N×M 크기의 미로에 갇혀 있다. 미로 안에는 K개의 보물이 숨겨져 있다. 현우는 시작 지점에서 출발하여 모든 보물을 수집한 뒤 출구에 도달하고 싶다. 최소 이동 횟수를 구하시오.

현우는 상하좌우로 한 칸씩 이동할 수 있으며, 벽('#')은 이동할 수 없다. 시작 지점은 'S', 출구는 'E', 보물은 'T', 빈 칸은 '.'으로 표시된다. K는 최대 4이다.

<svg width="280" height="100" viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="100" fill="#f3e5f5" rx="6"/><text x="140" y="14" text-anchor="middle" font-size="11" fill="#6a1b9a" font-weight="bold">미로 + 보물</text><g transform="translate(50,20)"><rect width="180" height="70" fill="#bbb" rx="2"/><rect x="0" y="0" width="20" height="20" fill="#333"/><rect x="40" y="0" width="20" height="20" fill="#333"/><rect x="80" y="0" width="20" height="20" fill="#333"/><rect x="120" y="0" width="20" height="20" fill="#333"/><rect x="160" y="0" width="20" height="20" fill="#333"/><rect x="20" y="20" width="20" height="20" fill="#4caf50"/><text x="30" y="34" text-anchor="middle" font-size="9" fill="white">S</text><rect x="60" y="20" width="20" height="20" fill="#ffb300"/><text x="70" y="34" text-anchor="middle" font-size="9" fill="white">T</text><rect x="80" y="20" width="20" height="20" fill="#333"/><rect x="120" y="20" width="20" height="20" fill="#ffb300"/><text x="130" y="34" text-anchor="middle" font-size="9" fill="white">T</text><rect x="0" y="40" width="20" height="20" fill="#333"/><rect x="40" y="40" width="20" height="20" fill="#333"/><rect x="100" y="40" width="20" height="20" fill="#333"/><rect x="140" y="40" width="20" height="20" fill="#333"/><rect x="160" y="40" width="20" height="20" fill="#f44336"/><text x="170" y="54" text-anchor="middle" font-size="9" fill="white">E</text><rect x="0" y="60" width="180" height="10" fill="#333"/></g></svg>

## 입력

첫째 줄에 N, M, K가 공백으로 구분되어 주어진다. 다음 N줄에 미로가 주어진다.

- 3 ≤ N, M ≤ 50
- 1 ≤ K ≤ 4

## 출력

모든 보물을 수집하고 출구에 도달하는 최소 이동 횟수를 출력한다. 불가능하면 -1을 출력한다.`,
    difficulty: 7.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "5 5 1\nS....\n.###.\n..T..\n.###.\n....E", expectedOutput: "12", isVisible: true },
      { input: "3 7 2\nS.T....\n.......\n.....TE", expectedOutput: "12", isVisible: false },
      { input: "3 3 1\nS#T\n###\n..E", expectedOutput: "-1", isVisible: false },
      { input: "3 5 1\nS.T..\n.....\n....E", expectedOutput: "8", isVisible: false },
    ],
    tags: ["BFS", "DP", "비트마스크"],
  },

  // 3. 교통 체증
  {
    title: "교통 체증",
    description: `도시 계획가 민아는 N개의 교차로와 M개의 도로로 이루어진 도시의 교통 체증을 분석하고 있다. 각 도로는 방향이 있으며, 이동에 걸리는 시간이 주어진다. 교차로 1번에서 N번까지의 최단 경로를 구하시오.

이동할 수 없는 경우에는 -1을 출력한다.

<svg width="280" height="110" viewBox="0 0 280 110" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="110" fill="#e8f5e9" rx="6"/><text x="140" y="14" text-anchor="middle" font-size="11" fill="#1b5e20" font-weight="bold">교차로 지도</text><line x1="54" y1="60" x2="118" y2="44" stroke="#555" stroke-width="2"/><line x1="54" y1="70" x2="118" y2="86" stroke="#555" stroke-width="2"/><line x1="150" y1="48" x2="220" y2="60" stroke="#555" stroke-width="2"/><line x1="150" y1="88" x2="220" y2="76" stroke="#555" stroke-width="2"/><line x1="135" y1="55" x2="135" y2="79" stroke="#555" stroke-width="2"/><text x="82" y="42" text-anchor="middle" font-size="10" fill="#333">2</text><text x="82" y="90" text-anchor="middle" font-size="10" fill="#333">5</text><text x="188" y="48" text-anchor="middle" font-size="10" fill="#333">3</text><text x="188" y="92" text-anchor="middle" font-size="10" fill="#333">4</text><text x="148" y="70" text-anchor="middle" font-size="10" fill="#333">1</text><circle cx="40" cy="65" r="14" fill="#2196f3"/><text x="40" y="70" text-anchor="middle" font-size="11" fill="white">1</text><circle cx="135" cy="42" r="14" fill="#4caf50"/><text x="135" y="47" text-anchor="middle" font-size="11" fill="white">2</text><circle cx="135" cy="92" r="14" fill="#4caf50"/><text x="135" y="97" text-anchor="middle" font-size="11" fill="white">3</text><circle cx="236" cy="68" r="14" fill="#f44336"/><text x="236" y="73" text-anchor="middle" font-size="11" fill="white">4</text></svg>

## 입력

첫째 줄에 교차로의 수 N과 도로의 수 M이 공백으로 구분되어 주어진다. 다음 M줄에 도로 정보 u, v, w가 주어진다. 교차로 u에서 v로 이동하는 데 w의 시간이 걸린다.

- 1 ≤ N ≤ 20,000
- 1 ≤ M ≤ 300,000
- 1 ≤ w ≤ 10,000

## 출력

교차로 1번에서 N번까지의 최단 시간을 출력한다. 이동할 수 없으면 -1을 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 5\n1 2 2\n1 3 5\n2 3 1\n2 4 3\n3 4 4", expectedOutput: "5", isVisible: true },
      { input: "2 1\n1 2 7", expectedOutput: "7", isVisible: false },
      { input: "3 2\n1 2 1\n1 3 4", expectedOutput: "4", isVisible: false },
      { input: "3 2\n1 2 3\n2 1 2", expectedOutput: "-1", isVisible: false },
    ],
    tags: ["다익스트라"],
  },

  // 4. 과수원
  {
    title: "과수원",
    description: `농부 태호는 N×M 크기의 과수원을 운영하고 있다. 각 칸에는 일정한 수의 과일이 열려 있다. 태호는 과수원의 왼쪽 위(1, 1)에서 오른쪽 아래(N, M)로 이동하면서 과일을 수확하려 한다.

이동은 오른쪽 또는 아래쪽으로만 가능하다. 경로 위에 있는 모든 칸의 과일을 수확할 때, 수확량이 최대가 되는 경로를 선택하시오. 최대 수확량을 출력한다.

<svg width="260" height="110" viewBox="0 0 260 110" xmlns="http://www.w3.org/2000/svg"><rect width="260" height="110" fill="#f9fbe7" rx="6"/><text x="130" y="14" text-anchor="middle" font-size="11" fill="#33691e" font-weight="bold">과수원 (우/하 이동)</text><g transform="translate(65,22)"><rect x="0" y="0" width="40" height="36" fill="#aed581"/><text x="20" y="23" text-anchor="middle" font-size="12" fill="#33691e">3</text><rect x="40" y="0" width="40" height="36" fill="#dce775"/><text x="60" y="23" text-anchor="middle" font-size="12" fill="#33691e">1</text><rect x="80" y="0" width="40" height="36" fill="#aed581"/><text x="100" y="23" text-anchor="middle" font-size="12" fill="#33691e">2</text><rect x="0" y="36" width="40" height="36" fill="#dce775"/><text x="20" y="59" text-anchor="middle" font-size="12" fill="#33691e">2</text><rect x="40" y="36" width="40" height="36" fill="#aed581"/><text x="60" y="59" text-anchor="middle" font-size="12" fill="#33691e">4</text><rect x="80" y="36" width="40" height="36" fill="#dce775"/><text x="100" y="59" text-anchor="middle" font-size="12" fill="#33691e">3</text><polyline points="0,0 40,0 40,36 120,36 120,72" fill="none" stroke="#f44336" stroke-width="2"/></g><text x="130" y="104" text-anchor="middle" font-size="10" fill="#f44336">최적 경로</text></svg>

## 입력

첫째 줄에 과수원의 크기 N, M이 공백으로 구분되어 주어진다. 다음 N줄에 각 행의 과일 수가 공백으로 구분되어 주어진다.

- 1 ≤ N, M ≤ 1,000
- 0 ≤ 각 칸의 과일 수 ≤ 100

## 출력

수확할 수 있는 과일의 최댓값을 출력한다.`,
    difficulty: 4.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 3\n3 1 2\n2 4 3", expectedOutput: "12", isVisible: true },
      { input: "1 1\n5", expectedOutput: "5", isVisible: false },
      { input: "3 3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "29", isVisible: false },
      { input: "2 2\n1 3\n2 4", expectedOutput: "8", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 5. 로봇 경로 계획
  {
    title: "로봇 경로 계획",
    description: `로봇 공학자 수현은 N×M 격자 위에서 움직이는 로봇을 설계하고 있다. 로봇은 (1, 1)에서 출발하여 (N, M)에 도달해야 한다. 격자 위의 일부 칸에는 장애물이 있어 지나갈 수 없다.

로봇은 오른쪽 또는 아래쪽으로만 이동할 수 있다. (1, 1)에서 (N, M)까지 이동하는 경로의 수를 10^9+7로 나눈 나머지를 구하시오.

<svg width="360" height="130" viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="130" fill="#e8eaf6" rx="8"/>
  <text x="180" y="22" text-anchor="middle" font-size="13" fill="#283593" font-weight="bold">격자 위의 로봇</text>
  <g transform="translate(95,30)">
    <rect x="0" y="0" width="40" height="40" fill="#7986cb" stroke="#fff" stroke-width="1" rx="2"/>
    <text x="20" y="26" text-anchor="middle" font-size="18">🤖</text>
    <rect x="40" y="0" width="40" height="40" fill="#9fa8da" stroke="#fff" stroke-width="1" rx="2"/>
    <rect x="80" y="0" width="40" height="40" fill="#333" stroke="#fff" stroke-width="1" rx="2"/>
    <text x="100" y="26" text-anchor="middle" font-size="14" fill="white">■</text>
    <rect x="120" y="0" width="40" height="40" fill="#9fa8da" stroke="#fff" stroke-width="1" rx="2"/>
    <rect x="0" y="40" width="40" height="40" fill="#9fa8da" stroke="#fff" stroke-width="1" rx="2"/>
    <rect x="40" y="40" width="40" height="40" fill="#9fa8da" stroke="#fff" stroke-width="1" rx="2"/>
    <rect x="80" y="40" width="40" height="40" fill="#9fa8da" stroke="#fff" stroke-width="1" rx="2"/>
    <rect x="120" y="40" width="40" height="40" fill="#7986cb" stroke="#fff" stroke-width="1" rx="2"/>
    <text x="140" y="66" text-anchor="middle" font-size="12" fill="white" font-weight="bold">도착</text>
  </g>
</svg>

## 입력

첫째 줄에 격자의 크기 N, M이 공백으로 구분되어 주어진다. 다음 N줄에 격자 정보가 주어진다. 0은 빈 칸, 1은 장애물이다.

- 1 ≤ N, M ≤ 1,000

## 출력

경로의 수를 10^9+7로 나눈 나머지를 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 4\n0 0 1 0\n0 0 0 0", expectedOutput: "3", isVisible: true },
      { input: "2 2\n0 0\n0 0", expectedOutput: "2", isVisible: false },
      { input: "3 3\n0 0 0\n0 1 0\n0 0 0", expectedOutput: "2", isVisible: false },
      { input: "2 2\n0 1\n0 0", expectedOutput: "1", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 6. 탈출용 뗏목
  {
    title: "탈출용 뗏목",
    description: `무인도에 조난당한 N명의 생존자들이 탈출을 준비하고 있다. 탈출용 뗏목은 한 번에 최대 2명이 탈 수 있으며, 무게 제한이 C 킬로그램이다. 각 생존자의 몸무게가 주어질 때, 모든 생존자가 탈출하는 데 필요한 최소 뗏목 운행 횟수를 구하시오.

뗏목을 조종하는 사람은 항상 1명이 필요하다. 뗏목이 반대편 해안에 도착한 뒤 다시 돌아올 때도 1명이 타야 한다.

<svg width="360" height="130" viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="130" fill="#e0f7fa" rx="8"/>
  <text x="180" y="22" text-anchor="middle" font-size="13" fill="#006064" font-weight="bold">탈출용 뗏목</text>
  <rect x="10" y="90" width="60" height="20" fill="#8d6e63" rx="4"/>
  <text x="40" y="105" text-anchor="middle" font-size="10" fill="white">출발 해안</text>
  <rect x="290" y="90" width="60" height="20" fill="#8d6e63" rx="4"/>
  <text x="320" y="105" text-anchor="middle" font-size="10" fill="white">도착 해안</text>
  <rect x="155" y="80" width="50" height="18" fill="#a5d6a7" rx="6" stroke="#388e3c" stroke-width="1"/>
  <text x="180" y="93" text-anchor="middle" font-size="10" fill="#1b5e20">뗏목</text>
  <line x1="70" y1="97" x2="290" y2="97" stroke="#29b6f6" stroke-width="3" stroke-dasharray="8,4"/>
  <text x="40" y="60" text-anchor="middle" font-size="20">👤👤👤</text>
  <text x="40" y="78" text-anchor="middle" font-size="10" fill="#333">대기</text>
  <text x="320" y="60" text-anchor="middle" font-size="20">👤</text>
  <text x="320" y="78" text-anchor="middle" font-size="10" fill="#333">탈출</text>
</svg>

## 입력

첫째 줄에 생존자의 수 N과 무게 제한 C가 공백으로 구분되어 주어진다. 둘째 줄에 N명의 몸무게가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 50,000
- 1 ≤ C ≤ 240,000,000
- 각 생존자의 몸무게는 C 이하의 양의 정수이다.

## 출력

모든 생존자가 탈출하는 데 필요한 최소 뗏목 운행 횟수를 출력한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "4 100\n50 50 90 90", expectedOutput: "5", isVisible: true },
      { input: "3 100\n40 50 60", expectedOutput: "3", isVisible: false },
      { input: "1 100\n70", expectedOutput: "1", isVisible: false },
      { input: "5 100\n30 40 50 60 70", expectedOutput: "6", isVisible: false },
    ],
    tags: ["그리디", "투 포인터"],
  },

  // 7. 마을 축제
  {
    title: "마을 축제",
    description: `왕국에는 N개의 마을이 있으며, 트리 구조로 연결되어 있다. 각 마을에는 일정한 인구가 있다. 왕은 연속적으로 연결된 K개의 마을을 선택하여 축제를 열고자 한다. 선택된 마을들은 트리에서 연결된 서브트리를 이루어야 한다.

선택된 마을들의 인구 합이 최대가 되도록 K개의 마을을 선택할 때, 그 최댓값을 구하시오.

<svg width="300" height="130" viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="130" fill="#fff8e1" rx="8"/>
  <text x="150" y="16" text-anchor="middle" font-size="12" fill="#e65100" font-weight="bold">마을 트리</text>
  <line x1="150" y1="42" x2="80" y2="80" stroke="#555" stroke-width="2"/>
  <line x1="150" y1="42" x2="220" y2="80" stroke="#555" stroke-width="2"/>
  <line x1="80" y1="80" x2="45" y2="112" stroke="#555" stroke-width="2"/>
  <line x1="80" y1="80" x2="115" y2="112" stroke="#555" stroke-width="2"/>
  <line x1="220" y1="80" x2="255" y2="112" stroke="#555" stroke-width="2"/>
  <circle cx="150" cy="34" r="16" fill="#ff9800"/><text x="150" y="31" text-anchor="middle" font-size="8" fill="white">1·5명</text>
  <circle cx="80" cy="80" r="16" fill="#ffc107"/><text x="80" y="77" text-anchor="middle" font-size="8" fill="white">2·3명</text>
  <circle cx="220" cy="80" r="16" fill="#ffc107"/><text x="220" y="77" text-anchor="middle" font-size="8" fill="white">3·7명</text>
  <circle cx="45" cy="112" r="14" fill="#ffe082"/><text x="45" y="116" text-anchor="middle" font-size="8" fill="#333">4·2명</text>
  <circle cx="115" cy="112" r="14" fill="#ffe082"/><text x="115" y="116" text-anchor="middle" font-size="8" fill="#333">5·4명</text>
  <circle cx="255" cy="112" r="14" fill="#ffe082"/><text x="255" y="116" text-anchor="middle" font-size="8" fill="#333">6·6명</text>
</svg>

## 입력

첫째 줄에 마을의 수 N과 선택할 마을의 수 K가 공백으로 구분되어 주어진다. 둘째 줄에 N개의 마을 인구가 공백으로 구분되어 주어진다. 다음 N-1줄에 트리의 간선 정보가 주어진다.

- 1 ≤ K ≤ N ≤ 1,000

## 출력

선택된 K개의 연결된 마을의 인구 합 최댓값을 출력한다.`,
    difficulty: 7.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 3\n5 3 7 2 4 6\n1 2\n1 3\n2 4\n2 5\n3 6", expectedOutput: "18", isVisible: true },
      { input: "3 2\n1 2 3\n1 2\n2 3", expectedOutput: "5", isVisible: false },
      { input: "1 1\n10", expectedOutput: "10", isVisible: false },
      { input: "5 3\n3 5 2 4 1\n1 2\n1 3\n3 4\n3 5", expectedOutput: "11", isVisible: false },
    ],
    tags: ["트리", "DP"],
  },

  // 8. 동전 수집 게임
  {
    title: "동전 수집 게임",
    description: `게임 개발자 도현은 N×N 격자 위에 동전을 놓았다. 각 칸에는 0개 이상의 동전이 있다. 플레이어는 두 명이 동시에 (1, 1)에서 출발하여 (N, N)을 향해 이동한다. 두 플레이어는 각자 오른쪽 또는 아래쪽으로 한 칸씩 이동한다.

같은 칸에 있는 동전은 한 번만 수집된다. 두 플레이어가 수집하는 동전의 합이 최대가 되도록 할 때, 그 최댓값을 구하시오.

<svg width="260" height="105" viewBox="0 0 260 105" xmlns="http://www.w3.org/2000/svg"><rect width="260" height="105" fill="#fce4ec" rx="6"/><text x="130" y="14" text-anchor="middle" font-size="11" fill="#880e4f" font-weight="bold">동전 수집 (두 경로)</text><g transform="translate(65,22)"><rect x="0" y="0" width="32" height="32" fill="#f48fb1"/><text x="16" y="21" text-anchor="middle" font-size="12" fill="#880e4f">3</text><rect x="32" y="0" width="32" height="32" fill="#f8bbd0"/><text x="48" y="21" text-anchor="middle" font-size="12" fill="#880e4f">2</text><rect x="64" y="0" width="32" height="32" fill="#f48fb1"/><text x="80" y="21" text-anchor="middle" font-size="12" fill="#880e4f">1</text><rect x="96" y="0" width="32" height="32" fill="#f8bbd0"/><text x="112" y="21" text-anchor="middle" font-size="12" fill="#880e4f">0</text><rect x="0" y="32" width="32" height="32" fill="#f8bbd0"/><text x="16" y="53" text-anchor="middle" font-size="12" fill="#880e4f">1</text><rect x="32" y="32" width="32" height="32" fill="#f48fb1"/><text x="48" y="53" text-anchor="middle" font-size="12" fill="#880e4f">4</text><rect x="64" y="32" width="32" height="32" fill="#f8bbd0"/><text x="80" y="53" text-anchor="middle" font-size="12" fill="#880e4f">2</text><rect x="96" y="32" width="32" height="32" fill="#f48fb1"/><text x="112" y="53" text-anchor="middle" font-size="12" fill="#880e4f">3</text></g><text x="130" y="98" text-anchor="middle" font-size="10" fill="#880e4f">같은 칸 동전은 1회만 수집</text></svg>

## 입력

첫째 줄에 격자의 크기 N이 주어진다. 다음 N줄에 각 행의 동전 수가 공백으로 구분되어 주어진다.

- 1 ≤ N ≤ 50
- 0 ≤ 각 칸의 동전 수 ≤ 100

## 출력

두 플레이어가 수집하는 동전의 합의 최댓값을 출력한다.`,
    difficulty: 6.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2\n3 2\n1 4", expectedOutput: "9", isVisible: true },
      { input: "1\n5", expectedOutput: "5", isVisible: false },
      { input: "3\n0 3 0\n3 0 3\n0 3 0", expectedOutput: "9", isVisible: false },
      { input: "3\n1 1 1\n1 1 1\n1 1 1", expectedOutput: "8", isVisible: false },
    ],
    tags: ["DP"],
  },

  // 9. 공항 수하물
  {
    title: "공항 수하물",
    description: `공항 직원 유진은 원형 수하물 컨베이어 벨트를 담당하고 있다. 컨베이어 벨트에는 N개의 수하물이 놓여 있고, 각 수하물의 위치 번호(0번~N-1번)와 목적지 번호가 주어진다. 유진이 서 있는 위치는 0번이다.

수하물을 정해진 목적지 칸으로 이동시키려 한다. 각 수하물은 현재 위치에서 시계 방향 또는 반시계 방향으로 이동할 수 있다. 모든 수하물을 목적지로 이동시키기 위해 필요한 최소 총 이동 칸 수를 구하시오.

<svg width="360" height="140" viewBox="0 0 360 140" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="140" fill="#f3e5f5" rx="8"/>
  <text x="180" y="22" text-anchor="middle" font-size="13" fill="#4a148c" font-weight="bold">원형 컨베이어 벨트</text>
  <circle cx="180" cy="82" r="50" fill="none" stroke="#7b1fa2" stroke-width="6"/>
  <circle cx="180" cy="32" r="10" fill="#7b1fa2"/>
  <text x="180" y="37" text-anchor="middle" font-size="9" fill="white">0</text>
  <circle cx="230" cy="82" r="10" fill="#ab47bc"/>
  <text x="230" y="87" text-anchor="middle" font-size="9" fill="white">1</text>
  <circle cx="180" cy="132" r="10" fill="#ab47bc"/>
  <text x="180" y="137" text-anchor="middle" font-size="9" fill="white">2</text>
  <circle cx="130" cy="82" r="10" fill="#ab47bc"/>
  <text x="130" y="87" text-anchor="middle" font-size="9" fill="white">3</text>
  <path d="M 200 38 A 50 50 0 0 1 226 66" fill="none" stroke="#ff5722" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="245" y="55" font-size="10" fill="#ff5722">이동</text>
</svg>

## 입력

첫째 줄에 컨베이어 벨트 칸의 수 N과 수하물의 수 M이 공백으로 구분되어 주어진다. 다음 M줄에 각 수하물의 현재 위치와 목적지가 공백으로 구분되어 주어진다.

- 2 ≤ N ≤ 100,000
- 1 ≤ M ≤ N
- 현재 위치와 목적지는 서로 다르다.

## 출력

각 수하물을 목적지로 이동시키는 최소 이동 칸 수의 합을 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "8 3\n1 5\n3 7\n0 4", expectedOutput: "12", isVisible: true },
      { input: "6 2\n1 4\n2 5", expectedOutput: "6", isVisible: false },
      { input: "10 2\n0 9\n5 1", expectedOutput: "5", isVisible: false },
      { input: "4 2\n1 3\n0 2", expectedOutput: "4", isVisible: false },
    ],
    tags: ["구현"],
  },

  // 10. 마법의 숲
  {
    title: "마법의 숲",
    description: `마법사 서연은 마법의 숲을 탐험하고 있다. 숲은 트리 구조로 연결된 N개의 나무로 이루어져 있으며, 루트 노드는 1번이다. 각 간선을 지날 때마다 에너지 포인트를 획득할 수 있다.

루트에서 출발하여 임의의 리프 노드까지 이동할 때, 획득하는 에너지 포인트의 합이 최대가 되는 경로를 찾으시오. 최대 에너지 포인트 합을 출력한다.

<svg width="240" height="105" viewBox="0 0 240 105" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="105" fill="#e8f5e9" rx="6"/><text x="120" y="13" text-anchor="middle" font-size="11" fill="#1b5e20" font-weight="bold">마법의 숲 트리</text><g stroke="#388e3c" stroke-width="2"><line x1="120" y1="32" x2="65" y2="64"/><line x1="120" y1="32" x2="175" y2="64"/><line x1="65" y1="64" x2="38" y2="90"/><line x1="65" y1="64" x2="92" y2="90"/><line x1="175" y1="64" x2="202" y2="90"/></g><g font-size="9" fill="#1565c0" text-anchor="middle"><text x="88" y="50">4</text><text x="152" y="50">7</text><text x="44" y="80">2</text><text x="82" y="80">5</text><text x="194" y="80">3</text></g><circle cx="120" cy="25" r="11" fill="#66bb6a"/><text x="120" y="29" text-anchor="middle" font-size="9" fill="white">1</text><circle cx="65" cy="64" r="11" fill="#81c784"/><text x="65" y="68" text-anchor="middle" font-size="9" fill="white">2</text><circle cx="175" cy="64" r="11" fill="#81c784"/><text x="175" y="68" text-anchor="middle" font-size="9" fill="white">3</text><circle cx="38" cy="90" r="9" fill="#a5d6a7"/><text x="38" y="94" text-anchor="middle" font-size="9" fill="#333">4</text><circle cx="92" cy="90" r="9" fill="#a5d6a7"/><text x="92" y="94" text-anchor="middle" font-size="9" fill="#333">5</text><circle cx="202" cy="90" r="9" fill="#a5d6a7"/><text x="202" y="94" text-anchor="middle" font-size="9" fill="#333">6</text></svg>

## 입력

첫째 줄에 나무의 수 N이 주어진다. 다음 N-1줄에 간선 정보 u, v, w가 주어진다. u와 v를 연결하는 간선의 에너지 포인트는 w이다.

- 1 ≤ N ≤ 100,000
- 1 ≤ w ≤ 10,000

## 출력

루트에서 리프까지의 최대 에너지 포인트 합을 출력한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6\n1 2 4\n1 3 7\n2 4 2\n2 5 5\n3 6 3", expectedOutput: "10", isVisible: true },
      { input: "1", expectedOutput: "0", isVisible: false },
      { input: "3\n1 2 5\n1 3 3", expectedOutput: "5", isVisible: false },
      { input: "4\n1 2 1\n2 3 2\n2 4 9", expectedOutput: "10", isVisible: false },
    ],
    tags: ["트리", "DFS"],
  },

  // 11. 해변 파라솔
  {
    title: "해변 파라솔",
    description: `여름 여행자 민준은 L미터 길이의 해변을 방문했다. 해변에는 N개의 파라솔이 설치되어 있으며, 각 파라솔은 특정 구간에 그늘을 만든다. 파라솔이 만드는 그늘 구간이 주어질 때, 해변 중에서 그늘이 생기지 않는 구간의 총 길이를 구하시오.

해변은 0에서 L까지의 구간으로 나타낸다.

<svg width="360" height="110" viewBox="0 0 360 110" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="110" fill="#e3f2fd" rx="8"/>
  <text x="180" y="22" text-anchor="middle" font-size="13" fill="#0d47a1" font-weight="bold">해변 파라솔</text>
  <rect x="20" y="60" width="320" height="15" fill="#f9a825" rx="4"/>
  <text x="20" y="90" font-size="10" fill="#333">0</text>
  <text x="175" y="90" font-size="10" fill="#333">L/2</text>
  <text x="334" y="90" font-size="10" fill="#333">L</text>
  <rect x="50" y="40" width="80" height="12" fill="#1565c0" rx="3" opacity="0.7"/>
  <text x="90" y="35" text-anchor="middle" font-size="10" fill="#1565c0">그늘 1</text>
  <rect x="160" y="40" width="100" height="12" fill="#1565c0" rx="3" opacity="0.7"/>
  <text x="210" y="35" text-anchor="middle" font-size="10" fill="#1565c0">그늘 2</text>
  <rect x="280" y="40" width="40" height="12" fill="#1565c0" rx="3" opacity="0.7"/>
  <text x="300" y="35" text-anchor="middle" font-size="10" fill="#1565c0">그늘 3</text>
  <rect x="20" y="60" width="30" height="15" fill="#ffca28" rx="2"/>
  <rect x="340" y="60" width="0" height="15" fill="#ffca28" rx="2"/>
  <text x="180" y="108" text-anchor="middle" font-size="10" fill="#f44336">그늘 없는 구간(노란색)</text>
</svg>

## 입력

첫째 줄에 해변의 길이 L과 파라솔의 수 N이 공백으로 구분되어 주어진다. 다음 N줄에 각 파라솔의 그늘 시작 위치와 끝 위치가 공백으로 구분되어 주어진다.

- 1 ≤ L ≤ 1,000,000,000
- 1 ≤ N ≤ 200,000
- 0 ≤ 시작 위치 < 끝 위치 ≤ L

## 출력

그늘이 생기지 않는 구간의 총 길이를 출력한다.`,
    difficulty: 5.0,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "20 3\n2 8\n10 16\n18 20", expectedOutput: "6", isVisible: true },
      { input: "10 1\n0 10", expectedOutput: "0", isVisible: false },
      { input: "10 2\n1 3\n7 9", expectedOutput: "6", isVisible: false },
      { input: "15 3\n0 5\n3 8\n10 12", expectedOutput: "5", isVisible: false },
    ],
    tags: ["정렬"],
  },

  // 12. 게임 서버 매칭
  {
    title: "게임 서버 매칭",
    description: `게임 서버 운영자 지현은 N명의 플레이어를 K명씩 팀으로 나누어 매칭하려 한다. 단, N은 K의 배수이다. 각 플레이어의 실력 점수가 주어질 때, 한 팀 내에서 최고 점수와 최저 점수의 차이의 최대가 최소가 되도록 팀을 구성하시오.

팀 내 점수 차이의 최댓값(모든 팀 중)이 최소가 되는 값을 출력한다.

<svg width="360" height="120" viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="120" fill="#e8eaf6" rx="8"/>
  <text x="180" y="22" text-anchor="middle" font-size="13" fill="#283593" font-weight="bold">플레이어 매칭</text>
  <rect x="20" y="35" width="60" height="50" fill="#7986cb" rx="6"/>
  <text x="50" y="58" text-anchor="middle" font-size="11" fill="white" font-weight="bold">팀 1</text>
  <text x="50" y="74" text-anchor="middle" font-size="10" fill="#e8eaf6">80, 85</text>
  <rect x="100" y="35" width="60" height="50" fill="#7986cb" rx="6"/>
  <text x="130" y="58" text-anchor="middle" font-size="11" fill="white" font-weight="bold">팀 2</text>
  <text x="130" y="74" text-anchor="middle" font-size="10" fill="#e8eaf6">90, 95</text>
  <rect x="180" y="35" width="60" height="50" fill="#5c6bc0" rx="6"/>
  <text x="210" y="58" text-anchor="middle" font-size="11" fill="white" font-weight="bold">팀 3</text>
  <text x="210" y="74" text-anchor="middle" font-size="10" fill="#e8eaf6">70, 75</text>
  <text x="290" y="60" text-anchor="middle" font-size="11" fill="#283593">최대 차이</text>
  <text x="290" y="78" text-anchor="middle" font-size="14" fill="#f44336" font-weight="bold">5</text>
</svg>

## 입력

첫째 줄에 플레이어의 수 N과 팀 크기 K가 공백으로 구분되어 주어진다. 둘째 줄에 N명의 점수가 공백으로 구분되어 주어진다.

- 1 ≤ K ≤ N ≤ 100,000
- N은 K의 배수이다.
- 1 ≤ 각 점수 ≤ 1,000,000

## 출력

모든 팀 중 팀 내 최고 점수와 최저 점수 차이의 최댓값의 최솟값을 출력한다.`,
    difficulty: 4.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "6 2\n70 75 80 85 90 95", expectedOutput: "5", isVisible: true },
      { input: "4 2\n1 2 3 4", expectedOutput: "1", isVisible: false },
      { input: "3 3\n5 10 15", expectedOutput: "10", isVisible: false },
      { input: "4 4\n3 7 1 5", expectedOutput: "6", isVisible: false },
    ],
    tags: ["정렬", "그리디"],
  },

  // 13. 공 굴리기
  {
    title: "공 굴리기",
    description: `물리학자 재원은 N×M 격자 위에서 공을 굴리는 실험을 하고 있다. 격자의 일부 칸에는 벽이 있다. 공은 상하좌우 중 한 방향으로 굴러가며, 벽이나 격자 경계에 부딪힐 때까지 계속 움직인다.

출발 위치와 도착 위치가 주어질 때, 도착 위치에 공이 멈추도록 하는 최소 굴리기 횟수를 구하시오. 공은 반드시 굴러서 멈춰야 한다(출발 위치와 도착 위치가 같으면 이동 횟수는 0이다).

<svg width="240" height="85" viewBox="0 0 240 85" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="85" fill="#fff3e0" rx="6"/><text x="120" y="13" text-anchor="middle" font-size="11" fill="#bf360c" font-weight="bold">공 굴리기</text><g transform="translate(10,20)"><rect width="220" height="22" fill="#ffe0b2"/><rect x="22" y="0" width="22" height="22" fill="#555"/><rect x="110" y="0" width="22" height="22" fill="#555"/><rect width="220" height="22" fill="none" stroke="#ccc"/><rect y="22" width="220" height="22" fill="#ffe0b2"/><rect x="88" y="22" width="22" height="22" fill="#555"/><rect x="132" y="22" width="22" height="22" fill="#4caf50"/><text x="143" y="37" text-anchor="middle" font-size="8" fill="white">E</text><circle cx="11" cy="11" r="9" fill="#ff5722"/><text x="11" y="15" text-anchor="middle" font-size="7" fill="white">공</text><line x1="23" y1="11" x2="87" y2="11" stroke="#ff5722" stroke-width="1.5" stroke-dasharray="3,2"/></g><text x="120" y="78" text-anchor="middle" font-size="10" fill="#555">BFS 최소 굴리기</text></svg>

## 입력

첫째 줄에 격자의 크기 N, M이 공백으로 구분되어 주어진다. 다음 N줄에 격자 정보가 주어진다. 0은 빈 칸, 1은 벽이다. 마지막 줄에 출발 위치와 도착 위치 (sr, sc, er, ec)가 공백으로 구분되어 주어진다. 위치는 0-indexed이다.

- 1 ≤ N, M ≤ 100
- 출발 위치와 도착 위치는 빈 칸이다.

## 출력

최소 굴리기 횟수를 출력한다. 도달 불가능하면 -1을 출력한다.`,
    difficulty: 5.5,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    comparisonMode: "exact",
    floatAbsoluteError: null,
    testCases: [
      { input: "2 7\n0 1 0 0 0 1 0\n0 0 0 0 1 0 0\n1 0 1 6", expectedOutput: "2", isVisible: true },
      { input: "3 3\n0 0 0\n0 1 0\n0 0 0\n0 0 2 2", expectedOutput: "2", isVisible: false },
      { input: "2 2\n0 0\n0 0\n0 0 0 1", expectedOutput: "1", isVisible: false },
      { input: "3 5\n0 0 1 0 0\n0 0 0 0 0\n0 0 1 0 0\n0 0 2 4", expectedOutput: "3", isVisible: false },
    ],
    tags: ["BFS"],
  },
];
