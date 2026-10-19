// Recursion lesson: Tower of Hanoi, drawn as a call stack plus the three
// pegs (view "stack"). The player shows `code` next to the view. Each step
// says which line (1-based) of `code` is active, so keep them in sync.

const recursionHanoiLesson = {
  id: "recursion-hanoi",
  title: "Рекурсия: Ханойски кули (Tower of Hanoi)",
  intro:
    "Трябва да преместим всички дискове от първия прът на третия, като местим по един диск " +
    "и никога не слагаме голям диск върху малък. Рекурсивната идея: първо преместваме " +
    "n - 1 диска настрани, после най-големия, после n - 1 диска върху него.",
  view: "stack",
  code: [
    "function hanoi(n, source, target, spare) {",
    "  if (n === 1) {",
    "    console.log(\"Disk 1: \" + source + \" -> \" + target);",
    "    return;",
    "  }",
    "  hanoi(n - 1, source, spare, target);",
    "  console.log(\"Disk \" + n + \": \" + source + \" -> \" + target);",
    "  hanoi(n - 1, spare, target, source);",
    "}",
  ],
  otherLanguages: {
    c: {
      code: [
        "void hanoi(int n, char source, char target, char spare) {",
        "  if (n == 1) {",
        "    printf(\"Disk 1: %c -> %c\\n\", source, target);",
        "    return;",
        "  }",
        "  hanoi(n - 1, source, spare, target);",
        "  printf(\"Disk %d: %c -> %c\\n\", n, source, target);",
        "  hanoi(n - 1, spare, target, source);",
        "}",
      ],
    },
    cpp: {
      code: [
        "void hanoi(int n, char source, char target, char spare) {",
        "  if (n == 1) {",
        "    cout << \"Disk 1: \" << source << \" -> \" << target << endl;",
        "    return;",
        "  }",
        "  hanoi(n - 1, source, spare, target);",
        "  cout << \"Disk \" << n << \": \" << source << \" -> \" << target << endl;",
        "  hanoi(n - 1, spare, target, source);",
        "}",
      ],
    },
    csharp: {
      code: [
        "static void hanoi(int n, char source, char target, char spare) {",
        "  if (n == 1) {",
        "    Console.WriteLine(\"Disk 1: \" + source + \" -> \" + target);",
        "    return;",
        "  }",
        "  hanoi(n - 1, source, spare, target);",
        "  Console.WriteLine(\"Disk \" + n + \": \" + source + \" -> \" + target);",
        "  hanoi(n - 1, spare, target, source);",
        "}",
      ],
    },
    java: {
      code: [
        "static void hanoi(int n, char source, char target, char spare) {",
        "  if (n == 1) {",
        "    System.out.println(\"Disk 1: \" + source + \" -> \" + target);",
        "    return;",
        "  }",
        "  hanoi(n - 1, source, spare, target);",
        "  System.out.println(\"Disk \" + n + \": \" + source + \" -> \" + target);",
        "  hanoi(n - 1, spare, target, source);",
        "}",
      ],
    },
    python: {
      code: [
        "def hanoi(n, source, target, spare):",
        "  if n == 1:",
        "    print(\"Disk 1: \" + source + \" -> \" + target)",
        "    return",
        "  hanoi(n - 1, source, spare, target)",
        "  print(\"Disk \" + str(n) + \": \" + source + \" -> \" + target)",
        "  hanoi(n - 1, spare, target, source)",
      ],
      // JS lines 1-4 are the same. Line 5 is the closing brace of the if.
      // Line 9 (end of the function) is shown on the last Python line.
      lineMap: { 5: [], 6: [5], 7: [6], 8: [7], 9: [7] },
    },
  },
  makeInput: makeHanoiInput,
  buildSteps: buildHanoiSteps,
};

const HANOI_DISK_COUNT = 3;
const HANOI_PEG_NAMES = ["A", "B", "C"];

function makeHanoiInput() {
  return HANOI_DISK_COUNT;
}

// `input` is the number of disks. All of them start on peg A (index 0) and
// must get to peg C (index 2); peg B (index 1) is the spare one.
function buildHanoiSteps(input) {
  const state = { steps: [], calls: [], pegs: [[], [], []], moveCount: 0 };
  for (let disk = input; disk >= 1; disk--) {
    state.pegs[0].push(disk);
  }
  hanoiCall(state, input, 0, 2, 1);

  const lastText = "Готово! Всички " + input + " диска са на прът C след " + state.moveCount +
    " премествания. Стекът е празен: всички извиквания са се върнали.";
  state.steps.push(makeHanoiStep(state, [], 0, null, {}, lastText));
  return state.steps;
}

// Runs hanoi(n, source, target, spare) and adds its steps.
function hanoiCall(state, n, source, target, spare) {
  const call = { n: n, source: source, target: target, spare: spare };
  state.calls.push(call);
  const vars = hanoiVars(call);
  addHanoiStep(state, [1], 0, null, vars,
    "Викаме " + hanoiLabel(call) + ". Върху стека се слага нова кутия.");

  if (n === 1) {
    addHanoiStep(state, [2], 0, null, vars,
      "n е 1 — остава един диск, това е най-малкият случай (base case). Просто го местим.");
    moveHanoiDisk(state, 1, source, target);
    addHanoiStep(state, [3], 1, null, vars,
      "Преместваме диск 1 от " + HANOI_PEG_NAMES[source] + " на " + HANOI_PEG_NAMES[target] + ".");
    state.calls.pop();
    addHanoiStep(state, [4], 0, { label: hanoiLabel(call), value: null }, vars,
      hanoiLabel(call) + " приключи и кутията му излиза от стека.");
    return;
  }

  addHanoiStep(state, [2], 0, null, vars,
    "n е " + n + ", не е 1. Първо трябва да преместим " + (n - 1) + " " + hanoiDiskWord(n - 1) + " настрани.");
  addHanoiStep(state, [6], 0, null, vars,
    "Преместваме " + (n - 1) + " " + hanoiDiskWord(n - 1) + " от " + HANOI_PEG_NAMES[source] + " на " +
    HANOI_PEG_NAMES[spare] + ", за да освободим диск " + n + ".");
  hanoiCall(state, n - 1, source, spare, target);

  moveHanoiDisk(state, n, source, target);
  addHanoiStep(state, [7], n, null, vars,
    "Най-големият диск " + n + " е свободен. Преместваме го от " + HANOI_PEG_NAMES[source] + " на " +
    HANOI_PEG_NAMES[target] + ".");
  addHanoiStep(state, [8], 0, null, vars,
    "Сега връщаме " + (n - 1) + " " + hanoiDiskWord(n - 1) + " от " + HANOI_PEG_NAMES[spare] + " върху диск " +
    n + " на " + HANOI_PEG_NAMES[target] + ".");
  hanoiCall(state, n - 1, spare, target, source);

  state.calls.pop();
  addHanoiStep(state, [9], 0, { label: hanoiLabel(call), value: null }, vars,
    hanoiLabel(call) + " приключи: диск " + n + " и всички по-малки са на " + HANOI_PEG_NAMES[target] + ".");
}

function hanoiDiskWord(count) {
  return count === 1 ? "диск" : "диска";
}

function moveHanoiDisk(state, disk, source, target) {
  state.pegs[source].pop();
  state.pegs[target].push(disk);
  state.moveCount++;
}

function hanoiLabel(call) {
  return "hanoi(" + call.n + ", " + HANOI_PEG_NAMES[call.source] + ", " +
    HANOI_PEG_NAMES[call.target] + ", " + HANOI_PEG_NAMES[call.spare] + ")";
}

function hanoiVars(call) {
  return {
    n: call.n,
    source: HANOI_PEG_NAMES[call.source],
    target: HANOI_PEG_NAMES[call.target],
    spare: HANOI_PEG_NAMES[call.spare],
  };
}

function addHanoiStep(state, lines, movedDisk, returned, vars, text) {
  state.steps.push(makeHanoiStep(state, lines, movedDisk, returned, vars, text));
}

function makeHanoiStep(state, lines, movedDisk, returned, vars, text) {
  const stack = [];
  for (const call of state.calls) {
    const note = call.n + (call.n === 1 ? " диск: " : " диска: ") +
      HANOI_PEG_NAMES[call.source] + " → " + HANOI_PEG_NAMES[call.target];
    stack.push({ label: hanoiLabel(call), note: note });
  }
  // Copies of the pegs, because the state keeps changing after this step.
  const pegsCopy = state.pegs.map(function (peg) {
    return peg.slice();
  });
  return {
    bars: [],
    highlight: [],
    swapped: false,
    sorted: [],
    lines: lines,
    vars: vars,
    text: text,
    compares: 0,
    swaps: state.moveCount,
    stack: stack,
    returned: returned,
    pegs: pegsCopy,
    movedDisk: movedDisk,
  };
}
