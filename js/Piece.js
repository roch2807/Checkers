import { SIZE_BOARD, WHITE } from "./helpers/ConstantVariables.js";

export class Piece {
  constructor(row, col, color, type) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.type = type;
    this.dir = this.color === WHITE ? 1 : -1;
    this.elPawn = document.createElement("div");
    this.elPawn.classList.add("center-abs", "pawn", `pawn-${color}`);
    this.nextOpponent = undefined;
  }
  checkIfPlayerCanEat(row, col) {
    const difRow = row - this.row;
    const difCol = col - this.col;

    if (difRow === -2 && difCol > 0) return [row + 1, col - 1];
    else if (difRow === -2 && difCol < 0) return [row + 1, col + 1];
    else if (difRow === 2 && difCol < 0) return [row - 1, col + 1];
    else if (difRow === 2 && difCol > 0) return [row - 1, col - 1];
    else return [];
  }

  getRegularMoves() {
    const newRow = this.row + this.dir;
    this.relativeMoves = [
      [newRow, this.col + 1],
      [newRow, this.col - 1],
    ];
  }
  checkBorders(row, col) {
    return row >= 0 && row < SIZE_BOARD && col >= 0 && col < SIZE_BOARD;
  }

  filterRegularMoves(boardData) {
    this.getRegularMoves();
    this.opponentPos = [];
    this.absoluteMove = this.relativeMoves.filter((move) => {
      const [row, col] = move;
      const piece = boardData.getPlayer(row, col);
      const opponent = boardData.getOpponent(row, col);
      if (opponent) this.opponentPos.push(move);
      if (this.checkBorders(row, col) && !piece) return move;
    });
  }

  checkEatMoveDir(curRow, curCol, nextRow, nextCol, boardData) {
    // const possibleEatMove = [row + 1];
    const difRow = nextRow - curRow;
    const difCol = nextCol - curCol;
    const dirRow = difRow > 0 ? 1 : -1;
    const dirCol = difCol > 0 ? 1 : -1;
    const newRow = nextRow + dirRow;
    const newCol = nextCol + dirCol;

    const isOpponent = boardData.getOpponent(nextRow, nextCol);
    this.opponentPos.push(isOpponent);
    const checkBoarder = this.checkBorders(newRow, newCol);
    const isEmpty = !boardData.getPlayer(newRow, newCol);

    if (isOpponent && checkBoarder && isEmpty)
      return { newMove: [newRow, newCol], dirRow, dirCol };
  }
  eatMove(boardData) {
    this.eatMoves = [];
    if (this.opponentPos.length === 0) return;

    this.opponentPos.forEach((absMove) => {
      const [row, col] = absMove;
      let checkNextJumpPos = this.checkEatMoveDir(
        this.row,
        this.col,
        row,
        col,
        boardData
      );
      if (!checkNextJumpPos) return;
      const { newMove, dirRow, dirCol } = checkNextJumpPos;
      this.eatMoves.push(newMove);

      let checkNextleftJumpPos = this.checkEatMoveDir(
        newMove[0],
        newMove[1],
        newMove[0] + dirRow,
        newMove[1] - 1,
        boardData
      );
      let checkNextRightJumpPos = this.checkEatMoveDir(
        newMove[0],
        newMove[1],
        newMove[0] + dirRow,
        newMove[1] + 1,
        boardData
      );
      console.log(checkNextleftJumpPos, checkNextRightJumpPos);

      while (checkNextRightJumpPos || checkNextleftJumpPos) {
        if (checkNextleftJumpPos) {
          let {
            newMove: newMoveLeft,
            dirRow: dirRowLeft,
            dirCol: dirColLeft,
          } = checkNextleftJumpPos;
          this.eatMoves.push(newMoveLeft);
          checkNextleftJumpPos = this.checkEatMoveDir(
            newMoveLeft[0],
            newMoveLeft[1],
            newMoveLeft[0] + dirRowLeft,
            newMoveLeft[1] - 1,
            boardData
          );
        }

        if (checkNextRightJumpPos) {
          let {
            newMove: newMoveRight,
            dirRow: dirRowRight,
            dirCol: dirColRight,
          } = checkNextRightJumpPos;
          this.eatMoves.push(newMoveRight);
          checkNextRightJumpPos = this.checkEatMoveDir(
            newMoveRight[0],
            newMoveRight[1],
            newMoveRight[0] + dirRowRight,
            newMoveRight[1] + 1,
            boardData
          );
        }
      }
    });
  }

  getPossibleMove(boardData) {
    this.filterRegularMoves(boardData);
    this.eatMove(boardData);

    console.log(this.eatMoves);
    this.opponentPos = [];
    return [...this.absoluteMove, ...this.eatMoves];

    // return this.filterRegularMoves(boardData);
  }
}
