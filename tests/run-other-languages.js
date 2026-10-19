// Compiles and runs the C, C++ and Java code of every lesson and compares the
// output with an independent JS reference.
//   node tests/run-other-languages.js c|cpp|java
// C and C++ need a working compiler (on a Mac with a broken Command Line Tools
// SDK, set SDKROOT to an older SDK in /Library/Developer/CommandLineTools/SDKs).
// Java needs a JDK: set JAVA_HOME_TEST to its home folder. Temporary files go
// to the system temp folder.
const fs = require("fs"), vm = require("vm"), path = require("path"), cp = require("child_process");
const repo = path.join(__dirname, ".."), lang = process.argv[2];
const work = fs.mkdtempSync(path.join(require("os").tmpdir(), "lessons-" + lang + "-"));
const javaHome = process.env.JAVA_HOME_TEST || "";

const ctx = { console, Math };
vm.createContext(ctx);
const lessonDir = path.join(repo, "js/lessons");
const lessons = {};
for (const f of fs.readdirSync(lessonDir).sort()) {
  const src = fs.readFileSync(path.join(lessonDir, f), "utf8");
  const m = src.match(/^const (\w+Lesson) =/m);
  if (!m) continue;
  vm.runInContext(src + `;this.__l=${m[1]};`, ctx);
  lessons[ctx.__l.id] = ctx.__l;
}

const A = [5, 62, 18, 90, 7, 44, 31, 2];
const SORTED = [...A].sort((a, b) => a - b);
const j = a => a.join(" ");

const expected = {
  "loop-trace": "bigCount = " + A.filter(x => x > 50).length,
  min: "min = " + Math.min(...A),
  max: "max = " + Math.max(...A),
  sum: "sum = " + A.reduce((a, b) => a + b, 0),
  count: "count = " + A.filter(x => x % 2 === 0).length,
  "linear-search": "5\n-1",
  "binary-search": "4\n-1",
  "bubble-sort": j(SORTED), "selection-sort": j(SORTED), "insertion-sort": j(SORTED),
  "merge-sort": j(SORTED), "quick-sort": j(SORTED),
};

// ----- C -----
const cArr = `int a[] = {${A.join(",")}}; int n = ${A.length};`;
const cSorted = `int a[] = {${SORTED.join(",")}}; int n = ${A.length};`;
const cPrint = `for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]); printf("\\n");`;
function cMain(id) {
  switch (id) {
    case "loop-trace": return `${cArr} countBig(a, n);`;
    case "min": return `${cArr} findMin(a, n);`;
    case "max": return `${cArr} findMax(a, n);`;
    case "sum": return `${cArr} findSum(a, n);`;
    case "count": return `${cArr} countEven(a, n);`;
    case "linear-search": return `${cArr} printf("%d\\n%d\\n", linearSearch(a, n, 44), linearSearch(a, n, 99));`;
    case "binary-search": return `${cSorted} printf("%d\\n%d\\n", binarySearch(a, n, 31), binarySearch(a, n, 99));`;
    case "bubble-sort": return `${cArr} bubbleSort(a, n); ${cPrint}`;
    case "selection-sort": return `${cArr} selectionSort(a, n); ${cPrint}`;
    case "insertion-sort": return `${cArr} insertionSort(a, n); ${cPrint}`;
    case "merge-sort": return `${cArr} mergeSort(a, 0, n - 1); ${cPrint}`;
    case "quick-sort": return `${cArr} quickSort(a, 0, n - 1); ${cPrint}`;
  }
}
// ----- C++ -----
const vArr = `vector<int> a = {${A.join(",")}};`;
const vSorted = `vector<int> a = {${SORTED.join(",")}};`;
const vPrint = `for (int i = 0; i < (int)a.size(); i++) cout << (i ? " " : "") << a[i]; cout << endl;`;
function cppMain(id) {
  switch (id) {
    case "loop-trace": return `${vArr} countBig(a);`;
    case "min": return `${vArr} findMin(a);`;
    case "max": return `${vArr} findMax(a);`;
    case "sum": return `${vArr} findSum(a);`;
    case "count": return `${vArr} countEven(a);`;
    case "linear-search": return `${vArr} cout << linearSearch(a, 44) << endl << linearSearch(a, 99) << endl;`;
    case "binary-search": return `${vSorted} cout << binarySearch(a, 31) << endl << binarySearch(a, 99) << endl;`;
    case "bubble-sort": return `${vArr} bubbleSort(a); ${vPrint}`;
    case "selection-sort": return `${vArr} selectionSort(a); ${vPrint}`;
    case "insertion-sort": return `${vArr} insertionSort(a); ${vPrint}`;
    case "merge-sort": return `${vArr} mergeSort(a, 0, a.size() - 1); ${vPrint}`;
    case "quick-sort": return `${vArr} quickSort(a, 0, a.size() - 1); ${vPrint}`;
  }
}

// ----- Java -----
const jArr = `int[] a = {${A.join(",")}};`;
const jSorted = `int[] a = {${SORTED.join(",")}};`;
const jPrint = `System.out.println(Arrays.stream(a).mapToObj(String::valueOf).collect(Collectors.joining(" ")));`;
function javaMain(id) {
  switch (id) {
    case "loop-trace": return `${jArr} countBig(a);`;
    case "min": return `${jArr} findMin(a);`;
    case "max": return `${jArr} findMax(a);`;
    case "sum": return `${jArr} findSum(a);`;
    case "count": return `${jArr} countEven(a);`;
    case "linear-search": return `${jArr} System.out.println(linearSearch(a, 44)); System.out.println(linearSearch(a, 99));`;
    case "binary-search": return `${jSorted} System.out.println(binarySearch(a, 31)); System.out.println(binarySearch(a, 99));`;
    case "bubble-sort": return `${jArr} bubbleSort(a); ${jPrint}`;
    case "selection-sort": return `${jArr} selectionSort(a); ${jPrint}`;
    case "insertion-sort": return `${jArr} insertionSort(a); ${jPrint}`;
    case "merge-sort": return `${jArr} mergeSort(a, 0, a.length - 1); ${jPrint}`;
    case "quick-sort": return `${jArr} quickSort(a, 0, a.length - 1); ${jPrint}`;
  }
}

fs.mkdirSync(work, { recursive: true });
let failed = 0;
for (const id of Object.keys(expected)) {
  const l = lessons[id];
  if (!l) { console.log("MISSING LESSON", id); failed++; continue; }
  let code = l.otherLanguages[lang].code.join("\n");
  let src, file, build, run;
  if (lang === "c") {
    src = `#include <stdio.h>\n#include <limits.h>\n${code}\nint main(void) {\n  ${cMain(id)}\n  return 0;\n}\n`;
    file = path.join(work, id + ".c");
    build = ["cc", ["-Wall", "-Wno-unused", file, "-o", path.join(work, id)]];
    run = [path.join(work, id), []];
  } else if (lang === "cpp") {
    src = `#include <iostream>\n#include <vector>\n#include <deque>\n#include <utility>\n#include <climits>\n#include <algorithm>\nusing namespace std;\n${code}\nint main() {\n  ${cppMain(id)}\n  return 0;\n}\n`;
    file = path.join(work, id + ".cpp");
    build = ["c++", ["-std=c++17", "-Wall", "-Wno-unused", file, "-o", path.join(work, id)]];
    run = [path.join(work, id), []];
  } else {
    const dir = path.join(work, id.replace(/-/g, "_")); fs.mkdirSync(dir, { recursive: true });
    src = `import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n${code}\n\n  public static void main(String[] args) {\n    ${javaMain(id)}\n  }\n}\n`;
    file = path.join(dir, "Main.java");
    build = [path.join(javaHome, "bin/javac"), [file]];
    run = [path.join(javaHome, "bin/java"), ["-cp", dir, "Main"]];
  }
  fs.writeFileSync(file, src);
  const b = cp.spawnSync(build[0], build[1], { encoding: "utf8" });
  if (b.status !== 0 || (b.stderr && /warning/.test(b.stderr))) {
    console.log(`${id}: BUILD ${b.status === 0 ? "WARNINGS" : "FAILED"}\n${b.stderr}`);
    if (b.status !== 0) { failed++; continue; }
  }
  const r = cp.spawnSync(run[0], run[1], { encoding: "utf8", timeout: 10000 });
  const got = (r.stdout || "").trim().split("\n").map(s => s.trim()).join("\n");
  if (r.status === 0 && got === expected[id]) console.log(`${id}: OK`);
  else { failed++; console.log(`${id}: MISMATCH (exit ${r.status})\n  expected: ${JSON.stringify(expected[id])}\n  got:      ${JSON.stringify(got)}\n${r.stderr}`); }
}
console.log(failed === 0 ? `ALL OK (${lang})` : `${failed} FAILED (${lang})`);
process.exit(failed ? 1 : 0);
