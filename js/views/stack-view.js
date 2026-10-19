// Call stack view (STEP_VIEWS.stack), used by the recursion lessons.
// It draws into #extra-view and reads these fields of a step:
//   stack    - the calls from the bottom to the top: [{ label, note }]
//   returned - the call that has just returned: { label, value }, or null
//              (value null = the call has no result, it just finished)
//   pegs     - optional, Tower of Hanoi only: three arrays of disk sizes,
//              each from the bottom disk to the top one, e.g. [[3,2,1],[],[]]
//   movedDisk - optional: the disk that has just moved (drawn highlighted)
// Pure drawing: no state is kept here, every step is drawn from scratch.

const PEG_NAMES = ["A", "B", "C"];

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function renderStackView(container, step) {
  container.innerHTML = "";
  const view = makeElement("div", "stack-view");
  if (step.pegs) {
    view.appendChild(makePegsPanel(step.pegs, step.movedDisk));
  }
  view.appendChild(makeStackPanel(step.stack, step.returned));
  container.appendChild(view);
}

// ---------- The call stack ----------

function makeStackPanel(stack, returned) {
  const panel = makeElement("div", "stack-panel");
  panel.appendChild(makeElement("div", "stack-title", "Стек на извикванията (call stack)"));

  // The boxes are listed bottom first and the column draws them upwards.
  const column = makeElement("div", "stack-column");
  for (let index = 0; index < stack.length; index++) {
    const isTop = index === stack.length - 1;
    const box = makeElement("div", isTop ? "stack-box top" : "stack-box");
    box.appendChild(makeElement("span", "stack-label", stack[index].label));
    box.appendChild(makeElement("span", "stack-note", stack[index].note));
    column.appendChild(box);
  }
  if (returned) {
    column.appendChild(makeReturnedBox(returned));
  }
  if (stack.length === 0 && !returned) {
    column.appendChild(makeElement("div", "stack-empty", "празен"));
  }
  panel.appendChild(column);
  return panel;
}

// The call that has just left the stack. It is drawn above the stack, faded.
function makeReturnedBox(returned) {
  const box = makeElement("div", "stack-box returned");
  box.appendChild(makeElement("span", "stack-label", returned.label));
  const text = returned.value === null ? "приключи" : "връща " + returned.value;
  box.appendChild(makeElement("span", "stack-note stack-value", text));
  return box;
}

// ---------- The pegs (Tower of Hanoi) ----------

function makePegsPanel(pegs, movedDisk) {
  const panel = makeElement("div", "pegs-panel");
  const maxDisk = largestDisk(pegs);
  for (let pegIndex = 0; pegIndex < pegs.length; pegIndex++) {
    const peg = makeElement("div", "peg");
    const disksColumn = makeElement("div", "peg-disks");
    for (const disk of pegs[pegIndex]) {
      const diskElement = makeElement("div", disk === movedDisk ? "disk moved" : "disk", disk);
      diskElement.style.width = (30 + 70 * disk / maxDisk) + "%";
      disksColumn.appendChild(diskElement);
    }
    peg.appendChild(disksColumn);
    peg.appendChild(makeElement("div", "peg-name", PEG_NAMES[pegIndex]));
    panel.appendChild(peg);
  }
  return panel;
}

function largestDisk(pegs) {
  let largest = 1;
  for (const peg of pegs) {
    for (const disk of peg) {
      largest = Math.max(largest, disk);
    }
  }
  return largest;
}

STEP_VIEWS.stack = { render: renderStackView };
