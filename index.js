const board = document.getElementById('board');                // Get the game board element
const cells = document.querySelectorAll('.cell');              // Get all the individual cell elements
const statusMessage = document.getElementById('status');       // Get the status message element
const resetGameBtn = document.getElementById('reset-game');    // Get the 'New Game' button element
const resetScoresBtn = document.getElementById('reset-scores'); // Get the 'Reset Scores' button element
const scoreX = document.getElementById('score-x');             // Get the element displaying Player X's score
const scoreO = document.getElementById('score-o');             // Get the element displaying Player O's score
const scoreDraw = document.getElementById('score-draw');       // Get the element displaying Draw score

// Variables to manage the state of the game
let currentPlayer = 'X';                                       // Set the current player to 'X'
let gameState = ['', '', '', '', '', '', '', '', ''];          // Initialize an empty game board
let gameActive = true;                                         // Boolean to keep track if the game is active
let scores = { X: 0, O: 0, Draw: 0 };                          // Object to store the scores of X, O, and Draws

// Array of winning conditions for the game
const winningConditions = [
    [0, 1, 2],  // Top row
    [3, 4, 5],  // Middle row
    [6, 7, 8],  // Bottom row
    [0, 3, 6],  // Left column
    [1, 4, 7],  // Middle column
    [2, 5, 8],  // Right column
    [0, 4, 8],  // Diagonal from top-left to bottom-right
    [2, 4, 6]   // Diagonal from top-right to bottom-left
];

// Function to handle clicking on a cell
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;               // Get the clicked cell element
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index')); // Get the index of the clicked cell

    // If the cell is already occupied or the game is over, do nothing
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update the game state and the UI to reflect the player's move
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;                   // Display 'X' or 'O' in the cell
    clickedCell.classList.add(currentPlayer);                  // Add 'X' or 'O' class to apply relevant styling

    // Check if the current move results in a win, a draw, or if the game continues
    checkResult();
}

// Function to check the result after each move
function checkResult() {
    let roundWon = false;                                      // Variable to track if the round has been won
    let winningCombination;                                    // To store the winning combination (if any)

    // Loop through each winning condition and check if the current board matches any
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];                // Get the three indexes of a possible winning combination
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;                                   // If a winning combination is found, set roundWon to true
            winningCombination = [a, b, c];                    // Store the winning combination
            break;
        }
    }

    // If the round is won, update the status and the scorecard
    if (roundWon) {
        statusMessage.textContent = `Player ${currentPlayer} wins!`;  // Display winning message
        gameActive = false;                                           // Set gameActive to false as the game is over
        scores[currentPlayer]++;                                      // Increment the winner's score
        updateScorecard();                                            // Update the scorecard UI
        highlightWinner(winningCombination);                          // Highlight the winning cells
        return;
    }

    // If all cells are filled but there's no winner, it's a draw
    if (!gameState.includes('')) {
        statusMessage.textContent = "It's a draw!";  // Update status message to indicate a draw
        gameActive = false;                          // Set gameActive to false as the game is over
        scores.Draw++;                               // Increment the draw score
        updateScorecard();                           // Update the scorecard UI
        return;
    }

    // If the game is still active, switch turns to the other player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';   // Toggle between Player 'X' and 'O'
    statusMessage.textContent = `Player ${currentPlayer}'s turn`; // Update the status message for the next player
}

// Function to reset the game board for a new round
function resetGame() {
    currentPlayer = 'X';                                  // Set the current player to 'X' for the new game
    gameState = ['', '', '', '', '', '', '', '', ''];     // Reset the game state to an empty board
    gameActive = true;                                    // Set gameActive to true to start a new game
    statusMessage.textContent = "Player X's turn";        // Update the status message for the new game
    cells.forEach(cell => {                               // Loop through each cell and reset its content and styles
        cell.textContent = '';
        cell.classList.remove('X', 'O', 'winner');        // Remove any 'X', 'O', or 'winner' classes from the cells
    });
}

// Function to reset the scores for both players and draws
function resetScores() {
    scores = { X: 0, O: 0, Draw: 0 };                    // Reset the score values to 0
    updateScorecard();                                   // Update the scorecard UI to reflect the reset scores
}

// Function to update the scorecard with the current scores
function updateScorecard() {
    scoreX.textContent = scores.X;                       // Update Player X's score
    scoreO.textContent = scores.O;                       // Update Player O's score
    scoreDraw.textContent = scores.Draw;                 // Update the Draw score
}

// Function to highlight the winning cells
function highlightWinner(combination) {
    combination.forEach(index => {
        cells[index].classList.add('winner');            // Add the 'winner' class to each cell in the winning combination
    });
}

// Attach event listeners to each cell to handle clicks
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Attach event listeners to the buttons for resetting the game and scores
resetGameBtn.addEventListener('click', resetGame);
resetScoresBtn.addEventListener('click', resetScores);

// Initialize the game on page load
resetGame();  // Reset the game to start a fresh round
updateScorecard();  // Ensure the scorecard is up to date when the page loads
