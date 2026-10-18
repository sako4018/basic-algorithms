// Shared lesson player.
// A lesson only produces a list of steps; this file draws one step at a time
// and handles play / pause / step / speed and the custom array input.

const RANDOM_ARRAY_LENGTH = 8;
const RANDOM_MIN_VALUE = 5;
const RANDOM_MAX_VALUE = 99;
const INPUT_MIN_LENGTH = 5;
const INPUT_MAX_LENGTH = 12;
const INPUT_MIN_VALUE = 1;
const INPUT_MAX_VALUE = 99;
const MIN_BAR_HEIGHT_PERCENT = 8;
const SLOWEST_DELAY_MS = 1500;
const FASTEST_DELAY_MS = 100;

let playerLesson = null;
let playerArray = [];
let playerSteps = [];
let playerStepIndex = 0;
let playerTimer = null;
let playerControlsWired = false;

// ---------- Opening and closing a lesson ----------

function openLesson(lesson) {
  stopPlayback();
  playerLesson = lesson;
  document.getElementById("lesson-title").textContent = lesson.title;
  document.getElementById("lesson-intro").textContent = lesson.intro;
  document.getElementById("input-error").textContent = "";
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
  document.getElementById("array-input").value = values.join(", ");
  playerSteps = playerLesson.buildSteps(values);
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
  document.getElementById("compare-count").textContent = step.compares;
  document.getElementById("swap-count").textContent = step.swaps;
  document.getElementById("step-counter").textContent =
    "Стъпка " + (stepIndex + 1) + " от " + playerSteps.length;
  updateButtons();
}

function renderBars(step) {
  const barsContainer = document.getElementById("bars");
  barsContainer.innerHTML = "";
  const maxValue = Math.max.apply(null, step.bars);

  for (let index = 0; index < step.bars.length; index++) {
    const value = step.bars[index];
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = barHeightPercent(value, maxValue) + "%";
    bar.textContent = value;

    if (step.highlight.includes(index)) {
      bar.classList.add("highlight");
      if (step.swapped) {
        bar.classList.add("swapped");
      }
    }
    if (step.sorted.includes(index)) {
      bar.classList.add("sorted");
    }
    barsContainer.appendChild(bar);
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

function currentDelayMs() {
  const speedSlider = document.getElementById("speed");
  const speed = Number(speedSlider.value);
  const min = Number(speedSlider.min) || 1;
  const max = Number(speedSlider.max) || 10;
  const fraction = (speed - min) / (max - min);
  return Math.round(SLOWEST_DELAY_MS - fraction * (SLOWEST_DELAY_MS - FASTEST_DELAY_MS));
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

// ---------- Custom array input ----------

function applyArrayInput() {
  const errorBox = document.getElementById("input-error");
  const text = document.getElementById("array-input").value;
  const result = parseArrayInput(text);

  if (result.error) {
    errorBox.textContent = result.error;
    return;
  }
  errorBox.textContent = "";
  useArray(result.values);
}

// Returns { values } on success or { error } with a message for the student.
function parseArrayInput(text) {
  const parts = text.split(",");
  const values = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === "") {
      continue;
    }
    if (!/^-?\d+$/.test(trimmed)) {
      return { error: "„" + trimmed + "“ не е цяло число. Пиши числа, разделени със запетая." };
    }
    const value = Number(trimmed);
    if (value < INPUT_MIN_VALUE || value > INPUT_MAX_VALUE) {
      return { error: "Числата трябва да са от " + INPUT_MIN_VALUE + " до " + INPUT_MAX_VALUE + "." };
    }
    values.push(value);
  }

  if (values.length < INPUT_MIN_LENGTH || values.length > INPUT_MAX_LENGTH) {
    return { error: "Въведи от " + INPUT_MIN_LENGTH + " до " + INPUT_MAX_LENGTH + " числа (сега са " + values.length + ")." };
  }
  return { values: values };
}

function useNewRandomArray() {
  document.getElementById("input-error").textContent = "";
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
  document.getElementById("speed").addEventListener("input", restartTimerWithNewSpeed);
  document.getElementById("apply-button").addEventListener("click", applyArrayInput);
  document.getElementById("random-button").addEventListener("click", useNewRandomArray);
  document.getElementById("array-input").addEventListener("keydown", applyOnEnter);
  document.addEventListener("keydown", handlePlayerKeys);
}

function applyOnEnter(event) {
  if (event.key === "Enter") {
    applyArrayInput();
  }
}

function handlePlayerKeys(event) {
  if (!isLessonScreenVisible() || event.target.id === "array-input") {
    return;
  }

  if (event.key === " ") {
    // Stops the page from scrolling and a focused button from also being "clicked".
    event.preventDefault();
    togglePlayback();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToPreviousStep();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    goToNextStep();
  }
}

function isLessonScreenVisible() {
  const lessonScreen = document.getElementById("lesson-screen");
  return playerLesson !== null && lessonScreen !== null && lessonScreen.getClientRects().length > 0;
}
