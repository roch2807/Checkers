import { SIZE_BOARD } from "./helpers/ConstantVariables.js";
import { selectElement } from "./helpers/utilitesFun.js";

export class CheckerBoard {
  constructor(boardData, onCellClick) {
    this.parentEl = selectElement("#container_CheckBoard");
    this.boardData = boardData;
    this.pieces = boardData.pieces;
    this.size = SIZE_BOARD;
    this.createCheckerBoard(onCellClick);
  }
  createCheckerBoard(onCellClick) {
    const table = document.getElementById("checkerBoard");
    if (table) table.remove();
    this.table = document.createElement("table");
    this.table.id = "checkerBoard";
    for (let row = 0; row < this.size; row++) {
      const rowElement = this.table.insertRow();
      for (let col = 0; col < this.size; col++) {
        const cell = rowElement.insertCell();
        cell.dataset.indexPos = [row, col];
        cell.addEventListener("click", () => onCellClick(row, col));
      }
    }
    this.setUpPawns();
    this.parentEl.appendChild(this.table);
  }
  setUpPawns() {
    this.pieces.forEach((piece) =>
      this.table.rows[piece.row].cells[piece.col].appendChild(piece.elPawn)
    );
  }
}
