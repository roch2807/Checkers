import { BoardData } from "./BoardData.js";
import { CheckerBoard } from "./CheckerBoard.js";

const initApp = () => {
  const boardData = new BoardData();
  const checkerBoard = new CheckerBoard(boardData);
};

initApp();
