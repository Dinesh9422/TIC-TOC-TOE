const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const modeSelect = document.getElementById("gameMode");
const turnDisplay = document.getElementById("turnDisplay");

const player2Section = document.getElementById("player2Section");
const nextBtn = document.getElementById("nextBtn");
const startBtn = document.getElementById("startBtn");
const playerXInputEl = document.getElementById("playerX");
const playerOInputEl = document.getElementById("playerO");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameMode = "1p";
let gameOver = false;
let gameStarted = false;

let playerXName = "Player X";
let playerOName = "Computer";

function handleModeChange() {
  gameMode = modeSelect.value;
  if (gameMode === "1p") {
    player2Section.style.display = "none";
    nextBtn.style.display = "none";
    startBtn.style.display = "inline-block";
  } else {
    player2Section.style.display = "none";
    nextBtn.style.display = "inline-block";
    startBtn.style.display = "none";
  }
}

function handleNext() {
  const playerX = playerXInputEl.value.trim();
  if (playerX !== "") {
    player2Section.style.display = "block";
    nextBtn.style.display = "none";
    startBtn.style.display = "inline-block";
  } else {
    alert("Please enter Player 1 name.");
  }
}

function startGame() {
  playerXName = playerXInputEl.value.trim() || "Player X";
  playerOName = gameMode === "1p" ? "Computer" : (playerOInputEl.value.trim() || "Player O");

  gameStarted = true;
  restartGame();
}

function drawBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleClick(index));
    boardElement.appendChild(cellDiv);
  });
  updateTurnDisplay();
}

function handleClick(index) {
  if (!gameStarted || board[index] || gameOver) return;

  board[index] = currentPlayer;
  drawBoard();

  if (checkWinner(currentPlayer)) {
    showWinner(currentPlayer);
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusElement.textContent = "It's a draw!";
    statusElement.style.fontSize = "48px";
    statusElement.style.color = "#888";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (gameMode === "1p" && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
  updateTurnDisplay();
}

function updateTurnDisplay() {
  if (!gameOver) {
    const playerName = currentPlayer === "X" ? playerXName : playerOName;
    turnDisplay.textContent = `🎯 ${playerName}'s Turn (${currentPlayer})`;
  } else {
    turnDisplay.textContent = "";
  }
}

function aiMove() {
  const emptyCells = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = "O";
  drawBoard();

  if (checkWinner("O")) {
    showWinner("O");
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusElement.textContent = "It's a draw!";
    statusElement.style.fontSize = "48px";
    statusElement.style.color = "#888";
    gameOver = true;
    return;
  }
  currentPlayer = "X";
  updateTurnDisplay();
}

function showWinner(p) {
  const winnerName = p === "X" ? playerXName : playerOName;
  statusElement.textContent = `🎉 ${winnerName} wins! 🎉`;
  statusElement.style.fontSize = "48px";
  statusElement.classList.add("celebrate");
  gameOver = true;
}

function checkWinner(p) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return wins.some(comb => comb.every(i => board[i] === p));
}

function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  statusElement.textContent = "";
  statusElement.classList.remove("celebrate");
  statusElement.style.color = "";
  statusElement.style.fontSize = "";
  drawBoard();
}