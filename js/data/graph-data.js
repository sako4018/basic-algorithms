// The small graph used by the BFS, DFS and Dijkstra lessons and by
// js/views/graph-view.js. Keeping it in one place means the picture and
// the lessons always describe the same graph.
// Nodes are numbered 0..6. The graph is undirected; BFS and DFS ignore the
// weights, Dijkstra uses them.

// Where each node is drawn, in a 400 x 260 picture (index = node number).
const GRAPH_NODE_POSITIONS = [
  { x: 45, y: 130 },
  { x: 135, y: 45 },
  { x: 135, y: 215 },
  { x: 255, y: 35 },
  { x: 255, y: 148 },
  { x: 355, y: 75 },
  { x: 355, y: 200 },
];

// Each edge is [node, node, weight].
const GRAPH_EDGES = [
  [0, 1, 1],
  [0, 2, 4],
  [1, 2, 2],
  [1, 3, 6],
  [1, 4, 5],
  [2, 4, 2],
  [2, 6, 9],
  [3, 4, 2],
  [3, 5, 3],
  [4, 5, 4],
  [4, 6, 6],
];

// Adjacency lists, the way the lesson code uses them: graph[node] is the
// list of neighbours (smallest number first). With withWeights each
// neighbour is a pair [neighbour, weight].
function graphAdjacency(withWeights) {
  const graph = [];
  for (let node = 0; node < GRAPH_NODE_POSITIONS.length; node++) {
    graph.push([]);
  }
  for (const edge of GRAPH_EDGES) {
    const from = edge[0];
    const to = edge[1];
    const weight = edge[2];
    graph[from].push(withWeights ? [to, weight] : to);
    graph[to].push(withWeights ? [from, weight] : from);
  }
  for (const neighbours of graph) {
    neighbours.sort(function (a, b) {
      const firstNode = withWeights ? a[0] : a;
      const secondNode = withWeights ? b[0] : b;
      return firstNode - secondNode;
    });
  }
  return graph;
}

// A random start node for makeInput().
function graphRandomStart() {
  return Math.floor(Math.random() * GRAPH_NODE_POSITIONS.length);
}

// [3, 1, 4] -> "[3, 1, 4]" (for the variables table)
function graphListText(list) {
  return "[" + list.join(", ") + "]";
}

// Infinity is written as the symbol; other numbers as they are.
function graphDistanceText(distance) {
  return distance === Infinity ? "∞" : String(distance);
}
