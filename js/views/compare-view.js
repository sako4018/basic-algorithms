// View for the "compare two sorts" lesson. Registers STEP_VIEWS.compare.
// A step has `rows`: one entry per sort, each with its name, bars,
// highlight, swapped, sorted and its own counters.
// Both rows are redrawn on every step (no sliding animation): the player's
// slide code handles only one row of bars, and a redraw is simple and correct.
// Load this file after player.js, which creates STEP_VIEWS.

const COMPARE_MIN_BAR_HEIGHT_PERCENT = 8;
const COMPARE_BAR_GAP_FRACTION = 0.25;

STEP_VIEWS.compare = {
  render: renderCompareRows,
};

function renderCompareRows(container, step) {
  container.innerHTML = "";
  container.classList.add("compare-view");
  for (const row of step.rows) {
    container.appendChild(createCompareRow(row));
  }
}

function createCompareRow(row) {
  const rowElement = document.createElement("div");
  rowElement.className = "compare-row";

  const header = document.createElement("div");
  header.className = "compare-header";

  const name = document.createElement("span");
  name.className = "compare-name";
  name.textContent = row.name;
  header.appendChild(name);

  const counters = document.createElement("span");
  counters.className = "compare-counters";
  counters.textContent = "Сравнения: " + row.compares + " · " + row.swapsName + ": " + row.swaps;
  header.appendChild(counters);

  rowElement.appendChild(header);
  rowElement.appendChild(createCompareBars(row));
  return rowElement;
}

function createCompareBars(row) {
  const barsElement = document.createElement("div");
  barsElement.className = "compare-bars";
  const maxValue = Math.max.apply(null, row.bars);
  const slotPercent = 100 / row.bars.length;
  const barWidthPercent = slotPercent * (1 - COMPARE_BAR_GAP_FRACTION);
  const gapPercent = slotPercent * COMPARE_BAR_GAP_FRACTION;

  for (let index = 0; index < row.bars.length; index++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = barWidthPercent + "%";
    bar.style.left = index * slotPercent + gapPercent / 2 + "%";
    bar.style.height = Math.max((row.bars[index] / maxValue) * 100, COMPARE_MIN_BAR_HEIGHT_PERCENT) + "%";

    bar.classList.toggle("highlight", row.highlight.includes(index));
    bar.classList.toggle("swapped", row.swapped && row.highlight.includes(index));
    bar.classList.toggle("sorted", row.sorted.includes(index));

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = row.bars[index];
    bar.appendChild(label);

    barsElement.appendChild(bar);
  }
  return barsElement;
}
