import { BLACK, WHITE } from "./helpers/ConstantVariables.js";
import {
  capitalFirstLetter,
  findTheRoadArrayInTree,
  getfirstElementChild,
  getValuesUntilValueInArray,
  selectElement,
} from "./helpers/utilitesFun.js";
import { Piece } from "./Piece.js";
/**
 * @class Class that manage the events of the game
 */
export class GameEvents {
  constructor(boardData, openModel) {
    this.table = selectElement("table");
    this.boardData = boardData;
    this.openModel = openModel;
    this.selectPiece = undefined;
    this.activePlayer = BLACK;
    this.piecesThatMustMoves = [];
  }

  tryRemoveFromTheGame(row, col) {
    const posOp = this.selectPiece.checkOpponentPos(row, col);
    const eatMove = this.selectPiece.eatMoves.pop();

    eatMove &&
      this.table.rows[eatMove[0]].cells[eatMove[1]].classList.remove("active");
    if (posOp.length !== 0) {
      const opponent = this.boardData.getPlayer(...posOp);

      if (opponent) {
        this.boardData.removePlayer(...posOp);
        const cell = this.table.rows[posOp[0]].cells[posOp[1]];
        getfirstElementChild(cell)?.remove();
      }
    }
  }

  tryMove(row, col) {
    if (!this.selectPiece) return;

    const activeTD = this.table.rows[row].cells[col];

    if (!activeTD.classList.contains("active")) return;
    activeTD.appendChild(this.selectPiece.elPawn);

    this.tryRemoveFromTheGame(row, col);
    this.cleanActiveCells();

    return this.selectPiece;
  }
  getSecColor(color) {
    return color === BLACK ? WHITE : BLACK;
  }

  cleanActiveCells() {
    if (!this.selectPiece) return;

    const posMoves = this.selectPiece.getPossibleMove(this.boardData);
    const eatMoves = this.selectPiece.eatMoves;
    posMoves.forEach((move) => {
      const [row, col] = move;
      this.table.rows[row].cells[col].classList.remove("active");
    });

    eatMoves.forEach((eatMove) => {
      const [row, col] = eatMove;
      this.table.rows[row].cells[col].classList.remove("active");
    });
  }
  changeActivePlayer() {
    this.activePlayer = this.getSecColor(this.activePlayer);
  }
  checkWinner() {
    const secColor = this.getSecColor(this.activePlayer);
    const secPlayerAmountPieces = this.boardData.getNumPlayersByColor(secColor);
    const secPlayerCanMove = this.boardData.checkIfsecPlayerCanMove(secColor);

    if (secPlayerAmountPieces === 0 || !secPlayerCanMove) {
      this.openModel(
        `Congratulations ${capitalFirstLetter(this.activePlayer)} Won!!!`
      );
      this.activePlayer = undefined;
      return true;
    }
  }
  changePlayerToQueen() {
    this.activePlayer === WHITE &&
      this.selectPiece.row === 7 &&
      this.selectPiece.setQueen();
    this.activePlayer === BLACK &&
      this.selectPiece.row === 0 &&
      this.selectPiece.setQueen();
  }

  onCellClick(row, col) {
    this.table = selectElement("table");
    const resTryMove = this.tryMove(row, col);

    if (resTryMove) {
      this.selectPiece.row = row;
      this.selectPiece.col = col;

      this.changePlayerToQueen();
      if (this.checkWinner()) return;
      this.selectPiece.eatMoves.length === 0 && this.changeActivePlayer();

      this.selectPiece = undefined;
      this.piecesThatMustMoves = this.boardData.checkIfSomePlayerHaveEatMoves(
        this.activePlayer
      );
    } else {
      this.cleanActiveCells();
      this.selectPiece = undefined;
      this.showPossibleMove(row, col);
    }
  }

  showPossibleMove(row, col) {
    const peice = this.boardData.getPlayer(row, col);

    if (!peice) return;

    if (
      this.piecesThatMustMoves.length > 0 &&
      !this.piecesThatMustMoves.some(
        (el) => el.row === peice.row && el.col === peice.col
      )
    )
      return;

    const checkCurActivePlayer = peice.color === this.activePlayer;
    if (!checkCurActivePlayer) return alert(`It's ${this.activePlayer} Turn!`);

    const posMoves = peice.getPossibleMove(this.boardData);
    const eatMoves = peice.getEatMoves(this.boardData);

    if (eatMoves.length === 0)
      posMoves.forEach((move) => {
        const [row, col] = move;
        this.table.rows[row].cells[col].classList.add("active");
      });
    else
      eatMoves.forEach((eatMove) => {
        const [row, col] = eatMove;
        this.table.rows[row].cells[col].classList.add("active");
      });

    this.selectPiece = peice;
  }
}
