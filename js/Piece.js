import { SIZE_BOARD, WHITE } from "./helpers/ConstantVariables.js";

export class Piece {
  constructor(row, col, color, type) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.type = type;
    this.elPawn = document.createElement("div");
    this.elPawn.classList.add("center-abs", "pawn", `pawn-${color}`);
  }

  regularMove() {
    let dir = this.color === WHITE ? 1 : -1;
    const newRow = this.row + dir;
    return [
      [newRow, this.col + 1],
      [newRow, this.col - 1],
    ];
  }

  eatMove() {
    const newRow = this.row + dir * 2;
    return [
      [newRow, this.col + 1],
      [newRow, this.col - 1],
    ];
  }

  filterMoves() {
    this.relativeMoves = [...this.regularMove(), ...this.eatMove()];
    this.relativeMoves.filter((move) => {
      const [row, col] = move;
      if (row >= 0 && row < SIZE_BOARD && col >= 0 && col < SIZE_BOARD)
        return move;
    });
  }

  getPossibleMove(boardData) {
    return this.filterMoves();
  }
}
