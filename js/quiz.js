// "Провери се": a question about the step the teacher is on.
// The student guesses what happens on the NEXT step. The right answer is the
// text of the next step; the wrong answers are texts of other steps of the
// same lesson. Pure functions, no DOM (player.js draws the question).

const QUIZ_OPTION_COUNT = 3;

// random is a function returning a number in [0, 1); tests pass their own.
// Returns { question, options, correctIndex }, or null when there is no next
// step or no other step text to use as a wrong answer.
function makeQuizQuestion(steps, stepIndex, random) {
  const nextStep = steps[stepIndex + 1];
  if (nextStep === undefined) {
    return null;
  }

  const correctText = nextStep.text;
  const otherTexts = [];
  for (let i = 0; i < steps.length; i++) {
    const text = steps[i].text;
    if (text !== correctText && otherTexts.indexOf(text) === -1) {
      otherTexts.push(text);
    }
  }
  if (otherTexts.length === 0) {
    return null;
  }

  shuffleInPlace(otherTexts, random);
  const options = otherTexts.slice(0, QUIZ_OPTION_COUNT - 1);
  options.push(correctText);
  shuffleInPlace(options, random);

  return {
    question: "Какво ще се случи на следващата стъпка?",
    options: options,
    correctIndex: options.indexOf(correctText),
  };
}

// Fisher-Yates shuffle.
function shuffleInPlace(list, random) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
}
