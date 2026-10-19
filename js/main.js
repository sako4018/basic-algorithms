// Home screen and navigation.
// Draws the list of levels and lessons, switches between the home screen
// and the lesson screen, and handles the light/dark theme.
// Everything inside the lesson screen is drawn by player.js.

// Lessons that are not built yet have only a title (no buildSteps).
const LEVELS = [
  {
    title: "Ниво 1 — основи",
    lessons: [
      { title: "Проследяване на цикъл и условие" },
      minMaxLesson,
      sumCountLesson,
    ],
  },
  {
    title: "Ниво 2 — търсене",
    lessons: [
      linearSearchLesson,
      binarySearchLesson,
    ],
  },
  {
    title: "Ниво 3 — прости сортирания",
    lessons: [
      bubbleSortLesson,
      selectionSortLesson,
      insertionSortLesson,
    ],
  },
  {
    title: "Ниво 4 — по-бързи сортирания и рекурсия",
    lessons: [
      { title: "Рекурсия (recursion): факториел и Ханойски кули" },
      mergeSortLesson,
      quickSortLesson,
      compareSortsLesson,
    ],
  },
  {
    title: "Ниво 5 — структури и графи",
    lessons: [
      { title: "Стек и опашка (stack и queue)" },
      { title: "Обхождане в ширина и дълбочина (BFS и DFS)" },
      { title: "Най-кратък път (Dijkstra)" },
    ],
  },
];

const THEME_STORAGE_KEY = "theme";

const homeScreen = document.getElementById("home-screen");
const lessonScreen = document.getElementById("lesson-screen");
const levelsContainer = document.getElementById("levels");
const backButton = document.getElementById("back-button");
const themeToggle = document.getElementById("theme-toggle");

// ---------- Home screen ----------

function isLessonReady(lesson) {
  return typeof lesson.buildSteps === "function";
}

function createLessonCard(lesson) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "lesson-card";

  const title = document.createElement("span");
  title.className = "lesson-card-title";
  title.textContent = lesson.title;
  card.appendChild(title);

  if (isLessonReady(lesson)) {
    const action = document.createElement("span");
    action.className = "lesson-card-action";
    action.textContent = "Започни →";
    card.appendChild(action);
    card.addEventListener("click", function () {
      showLesson(lesson);
    });
  } else {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Скоро";
    card.appendChild(badge);
    card.disabled = true;
  }

  return card;
}

function createLevelSection(level) {
  const section = document.createElement("section");
  section.className = "level";

  const heading = document.createElement("h2");
  heading.className = "level-title";
  heading.textContent = level.title;
  section.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "lesson-grid";
  for (let i = 0; i < level.lessons.length; i++) {
    grid.appendChild(createLessonCard(level.lessons[i]));
  }
  section.appendChild(grid);

  return section;
}

function renderLevels() {
  levelsContainer.innerHTML = "";
  for (let i = 0; i < LEVELS.length; i++) {
    levelsContainer.appendChild(createLevelSection(LEVELS[i]));
  }
}

// ---------- Navigation ----------

function showLesson(lesson) {
  homeScreen.hidden = true;
  lessonScreen.hidden = false;
  window.scrollTo(0, 0);
  openLesson(lesson);
}

function showHome() {
  closeLesson();
  lessonScreen.hidden = true;
  homeScreen.hidden = false;
  window.scrollTo(0, 0);
}

// ---------- Theme ----------

function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Storage can be blocked (private mode); the theme just won't be remembered.
  }
}

function getCurrentTheme() {
  const theme = document.documentElement.getAttribute("data-theme");
  // Black is the default look; light is only used when picked with the button.
  return theme === "light" ? "light" : "dark";
}

// The button shows the theme you will switch TO.
function updateThemeButton() {
  const isDark = getCurrentTheme() === "dark";
  themeToggle.textContent = isDark ? "☀" : "☾";
  themeToggle.title = isDark ? "Светла тема" : "Тъмна тема";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeButton();
}

function toggleTheme() {
  const newTheme = getCurrentTheme() === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  saveTheme(newTheme);
}

function initTheme() {
  const savedTheme = readSavedTheme();
  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
  } else {
    // No saved choice: CSS uses the black theme, we only set the icon.
    updateThemeButton();
  }
}

// ---------- Start ----------

themeToggle.addEventListener("click", toggleTheme);
backButton.addEventListener("click", showHome);
initTheme();
renderLevels();
