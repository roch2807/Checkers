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
      this.selectPiece.row = row;
      this.selectPiece.col = col;
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
    const posOp = this.selectPiece.checkIfPlayerCanEat(row, col);

    if (posOp && posOp.length !== 0) {
      const opponent = this.boardData.getPlayer(...posOp);
      console.log(opponent);
      if (opponent) {
        this.boardData.removePawn(...posOp);
        const cell = this.table.rows[posOp[0]].cells[posOp[1]];
        getfirstElementChild(cell)?.remove();
      }
    }
    this.cleanActiveCells();

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

// const opponentPos = this.selectPiece.checkIfPlayerCanEat(row, col);
// console.log(opponentPos);
// const opponent = this.boardData.getPlayer(...opponentPos);
// if (opponent) this.boardData.removePawn(...opponentPos);
// this.table.rows[opponentPos[0]].cells[opponentPos[1]].remove();
