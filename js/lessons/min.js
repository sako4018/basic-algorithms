// Minimum lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const minLesson = {
  id: "min",
  title: "Минимум (minimum)",
  intro:
    "Търсим най-малкото число (минимум) в масива. Приемаме, че първото число е минимумът. " +
    "После минаваме през останалите: ако някое е по-малко от минимума, то става новият минимум.",
  code: [
    "function findMin(arr) {",
    "  let min = arr[0];",
    "  for (let i = 1; i < arr.length; i++) {",
    "    if (arr[i] < min) {",
    "      min = arr[i];",
    "    }",
    "  }",
    "  return min;",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "void findMin(int arr[], int n) {",
        "  int min = arr[0];",
        "  for (int i = 1; i < n; i++) {",
        "    if (arr[i] < min) {",
        "      min = arr[i];",
        "    }",
        "  }",
        "  printf(\"min = %d\\n\", min);",
        "}",
      ],
    },
    cpp: {
      code: [
        "void findMin(vector<int>& arr) {",
        "  int min = arr[0];",
        "  for (int i = 1; i < (int)arr.size(); i++) {",
        "    if (arr[i] < min) {",
        "      min = arr[i];",
        "    }",
        "  }",
        "  cout << \"min = \" << min << endl;",
        "}",
      ],
    },
    java: {
      code: [
        "static void findMin(int[] arr) {",
        "  int min = arr[0];",
        "  for (int i = 1; i < arr.length; i++) {",
        "    if (arr[i] < min) {",
        "      min = arr[i];",
        "    }",
        "  }",
        "  System.out.println(\"min = \" + min);",
        "}",
      ],
    },
    python: {
      code: [
        "def find_min(arr):",
        "    min = arr[0]",
        "    for i in range(1, len(arr)):",
        "        if arr[i] < min:",
        "            min = arr[i]",
        "    return min",
      ],
      lineMap: { 8: [6] },
    },
  },
  buildSteps: buildMinSteps,
};

// The array is never changed. Yellow is the number we look at now; an
// outline (`marked`) shows where the current minimum is, so the student
// sees it move.
function buildMinSteps(input) {
  const arr = input.slice();
  const steps = [];
  let minIndex = 0;
  // False on the very first step, before min gets arr[0].
  let minSet = false;
  let compareCount = 0;

  function addStep(lines, highlight, text, vars) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: false,
      sorted: [],
      marked: minSet ? [minIndex] : [],
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: 0,
      text: text,
    });
  }

  function currentVars(i) {
    return { i: i, "arr[i]": arr[i], min: arr[minIndex] };
  }

  function addCheckSteps(i) {
    compareCount++;
    const value = arr[i];
    const min = arr[minIndex];
    if (value < min) {
      addStep([3, 4], [i], "Гледаме " + value + ". По-малко ли е от минимума " + min + "? Да, " + value + " < " + min + ".", currentVars(i));
      minIndex = i;
      addStep([5], [i], "Новият минимум е " + value + ".", currentVars(i));
    } else {
      addStep([3, 4], [i], "Гледаме " + value + ". По-малко ли е от минимума " + min + "? Не, минимумът остава " + min + ".", currentVars(i));
    }
  }

  addStep([1], [], "Започваме. Търсим най-малкото число.", {});
  minSet = true;
  addStep([2], [0], "Първото число е " + arr[0] + ". Засега то е минимумът. Контурът около стълб показва къде е той.", { min: arr[0] });

  for (let i = 1; i < arr.length; i++) {
    addCheckSteps(i);
  }

  addStep([8], [], "Готово! Най-малкото число е " + arr[minIndex] + ". Направихме " + compareCount +
    " сравнения, без да разместваме нищо.", { min: arr[minIndex] });

  return steps;
}
