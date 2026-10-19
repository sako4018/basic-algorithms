// Quick sort lesson (Lomuto partition: the last element is the pivot).
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const quickSortLesson = {
  id: "quick-sort",
  title: "Бързо сортиране (quick sort)",
  intro:
    "Избираме едно число за опора (pivot) — тук последното в частта. Преместваме всички " +
    "по-малки от него вляво, а останалите вдясно, и слагаме опората между тях: тя вече е " +
    "на окончателното си място. После правим същото поотделно за лявата и за дясната част, " +
    "докато всяка част остане с едно число.",
  code: [
    "function quickSort(arr, low, high) {",
    "  if (low < high) {",
    "    const pivotIndex = partition(arr, low, high);",
    "    quickSort(arr, low, pivotIndex - 1);",
    "    quickSort(arr, pivotIndex + 1, high);",
    "  }",
    "  return arr;",
    "}",
    "",
    "function partition(arr, low, high) {",
    "  const pivot = arr[high];",
    "  let i = low - 1;",
    "  for (let j = low; j < high; j++) {",
    "    if (arr[j] < pivot) {",
    "      i++;",
    "      swap(arr, i, j);",
    "    }",
    "  }",
    "  swap(arr, i + 1, high);",
    "  return i + 1;",
    "}",
    "",
    "function swap(arr, a, b) {",
    "  const temp = arr[a];",
    "  arr[a] = arr[b];",
    "  arr[b] = temp;",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  // C and C++ need the two declarations on top because quickSort calls
  // functions that are written below it.
  otherLanguages: {
    c: {
      code: [
        "void swap(int arr[], int a, int b);",
        "int partition(int arr[], int low, int high);",
        "",
        "void quickSort(int arr[], int low, int high) {",
        "  if (low < high) {",
        "    int pivotIndex = partition(arr, low, high);",
        "    quickSort(arr, low, pivotIndex - 1);",
        "    quickSort(arr, pivotIndex + 1, high);",
        "  }",
        "}",
        "",
        "int partition(int arr[], int low, int high) {",
        "  int pivot = arr[high];",
        "  int i = low - 1;",
        "  for (int j = low; j < high; j++) {",
        "    if (arr[j] < pivot) {",
        "      i++;",
        "      swap(arr, i, j);",
        "    }",
        "  }",
        "  swap(arr, i + 1, high);",
        "  return i + 1;",
        "}",
        "",
        "void swap(int arr[], int a, int b) {",
        "  int temp = arr[a];",
        "  arr[a] = arr[b];",
        "  arr[b] = temp;",
        "}",
      ],
      lineMap: quickSortLineMapForC(),
    },
    cpp: {
      code: [
        "void swap(vector<int>& arr, int a, int b);",
        "int partition(vector<int>& arr, int low, int high);",
        "",
        "void quickSort(vector<int>& arr, int low, int high) {",
        "  if (low < high) {",
        "    int pivotIndex = partition(arr, low, high);",
        "    quickSort(arr, low, pivotIndex - 1);",
        "    quickSort(arr, pivotIndex + 1, high);",
        "  }",
        "}",
        "",
        "int partition(vector<int>& arr, int low, int high) {",
        "  int pivot = arr[high];",
        "  int i = low - 1;",
        "  for (int j = low; j < high; j++) {",
        "    if (arr[j] < pivot) {",
        "      i++;",
        "      swap(arr, i, j);",
        "    }",
        "  }",
        "  swap(arr, i + 1, high);",
        "  return i + 1;",
        "}",
        "",
        "void swap(vector<int>& arr, int a, int b) {",
        "  int temp = arr[a];",
        "  arr[a] = arr[b];",
        "  arr[b] = temp;",
        "}",
      ],
      lineMap: quickSortLineMapForC(),
    },
    java: {
      code: [
        "static void quickSort(int[] arr, int low, int high) {",
        "  if (low < high) {",
        "    int pivotIndex = partition(arr, low, high);",
        "    quickSort(arr, low, pivotIndex - 1);",
        "    quickSort(arr, pivotIndex + 1, high);",
        "  }",
        "}",
        "",
        "static int partition(int[] arr, int low, int high) {",
        "  int pivot = arr[high];",
        "  int i = low - 1;",
        "  for (int j = low; j < high; j++) {",
        "    if (arr[j] < pivot) {",
        "      i++;",
        "      swap(arr, i, j);",
        "    }",
        "  }",
        "  swap(arr, i + 1, high);",
        "  return i + 1;",
        "}",
        "",
        "static void swap(int[] arr, int a, int b) {",
        "  int temp = arr[a];",
        "  arr[a] = arr[b];",
        "  arr[b] = temp;",
        "}",
      ],
      lineMap: quickSortLineMapForJava(),
    },
    python: {
      code: [
        "def quick_sort(arr, low, high):",
        "    if low < high:",
        "        pivotIndex = partition(arr, low, high)",
        "        quick_sort(arr, low, pivotIndex - 1)",
        "        quick_sort(arr, pivotIndex + 1, high)",
        "    return arr",
        "",
        "def partition(arr, low, high):",
        "    pivot = arr[high]",
        "    i = low - 1",
        "    for j in range(low, high):",
        "        if arr[j] < pivot:",
        "            i += 1",
        "            swap(arr, i, j)",
        "    swap(arr, i + 1, high)",
        "    return i + 1",
        "",
        "def swap(arr, a, b):",
        "    temp = arr[a]",
        "    arr[a] = arr[b]",
        "    arr[b] = temp",
      ],
      lineMap: {
        7: [6], 10: [8], 11: [9], 12: [10], 13: [11], 14: [12], 15: [13], 16: [14],
        19: [15], 20: [16], 23: [18], 24: [19], 25: [20], 26: [21],
      },
    },
  },
  buildSteps: buildQuickSortSteps,
};

// C and C++ have 3 extra lines on top and no `return arr;`, so JS line 7
// points at the closing brace of quickSort.
function quickSortLineMapForC() {
  const lineMap = {};
  for (let jsLine = 1; jsLine <= 27; jsLine++) {
    if (jsLine <= 6) {
      lineMap[jsLine] = [jsLine + 3];
    } else if (jsLine <= 8) {
      lineMap[jsLine] = [10];
    } else {
      lineMap[jsLine] = [jsLine + 2];
    }
  }
  return lineMap;
}

// Java has no `return arr;`, so JS line 7 points at the closing brace of
// quickSort and everything after it moves up by one.
function quickSortLineMapForJava() {
  const lineMap = { 7: [7] };
  for (let jsLine = 8; jsLine <= 27; jsLine++) {
    lineMap[jsLine] = [jsLine - 1];
  }
  return lineMap;
}

function buildQuickSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const sortedIndexes = [];
  // Where the pivot is while its part is being partitioned; shown with an outline.
  let pivotMarkIndexes = [];
  let compareCount = 0;
  let swapCount = 0;

  function addStep(lines, highlight, text, vars, swapped) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: swapped === true,
      sorted: sortedIndexes.slice(),
      marked: pivotMarkIndexes.slice(),
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: swapCount,
      text: text,
    });
  }

  function swapItems(a, b) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
    swapCount++;
  }

  function partText(low, high) {
    if (low > high) {
      return "празна част (low = " + low + ", high = " + high + ")";
    }
    return "частта от позиция " + low + " до " + high;
  }

  // One call of quickSort(arr, low, high): lines 2-5 of `code`.
  function sortPart(low, high) {
    const vars = { low: low, high: high };
    if (low > high) {
      addStep([2], [], "Тук low = " + low + " и high = " + high + ", значи частта е празна (low > high). Няма какво да подреждаме.", vars);
      return;
    }
    if (low === high) {
      sortedIndexes.push(low);
      addStep([2], [], "Подреждаме " + partText(low, high) + ": в нея има само едно число (" + arr[low] + "), то вече е на мястото си.", vars);
      return;
    }

    addStep([2], [], "Подреждаме " + partText(low, high) + ". В нея има повече от едно число (low < high), значи я разделяме.", vars);
    const pivotIndex = partitionPart(low, high);

    addStep([4], [], "Сега подреждаме числата вляво от опората: " + partText(low, pivotIndex - 1) + ".", { low: low, high: high, pivotIndex: pivotIndex });
    sortPart(low, pivotIndex - 1);

    addStep([5], [], "Връщаме се в " + partText(low, high) + ". Лявото от опората е готово, сега подреждаме числата вдясно от нея: " + partText(pivotIndex + 1, high) + ".", { low: low, high: high, pivotIndex: pivotIndex });
    sortPart(pivotIndex + 1, high);
  }

  // One call of partition(arr, low, high): lines 10-20 of `code`.
  // Returns where the pivot ended up.
  function partitionPart(low, high) {
    const pivot = arr[high];
    pivotMarkIndexes = [high];
    addStep([3, 10, 11], [high], "Опората (pivot) е последното число в " + partText(low, high) + ": " + pivot + ", отбелязана с контур. По-малките от нея ще сложим вляво.", { low: low, high: high, pivot: pivot });

    let i = low - 1;
    addStep([12], [high], "i показва докъде стигат по-малките от " + pivot + " числа. Засега няма такива, затова i = " + i + ".", { low: low, high: high, pivot: pivot, i: i });

    for (let j = low; j < high; j++) {
      i = compareWithPivot(low, high, i, j);
    }
    return placePivot(low, high, i);
  }

  // One turn of the for loop (lines 13-16). Returns the new i.
  function compareWithPivot(low, high, i, j) {
    const pivot = arr[high];
    const value = arr[j];
    compareCount++;
    if (value >= pivot) {
      addStep([13, 14], [j, high], "Сравнявам " + value + " с опората " + pivot + ": " + value + " ≥ " + pivot + ", остава вдясно.", { low: low, high: high, pivot: pivot, i: i, j: j });
      return i;
    }

    addStep([13, 14], [j, high], "Сравнявам " + value + " с опората " + pivot + ": " + value + " < " + pivot + ", значи отива вляво.", { low: low, high: high, pivot: pivot, i: i, j: j });
    i++;
    const vars = { low: low, high: high, pivot: pivot, i: i, j: j };
    if (i === j) {
      addStep([15, 16], [j], "i става " + i + ". i и j сочат едно и също място, затова размяната не мести нищо: " + value + " вече е вляво.", vars);
    } else {
      const other = arr[i];
      swapItems(i, j);
      addStep([15, 16], [i, j], "i става " + i + ". Разменям " + other + " (позиция " + i + ") и " + value + " (позиция " + j + "), за да отиде " + value + " вляво.", vars, true);
    }
    return i;
  }

  // Puts the pivot right after the smaller numbers (lines 19-20 and 3).
  function placePivot(low, high, i) {
    const pivot = arr[high];
    const pivotIndex = i + 1;
    const vars = { low: low, high: high, pivot: pivot, i: i };
    if (pivotIndex === high) {
      addStep([19], [high], "Минах през цялата част. Всички числа преди опората " + pivot + " са по-малки, затова тя остава на позиция " + high + ".", vars);
    } else {
      const other = arr[pivotIndex];
      swapItems(pivotIndex, high);
      pivotMarkIndexes = [pivotIndex];
      let text = "Минах през цялата част. Слагам опората " + pivot + " веднага след по-малките: разменям я с " + other + " (позиция " + pivotIndex + ").";
      if (other === pivot) {
        text += " Двете числа са равни, затова на екрана нищо не се мести.";
      }
      addStep([19], [pivotIndex, high], text, vars, true);
    }

    sortedIndexes.push(pivotIndex);
    pivotMarkIndexes = [];
    addStep([20, 3], [], "Опората " + pivot + " е на окончателното си място (позиция " + pivotIndex + "). Вляво от нея са по-малките, вдясно — останалите.", { low: low, high: high, pivot: pivot, pivotIndex: pivotIndex });
    return pivotIndex;
  }

  addStep([1], [], "Започваме. Масивът още не е подреден. Първо подреждаме целия масив: " + partText(0, arr.length - 1) + ".", { low: 0, high: arr.length - 1 });
  sortPart(0, arr.length - 1);
  const compareWord = compareCount === 1 ? " сравнение" : " сравнения";
  const swapWord = swapCount === 1 ? " размяна" : " размени";
  addStep([7], [], "Готово! Масивът е подреден с " + compareCount + compareWord + " и " + swapCount + swapWord + ".", {});

  return steps;
}
