const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const speedSlider = document.getElementById('speedSlider');

// Grid settings
const GRID_SIZE = 100; // change for larger or smaller grid
let CELL_SIZE; 
let grid;
let running = false;
let lastUpdate = 0;

// Set canvas size based on window
function resizeCanvas() {
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.7;
    CELL_SIZE = Math.floor(Math.min(maxWidth, maxHeight) / GRID_SIZE);
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;
    grid = new Array(GRID_SIZE).fill().map(() => new Array(GRID_SIZE).fill(0));
    drawGrid();
}

// Draw the grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            ctx.fillStyle = grid[i][j] ? 'black' : 'white';
            ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
    }
}

// Count live neighbors for a cell
function countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                count += grid[newX][newY];
            }
        }
    }
    return count;
}

// Compute next generation
function nextGeneration() {
    const newGrid = grid.map(row => [...row]);
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const neighbors = countNeighbors(i, j);
            if (grid[i][j] === 1) {
                newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
                newGrid[i][j] = (neighbors === 3) ? 1 : 0;
            }
        }
    }
    grid = newGrid;
}

// Animation loop with speed control
function update(timestamp) {
    if (!running) return;
    const delay = 550 - parseInt(speedSlider.value)
    if (timestamp - lastUpdate >= delay) {
        nextGeneration();
        drawGrid();
        lastUpdate = timestamp;
    }
    requestAnimationFrame(update);
}

// Start simulation
function startSimulation() {
    if (!running) {
        running = true;
        lastUpdate = performance.now();
        requestAnimationFrame(update);
    }
}

// Stop simulation
function stopSimulation() {
    running = false;
}

// Clear grid
function clearGrid() {
    stopSimulation();
    grid = new Array(GRID_SIZE).fill().map(() => new Array(GRID_SIZE).fill(0));
    drawGrid();
}

// Randomize grid with a given density (0 to 1)
function randomizeGrid() {
    stopSimulation();
    const DENSITY = 0.3; // density control (0.1 slow, 0.5 chaotic)
    grid = grid.map(row => row.map(() => Math.random() < DENSITY ? 1 : 0));
    drawGrid();
}

// Mouse click to toggle cells
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    const y = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        grid[x][y] = grid[x][y] ? 0 : 1;
        drawGrid();
    }
});

// Resize canvas on window resize
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();