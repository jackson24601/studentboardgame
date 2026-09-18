// Game State
const gameState = {
    numTeams: 2,
    teams: [],
    currentTeamIndex: 0,
    boardSize: 100,
    gameStarted: false,
    isRolling: false,
    positions: {}, // team -> position mapping
};

// Snakes (shoots) - these move you DOWN
const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78
};

// Ladders - these move you UP
const ladders = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
};

// Team configurations
const teamColors = ['team1', 'team2', 'team3', 'team4'];
const teamNames = ['Red Team', 'Blue Team', 'Yellow Team', 'Green Team'];

// DOM Elements
const setupSection = document.getElementById('setup-section');
const gameSection = document.getElementById('game-section');
const winnerSection = document.getElementById('winner-section');
const teamCountSelect = document.getElementById('team-count');
const startGameBtn = document.getElementById('start-game');
const rollDiceBtn = document.getElementById('roll-dice');
const resetGameBtn = document.getElementById('reset-game');
const playAgainBtn = document.getElementById('play-again');
const gameBoard = document.getElementById('game-board');
const currentTeamDisplay = document.getElementById('current-team-display');
const turnOrderDisplay = document.getElementById('turn-order-display');
const die1 = document.getElementById('die1');
const die2 = document.getElementById('die2');
const diceResult = document.getElementById('dice-result');
const winnerDisplay = document.getElementById('winner-display');

// Initialize the game
function initGame() {
    startGameBtn.addEventListener('click', startGame);
    rollDiceBtn.addEventListener('click', rollDice);
    resetGameBtn.addEventListener('click', resetToSetup);
    playAgainBtn.addEventListener('click', resetToSetup);
}

// Start a new game
function startGame() {
    gameState.numTeams = parseInt(teamCountSelect.value);
    gameState.teams = [];
    gameState.positions = {};
    gameState.gameStarted = true;
    
    // Create teams
    for (let i = 0; i < gameState.numTeams; i++) {
        gameState.teams.push({
            id: i,
            name: teamNames[i],
            color: teamColors[i],
            position: 0
        });
        gameState.positions[i] = 0;
    }
    
    // Randomize turn order
    shuffleArray(gameState.teams);
    gameState.currentTeamIndex = 0;
    
    // Setup UI
    setupSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    winnerSection.classList.add('hidden');
    
    createBoard();
    createSnakesAndLadders();
    updateTurnDisplay();
    renderPieces();
}

// Create visual snakes and ladders
function createSnakesAndLadders() {
    // Create ladders
    Object.entries(ladders).forEach(([start, end]) => {
        createLadder(parseInt(start), parseInt(end));
    });
    
    // Create snakes
    Object.entries(snakes).forEach(([start, end]) => {
        createSnake(parseInt(start), parseInt(end));
    });
}

// Create a visual ladder
function createLadder(start, end) {
    const startSquare = document.querySelector(`[data-position="${start}"]`);
    const endSquare = document.querySelector(`[data-position="${end}"]`);
    
    if (!startSquare || !endSquare) return;
    
    const ladder = document.createElement('div');
    ladder.className = 'ladder-connector';
    
    const startRect = startSquare.getBoundingClientRect();
    const endRect = endSquare.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    
    const startX = startRect.left - boardRect.left + startRect.width / 2;
    const startY = startRect.top - boardRect.top + startRect.height / 2;
    const endX = endRect.left - boardRect.left + endRect.width / 2;
    const endY = endRect.top - boardRect.top + endRect.height / 2;
    
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    
    ladder.style.width = `${length}px`;
    ladder.style.left = `${startX}px`;
    ladder.style.top = `${startY}px`;
    ladder.style.transform = `rotate(${angle}deg)`;
    ladder.style.transformOrigin = '0 0';
    
    gameBoard.appendChild(ladder);
}

// Create a visual snake
function createSnake(start, end) {
    const startSquare = document.querySelector(`[data-position="${start}"]`);
    const endSquare = document.querySelector(`[data-position="${end}"]`);
    
    if (!startSquare || !endSquare) return;
    
    const snake = document.createElement('div');
    snake.className = 'snake-connector';
    
    const startRect = startSquare.getBoundingClientRect();
    const endRect = endSquare.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    
    const startX = startRect.left - boardRect.left + startRect.width / 2;
    const startY = startRect.top - boardRect.top + startRect.height / 2;
    const endX = endRect.left - boardRect.left + endRect.width / 2;
    const endY = endRect.top - boardRect.top + endRect.height / 2;
    
    // Create curved path for snake
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.overflow = 'visible';
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Create a curved path
    const controlX1 = startX + (endX - startX) * 0.25;
    const controlY1 = startY - 40;
    const controlX2 = startX + (endX - startX) * 0.75;
    const controlY2 = endY - 40;
    
    const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#ff6b6b');
    path.setAttribute('stroke-width', '8');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
    
    svg.appendChild(path);
    gameBoard.appendChild(svg);
}

// Shuffle array for random turn order
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create the game board
function createBoard() {
    gameBoard.innerHTML = '';
    
    // Create squares from 100 to 1 (top to bottom, alternating left-right)
    for (let row = 9; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            let squareNum;
            
            // Alternate direction for each row (snake pattern)
            if (row % 2 === 0) {
                // Even rows go left to right
                squareNum = (9 - row) * 10 + col + 1;
            } else {
                // Odd rows go right to left
                squareNum = (9 - row) * 10 + (9 - col) + 1;
            }
            
            const square = document.createElement('div');
            square.className = 'square';
            square.dataset.position = squareNum;
            
            // Add square number
            const squareNumber = document.createElement('span');
            squareNumber.className = 'square-number';
            squareNumber.textContent = squareNum;
            square.appendChild(squareNumber);
            
            // Mark special squares
            if (squareNum === 1) {
                square.classList.add('start');
                const icon = document.createElement('div');
                icon.className = 'square-icon';
                icon.textContent = '🏁';
                square.appendChild(icon);
            } else if (squareNum === 100) {
                square.classList.add('finish');
                const icon = document.createElement('div');
                icon.className = 'square-icon';
                icon.textContent = '🏆';
                square.appendChild(icon);
            } else if (snakes[squareNum]) {
                square.classList.add('snake');
            } else if (ladders[squareNum]) {
                square.classList.add('ladder');
            }
            
            // Add container for pieces
            const piecesContainer = document.createElement('div');
            piecesContainer.className = 'pieces';
            square.appendChild(piecesContainer);
            
            gameBoard.appendChild(square);
        }
    }
}

// Update turn display
function updateTurnDisplay() {
    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    currentTeamDisplay.textContent = currentTeam.name;
    currentTeamDisplay.className = currentTeam.color;
    
    // Update turn order display
    turnOrderDisplay.innerHTML = '';
    gameState.teams.forEach((team, index) => {
        const badge = document.createElement('span');
        badge.className = `turn-badge ${team.color}`;
        badge.textContent = `${index + 1}. ${team.name}`;
        if (index === gameState.currentTeamIndex) {
            badge.style.border = '3px solid #333';
        }
        turnOrderDisplay.appendChild(badge);
    });
}

// Roll dice
async function rollDice() {
    if (gameState.isRolling) return;
    
    gameState.isRolling = true;
    rollDiceBtn.disabled = true;
    diceResult.textContent = '';
    
    // Animate dice rolling
    die1.classList.add('rolling');
    die2.classList.add('rolling');
    
    // Show random numbers while rolling
    const rollDuration = 1000;
    const rollInterval = setInterval(() => {
        die1.textContent = Math.floor(Math.random() * 6) + 1;
        die2.textContent = Math.floor(Math.random() * 6) + 1;
    }, 100);
    
    // Wait for roll animation
    await sleep(rollDuration);
    clearInterval(rollInterval);
    
    // Get final dice values
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    die1.textContent = dice1;
    die2.textContent = dice2;
    die1.classList.remove('rolling');
    die2.classList.remove('rolling');
    
    diceResult.textContent = `You rolled: ${dice1} + ${dice2} = ${total}`;
    
    // Wait a moment before moving
    await sleep(500);
    
    // Move the current team
    await moveTeam(gameState.currentTeamIndex, total);
    
    gameState.isRolling = false;
    rollDiceBtn.disabled = false;
}

// Move a team
async function moveTeam(teamIndex, spaces) {
    const team = gameState.teams[teamIndex];
    const currentPos = team.position;
    let newPos = currentPos + spaces;
    
    // Don't go past 100
    if (newPos > 100) {
        newPos = 100;
    }
    
    // Animate movement
    for (let i = currentPos + 1; i <= newPos; i++) {
        team.position = i;
        renderPieces();
        await sleep(200);
    }
    
    // Check for snake or ladder
    let message = '';
    if (snakes[newPos]) {
        message = `Oh no! ${team.name} landed on a snake! 🐍 Sliding down from ${newPos} to ${snakes[newPos]}`;
        await sleep(1000);
        team.position = snakes[newPos];
        renderPieces();
    } else if (ladders[newPos]) {
        message = `Awesome! ${team.name} found a ladder! 🪜 Climbing up from ${newPos} to ${ladders[newPos]}`;
        await sleep(1000);
        team.position = ladders[newPos];
        renderPieces();
    }
    
    if (message) {
        diceResult.textContent = message;
        await sleep(2000);
    }
    
    // Check for winner
    if (team.position >= 100) {
        showWinner(team);
        return;
    }
    
    // Next team's turn
    gameState.currentTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
    updateTurnDisplay();
    diceResult.textContent = '';
}

// Render pieces on the board
function renderPieces() {
    // Clear all pieces
    document.querySelectorAll('.pieces').forEach(container => {
        container.innerHTML = '';
    });
    
    // Place pieces
    gameState.teams.forEach(team => {
        if (team.position >= 0 && team.position <= 100) {
            const square = document.querySelector(`[data-position="${team.position}"]`);
            if (square) {
                const piecesContainer = square.querySelector('.pieces');
                const piece = document.createElement('div');
                piece.className = `piece ${team.color}`;
                piece.title = team.name;
                piecesContainer.appendChild(piece);
            }
        }
    });
}

// Show winner
function showWinner(team) {
    gameSection.classList.add('hidden');
    winnerSection.classList.remove('hidden');
    winnerDisplay.textContent = `${team.name} wins! 🎉`;
    winnerDisplay.className = team.color;
    winnerDisplay.style.padding = '20px';
    winnerDisplay.style.borderRadius = '10px';
    winnerDisplay.style.display = 'inline-block';
}

// Reset to setup
function resetToSetup() {
    gameState.gameStarted = false;
    gameState.currentTeamIndex = 0;
    gameState.teams = [];
    gameState.positions = {};
    gameState.isRolling = false;
    
    setupSection.classList.remove('hidden');
    gameSection.classList.add('hidden');
    winnerSection.classList.add('hidden');
    
    die1.textContent = '?';
    die2.textContent = '?';
    diceResult.textContent = '';
    rollDiceBtn.disabled = false;
}

// Sleep utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame);
