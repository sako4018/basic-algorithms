// Count lesson (counts the even numbers).
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const countLesson = {
  id: "count",
  title: "Брой (count)",
  intro:
    "Броим колко от числата в масива са четни. Едно число е четно, когато се дели на 2 без " +
    "остатък. В кода знакът % дава остатъка при деление, затова проверката е arr[i] % 2 === 0.",
  code: [
    "function countEven(arr) {",
    "  let count = 0;",
    "  for (let i = 0; i < arr.length; i++) {",
    "    if (arr[i] % 2 === 0) {",
    "      count++;",
    "    }",
    "  }",
    "  return count;",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "void countEven(int arr[], int n) {",
        "  int count = 0;",
        "  for (int i = 0; i < n; i++) {",
        "    if (arr[i] % 2 == 0) {",
        "      count++;",
        "    }",
        "  }",
        "  printf(\"count = %d\\n\", count);",
        "}",
      ],
    },
    cpp: {
      code: [
        "void countEven(vector<int>& arr) {",
        "  int count = 0;",
        "  for (int i = 0; i < (int)arr.size(); i++) {",
        "    if (arr[i] % 2 == 0) {",
        "      count++;",
        "    }",
        "  }",
        "  cout << \"count = \" << count << endl;",
        "}",
      ],
    },
    csharp: {
      code: [
        "static void countEven(int[] arr) {",
        "  int count = 0;",
        "  for (int i = 0; i < arr.Length; i++) {",
        "    if (arr[i] % 2 == 0) {",
        "      count++;",
        "    }",
        "  }",
        "  Console.WriteLine(\"count = \" + count);",
        "}",
      ],
    },
    java: {
      code: [
        "static void countEven(int[] arr) {",
        "  int count = 0;",
        "  for (int i = 0; i < arr.length; i++) {",
        "    if (arr[i] % 2 == 0) {",
        "      count++;",
        "    }",
        "  }",
        "  System.out.println(\"count = \" + count);",
        "}",
      ],
    },
    python: {
      code: [
        "def count_even(arr):",
        "    count = 0",
        "    for i in range(len(arr)):",
        "        if arr[i] % 2 == 0:",
        "            count += 1",
        "    return count",
      ],
      lineMap: { 8: [6] },
    },
  },
  buildSteps: buildCountSteps,
};

// The array is never changed. Yellow is the number we look at now; an
// outline (`marked`) shows the even numbers counted so far.
function buildCountSteps(input) {
  const arr = input.slice();
  const steps = [];
  const countedIndexes = [];
  let count = 0;
  let compareCount = 0;

  function addStep(lines, highlight, text, vars) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: false,
      sorted: [],
      marked: countedIndexes.slice(),
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: 0,
      text: text,
    });
  }

  function currentVars(i) {
    return { i: i, "arr[i]": arr[i], count: count };
  }

  function addEvenCheckSteps(i) {
    compareCount++;
    const value = arr[i];
    const remainder = value % 2;
    if (remainder === 0) {
      addStep([3, 4], [i], value + " % 2 = 0, дели се на 2 без остатък. Значи е четно.", currentVars(i));
      count++;
      countedIndexes.push(i);
      let countText = "Броим го. Четни числа досега: " + count + ".";
      if (count === 1) {
        countText += " Преброените числа ще са с контур.";
      }
      addStep([5], [i], countText, currentVars(i));
    } else {
      addStep([3, 4], [i], value + " % 2 = " + remainder + ", остава остатък. Значи е нечетно и не го броим.", currentVars(i));
    }
  }

  addStep([1], [], "Започваме. Ще преброим четните числа.", {});
  addStep([2], [], "В началото още нищо не сме преброили.", { count: count });

  for (let i = 0; i < arr.length; i++) {
    addEvenCheckSteps(i);
  }

  addStep([8], [], "Готово! Броят на четните числа е " + count + ". Минахме през масива само веднъж.", { count: count });

  return steps;
}
