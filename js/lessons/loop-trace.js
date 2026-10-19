// Loop and condition trace lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const loopTraceLesson = {
  id: "loop-trace",
  title: "Проследяване на цикъл и условие",
  intro:
    "Тук не търсим хитър алгоритъм, а се учим да четем код ред по ред. Цикълът for минава през " +
    "всички числа едно по едно. За всяко число условието if пита: по-голямо ли е от 50? " +
    "Ако да, увеличаваме брояча bigCount с 1. Ако не, просто пропускаме числото. " +
    "Гледай таблицата с променливите: след всеки ред виж коя стойност се е променила.",
  code: [
    "function countBig(arr) {",
    "  let bigCount = 0;",
    "  for (let i = 0; i < arr.length; i++) {",
    "    let value = arr[i];",
    "    if (value > 50) {",
    "      bigCount++;",
    "    }",
    "  }",
    "  return bigCount;",
    "}",
  ],
  // The same algorithm in the other languages of the code tabs. Steps point
  // at lines of `code` (JS); `lineMap` turns a JS line into this language's
  // lines when they differ. Keep both in sync when editing.
  otherLanguages: {
    c: {
      code: [
        "void countBig(int arr[], int n) {",
        "  int bigCount = 0;",
        "  for (int i = 0; i < n; i++) {",
        "    int value = arr[i];",
        "    if (value > 50) {",
        "      bigCount++;",
        "    }",
        "  }",
        "  printf(\"bigCount = %d\\n\", bigCount);",
        "}",
      ],
    },
    cpp: {
      code: [
        "void countBig(vector<int>& arr) {",
        "  int bigCount = 0;",
        "  for (int i = 0; i < (int)arr.size(); i++) {",
        "    int value = arr[i];",
        "    if (value > 50) {",
        "      bigCount++;",
        "    }",
        "  }",
        "  cout << \"bigCount = \" << bigCount << endl;",
        "}",
      ],
    },
    csharp: {
      code: [
        "static void countBig(int[] arr) {",
        "  int bigCount = 0;",
        "  for (int i = 0; i < arr.Length; i++) {",
        "    int value = arr[i];",
        "    if (value > 50) {",
        "      bigCount++;",
        "    }",
        "  }",
        "  Console.WriteLine(\"bigCount = \" + bigCount);",
        "}",
      ],
    },
    java: {
      code: [
        "static void countBig(int[] arr) {",
        "  int bigCount = 0;",
        "  for (int i = 0; i < arr.length; i++) {",
        "    int value = arr[i];",
        "    if (value > 50) {",
        "      bigCount++;",
        "    }",
        "  }",
        "  System.out.println(\"bigCount = \" + bigCount);",
        "}",
      ],
    },
    python: {
      code: [
        "def count_big(arr):",
        "    bigCount = 0",
        "    for i in range(len(arr)):",
        "        value = arr[i]",
        "        if value > 50:",
        "            bigCount += 1",
        "    return bigCount",
      ],
      lineMap: { 9: [7] },
    },
  },
  buildSteps: buildLoopTraceSteps,
};

// "1 число", "2 числа", "0 числа".
function numberWord(amount) {
  return amount === 1 ? amount + " число" : amount + " числа";
}

// The array is never changed. Yellow is the number the loop is on now;
// green marks the numbers already counted as big.
function buildLoopTraceSteps(input) {
  const arr = input.slice();
  const steps = [];
  const countedIndexes = [];
  let bigCount = 0;
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

  // `value` exists only after line 4 ran in this round of the loop.
  function varsBeforeValue(i) {
    return { i: i, bigCount: bigCount };
  }

  function varsWithValue(i) {
    return { i: i, value: arr[i], bigCount: bigCount };
  }

  function addLoopHeaderStep(i) {
    if (i === 0) {
      addStep([3], [], "Цикълът започва: i = 0. Проверката 0 < " + arr.length + " е вярна, влизаме в цикъла.", varsBeforeValue(i));
    } else {
      addStep([3], [], "Следващ кръг: i става " + i + ". Проверката " + i + " < " + arr.length + " е вярна, влизаме в цикъла.", varsBeforeValue(i));
    }
  }

  function addIfSteps(i) {
    compareCount++;
    const value = arr[i];
    if (value > 50) {
      addStep([5], [i], "Условие: " + value + " > 50? Да, вярно. Влизаме в if.", varsWithValue(i));
      bigCount++;
      countedIndexes.push(i);
      addStep([6], [i], "bigCount++ : броячът става " + bigCount + ".", varsWithValue(i));
    } else {
      addStep([5], [i], "Условие: " + value + " > 50? Не, невярно. Прескачаме тялото на if, броячът си остава " + bigCount + ".", varsWithValue(i));
    }
  }

  addStep([1], [], "Започваме. Ще проследим цикъл и условие: колко от числата са по-големи от 50?", {});
  addStep([2], [], "Първо броячът bigCount започва от 0.", { bigCount: bigCount });

  for (let i = 0; i < arr.length; i++) {
    addLoopHeaderStep(i);
    addStep([4], [i], "Взимаме числото на място " + i + " и го запомняме в value: value = " + arr[i] + ".", varsWithValue(i));
    addIfSteps(i);
  }

  addStep([3], [], "i става " + arr.length + ". Проверката " + arr.length + " < " + arr.length + " е невярна, цикълът свършва.", { i: arr.length, bigCount: bigCount });
  addStep([9], [], "Готово! Над 50 има " + numberWord(bigCount) + ". Цикълът се завъртя " + arr.length +
    " пъти, по веднъж за всяко число.", { bigCount: bigCount });

  return steps;
}
