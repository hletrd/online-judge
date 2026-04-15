#!/usr/bin/env node

const BASE_URL = 'https://algo.xylolabs.com';
const API_KEY = 'jk_d74b5170d9202945aa32a033c0b33b0bf106d1b7';
const DELAY_MS = 400;
const BATCH_PAUSE_MS = 2000;
const BATCH_SIZE = 10;
const START_SEQ = 401;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function createProblem(problem, seqNum, retries = 3) {
  const payload = {
    title: problem.title,
    description: problem.description,
    sequenceNumber: seqNum,
    difficulty: problem.difficulty ?? null,
    timeLimitMs: problem.timeLimitMs ?? 2000,
    memoryLimitMb: problem.memoryLimitMb ?? 256,
    visibility: 'public',
    problemType: 'auto',
    comparisonMode: problem.comparisonMode ?? 'exact',
    floatAbsoluteError: problem.floatAbsoluteError ?? null,
    floatRelativeError: problem.floatRelativeError ?? null,
    showCompileOutput: true,
    showDetailedResults: true,
    showRuntimeErrors: true,
    allowAiAssistant: true,
    testCases: problem.testCases,
    tags: problem.tags ?? [],
  };

  const res = await fetch(`${BASE_URL}/api/v1/problems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 429 && retries > 0) {
    console.log('  Rate limited, waiting 10s...');
    await sleep(10000);
    return createProblem(problem, seqNum, retries - 1);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }

  return res.json();
}

async function main() {
  const { problems: b1 } = await import('./expert-batch-1.mjs');
  const { problems: b2 } = await import('./expert-batch-2.mjs');

  const all = [...b1, ...b2];
  console.log(`\nTotal expert problems: ${all.length}\n`);

  let ok = 0, fail = 0;
  const failures = [];

  for (let i = 0; i < all.length; i++) {
    const p = all[i];
    const seq = START_SEQ + i;
    try {
      await createProblem(p, seq);
      ok++;
      console.log(`[${String(i + 1).padStart(3)}/${all.length}] OK ${p.title}`);
    } catch (e) {
      fail++;
      failures.push({ seq, title: p.title, error: e.message });
      console.error(`[${String(i + 1).padStart(3)}/${all.length}] FAIL ${p.title} - ${e.message}`);
    }

    if ((i + 1) % BATCH_SIZE === 0 && i + 1 < all.length) {
      await sleep(BATCH_PAUSE_MS);
    } else {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nDone. OK: ${ok}  FAIL: ${fail}  Total: ${all.length}`);
  if (failures.length) {
    console.log('\nFailed:');
    for (const f of failures) console.log(`  #${f.seq} ${f.title}: ${f.error}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
