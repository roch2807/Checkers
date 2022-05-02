import { BoardData } from "./BoardData.js";
import { CheckerBoard } from "./CheckerBoard.js";
import { GameEvents } from "./GameEvents.js";
import { Model } from "./Model.js";

const initApp = () => {
  const boardData = new BoardData();
  const model = new Model(initApp);
  const gameEvents = new GameEvents(boardData, model.openModel.bind(model));
  const checkerBoard = new CheckerBoard(
    boardData,
    gameEvents.onCellClick.bind(gameEvents)
  );
};

initApp();
