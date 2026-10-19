// Tests for js/progress.js and js/quiz.js (no browser needed).
//   node tests/test-progress-quiz.js     (prints ALL OK when everything passes)
const fs = require("fs"), vm = require("vm"), path = require("path");

const root = path.join(__dirname, "..");
let failures = 0;
let checks = 0;

function check(condition, message) {
  checks++;
  if (!condition) {
    failures++;
    console.log("FAIL: " + message);
  }
}

function load(files, localStorage) {
  const context = { console, Math, JSON, localStorage };
  vm.createContext(context);
  for (const file of files) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
  }
  return context;
}

// A tiny stand-in for localStorage.
function fakeStorage(initial) {
  const data = Object.assign({}, initial);
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); },
    data,
  };
}

const blockedStorage = {
  getItem() { throw new Error("blocked"); },
  setItem() { throw new Error("blocked"); },
};

// ---------- progress ----------

{
  const storage = fakeStorage({});
  const p = load(["js/progress.js"], storage);
  check(vm.runInContext("readDoneLessons()", p).length === 0, "empty storage -> no done lessons");
  check(vm.runInContext('isLessonDone("min")', p) === false, "nothing is done at the start");

  vm.runInContext('markLessonDone("min")', p);
  check(vm.runInContext('isLessonDone("min")', p) === true, "marked lesson is done");
  check(vm.runInContext('isLessonDone("max")', p) === false, "other lesson stays not done");

  vm.runInContext('markLessonDone("min")', p);
  check(JSON.parse(storage.data.doneLessons).length === 1, "marking twice saves one id");

  vm.runInContext('markLessonDone("max")', p);
  check(JSON.parse(storage.data.doneLessons).join() === "min,max", "ids are kept in order");

  // Survives a "reload": a new page reads the same storage.
  const p2 = load(["js/progress.js"], storage);
  check(vm.runInContext('isLessonDone("max")', p2) === true, "progress survives a reload");

  const counted = vm.runInContext('countDoneLessons([{id:"min"},{id:"sum"},{id:"max"}])', p2);
  check(counted === 2, "countDoneLessons counts only done lessons (got " + counted + ")");
  check(vm.runInContext("countDoneLessons([])", p2) === 0, "countDoneLessons of no lessons is 0");
}

for (const [name, saved] of [
  ["not JSON", "{{{"],
  ["a number", "5"],
  ["an object", '{"a":1}'],
  ["null", "null"],
]) {
  const p = load(["js/progress.js"], fakeStorage({ doneLessons: saved }));
  check(vm.runInContext("readDoneLessons()", p).length === 0, "broken data (" + name + ") -> empty list");
  vm.runInContext('markLessonDone("min")', p);
  check(vm.runInContext('isLessonDone("min")', p) === true, "can save again after broken data (" + name + ")");
}

{
  const p = load(["js/progress.js"], fakeStorage({ doneLessons: '["min", 7, null, "max"]' }));
  check(vm.runInContext("readDoneLessons()", p).join() === "min,max", "non-string ids are ignored");
}

{
  const p = load(["js/progress.js"], blockedStorage);
  check(vm.runInContext("readDoneLessons()", p).length === 0, "blocked storage -> empty list, no crash");
  let threw = false;
  try { vm.runInContext('markLessonDone("min")', p); } catch (e) { threw = true; }
  check(!threw, "blocked storage: markLessonDone does not throw");
}

// ---------- quiz ----------

const q = load(["js/quiz.js"], null);
const steps = [{ text: "A" }, { text: "B" }, { text: "C" }, { text: "D" }];

function quizFor(list, index, random) {
  q.__steps = list;
  return vm.runInContext("makeQuizQuestion(__steps, " + index + ", __random)", Object.assign(q, { __random: random }));
}
const noRandom = () => 0;

check(quizFor(steps, 3, noRandom) === null, "last step -> no question");
check(quizFor([{ text: "only" }], 0, noRandom) === null, "single step lesson -> no question");
check(quizFor([{ text: "X" }, { text: "X" }], 0, noRandom) === null, "no different text -> no question");

for (let index = 0; index < steps.length - 1; index++) {
  const quiz = quizFor(steps, index, Math.random);
  check(quiz.options.length === 3, "step " + index + ": 3 options");
  check(new Set(quiz.options).size === quiz.options.length, "step " + index + ": options are different");
  check(quiz.options[quiz.correctIndex] === steps[index + 1].text, "step " + index + ": correct option is the next step text");
  check(quiz.correctIndex >= 0 && quiz.correctIndex < quiz.options.length, "step " + index + ": correctIndex in range");
}

{
  const quiz = quizFor([{ text: "A" }, { text: "B" }], 0, noRandom);
  check(quiz.options.length === 2 && quiz.options.includes("A") && quiz.options.includes("B"),
    "two different texts -> two options");
}

{
  // The correct answer should not always be in the same place.
  const places = new Set();
  for (let i = 0; i < 200; i++) places.add(quizFor(steps, 0, Math.random).correctIndex);
  check(places.size === 3, "correct answer moves between positions (saw " + [...places].join() + ")");
}

{
  // Same "random" -> same question (so the tests above are repeatable).
  const a = JSON.stringify(quizFor(steps, 1, () => 0.5));
  const b = JSON.stringify(quizFor(steps, 1, () => 0.5));
  check(a === b, "same random numbers give the same question");
}

// Every real lesson, many random inputs, every step.
const lessonContext = { console, Math };
vm.createContext(lessonContext);
vm.runInContext(fs.readFileSync(path.join(root, "js/data/graph-data.js"), "utf8"), lessonContext);
let lessonCount = 0;
// Load every lesson first: compare-sorts uses the bubble and merge sort lessons.
const lessonNames = [];
for (const file of fs.readdirSync(path.join(root, "js/lessons")).sort()) {
  const source = fs.readFileSync(path.join(root, "js/lessons", file), "utf8");
  lessonNames.push(source.match(/^const (\w+Lesson) =/m)[1]);
  vm.runInContext(source, lessonContext, { filename: file });
}
for (const name of lessonNames) {
  const lesson = vm.runInContext(name, lessonContext);
  lessonCount++;
  for (let run = 0; run < 20; run++) {
    const input = lesson.makeInput
      ? lesson.makeInput()
      : Array.from({ length: 8 }, () => 5 + Math.floor(Math.random() * 95));
    const lessonSteps = lesson.buildSteps(input);
    for (let index = 0; index < lessonSteps.length - 1; index++) {
      const quiz = quizFor(lessonSteps, index, Math.random);
      const label = lesson.id + " step " + (index + 1);
      if (quiz === null) {
        check(false, label + ": no question was made");
        continue;
      }
      check(quiz.options.length >= 2 && quiz.options.length <= 3, label + ": 2-3 options");
      check(new Set(quiz.options).size === quiz.options.length, label + ": options are different");
      check(quiz.options[quiz.correctIndex] === lessonSteps[index + 1].text, label + ": correct answer is the next text");
    }
    check(quizFor(lessonSteps, lessonSteps.length - 1, Math.random) === null, lesson.id + ": no question on the last step");
  }
}
check(lessonCount === 19, "all 19 lessons were tested (got " + lessonCount + ")");

console.log(failures === 0 ? "ALL OK (" + checks + " checks)" : failures + " FAILED of " + checks + " checks");
process.exit(failures === 0 ? 0 : 1);
