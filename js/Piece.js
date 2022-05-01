import {
  QUEEN,
  SIMPLE_PAWN,
  SIZE_BOARD,
  WHITE,
} from "./helpers/ConstantVariables.js";
import { checkTheElIsUniqueInArray } from "./helpers/utilitesFun.js";

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
  setQueen() {
    this.elPawn.classList.add(`${QUEEN}-${this.color}`);
    this.type = QUEEN;
  }

  queenMove(directionRow, directionCol) {
    let result = [];
    for (let i = 1; i < SIZE_BOARD; i++) {
      let row = this.row + directionRow * i;
      let col = this.col + directionCol * i;
      result.push(row, col);
    }
    return result;
  }
  checkOpponentRelative(row, col) {
    const difRow = row - this.row;
    const difCol = col - this.col;

    if (difRow === -2 && difCol > 0) return [row + 1, col - 1];
    else if (difRow === -2 && difCol < 0) return [row + 1, col + 1];
    else if (difRow === 2 && difCol < 0) return [row - 1, col + 1];
    else if (difRow === 2 && difCol > 0) return [row - 1, col - 1];
    else return [];
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

  eatMove(boardData) {
    if (this.opponentPos.length === 0) return;

    this.opponentPos.forEach((absMove) => {
      let checkNextJumpPos = this.checkEatMoveDir(
        [this.row, this.col],
        absMove,
        boardData
      );

      if (!checkNextJumpPos) return;
      const { newMove, dirRow, dirCol } = checkNextJumpPos;

      checkTheElIsUniqueInArray(newMove, this.eatMoves) &&
        this.eatMoves.push(newMove);

      const nextMoveLeftPos = [newMove[0] + dirRow, newMove[1] - 1];
      const nextMoveRightPos = [newMove[0] + dirRow, newMove[1] + 1];

      let checkNextleftJumpPos = this.checkEatMoveDir(
        newMove,
        nextMoveLeftPos,
        boardData
      );

      let checkNextRightJumpPos = this.checkEatMoveDir(
        newMove,
        nextMoveRightPos,
        boardData
      );

      while (checkNextRightJumpPos || checkNextleftJumpPos) {
        if (checkNextleftJumpPos) {
          let { newMove, dirRow } = checkNextleftJumpPos;

          checkTheElIsUniqueInArray(newMove, this.eatMoves) &&
            this.eatMoves.push(newMove);
          const nextMovePos = [newMove[0] + dirRow, newMove[1] - 1];
          checkNextleftJumpPos = this.checkEatMoveDir(
            newMove,
            nextMovePos,
            boardData
          );
        }

        if (checkNextRightJumpPos) {
          let { newMove, dirRow } = checkNextRightJumpPos;
          checkTheElIsUniqueInArray(newMove, this.eatMoves) &&
            this.eatMoves.push(newMove);

          const nextMovePos = [newMove[0] + dirRow, newMove[1] + 1];
          checkNextRightJumpPos = this.checkEatMoveDir(
            newMove,
            nextMovePos,
            boardData
          );
        }
      }
    });
  }

  getEatMoves(boardData) {
    this.eatMoves = [];
    this.eatMove(boardData);

    return this.eatMoves;
  }

  checkBorders(row, col) {
    return row >= 0 && row < SIZE_BOARD && col >= 0 && col < SIZE_BOARD;
  }
  pawnMove() {
    let newRow;
    newRow = this.row + this.dir;
    return [
      [newRow, this.col + 1],
      [newRow, this.col - 1],
    ];
  }
  getRelativeMoves() {
    this.relativeMoves =
      this.type === SIMPLE_PAWN
        ? this.pawnMove()
        : [
            ...this.queenMove(-1, 0),
            ...this.queenMove(1, 0),
            ...this.queenMove(0, -1),
            ...this.queenMove(0, 1),
          ];
  }
  filterRegularMoves(boardData) {
    this.getRelativeMoves();
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

  getPossibleMove(boardData) {
    this.filterRegularMoves(boardData);

    return this.possibleMoves;
  }
}
