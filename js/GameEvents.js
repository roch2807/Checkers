import { BLACK, QUEEN, WHITE } from "./helpers/ConstantVariables.js";
import {
  capitalFirstLetter,
  getfirstElementChild,
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

  onCellClick(row, col) {
    this.table = selectElement("table");
    const resTryMove = this.tryMove(row, col);

    //If  there is selected piece enter the block.
    //The sec clicked on pawn
    if (resTryMove) {
      this.selectPiece.row = row;
      this.selectPiece.col = col;

      this.changePlayerToQueen();
      if (this.checkWinner()) return;

      //If the selected piece have no possible eat move ,
      //Only then change the active player color will change .
      this.selectPiece.checkFilpMode();
      this.selectPiece.eatMoves.length === 0 && this.changeActivePlayer();

      this.selectPiece = undefined;

      //Check which opponent player have possible move .
      //Only with them the opponent will play.
      this.piecesThatMustMoves = this.boardData.checkIfSomePlayerHaveEatMoves(
        this.activePlayer
      );
    } else {
      //The first click on pawn
      this.cleanActiveCells();
      this.selectPiece = undefined;
      this.showPossibleMove(row, col);
    }
  }

  tryMove(row, col) {
    if (!this.selectPiece) return;

    const activeTD = this.table.rows[row].cells[col];

    //Only if the player click on active square the function wil excuate.
    if (!activeTD.classList.contains("active")) return;

    //Move the clicked pawn
    activeTD.appendChild(this.selectPiece.elPawn);
    this.selectPiece.checkFilpMode();
    this.tryRemoveFromTheGame(row, col);
    this.cleanActiveCells();

    return this.selectPiece;
  }

  tryRemoveFromTheGame(row, col) {
    //Check nearby the active square we clicked,if there is opponent to eat
    const posOp = this.selectPiece.checkOpponentPos(row, col);

    //Remove the cur eatMove from the array
    const eatMove = this.selectPiece.eatMoves.pop();

    //If there eatmove remove the active class from the square
    eatMove &&
      this.table.rows[eatMove[0]].cells[eatMove[1]].classList.remove("active");

    //If there is opponent in nearby the sqaure we clicked , get the opponent piece
    if (posOp.length !== 0) {
      const opponent = this.boardData.getPlayer(...posOp);

      //If the opponent is exist , remove from the board data
      //and remove the opponent piece from the square in the dom
      if (opponent) {
        this.boardData.removePlayer(...posOp);
        const cell = this.table.rows[posOp[0]].cells[posOp[1]];
        getfirstElementChild(cell)?.remove();
      }
    }
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
  changePlayerToQueen() {
    this.activePlayer === WHITE &&
      this.selectPiece.row === 7 &&
      this.selectPiece.setQueen();
    this.activePlayer === BLACK &&
      this.selectPiece.row === 0 &&
      this.selectPiece.setQueen();
  }
  checkWinner() {
    const secColor = this.getSecColor(this.activePlayer);
    const secPlayerAmountPieces = this.boardData.getNumPlayersByColor(secColor);
    const secPlayerCanMove = this.boardData.checkIfsecPlayerCanMove(secColor);

    if (secPlayerAmountPieces === 0 || !secPlayerCanMove) {
      this.openModel(
        `Congratulations ${capitalFirstLetter(
          this.activePlayer
        )} is the winner!!!`
      );
      this.activePlayer = undefined;
      return true;
    }
  }

  changeActivePlayer() {
    this.activePlayer = this.getSecColor(this.activePlayer);
  }

  showPossibleMove(row, col) {
    const piece = this.boardData.getPlayer(row, col);

    if (!piece) return;
    if (!this.activePlayer)
      return alert("The game is done ,please refresh the page");

    const checkCurActivePlayer = piece.color === this.activePlayer;
    if (!checkCurActivePlayer) return alert(`It's ${this.activePlayer} Turn!`);

    //Check it there are pieces that are must move
    if (
      this.piecesThatMustMoves.length > 0 &&
      !this.piecesThatMustMoves.some(
        (el) => el.row === piece.row && el.col === piece.col
      )
    )
      return alert(`The ${this.activePlayer} Must Eat!`);

    const posMoves = piece.getPossibleMove(this.boardData);
    const eatMoves = piece.getEatMoves(this.boardData);

    // if no eat move only than show the possible move
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

    this.selectPiece = piece;
  }
  getSecColor(color) {
    return color === BLACK ? WHITE : BLACK;
  }
}
