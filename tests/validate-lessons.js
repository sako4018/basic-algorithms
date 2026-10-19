// Checks every lesson in js/lessons/ on random arrays (200 runs each):
// the steps have the right shape, the active lines exist in all five
// languages (after lineMap), and the sorts end sorted.
// Run from the project folder:  node tests/validate-lessons.js
// With no argument it uses the project folder.
const fs = require("fs"), vm = require("vm"), path = require("path");
const dir = (process.argv[2] || path.join(__dirname, "..")) + "/js/lessons";
const ctx = vm.createContext({});
const names = [];
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
for (const [f, n] of names) {
  const L = vm.runInContext(n, ctx);
  console.log(f, n, "steps:");
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
        if (ownInput && s.lines.length > 1) bad(where + " more than one active line");
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
