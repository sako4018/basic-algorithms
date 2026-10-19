// Sum lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const sumLesson = {
  id: "sum",
  title: "Сума (sum)",
  intro:
    "Събираме всички числа в масива. Започваме със сума 0 и към нея добавяме едно по едно " +
    "числата, като минаваме през масива само веднъж.",
  code: [
    "function findSum(arr) {",
    "  let sum = 0;",
    "  for (let i = 0; i < arr.length; i++) {",
    "    sum = sum + arr[i];",
    "  }",
    "  return sum;",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "void findSum(int arr[], int n) {",
        "  int sum = 0;",
        "  for (int i = 0; i < n; i++) {",
        "    sum = sum + arr[i];",
        "  }",
        "  printf(\"sum = %d\\n\", sum);",
        "}",
      ],
    },
    cpp: {
      code: [
        "void findSum(vector<int>& arr) {",
        "  int sum = 0;",
        "  for (int i = 0; i < (int)arr.size(); i++) {",
        "    sum = sum + arr[i];",
        "  }",
        "  cout << \"sum = \" << sum << endl;",
        "}",
      ],
    },
    java: {
      code: [
        "static void findSum(int[] arr) {",
        "  int sum = 0;",
        "  for (int i = 0; i < arr.length; i++) {",
        "    sum = sum + arr[i];",
        "  }",
        "  System.out.println(\"sum = \" + sum);",
        "}",
      ],
    },
    python: {
      code: [
        "def find_sum(arr):",
        "    sum = 0",
        "    for i in range(len(arr)):",
        "        sum = sum + arr[i]",
        "    return sum",
      ],
      lineMap: { 6: [5] },
    },
  },
  buildSteps: buildSumSteps,
};

// The array is never changed. Yellow is the number we add now; an outline
// (`marked`) shows the numbers already added to the sum.
function buildSumSteps(input) {
  const arr = input.slice();
  const steps = [];
  const addedIndexes = [];
  let sum = 0;

  function addStep(lines, highlight, text, vars) {
    steps.push({
      bars: arr.slice(),
      highlight: highlight,
      swapped: false,
      sorted: [],
      marked: addedIndexes.slice(),
      lines: lines,
      vars: vars,
      compares: 0,
      swaps: 0,
      text: text,
    });
  }

  addStep([1], [], "Започваме. Ще съберем всички числа.", {});
  addStep([2], [], "В началото сумата е 0.", { sum: sum });

  for (let i = 0; i < arr.length; i++) {
    const oldSum = sum;
    sum = sum + arr[i];
    addedIndexes.push(i);
    let text = "Добавяме " + arr[i] + " към сумата: " + oldSum + " + " + arr[i] + " = " + sum + ".";
    if (i === 0) {
      text += " Контурът около стълб показва, че числото вече е добавено.";
    }
    addStep([3, 4], [i], text, { i: i, "arr[i]": arr[i], sum: sum });
  }

  addStep([6], [], "Готово! Сумата на всички числа е " + sum + ". Минахме през масива само веднъж.", { sum: sum });

  return steps;
}
