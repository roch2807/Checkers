/**
 * @class Class that create the model window and and the backDrop
 * The class also manage the events of the model
 */
export class Model {
  constructor(initApp) {
    this.model = this.createModel();
    this.initApp = initApp;
  }

  createContainer() {
    const container = document.createElement("div");
    container.id = "model_container";
    return container;
  }

  createBackDrop() {
    const backDrop = document.createElement("div");
    backDrop.id = "backDrop";
    return backDrop;
  }
  // Create the model ,the heading, and the buttons
  createModelCard() {
    const model = document.createElement("div");
    model.id = "model";
    const h2 = document.createElement("h2");
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttons_container");
    const buttonReset = document.createElement("button");
    buttonReset.classList.add("buttonReset");
    buttonReset.textContent = "New Game";
    const buttonClose = document.createElement("button");
    buttonClose.classList.add("buttonClose");
    buttonClose.textContent = "Close";
    buttonContainer.append(buttonReset, buttonClose);
    model.append(h2, buttonContainer);
    return model;
  }

  createModel() {
    const container = this.createContainer();
    const backDrop = this.createBackDrop();
    const model = this.createModelCard();
    container.append(backDrop, model);
    return container;
  }

  //open the model , generate the attach the correct message
  // and init the events of the model
  openModel(message) {
    const h2 = this.model.querySelector("h2");
    h2.textContent = message;
    document.body.append(this.model);
    this.initModelEvents();
  }

  initModelEvents() {
    //Close model by click backdrop
    const backDrop = document.getElementById("backDrop");
    backDrop.addEventListener("click", () => {
      this.model.remove();
    });

    const buttonsContainer = this.model.querySelector(".buttons_container");
    buttonsContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.closest("button")) return;

      //Close model by click the close button
      if (target.classList.contains("buttonClose")) this.model.remove();

      //Reset the app and close the model
      if (target.classList.contains("buttonReset")) {
        this.model.remove();
        this.initApp();
      }
    });
  }
}
