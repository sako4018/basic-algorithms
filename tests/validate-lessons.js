// Checks every lesson in js/lessons/ on random arrays (200 runs each):
// the steps have the right shape, the active lines exist in all five
// languages (after lineMap), and the sorts end sorted.
// Run from the project folder:  node tests/validate-lessons.js
// With no argument it uses the project folder.
const fs = require("fs"), vm = require("vm"), path = require("path");
const dir = (process.argv[2] || path.join(__dirname, "..")) + "/js/lessons";
const ctx = vm.createContext({});
const names = [];
// Shared data (the graph) is loaded first, like the script tags in index.html.
const dataDir = path.dirname(dir) + "/data";
for (const f of fs.existsSync(dataDir) ? fs.readdirSync(dataDir).sort() : []) {
  vm.runInContext(fs.readFileSync(path.join(dataDir, f), "utf8"), ctx, { filename: f });
}
// The checks below use the graph itself, so copy it out of the context.
const GRAPH_NODE_POSITIONS = vm.runInContext("typeof GRAPH_NODE_POSITIONS === 'undefined' ? [] : GRAPH_NODE_POSITIONS", ctx);
const GRAPH_EDGES = vm.runInContext("typeof GRAPH_EDGES === 'undefined' ? [] : GRAPH_EDGES", ctx);
for (const f of fs.readdirSync(dir).sort()) {
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  new vm.Script(src, { filename: f });
  vm.runInContext(src, ctx, { filename: f });
  const m = src.match(/^const (\w+Lesson)\b/m);
  names.push([f, m && m[1]]);
}
let problems = 0;
const bad = (m) => { problems++; console.log("  PROBLEM:", m); };
// Lessons with view "compare" have s.rows (one entry per sort); check each row.
function checkCompareRows(s, where) {
  if (!Array.isArray(s.rows) || s.rows.length !== 2) return bad(where + " rows");
  s.rows.forEach((r, k) => {
    if (!r.name || !r.swapsName) bad(where + " row" + k + " name");
    if (!Array.isArray(r.bars) || r.bars.length !== 8) bad(where + " row" + k + " bars length");
    for (const key of ["highlight", "sorted"]) {
      if (!Array.isArray(r[key])) { bad(where + " row" + k + " " + key); continue; }
      r[key].forEach(x => { if (!(x >= 0 && x < 8)) bad(where + " row" + k + " index " + x); });
    }
    if (!(r.compares >= 0 && r.swaps >= 0)) bad(where + " row" + k + " counters");
  });
}
// Lessons with their own input (view + makeInput): graph lessons (checked separately).
function checkLines(where, L, s) {
  const langs = { js: [L.code, null], ...Object.fromEntries(Object.entries(L.otherLanguages||{}).map(([k,v])=>[k,[v.code,v.lineMap||null]])) };
  if (Object.keys(langs).length !== 6) bad(where + " needs 6 languages");
  if (!s.lines.length) bad(where + " no active line");
  for (const [lang,[code,map]] of Object.entries(langs)) for (const ln of s.lines) {
    const mapped = map && map[ln] ? map[ln] : [ln];
    if (!mapped.length) bad(where + ` ${lang} no line for JS line ${ln}`);
    mapped.forEach(x => { if (!(x >= 1 && x <= code.length)) bad(where + ` ${lang} line ${x}/${code.length}`); });
  }
}

// Independent shortest paths: Bellman-Ford over the edge list.
function bellmanFord(start) {
  const dist = GRAPH_NODE_POSITIONS.map(() => Infinity);
  dist[start] = 0;
  for (let round = 0; round < dist.length; round++) {
    for (const [a, b, w] of GRAPH_EDGES) {
      if (dist[a] + w < dist[b]) dist[b] = dist[a] + w;
      if (dist[b] + w < dist[a]) dist[a] = dist[b] + w;
    }
  }
  return dist;
}

function areNeighbours(a, b) {
  return GRAPH_EDGES.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

// BFS order: starts at start, visits every node once, and the number of
// edges from start never goes down (checked with Bellman-Ford, weights 1).
function isValidBfsOrder(order, start) {
  const n = GRAPH_NODE_POSITIONS.length;
  if (order.length !== n || new Set(order).size !== n || order[0] !== start) return false;
  const hops = GRAPH_NODE_POSITIONS.map(() => Infinity);
  hops[start] = 0;
  for (let round = 0; round < n; round++) {
    for (const [a, b] of GRAPH_EDGES) {
      hops[b] = Math.min(hops[b], hops[a] + 1);
      hops[a] = Math.min(hops[a], hops[b] + 1);
    }
  }
  for (let i = 1; i < n; i++) {
    if (hops[order[i]] < hops[order[i - 1]]) return false;
    if (!order.slice(0, i).some(p => areNeighbours(p, order[i]) && hops[p] === hops[order[i]] - 1)) return false;
  }
  return true;
}

// DFS order: every new node must be a neighbour of the deepest node on the
// current path that still has an unvisited neighbour.
function isValidDfsOrder(order, start) {
  const n = GRAPH_NODE_POSITIONS.length;
  if (order.length !== n || new Set(order).size !== n || order[0] !== start) return false;
  const path = [start];
  const seen = new Set([start]);
  for (let i = 1; i < n; i++) {
    const hasUnseen = u => GRAPH_NODE_POSITIONS.some((_, v) => areNeighbours(u, v) && !seen.has(v));
    while (path.length && !hasUnseen(path[path.length - 1])) path.pop();
    if (!path.length || !areNeighbours(path[path.length - 1], order[i])) return false;
    path.push(order[i]);
    seen.add(order[i]);
  }
  return true;
}

function checkInputLesson(f, L) {
  const n = GRAPH_NODE_POSITIONS.length;
  for (let run = 0; run < 100; run++) {
    const input = run < n ? { start: run } : L.makeInput();
    const steps = L.buildSteps(input);
    steps.forEach((s, i) => {
      const where = `${f} start${input.start} step${i}`;
      for (const k of ["highlight","sorted","lines"]) if (!Array.isArray(s[k])) bad(where + " " + k + " not array");
      checkLines(where, L, s);
      if (typeof s.text !== "string" || !s.text) bad(where + " text");
      if (typeof s.compares !== "number" || typeof s.swaps !== "number" || typeof s.swapped !== "boolean") bad(where + " compares/swaps/swapped");
      const g = s.graph;
      if (!g || !s.side || !Array.isArray(s.side.items) || !s.side.title) { bad(where + " graph/side missing"); return; }
      const nodes = [g.current, ...g.done, ...g.frontier, ...(g.edge || []), ...g.treeEdges.flat()];
      nodes.forEach(x => { if (!(x === -1 || (Number.isInteger(x) && x >= 0 && x < n))) bad(where + " node " + x); });
    });
    const last = steps[steps.length - 1];
    if (!/^Готово!/.test(last.text)) bad(`${f} start${input.start} last step is not "Готово!"`);
    if (steps.slice(0, -1).some(s => /^Готово!/.test(s.text))) bad(`${f} start${input.start} "Готово!" before the end`);
    const result = last.graph.result;
    if (!result) { bad(`${f} start${input.start} no result`); continue; }
    if (L.id === "bfs" && !isValidBfsOrder(result, input.start)) bad(`${f} start${input.start} not a BFS order: ${result}`);
    if (L.id === "dfs" && !isValidDfsOrder(result, input.start)) bad(`${f} start${input.start} not a DFS order: ${result}`);
    if (L.id === "dijkstra" && JSON.stringify(result) !== JSON.stringify(bellmanFord(input.start))) bad(`${f} start${input.start} distances ${result} differ from Bellman-Ford`);
  }
}

for (const [f, n] of names) {
  const L = vm.runInContext(n, ctx);
  console.log(f, n, "steps:");
  for (const lang of ["c", "cpp", "csharp", "java", "python"]) {
    if (!L.otherLanguages || !L.otherLanguages[lang]) bad(f + " has no " + lang + " code");
  }
  if (L.view === "graph") {
    checkInputLesson(f, L);
    console.log("  languages:", Object.keys(L.otherLanguages||{}).join(","));
    continue;
  }
  for (let run = 0; run < 200; run++) {
    // A lesson with its own view or input (recursion...) makes its own input
    // and has no bars; the other lessons get a random array of 8 numbers.
    // The compare lesson has a view but still works on 8 bars.
    const ownInput = !!((L.view && L.view !== "compare") || L.makeInput);
    let input;
    let sortedInput = null;
    if (ownInput) {
      input = L.makeInput ? L.makeInput() : Array.from({length: 8}, () => 5 + Math.floor(Math.random() * 95));
    } else {
      input = Array.from({length: 8}, () => 5 + Math.floor(Math.random() * 95));
      if (run % 10 === 0) { input[1] = input[0]; input[5] = input[4]; } // duplicates
      if (run === 1) input.sort((a,b)=>a-b);
      if (run === 2) input.sort((a,b)=>b-a);
      sortedInput = [...input].sort((a,b)=>a-b);
    }
    const steps = L.buildSteps(Array.isArray(input) ? input.slice() : input);
    if (!Array.isArray(steps) || steps.length === 0) bad(`${f} run${run} no steps`);
    steps.forEach((s, i) => {
      const where = `${f} run${run} step${i}`;
      if (ownInput) {
        if (!Array.isArray(s.bars)) bad(where + " bars not array");
      } else if (s.bars.length !== 8) bad(where + " bars length");
      const barCount = ownInput ? 0 : 8;
      if (L.view === "compare") checkCompareRows(s, where);
      for (const k of ["highlight","sorted","lines"]) if (!Array.isArray(s[k])) bad(where + " " + k + " not array");
      for (const k of ["dimmed","marked"]) if (s[k] !== undefined && !Array.isArray(s[k])) bad(where + " " + k + " not array");
      [...s.highlight, ...s.sorted, ...(s.dimmed||[]), ...(s.marked||[])].forEach(x => { if (!(x >= 0 && x < barCount)) bad(where + " index " + x); });
      if (L.view === "stack") {
        if (!Array.isArray(s.stack)) bad(where + " stack not array");
        else s.stack.forEach(c => { if (!c.label || typeof c.note !== "string") bad(where + " stack item"); });
        if (s.returned && !s.returned.label) bad(where + " returned label");
        if (s.pegs && !(s.pegs.length === 3 && s.pegs.every(Array.isArray))) bad(where + " pegs");
      }
      const langs = { js: [L.code, null], ...Object.fromEntries(Object.entries(L.otherLanguages||{}).map(([k,v])=>[k,[v.code,v.lineMap||null]])) };
      for (const [lang,[code,map]] of Object.entries(langs)) {
        if (ownInput && i < steps.length - 1 && s.lines.length === 0) bad(where + " no active line");
        for (const ln of s.lines) {
          const mapped = map && map[ln] ? map[ln] : [ln];
          mapped.forEach(x => { if (!(x >= 1 && x <= code.length)) bad(where + ` ${lang} line ${x}/${code.length}`); });
        }
      }
      if (typeof s.text !== "string" || !s.text) bad(where + " text");
      if (/\b1 сравнения\b|\b1 размени\b/.test(s.text)) bad(where + " plural: " + s.text);
    });
    const last = steps[steps.length-1];
    if (ownInput && !/^Готово/.test(last.text)) bad(`${f} run${run} last step is not "Готово"`);
    if (L.view === "compare") {
      last.rows.forEach((r, k) => { if (JSON.stringify(r.bars) !== JSON.stringify(sortedInput)) bad(`${f} run${run} row${k} not sorted at end`); });
      if (JSON.stringify(last.bars) !== JSON.stringify(sortedInput)) bad(`${f} run${run} not sorted at end`);
    } else if (/sort/.test(f) && JSON.stringify(last.bars) !== JSON.stringify(sortedInput)) bad(`${f} run${run} not sorted at end`);
  }
  console.log("  languages:", Object.keys(L.otherLanguages||{}).join(","));
}
console.log(problems ? problems + " problems" : "ALL OK");
if (problems) process.exitCode = 1;
