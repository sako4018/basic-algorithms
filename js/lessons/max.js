// Maximum lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const maxLesson = {
  id: "max",
  title: "Максимум (maximum)",
  intro:
    "Търсим най-голямото число (максимум) в масива. Приемаме, че първото число е максимумът. " +
    "После минаваме през останалите: ако някое е по-голямо от максимума, то става новият максимум.",
  code: [
    "function findMax(arr) {",
    "  let max = arr[0];",
    "  for (let i = 1; i < arr.length; i++) {",
    "    if (arr[i] > max) {",
    "      max = arr[i];",
    "    }",
    "  }",
    "  return max;",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "void findMax(int arr[], int n) {",
        "  int max = arr[0];",
        "  for (int i = 1; i < n; i++) {",
        "    if (arr[i] > max) {",
        "      max = arr[i];",
        "    }",
        "  }",
        "  printf(\"max = %d\\n\", max);",
        "}",
      ],
    },
    cpp: {
      code: [
        "void findMax(vector<int>& arr) {",
        "  int max = arr[0];",
        "  for (int i = 1; i < (int)arr.size(); i++) {",
        "    if (arr[i] > max) {",
        "      max = arr[i];",
        "    }",
        "  }",
        "  cout << \"max = \" << max << endl;",
        "}",
      ],
    },
    java: {
      code: [
        "static void findMax(int[] arr) {",
        "  int max = arr[0];",
        "  for (int i = 1; i < arr.length; i++) {",
        "    if (arr[i] > max) {",
        "      max = arr[i];",
        "    }",
        "  }",
        "  System.out.println(\"max = \" + max);",
        "}",
      ],
    },
    python: {
      code: [
        "def find_max(arr):",
        "    max = arr[0]",
        "    for i in range(1, len(arr)):",
        "        if arr[i] > max:",
        "            max = arr[i]",
        "    return max",
      ],
      lineMap: { 8: [6] },
    },
  },
  buildSteps: buildMaxSteps,
};

// The array is never changed. Yellow is the number we look at now; an
// outline (`marked`) shows where the current maximum is, so the student
// sees it move.
function buildMaxSteps(input) {
  const arr = input.slice();
  const steps = [];
  let maxIndex = 0;
  // False on the very first step, before max gets arr[0].
  let maxSet = false;
  let compareCount = 0;

  function addStep(lines, highlight, text, vars) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: false,
      sorted: [],
      marked: maxSet ? [maxIndex] : [],
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: 0,
      text: text,
    });
  }

  function currentVars(i) {
    return { i: i, "arr[i]": arr[i], max: arr[maxIndex] };
  }

  function addCheckSteps(i) {
    compareCount++;
    const value = arr[i];
    const max = arr[maxIndex];
    if (value > max) {
      addStep([3, 4], [i], "Гледаме " + value + ". По-голямо ли е от максимума " + max + "? Да, " + value + " > " + max + ".", currentVars(i));
      maxIndex = i;
      addStep([5], [i], "Новият максимум е " + value + ".", currentVars(i));
    } else {
      addStep([3, 4], [i], "Гледаме " + value + ". По-голямо ли е от максимума " + max + "? Не, максимумът остава " + max + ".", currentVars(i));
    }
  }

  addStep([1], [], "Започваме. Търсим най-голямото число.", {});
  maxSet = true;
  addStep([2], [0], "Първото число е " + arr[0] + ". Засега то е максимумът. Контурът около стълб показва къде е той.", { max: arr[0] });

  for (let i = 1; i < arr.length; i++) {
    addCheckSteps(i);
  }

  addStep([8], [], "Готово! Най-голямото число е " + arr[maxIndex] + ". Направихме " + compareCount +
    " сравнения, без да разместваме нищо.", { max: arr[maxIndex] });

  return steps;
}
