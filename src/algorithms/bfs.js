export default async function solveMazeBFS(grid, setGrid, start, end, setSteps, setTime, delay) {
    const ROWS = grid.length;
    const COLS = grid[0].length;
    const queue = [start];
    const visited = new Set();
    const parent = new Map();
    const t0 = performance.now();

    const toKey = ([y, x]) => `${y},${x}`;
    let count = 0;

    while (queue.length) {
        const [y, x] = queue.shift();
        if (y === end[0] && x === end[1]) break;
        for (const [dy, dx] of [[0,1],[1,0],[0,-1],[-1,0]]) {
            const [ny, nx] = [y + dy, x + dx];
            if (ny >= 0 && nx >= 0 && ny < ROWS && nx < COLS && grid[ny][nx] !== 1 && !visited.has(toKey([ny, nx]))) {
                visited.add(toKey([ny, nx]));
                parent.set(toKey([ny, nx]), [y, x]);
                queue.push([ny, nx]);
                count++;
                const newGrid = [...grid];
                newGrid[ny][nx] = 4; // visited
                setGrid([...newGrid]);
                await delay(15);
            }
        }
    }

    let curr = end;
    while (curr && toKey(curr) !== toKey(start)) {
        const [y, x] = curr;
        grid[y][x] = 5;
        curr = parent.get(toKey(curr));
    }
    const t1 = performance.now();
    setSteps(count);
    setTime(((t1 - t0) / 1000).toFixed(2));
    setGrid([...grid]);
}
