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
for (const [f, n] of names) {
  const L = vm.runInContext(n, ctx);
  console.log(f, n, "steps:");
  for (let run = 0; run < 200; run++) {
    const arr = Array.from({length: 8}, () => 5 + Math.floor(Math.random() * 95));
    if (run % 10 === 0) { arr[1] = arr[0]; arr[5] = arr[4]; } // duplicates
    if (run === 1) arr.sort((a,b)=>a-b);
    if (run === 2) arr.sort((a,b)=>b-a);
    const steps = L.buildSteps(arr.slice());
    const sortedInput = [...arr].sort((a,b)=>a-b);
    steps.forEach((s, i) => {
      const where = `${f} run${run} step${i}`;
      if (s.bars.length !== 8) bad(where + " bars length");
      for (const k of ["highlight","sorted","lines"]) if (!Array.isArray(s[k])) bad(where + " " + k + " not array");
      for (const k of ["dimmed","marked"]) if (s[k] !== undefined && !Array.isArray(s[k])) bad(where + " " + k + " not array");
      [...s.highlight, ...s.sorted, ...(s.dimmed||[]), ...(s.marked||[])].forEach(x => { if (!(x >= 0 && x < 8)) bad(where + " index " + x); });
      const langs = { js: [L.code, null], ...Object.fromEntries(Object.entries(L.otherLanguages||{}).map(([k,v])=>[k,[v.code,v.lineMap||null]])) };
      for (const [lang,[code,map]] of Object.entries(langs)) for (const ln of s.lines) {
        const mapped = map && map[ln] ? map[ln] : [ln];
        mapped.forEach(x => { if (!(x >= 1 && x <= code.length)) bad(where + ` ${lang} line ${x}/${code.length}`); });
      }
      if (typeof s.text !== "string" || !s.text) bad(where + " text");
      if (/\b1 сравнения\b|\b1 размени\b/.test(s.text)) bad(where + " plural: " + s.text);
    });
    const last = steps[steps.length-1];
    if (/sort/.test(f) && JSON.stringify(last.bars) !== JSON.stringify(sortedInput)) bad(`${f} run${run} not sorted at end`);
  }
  console.log("  languages:", Object.keys(L.otherLanguages||{}).join(","));
}
console.log(problems ? problems + " problems" : "ALL OK");
if (problems) process.exitCode = 1;
