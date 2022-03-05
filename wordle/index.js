const message = document.getElementById("message");
const tiles = document.getElementById("tiles");
const keyboard = document.getElementById("keyboard");

let wordle = "castle".toUpperCase();
// prettier-ignore
const keys = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","ENTER","Z","X","C","V","B","N","M","«"];

const guessRows = Array(wordle.length + 1).fill(Array(wordle.length).fill(""));

let currentRow = 0;
let currentIndex = 0;
let isGameOver = false;

// build board
for (let rowIndex = 0; rowIndex < wordle.length + 1; rowIndex++) {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "row-" + rowIndex);
  rowElement.dataset.length = wordle.length;
  for (let columnIndex = 0; columnIndex < wordle.length; columnIndex++) {
    const tileElement = document.createElement("div");
    tileElement.setAttribute("id", "row-" + rowIndex + "-tile-" + columnIndex);
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  }
  tiles.append(rowElement);
  tiles.dataset.length = wordle.length + 1;
}

// keyboard
keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.innerText = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

const handleClick = (letter) => {
  if (!isGameOver) {
    if (letter === "«") {
      deleteLetter();
      return;
    }
    if (letter === "ENTER") {
      checkRow();
      return;
    }
    addLetter(letter);
  }
};

document.addEventListener("keyup", (e) => {
  if (e.key === "Backspace") {
    deleteLetter();
  } else if (e.key === "Enter") {
    checkRow();
  } else if (/^[A-Z]$/.test(e.key.toUpperCase())) {
    addLetter(e.key.toUpperCase());
  }
});

const addLetter = (letter) => {
  if (currentIndex < wordle.length && currentRow < wordle.length + 1) {
    const tile = document.getElementById(
      "row-" + currentRow + "-tile-" + currentIndex
    );
    tile.innerText = letter;
    guessRows[currentRow][currentIndex] = letter;
    tile.dataset.letter = letter;
    currentIndex++;
  }
};

const deleteLetter = () => {
  if (currentIndex > 0) {
    currentIndex--;
    const tile = document.getElementById(
      "row-" + currentRow + "-tile-" + currentIndex
    );
    tile.innerText = "";
    guessRows[currentRow][currentIndex] = "";
    tile.dataset.letter = "";
  }
};

const checkRow = () => {
  if (currentIndex !== wordle.length) return;
  const guess = guessRows[currentRow].join("");
  flipTiles().then(() => {
    if (guess === wordle) {
      showMessage("Super!");
      isGameOver = true;
    } else {
      if (currentRow >= wordle.length) {
        showMessage("Game Over !");
        isGameOver = true;
      } else {
        currentRow++;
        currentIndex = 0;
      }
    }
  });
};

const showMessage = (msg) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = msg;
  message.append(messageElement);
  setTimeout(() => message.removeChild(messageElement), 3000);
};

const addColorToKeyboard = (letter, color) => {
  const key = document.getElementById(letter);
  key.classList.add(color);
};

const flipTiles = () => {
  const rowElement = document.getElementById(`row-${currentRow}`);
  const tiles = rowElement.querySelectorAll("div.tile");
  let checkWordle = wordle;
  const guess = [];

  tiles.forEach((tile) => {
    guess.push({
      letter: tile.dataset.letter,
      color: "grey-overlay",
    });
  });

  guess.forEach((guess, index) => {
    if (guess.letter === wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess, index) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  const promises = [];
  tiles.forEach((tile, index) => {
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          tile.classList.add("flip");
          tile.classList.add(guess[index].color);
          addColorToKeyboard(guess[index].letter, guess[index].color);
          resolve();
        }, 500 * index);
      })
    );
  });

  return Promise.all([
    ...promises,
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500 * tiles.length);
    }),
  ]);
};
