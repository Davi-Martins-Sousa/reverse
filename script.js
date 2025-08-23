const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

// 0 = vazio, 1 = preto, 2 = branco
let board = Array(8).fill(null).map(() => Array(8).fill(0));
let currentPlayer = 1; // 1 = preto começa

// posição inicial
board[3][3] = 2;
board[3][4] = 1;
board[4][3] = 1;
board[4][4] = 2;

function drawBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (board[r][c] === 1) {
        const disk = document.createElement("div");
        disk.classList.add("disk", "black");
        cell.appendChild(disk);
      } else if (board[r][c] === 2) {
        const disk = document.createElement("div");
        disk.classList.add("disk", "white");
        cell.appendChild(disk);
      }
      cell.addEventListener("click", handleClick);
      boardEl.appendChild(cell);
    }
  }
  statusEl.textContent = `Vez das ${currentPlayer === 1 ? "pretas" : "brancas"}`;
}

function handleClick(e) {
  const r = parseInt(e.currentTarget.dataset.row);
  const c = parseInt(e.currentTarget.dataset.col);
  if (board[r][c] !== 0) return;

  if (makeMove(r, c, currentPlayer)) {
    currentPlayer = 3 - currentPlayer; // alterna entre 1 e 2
    drawBoard();
  }
}

// Direções possíveis (8)
const directions = [
  [0,1],[1,0],[-1,0],[0,-1],
  [1,1],[1,-1],[-1,1],[-1,-1]
];

function makeMove(r, c, player) {
  let valid = false;
  for (let [dr, dc] of directions) {
    let rr = r + dr, cc = c + dc, captured = [];
    while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && board[rr][cc] === 3 - player) {
      captured.push([rr, cc]);
      rr += dr; cc += dc;
    }
    if (captured.length > 0 && rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && board[rr][cc] === player) {
      valid = true;
      board[r][c] = player;
      for (let [cr, cc] of captured) board[cr][cc] = player;
    }
  }
  return valid;
}

drawBoard();
