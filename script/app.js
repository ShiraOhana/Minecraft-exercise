const inventory = document.querySelector("#inventory");
const gameBoard = document.querySelector("#game-board");
const memorySection = document.querySelector("#memory");
const memoryCell = 2;
const matrix = [];
let lastPosition = [];
const activeTool = [];
let memory = [];

// Labeling and Id-ing every material

const Material = {
  sky: { name: "sky", id: 0 },
  dirt: { name: "dirt", id: 1 },
  oak: { name: "oak", id: 2 },
  leaves: { name: "leaves", id: 3 },
  stone: { name: "stone", id: 4 },
  grass: { name: "grass", id: 5 },
  cloud: { name: "cloud", id: 5 },
};

// Labeling and Id-ing every tool

const ToolKit = {
  pickaxe: { name: "Pickaxe", id: 0 },
  shovel: { name: "Shovel", id: 1 },
  axe: { name: "Axe", id: 2 },
};

// Creating the matrix itself with a loop

function startMatrix() {
  for (let i = 0; i < 21; i++) {
    matrix.push([]);
    for (let j = 0; j < 21; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
}

function drawMatrix(matrix) {
  for (let i = 1; i < 21; i++) {
    for (let j = 1; j < 21; j++) {
      if (matrix[i][j] == 0) {
        gameBoard.innerHTML += `<div class="brick" data-x="${i}" data-y="${j}" data-type="sky"></div>`;
      }
    }
  }
  return matrix;
}

drawMatrix(startMatrix());
const divs = document.querySelectorAll(".brick");

// Setting the possitions for each element

function positionsOfElements(material, xStart, xEnd, yStart, yEnd) {
  let getMaterial = Material[material].name; // Get the material from Material
  divs.forEach((element) => {
    if (
      element.dataset.x >= yStart &&
      element.dataset.x <= yEnd &&
      element.dataset.y >= xStart &&
      element.dataset.y <= xEnd
    ) {
      element.dataset.type = getMaterial; // Update the material by possitions x and y
    }
  });
}

// Working with the obj of memory bank
function toolInventory(ItemsObj) {
  Object.entries(ItemsObj).forEach((key) => {
    let newItem = document.createElement("div");
    newItem.classList.add("item-container");
    newItem.innerHTML = `<div class="item" data-type='${key[0]}'></div><span>${key[0]}</span>`;
    inventory.appendChild(newItem);
  });
}

function setPosition() {
  divs.forEach((div) => {
    div.addEventListener("click", (item) => {
      let x = item.target.dataset.x;
      let y = item.target.dataset.y;
      let type = item.target.dataset.type;
      lastPosition.push({
        x: x,
        y: y,
        type: type,
      });
      digWithChosenTool();
      if (sign) {
        if (item.target.dataset.type === "sky") {
          item.target.dataset.type =
            lastPosition[lastPosition.length - 2]["type"];
          lastPosition.pop();
          lastPosition.pop();
          memory.pop();
          updateMemoryStorage(memoryCell);
          sign = false;
        }
      }
    });
  });
}

// Positioning with materials & their position on the game board
// reference to tetromino codealong - same logic - will erase this comment before pushing
setPosition();
positionsOfElements("dirt", 0, 20, 18, 20);
positionsOfElements("grass", 0, 20, 17, 17);
positionsOfElements("oak", 5, 5, 12, 16);
positionsOfElements("leaves", 4, 6, 5, 13);
positionsOfElements("cloud", 13, 18, 6, 7);
positionsOfElements("cloud", 14, 16, 5, 5);
positionsOfElements("stone", 10, 15, 15, 16);
positionsOfElements("stone", 19, 20, 16, 16);
toolInventory(ToolKit);

function getItem() {
  const items = document.querySelectorAll(".item-container");
  items.forEach((item) => {
    item.firstElementChild.dataset.use = "false";
    item.firstElementChild.addEventListener("click", () => {
      if (item.firstElementChild.dataset.use === "true") {
        item.firstElementChild.dataset.use = false;
        activeTool.pop();
      } else if (item.firstElementChild.dataset.use === "false") {
        item.firstElementChild.dataset.use = true;
        activeTool.push(item.firstElementChild.dataset.type);
      }
      item.dataset.chosen = item.firstElementChild.dataset.use;
    });
  });
}
getItem();

// Removing marerial with his matching tool
let buildMemory = false;

function digWithChosenTool() {
  if (lastPosition) {
    if (activeTool) {
      if (
        !buildMemory &&
        lastPosition[lastPosition.length - 1]["type"] !== "sky" &&
        lastPosition[lastPosition.length - 1]["type"] !== "cloud"
      ) {
        createMemoryStorage(memoryCell);
        buildMemory = true;
      }
      if (
        (lastPosition[lastPosition.length - 1]["type"] === "dirt" ||
          lastPosition[lastPosition.length - 1]["type"] === "grass") &&
        activeTool[0] === "shovel"
      ) {
        let brick = [...divs].filter((div) => {
          return (
            div.dataset.x === lastPosition[lastPosition.length - 1]["x"] &&
            div.dataset.y === lastPosition[lastPosition.length - 1]["y"]
          );
        });
        memory.push(brick[0].dataset.type);
        updateMemoryStorage(memoryCell);
        brick[0].dataset.type = "sky";
      } else if (
        (lastPosition[lastPosition.length - 1]["type"] === "oak" ||
          lastPosition[lastPosition.length - 1]["type"] === "leaves") &&
        activeTool[0] === "axe"
      ) {
        let brick = [...divs].filter((div) => {
          return (
            div.dataset.x === lastPosition[lastPosition.length - 1]["x"] &&
            div.dataset.y === lastPosition[lastPosition.length - 1]["y"]
          );
        });
        memory.push(brick[0].dataset.type);
        updateMemoryStorage(memoryCell);
        brick[0].dataset.type = "sky";
      } else if (
        lastPosition[lastPosition.length - 1]["type"] === "stone" &&
        activeTool[0] === "pickaxe"
      ) {
        let brick = [...divs].filter((div) => {
          return (
            div.dataset.x === lastPosition[lastPosition.length - 1]["x"] &&
            div.dataset.y === lastPosition[lastPosition.length - 1]["y"]
          );
        });
        memory.push(brick[0].dataset.type);
        updateMemoryStorage(memoryCell);
        brick[0].dataset.type = "sky";
      }
      useMemory();
    }
  }
}

// Memory with appendChild and add a new element and class
function createMemoryStorage(numberOfCells) {
  for (let i = numberOfCells; i > 0; i--) {
    let newMemoryCell = document.createElement("div");
    newMemoryCell.classList.add("memory-container");
    newMemoryCell.innerHTML = `<div class="memory c${
      numberOfCells - i
    }"></div>`;
    memorySection.appendChild(newMemoryCell);
  }
}
function updateMemoryStorage(numberOfCells) {
  const memoryDiv = document.querySelectorAll(".memory-container");
  for (let i = -1, j = 0; i >= -numberOfCells; i--, j++) {
    memoryDiv[j].firstElementChild.dataset.type = memory[memory.length + i];
    memoryDiv[j].dataset.chosen = false;
  }
  return memoryDiv;
}
let sign = false;
function useMemory() {
  const memoryCellDivs = document.querySelectorAll(".memory");
  let items = document.querySelectorAll(".item-container"); // Get Items (tools)
  let activeMemoryCellDivs = Array.from(memoryCellDivs).filter((cell) => {
    return cell.dataset.type !== "undefined";
  });
  // Remove when memory is clicked
  activeMemoryCellDivs.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      //click on memory cell
      let chosenItem = Array.from(items).filter((itemContainer) => {
        return itemContainer.dataset.chosen === "true";
      });
      if (chosenItem.length === 1) {
        chosenItem[0].dataset.chosen = false;
        activeTool.pop();
      }
      if (buildWithMemory(e)) {
        sign = true; // which memory item to use
        updateMemoryStorage();
      }
    });
  });
}
// Clicking on material from the memory bank
function buildWithMemory(e) {
  if (e.path[0].dataset.chosen !== "true") {
    e.path[0].dataset.chosen = true;
    e.path[1].dataset.chosen = true;
    return true;
  } else if (e.path[0].dataset.chosen === "true") {
    e.path[0].dataset.chosen = false;
    e.path[1].dataset.chosen = false;
    return false;
  }
}
