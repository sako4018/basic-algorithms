// Sum and count lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const sumCountLesson = {
  id: "sum-count",
  title: "Сума и брой",
  intro:
    "Минаваме веднъж през масива и правим две неща: събираме всички числа (сума) и броим " +
    "колко от тях са четни (брой). Едно число е четно, когато се дели на 2 без остатък. " +
    "В кода знакът % дава остатъка при деление, затова проверката е arr[i] % 2 === 0.",
  code: [
    "function sumAndCount(arr) {",
    "  let sum = 0;",
    "  let count = 0;",
    "  for (let i = 0; i < arr.length; i++) {",
    "    sum = sum + arr[i];",
    "    if (arr[i] % 2 === 0) {",
    "      count++;",
    "    }",
    "  }",
    "  return [sum, count];",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "void sumAndCount(int arr[], int n) {",
        "  int sum = 0;",
        "  int count = 0;",
        "  for (int i = 0; i < n; i++) {",
        "    sum = sum + arr[i];",
        "    if (arr[i] % 2 == 0) {",
        "      count++;",
        "    }",
        "  }",
        "  printf(\"sum = %d, count = %d\\n\", sum, count);",
        "}",
      ],
    },
    cpp: {
      code: [
        "void sumAndCount(vector<int>& arr) {",
        "  int sum = 0;",
        "  int count = 0;",
        "  for (int i = 0; i < (int)arr.size(); i++) {",
        "    sum = sum + arr[i];",
        "    if (arr[i] % 2 == 0) {",
        "      count++;",
        "    }",
        "  }",
        "  cout << \"sum = \" << sum << \", count = \" << count << endl;",
        "}",
      ],
    },
    java: {
      code: [
        "static void sumAndCount(int[] arr) {",
        "  int sum = 0;",
        "  int count = 0;",
        "  for (int i = 0; i < arr.length; i++) {",
        "    sum = sum + arr[i];",
        "    if (arr[i] % 2 == 0) {",
        "      count++;",
        "    }",
        "  }",
        "  System.out.println(\"sum = \" + sum + \", count = \" + count);",
        "}",
      ],
    },
    python: {
      code: [
        "def sum_and_count(arr):",
        "    sum = 0",
        "    count = 0",
        "    for i in range(len(arr)):",
        "        sum = sum + arr[i]",
        "        if arr[i] % 2 == 0:",
        "            count += 1",
        "    return sum, count",
      ],
      lineMap: { 10: [8] },
    },
  },
  buildSteps: buildSumCountSteps,
};

// The array is never changed. Yellow is the number we look at now; green
// marks the even numbers counted so far.
function buildSumCountSteps(input) {
  const arr = input.slice();
  const steps = [];
  const countedIndexes = [];
  let sum = 0;
  let count = 0;
  let compareCount = 0;

  function addStep(lines, highlight, text, vars) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: false,
      sorted: countedIndexes.slice(),
      lines: lines,
      vars: vars,
      compares: compareCount,
      swaps: 0,
      text: text,
    });
  }

  function currentVars(i) {
    return { i: i, "arr[i]": arr[i], sum: sum, count: count };
  }

  function addEvenCheckSteps(i) {
    compareCount++;
    const value = arr[i];
    const remainder = value % 2;
    if (remainder === 0) {
      addStep([6], [i], value + " % 2 = 0, дели се на 2 без остатък. Значи е четно.", currentVars(i));
      count++;
      countedIndexes.push(i);
      addStep([7], [i], "Броим го. Четни числа досега: " + count + ".", currentVars(i));
    } else {
      addStep([6], [i], value + " % 2 = " + remainder + ", остава остатък. Значи е нечетно и не го броим.", currentVars(i));
    }
  }

  addStep([1], [], "Започваме. Ще съберем всички числа и ще преброим четните.", {});
  addStep([2, 3], [], "В началото сумата е 0 и още нищо не сме преброили.", { sum: sum, count: count });

  for (let i = 0; i < arr.length; i++) {
    const oldSum = sum;
    sum = sum + arr[i];
    addStep([4, 5], [i], "Добавяме " + arr[i] + " към сумата: " + oldSum + " + " + arr[i] + " = " + sum + ".", currentVars(i));
    addEvenCheckSteps(i);
  }

  addStep([10], [], "Готово! Сумата на всички числа е " + sum + ", а броят на четните числа е " + count +
    ". Минахме през масива само веднъж.", { sum: sum, count: count });

  return steps;
}
