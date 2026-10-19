// Merge sort lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const mergeSortLesson = {
  id: "merge-sort",
  title: "Сортиране чрез сливане (merge sort)",
  intro:
    "Делим масива на две половини, после всяка половина пак на две, докато останат " +
    "парчета от по едно число (те вече са подредени). След това сливаме парчетата обратно: " +
    "от две подредени половини взимаме винаги по-малкото от първите им числа и така " +
    "получаваме един подреден участък.",
  code: [
    "function mergeSort(arr, left, right) {",
    "  if (left >= right) {",
    "    return;",
    "  }",
    "  const middle = Math.floor((left + right) / 2);",
    "  mergeSort(arr, left, middle);",
    "  mergeSort(arr, middle + 1, right);",
    "  merge(arr, left, middle, right);",
    "}",
    "",
    "function merge(arr, left, middle, right) {",
    "  const leftPart = arr.slice(left, middle + 1);",
    "  const rightPart = arr.slice(middle + 1, right + 1);",
    "  let i = 0;",
    "  let j = 0;",
    "  let k = left;",
    "  while (i < leftPart.length && j < rightPart.length) {",
    "    if (leftPart[i] <= rightPart[j]) {",
    "      arr[k] = leftPart[i];",
    "      i++;",
    "    } else {",
    "      arr[k] = rightPart[j];",
    "      j++;",
    "    }",
    "    k++;",
    "  }",
    "  while (i < leftPart.length) {",
    "    arr[k] = leftPart[i];",
    "    i++;",
    "    k++;",
    "  }",
    "  while (j < rightPart.length) {",
    "    arr[k] = rightPart[j];",
    "    j++;",
    "    k++;",
    "  }",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "void merge(int arr[], int left, int middle, int right);",
        "",
        "void mergeSort(int arr[], int left, int right) {",
        "  if (left >= right) {",
        "    return;",
        "  }",
        "  int middle = (left + right) / 2;",
        "  mergeSort(arr, left, middle);",
        "  mergeSort(arr, middle + 1, right);",
        "  merge(arr, left, middle, right);",
        "}",
        "",
        "void merge(int arr[], int left, int middle, int right) {",
        "  int leftLength = middle - left + 1;",
        "  int rightLength = right - middle;",
        "  int leftPart[leftLength];",
        "  int rightPart[rightLength];",
        "  for (int x = 0; x < leftLength; x++) {",
        "    leftPart[x] = arr[left + x];",
        "  }",
        "  for (int x = 0; x < rightLength; x++) {",
        "    rightPart[x] = arr[middle + 1 + x];",
        "  }",
        "  int i = 0;",
        "  int j = 0;",
        "  int k = left;",
        "  while (i < leftLength && j < rightLength) {",
        "    if (leftPart[i] <= rightPart[j]) {",
        "      arr[k] = leftPart[i];",
        "      i++;",
        "    } else {",
        "      arr[k] = rightPart[j];",
        "      j++;",
        "    }",
        "    k++;",
        "  }",
        "  while (i < leftLength) {",
        "    arr[k] = leftPart[i];",
        "    i++;",
        "    k++;",
        "  }",
        "  while (j < rightLength) {",
        "    arr[k] = rightPart[j];",
        "    j++;",
        "    k++;",
        "  }",
        "}",
      ],
      lineMap: {
        1: [3], 2: [4], 3: [5], 5: [7], 6: [8], 7: [9], 8: [10], 9: [11],
        12: [14, 16, 18, 19, 20], 13: [15, 17, 21, 22, 23], 14: [24], 15: [25], 16: [26],
        17: [27], 18: [28], 19: [29], 20: [30], 22: [32], 23: [33], 25: [35],
        27: [37], 28: [38], 29: [39], 30: [40],
        32: [42], 33: [43], 34: [44], 35: [45],
      },
    },
    cpp: {
      code: [
        "void merge(vector<int>& arr, int left, int middle, int right);",
        "",
        "void mergeSort(vector<int>& arr, int left, int right) {",
        "  if (left >= right) {",
        "    return;",
        "  }",
        "  int middle = (left + right) / 2;",
        "  mergeSort(arr, left, middle);",
        "  mergeSort(arr, middle + 1, right);",
        "  merge(arr, left, middle, right);",
        "}",
        "",
        "void merge(vector<int>& arr, int left, int middle, int right) {",
        "  vector<int> leftPart(arr.begin() + left, arr.begin() + middle + 1);",
        "  vector<int> rightPart(arr.begin() + middle + 1, arr.begin() + right + 1);",
        "  int i = 0;",
        "  int j = 0;",
        "  int k = left;",
        "  while (i < (int)leftPart.size() && j < (int)rightPart.size()) {",
        "    if (leftPart[i] <= rightPart[j]) {",
        "      arr[k] = leftPart[i];",
        "      i++;",
        "    } else {",
        "      arr[k] = rightPart[j];",
        "      j++;",
        "    }",
        "    k++;",
        "  }",
        "  while (i < (int)leftPart.size()) {",
        "    arr[k] = leftPart[i];",
        "    i++;",
        "    k++;",
        "  }",
        "  while (j < (int)rightPart.size()) {",
        "    arr[k] = rightPart[j];",
        "    j++;",
        "    k++;",
        "  }",
        "}",
      ],
      lineMap: {
        1: [3], 2: [4], 3: [5], 5: [7], 6: [8], 7: [9], 8: [10], 9: [11],
        12: [14], 13: [15], 14: [16], 15: [17], 16: [18],
        17: [19], 18: [20], 19: [21], 20: [22], 22: [24], 23: [25], 25: [27],
        27: [29], 28: [30], 29: [31], 30: [32],
        32: [34], 33: [35], 34: [36], 35: [37],
      },
    },
    java: {
      code: [
        "static void mergeSort(int[] arr, int left, int right) {",
        "  if (left >= right) {",
        "    return;",
        "  }",
        "  int middle = (left + right) / 2;",
        "  mergeSort(arr, left, middle);",
        "  mergeSort(arr, middle + 1, right);",
        "  merge(arr, left, middle, right);",
        "}",
        "",
        "static void merge(int[] arr, int left, int middle, int right) {",
        "  int leftLength = middle - left + 1;",
        "  int rightLength = right - middle;",
        "  int[] leftPart = new int[leftLength];",
        "  int[] rightPart = new int[rightLength];",
        "  for (int x = 0; x < leftLength; x++) {",
        "    leftPart[x] = arr[left + x];",
        "  }",
        "  for (int x = 0; x < rightLength; x++) {",
        "    rightPart[x] = arr[middle + 1 + x];",
        "  }",
        "  int i = 0;",
        "  int j = 0;",
        "  int k = left;",
        "  while (i < leftLength && j < rightLength) {",
        "    if (leftPart[i] <= rightPart[j]) {",
        "      arr[k] = leftPart[i];",
        "      i++;",
        "    } else {",
        "      arr[k] = rightPart[j];",
        "      j++;",
        "    }",
        "    k++;",
        "  }",
        "  while (i < leftLength) {",
        "    arr[k] = leftPart[i];",
        "    i++;",
        "    k++;",
        "  }",
        "  while (j < rightLength) {",
        "    arr[k] = rightPart[j];",
        "    j++;",
        "    k++;",
        "  }",
        "}",
      ],
      // Plain copy loops (like C) instead of Arrays.copyOfRange, which would
      // need an `import java.util.Arrays;` line that isn't shown.
      lineMap: {
        12: [12, 14, 16, 17, 18], 13: [13, 15, 19, 20, 21], 14: [22], 15: [23], 16: [24],
        17: [25], 18: [26], 19: [27], 20: [28], 22: [30], 23: [31], 25: [33],
        27: [35], 28: [36], 29: [37], 30: [38],
        32: [40], 33: [41], 34: [42], 35: [43],
      },
    },
    python: {
      code: [
        "def merge_sort(arr, left, right):",
        "    if left >= right:",
        "        return",
        "    middle = (left + right) // 2",
        "    merge_sort(arr, left, middle)",
        "    merge_sort(arr, middle + 1, right)",
        "    merge(arr, left, middle, right)",
        "",
        "def merge(arr, left, middle, right):",
        "    leftPart = arr[left:middle + 1]",
        "    rightPart = arr[middle + 1:right + 1]",
        "    i = 0",
        "    j = 0",
        "    k = left",
        "    while i < len(leftPart) and j < len(rightPart):",
        "        if leftPart[i] <= rightPart[j]:",
        "            arr[k] = leftPart[i]",
        "            i += 1",
        "        else:",
        "            arr[k] = rightPart[j]",
        "            j += 1",
        "        k += 1",
        "    while i < len(leftPart):",
        "        arr[k] = leftPart[i]",
        "        i += 1",
        "        k += 1",
        "    while j < len(rightPart):",
        "        arr[k] = rightPart[j]",
        "        j += 1",
        "        k += 1",
      ],
      // Python has no closing braces, so after line 3 every line moves up.
      lineMap: {
        5: [4], 6: [5], 7: [6], 8: [7], 9: [7],
        12: [10], 13: [11], 14: [12], 15: [13], 16: [14],
        17: [15], 18: [16], 19: [17], 20: [18], 22: [20], 23: [21], 25: [22],
        27: [23], 28: [24], 29: [25], 30: [26],
        32: [27], 33: [28], 34: [29], 35: [30],
      },
    },
  },
  buildSteps: buildMergeSortSteps,
};

// The steps are built by running the same recursion as the code above.
// `state` holds the array, the steps made so far and the counters.
function buildMergeSortSteps(input) {
  const state = {
    arr: input.slice(),
    steps: [],
    sortedIndexes: [],
    compareCount: 0,
    writeCount: 0,
    merging: null,
  };

  addMergeSortStep(state, [1], [], "Започваме. Ще подредим целия масив (" + positionsText(0, state.arr.length - 1) + ").", {}, false);
  mergeSortSteps(state, 0, state.arr.length - 1);

  state.sortedIndexes = indexesFromTo(0, state.arr.length - 1);
  addMergeSortStep(state, [9], [], "Готово! Масивът е подреден с " + countText(state.compareCount, "сравнение", "сравнения") + " и " + countText(state.writeCount, "запис", "записа") + " в масива (тук няма размени: числата се записват наново от временните масиви).", {}, false);
  return state.steps;
}

function mergeSortSteps(state, left, right) {
  const range = indexesFromTo(left, right);
  if (left >= right) {
    if (left === right) {
      addMergeSortStep(state, [2, 3], range, "Участъкът на позиция " + left + " има само едно число (" + state.arr[left] + "). То вече е подредено, връщаме се.", { left: left, right: right }, false);
    }
    return;
  }

  const middle = Math.floor((left + right) / 2);
  const vars = { left: left, right: right, middle: middle };
  addMergeSortStep(state, [2, 5, 6], range, "Участъкът " + rangeText(state.arr, left, right) + " има повече от едно число. Делим го на две половини: " + positionsText(left, middle) + " и " + positionsText(middle + 1, right) + ". Първо подреждаме лявата.", vars, false);
  mergeSortSteps(state, left, middle);

  addMergeSortStep(state, [7], range, "Лявата половина " + rangeText(state.arr, left, middle) + " е подредена. Сега подреждаме дясната: " + rangeText(state.arr, middle + 1, right) + ".", vars, false);
  mergeSortSteps(state, middle + 1, right);

  mergeSteps(state, left, middle, right);
}

function mergeSteps(state, left, middle, right) {
  const merging = {
    left: left,
    right: right,
    leftPart: state.arr.slice(left, middle + 1),
    rightPart: state.arr.slice(middle + 1, right + 1),
    i: 0,
    j: 0,
    k: left,
  };
  state.merging = merging;
  addMergeSortStep(state, [8, 12, 13, 14, 15, 16], indexesFromTo(left, right), "И двете половини са подредени. Сливаме ги: копираме лявата " + formatValues(merging.leftPart) + " (" + positionsText(left, middle) + ") и дясната " + formatValues(merging.rightPart) + " (" + positionsText(middle + 1, right) + ") във временни масиви.", mergeVars(merging), false);

  while (merging.i < merging.leftPart.length && merging.j < merging.rightPart.length) {
    compareAndWriteStep(state, merging);
  }
  while (merging.i < merging.leftPart.length) {
    writeLeftoverStep(state, merging, true);
  }
  while (merging.j < merging.rightPart.length) {
    writeLeftoverStep(state, merging, false);
  }
  state.merging = null;
}

function compareAndWriteStep(state, merging) {
  const leftValue = merging.leftPart[merging.i];
  const rightValue = merging.rightPart[merging.j];
  // In the bars the first unused number of the right half sits right after
  // the unused numbers of the left half.
  const rightPosition = merging.k + merging.leftPart.length - merging.i;
  state.compareCount++;

  if (leftValue <= rightValue) {
    addMergeSortStep(state, [17, 18], [merging.k, rightPosition], "Сравнявам първите неизползвани числа: " + leftValue + " (лява половина) и " + rightValue + " (дясна). " + leftValue + " ≤ " + rightValue + ", значи " + leftValue + " отива на позиция " + merging.k + ".", mergeVars(merging), false);
    writeValue(state, merging, true);
    addMergeSortStep(state, [19, 20, 25], [merging.k - 1], "Записах " + leftValue + " на позиция " + (merging.k - 1) + "." + finishedText(state, merging), mergeVars(merging), true);
  } else {
    addMergeSortStep(state, [17, 18], [merging.k, rightPosition], "Сравнявам първите неизползвани числа: " + leftValue + " (лява половина) и " + rightValue + " (дясна). " + leftValue + " > " + rightValue + ", значи " + rightValue + " отива на позиция " + merging.k + ".", mergeVars(merging), false);
    writeValue(state, merging, false);
    addMergeSortStep(state, [22, 23, 25], [merging.k - 1], "Записах " + rightValue + " на позиция " + (merging.k - 1) + ". " + leftShiftText(merging) + finishedText(state, merging), mergeVars(merging), true);
  }
}

function writeLeftoverStep(state, merging, fromLeft) {
  const value = fromLeft ? merging.leftPart[merging.i] : merging.rightPart[merging.j];
  const emptyHalf = fromLeft ? "Дясната" : "Лявата";
  const otherHalf = fromLeft ? "лявата" : "дясната";
  const lines = fromLeft ? [27, 28, 29, 30] : [32, 33, 34, 35];
  writeValue(state, merging, fromLeft);
  addMergeSortStep(state, lines, [merging.k - 1], emptyHalf + " половина свърши, затова просто копираме остатъка от " + otherHalf + ". Записах " + value + " на позиция " + (merging.k - 1) + "." + finishedText(state, merging), mergeVars(merging), true);
}

// Does one `arr[k] = ...` from the code and moves i or j, and k, forward.
function writeValue(state, merging, fromLeft) {
  if (fromLeft) {
    state.arr[merging.k] = merging.leftPart[merging.i];
    merging.i++;
  } else {
    state.arr[merging.k] = merging.rightPart[merging.j];
    merging.j++;
  }
  // Positions written by the last merge (the whole array) are final.
  if (merging.left === 0 && merging.right === state.arr.length - 1) {
    state.sortedIndexes.push(merging.k);
  }
  merging.k++;
  state.writeCount++;
}

// After a number from the right half is written, the unused numbers of the
// left half are shown one place further right.
function leftShiftText(merging) {
  const leftUnused = merging.leftPart.slice(merging.i);
  if (leftUnused.length === 1) {
    return "Числото " + leftUnused[0] + " от лявата половина се мести с една позиция надясно.";
  }
  return "Числата " + leftUnused.join(", ") + " от лявата половина се местят с една позиция надясно.";
}

function finishedText(state, merging) {
  if (merging.k <= merging.right) {
    return "";
  }
  return " Участъкът " + rangeText(state.arr, merging.left, merging.right) + " вече е подреден.";
}

function mergeVars(merging) {
  return {
    left: merging.left,
    right: merging.right,
    leftPart: formatValues(merging.leftPart),
    rightPart: formatValues(merging.rightPart),
    i: merging.i,
    j: merging.j,
    k: merging.k,
  };
}

// While merging, the code overwrites arr and leaves stale copies behind.
// The bars instead show the written numbers followed by the unused ones from
// both halves, so they are always the same numbers and visibly slide.
function barsToShow(state) {
  const bars = state.arr.slice();
  const merging = state.merging;
  if (merging === null) {
    return bars;
  }
  const unused = merging.leftPart.slice(merging.i).concat(merging.rightPart.slice(merging.j));
  for (let offset = 0; offset < unused.length; offset++) {
    bars[merging.k + offset] = unused[offset];
  }
  return bars;
}

function addMergeSortStep(state, lines, highlight, text, vars, swapped) {
  state.steps.push({
    bars: barsToShow(state),
    highlight: highlight,
    swapped: swapped,
    sorted: state.sortedIndexes.slice(),
    lines: lines,
    vars: vars,
    compares: state.compareCount,
    swaps: state.writeCount,
    text: text,
  });
}

function indexesFromTo(first, last) {
  const indexes = [];
  for (let index = first; index <= last; index++) {
    indexes.push(index);
  }
  return indexes;
}

function formatValues(values) {
  return "[" + values.join(", ") + "]";
}

function rangeText(arr, left, right) {
  return formatValues(arr.slice(left, right + 1)) + " (" + positionsText(left, right) + ")";
}

function positionsText(left, right) {
  if (left === right) {
    return "позиция " + left;
  }
  return "позиции " + left + "–" + right;
}

function countText(count, singular, plural) {
  if (count === 1) {
    return count + " " + singular;
  }
  return count + " " + plural;
}
