// View for the stack and queue lesson: a stack (vertical, top is up) and a
// queue (horizontal, front on the left) one under the other.
// Registers STEP_VIEWS.stackQueue; the player calls render for every step.
// A step has stack, queue, stackOut, queueOut (arrays) and added / removed
// ({ where: "stack" | "queue", value } or null).

STEP_VIEWS.stackQueue = {
  render: renderStackQueueView,
};

function makeSqElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function renderStackQueueView(container, step) {
  container.innerHTML = "";
  const view = makeSqElement("div", "sq-view");
  view.appendChild(makeSqStackBlock(step));
  view.appendChild(makeSqQueueBlock(step));
  container.appendChild(view);
}

// One item box. It is yellow if it was just added.
function makeSqItem(value, isNew) {
  const item = makeSqElement("div", "sq-item", value);
  if (isNew) {
    item.classList.add("sq-new");
  }
  return item;
}

// The red box beside the structure with the number that was just taken out.
function makeSqRemovedSlot(step, where) {
  const slot = makeSqElement("div", "sq-removed-slot");
  if (step.removed && step.removed.where === where) {
    slot.appendChild(makeSqElement("div", "sq-removed-label", "излиза"));
    slot.appendChild(makeSqElement("div", "sq-item sq-gone", step.removed.value));
  }
  return slot;
}

function makeSqOutputLine(values) {
  const text = values.length === 0 ? "—" : values.join(", ");
  return makeSqElement("div", "sq-output", "Излезли: " + text);
}

function makeSqStackBlock(step) {
  const block = makeSqElement("div", "sq-block");
  block.appendChild(makeSqElement("div", "sq-title", "Стек (stack) — последен влиза, пръв излиза"));

  const row = makeSqElement("div", "sq-row");
  row.appendChild(makeSqRemovedSlot(step, "stack"));

  const column = makeSqElement("div", "sq-stack");
  // The last pushed number is the top, so it is drawn first (highest).
  for (let index = step.stack.length - 1; index >= 0; index--) {
    const isTop = index === step.stack.length - 1;
    const isNew = isTop && step.added !== null && step.added.where === "stack";
    const line = makeSqElement("div", "sq-stack-line");
    line.appendChild(makeSqItem(step.stack[index], isNew));
    if (isTop) {
      line.appendChild(makeSqElement("span", "sq-tag", "← top"));
    }
    column.appendChild(line);
  }
  row.appendChild(column);
  block.appendChild(row);
  block.appendChild(makeSqOutputLine(step.stackOut));
  return block;
}

function makeSqQueueBlock(step) {
  const block = makeSqElement("div", "sq-block");
  block.appendChild(makeSqElement("div", "sq-title", "Опашка (queue) — пръв влиза, пръв излиза"));

  const row = makeSqElement("div", "sq-row");
  row.appendChild(makeSqRemovedSlot(step, "queue"));

  const items = makeSqElement("div", "sq-queue");
  const lastIndex = step.queue.length - 1;
  for (let index = 0; index <= lastIndex; index++) {
    const isNew = index === lastIndex && step.added !== null && step.added.where === "queue";
    const cell = makeSqElement("div", "sq-queue-cell");
    cell.appendChild(makeSqItem(step.queue[index], isNew));
    let tag = "";
    if (index === 0 && index === lastIndex) {
      tag = "front, back";
    } else if (index === 0) {
      tag = "front";
    } else if (index === lastIndex) {
      tag = "back";
    }
    cell.appendChild(makeSqElement("span", "sq-tag", tag));
    items.appendChild(cell);
  }
  row.appendChild(items);
  block.appendChild(row);
  block.appendChild(makeSqOutputLine(step.queueOut));
  return block;
}
