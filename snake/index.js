const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("scoreEl");
const startBtn = document.getElementById("startBtn");
const messageEl = document.getElementById("message");

const GRID_COUNT = 20;

let width, height, gridSize;
["load", "resize"].forEach((event) =>
  addEventListener(event, function responsiveCanvas() {
    let w = Math.round(
      (Number(getComputedStyle(canvas).getPropertyValue("width").slice(0, -2)) /
        devicePixelRatio) *
        devicePixelRatio
    );
    width = canvas.width = w;

    let h = Math.round(
      (Number(
        getComputedStyle(canvas).getPropertyValue("height").slice(0, -2)
      ) /
        devicePixelRatio) *
        devicePixelRatio
    );
    height = canvas.height = h;
    gridSize = width / GRID_COUNT;
  })
);

class Player {
  static directions = {
    ArrowLeft: {
      x: -1,
      y: 0,
    },
    ArrowUp: {
      x: 0,
      y: -1,
    },
    ArrowRight: {
      x: 1,
      y: 0,
    },
    ArrowDown: {
      x: 0,
      y: 1,
    },
  };

  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.trail = [];
    this.tail = 5;
  }

  draw() {
    ctx.fillStyle = "lime";
    let found = false;
    for (let i = 0; i < this.trail.length; i++) {
      const part = this.trail[i];
      ctx.fillRect(
        part.x * gridSize,
        part.y * gridSize,
        gridSize - 2,
        gridSize - 2
      );
      if (part.x === this.x && part.y === this.y) found = true;
    }
    if (!found) this.trail.push({ x: this.x, y: this.y });
    while (this.trail.length > this.tail) {
      this.trail.shift();
    }
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Apple {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
}

function showMessage(...msgs) {
  const messageContainer = document.createElement("div");
  messageContainer.innerHTML = msgs.join("<br/>");
  messageEl.replaceChildren(messageContainer);
}

let score, player, apple;
function init() {
  score = 0;
  scoreEl.innerHTML = score;
  player = new Player({
    x: Math.floor(GRID_COUNT / 2),
    y: Math.floor(GRID_COUNT / 2),
  });
  apple = new Apple({
    x: Math.floor(Math.random() * GRID_COUNT),
    y: Math.floor(Math.random() * GRID_COUNT),
  });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (timeoutId) {
    stopAnimate();
    showMessage("Press any arrow to start.");
  } else {
    showMessage("Welcome To Snake!", "Press any arrow key to start playing.");
  }
  gameInit = true;
  animate();
}

let timeoutId,
  animationId,
  playertakingToolongId,
  gameStarted = false,
  gameInit = false,
  fps = 15;

function stopAnimate() {
  clearTimeout(timeoutId);
  timeoutId = undefined;
  cancelAnimationFrame(animationId);
  clearInterval(playertakingToolongId);
  playertakingToolongId = undefined;
  gameInit = false;
  gameStarted = false;
}

function animate() {
  timeoutId = setTimeout(() => {
    animationId = requestAnimationFrame(animate);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    apple.draw();
    player.update();
    player.trail.forEach((part, index) => {
      if (index > 0 && part.x === player.x && part.y === player.y) {
        setTimeout(() => {
          showMessage(
            "Game Over!",
            "",
            `You got: ${score} points`,
            "",
            "Press space to play again."
          );
          stopAnimate();
        }, 2000 / fps);
      }
    });

    if (player.x < 0) {
      player.x = GRID_COUNT - 1;
    }
    if (player.x > GRID_COUNT - 1) {
      player.x = 0;
    }
    if (player.y < 0) {
      player.y = GRID_COUNT - 1;
    }
    if (player.y > GRID_COUNT - 1) {
      player.y = 0;
    }

    if (gameStarted && !playertakingToolongId) {
      playertakingToolongId = setInterval(() => {
        player.tail++;
      }, 5000);
    }
    if (apple.x === player.x && apple.y === player.y) {
      player.tail++;
      apple = new Apple({
        x: Math.floor(Math.random() * GRID_COUNT),
        y: Math.floor(Math.random() * GRID_COUNT),
      });
      score += 100;
      scoreEl.innerHTML = score;
      clearInterval(playertakingToolongId);
      playertakingToolongId = undefined;
    }
  }, 1000 / fps);
}

addEventListener("keydown", ({ code }) => {
  if (!gameInit && code === "Space") {
    init();
  }
  if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(code)) {
    if (!gameStarted && gameInit) {
      messageEl.innerHTML = "";
      gameStarted = true;
    }
    player.velocity = Player.directions[code];
  }
});

init();
