import { Grid } from "./Grid.js";
import { Player } from "./Player.js";
import { Projectile } from "./Projectile.js";

const scoreEl = document.querySelector("#score span");
const messageEl = document.getElementById("message");

export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");

let width, height;
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
  })
);

class Sprite {
  constructor({ rows, columns, sprite }) {
    this.rows = rows;
    this.columns = columns;
    this.sprite = sprite;
    this.width = sprite.width / columns;
    this.height = sprite.height / rows;
    this.currentFrame = 0;
  }

  static async initialize({ rows, columns, url }) {
    const sprite = await createImage(url);
    return new Sprite({ rows, columns, sprite });
  }

  draw({ x, y }) {
    this.currentFrame++;
    let maxFrame = this.columns * this.rows - 1;
    if (this.currentFrame > maxFrame) {
      this.currentFrame = 0;
    }

    let column = this.currentFrame % this.columns;
    let row = Math.floor(this.currentFrame / this.columns);

    ctx.drawImage(
      this.sprite,
      column * this.width,
      row * this.height,
      this.width,
      this.height,
      x,
      y,
      this.width,
      this.height
    );
  }
}

async function createImage(url) {
  return new Promise((r) => {
    let i = new Image();
    i.onload = () => r(i);
    i.src = url;
  });
}

let player, projectiles, grids, keyPressed, score;
let shipImg, alien1Img, alien2Img, alien3Img;
async function init() {
  shipImg = await createImage("./img/ship-strip.png");
  alien1Img = await createImage("./img/alien-strip1.png");
  alien2Img = await createImage("./img/alien-strip2.png");
  alien3Img = await createImage("./img/alien-strip3.png");
  player = new Player({
    x: canvas.width / 2,
    image: shipImg,
    canvas,
    ctx,
  });
  projectiles = [];
  grids = [
    new Grid({
      x: 0,
      y: 0,
      columns: Math.floor(5 + Math.random() * 5),
      rows: Math.floor(3 + Math.random() * 2),
      image: [alien1Img, alien2Img, alien3Img][Math.floor(Math.random() * 3)],
    }),
  ];
  keyPressed = {
    ArrowLeft: {
      pressed: false,
    },
    ArrowRight: {
      pressed: false,
    },
  };
  score = 0;
  animate();
  setInterval(() => {
    grids.push(
      new Grid({
        x: 0,
        y: 0,
        columns: Math.floor(5 + Math.random() * 5),
        rows: Math.floor(3 + Math.random() * 2),
        image: [alien1Img, alien2Img, alien3Img][Math.floor(Math.random() * 3)],
      })
    );
  }, Math.floor((10 + Math.random() * 10) * 1000));
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();

  // Spaceship movement
  if (keyPressed.ArrowLeft.pressed) {
    player.velocity = Player.directions.ArrowLeft;
  } else if (keyPressed.ArrowRight.pressed) {
    player.velocity = Player.directions.ArrowRight;
  } else {
    player.velocity = 0;
  }

  // Spaceship x limitation
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + player.image.width > canvas.width) {
    player.x = canvas.width - player.image.width;
  }

  // display enemies
  grids.forEach((grid, gridIndex) => {
    grid.enemies.forEach((enemy, enemyIndex) => {
      if (grid.enemies.length === 0) {
        setTimeout(() => {
          grids.splice(gridIndex, 1);
          score += 250;
        }, 0);
      }

      // Check Collision between projectiles and enemies
      projectiles.forEach((projectile, projectileIndex) => {
        if (
          projectile.x + projectile.radius >= enemy.x &&
          projectile.x + projectile.radius <= enemy.x + enemy.image.width / 2 &&
          projectile.y + projectile.radius >= enemy.y &&
          projectile.y + projectile.radius <= enemy.y + enemy.image.height / 3
        ) {
          setTimeout(() => {
            grid.enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1);
            score += 100;
          }, 0);
        }
      });

      // Check Collision between player and enemies
      if (
        enemy.x >= player.x &&
        enemy.x <= player.x + player.image.width / 2 &&
        enemy.y + enemy.image.height / 3 >= player.y
      ) {
        setTimeout(() => {
          grids = [];
        }, 0);
        setTimeout(() => {
          player.lose();
          cancelAnimationFrame(animationId);
          animationId = undefined;
        }, 1000 / 16);
      }
    });

    grid.update();
  });

  // Spaceship bullets
  for (let i = 0; i < projectiles.length; i++) {
    const projectile = projectiles[i];
    projectile.update();
    if (
      projectile.y - projectile.radius < 0 ||
      projectile.y + projectile.radius > canvas.width
    ) {
      setTimeout(() => {
        projectiles.splice(i, 1);
      }, 0);
    }
  }

  scoreEl.innerHTML = score;
}

addEventListener("load", () => {
  init();

  function shoot() {
    for (let i = 0; i < 1; i++) {
      setTimeout(
        () =>
          projectiles.push(
            new Projectile({
              x: player.x + player.image.width / 6,
              y: player.y,
            })
          ),
        i * 100
      );
    }
  }

  addEventListener("keydown", ({ code }) => {
    if (["ArrowLeft", "ArrowRight"].includes(code)) {
      keyPressed[code].pressed = true;
    }
    if (code === "Space") {
      shoot();
    }
    if (!animationId && code === "Enter") {
      init();
    }
  });

  addEventListener("keyup", ({ code }) => {
    if (["ArrowLeft", "ArrowRight"].includes(code)) {
      keyPressed[code].pressed = false;
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    let rect = e.target.getBoundingClientRect();
    player.x = (+e.clientX - rect.left) | 0;
  });

  canvas.addEventListener("mousedown", (e) => {
    shoot();
  });
});
