# 🧩 Maze Solver React App

A dynamic and interactive web application that lets you **draw mazes** and visually **solve them** using fundamental pathfinding algorithms like **Breadth-First Search (BFS)** and **Backtracking**. Built with **React**, **Tailwind CSS**, and **HTML5 Canvas**.

---

## 🚀 Features

- 🎨 **Custom Maze Drawing**  
  Draw walls, start points, and end points directly on the canvas.

- 🔄 **Maze Editing Tools**  
  Tools for walls, erase, start and end markers with one-click switching.

- ⚙️ **Algorithm Selection**  
  Choose between BFS or Backtracking algorithms to visualize pathfinding.

- 🎲 **Auto Maze Generator**  
  Instantly populate the grid with random walls to simulate complex mazes.

- 🧮 **Step & Time Tracking**  
  Displays number of steps and time taken to solve the maze.

- 🌈 **Modern UI**  
  Built with Tailwind CSS for responsive, mobile-friendly design.

---


## 📦 Installation

```bash
# Clone the repo
https://github.com/sameerthapax/maze-solver.git
cd Maze-solver

# Install dependencies
npm install

# Run the app
npm run dev
```

---

## 🧑‍💻 Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 📁 Project Structure

```
maze-solver-react/
├── public/
│   └── maze.png
├── src/
│   ├── components/
│   │   ├── MazeSolver.jsx
│   ├── algorithms/
│   │   ├── bfs.js
│   │   └── backtracking.js
│   └── main.jsx
├── index.html
└── package.json
```

---

## 📌 How It Works

1. Select a mode: Wall, Start, End, or Erase.
2. Click on the grid to add blocks.
3. Choose BFS or Backtracking from the dropdown.
4. Click **Solve** to start the animation.
5. Use **Reset** to clear the board or **Reset Maze** to only remove path visuals.
6. Use **Generate Maze** for random walls.

---

## 📈 Future Improvements

- 🧠 Add more algorithms like A* and Dijkstra
- 💾 Save/load maze state to localStorage
- 📱 Mobile gesture support
- 🌙 Dark mode toggle

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Vite](https://vitejs.dev/)
- [React Docs](https://react.dev/learn)

---

### 🔗 Let's Connect
Made with ❤️ by [Sameer Thapa](https://github.com/sameerthapax)

