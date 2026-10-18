// Shared lesson player.
// A lesson only produces a list of steps; this file draws one step at a time
// and handles step forward / back, optional play / pause and the swap speed.

const RANDOM_ARRAY_LENGTH = 8;
const RANDOM_MIN_VALUE = 5;
const RANDOM_MAX_VALUE = 99;
const MIN_BAR_HEIGHT_PERCENT = 8;
// Part of each bar's slot left empty as the gap between bars.
const BAR_GAP_FRACTION = 0.25;
// While playing, wait this long after a swap animation before the next step.
const PAUSE_AFTER_ANIMATION_MS = 600;

let playerLesson = null;
let playerArray = [];
let playerSteps = [];
let playerStepIndex = 0;
let playerTimer = null;
let playerControlsWired = false;
// One element per number. They stay the same between steps, so a swap
// moves the two real bars instead of redrawing them.
let barItems = [];

// ---------- Opening and closing a lesson ----------

function openLesson(lesson) {
  stopPlayback();
  playerLesson = lesson;
  document.getElementById("lesson-title").textContent = lesson.title;
  renderCode(lesson.code);
  wirePlayerControls();
  useArray(makeRandomArray());
}

function closeLesson() {
  stopPlayback();
}

function useArray(values) {
  stopPlayback();
  playerArray = values;
  playerSteps = playerLesson.buildSteps(values);
  createBars(values);
  showStep(0);
}

function makeRandomArray() {
  const values = [];
  for (let i = 0; i < RANDOM_ARRAY_LENGTH; i++) {
    const range = RANDOM_MAX_VALUE - RANDOM_MIN_VALUE + 1;
    values.push(RANDOM_MIN_VALUE + Math.floor(Math.random() * range));
  }
  return values;
}

// ---------- Drawing one step ----------

function showStep(stepIndex) {
  playerStepIndex = stepIndex;
  const step = playerSteps[stepIndex];
  renderBars(step);
  renderActiveCodeLines(step.lines);
  renderVariables(step.vars);
  document.getElementById("step-text").textContent = step.text;
  document.getElementById("step-counter").textContent =
    (stepIndex + 1) + " / " + playerSteps.length;
  updateButtons();
}

function createBars(values) {
  const barsContainer = document.getElementById("bars");
  barsContainer.innerHTML = "";
  barItems = [];
  const maxValue = Math.max.apply(null, values);

  for (let index = 0; index < values.length; index++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = barHeightPercent(values[index], maxValue) + "%";

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = values[index];
    bar.appendChild(label);

    barsContainer.appendChild(bar);
    barItems.push({ value: values[index], element: bar, position: index });
  }
}

function renderBars(step) {
  placeBars(step.bars);
  const slotPercent = 100 / step.bars.length;
  const gapPercent = slotPercent * BAR_GAP_FRACTION;

  for (const item of barItems) {
    const index = item.position;
    const bar = item.element;
    bar.style.left = index * slotPercent + gapPercent / 2 + "%";
    bar.style.width = slotPercent - gapPercent + "%";

    bar.classList.toggle("highlight", step.highlight.includes(index));
    bar.classList.toggle("swapped", step.swapped && step.highlight.includes(index));
    bar.classList.toggle("sorted", step.sorted.includes(index));
  }
}

// Gives every bar element its position in this step. A bar keeps its old
// position if the same number is still there, so with repeated numbers only
// the bars that really moved get animated.
function placeBars(values) {
  const unplaced = barItems.slice();
  const newPositions = [];

  for (let index = 0; index < values.length; index++) {
    let chosen = -1;
    for (let k = 0; k < unplaced.length; k++) {
      if (unplaced[k].value !== values[index]) {
        continue;
      }
      if (chosen === -1 || unplaced[k].position === index) {
        chosen = k;
      }
    }
    newPositions.push({ item: unplaced[chosen], position: index });
    unplaced.splice(chosen, 1);
  }

  for (const entry of newPositions) {
    entry.item.position = entry.position;
  }
}

function barHeightPercent(value, maxValue) {
  const percent = (value / maxValue) * 100;
  return Math.max(percent, MIN_BAR_HEIGHT_PERCENT);
}

function renderCode(codeLines) {
  const codeContainer = document.getElementById("code");
  codeContainer.innerHTML = "";

  for (let index = 0; index < codeLines.length; index++) {
    const line = document.createElement("div");
    line.className = "code-line";

    const lineNumber = document.createElement("span");
    lineNumber.className = "line-number";
    lineNumber.textContent = index + 1;

    line.appendChild(lineNumber);
    line.appendChild(document.createTextNode(codeLines[index]));
    codeContainer.appendChild(line);
  }
}

function renderActiveCodeLines(activeLineNumbers) {
  const lines = document.querySelectorAll("#code .code-line");
  for (let index = 0; index < lines.length; index++) {
    const lineNumber = index + 1;
    lines[index].classList.toggle("active", activeLineNumbers.includes(lineNumber));
  }
}

function renderVariables(vars) {
  const varsContainer = document.getElementById("vars");
  varsContainer.innerHTML = "";
  const names = Object.keys(vars);

  if (names.length === 0) {
    varsContainer.textContent = "—";
    return;
  }

  const table = document.createElement("table");
  table.className = "vars-table";
  for (const name of names) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("th");
    nameCell.textContent = name;
    const valueCell = document.createElement("td");
    valueCell.textContent = vars[name];
    row.appendChild(nameCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  }
  varsContainer.appendChild(table);
}

function updateButtons() {
  const isFirstStep = playerStepIndex === 0;
  const isLastStep = playerStepIndex === playerSteps.length - 1;
  document.getElementById("prev-button").disabled = isFirstStep;
  document.getElementById("next-button").disabled = isLastStep;
  document.getElementById("play-button").textContent = isPlaying() ? "⏸ Пауза" : "▶ Пусни";
}

// ---------- Playback ----------

function isPlaying() {
  return playerTimer !== null;
}

function startPlayback() {
  if (playerStepIndex === playerSteps.length - 1) {
    showStep(0);
  }
  scheduleNextStep();
  updateButtons();
}

function stopPlayback() {
  if (playerTimer !== null) {
    clearTimeout(playerTimer);
    playerTimer = null;
  }
  // The lesson screen may not be set up yet on the very first open.
  if (playerSteps.length > 0) {
    updateButtons();
  }
}

function togglePlayback() {
  if (isPlaying()) {
    stopPlayback();
  } else {
    startPlayback();
  }
}

// setTimeout (not setInterval) so the delay is re-read from the slider
// before every step, and a speed change applies right away.
function scheduleNextStep() {
  playerTimer = setTimeout(playNextStep, currentDelayMs());
}

function playNextStep() {
  showStep(playerStepIndex + 1);
  if (playerStepIndex === playerSteps.length - 1) {
    stopPlayback();
  } else {
    scheduleNextStep();
  }
}

function swapDurationMs() {
  return Number(document.getElementById("speed").value);
}

function currentDelayMs() {
  return swapDurationMs() + PAUSE_AFTER_ANIMATION_MS;
}

function applySwapSpeed() {
  document.getElementById("bars").style.setProperty("--swap-duration", swapDurationMs() + "ms");
  restartTimerWithNewSpeed();
}

function restartTimerWithNewSpeed() {
  if (isPlaying()) {
    clearTimeout(playerTimer);
    scheduleNextStep();
  }
}

function goToPreviousStep() {
  stopPlayback();
  if (playerStepIndex > 0) {
    showStep(playerStepIndex - 1);
  }
}

function goToNextStep() {
  stopPlayback();
  if (playerStepIndex < playerSteps.length - 1) {
    showStep(playerStepIndex + 1);
  }
}

// ---------- New array ----------

function useNewRandomArray() {
  useArray(makeRandomArray());
}

// ---------- Buttons and keyboard ----------

function wirePlayerControls() {
  if (playerControlsWired) {
    return;
  }
  playerControlsWired = true;

  document.getElementById("prev-button").addEventListener("click", goToPreviousStep);
  document.getElementById("next-button").addEventListener("click", goToNextStep);
  document.getElementById("play-button").addEventListener("click", togglePlayback);
  document.getElementById("speed").addEventListener("input", applySwapSpeed);
  document.getElementById("random-button").addEventListener("click", useNewRandomArray);
  document.addEventListener("keydown", handlePlayerKeys);
  applySwapSpeed();
}

function handlePlayerKeys(event) {
  if (!isLessonScreenVisible()) {
    return;
  }

  // preventDefault stops the page from scrolling and a focused button
  // from also being "clicked" by Space.
  if (event.key === " " || event.key === "ArrowRight") {
    event.preventDefault();
    goToNextStep();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToPreviousStep();
  }
}

function isLessonScreenVisible() {
  const lessonScreen = document.getElementById("lesson-screen");
  return playerLesson !== null && lessonScreen !== null && lessonScreen.getClientRects().length > 0;
}
