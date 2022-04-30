import { SIZE_BOARD } from "./helpers/ConstantVariables.js";
import { selectElement } from "./helpers/utilitesFun.js";

export class CheckerBoard {
  constructor(boardData) {
    this.parentEl = selectElement("#container_CheckBoard");
    this.boardData = boardData;
    this.pieces = boardData.pieces;
    this.size = SIZE_BOARD;
    this.createCheckerBoard();
  }
  createCheckerBoard() {
    this.table = document.createElement("table");

    for (let row = 0; row < this.size; row++) {
      const rowElement = this.table.insertRow();
      for (let col = 0; col < this.size; col++) {
        const cell = rowElement.insertCell();
      }
    }
    this.setUpPawns();

    this.parentEl.appendChild(this.table);
  }
  setUpPawns() {
    this.pieces.forEach((piece, i) => {
      this.table.rows[piece.row].cells[piece.col].appendChild(piece.elPawn);
    });
  }
}

// table = document.querySelector("table");
// if (table !== null) {
//   table.remove();
// }

// Create empty chess board HTML:

// if ((row + col) % 2 === 0) {
//   cell.className = "light-cell";
// } else {
//   cell.className = "dark-cell";
// }
