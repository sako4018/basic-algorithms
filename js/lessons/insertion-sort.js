// Insertion sort lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const insertionSortLesson = {
  id: "insertion-sort",
  title: "Сортиране чрез вмъкване (insertion sort)",
  intro:
    "Подреждаме масива като карти в ръка. Лявата част винаги е подредена. Взимаме следващото " +
    "число и го връщаме наляво, докато намери мястото си, като преместваме по-големите " +
    "числа с една позиция надясно.",
  code: [
    "function insertionSort(arr) {",
    "  for (let i = 1; i < arr.length; i++) {",
    "    const current = arr[i];",
    "    let j = i - 1;",
    "    while (j >= 0 && arr[j] > current) {",
    "      arr[j + 1] = arr[j];",
    "      j--;",
    "    }",
    "    arr[j + 1] = current;",
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
        "void insertionSort(int arr[], int n) {",
        "  for (int i = 1; i < n; i++) {",
        "    int current = arr[i];",
        "    int j = i - 1;",
        "    while (j >= 0 && arr[j] > current) {",
        "      arr[j + 1] = arr[j];",
        "      j--;",
        "    }",
        "    arr[j + 1] = current;",
        "  }",
        "}",
      ],
    },
    cpp: {
      code: [
        "void insertionSort(vector<int>& arr) {",
        "  for (int i = 1; i < (int)arr.size(); i++) {",
        "    int current = arr[i];",
        "    int j = i - 1;",
        "    while (j >= 0 && arr[j] > current) {",
        "      arr[j + 1] = arr[j];",
        "      j--;",
        "    }",
        "    arr[j + 1] = current;",
        "  }",
        "}",
      ],
    },
    java: {
      code: [
        "static void insertionSort(int[] arr) {",
        "  for (int i = 1; i < arr.length; i++) {",
        "    int current = arr[i];",
        "    int j = i - 1;",
        "    while (j >= 0 && arr[j] > current) {",
        "      arr[j + 1] = arr[j];",
        "      j--;",
        "    }",
        "    arr[j + 1] = current;",
        "  }",
        "}",
      ],
    },
    python: {
      code: [
        "def insertion_sort(arr):",
        "    for i in range(1, len(arr)):",
        "        current = arr[i]",
        "        j = i - 1",
        "        while j >= 0 and arr[j] > current:",
        "            arr[j + 1] = arr[j]",
        "            j -= 1",
        "        arr[j + 1] = current",
        "    return arr",
      ],
      lineMap: { 9: [8], 11: [9] },
    },
  },
  buildSteps: buildInsertionSortSteps,
};

function buildInsertionSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const sortedIndexes = [];
  let compareCount = 0;
  let swapCount = 0;
  // While `current` is being moved left, the code leaves a duplicate in the
  // array. The bars show `current` in that free spot instead, so the student
  // always sees which number is being inserted.
  let freeIndex = -1;
  let heldValue = null;

  function addStep(lines, highlight, text, vars, swapped) {
    const bars = arr.slice();
    if (freeIndex >= 0) {
      bars[freeIndex] = heldValue;
    }
    steps.push({
      bars: bars,
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

  addStep([1], [], "Започваме. Масивът още не е подреден.", {});
  if (arr.length > 0) {
    sortedIndexes.push(0);
    addStep([2], [0], "Първото число (" + arr[0] + ") само по себе си е подредена част. Започваме от второто.", {});
  }

  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;
    freeIndex = i;
    heldValue = current;
    addStep([2, 3, 4], [i], "Взимаме " + current + " и търсим мястото му вляво.", { i: i, current: current, j: j });

    while (j >= 0) {
      compareCount++;
      const vars = { i: i, j: j, current: current, "arr[j]": arr[j] };

      if (arr[j] <= current) {
        addStep([5], [j, j + 1], "Сравнявам " + arr[j] + " и " + current + ": " + arr[j] + " ≤ " + current + ", намерихме мястото.", vars);
        break;
      }

      addStep([5], [j, j + 1], "Сравнявам " + arr[j] + " и " + current + ": " + arr[j] + " > " + current + ", значи " + arr[j] + " отива надясно.", vars);
      arr[j + 1] = arr[j];
      freeIndex = j;
      swapCount++;
      addStep([6], [j, j + 1], "Преместих " + arr[j + 1] + " една позиция надясно, а " + current + " мина на мястото му.", { i: i, j: j, current: current, "arr[j + 1]": arr[j + 1] }, true);

      j--;
      addStep([7], [j + 1], "Намалям j. Сега j = " + j + ".", { i: i, j: j, current: current });
    }

    if (j < 0) {
      addStep([5], [0], "j = -1, значи стигнахме началото на масива. " + current + " е най-малкото досега.", { i: i, j: j, current: current });
    }

    arr[j + 1] = current;
    freeIndex = -1;
    sortedIndexes.push(i);
    addStep([9], [j + 1], "Поставям " + current + " на позиция " + (j + 1) + ". Подредената част вече е до позиция " + i + ".", { i: i, j: j, current: current });
  }

  addStep([11], [], "Готово! Масивът е подреден с " + compareCount + " сравнения и " + swapCount + " премествания (всяко е като размяна на съседи).", {});

  return steps;
}
