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

// The target is a number from the array, so the search always finds it.
function pickLinearSearchTarget(arr) {
  if (arr.length === 0) {
    return 0;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
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
  const foundIndexes = [];
  let compareCount = 0;

  function addStep(lines, highlight, text, vars) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: false,
      sorted: foundIndexes.slice(),
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: 0,
      text: text,
    });
  }

  addStep([1], [], "Започваме. Търсим числото " + target + " в масива.", { target: target });

  for (let i = 0; i < arr.length; i++) {
    compareCount++;
    const vars = { target: target, i: i, "arr[i]": arr[i] };

    if (arr[i] === target) {
      addStep([2, 3], [i], "Проверявам позиция " + i + ": " + arr[i] + " = " + target + ". Намерихме го!", vars);
      foundIndexes.push(i);
      addStep([4], [], "Готово! Числото " + target + " е на позиция " + i + ". Направихме " + linearSearchCompareText(compareCount) + ".", vars);
      return steps;
    }

    addStep([2, 3], [i], "Проверявам позиция " + i + ": " + arr[i] + " ≠ " + target + ", продължавам нататък.", vars);
  }

  addStep([7], [], "Готово! Минахме целия масив с " + linearSearchCompareText(compareCount) + " и не намерихме " + target + ". Връщаме -1.", { target: target });
  return steps;
}
