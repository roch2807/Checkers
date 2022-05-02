import {
  BLACK,
  SIMPLE_PAWN,
  SIZE_BOARD,
  WHITE,
} from "./helpers/ConstantVariables.js";
import { Piece } from "./Piece.js";

export class BoardData {
  constructor() {
    this.pieces = this.createPiece();
  }

  createPiece() {
    let piecesArr = [];
    for (let i = 0; i < SIZE_BOARD; i++) {
      if (i % 2 !== 0) {
        piecesArr.push(new Piece(0, i, WHITE, SIMPLE_PAWN));
        piecesArr.push(new Piece(2, i, WHITE, SIMPLE_PAWN));
        piecesArr.push(new Piece(6, i, BLACK, SIMPLE_PAWN));
      }
      if (i % 2 === 0) {
        piecesArr.push(new Piece(1, i, WHITE, SIMPLE_PAWN));
        piecesArr.push(new Piece(5, i, BLACK, SIMPLE_PAWN));
        piecesArr.push(new Piece(7, i, BLACK, SIMPLE_PAWN));
      }
    }
    return piecesArr;
  }

  getPlayer(row, col) {
    return this.pieces.find((piece) => piece.row === row && piece.col === col);
  }

  getOpponent(row, col, color) {
    const piece = this.getPlayer(row, col);
    if (piece && piece.color !== color) return piece;
  }

  removePlayer(row, col) {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.col === col && piece.row === row) this.pieces.splice(i, 1);
    }
  }

  getNumPlayersByColor(color) {
    return this.pieces.filter((piece) => piece.color === color).length;
  }

  //Get color and filter the pieces with the same color
  //and piece that can eat other pieces
  //Return the array with the pieces that can move
  checkIfSomePlayerHaveEatMoves(color) {
    return this.pieces.filter((piece) => {
      if (color === piece.color) {
        piece.filterRegularMoves(this);
        piece.getEatMoves(this);
      }

      return color === piece.color && piece.eatMoves.length > 0;
    });
  }
  //Check the possible movement of pieces with the same color
  //If there is player with possible move return true
  checkIfsecPlayerCanMove(color) {
    const res = this.pieces
      .filter((piece) => piece.color === color)
      .some(
        (piece) =>
          piece.getPossibleMove(this) && piece.possibleMoves.length !== 0
      );

    return res;
  }
}
