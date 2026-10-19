// Linear search lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const linearSearchLesson = {
  id: "linear-search",
  title: "Линейно търсене (linear search)",
  intro:
    "Търсим едно число в масива. Проверяваме елементите един по един отляво надясно, " +
    "както търсиш приятел в редица хора: гледаш всеки, докато не го видиш. Ако го " +
    "намерим, връщаме позицията му. Ако стигнем края, без да го срещнем, връщаме -1.",
  code: [
    "function linearSearch(arr, target) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    if (arr[i] === target) {",
    "      return i;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "int linearSearch(int arr[], int n, int target) {",
        "  for (int i = 0; i < n; i++) {",
        "    if (arr[i] == target) {",
        "      return i;",
        "    }",
        "  }",
        "  return -1;",
        "}",
      ],
    },
    cpp: {
      code: [
        "int linearSearch(vector<int>& arr, int target) {",
        "  for (int i = 0; i < (int)arr.size(); i++) {",
        "    if (arr[i] == target) {",
        "      return i;",
        "    }",
        "  }",
        "  return -1;",
        "}",
      ],
    },
    java: {
      code: [
        "static int linearSearch(int[] arr, int target) {",
        "  for (int i = 0; i < arr.length; i++) {",
        "    if (arr[i] == target) {",
        "      return i;",
        "    }",
        "  }",
        "  return -1;",
        "}",
      ],
    },
    python: {
      code: [
        "def linear_search(arr, target):",
        "    for i in range(len(arr)):",
        "        if arr[i] == target:",
        "            return i",
        "    return -1",
      ],
      lineMap: { 7: [5] },
    },
  },
  buildSteps: buildLinearSearchSteps,
};

// Rule: about one run in four the target is a number that is NOT in the
// array, so the student also sees the "not found" (-1) ending.
const LINEAR_SEARCH_MISSING_CHANCE = 0.25;
const LINEAR_SEARCH_MIN_TARGET = 5;
const LINEAR_SEARCH_MAX_TARGET = 99;

function pickLinearSearchTarget(arr) {
  if (arr.length === 0) {
    return 0;
  }
  if (Math.random() < LINEAR_SEARCH_MISSING_CHANCE) {
    return pickLinearSearchMissingNumber(arr);
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// A number in the usual range that no element of arr has.
function pickLinearSearchMissingNumber(arr) {
  const range = LINEAR_SEARCH_MAX_TARGET - LINEAR_SEARCH_MIN_TARGET + 1;
  let candidate = LINEAR_SEARCH_MIN_TARGET + Math.floor(Math.random() * range);
  while (arr.includes(candidate)) {
    candidate++;
    if (candidate > LINEAR_SEARCH_MAX_TARGET) {
      candidate = LINEAR_SEARCH_MIN_TARGET;
    }
  }
  return candidate;
}

function linearSearchCompareText(compareCount) {
  if (compareCount === 1) {
    return "1 сравнение";
  }
  return compareCount + " сравнения";
}

function buildLinearSearchSteps(input) {
  const arr = input.slice();
  const target = pickLinearSearchTarget(arr);
  const steps = [];
  // Positions already checked and not equal to the target; shown dimmed.
  const checkedIndexes = [];
  let compareCount = 0;

  function addStep(lines, highlight, text, vars) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: false,
      sorted: [],
      dimmed: checkedIndexes.slice(),
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: 0,
      text: text,
    });
  }

  const startText = "Започваме. Търсим числото " + target + " в масива. Понякога търсеното число го няма в масива. Проверените стълбове стават прозрачни.";
  addStep([1], [], startText, { target: target });

  for (let i = 0; i < arr.length; i++) {
    compareCount++;
    const vars = { target: target, i: i, "arr[i]": arr[i] };

    if (arr[i] === target) {
      addStep([2, 3], [i], "Проверявам позиция " + i + ": " + arr[i] + " = " + target + ". Намерихме го!", vars);
      addStep([4], [i], "Готово! Числото " + target + " е на позиция " + i + ". Направихме " + linearSearchCompareText(compareCount) + ".", vars);
      return steps;
    }

    addStep([2, 3], [i], "Проверявам позиция " + i + ": " + arr[i] + " ≠ " + target + ", продължавам нататък.", vars);
    checkedIndexes.push(i);
  }

  addStep([7], [], "Готово! Минахме целия масив с " + linearSearchCompareText(compareCount) + " и не намерихме " + target + ". Връщаме -1.", { target: target });
  return steps;
}
