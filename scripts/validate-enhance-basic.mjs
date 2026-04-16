#!/usr/bin/env node
/**
 * validate-enhance-basic.mjs
 * Validates and enhances test cases for basic problems (sequence 1-200)
 * on algo.xylolabs.com
 */

const BASE_URL = 'https://algo.xylolabs.com';
const API_KEY = 'jk_d74b5170d9202945aa32a033c0b33b0bf106d1b7';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

// Rate limiting helpers
let requestCount = 0;
async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
async function rateLimit() {
  requestCount++;
  await sleep(400);
  if (requestCount % 10 === 0) await sleep(2000);
}

async function fetchWithRetry(url, opts = {}, retries = 4) {
  for (let i = 0; i < retries; i++) {
    await sleep(400 + i * 800);
    const res = await fetch(url, { headers, ...opts });
    if (res.status === 502 || res.status === 503 || res.status === 504) {
      console.log(`    [retry ${i + 1}/${retries}] ${res.status} for ${url}`);
      continue;
    }
    return res;
  }
  throw new Error(`Max retries exceeded for ${url}`);
}

async function fetchProblems(page) {
  requestCount++;
  if (requestCount % 10 === 0) await sleep(2000);
  const res = await fetchWithRetry(`${BASE_URL}/api/v1/problems?page=${page}&limit=50`);
  if (!res.ok) throw new Error(`Fetch problems page ${page}: ${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchProblem(id) {
  requestCount++;
  if (requestCount % 10 === 0) await sleep(2000);
  const res = await fetchWithRetry(`${BASE_URL}/api/v1/problems/${id}`);
  if (!res.ok) throw new Error(`Fetch problem ${id}: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.data || json;
}

async function patchProblem(id, testCases) {
  requestCount++;
  if (requestCount % 10 === 0) await sleep(2000);
  const res = await fetchWithRetry(`${BASE_URL}/api/v1/problems/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ testCases, allowLockedTestCases: true }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Patch problem ${id}: ${res.status} ${res.statusText} - ${body}`);
  }
  return res.json();
}

// ─── Computation helpers ───────────────────────────────────────────────────

function gcd(a, b) {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function sieve(n) {
  const is = new Array(n + 1).fill(true);
  is[0] = is[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (is[i]) for (let j = i * i; j <= n; j += i) is[j] = false;
  }
  return is;
}

function factorial(n) {
  if (n <= 1) return 1n;
  let r = 1n;
  for (let i = 2n; i <= BigInt(n); i++) r *= i;
  return r;
}

// ─── Build additional test cases per problem title ─────────────────────────

function buildAdditionalTestCases(problem) {
  const { title, description, testCases: existing } = problem;
  const extra = [];

  function hasInput(inp) {
    return existing.some(tc => tc.input.trim() === inp.trim());
  }

  // ─── Batch 1: 입출력/사칙연산/조건문 ─────────────────────────────────────

  if (title === '정수 출력') {
    if (!hasInput('-10000')) extra.push({ input: '-10000', expectedOutput: '-10000', isVisible: false });
  }

  if (title === 'A+B (3)') {
    if (!hasInput('-1000000000 -1000000000'))
      extra.push({ input: '-1000000000 -1000000000', expectedOutput: '-2000000000', isVisible: false });
  }

  if (title === 'N개 정수의 평균') {
    // max N=100 with all 1000
    const arr = Array(100).fill(1000);
    if (!hasInput(`100\n${arr.join(' ')}`))
      extra.push({ input: `100\n${arr.join(' ')}`, expectedOutput: '1000.00', isVisible: false });
  }

  if (title === '거듭제곱') {
    if (!hasInput('10 15')) extra.push({ input: '10 15', expectedOutput: '1000000000000000', isVisible: false });
  }

  if (title === '세 수 오름차순 정렬') {
    if (!hasInput('-10000 10000 0'))
      extra.push({ input: '-10000 10000 0', expectedOutput: '-10000 0 10000', isVisible: false });
  }

  // ─── Batch 2: 반복문 ──────────────────────────────────────────────────────

  if (title === '1부터 N까지 출력') {
    if (!hasInput('100')) {
      const out = Array.from({length: 100}, (_, i) => i + 1).join('\n');
      extra.push({ input: '100', expectedOutput: out, isVisible: false });
    }
  }

  if (title === 'N부터 1까지 출력') {
    if (!hasInput('100')) {
      const out = Array.from({length: 100}, (_, i) => 100 - i).join('\n');
      extra.push({ input: '100', expectedOutput: out, isVisible: false });
    }
  }

  if (title === '1부터 N까지의 합') {
    // max N=10000 → sum = 10000*10001/2 = 50005000
    if (!hasInput('10000'))
      extra.push({ input: '10000', expectedOutput: '50005000', isVisible: false });
  }

  if (title === '1부터 N까지 짝수의 합') {
    // N=10000: sum of even 2..10000 = 2*(1+2+..+5000)=2*5000*5001/2=25005000
    if (!hasInput('10000'))
      extra.push({ input: '10000', expectedOutput: '25005000', isVisible: false });
  }

  if (title === '1부터 N까지 홀수의 합') {
    // N=10000: sum of odd 1..9999 = 5000^2 = 25000000
    if (!hasInput('10000'))
      extra.push({ input: '10000', expectedOutput: '25000000', isVisible: false });
  }

  if (title === 'N의 약수 출력') {
    // max N=10000: 10000 = 2^4 * 5^4 → divisors
    if (!hasInput('10000')) {
      const divs = [];
      for (let i = 1; i <= 10000; i++) if (10000 % i === 0) divs.push(i);
      extra.push({ input: '10000', expectedOutput: divs.join(' '), isVisible: false });
    }
  }

  if (title === 'N의 약수의 개수') {
    // max N=100000: highly composite numbers near 100000
    if (!hasInput('100000')) {
      let cnt = 0;
      for (let i = 1; i <= 100000; i++) if (100000 % i === 0) cnt++;
      extra.push({ input: '100000', expectedOutput: String(cnt), isVisible: false });
    }
  }

  if (title === 'N의 약수의 합') {
    if (!hasInput('100000')) {
      let s = 0;
      for (let i = 1; i <= 100000; i++) if (100000 % i === 0) s += i;
      extra.push({ input: '100000', expectedOutput: String(s), isVisible: false });
    }
  }

  if (title === '소수 판별') {
    // Max N=1000000 — need near-max prime: 999983 is prime
    if (!hasInput('999983'))
      extra.push({ input: '999983', expectedOutput: 'YES', isVisible: false });
    // Large composite
    if (!hasInput('999999'))
      extra.push({ input: '999999', expectedOutput: 'NO', isVisible: false });
  }

  if (title === '1부터 N까지의 소수') {
    // max N=10000
    if (!hasInput('10000')) {
      const isPr = sieve(10000);
      const primes = [];
      for (let i = 2; i <= 10000; i++) if (isPr[i]) primes.push(i);
      extra.push({ input: '10000', expectedOutput: primes.join(' '), isVisible: false });
    }
  }

  if (title === 'N번째 소수') {
    // Already has 1000th prime test (7919)
    if (!hasInput('100')) {
      // 100th prime is 541
      const isPr = sieve(3500);
      const primes = [];
      for (let i = 2; primes.length < 100; i++) if (isPr[i]) primes.push(i);
      extra.push({ input: '100', expectedOutput: String(primes[99]), isVisible: false });
    }
  }

  if (title === '최대공약수') {
    // Large values — max A,B = 1,000,000
    if (!hasInput('1000000 999999'))
      extra.push({ input: '1000000 999999', expectedOutput: String(gcd(1000000, 999999)), isVisible: false });
    if (!hasInput('1000000 500000'))
      extra.push({ input: '1000000 500000', expectedOutput: String(gcd(1000000, 500000)), isVisible: false });
  }

  if (title === '최소공배수') {
    // max A,B = 100,000
    if (!hasInput('99991 99997'))
      extra.push({ input: '99991 99997', expectedOutput: String(lcm(99991, 99997)), isVisible: false });
  }

  if (title === '이진수 변환') {
    if (!hasInput('1000000'))
      extra.push({ input: '1000000', expectedOutput: (1000000).toString(2), isVisible: false });
  }

  if (title === '8진수 변환') {
    if (!hasInput('1000000'))
      extra.push({ input: '1000000', expectedOutput: (1000000).toString(8).toUpperCase(), isVisible: false });
  }

  if (title === '16진수 변환') {
    if (!hasInput('999999'))
      extra.push({ input: '999999', expectedOutput: (999999).toString(16).toUpperCase(), isVisible: false });
  }

  if (title === '2진수 → 10진수') {
    // 30-bit max: 2^30-1 = 1073741823
    const big = (2**30 - 1).toString(2);
    if (!hasInput(big))
      extra.push({ input: big, expectedOutput: String(2**30 - 1), isVisible: false });
  }

  if (title === '거듭제곱 (반복문)') {
    // max A=100, B=10 → 100^10 = 10^20
    if (!hasInput('100 10'))
      extra.push({ input: '100 10', expectedOutput: String(BigInt(100)**10n), isVisible: false });
  }

  if (title === '콜라츠 추측') {
    // Known long chain: N=837799 → 524 steps
    if (!hasInput('837799'))
      extra.push({ input: '837799', expectedOutput: '524', isVisible: false });
  }

  if (title === '완전수 판별') {
    // N=8128 is a perfect number
    if (!hasInput('8128'))
      extra.push({ input: '8128', expectedOutput: 'YES', isVisible: false });
    // max N=10000 not perfect
    if (!hasInput('10000'))
      extra.push({ input: '10000', expectedOutput: 'NO', isVisible: false });
  }

  if (title === '배수의 합') {
    // max A=1000, B=100000
    if (!hasInput('1000 100000')) {
      let s = 0;
      for (let i = 1000; i <= 100000; i += 1000) s += i;
      extra.push({ input: '1000 100000', expectedOutput: String(s), isVisible: false });
    }
  }

  if (title === '제곱의 합') {
    // max N=10000: sum i^2 = N(N+1)(2N+1)/6
    if (!hasInput('10000')) {
      const n = 10000;
      const s = BigInt(n) * BigInt(n + 1) * BigInt(2 * n + 1) / 6n;
      extra.push({ input: '10000', expectedOutput: String(s), isVisible: false });
    }
  }

  if (title === '세제곱의 합') {
    // max N=1000: (N(N+1)/2)^2
    if (!hasInput('1000')) {
      const n = 1000n;
      const s = (n * (n + 1n) / 2n) ** 2n;
      extra.push({ input: '1000', expectedOutput: String(s), isVisible: false });
    }
  }

  if (title === '카운트다운 (짝수만)') {
    if (!hasInput('100')) {
      const out = Array.from({length: 51}, (_, i) => 100 - i * 2).join('\n');
      extra.push({ input: '100', expectedOutput: out, isVisible: false });
    }
  }

  if (title === '별 찍기 — 직각삼각형 (왼쪽)') {
    if (!hasInput('20')) {
      const rows = Array.from({length: 20}, (_, i) => '*'.repeat(i + 1)).join('\n');
      extra.push({ input: '20', expectedOutput: rows, isVisible: false });
    }
  }

  if (title === '별 찍기 — 직각삼각형 (오른쪽)') {
    if (!hasInput('20')) {
      const rows = Array.from({length: 20}, (_, i) => ' '.repeat(19 - i) + '*'.repeat(i + 1)).join('\n');
      extra.push({ input: '20', expectedOutput: rows, isVisible: false });
    }
  }

  if (title === '별 찍기 — 역직각삼각형') {
    if (!hasInput('20')) {
      const rows = Array.from({length: 20}, (_, i) => '*'.repeat(20 - i)).join('\n');
      extra.push({ input: '20', expectedOutput: rows, isVisible: false });
    }
  }

  if (title === '별 찍기 — 피라미드') {
    if (!hasInput('20')) {
      const N = 20;
      const rows = Array.from({length: N}, (_, i) => ' '.repeat(N - i - 1) + '*'.repeat(2 * i + 1)).join('\n');
      extra.push({ input: '20', expectedOutput: rows, isVisible: false });
    }
  }

  if (title === '별 찍기 — 역피라미드') {
    if (!hasInput('20')) {
      const N = 20;
      const rows = Array.from({length: N}, (_, i) => ' '.repeat(i) + '*'.repeat(2 * (N - i) - 1)).join('\n');
      extra.push({ input: '20', expectedOutput: rows, isVisible: false });
    }
  }

  if (title === '별 찍기 — 다이아몬드') {
    if (!hasInput('19')) {
      const N = 19;
      const half = (N + 1) / 2;
      const rows = [];
      for (let i = 1; i <= half; i++) rows.push(' '.repeat(half - i) + '*'.repeat(2 * i - 1));
      for (let i = half - 1; i >= 1; i--) rows.push(' '.repeat(half - i) + '*'.repeat(2 * i - 1));
      extra.push({ input: '19', expectedOutput: rows.join('\n'), isVisible: false });
    }
  }

  if (title === '별 찍기 — 모래시계') {
    if (!hasInput('19')) {
      const N = 19;
      const half = (N + 1) / 2;
      const rows = [];
      for (let i = 1; i <= half; i++) rows.push(' '.repeat(i - 1) + '*'.repeat(2 * (half - i) + 1));
      for (let i = half - 1; i >= 1; i--) rows.push(' '.repeat(i - 1) + '*'.repeat(2 * (half - i) + 1));
      extra.push({ input: '19', expectedOutput: rows.join('\n'), isVisible: false });
    }
  }

  if (title === '별 찍기 — 체크무늬') {
    if (!hasInput('20 20')) {
      const rows = [];
      for (let r = 0; r < 20; r++) {
        let row = '';
        for (let c = 0; c < 20; c++) row += (r + c) % 2 === 0 ? '*' : ' ';
        rows.push(row);
      }
      extra.push({ input: '20 20', expectedOutput: rows.join('\n'), isVisible: false });
    }
  }

  if (title === '별 찍기 — 테두리만') {
    if (!hasInput('20 20')) {
      const rows = [];
      for (let r = 0; r < 20; r++) {
        if (r === 0 || r === 19) rows.push('*'.repeat(20));
        else rows.push('*' + ' '.repeat(18) + '*');
      }
      extra.push({ input: '20 20', expectedOutput: rows.join('\n'), isVisible: false });
    }
  }

  if (title === '자릿수의 합') {
    if (!hasInput('999999999')) {
      const s = '999999999'.split('').reduce((a, d) => a + parseInt(d), 0);
      extra.push({ input: '999999999', expectedOutput: String(s), isVisible: false });
    }
  }

  if (title === '숫자 뒤집기') {
    if (!hasInput('1000000000'))
      extra.push({ input: '1000000000', expectedOutput: '1', isVisible: false });
  }

  if (title === '3의 배수의 합') {
    if (!hasInput('10000')) {
      // sum of 3,6,...,9999 = 3*(1+2+...+3333) = 3*3333*3334/2
      const s = 3 * 3333 * 3334 / 2;
      extra.push({ input: '10000', expectedOutput: String(s), isVisible: false });
    }
  }

  if (title === '두 수 사이의 합') {
    if (!hasInput('-10000 10000')) {
      // sum -10000..10000 = 0
      extra.push({ input: '-10000 10000', expectedOutput: '0', isVisible: false });
    }
  }

  if (title === '약수 쌍 출력') {
    if (!hasInput('100000')) {
      const pairs = [];
      for (let i = 1; i * i <= 100000; i++) {
        if (100000 % i === 0) {
          if (i === 100000 / i) pairs.push(`${i} ${i}`);
          else pairs.push(`${i} ${100000 / i}`);
        }
      }
      extra.push({ input: '100000', expectedOutput: pairs.join('\n'), isVisible: false });
    }
  }

  // ─── Batch 3: 배열/문자열 ─────────────────────────────────────────────────

  if (title === '구간 합') {
    // N=1000 max
    if (!hasInput('1000')) {
      const arr = Array.from({length: 1000}, (_, i) => i + 1);
      // sum 1..1000 = 500500
      extra.push({
        input: `1000\n${arr.join(' ')}\n1 1000`,
        expectedOutput: '500500',
        isVisible: false,
      });
    }
  }

  if (title === '연속 부분 합의 최댓값') {
    if (!hasInput('1000')) {
      // All positive: max is sum of all
      const arr = Array.from({length: 1000}, () => 10000);
      extra.push({
        input: `1000\n${arr.join(' ')}`,
        expectedOutput: String(1000 * 10000),
        isVisible: false,
      });
    }
  }

  if (title === '배열 원소의 곱') {
    // Already has N=100 test case in existing
    if (!hasInput('100\n' + Array(100).fill(1).join(' '))) {
      extra.push({
        input: `100\n${Array(100).fill(1).join(' ')}`,
        expectedOutput: '1',
        isVisible: false,
      });
    }
  }

  if (title === '행렬의 합') {
    if (!hasInput('10 10')) {
      const row = Array(10).fill(1000).join(' ');
      const matA = Array(10).fill(row).join('\n');
      const matB = Array(10).fill(Array(10).fill(-1000).join(' ')).join('\n');
      const outRow = Array(10).fill(0).join(' ');
      const out = Array(10).fill(outRow).join('\n');
      extra.push({ input: `10 10\n${matA}\n${matB}`, expectedOutput: out, isVisible: false });
    }
  }

  if (title === '달팽이 배열') {
    if (!hasInput('10')) {
      const N = 10;
      const grid = Array.from({length: N}, () => Array(N).fill(0));
      let num = 1, top = 0, bottom = N - 1, left = 0, right = N - 1;
      while (num <= N * N) {
        for (let c = left; c <= right; c++) grid[top][c] = num++;
        top++;
        for (let r = top; r <= bottom; r++) grid[r][right] = num++;
        right--;
        for (let c = right; c >= left; c--) grid[bottom][c] = num++;
        bottom--;
        for (let r = bottom; r >= top; r--) grid[r][left] = num++;
        left++;
      }
      const out = grid.map(row => row.join(' ')).join('\n');
      extra.push({ input: '10', expectedOutput: out, isVisible: false });
    }
  }

  if (title === '회문 판별') {
    // Long palindrome
    if (!hasInput('abacabacabacabacabacabacabacabacabacabacabacabacabacaba')) {
      const s = 'abacaba'.repeat(14) + 'a';
      const rev = s.split('').reverse().join('');
      const isPalin = s === rev;
      // Use a definite palindrome of length 100
      const p = 'a'.repeat(50) + 'a'.repeat(50);
      if (!hasInput(p))
        extra.push({ input: p, expectedOutput: 'YES', isVisible: false });
    }
  }

  if (title === '문자열 압축') {
    // Max length 100
    if (!hasInput('a'.repeat(100)))
      extra.push({ input: 'a'.repeat(100), expectedOutput: 'a100', isVisible: false });
  }

  // ─── Batch 4: 수학/정렬/재귀 ─────────────────────────────────────────────

  if (title === '소인수분해') {
    if (!hasInput('999983')) {
      // 999983 is prime
      extra.push({ input: '999983', expectedOutput: '999983', isVisible: false });
    }
  }

  if (title === '에라토스테네스의 체') {
    // Already has N=1000000 test (78498)
    if (!hasInput('500000')) {
      const isPr = sieve(500000);
      let cnt = 0;
      for (let i = 2; i <= 500000; i++) if (isPr[i]) cnt++;
      extra.push({ input: '500000', expectedOutput: String(cnt), isVisible: false });
    }
  }

  if (title === '소수의 합') {
    if (!hasInput('100000')) {
      const isPr = sieve(100000);
      let s = 0;
      for (let i = 2; i <= 100000; i++) if (isPr[i]) s += i;
      extra.push({ input: '100000', expectedOutput: String(s), isVisible: false });
    }
  }

  if (title === '쌍둥이 소수') {
    if (!hasInput('100000')) {
      const isPr = sieve(100000);
      let cnt = 0;
      for (let i = 2; i + 2 <= 100000; i++) if (isPr[i] && isPr[i + 2]) cnt++;
      extra.push({ input: '100000', expectedOutput: String(cnt), isVisible: false });
    }
  }

  if (title === '약수 함수') {
    if (!hasInput('10000')) {
      let s = 0;
      for (let n = 1; n <= 10000; n++) {
        for (let d = 1; d * d <= n; d++) {
          if (n % d === 0) { s++; if (d !== n / d) s++; }
        }
      }
      extra.push({ input: '10000', expectedOutput: String(s), isVisible: false });
    }
  }

  if (title === '오름차순 정렬' || title === '내림차순 정렬' || title === '수 정렬하기 (대용량)') {
    // Already has max N tests for most. Add N=1000 worst case.
    const N = title === '수 정렬하기 (대용량)' ? 100000 : 1000;
    const key = `${N}\n${Array.from({length: N}, (_, i) => N - i).join(' ')}`;
    if (!hasInput(String(N)) && !existing.some(tc => tc.input.startsWith(`${N}\n`))) {
      const arr = Array.from({length: N}, (_, i) => N - i);
      const sorted = [...arr].sort((a, b) => title === '내림차순 정렬' ? b - a : a - b);
      extra.push({
        input: `${N}\n${arr.join(' ')}`,
        expectedOutput: sorted.join(' '),
        isVisible: false,
      });
    }
  }

  if (title === '이진 탐색') {
    if (!hasInput('100000')) {
      const arr = Array.from({length: 100000}, (_, i) => i + 1);
      extra.push({
        input: `100000\n${arr.join(' ')}\n100000`,
        expectedOutput: '100000',
        isVisible: false,
      });
    }
  }

  if (title === '재귀로 최대공약수') {
    if (!hasInput('1000000 1'))
      extra.push({ input: '1000000 1', expectedOutput: '1', isVisible: false });
  }

  if (title === '완전제곱수 판별') {
    // Large perfect square
    if (!hasInput('999950884'))
      extra.push({ input: '999950884', expectedOutput: 'YES\n31622', isVisible: false });
  }

  if (title === '제곱근 (정수 부분)') {
    if (!hasInput('999999999'))
      extra.push({ input: '999999999', expectedOutput: '31622', isVisible: false });
  }

  if (title === '하노이 탑 이동 횟수') {
    // max N=30 already covered
    if (!hasInput('25'))
      extra.push({ input: '25', expectedOutput: String(2**25 - 1), isVisible: false });
  }

  if (title === 'N번째 삼각수') {
    if (!hasInput('9999')) {
      const n = 9999;
      const t = n * (n + 1) / 2;
      extra.push({ input: '9999', expectedOutput: String(t), isVisible: false });
    }
  }

  if (title === '직사각형 넓이와 둘레') {
    if (!hasInput('10000 10000'))
      extra.push({ input: '10000 10000', expectedOutput: '100000000\n40000', isVisible: false });
  }

  if (title === '원의 넓이와 둘레') {
    if (!hasInput('1000')) {
      const pi = Math.PI;
      const area = (pi * 1000 * 1000).toFixed(2);
      const perimeter = (2 * pi * 1000).toFixed(2);
      extra.push({ input: '1000', expectedOutput: `${area}\n${perimeter}`, isVisible: false });
    }
  }

  if (title === '피타고라스 빗변') {
    if (!hasInput('1000 1000')) {
      const c = Math.sqrt(1000**2 + 1000**2).toFixed(2);
      extra.push({ input: '1000 1000', expectedOutput: c, isVisible: false });
    }
  }

  if (title === '두 점 사이의 거리') {
    if (!hasInput('-10000 -10000 10000 10000')) {
      const d = Math.sqrt((20000)**2 + (20000)**2).toFixed(2);
      extra.push({ input: '-10000 -10000 10000 10000', expectedOutput: d, isVisible: false });
    }
  }

  if (title === '조합 (nCr)') {
    if (!hasInput('20 0'))
      extra.push({ input: '20 0', expectedOutput: '1', isVisible: false });
  }

  if (title === '순열 (nPr)') {
    if (!hasInput('12 12')) {
      // 12! = 479001600
      extra.push({ input: '12 12', expectedOutput: '479001600', isVisible: false });
    }
  }

  if (title === '이항계수 (파스칼의 삼각형)') {
    // Already has N=15 test case
  }

  if (title === '진법 변환 (10→N진법)') {
    if (!hasInput('1000000 2')) {
      extra.push({ input: '1000000 2', expectedOutput: (1000000).toString(2), isVisible: false });
    }
  }

  if (title === '진법 변환 (N진법→10)') {
    if (!hasInput('1111111111111111111110000000 2')) {
      // Keep it simple: large but within constraint ≤1,000,000,000
      extra.push({ input: '111011100110101100101000000000 2', expectedOutput: '1000000000', isVisible: false });
    }
  }

  if (title === '행렬 곱셈') {
    if (!hasInput('10 10 10')) {
      // 10x10 identity * 10x10 identity = identity
      const row = (i) => Array.from({length: 10}, (_, j) => i === j ? 1 : 0).join(' ');
      const matA = Array.from({length: 10}, (_, i) => row(i)).join('\n');
      const matB = Array.from({length: 10}, (_, i) => row(i)).join('\n');
      const out = Array.from({length: 10}, (_, i) => row(i)).join('\n');
      extra.push({ input: `10 10 10\n${matA}\n${matB}`, expectedOutput: out, isVisible: false });
    }
  }

  if (title === '달력 요일') {
    if (!hasInput('9999 12 31')) {
      // 9999-12-31 is a Friday
      // Using Zeller's formula (or known result)
      // Let's compute: JS Date for year 9999
      // Actually JS Date handles up to year 275760, so:
      const d = new Date(9999, 11, 31); // month is 0-indexed
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      extra.push({ input: '9999 12 31', expectedOutput: days[d.getDay()], isVisible: false });
    }
  }

  if (title === '수 정렬하기 (대용량)') {
    // Add a worst-case reversed array of 100000 elements
    if (!existing.some(tc => {
      const lines = tc.input.split('\n');
      return lines[0] === '100000';
    })) {
      const N = 100000;
      const arr = Array.from({length: N}, (_, i) => N - i);
      const sorted = [...arr].sort((a, b) => a - b);
      extra.push({
        input: `${N}\n${arr.join(' ')}`,
        expectedOutput: sorted.join(' '),
        isVisible: false,
      });
    }
  }

  if (title === '좌표 정렬') {
    // Already good. Add edge: all same x, different y
    if (!existing.some(tc => tc.input.includes('1000\n'))) {
      // N=1000, all x=0, y varies
      const coords = Array.from({length: 1000}, (_, i) => `0 ${1000 - i}`);
      const sorted = Array.from({length: 1000}, (_, i) => `0 ${i + 1}`);
      extra.push({
        input: `1000\n${coords.join('\n')}`,
        expectedOutput: sorted.join('\n'),
        isVisible: false,
      });
    }
  }

  if (title === '이진수 덧셈') {
    if (!hasInput('111111111111111111111111111111\n1')) {
      // 2^30 - 1 + 1 = 2^30
      const a = '1'.repeat(30);
      const result = '1' + '0'.repeat(30);
      extra.push({ input: `${a}\n1`, expectedOutput: result, isVisible: false });
    }
  }

  if (title === '빈도수 정렬') {
    // Already has N=1000 via 5 items. Add larger
    if (!existing.some(tc => {
      const lines = tc.input.split('\n');
      return parseInt(lines[0]) >= 1000;
    })) {
      const N = 1000;
      const arr = Array.from({length: N}, (_, i) => (i % 10) + 1);
      // Each value 1-10 appears 100 times, sorted by freq (all same) then by value
      const sorted = Array.from({length: 10}, (_, v) => Array(100).fill(v + 1)).flat();
      extra.push({
        input: `${N}\n${arr.join(' ')}`,
        expectedOutput: sorted.join(' '),
        isVisible: false,
      });
    }
  }

  return extra;
}

// ─── Validate expected outputs ─────────────────────────────────────────────

function validateTestCase(tc, title) {
  const issues = [];
  // Check non-empty (unless intentionally empty input)
  if (tc.expectedOutput === '' || tc.expectedOutput === null || tc.expectedOutput === undefined) {
    issues.push('empty expectedOutput');
  }
  return issues;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching problem list (pages 11-15, 50 each)...\n');

  // Collect all problems: seq 1-200 are on pages 11-15 (descending seq order)
  const allProblems = [];
  for (let page = 11; page <= 15; page++) {
    try {
      const data = await fetchProblems(page);
      const items = data.data || data.problems || (Array.isArray(data) ? data : []);
      allProblems.push(...items);
      console.log(`  Page ${page}: ${items.length} problems fetched`);
    } catch (e) {
      console.error(`  Page ${page} error: ${e.message}`);
    }
  }

  console.log(`\nTotal problems fetched: ${allProblems.length}`);

  // Filter to sequence 1-200, sort by sequenceNumber ascending
  const basic = allProblems
    .filter(p => p.sequenceNumber >= 1 && p.sequenceNumber <= 200)
    .sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  console.log(`Basic problems (seq 1-200): ${basic.length}\n`);

  const stats = {
    checked: 0,
    modified: 0,
    suspiciousOutput: [],
    issues: [],
  };

  for (const pSummary of basic) {
    const id = pSummary.id;
    let problem;
    try {
      problem = await fetchProblem(id);
    } catch (e) {
      console.error(`  [ERROR] Problem ${id}: ${e.message}`);
      stats.issues.push({ id, error: e.message });
      continue;
    }

    const seq = problem.sequenceNumber || problem.sequence || problem.id;
    stats.checked++;
    console.log(`[${seq}] ${problem.title} (id=${id})`);

    const existing = problem.testCases || [];

    // Validate existing test cases
    const validationIssues = [];
    for (const tc of existing) {
      const issues = validateTestCase(tc, problem.title);
      if (issues.length > 0) {
        validationIssues.push({ input: tc.input, issues });
        stats.suspiciousOutput.push({ seq, title: problem.title, id, issues: issues.join(', ') });
      }
    }
    if (validationIssues.length > 0) {
      console.log(`  ⚠ Validation issues: ${JSON.stringify(validationIssues)}`);
    }

    // Build additional test cases
    let additional;
    try {
      additional = buildAdditionalTestCases(problem);
    } catch (e) {
      console.error(`  [ERROR] Building test cases for ${problem.title}: ${e.message}`);
      stats.issues.push({ id, seq, title: problem.title, error: `buildTestCases: ${e.message}` });
      additional = [];
    }

    if (additional.length === 0) {
      console.log(`  OK (${existing.length} existing, no new cases needed)`);
      continue;
    }

    // Patch with all existing (strip server fields) + new
    const cleanExisting = existing.map(({ input, expectedOutput, isVisible }) => ({ input, expectedOutput, isVisible }));
    const merged = [...cleanExisting, ...additional];
    console.log(`  + Adding ${additional.length} test case(s) -> ${merged.length} total`);
    for (const tc of additional) {
      const preview = tc.input.length > 60 ? tc.input.slice(0, 60) + '...' : tc.input;
      console.log(`    input: ${preview.replace(/\n/g, '\\n')} -> ${tc.expectedOutput.slice(0, 40)}`);
    }

    try {
      await patchProblem(id, merged);
      stats.modified++;
      console.log(`  Patched OK`);
    } catch (e) {
      console.error(`  [ERROR] Patch failed: ${e.message}`);
      stats.issues.push({ id, seq, title: problem.title, error: `patch: ${e.message}` });
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`Problems checked:  ${stats.checked}`);
  console.log(`Problems modified: ${stats.modified}`);
  console.log(`Suspicious outputs: ${stats.suspiciousOutput.length}`);
  if (stats.suspiciousOutput.length > 0) {
    for (const s of stats.suspiciousOutput) {
      console.log(`  [${s.seq}] ${s.title} (id=${s.id}): ${s.issues}`);
    }
  }
  console.log(`Errors: ${stats.issues.length}`);
  if (stats.issues.length > 0) {
    for (const e of stats.issues) {
      console.log(`  id=${e.id}: ${e.error}`);
    }
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
