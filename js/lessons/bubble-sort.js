// Bubble sort lesson.
// The player shows `code` next to the animation. Each step says which
// lines (1-based) of `code` are active, so keep them in sync.

const bubbleSortLesson = {
  id: "bubble-sort",
  title: "Сортиране чрез мехурчета (bubble sort)",
  intro:
    "Минаваме през масива отляво надясно и сравняваме всеки два съседни елемента. " +
    "Ако левият е по-голям, ги разменяме. След всяко минаване най-големият елемент " +
    "„изплува“ най-отдясно, като мехурче във вода.",
  code: [
    "function bubbleSort(arr) {",
    "  for (let i = 0; i < arr.length - 1; i++) {",
    "    for (let j = 0; j < arr.length - 1 - i; j++) {",
    "      if (arr[j] > arr[j + 1]) {",
    "        const temp = arr[j];",
    "        arr[j] = arr[j + 1];",
    "        arr[j + 1] = temp;",
    "      }",
    "    }",
    "  }",
    "  return arr;",
    "}",
  ],
  buildSteps: buildBubbleSortSteps,
};

function buildBubbleSortSteps(input) {
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

  addStep([1], [], "Започваме. Масивът още не е подреден.", {});

  for (let i = 0; i < arr.length - 1; i++) {
    addStep([2], [], "Минаване №" + (i + 1) + ".", { i: i });

    for (let j = 0; j < arr.length - 1 - i; j++) {
      compareCount++;
      const left = arr[j];
      const right = arr[j + 1];
      const vars = { i: i, j: j, "arr[j]": left, "arr[j + 1]": right };

      if (left > right) {
        addStep([3, 4], [j, j + 1], "Сравнявам " + left + " и " + right + ": " + left + " > " + right + ", значи ще ги разменя.", vars);

        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapCount++;

        const varsAfter = { i: i, j: j, "arr[j]": arr[j], "arr[j + 1]": arr[j + 1] };
        addStep([5, 6, 7], [j, j + 1], "Разменям ги. Сега " + right + " е отляво, а " + left + " отдясно.", varsAfter, true);
      } else {
        addStep([3, 4], [j, j + 1], "Сравнявам " + left + " и " + right + ": " + left + " ≤ " + right + ", остават на място.", vars);
      }
    }

    const lastIndex = arr.length - 1 - i;
    sortedIndexes.push(lastIndex);
    addStep([2], [], "Край на минаване №" + (i + 1) + ". Числото " + arr[lastIndex] + " е на правилното си място.", { i: i });
  }

  sortedIndexes.push(0);
  addStep([11], [], "Готово! Масивът е подреден с " + compareCount + " сравнения и " + swapCount + " размени.", {});

  return steps;
}
