let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let difficulty = "easy";

let scores = { player: 0, ai: 0, draw: 0 };

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6],             
];

const cells      = document.querySelectorAll(".cell");
const statusEl   = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const resetBtn   = document.getElementById("reset-score-btn");
const diffBtns   = document.querySelectorAll(".diff-btn");

function checkWinner(b, player) {
  return winCombos.some(combo => combo.every(i => b[i] === player));
}

function isDraw(b) {
  return b.every(cell => cell !== "");
}

function getWinningCombo(b, player) {
  return winCombos.find(combo => combo.every(i => b[i] === player));
}

function highlightWinner(combo) {
  combo.forEach(i => cells[i].classList.add("winner"));
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

function updateScoreDisplay() {
  document.getElementById("player-score").textContent = scores.player;
  document.getElementById("ai-score").textContent     = scores.ai;
  document.getElementById("draw-score").textContent   = scores.draw;
}

function handleClick(e) {
  const index = e.target.getAttribute("data-index");

  if (board[index] !== "" || !gameActive || currentPlayer !== "X") return;

  makeMove(index, "X");

  if (checkWinner(board, "X")) {
    highlightWinner(getWinningCombo(board, "X"));
    setStatus("🎉 You Win! Congrats!");
    scores.player++;
    updateScoreDisplay();
    gameActive = false;
    return;
  }

  if (isDraw(board)) {
    setStatus("🤝 It's a Draw!");
    scores.draw++;
    updateScoreDisplay();
    gameActive = false;
    return;
  }

  currentPlayer = "O";
  setStatus("🤖 AI is thinking...");

  setTimeout(() => {
    const aiIndex = getAIMove(board, difficulty);
    makeMove(aiIndex, "O");

    if (checkWinner(board, "O")) {
      highlightWinner(getWinningCombo(board, "O"));
      setStatus("🤖 AI Wins! Try again!");
      scores.ai++;
      updateScoreDisplay();
      gameActive = false;
      return;
    }

    if (isDraw(board)) {
      setStatus("🤝 It's a Draw!");
      scores.draw++;
      updateScoreDisplay();
      gameActive = false;
      return;
    }

    currentPlayer = "X";
    setStatus("Your turn! Pick a cell.");
  }, 400);
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase(), "taken");
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.className = "cell";
  });

  setStatus("Your turn! Pick a cell.");
}

function resetScores() {
  scores = { player: 0, ai: 0, draw: 0 };
  updateScoreDisplay();
  restartGame();
}

diffBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    diffBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    difficulty = btn.getAttribute("data-level");
    restartGame();
  });
});

cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);
resetBtn.addEventListener("click", resetScores);