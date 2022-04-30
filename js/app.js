import { BoardData } from "./BoardData.js";
import { CheckerBoard } from "./CheckerBoard.js";
import { GameEvents } from "./GameEvents.js";

const initApp = () => {
  const boardData = new BoardData();
  const gameEvents = new GameEvents(boardData);
  const checkerBoard = new CheckerBoard(
    boardData,
    gameEvents.onCellClick.bind(gameEvents)
  );

  // gameEvents.initEvents();
};

initApp();
