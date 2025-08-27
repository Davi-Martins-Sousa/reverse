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

// tempos de animação (ms)
const PLACE_TIME = 600;
const FLIP_TIME = 700;

// desenha o tabuleiro
function drawBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (board[r][c] === 1) {
        const piece = document.createElement("div");
        piece.classList.add("black");
        cell.appendChild(piece);
      } else if (board[r][c] === 2) {
        const piece = document.createElement("div");
        piece.classList.add("white");
        cell.appendChild(piece);
      }

      cell.addEventListener("click", handleClick);
      boardEl.appendChild(cell);
    }
  }
  statusEl.textContent = `Vez das ${currentPlayer === 1 ? "pretas" : "brancas"}`;
}

// clique do jogador
function handleClick(e) {
  const r = parseInt(e.currentTarget.dataset.row);
  const c = parseInt(e.currentTarget.dataset.col);
  if (board[r][c] !== 0) return;

  if (makeMove(r, c, currentPlayer)) {
    currentPlayer = 3 - currentPlayer;
    drawBoard();
  }
}

// direções possíveis
const directions = [
  [0,1],[1,0],[-1,0],[0,-1],
  [1,1],[1,-1],[-1,1],[-1,-1]
];

// faz a jogada
function makeMove(r, c, player) {
  let valid = false;
  let flips = [];

  for (let [dr, dc] of directions) {
    let rr = r + dr, cc = c + dc, captured = [];
    while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && board[rr][cc] === 3 - player) {
      captured.push([rr, cc]);
      rr += dr; cc += dc;
    }
    if (captured.length > 0 && rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && board[rr][cc] === player) {
      valid = true;
      flips = flips.concat(captured);
    }
  }

  if (valid) {
    board[r][c] = player;
    animatePlacement(r, c, player);

    for (let [cr, cc] of flips) {
      board[cr][cc] = player;
      animateFlip(cr, cc, player);
    }
  }

  return valid;
}

// animação de colocar peça
function animatePlacement(r, c, player) {
  const index = r * 8 + c;
  const cell = boardEl.children[index];
  const piece = document.createElement("div");

  if (player === 1) {
    piece.classList.add("placing-black");
    setTimeout(() => {
      piece.classList.remove("placing-black");
      piece.classList.add("black");
    }, PLACE_TIME);
  } else {
    piece.classList.add("placing-white");
    setTimeout(() => {
      piece.classList.remove("placing-white");
      piece.classList.add("white");
    }, PLACE_TIME);
  }

  cell.appendChild(piece);
}

// animação de flip
function animateFlip(r, c, player) {
  const index = r * 8 + c;
  const cell = boardEl.children[index];
  const oldPiece = cell.querySelector(".black, .white");
  if (oldPiece) cell.removeChild(oldPiece);

  const piece = document.createElement("div");
  if (player === 1) {
    piece.classList.add("flip-to-black");
    setTimeout(() => {
      piece.classList.remove("flip-to-black");
      piece.classList.add("black");
    }, FLIP_TIME);
  } else {
    piece.classList.add("flip-to-white");
    setTimeout(() => {
      piece.classList.remove("flip-to-white");
      piece.classList.add("white");
    }, FLIP_TIME);
  }

  cell.appendChild(piece);
}

// inicializa
drawBoard();
