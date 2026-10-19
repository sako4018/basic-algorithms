// Breadth-first search (BFS) lesson, drawn by js/views/graph-view.js.
// The graph is in js/data/graph-data.js. Steps point at lines (1-based)
// of `code`, so keep them in sync.

const bfsLesson = {
  id: "bfs",
  title: "Обхождане в ширина (BFS)",
  intro:
    "Започваме от един връх и първо посещаваме всичките му съседи, после съседите на съседите " +
    "и така нататък, като кръгове по водата. Помни ни опашка (queue): който е добавен " +
    "първи, той се обработва първи.",
  code: [
    "function bfs(graph, start) {",
    "  const visited = [start];",
    "  const queue = [start];",
    "  while (queue.length > 0) {",
    "    const node = queue.shift();",
    "    for (const next of graph[node]) {",
    "      if (!visited.includes(next)) {",
    "        visited.push(next);",
    "        queue.push(next);",
    "      }",
    "    }",
    "  }",
    "  return visited;",
    "}",
  ],
  otherLanguages: {
    c: {
      code: [
        "void bfs(int graph[][7], int degree[], int start) {",
        "  int visited[7] = {0};",
        "  int queue[7];",
        "  int head = 0, tail = 0;",
        "  visited[start] = 1;",
        "  queue[tail++] = start;",
        "  while (head < tail) {",
        "    int node = queue[head++];",
        "    for (int k = 0; k < degree[node]; k++) {",
        "      int next = graph[node][k];",
        "      if (!visited[next]) {",
        "        visited[next] = 1;",
        "        queue[tail++] = next;",
        "      }",
        "    }",
        "  }",
        "}",
      ],
      lineMap: {
        2: [2, 5],
        3: [3, 4, 6],
        4: [7],
        5: [8],
        6: [9, 10],
        7: [11],
        8: [12],
        9: [13],
        13: [17],
      },
    },
    cpp: {
      code: [
        "vector<int> bfs(vector<vector<int>>& graph, int start) {",
        "  vector<int> visited = {start};",
        "  deque<int> queue = {start};",
        "  while (!queue.empty()) {",
        "    int node = queue.front(); queue.pop_front();",
        "    for (int next : graph[node]) {",
        "      if (find(visited.begin(), visited.end(), next) == visited.end()) {",
        "        visited.push_back(next);",
        "        queue.push_back(next);",
        "      }",
        "    }",
        "  }",
        "  return visited;",
        "}",
      ],
    },
    java: {
      code: [
        "static List<Integer> bfs(List<List<Integer>> graph, int start) {",
        "  List<Integer> visited = new ArrayList<>(List.of(start));",
        "  Deque<Integer> queue = new ArrayDeque<>(List.of(start));",
        "  while (!queue.isEmpty()) {",
        "    int node = queue.poll();",
        "    for (int next : graph.get(node)) {",
        "      if (!visited.contains(next)) {",
        "        visited.add(next);",
        "        queue.add(next);",
        "      }",
        "    }",
        "  }",
        "  return visited;",
        "}",
      ],
    },
    python: {
      code: [
        "def bfs(graph, start):",
        "    visited = [start]",
        "    queue = [start]",
        "    while len(queue) > 0:",
        "        node = queue.pop(0)",
        "        for next in graph[node]:",
        "            if next not in visited:",
        "                visited.append(next)",
        "                queue.append(next)",
        "    return visited",
      ],
      lineMap: { 13: [10] },
    },
  },
  view: "graph",
  makeInput: makeBfsInput,
  buildSteps: buildBfsSteps,
};

function makeBfsInput() {
  return { start: graphRandomStart() };
}

function buildBfsSteps(input) {
  const graph = graphAdjacency(false);
  const start = input.start;
  const visited = [start];
  const queue = [start];
  const finished = [];
  const usedEdges = [];
  const steps = [];

  function addStep(lines, current, edge, text, vars) {
    vars.queue = graphListText(queue);
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
        frontier: queue.slice(),
        edge: edge,
        treeEdges: usedEdges.slice(),
        showWeights: false,
        dist: null,
        result: null,
      },
      side: { kind: "queue", title: "Опашка (queue)", items: queue.slice() },
    });
  }

  addStep([2, 3], -1, null,
    "Започваме от връх " + start + ". Отбелязваме го като посетен и го слагаме в опашката.", {});

  while (queue.length > 0) {
    const node = queue.shift();
    addStep([4, 5], node, null,
      "Взимаме първия от опашката: връх " + node + ". Ще разгледаме съседите му.", { node: node });

    for (const next of graph[node]) {
      const vars = { node: node, next: next };
      if (visited.includes(next)) {
        addStep([6, 7], node, [node, next],
          "Съсед " + next + ": вече е посетен, пропускаме го.", vars);
        continue;
      }
      addStep([6, 7], node, [node, next],
        "Съсед " + next + ": още не е посетен.", vars);
      visited.push(next);
      queue.push(next);
      usedEdges.push([node, next]);
      addStep([8, 9], node, [node, next],
        "Отбелязваме " + next + " като посетен и го слагаме в края на опашката.", vars);
    }

    finished.push(node);
    let endText = "Съседите на " + node + " свършиха, върхът е обработен.";
    if (queue.length === 0) {
      endText += " Опашката е празна.";
    }
    addStep([4], -1, null, endText, { node: node });
  }

  addStep([13], -1, null,
    "Готово! Обходихме всички " + visited.length + " върха в ред: " + visited.join(", ") + ".", {});
  steps[steps.length - 1].graph.result = visited.slice();
  return steps;
}
