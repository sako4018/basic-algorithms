// Graph view for the BFS, DFS and Dijkstra lessons.
// A lesson with `view: "graph"` gives every step two extra fields:
//
//   step.graph = {
//     current:     node being worked on, or -1
//     done:        nodes that are finished (green)
//     frontier:    nodes waiting in the queue / stack (grey outline)
//     edge:        [node, node] being looked at now, or null (red)
//     treeEdges:   [[node, node], ...] edges that were used to reach nodes
//     showWeights: true to write the weight on every edge
//     dist:        distance written next to each node, or null
//   }
//   step.side = {
//     kind:  "queue", "stack" or "table"
//     title: heading of the small box next to the picture
//     items: queue: front first; stack: bottom first; table: one text per node
//   }
//
// The positions and edges come from js/data/graph-data.js.

const GRAPH_SVG_NS = "http://www.w3.org/2000/svg";
const GRAPH_VIEW_WIDTH = 400;
const GRAPH_VIEW_HEIGHT = 260;
const GRAPH_NODE_RADIUS = 20;

STEP_VIEWS.graph = { render: renderGraphView };

function renderGraphView(container, step) {
  container.innerHTML = "";

  const layout = document.createElement("div");
  layout.className = "graph-layout";
  layout.appendChild(createGraphPicture(step.graph));
  layout.appendChild(createGraphSideBox(step.side, step.graph));
  container.appendChild(layout);
}

// ---------- The picture ----------

function createSvgElement(tagName, attributes) {
  const element = document.createElementNS(GRAPH_SVG_NS, tagName);
  for (const name of Object.keys(attributes)) {
    element.setAttribute(name, attributes[name]);
  }
  return element;
}

function createGraphPicture(graphState) {
  const svg = createSvgElement("svg", {
    viewBox: "0 0 " + GRAPH_VIEW_WIDTH + " " + GRAPH_VIEW_HEIGHT,
    class: "graph-picture",
    role: "img",
  });

  for (const edge of GRAPH_EDGES) {
    svg.appendChild(createGraphEdge(edge, graphState));
  }
  if (graphState.showWeights) {
    for (const edge of GRAPH_EDGES) {
      svg.appendChild(createGraphWeightLabel(edge));
    }
  }
  for (let node = 0; node < GRAPH_NODE_POSITIONS.length; node++) {
    svg.appendChild(createGraphNode(node, graphState));
  }
  return svg;
}

function isSameEdge(edgeA, edgeB) {
  return (edgeA[0] === edgeB[0] && edgeA[1] === edgeB[1]) ||
    (edgeA[0] === edgeB[1] && edgeA[1] === edgeB[0]);
}

function createGraphEdge(edge, graphState) {
  const from = GRAPH_NODE_POSITIONS[edge[0]];
  const to = GRAPH_NODE_POSITIONS[edge[1]];
  let edgeClass = "graph-edge";

  if (graphState.edge && isSameEdge(edge, graphState.edge)) {
    edgeClass += " graph-edge-current";
  } else if (graphState.treeEdges.some(function (used) { return isSameEdge(edge, used); })) {
    edgeClass += " graph-edge-used";
  }
  return createSvgElement("line", {
    x1: from.x, y1: from.y, x2: to.x, y2: to.y, class: edgeClass,
  });
}

function createGraphWeightLabel(edge) {
  const from = GRAPH_NODE_POSITIONS[edge[0]];
  const to = GRAPH_NODE_POSITIONS[edge[1]];
  const label = createSvgElement("text", {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2,
    class: "graph-weight",
  });
  label.textContent = edge[2];
  return label;
}

// The state of a node, as a CSS class. "Current" wins over "done", and
// "done" wins over "waiting".
function graphNodeStateClass(node, graphState) {
  if (graphState.current === node) {
    return "graph-node-current";
  }
  if (graphState.done.includes(node)) {
    return "graph-node-done";
  }
  if (graphState.frontier.includes(node)) {
    return "graph-node-frontier";
  }
  return "graph-node-idle";
}

function createGraphNode(node, graphState) {
  const position = GRAPH_NODE_POSITIONS[node];
  const group = createSvgElement("g", {
    class: "graph-node " + graphNodeStateClass(node, graphState),
  });

  group.appendChild(createSvgElement("circle", {
    cx: position.x, cy: position.y, r: GRAPH_NODE_RADIUS,
  }));
  const label = createSvgElement("text", {
    x: position.x, y: position.y, class: "graph-node-label",
  });
  label.textContent = node;
  group.appendChild(label);

  if (graphState.dist) {
    const distanceLabel = createSvgElement("text", {
      x: position.x, y: position.y - GRAPH_NODE_RADIUS - 6, class: "graph-distance",
    });
    distanceLabel.textContent = graphDistanceText(graphState.dist[node]);
    group.appendChild(distanceLabel);
  }
  return group;
}

// ---------- The small box (queue, stack or distances) ----------

function createGraphSideBox(side, graphState) {
  const box = document.createElement("div");
  box.className = "graph-side";

  const title = document.createElement("p");
  title.className = "graph-side-title";
  title.textContent = side.title;
  box.appendChild(title);

  if (side.kind === "table") {
    box.appendChild(createGraphDistanceTable(side.items, graphState));
  } else if (side.kind === "stack") {
    box.appendChild(createGraphStack(side.items));
  } else {
    box.appendChild(createGraphQueue(side.items));
  }
  return box;
}

function createGraphItem(value) {
  const item = document.createElement("span");
  item.className = "graph-item";
  item.textContent = value;
  return item;
}

function createGraphEmptyNote() {
  const note = document.createElement("span");
  note.className = "graph-empty";
  note.textContent = "празно";
  return note;
}

// The front of the queue is on the left.
function createGraphQueue(items) {
  const row = document.createElement("div");
  row.className = "graph-queue";
  if (items.length === 0) {
    row.appendChild(createGraphEmptyNote());
  }
  for (const value of items) {
    row.appendChild(createGraphItem(value));
  }
  return row;
}

// The top of the stack is drawn first (on top). items has the bottom first.
function createGraphStack(items) {
  const column = document.createElement("div");
  column.className = "graph-stack";
  if (items.length === 0) {
    column.appendChild(createGraphEmptyNote());
  }
  for (let index = items.length - 1; index >= 0; index--) {
    const item = createGraphItem(items[index]);
    if (index === items.length - 1) {
      item.classList.add("graph-item-top");
      item.title = "връх на стека";
    }
    column.appendChild(item);
  }
  return column;
}

function createGraphDistanceTable(items, graphState) {
  const table = document.createElement("table");
  table.className = "graph-table";

  const header = document.createElement("tr");
  const nodeHeading = document.createElement("th");
  nodeHeading.textContent = "връх";
  const distanceHeading = document.createElement("th");
  distanceHeading.textContent = "разстояние";
  header.appendChild(nodeHeading);
  header.appendChild(distanceHeading);
  table.appendChild(header);

  for (let node = 0; node < items.length; node++) {
    const row = document.createElement("tr");
    row.className = "graph-table-" + graphNodeStateClass(node, graphState).replace("graph-node-", "");
    const nodeCell = document.createElement("td");
    nodeCell.textContent = node;
    const distanceCell = document.createElement("td");
    distanceCell.textContent = items[node];
    row.appendChild(nodeCell);
    row.appendChild(distanceCell);
    table.appendChild(row);
  }
  return table;
}
