// Stack and queue lesson.
// The same numbers go into a stack and into a queue, then come out again.
// The student sees that the stack gives them back in reverse order (LIFO)
// and the queue in the same order (FIFO).
// This lesson has its own view (js/views/stack-queue-view.js), so a step
// has the usual fields (with empty bars) plus: stack, queue, stackOut,
// queueOut (arrays), and added / removed ({ where, value } or null).
// Steps point at lines (1-based) of `code`, so keep them in sync.

const stackQueueLesson = {
  id: "stack-queue",
  title: "Стек и опашка (stack и queue)",
  intro:
    "Стекът (stack) е като купчина чинии: последният сложен е пръв взет (последен влиза, пръв излиза). " +
    "Опашката (queue) е като опашка пред магазин: първият дошъл е пръв обслужен (пръв влиза, пръв излиза). " +
    "Слагаме едни и същи числа и в двете и ги вадим обратно.",
  view: "stackQueue",
  makeInput: makeStackQueueInput,
  code: [
    "function stackAndQueue(numbers) {",
    "  let stack = [];",
    "  let queue = [];",
    "  for (let i = 0; i < numbers.length; i++) {",
    "    stack.push(numbers[i]);",
    "    queue.push(numbers[i]);",
    "  }",
    "  while (stack.length > 0) {",
    "    let fromStack = stack.pop();",
    "    let fromQueue = queue.shift();",
    "    console.log(fromStack, fromQueue);",
    "  }",
    "}",
  ],
  // C, C++ and Java have the same line numbers as JS. Python is shorter,
  // so it has a lineMap.
  otherLanguages: {
    c: {
      code: [
        "void stackAndQueue(int numbers[], int n) {",
        "  int stack[100], stackSize = 0;",
        "  int queue[100], front = 0, back = 0;",
        "  for (int i = 0; i < n; i++) {",
        "    stack[stackSize++] = numbers[i];",
        "    queue[back++] = numbers[i];",
        "  }",
        "  while (stackSize > 0) {",
        "    int fromStack = stack[--stackSize];",
        "    int fromQueue = queue[front++];",
        "    printf(\"%d %d\\n\", fromStack, fromQueue);",
        "  }",
        "}",
      ],
    },
    cpp: {
      code: [
        "void stackAndQueue(vector<int>& numbers) {",
        "  vector<int> stack;",
        "  deque<int> queue;",
        "  for (int i = 0; i < (int)numbers.size(); i++) {",
        "    stack.push_back(numbers[i]);",
        "    queue.push_back(numbers[i]);",
        "  }",
        "  while (!stack.empty()) {",
        "    int fromStack = stack.back(); stack.pop_back();",
        "    int fromQueue = queue.front(); queue.pop_front();",
        "    cout << fromStack << \" \" << fromQueue << endl;",
        "  }",
        "}",
      ],
    },
    java: {
      code: [
        "static void stackAndQueue(int[] numbers) {",
        "  Deque<Integer> stack = new ArrayDeque<>();",
        "  Queue<Integer> queue = new ArrayDeque<>();",
        "  for (int i = 0; i < numbers.length; i++) {",
        "    stack.push(numbers[i]);",
        "    queue.add(numbers[i]);",
        "  }",
        "  while (!stack.isEmpty()) {",
        "    int fromStack = stack.pop();",
        "    int fromQueue = queue.remove();",
        "    System.out.println(fromStack + \" \" + fromQueue);",
        "  }",
        "}",
      ],
    },
    python: {
      code: [
        "def stack_and_queue(numbers):",
        "    stack = []",
        "    queue = []",
        "    for number in numbers:",
        "        stack.append(number)",
        "        queue.append(number)",
        "    while len(stack) > 0:",
        "        from_stack = stack.pop()",
        "        from_queue = queue.pop(0)",
        "        print(from_stack, from_queue)",
      ],
      lineMap: { 5: [5], 6: [6], 8: [7], 9: [8], 10: [9], 11: [10], 13: [10] },
    },
  },
  buildSteps: buildStackQueueSteps,
};

const STACK_QUEUE_COUNT = 5;

// Five different random numbers, so the order is easy to follow.
function makeStackQueueInput() {
  const numbers = [];
  while (numbers.length < STACK_QUEUE_COUNT) {
    const number = 1 + Math.floor(Math.random() * 99);
    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }
  return numbers;
}

function listText(list) {
  return "[" + list.join(", ") + "]";
}

function buildStackQueueSteps(input) {
  const numbers = input.slice();
  const stack = [];
  const queue = [];
  const stackOut = [];
  const queueOut = [];
  const steps = [];
  let currentIndex = null;
  let fromStack = null;
  let fromQueue = null;

  function currentVars() {
    const vars = {};
    if (currentIndex !== null) {
      vars.i = currentIndex;
    }
    vars.stack = listText(stack);
    vars.queue = listText(queue);
    if (fromStack !== null) {
      vars.fromStack = fromStack;
      vars.fromQueue = fromQueue === null ? "—" : fromQueue;
    }
    return vars;
  }

  // added and removed are { where: "stack" | "queue", value } or null.
  function addStep(lines, text, added, removed) {
    steps.push({
      bars: [],
      highlight: [],
      swapped: false,
      sorted: [],
      lines: lines,
      vars: currentVars(),
      compares: 0,
      swaps: 0,
      text: text,
      stack: stack.slice(),
      queue: queue.slice(),
      stackOut: stackOut.slice(),
      queueOut: queueOut.slice(),
      added: added,
      removed: removed,
    });
  }

  addStep([1, 2, 3], "Започваме с празен стек и празна опашка. Ще сложим в тях едни и същи " + numbers.length + " числа.", null, null);

  for (let i = 0; i < numbers.length; i++) {
    const value = numbers[i];
    currentIndex = i;
    stack.push(value);
    addStep([5], "Слагаме " + value + " в стека (push). Той отива най-отгоре.", { where: "stack", value: value }, null);
    queue.push(value);
    addStep([6], "Слагаме " + value + " в опашката (enqueue). Той застава най-отзад.", { where: "queue", value: value }, null);
  }

  currentIndex = null;
  addStep([8], "И в двете има по " + numbers.length + " числа, влезли в един и същ ред. Сега ги вадим.", null, null);

  while (stack.length > 0) {
    fromStack = stack.pop();
    addStep([9], "Вадим от стека (pop). Излиза " + fromStack + " — числото, което влезе последно.", null, { where: "stack", value: fromStack });
    fromQueue = queue.shift();
    addStep([10], "Вадим от опашката (dequeue). Излиза " + fromQueue + " — числото, което влезе първо.", null, { where: "queue", value: fromQueue });
    stackOut.push(fromStack);
    queueOut.push(fromQueue);
    addStep([11], "Отпечатваме " + fromStack + " и " + fromQueue + ".", null, null);
  }

  addStep([13],
    "Готово! Стекът върна числата в обратен ред: " + stackOut.join(", ") +
    " (последен влиза, пръв излиза). Опашката ги върна в същия ред: " + queueOut.join(", ") +
    " (пръв влиза, пръв излиза).", null, null);

  return steps;
}
