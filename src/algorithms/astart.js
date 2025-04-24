export default async function solveMazeAstar(grid, setGrid, start, end, setSteps, setTime, delay) {
    const ROWS = grid.length;
    const COLS = grid[0].length;

    // Helper to compute heuristic (Manhattan distance)
    const heuristic = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    const toKey = ([y, x]) => `${y},${x}`;

    const openSet = [start];
    const gScore = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
    const fScore = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
    const parent = new Map();
    let count = 0;
    const t0 = performance.now();

    gScore[start[0]][start[1]] = 0;
    fScore[start[0]][start[1]] = heuristic(start, end);

    while (openSet.length) {
        // Find node with lowest fScore
        let currIdx = 0;
        for (let i = 1; i < openSet.length; i++) {
            const [cy, cx] = openSet[i];
            const [by, bx] = openSet[currIdx];
            if (fScore[cy][cx] < fScore[by][bx]) currIdx = i;
        }
        const [y, x] = openSet.splice(currIdx, 1)[0];

        if (y === end[0] && x === end[1]) break;

        for (const [dy, dx] of [[0,1],[1,0],[0,-1],[-1,0]]) {
            const [ny, nx] = [y + dy, x + dx];
            if (ny >= 0 && nx >= 0 && ny < ROWS && nx < COLS && grid[ny][nx] !== 1) {
                const tentative_gScore = gScore[y][x] + 1;
                if (tentative_gScore < gScore[ny][nx]) {
                    parent.set(toKey([ny, nx]), [y, x]);
                    gScore[ny][nx] = tentative_gScore;
                    fScore[ny][nx] = tentative_gScore + heuristic([ny, nx], end);
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
