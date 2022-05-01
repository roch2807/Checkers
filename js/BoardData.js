import { SIZE_BOARD } from "./helpers/ConstantVariables.js";
import { Piece } from "./Piece.js";

export class BoardData {
  constructor() {
    this.pieces = this.createPeice();
  }

  createPeice() {
    let piecesArr = [];
    for (let i = 0; i < SIZE_BOARD; i++) {
      if (i % 2 !== 0) {
        piecesArr.push(new Piece(0, i, "white", "simplePawn"));
        piecesArr.push(new Piece(2, i, "white", "simplePawn"));
        piecesArr.push(new Piece(6, i, "black", "simplePawn"));
      }
      if (i % 2 === 0) {
        piecesArr.push(new Piece(1, i, "white", "simplePawn"));
        piecesArr.push(new Piece(5, i, "black", "simplePawn"));
        piecesArr.push(new Piece(7, i, "black", "simplePawn"));
      }
    }
    return piecesArr;
  }

  getPlayer(row, col) {
    return this.pieces.find((piece) => piece.row === row && piece.col === col);
  }

  getOpponent(row, col, color) {
    const peice = this.getPlayer(row, col);
    if (peice && peice.color !== color) return peice;
  }
  getSameColorPiece(row, col) {
    const peice = this.getPlayer(row, col);
    if (peice && peice.color === this.color) return peice;
  }

  removePlayer(row, col) {
    for (let i = 0; i < this.pieces.length; i++) {
      const peice = this.pieces[i];
      if (peice.col === col && peice.row === row) this.pieces.splice(i, 1);
    }
  }
}
