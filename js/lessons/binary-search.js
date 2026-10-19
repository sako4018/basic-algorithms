// Binary search lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.
// Colors: green bars = the part we still search in, yellow = mid,
// gray = the part we already threw away.

const binarySearchLesson = {
  id: "binary-search",
  title: "Двоично търсене (binary search)",
  intro:
    "Търсим число в подреден масив, както търсиш дума в речник: отваряш по средата и " +
    "гледаш дали думата е преди или след това място. Всеки път изхвърляме половината от " +
    "останалите числа, затова намираме числото много бързо.",
  code: [
    "function binarySearch(arr, target) {",
    "  let low = 0;",
    "  let high = arr.length - 1;",
    "  while (low <= high) {",
    "    const mid = Math.floor((low + high) / 2);",
    "    if (arr[mid] === target) {",
    "      return mid;",
    "    }",
    "    if (arr[mid] < target) {",
    "      low = mid + 1;",
    "    } else {",
    "      high = mid - 1;",
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
        "int binarySearch(int arr[], int n, int target) {",
        "  int low = 0;",
        "  int high = n - 1;",
        "  while (low <= high) {",
        "    int mid = (low + high) / 2;",
        "    if (arr[mid] == target) {",
        "      return mid;",
        "    }",
        "    if (arr[mid] < target) {",
        "      low = mid + 1;",
        "    } else {",
        "      high = mid - 1;",
        "    }",
        "  }",
        "  return -1;",
        "}",
      ],
    },
    cpp: {
      code: [
        "int binarySearch(vector<int>& arr, int target) {",
        "  int low = 0;",
        "  int high = (int)arr.size() - 1;",
        "  while (low <= high) {",
        "    int mid = (low + high) / 2;",
        "    if (arr[mid] == target) {",
        "      return mid;",
        "    }",
        "    if (arr[mid] < target) {",
        "      low = mid + 1;",
        "    } else {",
        "      high = mid - 1;",
        "    }",
        "  }",
        "  return -1;",
        "}",
      ],
    },
    csharp: {
      code: [
        "static int binarySearch(int[] arr, int target) {",
        "  int low = 0;",
        "  int high = arr.Length - 1;",
        "  while (low <= high) {",
        "    int mid = (low + high) / 2;",
        "    if (arr[mid] == target) {",
        "      return mid;",
        "    }",
        "    if (arr[mid] < target) {",
        "      low = mid + 1;",
        "    } else {",
        "      high = mid - 1;",
        "    }",
        "  }",
        "  return -1;",
        "}",
      ],
    },
    java: {
      code: [
        "static int binarySearch(int[] arr, int target) {",
        "  int low = 0;",
        "  int high = arr.length - 1;",
        "  while (low <= high) {",
        "    int mid = (low + high) / 2;",
        "    if (arr[mid] == target) {",
        "      return mid;",
        "    }",
        "    if (arr[mid] < target) {",
        "      low = mid + 1;",
        "    } else {",
        "      high = mid - 1;",
        "    }",
        "  }",
        "  return -1;",
        "}",
      ],
    },
    python: {
      code: [
        "def binary_search(arr, target):",
        "    low = 0",
        "    high = len(arr) - 1",
        "    while low <= high:",
        "        mid = (low + high) // 2",
        "        if arr[mid] == target:",
        "            return mid",
        "        if arr[mid] < target:",
        "            low = mid + 1",
        "        else:",
        "            high = mid - 1",
        "    return -1",
      ],
      lineMap: { 9: [8], 10: [9], 11: [10], 12: [11], 15: [12] },
    },
  },
  buildSteps: buildBinarySearchSteps,
};

function buildBinarySearchSteps(input) {
  let arr = input.slice();
  const steps = [];
  let compareCount = 0;
  let checkedCount = 0;
  // Indexes still being searched; shown green. Mid is left out so it stays yellow.
  let searchIndexes = [];

  function addStep(lines, highlight, text, vars) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: false,
      sorted: searchIndexes.slice(),
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: 0,
      text: text,
    });
  }

  addStep([1], [], "Двоичното търсене работи само в подреден масив, затова първо подреждаме числата по големина.", {});

  arr = binarySearchSortedCopy(arr);
  const target = pickBinarySearchTarget(arr);
  let low = 0;
  let high = arr.length - 1;
  searchIndexes = binarySearchIndexesBetween(low, high, -1);
  addStep([1], [], "Масивът е подреден. Търсим числото " + target + ". Зелените стълбове са частта, в която още търсим.", { target: target });
  addStep([2, 3], [], "low = " + low + " е началото, а high = " + high + " е краят на частта, в която търсим.", { target: target, low: low, high: high });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    checkedCount++;
    searchIndexes = binarySearchIndexesBetween(low, high, mid);
    const vars = { target: target, low: low, high: high, mid: mid, "arr[mid]": arr[mid] };
    const roundingNote = (low + high) % 2 === 1 ? " (закръгляме надолу)" : "";
    addStep([4, 5], [mid], "low ≤ high, значи още има къде да търсим. Средата е mid = (" + low + " + " + high + ") / 2 = " + mid + roundingNote + ", там е числото " + arr[mid] + ".", vars);

    compareCount++;
    if (arr[mid] === target) {
      addStep([6], [mid], "Сравнявам " + arr[mid] + " с " + target + ": равни са, намерихме го!", vars);
      searchIndexes = [mid];
      addStep([7], [], "Готово! Намерихме " + target + " на позиция " + mid + ". Погледнахме само " + checkedCount + " от " + arr.length + " числа и направихме " + binarySearchCompareText(compareCount) + ".", vars);
      return steps;
    }

    compareCount++;
    if (arr[mid] < target) {
      addStep([6, 9], [mid], "Сравнявам " + arr[mid] + " с " + target + ": " + arr[mid] + " < " + target + ", значи " + target + " е вдясно от средата.", vars);
      low = mid + 1;
      searchIndexes = binarySearchIndexesBetween(low, high, -1);
      addStep([10], [], "Изхвърляме лявата половина заедно със средата: low = " + low + ". " + binarySearchRangeText(low, high), { target: target, low: low, high: high, mid: mid });
    } else {
      addStep([6, 9], [mid], "Сравнявам " + arr[mid] + " с " + target + ": " + arr[mid] + " > " + target + ", значи " + target + " е вляво от средата.", vars);
      high = mid - 1;
      searchIndexes = binarySearchIndexesBetween(low, high, -1);
      addStep([11, 12], [], "Изхвърляме дясната половина заедно със средата: high = " + high + ". " + binarySearchRangeText(low, high), { target: target, low: low, high: high, mid: mid });
    }
  }

  // Only reached if the target is missing, which pickBinarySearchTarget avoids.
  addStep([15], [], "Готово! low > high, значи няма какво повече да търсим: " + target + " го няма в масива.", { target: target, low: low, high: high });
  return steps;
}

function binarySearchSortedCopy(values) {
  return values.slice().sort(function (a, b) {
    return a - b;
  });
}

// A random number that is in the array, so the search always finds it.
function pickBinarySearchTarget(values) {
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

function binarySearchIndexesBetween(low, high, skippedIndex) {
  const indexes = [];
  for (let index = low; index <= high; index++) {
    if (index !== skippedIndex) {
      indexes.push(index);
    }
  }
  return indexes;
}

// "1 сравнение", but "2 сравнения".
function binarySearchCompareText(count) {
  if (count === 1) {
    return "1 сравнение";
  }
  return count + " сравнения";
}

function binarySearchRangeText(low, high) {
  if (low === high) {
    return "Остава само позиция " + low + ".";
  }
  return "Търсим от позиция " + low + " до " + high + ".";
}
