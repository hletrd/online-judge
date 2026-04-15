#!/usr/bin/env node

/**
 * Patch all 200 problem descriptions to include example I/O sections.
 * Reads visible test cases from batch files, fetches problem IDs from API,
 * then PATCHes each description.
 */

const BASE_URL = 'https://algo.xylolabs.com';
const API_KEY = 'jk_d74b5170d9202945aa32a033c0b33b0bf106d1b7';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buildDescription(problem) {
  const visibleCases = problem.testCases.filter((tc) => tc.isVisible);
  if (visibleCases.length === 0) return problem.description;

  let desc = problem.description.trimEnd();

  for (let i = 0; i < visibleCases.length; i++) {
    const tc = visibleCases[i];
    const label = visibleCases.length > 1 ? ` ${i + 1}` : '';

    if (tc.input === '') {
      // No-input problem — skip 예제 입력, only show 예제 출력
      desc += `\n\n## 예제 출력${label}\n\n\`\`\`\n${tc.expectedOutput}\n\`\`\``;
    } else {
      desc += `\n\n## 예제 입력${label}\n\n\`\`\`\n${tc.input}\n\`\`\``;
      desc += `\n\n## 예제 출력${label}\n\n\`\`\`\n${tc.expectedOutput}\n\`\`\``;
    }
  }

  return desc;
}

async function fetchAllProblems() {
  const all = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${BASE_URL}/api/v1/problems?page=${page}&limit=50`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    const items = json.data ?? json.items ?? json;
    if (!Array.isArray(items) || items.length === 0) break;
    all.push(...items);
    if (all.length >= (json.pagination?.total ?? json.total ?? Infinity)) break;
    page++;
  }
  return all;
}

async function patchProblem(id, description) {
  const res = await fetch(`${BASE_URL}/api/v1/problems/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ description }),
  });
  if (res.status === 429) {
    console.log('  ⏳ Rate limited — waiting 10 s …');
    await sleep(10000);
    return patchProblem(id, description);
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }
  return res.json();
}

async function main() {
  // Load batches
  const { problems: b1 } = await import('./batch-1.mjs');
  const { problems: b2 } = await import('./batch-2.mjs');
  const { problems: b3 } = await import('./batch-3.mjs');
  const { problems: b4 } = await import('./batch-4.mjs');
  const allLocal = [...b1, ...b2, ...b3, ...b4];

  // Build title → new description map
  const descMap = new Map();
  for (const p of allLocal) {
    descMap.set(p.title, buildDescription(p));
  }

  console.log(`📝 Built new descriptions for ${descMap.size} problems\n`);

  // Fetch existing problems from API
  console.log('Fetching existing problems from API...');
  const remote = await fetchAllProblems();
  console.log(`Found ${remote.length} problems on server\n`);

  let ok = 0, fail = 0, skip = 0;

  for (let i = 0; i < remote.length; i++) {
    const rp = remote[i];
    const newDesc = descMap.get(rp.title);

    if (!newDesc) {
      skip++;
      continue;
    }

    try {
      await patchProblem(rp.id, newDesc);
      ok++;
      console.log(`[${ok + fail}/${remote.length}] ✅ ${rp.title}`);
    } catch (e) {
      fail++;
      console.error(`[${ok + fail}/${remote.length}] ❌ ${rp.title} — ${e.message}`);
    }

    if ((ok + fail) % 10 === 0) {
      await sleep(2000);
    } else {
      await sleep(400);
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Patched: ${ok}   ❌ Failed: ${fail}   ⏭ Skipped: ${skip}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
