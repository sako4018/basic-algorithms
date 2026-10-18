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
  buildSteps: buildInsertionSortSteps,
};

function buildInsertionSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  let sortedIndexes = [];
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

  addStep([1], [], "Започваме. Масивът още не е подреден.", {});
  if (arr.length > 0) {
    sortedIndexes = [0];
    addStep([1], [0], "Първото число (" + arr[0] + ") само по себе си е подредена част.", {});
  }

  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;
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
      swapCount++;
      addStep([6], [j, j + 1], "Преместих " + arr[j] + " една позиция надясно.", { i: i, j: j, current: current, "arr[j]": arr[j] }, true);

      j--;
      addStep([7], [j + 1], "Намалям j. Сега j = " + j + ".", { i: i, j: j, current: current });
    }

    arr[j + 1] = current;
    sortedIndexes = [];
    for (let k = 0; k <= i; k++) {
      sortedIndexes.push(k);
    }
    addStep([9], [j + 1], "Поставям " + current + " на позиция " + (j + 1) + ". Подредената част вече е до позиция " + i + ".", { i: i, j: j, current: current });
  }

  addStep([11], [], "Готово! Масивът е подреден с " + compareCount + " сравнения и " + swapCount + " премествания.", {});

  return steps;
}
