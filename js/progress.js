// Remembers which lessons the student has finished (reached the last step).
// Only lesson ids are saved, in localStorage. Storage can be blocked
// (private mode) or hold broken data, so every read and write is guarded.

const PROGRESS_STORAGE_KEY = "doneLessons";

// Returns an array of lesson ids (empty if nothing is saved or the data is broken).
function readDoneLessons() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
    if (!Array.isArray(saved)) {
      return [];
    }
    return saved.filter(function (id) {
      return typeof id === "string";
    });
  } catch (error) {
    return [];
  }
}

function isLessonDone(lessonId) {
  return readDoneLessons().indexOf(lessonId) !== -1;
}

function markLessonDone(lessonId) {
  const done = readDoneLessons();
  if (done.indexOf(lessonId) !== -1) {
    return;
  }
  done.push(lessonId);
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(done));
  } catch (error) {
    // Storage blocked: progress just won't be remembered.
  }
}

// How many of the given lessons are done, e.g. for "2 / 5" on a level.
function countDoneLessons(lessons) {
  const done = readDoneLessons();
  let count = 0;
  for (let i = 0; i < lessons.length; i++) {
    if (done.indexOf(lessons[i].id) !== -1) {
      count++;
    }
  }
  return count;
}
