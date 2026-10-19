// Depth-first search (DFS) lesson, drawn by js/views/graph-view.js.
// The graph is in js/data/graph-data.js. Steps point at lines (1-based)
// of `code`, so keep them in sync.

const dfsLesson = {
  id: "dfs",
  title: "Обхождане в дълбочина (DFS)",
  intro:
    "Започваме от един връх и вървим колкото можем по-навътре по един път. Когато няма накъде, " +
    "връщаме се и опитваме друг път. Помни ни стек (stack): последният добавен се взима първи.",
  code: [
    "function dfs(graph, start) {",
    "  const visited = [];",
    "  const stack = [start];",
    "  while (stack.length > 0) {",
    "    const node = stack.pop();",
    "    if (!visited.includes(node)) {",
    "      visited.push(node);",
    "      for (const next of graph[node]) {",
    "        if (!visited.includes(next)) {",
    "          stack.push(next);",
    "        }",
    "      }",
    "    }",
    "  }",
    "  return visited;",
    "}",
  ],
  otherLanguages: {
    c: {
      code: [
        "void dfs(int graph[][7], int degree[], int start) {",
        "  int visited[7] = {0};",
        "  int stack[64];",
        "  int top = 0;",
        "  stack[top++] = start;",
        "  while (top > 0) {",
        "    int node = stack[--top];",
        "    if (!visited[node]) {",
        "      visited[node] = 1;",
        "      printf(\"%d \", node);",
        "      for (int k = 0; k < degree[node]; k++) {",
        "        int next = graph[node][k];",
        "        if (!visited[next]) {",
        "          stack[top++] = next;",
        "        }",
        "      }",
        "    }",
        "  }",
        "}",
      ],
      lineMap: {
        2: [2],
        3: [3, 4, 5],
        4: [6],
        5: [7],
        6: [8],
        7: [9, 10],
        8: [11, 12],
        9: [13],
        10: [14],
        15: [19],
      },
    },
    cpp: {
      code: [
        "vector<int> dfs(vector<vector<int>>& graph, int start) {",
        "  vector<int> visited;",
        "  vector<int> stack = {start};",
        "  while (!stack.empty()) {",
        "    int node = stack.back(); stack.pop_back();",
        "    if (find(visited.begin(), visited.end(), node) == visited.end()) {",
        "      visited.push_back(node);",
        "      for (int next : graph[node]) {",
        "        if (find(visited.begin(), visited.end(), next) == visited.end()) {",
        "          stack.push_back(next);",
        "        }",
        "      }",
        "    }",
        "  }",
        "  return visited;",
        "}",
      ],
    },
    java: {
      code: [
        "static List<Integer> dfs(List<List<Integer>> graph, int start) {",
        "  List<Integer> visited = new ArrayList<>();",
        "  Deque<Integer> stack = new ArrayDeque<>(List.of(start));",
        "  while (!stack.isEmpty()) {",
        "    int node = stack.pop();",
        "    if (!visited.contains(node)) {",
        "      visited.add(node);",
        "      for (int next : graph.get(node)) {",
        "        if (!visited.contains(next)) {",
        "          stack.push(next);",
        "        }",
        "      }",
        "    }",
        "  }",
        "  return visited;",
        "}",
      ],
    },
    python: {
      code: [
        "def dfs(graph, start):",
        "    visited = []",
        "    stack = [start]",
        "    while len(stack) > 0:",
        "        node = stack.pop()",
        "        if node not in visited:",
        "            visited.append(node)",
        "            for next in graph[node]:",
        "                if next not in visited:",
        "                    stack.append(next)",
        "    return visited",
      ],
      lineMap: { 15: [11] },
    },
  },
  view: "graph",
  makeInput: makeDfsInput,
  buildSteps: buildDfsSteps,
};

function makeDfsInput() {
  return { start: graphRandomStart() };
}

// The nodes that wait in the stack and have not been visited yet (each once).
function dfsWaitingNodes(stack, visited) {
  const waiting = [];
  for (const node of stack) {
    if (!visited.includes(node) && !waiting.includes(node)) {
      waiting.push(node);
    }
  }
  return waiting;
}

function buildDfsSteps(input) {
  const graph = graphAdjacency(false);
  const start = input.start;
  const visited = [];
  const stack = [start];
  // For every number in the stack: the node it was pushed from (-1 = start).
  // Only used to draw the edges that were really walked.
  const pushedFrom = [-1];
  const finished = [];
  const usedEdges = [];
  const steps = [];

  function addStep(lines, current, edge, text, vars) {
    vars.stack = graphListText(stack);
    vars.visited = graphListText(visited);
    steps.push({
      bars: [],
      highlight: [],
      swapped: false,
      sorted: [],
      lines: lines,
      vars: vars,
      compares: 0,
      swaps: 0,
      text: text,
      graph: {
        current: current,
        done: finished.slice(),
        frontier: dfsWaitingNodes(stack, visited),
        edge: edge,
        treeEdges: usedEdges.slice(),
        showWeights: false,
        dist: null,
        result: null,
      },
      side: { kind: "stack", title: "Стек (stack)", items: stack.slice() },
    });
  }

  addStep([2, 3], -1, null, "Започваме от връх " + start + ". Слагаме го в стека.", {});

  while (stack.length > 0) {
    const node = stack.pop();
    const parent = pushedFrom.pop();
    addStep([4, 5], node, null, "Взимаме върха на стека: връх " + node + ".", { node: node });

    if (visited.includes(node)) {
      addStep([6], -1, null, "Връх " + node + " вече е посетен, пропускаме го.", { node: node });
      continue;
    }

    visited.push(node);
    if (parent !== -1) {
      usedEdges.push([parent, node]);
    }
    addStep([6, 7], node, null, "Връх " + node + " още не е посетен. Посещаваме го.", { node: node });

    for (const next of graph[node]) {
      const vars = { node: node, next: next };
      if (visited.includes(next)) {
        addStep([8, 9], node, [node, next],
          "Съсед " + next + ": вече е посетен, не го слагаме в стека.", vars);
        continue;
      }
      stack.push(next);
      pushedFrom.push(node);
      addStep([8, 9, 10], node, [node, next],
        "Съсед " + next + ": още не е посетен, слагаме го на върха на стека.", vars);
    }

    finished.push(node);
    addStep([4], -1, null, "Съседите на " + node + " свършиха. Връщаме се към стека.", { node: node });
  }

  addStep([15], -1, null,
    "Готово! Стекът е празен. Обходихме всички " + visited.length + " върха в ред: " + visited.join(", ") + ".", {});
  steps[steps.length - 1].graph.result = visited.slice();
  return steps;
}
