#!/usr/bin/env node

/**
 * Bulk problem creator for algo.xylolabs.com
 * Usage: node scripts/algo-problems/runner.mjs
 */

const BASE_URL = 'https://algo.xylolabs.com';
const API_KEY = 'jk_d74b5170d9202945aa32a033c0b33b0bf106d1b7';
const DELAY_MS = 400;
const BATCH_PAUSE_MS = 2000;
const BATCH_SIZE = 10;

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
    console.log('  ⏳ Rate limited — waiting 10 s …');
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
  const { problems: b1 } = await import('./batch-1.mjs');
  const { problems: b2 } = await import('./batch-2.mjs');
  const { problems: b3 } = await import('./batch-3.mjs');
  const { problems: b4 } = await import('./batch-4.mjs');

  const all = [...b1, ...b2, ...b3, ...b4];
  console.log(`\n📦 Total problems to create: ${all.length}\n`);

  let ok = 0;
  let fail = 0;
  const failures = [];

  for (let i = 0; i < all.length; i++) {
    const p = all[i];
    const seq = i + 1;
    try {
      await createProblem(p, seq);
      ok++;
      console.log(`[${String(seq).padStart(3)}/${all.length}] ✅ ${p.title}`);
    } catch (e) {
      fail++;
      failures.push({ seq, title: p.title, error: e.message });
      console.error(`[${String(seq).padStart(3)}/${all.length}] ❌ ${p.title} — ${e.message}`);
    }

    if (seq % BATCH_SIZE === 0 && seq < all.length) {
      await sleep(BATCH_PAUSE_MS);
    } else {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Success: ${ok}   ❌ Failed: ${fail}   Total: ${all.length}`);
  if (failures.length) {
    console.log('\nFailed problems:');
    for (const f of failures) {
      console.log(`  #${f.seq} ${f.title}: ${f.error}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
