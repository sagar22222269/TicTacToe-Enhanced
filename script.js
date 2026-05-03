// Game state variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = {
    x: 0,
    o: 0,
    draws: 0
};
let gameMode = 'multiplayer'; // 'multiplayer' or 'single'

// DOM elements
let cells, currentPlayerDisplay, restartButton, resetScoresButton, modeToggle;
let winnerText, winMessage, scoreX, scoreO, drawsElement;
let moveSound, winSound, drawSound;

// Winning combinations
const winPatterns = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // left diagonal
    [2, 4, 6]  // right diagonal
];

// Initialize DOM elements when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    cells = document.querySelectorAll('.cell');
    currentPlayerDisplay = document.getElementById('current-player');
    restartButton = document.getElementById('restart-btn');
    resetScoresButton = document.getElementById('reset-scores-btn');
    modeToggle = document.getElementById('mode-toggle');
    winnerText = document.getElementById('winner-text');
    winMessage = document.getElementById('win-message');
    scoreX = document.getElementById('score-x');
    scoreO = document.getElementById('score-o');
    drawsElement = document.getElementById('draws');

    // Audio elements
    moveSound = document.getElementById('move-sound');
    winSound = document.getElementById('win-sound');
    drawSound = document.getElementById('draw-sound');

    // Add event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
    resetScoresButton.addEventListener('click', resetScores);
    modeToggle.addEventListener('click', toggleMode);

    // Initialize game
    loadScores();
    updateScoreDisplay();
    currentPlayerDisplay.textContent = currentPlayer;
});

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.id);

    // Check if it's player O's turn in single player mode
    if (gameMode === 'single' && currentPlayer === 'O' && gameActive) return;

    // Check if cell is already taken or game is not active
    if (gameBoard[index] !== '' || !gameActive) return;

    // Update game board and UI
    gameBoard[index] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    // Check for win or draw
    if (checkWin()) {
        playSound(winSound);
        winnerText.textContent = gameMode === 'single' ?
            (currentPlayer === 'X' ? 'You Win!' : 'Computer Wins!') :
            `Player ${currentPlayer} Wins!`;
        winMessage.style.display = 'block';
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        playSound(drawSound);
        winnerText.textContent = 'Game ended in a draw!';
        winMessage.style.display = 'block';
        gameActive = false;
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = currentPlayer;

    // If single player mode and it's computer's turn
    if (gameMode === 'single' && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500); // Small delay for better UX
    }
}

// Check for win
function checkWin() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            // Highlight winning cells
            document.getElementById(a.toString()).classList.add('winning-cell');
            document.getElementById(b.toString()).classList.add('winning-cell');
            document.getElementById(c.toString()).classList.add('winning-cell');
            return true;
        }
    }
    return false;
}

// Check for draw
function checkDraw() {
    return !gameBoard.includes('');
}

// Computer AI move
function computerMove() {
    if (!gameActive || currentPlayer !== 'O') return;

    let move = getBestMove();
    makeComputerMove(move);
}

// Simple AI for computer opponent
function getBestMove() {
    // Try to win
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            if (checkWinSimple(gameBoard)) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'X';
            if (checkWinSimple(gameBoard)) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }

    // Take center if available
    if (gameBoard[4] === '') return 4;

    // Take a corner if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => gameBoard[index] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available spot
    const availableMoves = [];
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            availableMoves.push(i);
        }
    }

    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    return 0; // Fallback
}

// Make the computer move on the board
function makeComputerMove(position) {
    const cell = document.getElementById(position.toString());
    if (cell) {
        // Simulate a click on the cell
        cell.click();
    }
}

// Check for win (simplified version for computer move)
function checkWinSimple(board) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Restart game
function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    currentPlayerDisplay.textContent = currentPlayer;
    winnerText.textContent = '';
    winMessage.style.display = 'none';

    // Clear board
    cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'winning-cell');
    });

    // Update button text based on mode
    if (gameMode === 'single') {
        modeToggle.textContent = 'Switch to Multiplayer';
    } else {
        modeToggle.textContent = 'Switch to Single Player';
    }
}

// Reset scores
function resetScores() {
    scores = { x: 0, o: 0, draws: 0 };
    saveScores();
    updateScoreDisplay();
}

// Toggle game mode
function toggleMode() {
    gameMode = gameMode === 'multiplayer' ? 'single' : 'multiplayer';
    if (gameMode === 'single') {
        modeToggle.textContent = 'Switch to Multiplayer';
    } else {
        modeToggle.textContent = 'Switch to Single Player';
    }
    restartGame(); // Restart game when toggling modes
}

// Update score display
function updateScoreDisplay() {
    scoreX.textContent = scores.x;
    scoreO.textContent = scores.o;
    drawsElement.textContent = scores.draws;
}

// Save scores to localStorage
function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

// Load scores from localStorage if available
function loadScores() {
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
        updateScoreDisplay();
    }
}

// Play sound effect
function playSound(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Sound play error:", e));
    }
}