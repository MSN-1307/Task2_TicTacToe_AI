
function getAIMove(board, difficulty) {
  if (difficulty === "easy")   return easyMove(board);
  if (difficulty === "medium") return mediumMove(board);
  if (difficulty === "hard")   return bestMove(board);
}

function easyMove(board) {
  const empty = board
    .map((val, idx) => val === "" ? idx : null)
    .filter(val => val !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function mediumMove(board) {
  if (Math.random() < 0.5) return bestMove(board);
  return easyMove(board);
}

function bestMove(board) {
  let bestScore = -Infinity;
  let move = null;

  board.forEach((cell, idx) => {
    if (cell === "") {
      board[idx] = "O";                           // AI tries this cell
      let score = minimax(board, 0, false, -Infinity, Infinity);
      board[idx] = "";                            // undo move
      if (score > bestScore) {
        bestScore = score;
        move = idx;
      }
    }
  });

  return move;
}

function minimax(board, depth, isMaximizing, alpha, beta) {

  // ── Terminal state checks ──
  if (checkWinner(board, "O")) return 10 - depth;  // AI wins  → positive
  if (checkWinner(board, "X")) return depth - 10;  // Human wins → negative
  if (isDraw(board))           return 0;            // Draw → neutral

  if (isMaximizing) {
    let best = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false, alpha, beta);
        board[i] = "";
        best = Math.max(best, score);
        alpha = Math.max(alpha, best);

        if (beta <= alpha) break;
      }
    }
    return best;

  } else {
    let best = Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true, alpha, beta);
        board[i] = "";
        best = Math.min(best, score);
        beta = Math.min(beta, best);

        if (beta <= alpha) break;
      }
    }
    return best;
  }
}