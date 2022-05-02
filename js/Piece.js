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
  //Get possible moves after filter of illegal moves
  getPossibleMove(boardData) {
    this.filterRegularMoves(boardData);

    return this.possibleMoves;
  }
  //Filter the possible moves
  //And check if there are any oppoent nearby
  filterRegularMoves(boardData) {
    this.getRelativeMoves(boardData);

    this.opponentPos = [];

    this.possibleMoves = this.relativeMoves.filter((move) => {
      const [row, col] = move;
      const piece = boardData.getPlayer(row, col);
      const opponent = boardData.getOpponent(row, col, this.color);

      //Check if the opponent pos is in the opponentPos array and if he isn't there
      //add his pos to this opponentPos array
      if (opponent && checkTheElIsUniqueInArray(move, this.opponentPos))
        this.opponentPos.push(move);

      if (this.checkBorders(row, col) && !piece) return move;
    });
  }
  //Get relative moves by the type of the piece
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

  //Get queen moves by all oblique diractions
  queenMove(directionRow, directionCol, boardData) {
    let result = [];
    for (let i = 1; i < SIZE_BOARD; i++) {
      let row = this.row + directionRow * i;
      let col = this.col + directionCol * i;
      const pieceSameColor = boardData.getPlayer(row, col);
      const opponent = boardData.getOpponent(row, col);
      if (pieceSameColor && pieceSameColor.color === this.color) {
        result.push([row, col]);
        return result;
      }
      if (opponent) {
        result.push([row, col]);
        return result;
      }
      if (this.checkBorders(row, col)) result.push([row, col]);
    }
    return result;
  }
  getEatMoves(boardData) {
    this.eatMoves = [];
    this.eatMove(boardData);

    return this.eatMoves;
  }
  //search eatMove by recursion search
  eatMove(boardData) {
    //If there is no opponent exit from the function
    if (this.opponentPos.length === 0) return;

    const recursionSearch = (firstMove, nextMove, boardData) => {
      //Check the first square of search
      //Check if the next square is potential place to jump after eating
      const checkNextMove = this.checkPotentialEatMove(
        firstMove,
        nextMove,
        boardData
      );

      //If is not exist exit from the function
      if (!checkNextMove) return false;

      const { newMove, dirRow } = checkNextMove;

      //Each check of the recursion search , if there is potential square
      //Add this pos to the eatMoves array
      checkTheElIsUniqueInArray(newMove, this.eatMoves) &&
        this.eatMoves.push(newMove);

      //Get the next pos to check:left square, right square and backward right square
      const nextMoveLeftPos = [newMove[0] + dirRow, newMove[1] - 1];
      const nextMoveRightPos = [newMove[0] + dirRow, newMove[1] + 1];
      const backMoveRightPos = [newMove[0] + dirRow * -1, newMove[1] + 1];

      //If there is no potenial square exit from the function
      if (
        !recursionSearch(newMove, nextMoveLeftPos, boardData) &&
        !recursionSearch(newMove, nextMoveRightPos, boardData) &&
        !recursionSearch(newMove, backMoveRightPos, boardData)
      )
        return;
    };

    //Loop over the opponent pos
    this.opponentPos.forEach((opPos) => {
      recursionSearch([this.row, this.col], opPos, boardData);
    });
  }

  checkPotentialEatMove(curPos, nextPos, boardData) {
    const [curRow, curCol] = curPos;
    const [nextRow, nextCol] = nextPos;

    //Check diff between the next and pre rows and cols
    const difRow = nextRow - curRow;
    const difCol = nextCol - curCol;

    //If the diff are bigger than zero row and col are up by 1 otherwise by -1
    const dirRow = difRow > 0 ? 1 : -1;
    const dirCol = difCol > 0 ? 1 : -1;

    //Normalize the potential place of the empty sqaure
    const newRow = nextRow + dirRow;
    const newCol = nextCol + dirCol;

    //Check if there is opponent nearby, the pos is legal and the nextPos is occupied
    const isOpponent = boardData.getOpponent(nextRow, nextCol, this.color);
    const checkBoarder = this.checkBorders(newRow, newCol);
    const isOccupied = boardData.getPlayer(newRow, newCol);

    //Otherwise exit from the function
    if (!checkBoarder) return;
    if (!isOpponent) return;
    if (isOccupied) return;

    const opponentPos = [isOpponent.row, isOpponent.col];

    //If there isn't the same pos of opponent add the opponent pos to opponentPos array
    checkTheElIsUniqueInArray(opponentPos, this.opponentPos) &&
      this.opponentPos.push(opponentPos);

    return { newMove: [newRow, newCol], dirRow, dirCol };
  }

  //Check if the row and col of the empty sqaure that are given
  //are after opponent pos
  checkOpponentPos(row, col, curMove = [this.row, this.col]) {
    const [Row, Col] = curMove;

    //Check potential the diff between next and pre rows and col
    const difRow = row - Row;
    const difCol = col - Col;

    //Return the potential pos of opponent
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
