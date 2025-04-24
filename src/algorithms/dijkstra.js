export default async function solveMazeDijkstra(grid, setGrid, start, end, setSteps, setTime, delay) {
  const ROWS = grid.length;
  const COLS = grid[0].length;
  const toKey = ([y, x]) => `${y},${x}`;

  const openSet = [start];
  const dist = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const parent = new Map();
  let count = 0;
  const t0 = performance.now();

  dist[start[0]][start[1]] = 0;

  while (openSet.length) {
    // Find node with lowest distance
    let currIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      const [cy, cx] = openSet[i];
      const [by, bx] = openSet[currIdx];
      if (dist[cy][cx] < dist[by][bx]) currIdx = i;
    }
    const [y, x] = openSet.splice(currIdx, 1)[0];

    if (y === end[0] && x === end[1]) break;

    for (const [dy, dx] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const [ny, nx] = [y + dy, x + dx];
      if (ny >= 0 && nx >= 0 && ny < ROWS && nx < COLS && grid[ny][nx] !== 1) {
        const alt = dist[y][x] + 1;
        if (alt < dist[ny][nx]) {
          parent.set(toKey([ny, nx]), [y, x]);
          dist[ny][nx] = alt;
          if (!openSet.some(([oy, ox]) => oy === ny && ox === nx)) {
            openSet.push([ny, nx]);
          }
          count++;
          if (grid[ny][nx] !== 3 && grid[ny][nx] !== 2) {
            grid[ny][nx] = 4; // Visited node
            setGrid([...grid]);
            await delay(10);
          }
        }
      }
    }
  }

  // Trace back path
  let curr = end;
  while (curr && toKey(curr) !== toKey(start)) {
    const [y, x] = curr;
    if (grid[y][x] !== 3 && grid[y][x] !== 2) grid[y][x] = 5;
    curr = parent.get(toKey(curr));
  }
  const t1 = performance.now();
  setSteps(count);
  setTime(((t1 - t0) / 1000).toFixed(2));
  setGrid([...grid]);
}