// Min and max lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const minMaxLesson = {
  id: "min-max",
  title: "Минимум и максимум (min и max)",
  intro:
    "Търсим най-малкото (минимум) и най-голямото (максимум) число в масива. Приемаме, че " +
    "първото число е и двете. После минаваме веднъж през останалите: ако някое е по-малко " +
    "от минимума, то става новият минимум, а ако е по-голямо от максимума, става новият максимум.",
  code: [
    "function minMax(arr) {",
    "  let min = arr[0];",
    "  let max = arr[0];",
    "  for (let i = 1; i < arr.length; i++) {",
    "    if (arr[i] < min) {",
    "      min = arr[i];",
    "    }",
    "    if (arr[i] > max) {",
    "      max = arr[i];",
    "    }",
    "  }",
    "  return [min, max];",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "void minMax(int arr[], int n) {",
        "  int min = arr[0];",
        "  int max = arr[0];",
        "  for (int i = 1; i < n; i++) {",
        "    if (arr[i] < min) {",
        "      min = arr[i];",
        "    }",
        "    if (arr[i] > max) {",
        "      max = arr[i];",
        "    }",
        "  }",
        "  printf(\"min = %d, max = %d\\n\", min, max);",
        "}",
      ],
    },
    cpp: {
      code: [
        "void minMax(vector<int>& arr) {",
        "  int min = arr[0];",
        "  int max = arr[0];",
        "  for (int i = 1; i < (int)arr.size(); i++) {",
        "    if (arr[i] < min) {",
        "      min = arr[i];",
        "    }",
        "    if (arr[i] > max) {",
        "      max = arr[i];",
        "    }",
        "  }",
        "  cout << \"min = \" << min << \", max = \" << max << endl;",
        "}",
      ],
    },
    java: {
      code: [
        "static void minMax(int[] arr) {",
        "  int min = arr[0];",
        "  int max = arr[0];",
        "  for (int i = 1; i < arr.length; i++) {",
        "    if (arr[i] < min) {",
        "      min = arr[i];",
        "    }",
        "    if (arr[i] > max) {",
        "      max = arr[i];",
        "    }",
        "  }",
        "  System.out.println(\"min = \" + min + \", max = \" + max);",
        "}",
      ],
    },
    python: {
      code: [
        "def min_max(arr):",
        "    min = arr[0]",
        "    max = arr[0]",
        "    for i in range(1, len(arr)):",
        "        if arr[i] < min:",
        "            min = arr[i]",
        "        if arr[i] > max:",
        "            max = arr[i]",
        "    return min, max",
      ],
      lineMap: { 8: [7], 9: [8], 12: [9] },
    },
  },
  buildSteps: buildMinMaxSteps,
};

// The array is never changed. Yellow is the number we look at now; an
// outline (`marked`) shows where the current min and max are, so the
// student sees them move.
function buildMinMaxSteps(input) {
  const arr = input.slice();
  const steps = [];
  let minIndex = 0;
  let maxIndex = 0;
  // False on the very first step, before min and max get arr[0].
  let minMaxSet = false;
  let compareCount = 0;

  function addStep(lines, highlight, text, vars) {
    let marked = [];
    if (minMaxSet) {
      marked = minIndex === maxIndex ? [minIndex] : [minIndex, maxIndex];
    }
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: false,
      sorted: [],
      marked: marked,
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: 0,
      text: text,
    });
  }

  function currentVars(i) {
    return { i: i, "arr[i]": arr[i], min: arr[minIndex], max: arr[maxIndex] };
  }

  function addMinCheckSteps(i) {
    compareCount++;
    const value = arr[i];
    const min = arr[minIndex];
    if (value < min) {
      addStep([4, 5], [i], "Гледаме " + value + ". По-малко ли е от минимума " + min + "? Да, " + value + " < " + min + ".", currentVars(i));
      minIndex = i;
      addStep([6], [i], "Новият минимум е " + value + ".", currentVars(i));
    } else {
      addStep([4, 5], [i], "Гледаме " + value + ". По-малко ли е от минимума " + min + "? Не, минимумът остава " + min + ".", currentVars(i));
    }
  }

  function addMaxCheckSteps(i) {
    compareCount++;
    const value = arr[i];
    const max = arr[maxIndex];
    if (value > max) {
      addStep([8], [i], "По-голямо ли е " + value + " от максимума " + max + "? Да, " + value + " > " + max + ".", currentVars(i));
      maxIndex = i;
      addStep([9], [i], "Новият максимум е " + value + ".", currentVars(i));
    } else {
      addStep([8], [i], "По-голямо ли е " + value + " от максимума " + max + "? Не, максимумът остава " + max + ".", currentVars(i));
    }
  }

  addStep([1], [], "Започваме. Търсим най-малкото и най-голямото число.", {});
  minMaxSet = true;
  addStep([2, 3], [0], "Първото число е " + arr[0] + ". Засега то е и минимум, и максимум. Контурът около стълб показва къде са те.", { min: arr[0], max: arr[0] });

  for (let i = 1; i < arr.length; i++) {
    addMinCheckSteps(i);
    addMaxCheckSteps(i);
  }

  addStep([12], [], "Готово! Най-малкото число е " + arr[minIndex] + ", а най-голямото е " + arr[maxIndex] +
    ". Направихме " + compareCount + " сравнения, без да разместваме нищо.", { min: arr[minIndex], max: arr[maxIndex] });

  return steps;
}
