// Lesson "compare two sorts": bubble sort and merge sort on the SAME array,
// side by side. It does not run any algorithm itself: it calls the step
// builders of bubble-sort.js and merge-sort.js (so those files must be loaded
// first) and merges their steps into one list, one step of each per step.
// The faster sort finishes first and then waits for the other.
//
// This is the only lesson that shows the counters of comparisons and
// swaps/writes on screen (TASTE.md says no counters elsewhere): comparing the
// numbers is the whole point here. They are drawn by js/views/compare-view.js.
//
// The code panel shows the bubble sort code (the code of the top row) and
// highlights its lines. Merge sort has no row in the code panel: what it is
// doing is told in the sentence under the bars.

const COMPARE_BUBBLE_NAME = "Мехурчета (bubble sort)";
const COMPARE_MERGE_NAME = "Сливане (merge sort)";

const compareSortsLesson = {
  id: "compare-sorts",
  title: "Сравнение на сортирания (bubble sort и merge sort)",
  intro:
    "Две сортирания подреждат един и същ масив едновременно. На всяка стъпка и двете " +
    "правят по една стъпка от своя алгоритъм. Отдолу на всеки ред се броят сравненията " +
    "и размените (при сливането — записите в масива). Кодът вдясно е на сортирането " +
    "чрез мехурчета; сливането се обяснява в изречението под стълбовете.",
  code: bubbleSortLesson.code,
  otherLanguages: bubbleSortLesson.otherLanguages,
  view: "compare",
  buildSteps: buildCompareSortsSteps,
};

function buildCompareSortsSteps(input) {
  const bubbleSteps = bubbleSortLesson.buildSteps(input.slice());
  const mergeSteps = mergeSortLesson.buildSteps(input.slice());
  const stepCount = Math.max(bubbleSteps.length, mergeSteps.length);
  const steps = [];

  for (let index = 0; index < stepCount; index++) {
    const bubbleStep = stepOrLast(bubbleSteps, index);
    const mergeStep = stepOrLast(mergeSteps, index);
    const bubbleWaiting = index > bubbleSteps.length - 1;
    const mergeWaiting = index > mergeSteps.length - 1;
    steps.push(makeCompareStep(bubbleStep, mergeStep, bubbleWaiting, mergeWaiting, index));
  }

  const lastStep = steps[steps.length - 1];
  lastStep.text = finalCompareText(lastStep.rows[0], lastStep.rows[1]);
  return steps;
}

// A sort that has finished keeps showing its last step.
function stepOrLast(steps, index) {
  return steps[Math.min(index, steps.length - 1)];
}

// The top-level bars, highlight, swapped, sorted, lines, vars, compares and
// swaps are those of bubble sort (the code panel shows its code).
function makeCompareStep(bubbleStep, mergeStep, bubbleWaiting, mergeWaiting, index) {
  return {
    rows: [
      makeCompareRow(COMPARE_BUBBLE_NAME, "Размени", bubbleStep),
      makeCompareRow(COMPARE_MERGE_NAME, "Записи", mergeStep),
    ],
    bars: bubbleStep.bars.slice(),
    highlight: bubbleStep.highlight.slice(),
    swapped: bubbleStep.swapped,
    sorted: bubbleStep.sorted.slice(),
    lines: bubbleStep.lines.slice(),
    vars: bubbleStep.vars,
    compares: bubbleStep.compares,
    swaps: bubbleStep.swaps,
    text: makeCompareText(bubbleStep, mergeStep, bubbleWaiting, mergeWaiting, index),
  };
}

function makeCompareRow(name, swapsName, sortStep) {
  return {
    name: name,
    swapsName: swapsName,
    bars: sortStep.bars.slice(),
    highlight: sortStep.highlight.slice(),
    swapped: sortStep.swapped,
    sorted: sortStep.sorted.slice(),
    compares: sortStep.compares,
    swaps: sortStep.swaps,
  };
}

function makeCompareText(bubbleStep, mergeStep, bubbleWaiting, mergeWaiting, index) {
  if (index === 0) {
    return "Започваме. И двете сортирания получават един и същ масив и ще правят по една стъпка наведнъж.";
  }
  return sortSentence("Мехурчета", bubbleStep, bubbleWaiting) + " " + sortSentence("Сливане", mergeStep, mergeWaiting);
}

// A sort that already finished says so instead of repeating its last text.
function sortSentence(shortName, sortStep, waiting) {
  if (waiting) {
    return shortName + ": вече е готово и чака другото.";
  }
  return shortName + ": " + sortStep.text;
}

function finalCompareText(bubbleRow, mergeRow) {
  const bubbleCounts =
    countCompareText(bubbleRow.compares, "сравнение", "сравнения") + " и " +
    countCompareText(bubbleRow.swaps, "размяна", "размени");
  const mergeCounts =
    countCompareText(mergeRow.compares, "сравнение", "сравнения") + " и " +
    countCompareText(mergeRow.swaps, "запис", "записа");

  let comparison = "и двете са направили по толкова сравнения.";
  if (mergeRow.compares < bubbleRow.compares) {
    comparison = "сливането е направило по-малко сравнения (" + mergeRow.compares + " срещу " + bubbleRow.compares + ").";
  } else if (mergeRow.compares > bubbleRow.compares) {
    comparison = "сливането е направило повече сравнения (" + mergeRow.compares + " срещу " + bubbleRow.compares + ").";
  }

  return "Готово! Мехурчетата: " + bubbleCounts + ". Сливането: " + mergeCounts + ". " +
    "Мехурчетата растат като O(n²), сливането като O(n log n); при тези 8 числа " + comparison;
}

function countCompareText(count, singular, plural) {
  if (count === 1) {
    return count + " " + singular;
  }
  return count + " " + plural;
}
