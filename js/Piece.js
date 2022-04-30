import { SIZE_BOARD, WHITE } from "./helpers/ConstantVariables.js";

export class Piece {
  constructor(row, col, color, type) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.type = type;
    this.dir = this.color === WHITE ? 1 : -1;
    this.elPawn = document.createElement("div");
    this.elPawn.classList.add("center-abs", "pawn", `pawn-${color}`);
    this.nextOpponent = undefined;
  }

  checkBorders(row, col) {
    return row >= 0 && row < SIZE_BOARD && col >= 0 && col < SIZE_BOARD;
  }

  getRegularMoves() {
    const newRow = this.row + this.dir;
    this.relativeMoves = [
      [newRow, this.col + 1],
      [newRow, this.col - 1],
    ];
  }

  filterMoves(boardData) {
    this.getRegularMoves();
    this.eatMove = [];
    this.absoluteMove = this.relativeMoves.filter((move) => {
      const [row, col] = move;
      const peice = boardData.getPlayer(row, col);
      if (this.checkBorders(row, col) && !peice) return move;

      if (peice && peice.color !== this.color) {
        const newRow = this.row + this.dir * 2;
        const newCol = col > this.col ? this.col + 2 : this.col - 2;
        const empty = boardData.getPlayer(newRow, newCol);
        if (this.checkBorders(newRow, newCol))
          if (!empty) this.eatMove.push([newRow, newCol]);
      }
    });
    return [...this.absoluteMove, ...this.eatMove];
  }

  getPossibleMove(boardData) {
    return this.filterMoves(boardData);
  }
}
