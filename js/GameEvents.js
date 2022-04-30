import {
  selectElement,
  addEventListenerByQuery,
  getfirstElementChild,
} from "./helpers/utilitesFun.js";
import { Piece } from "./Piece.js";

export class GameEvents {
  constructor(boardData) {
    this.boardData = boardData;
    this.selectPiece = undefined;
  }

  onCellClick(row, col) {
    this.table = selectElement("table");
    const resTryMove = this.tryMove(row, col);
    if (resTryMove) {
      this.selectPiece = undefined;
    } else {
      this.cleanActiveCells();
      this.selectPiece = undefined;
      this.showPossibleMove(row, col);
    }
  }

  tryMove(row, col) {
    if (!this.selectPiece) return;
    const activeTD = this.table.rows[row].cells[col];

    if (!activeTD.classList.contains("active")) return;
    activeTD.appendChild(this.selectPiece.elPawn);
    this.cleanActiveCells();
    this.selectPiece.row = row;
    this.selectPiece.col = col;

    return this.selectPiece;
  }
  cleanActiveCells() {
    if (!this.selectPiece) return;

    const posMoves = this.selectPiece.getPossibleMove(this.boardData);
    posMoves.forEach((move) => {
      const [row, col] = move;
      this.table.rows[row].cells[col].classList.remove("active");
    });
  }
  showPossibleMove(row, col) {
    const peice = this.boardData.getPlayer(row, col);
    if (!peice) return;
    const posMoves = peice.getPossibleMove(this.boardData);
    posMoves.forEach((move) => {
      const [row, col] = move;
      this.table.rows[row].cells[col].classList.add("active");
    });
    this.selectPiece = peice;
  }
}
