// Dijkstra's shortest path lesson, drawn by js/views/graph-view.js.
// The graph and its weights are in js/data/graph-data.js. Steps point at
// lines (1-based) of `code`, so keep them in sync.

const dijkstraLesson = {
  id: "dijkstra",
  title: "Най-кратък път (Dijkstra)",
  intro:
    "Търсим най-краткия път от един връх до всички останали, когато пътищата имат дължина. " +
    "Всеки път избираме необработения връх с най-малко разстояние: до него по-къс път вече няма. " +
    "После проверяваме дали през него някой съсед не става по-близо.",
  code: [
    "function dijkstra(graph, start) {",
    "  const dist = new Array(graph.length).fill(Infinity);",
    "  const done = new Array(graph.length).fill(false);",
    "  dist[start] = 0;",
    "  for (let round = 0; round < graph.length; round++) {",
    "    let node = -1;",
    "    for (let i = 0; i < graph.length; i++) {",
    "      if (!done[i] && (node === -1 || dist[i] < dist[node])) {",
    "        node = i;",
    "      }",
    "    }",
    "    done[node] = true;",
    "    for (const edge of graph[node]) {",
    "      const next = edge[0];",
    "      const weight = edge[1];",
    "      if (dist[node] + weight < dist[next]) {",
    "        dist[next] = dist[node] + weight;",
    "      }",
    "    }",
    "  }",
    "  return dist;",
    "}",
  ],
  otherLanguages: {
    c: {
      code: [
        "void dijkstra(int graph[][7][2], int degree[], int n, int start) {",
        "  int dist[7];",
        "  int done[7];",
        "  for (int i = 0; i < n; i++) {",
        "    dist[i] = INT_MAX;",
        "    done[i] = 0;",
        "  }",
        "  dist[start] = 0;",
        "  for (int round = 0; round < n; round++) {",
        "    int node = -1;",
        "    for (int i = 0; i < n; i++) {",
        "      if (!done[i] && (node == -1 || dist[i] < dist[node])) {",
        "        node = i;",
        "      }",
        "    }",
        "    done[node] = 1;",
        "    for (int k = 0; k < degree[node]; k++) {",
        "      int next = graph[node][k][0];",
        "      int weight = graph[node][k][1];",
        "      if (dist[node] + weight < dist[next]) {",
        "        dist[next] = dist[node] + weight;",
        "      }",
        "    }",
        "  }",
        "}",
      ],
      lineMap: {
        2: [2, 4, 5],
        3: [3, 6],
        4: [8],
        5: [9],
        6: [10],
        7: [11],
        8: [12],
        9: [13],
        12: [16],
        13: [17],
        14: [18],
        15: [19],
        16: [20],
        17: [21],
        21: [25],
      },
    },
    cpp: {
      code: [
        "vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int start) {",
        "  vector<int> dist(graph.size(), INT_MAX);",
        "  vector<bool> done(graph.size(), false);",
        "  dist[start] = 0;",
        "  for (int round = 0; round < (int)graph.size(); round++) {",
        "    int node = -1;",
        "    for (int i = 0; i < (int)graph.size(); i++) {",
        "      if (!done[i] && (node == -1 || dist[i] < dist[node])) {",
        "        node = i;",
        "      }",
        "    }",
        "    done[node] = true;",
        "    for (pair<int, int> edge : graph[node]) {",
        "      int next = edge.first;",
        "      int weight = edge.second;",
        "      if (dist[node] + weight < dist[next]) {",
        "        dist[next] = dist[node] + weight;",
        "      }",
        "    }",
        "  }",
        "  return dist;",
        "}",
      ],
    },
    csharp: {
      code: [
        "static int[] dijkstra(List<List<int[]>> graph, int start) {",
        "  int[] dist = new int[graph.Count];",
        "  bool[] done = new bool[graph.Count];",
        "  Array.Fill(dist, int.MaxValue);",
        "  dist[start] = 0;",
        "  for (int round = 0; round < graph.Count; round++) {",
        "    int node = -1;",
        "    for (int i = 0; i < graph.Count; i++) {",
        "      if (!done[i] && (node == -1 || dist[i] < dist[node])) {",
        "        node = i;",
        "      }",
        "    }",
        "    done[node] = true;",
        "    foreach (int[] edge in graph[node]) {",
        "      int next = edge[0];",
        "      int weight = edge[1];",
        "      if (dist[node] + weight < dist[next]) {",
        "        dist[next] = dist[node] + weight;",
        "      }",
        "    }",
        "  }",
        "  return dist;",
        "}",
      ],
      lineMap: {
        2: [2, 4],
        3: [3],
        4: [5],
        5: [6],
        6: [7],
        7: [8],
        8: [9],
        9: [10],
        12: [13],
        13: [14],
        14: [15],
        15: [16],
        16: [17],
        17: [18],
        21: [22],
      },
    },
    java: {
      code: [
        "static int[] dijkstra(List<List<int[]>> graph, int start) {",
        "  int[] dist = new int[graph.size()];",
        "  boolean[] done = new boolean[graph.size()];",
        "  Arrays.fill(dist, Integer.MAX_VALUE);",
        "  dist[start] = 0;",
        "  for (int round = 0; round < graph.size(); round++) {",
        "    int node = -1;",
        "    for (int i = 0; i < graph.size(); i++) {",
        "      if (!done[i] && (node == -1 || dist[i] < dist[node])) {",
        "        node = i;",
        "      }",
        "    }",
        "    done[node] = true;",
        "    for (int[] edge : graph.get(node)) {",
        "      int next = edge[0];",
        "      int weight = edge[1];",
        "      if (dist[node] + weight < dist[next]) {",
        "        dist[next] = dist[node] + weight;",
        "      }",
        "    }",
        "  }",
        "  return dist;",
        "}",
      ],
      lineMap: {
        2: [2, 4],
        3: [3],
        4: [5],
        5: [6],
        6: [7],
        7: [8],
        8: [9],
        9: [10],
        12: [13],
        13: [14],
        14: [15],
        15: [16],
        16: [17],
        17: [18],
        21: [22],
      },
    },
    python: {
      code: [
        "def dijkstra(graph, start):",
        "    dist = [float(\"inf\")] * len(graph)",
        "    done = [False] * len(graph)",
        "    dist[start] = 0",
        "    for round in range(len(graph)):",
        "        node = -1",
        "        for i in range(len(graph)):",
        "            if not done[i] and (node == -1 or dist[i] < dist[node]):",
        "                node = i",
        "        done[node] = True",
        "        for edge in graph[node]:",
        "            next = edge[0]",
        "            weight = edge[1]",
        "            if dist[node] + weight < dist[next]:",
        "                dist[next] = dist[node] + weight",
        "    return dist",
      ],
      lineMap: { 12: [10], 13: [11], 14: [12], 15: [13], 16: [14], 17: [15], 21: [16] },
    },
  },
  view: "graph",
  makeInput: makeDijkstraInput,
  buildSteps: buildDijkstraSteps,
};

function makeDijkstraInput() {
  return { start: graphRandomStart() };
}

function buildDijkstraSteps(input) {
  const graph = graphAdjacency(true);
  const start = input.start;
  const nodeCount = graph.length;
  const dist = new Array(nodeCount).fill(Infinity);
  const done = new Array(nodeCount).fill(false);
  // For every node: the node its best path comes from (-1 = none yet).
  const cameFrom = new Array(nodeCount).fill(-1);
  const steps = [];

  function doneNodes() {
    const nodes = [];
    for (let node = 0; node < nodeCount; node++) {
      if (done[node]) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  // Nodes that already have a distance but are not final yet.
  function reachedNodes() {
    const nodes = [];
    for (let node = 0; node < nodeCount; node++) {
      if (!done[node] && dist[node] !== Infinity) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  // The edges of the best paths found to the finished nodes.
  function pathEdges() {
    const edges = [];
    for (let node = 0; node < nodeCount; node++) {
      if (done[node] && cameFrom[node] !== -1) {
        edges.push([cameFrom[node], node]);
      }
    }
    return edges;
  }

  function addStep(lines, current, edge, text, vars) {
    const distanceTexts = dist.map(graphDistanceText);
    vars.dist = graphListText(distanceTexts);
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
        done: doneNodes(),
        frontier: reachedNodes(),
        edge: edge,
        treeEdges: pathEdges(),
        showWeights: true,
        dist: dist.slice(),
        result: null,
      },
      side: { kind: "table", title: "Разстояние от връх " + start, items: distanceTexts },
    });
  }

  dist[start] = 0;
  addStep([2, 3, 4], -1, null,
    "Започваме от връх " + start + ". До него разстоянието е 0, до всички други още не знаем (∞).", {});

  for (let round = 0; round < nodeCount; round++) {
    let node = -1;
    for (let i = 0; i < nodeCount; i++) {
      if (!done[i] && (node === -1 || dist[i] < dist[node])) {
        node = i;
      }
    }
    addStep([7, 8, 9], node, null,
      "Избираме необработения връх с най-малко разстояние: връх " + node + " (" + dist[node] + ").", { node: node });

    done[node] = true;
    addStep([12], node, null,
      "Връх " + node + " е готов: най-краткият път до него е " + dist[node] + ".", { node: node });

    for (const edge of graph[node]) {
      const next = edge[0];
      const weight = edge[1];
      const newDistance = dist[node] + weight;
      const vars = { node: node, next: next, weight: weight };
      const sum = dist[node] + " + " + weight + " = " + newDistance;

      if (newDistance < dist[next]) {
        addStep([13, 14, 15, 16], node, [node, next],
          "През " + node + " до " + next + ": " + sum + ". Това е по-малко от " +
          graphDistanceText(dist[next]) + ", значи е по-къс път.", vars);
        dist[next] = newDistance;
        cameFrom[next] = node;
        addStep([17], node, [node, next],
          "Записваме: разстоянието до " + next + " вече е " + newDistance + ".", vars);
      } else {
        addStep([13, 14, 15, 16], node, [node, next],
          "През " + node + " до " + next + ": " + sum + ". Не е по-малко от " +
          graphDistanceText(dist[next]) + ", оставаме с досегашния път.", vars);
      }
    }
  }

  addStep([21], -1, null,
    "Готово! Най-краткото разстояние от връх " + start + " до върховете 0..6 е: " + dist.join(", ") + ".", {});
  steps[steps.length - 1].graph.result = dist.slice();
  return steps;
}
