
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
                ctx.fillStyle =
                    grid[i][j] === 1 ? '#2d3436' :
                        grid[i][j] === 2 ? '#00b894' :
                            grid[i][j] === 3 ? '#0984e3' :
                                grid[i][j] === 4 ? '#ffeaa7' :
                                    grid[i][j] === 5 ? '#d63031' : '#f5f6fa';
                ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = '#dfe6e9';
                ctx.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    };

    const handleClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

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
        <div className="maze-container" style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem', color: '#2d3436' }}>🧩 Maze Solver</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <button className={getButtonClass('wall')} onClick={() => setMode('wall')}>🧱 Wall</button>
                <button className={getButtonClass('erase')} onClick={() => setMode('erase')}>🧼 Erase</button>
                <button className={getButtonClass('start')} onClick={() => setMode('start')}>🟢 Start</button>
                <button className={getButtonClass('end')} onClick={() => setMode('end')}>🔵 End</button>
                <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}
                        style={{padding: '8px', borderRadius: '6px', width:'12vw', fontSize:'0.85vw'}}>
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

            <div style={{ overflowX: 'auto' }}>
                <canvas
                    ref={canvasRef}
                    width={COLS * CELL_SIZE}
                    height={ROWS * CELL_SIZE}
                    onClick={handleClick}
                    className="maze-canvas"
                    style={{ maxWidth: '100%', borderRadius: '8px', border: '2px solid #dfe6e9', display: 'block', margin: '0 auto' }}
                />
            </div>

            <div className="stats" style={{ textAlign: 'center', marginTop: '1.5rem', color: '#2d3436', fontSize: '1.1rem' }}>
                <p>🧮 Steps: {steps}</p>
                <p>⏱️ Time Taken: {time}s</p>
            </div>
        </div>
    );
};

export default MazeSolver;
