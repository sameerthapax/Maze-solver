
import React, { useRef, useState, useEffect } from 'react';
import './MazeSolver.css';
import solveMazeBFS from '../algorithms/bfs.js';
import solveMazeBacktracking from '../algorithms/backtracking.js';
import solveMazeAstar from '../algorithms/astart.js';
import solveMazeDijkstra from '../algorithms/dijkstra.js';



const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 25;

const MazeSolver = () => {
    const canvasRef = useRef(null);
    const [grid, setGrid] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    const [mode, setMode] = useState('wall');
    const [steps, setSteps] = useState(0);
    const [time, setTime] = useState(0);
    const [algorithm, setAlgorithm] = useState('bfs');

    useEffect(() => {
        drawMaze();
    }, [grid]);

    const drawMaze = () => {
        const ctx = canvasRef.current.getContext('2d');
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                // Set neon colors and glow
                if (grid[i][j] === 1) { // Wall
                    ctx.fillStyle = '#ff00cc';
                    ctx.shadowColor = '#ff00cc';
                    ctx.shadowBlur = 14;
                } else if (grid[i][j] === 2) { // Start
                    ctx.fillStyle = '#39ff14';
                    ctx.shadowColor = '#39ff14';
                    ctx.shadowBlur = 18;
                } else if (grid[i][j] === 3) { // End
                    ctx.fillStyle = '#00f6ff';
                    ctx.shadowColor = '#00f6ff';
                    ctx.shadowBlur = 18;
                } else if (grid[i][j] === 4) { // Path
                    ctx.fillStyle = '#ffff33';
                    ctx.shadowColor = '#ffff33';
                    ctx.shadowBlur = 12;
                } else if (grid[i][j] === 5) { // Visited
                    ctx.fillStyle = '#bc13fe';
                    ctx.shadowColor = '#bc13fe';
                    ctx.shadowBlur = 10;
                } else {
                    ctx.fillStyle = '#10111a'; // Empty
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                }
                ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = '#222c'; // faint neon grid border
                ctx.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                // Optionally reset shadowBlur for next cell (some browsers require)
                // ctx.shadowBlur = 0;
            }
        }
        ctx.shadowBlur = 0; // Reset shadowBlur after drawing
    };

    const handleClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Get mouse coordinates relative to the page, adjusted for scroll
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Scale the mouse coordinates
        const x = Math.floor((e.clientX - rect.left) * scaleX / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) * scaleY / CELL_SIZE);

        const newGrid = grid.map((row, i) =>
            row.map((cell, j) => {
                if (i === y && j === x) {
                    if (mode === 'wall') return 1;
                    if (mode === 'erase') return 0;
                    if (mode === 'start') {
                        const clearedGrid = grid.map(row => row.map(cell => (cell === 2 ? 0 : cell)));
                        clearedGrid[y][x] = 2;
                        setGrid(clearedGrid);
                        return 2;
                    }
                    if (mode === 'end') {
                        const clearedGrid = grid.map(row => row.map(cell => (cell === 3 ? 0 : cell)));
                        clearedGrid[y][x] = 3;
                        setGrid(clearedGrid);
                        return 3;
                    }
                }
                return cell;
            })
        );

        if (mode === 'wall' || mode === 'erase') {
            setGrid(newGrid);
        }
    };

    const generateRandomMaze = () => {
        const newGrid = Array.from({ length: ROWS }, () =>
            Array.from({ length: COLS }, () => (Math.random() < 0.3 ? 1 : 0))
        );
        setGrid(newGrid);
        setSteps(0);
        setTime(0);
    };

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const findCell = (val) => {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (grid[i][j] === val) return [i, j];
            }
        }
        return null;
    };

    const solveMaze = () => {
        const start = findCell(2);
        const end = findCell(3);
        if (!start || !end) return;
        if (algorithm === 'bfs') {
            solveMazeBFS(grid, setGrid, start, end, setSteps, setTime, delay);
        } else if (algorithm === 'backtracking') {
            solveMazeBacktracking(grid, setGrid, start, end, setSteps, setTime, delay);
        } else if (algorithm === 'astar') {
            solveMazeAstar(grid, setGrid, start, end, setSteps, setTime, delay);
        } else if (algorithm === 'dijkstra') {
            solveMazeDijkstra(grid, setGrid, start, end, setSteps, setTime, delay);
        }
    };

    const resetGrid = () => {
        setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
        setSteps(0);
        setTime(0);
    };

    const resetMaze = () => {
        const newGrid = grid.map(row =>
            row.map(cell => (cell === 4 || cell === 5 ? 0 : cell))
        );
        setGrid(newGrid);
        setSteps(0);
        setTime(0);
    };

    const getButtonClass = (type) =>
        mode === type ? 'mode-button selected' : 'mode-button';

    return (
        <div className="maze-container">
            <h2>🧩 Maze Solver </h2>

            <div className="controls"
                 style={{
                     display: 'flex',
                     flexWrap: 'wrap',
                     gap: '10px',
                     justifyContent: 'center',
                     marginBottom: '20px',
                 }}>
                <button className={getButtonClass('wall')} onClick={() => setMode('wall')}>🟫 Wall</button>
                <button className={getButtonClass('erase')} onClick={() => setMode('erase')}>✖️ Erase</button>
                <button className={getButtonClass('start')} onClick={() => setMode('start')}>🟢 Start</button>
                <button className={getButtonClass('end')} onClick={() => setMode('end')}>🔵 End</button>
                <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                    <option value="bfs">🔍 Breadth-First Search</option>
                    <option value="backtracking">🧭 Backtracking</option>
                    <option value="astar">⭐ A*</option>
                    <option value="dijkstra">📏 Dijkstra</option>
                </select>
                <button onClick={solveMaze}>🚀 Solve</button>
                <button onClick={resetGrid}>🗑️ Reset Grid</button>
                <button onClick={resetMaze}>🔁 Reset Maze</button>
                <button onClick={generateRandomMaze}>🎲 Generate Maze</button>
            </div>

            <canvas
                ref={canvasRef}
                width={COLS * CELL_SIZE}
                height={ROWS * CELL_SIZE}
                onClick={handleClick}
                className="maze-canvas"
            />

            <div className="stats">
                <p>🧮 Steps: <span style={{color:'#fff'}}>{steps}</span></p>
                <p>⏱️ Time Taken: <span style={{color:'#fff'}}>{time}s</span></p>
            </div>
        </div>
    );
};

export default MazeSolver;
