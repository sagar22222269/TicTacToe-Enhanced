# Tic Tac Toe Enhanced

A polished browser-based Tic Tac Toe game with both multiplayer and single-player modes.

## Features

- **Multiplayer mode**: Two players can play on the same device.
- **Single-player mode**: Play against a simple computer opponent.
- **Score tracking**: Keeps counts for Player X, Player O, and draws.
- **Persistent scores**: Scores are stored in `localStorage` between sessions.
- **Sound effects**: Audio feedback for moves, wins, and draws.
- **Responsive UI**: Clean board layout with animated cells and win highlights.

## Files

- `index.html` - Main HTML markup for the game.
- `style.css` - Styling for the board, buttons, and game UI.
- `script.js` - Game logic, mode switching, AI moves, score management, and audio playback.
- `move-sound.mp3` - Sound effect for making a move.
- `win-sound.mp3` - Sound effect for winning.
- `draw-sound.mp3` - Sound effect for a draw.

## How to Run

1. Open `index.html` in a web browser.
2. Use the **Switch to Single Player** button to toggle between single-player and multiplayer modes.
3. Click any empty cell to place your mark.
4. Use **Restart Game** to clear the board and start a new round.
5. Use **Reset Scores** to clear all saved score counts.

## Controls

- `mode-toggle` button: Toggle between Single Player and Multiplayer.
- `restart-btn`: Restart the current game while keeping scores.
- `reset-scores-btn`: Clear all saved scores.

## Notes

- In single-player mode, the computer plays as **O**.
- The game automatically detects wins and draws and highlights winning cells.
- If audio does not play, ensure your browser allows sound playback.
