export default async function solveMazeBacktracking(grid, setGrid, start, end, setSteps, setTime, delay) {
    const ROWS = grid.length;
    const COLS = grid[0].length;
    const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const path = [];
    let count = 0;
    const t0 = performance.now();

    async function dfs(y, x) {
        if (y < 0 || x < 0 || y >= ROWS || x >= COLS || grid[y][x] === 1 || visited[y][x]) return false;
        visited[y][x] = true;
        count++;
        if (grid[y][x] !== 2 && grid[y][x] !== 3) {
            grid[y][x] = 4;
            setGrid([...grid]);
            await delay(15);
        }
        if (y === end[0] && x === end[1]) return true;

        for (const [dy, dx] of [[0,1],[1,0],[0,-1],[-1,0]]) {
            if (await dfs(y + dy, x + dx)) {
                path.push([y, x]);
                return true;
            }
        }
        return false;
    }

    await dfs(start[0], start[1]);
    path.forEach(([y, x]) => grid[y][x] = 5);
    const t1 = performance.now();
    setSteps(count);
    setTime(((t1 - t0) / 1000).toFixed(2));
    setGrid([...grid]);
}
