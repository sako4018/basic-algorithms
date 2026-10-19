// Selection sort lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const selectionSortLesson = {
  id: "selection-sort",
  title: "Сортиране чрез избор (selection sort)",
  intro:
    "Търсим най-малкия елемент в неподредената част на масива и го слагаме най-отляво. " +
    "После повтаряме същото за останалата част. Така подредената част расте с по един " +
    "елемент отляво надясно.",
  code: [
    "function selectionSort(arr) {",
    "  for (let i = 0; i < arr.length - 1; i++) {",
    "    let minIndex = i;",
    "    for (let j = i + 1; j < arr.length; j++) {",
    "      if (arr[j] < arr[minIndex]) {",
    "        minIndex = j;",
    "      }",
    "    }",
    "    if (minIndex !== i) {",
    "      const temp = arr[i];",
    "      arr[i] = arr[minIndex];",
    "      arr[minIndex] = temp;",
    "    }",
    "  }",
    "  return arr;",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "void selectionSort(int arr[], int n) {",
        "  for (int i = 0; i < n - 1; i++) {",
        "    int minIndex = i;",
        "    for (int j = i + 1; j < n; j++) {",
        "      if (arr[j] < arr[minIndex]) {",
        "        minIndex = j;",
        "      }",
        "    }",
        "    if (minIndex != i) {",
        "      int temp = arr[i];",
        "      arr[i] = arr[minIndex];",
        "      arr[minIndex] = temp;",
        "    }",
        "  }",
        "}",
      ],
    },
    cpp: {
      code: [
        "void selectionSort(vector<int>& arr) {",
        "  for (int i = 0; i < (int)arr.size() - 1; i++) {",
        "    int minIndex = i;",
        "    for (int j = i + 1; j < (int)arr.size(); j++) {",
        "      if (arr[j] < arr[minIndex]) {",
        "        minIndex = j;",
        "      }",
        "    }",
        "    if (minIndex != i) {",
        "      int temp = arr[i];",
        "      arr[i] = arr[minIndex];",
        "      arr[minIndex] = temp;",
        "    }",
        "  }",
        "}",
      ],
    },
    java: {
      code: [
        "static void selectionSort(int[] arr) {",
        "  for (int i = 0; i < arr.length - 1; i++) {",
        "    int minIndex = i;",
        "    for (int j = i + 1; j < arr.length; j++) {",
        "      if (arr[j] < arr[minIndex]) {",
        "        minIndex = j;",
        "      }",
        "    }",
        "    if (minIndex != i) {",
        "      int temp = arr[i];",
        "      arr[i] = arr[minIndex];",
        "      arr[minIndex] = temp;",
        "    }",
        "  }",
        "}",
      ],
    },
    python: {
      code: [
        "def selection_sort(arr):",
        "    for i in range(len(arr) - 1):",
        "        minIndex = i",
        "        for j in range(i + 1, len(arr)):",
        "            if arr[j] < arr[minIndex]:",
        "                minIndex = j",
        "        if minIndex != i:",
        "            temp = arr[i]",
        "            arr[i] = arr[minIndex]",
        "            arr[minIndex] = temp",
        "    return arr",
      ],
      lineMap: { 9: [7], 10: [8], 11: [9], 12: [10], 15: [11] },
    },
  },
  buildSteps: buildSelectionSortSteps,
};

function buildSelectionSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const sortedIndexes = [];
  let compareCount = 0;
  let swapCount = 0;

  function addStep(lines, highlight, text, vars, swapped) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: swapped === true,
      sorted: sortedIndexes.slice(),
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: swapCount,
      text: text,
    });
  }

  // Puts the minimum found in this pass at position i (lines 9-12 of `code`).
  function swapMinimumToFront(i, minIndex) {
    if (minIndex === i) {
      addStep([9], [i], "Числото " + arr[i] + " вече е най-малкото, няма нужда от размяна.", { i: i, minIndex: minIndex });
      return;
    }

    addStep(
      [9],
      [i, minIndex],
      "Минимумът е " + arr[minIndex] + " на позиция " + minIndex + ". Разменяме го с " + arr[i] + " на позиция " + i + ".",
      { i: i, minIndex: minIndex, "arr[i]": arr[i], "arr[minIndex]": arr[minIndex] }
    );

    const temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
    swapCount++;

    addStep(
      [10, 11, 12],
      [i, minIndex],
      "Разменени са. Сега " + arr[i] + " е на позиция " + i + ".",
      { i: i, minIndex: minIndex, "arr[i]": arr[i], "arr[minIndex]": arr[minIndex] },
      true
    );
  }

  addStep([1], [], "Започваме. Масивът още не е подреден.", {});

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    addStep(
      [2, 3],
      [i],
      "Позиция " + i + ": засега смятаме, че най-малкото число е " + arr[i] + ".",
      { i: i, minIndex: minIndex, "arr[minIndex]": arr[minIndex] }
    );

    for (let j = i + 1; j < arr.length; j++) {
      compareCount++;
      const vars = { i: i, j: j, minIndex: minIndex, "arr[j]": arr[j], "arr[minIndex]": arr[minIndex] };

      if (arr[j] < arr[minIndex]) {
        addStep(
          [4, 5],
          [j, minIndex],
          "Сравнявам " + arr[j] + " и " + arr[minIndex] + ": " + arr[j] + " < " + arr[minIndex] + ", намерихме по-малко число.",
          vars
        );
        minIndex = j;
        addStep(
          [6],
          [minIndex],
          "Запомням позиция " + minIndex + " като нов минимум (" + arr[minIndex] + ").",
          { i: i, j: j, minIndex: minIndex, "arr[minIndex]": arr[minIndex] }
        );
      } else {
        addStep(
          [4, 5],
          [j, minIndex],
          "Сравнявам " + arr[j] + " и " + arr[minIndex] + ": " + arr[j] + " ≥ " + arr[minIndex] + ", минимумът не се сменя.",
          vars
        );
      }
    }

    swapMinimumToFront(i, minIndex);
    sortedIndexes.push(i);
    addStep([2], [], "Числото " + arr[i] + " е на правилното си място.", { i: i });
  }

  if (arr.length > 0) {
    sortedIndexes.push(arr.length - 1);
  }
  addStep([15], [], "Готово! Масивът е подреден с " + compareCount + " сравнения и " + swapCount + " размени.", {});

  return steps;
}
