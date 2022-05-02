import { BLACK, WHITE } from "./helpers/ConstantVariables.js";
import {
  capitalFirstLetter,
  getfirstElementChild,
  getValuesUntilValueInArray,
  selectElement,
} from "./helpers/utilitesFun.js";
import { Piece } from "./Piece.js";

export class GameEvents {
  constructor(boardData, openModel) {
    this.table = selectElement("table");
    this.boardData = boardData;
    this.openModel = openModel;
    this.selectPiece = undefined;
    this.activePlayer = BLACK;
    this.mustMoves = [];
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
    const secPlayerAmountPieces = this.boardData.getNumPlayersByColor(
      this.getSecColor(this.activePlayer)
    );
    if (secPlayerAmountPieces === 0) {
      this.openModel(
        `Congratulations ${capitalFirstLetter(this.activePlayer)} Won!!!`
      );
      this.activePlayer = undefined;
    }
  }
  changePlayerToQueen() {
    this.activePlayer = BLACK;
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
      this.checkWinner();
      this.selectPiece.eatMoves.length === 0 && this.changeActivePlayer();
      this.selectPiece = undefined;
      this.mustMoves = this.boardData.checkIfSomePlayerHaveEatMoves(
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

    // if (
    //   this.mustMoves.length > 0 &&
    //   !this.mustMoves.some((el) => el.row === peice.row && el.col === peice.col)
    // )
    //   return;

    const checkCurActivePlayer = peice.color === this.activePlayer;
    // if (!checkCurActivePlayer) return;
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
