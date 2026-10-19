// Recursion lesson: factorial, drawn as a call stack (view "stack").
// The player shows `code` next to the stack. Each step says which
// line (1-based) of `code` is active, so keep them in sync.

const recursionFactorialLesson = {
  id: "recursion-factorial",
  title: "Рекурсия: факториел (factorial)",
  intro:
    "Факториелът на n е произведението 1 · 2 · … · n. Функцията вика самата себе си " +
    "за по-малко число, докато стигне до 1. Всяко извикване е кутия в стека; " +
    "когато стигнем дъното, кутиите се връщат една по една и събират отговора.",
  view: "stack",
  code: [
    "function factorial(n) {",
    "  if (n === 1) {",
    "    return 1;",
    "  }",
    "  return n * factorial(n - 1);",
    "}",
  ],
  otherLanguages: {
    c: {
      code: [
        "int factorial(int n) {",
        "  if (n == 1) {",
        "    return 1;",
        "  }",
        "  return n * factorial(n - 1);",
        "}",
      ],
    },
    cpp: {
      code: [
        "int factorial(int n) {",
        "  if (n == 1) {",
        "    return 1;",
        "  }",
        "  return n * factorial(n - 1);",
        "}",
      ],
    },
    java: {
      code: [
        "static int factorial(int n) {",
        "  if (n == 1) {",
        "    return 1;",
        "  }",
        "  return n * factorial(n - 1);",
        "}",
      ],
    },
    python: {
      code: [
        "def factorial(n):",
        "  if n == 1:",
        "    return 1",
        "  return n * factorial(n - 1)",
      ],
      // JS line 5 is Python line 4; the closing braces have no line here.
      lineMap: { 4: [], 5: [4], 6: [] },
    },
  },
  makeInput: makeFactorialInput,
  buildSteps: buildFactorialSteps,
};

const FACTORIAL_MIN_N = 3;
const FACTORIAL_MAX_N = 5;

function makeFactorialInput() {
  const range = FACTORIAL_MAX_N - FACTORIAL_MIN_N + 1;
  return FACTORIAL_MIN_N + Math.floor(Math.random() * range);
}

// `input` is the number n. The steps follow the real calls:
// factorial(n), factorial(n - 1), ... factorial(1), then the returns.
function buildFactorialSteps(input) {
  const steps = [];
  // The numbers of the calls that are on the stack now, bottom first.
  const callNumbers = [];
  const result = factorialCall(steps, callNumbers, input);

  const lastStep = makeFactorialStep(
    [], [], { label: "factorial(" + input + ")", value: result }, {},
    "Готово! factorial(" + input + ") = " + result + ". Стекът е празен: всички извиквания са се върнали."
  );
  steps.push(lastStep);
  return steps;
}

// Runs factorial(n) and adds its steps. Returns the result.
function factorialCall(steps, callNumbers, n) {
  callNumbers.push(n);
  addFactorialStep(steps, callNumbers, null, [1], { n: n },
    "Викаме factorial(" + n + "). Върху стека се слага нова кутия с n = " + n + ".");

  if (n === 1) {
    addFactorialStep(steps, callNumbers, null, [2], { n: n },
      "n е 1 — това е най-малкият случай (base case). Тук рекурсията спира.");
    callNumbers.pop();
    addFactorialStep(steps, callNumbers, { n: 1, value: 1 }, [3], { n: n, "резултат": 1 },
      "factorial(1) връща 1 и кутията му излиза от стека.");
    return 1;
  }

  addFactorialStep(steps, callNumbers, null, [2], { n: n },
    "n е " + n + ", не е 1. Значи не сме стигнали дъното и трябва да продължим.");
  addFactorialStep(steps, callNumbers, null, [5], { n: n },
    "Не можем да пресметнем " + n + " · factorial(" + (n - 1) + "), докато не знаем factorial(" + (n - 1) + "). Викаме го.");

  const smallerResult = factorialCall(steps, callNumbers, n - 1);
  const result = n * smallerResult;

  callNumbers.pop();
  addFactorialStep(steps, callNumbers, { n: n, value: result }, [5], { n: n, "резултат": result },
    "factorial(" + n + ") = " + n + " · " + smallerResult + " = " + result + ". Връща " + result + " и кутията излиза от стека.");
  return result;
}

// Adds a step. `returnedCall` is { n, value } for a call that has just
// returned, or null.
function addFactorialStep(steps, callNumbers, returnedCall, lines, vars, text) {
  const stack = makeFactorialStack(callNumbers, returnedCall);
  let returned = null;
  if (returnedCall) {
    returned = { label: "factorial(" + returnedCall.n + ")", value: returnedCall.value };
  }
  steps.push(makeFactorialStep(stack, lines, returned, vars, text));
}

function makeFactorialStack(callNumbers, returnedCall) {
  const stack = [];
  for (let index = 0; index < callNumbers.length; index++) {
    const n = callNumbers[index];
    const isTop = index === callNumbers.length - 1;
    let note = "n = " + n;
    if (!isTop) {
      note = "n = " + n + ", чака factorial(" + (n - 1) + ")";
    } else if (returnedCall) {
      note = "n = " + n + ", получи " + returnedCall.value;
    }
    stack.push({ label: "factorial(" + n + ")", note: note });
  }
  return stack;
}

function makeFactorialStep(stack, lines, returned, vars, text) {
  return {
    bars: [],
    highlight: [],
    swapped: false,
    sorted: [],
    lines: lines,
    vars: vars,
    text: text,
    compares: 0,
    swaps: 0,
    stack: stack,
    returned: returned,
  };
}
