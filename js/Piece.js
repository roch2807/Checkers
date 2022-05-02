import {
  QUEEN,
  SIMPLE_PAWN,
  SIZE_BOARD,
  WHITE,
} from "./helpers/ConstantVariables.js";
import { checkTheElIsUniqueInArray } from "./helpers/utilitesFun.js";

/**
 * @class Class with all the data about piece
 */
export class Piece {
  constructor(row, col, color, type) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.type = type;
    this.relativeMoves = [];
    this.possibleMoves = [];
    this.opponentPos = [];
    this.eatMoves = [];

    this.dir = this.color === WHITE ? 1 : -1;
    this.elPawn = document.createElement("div");
    this.elPawn.classList.add("center-abs", "pawn", `pawn-${color}`);
  }

  getPossibleMove(boardData) {
    this.filterRegularMoves(boardData);

    return this.possibleMoves;
  }
  filterRegularMoves(boardData) {
    this.getRelativeMoves(boardData);

    this.opponentPos = [];

    this.possibleMoves = this.relativeMoves.filter((move) => {
      const [row, col] = move;
      const piece = boardData.getPlayer(row, col);
      const opponent = boardData.getOpponent(row, col, this.color);

      if (opponent && checkTheElIsUniqueInArray(move, this.opponentPos))
        this.opponentPos.push(move);

      if (this.checkBorders(row, col) && !piece) return move;
    });
  }
  getRelativeMoves(boardData) {
    this.relativeMoves =
      this.type === SIMPLE_PAWN
        ? this.pawnMove()
        : [
            ...this.queenMove(-1, 1, boardData),
            ...this.queenMove(1, -1, boardData),
            ...this.queenMove(1, 1, boardData),
            ...this.queenMove(-1, -1, boardData),
          ];
  }

  pawnMove() {
    let newRow;
    newRow = this.row + this.dir;

    return [
      [newRow, this.col + 1],
      [newRow, this.col - 1],
    ];
  }

  queenMove(directionRow, directionCol, boardData) {
    let result = [];
    for (let i = 1; i < SIZE_BOARD; i++) {
      let row = this.row + directionRow * i;
      let col = this.col + directionCol * i;
      const peiceSameColor = boardData.getPlayer(row, col);
      if (peiceSameColor && peiceSameColor.color === this.color) {
        result.push([row, col]);
        return result;
      }
      result.push([row, col]);
    }
    return result;
  }
  getEatMoves(boardData) {
    this.eatMoves = [];
    this.eatMove(boardData);

    return this.eatMoves;
  }
  eatMove(boardData) {
    if (this.opponentPos.length === 0) return;

    const recuresSearch = (firstMove, nextMove, boardData) => {
      const checkNextMove = this.checkEatMoveDir(
        firstMove,
        nextMove,
        boardData
      );

      if (!checkNextMove) {
        return false;
      }

      const { newMove, dirRow, dirCol } = checkNextMove;

      checkTheElIsUniqueInArray(newMove, this.eatMoves) &&
        this.eatMoves.push(newMove);
      const nextMoveLeftPos = [newMove[0] + dirRow, newMove[1] - 1];
      const nextMoveRightPos = [newMove[0] + dirRow, newMove[1] + 1];
      const backMoveRightPos = [newMove[0] + dirRow * -1, newMove[1] + 1];
      if (
        !recuresSearch(newMove, nextMoveLeftPos, boardData) &&
        !recuresSearch(newMove, nextMoveRightPos, boardData) &&
        !recuresSearch(newMove, backMoveRightPos, boardData)
      )
        return;
    };
    this.opponentPos.forEach((opPos) => {
      recuresSearch([this.row, this.col], opPos, boardData);
    });
  }
  checkEatMoveDir(curPos, nextPos, boardData) {
    const [curRow, curCol] = curPos;
    const [nextRow, nextCol] = nextPos;
    const difRow = nextRow - curRow;
    const difCol = nextCol - curCol;
    const dirRow = difRow > 0 ? 1 : -1;
    const dirCol = difCol > 0 ? 1 : -1;
    const newRow = nextRow + dirRow;
    const newCol = nextCol + dirCol;

    const isOpponent = boardData.getOpponent(nextRow, nextCol, this.color);
    const checkBoarder = this.checkBorders(newRow, newCol);
    const isEmpty = boardData.getPlayer(newRow, newCol);

    if (!isOpponent) return;
    if (!checkBoarder) return;
    if (isEmpty) return;

    const opponentPos = [isOpponent.row, isOpponent.col];

    checkTheElIsUniqueInArray(opponentPos, this.opponentPos) &&
      this.opponentPos.push(opponentPos);

    return { newMove: [newRow, newCol], dirRow, dirCol };
  }

  checkOpponentPos(row, col, curMove = [this.row, this.col]) {
    const [Row, Col] = curMove;
    const difRow = row - Row;
    const difCol = col - Col;

    if (difRow <= -2 && difCol > 0) return [row + 1, col - 1];
    else if (difRow <= -2 && difCol < 0) return [row + 1, col + 1];
    else if (difRow >= 2 && difCol < 0) return [row - 1, col + 1];
    else if (difRow >= 2 && difCol > 0) return [row - 1, col - 1];
    else return [];
  }

  checkBorders(row, col) {
    return row >= 0 && row < SIZE_BOARD && col >= 0 && col < SIZE_BOARD;
  }
  setQueen() {
    this.elPawn.classList.add(`${QUEEN}-${this.color}`);
    this.type = QUEEN;
  }
}
