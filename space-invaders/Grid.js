import { Enemy } from "./Enemy.js";
import { canvas } from "./index.js";

export class Grid {
  constructor({ x, y, columns, rows, image }) {
    this.x = x;
    this.y = y;
    this.columns = columns;
    this.rows = rows;
    this.image = image;
    this.velocity = 3;

    const enemies = [];
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        enemies.push(
          new Enemy({
            x: column * (15 + this.image.width / 2),
            y: 10 + row * (15 + this.image.height / 3),
            image: this.image,
          })
        );
      }
    }
    this.enemies = enemies;
  }

  draw() {
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
  }

  update() {
    this.draw();
    this.x += this.velocity;
    if (
      this.x + this.columns * (15 + this.image.width / 2) > canvas.width ||
      this.x < 0
    ) {
      this.velocity = -this.velocity;
      this.y += 15 + this.image.height / 3;
    }
    this.enemies.forEach((enemy, index) => {
      enemy.x += this.velocity;
      enemy.y =
        this.y +
        10 +
        Math.floor(index / this.columns) * (15 + this.image.height / 3);
    });
  }
}
