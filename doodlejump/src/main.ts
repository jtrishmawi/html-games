import { Board } from "./classes/Board";
import { Doodler } from "./classes/Doodler";
import { PlatformSpawner } from "./classes/PlatformSpawner";
import "./style.css";

let board: Board, doodler: Doodler, spawner: PlatformSpawner, gameOver: boolean;

function setup() {
  gameOver = false;
  board = new Board();
  doodler = new Doodler();
  spawner = new PlatformSpawner();

  animate();
}

function animate() {
  if (gameOver) return;
  requestAnimationFrame(animate);

  board.clear();

  doodler.update();
  doodler.show();

  if (doodler.y > Board.height) {
    gameOver = true;
  }

  for (let i = 0; i < spawner.platforms.length; i++) {
    const platform = spawner.platforms[i];

    if (doodler.velY < 0 && doodler.y < Board.height * (3 / 4)) {
      platform.y += 8;
    }

    if (doodler.collides(platform) && doodler.velY >= 0) {
      doodler.velY = -8;
    }

    platform.show();
  }

  while (
    spawner.platforms.length > 0 &&
    spawner.platforms[0].y > Board.height
  ) {
    spawner.platforms.shift();
    spawner.spawn();
  }

  board.updateScore(doodler);

  if (gameOver) {
    board.gameOver();
  }
}

document.addEventListener("DOMContentLoaded", setup);
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight" || e.code === "KeyD") {
    doodler.moveRight();
  } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
    doodler.moveLeft();
  } else if (e.code === "Space" && gameOver) {
    setup();
  }
});
