import { ctx } from "./index.js";

export class Enemy {
  constructor({ x, y, image }) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.currentFrame = 0;
    this.skipAnimationCounter = 0;
  }

  draw() {
    ctx.drawImage(
      this.image,
      (this.image.width / 2) * this.currentFrame,
      0,
      this.image.width / 2,
      this.image.height / 3,
      this.x,
      this.y,
      this.image.width / 2,
      this.image.height / 3
    );
  }
  update() {
    this.skipAnimationCounter++;
    if (this.skipAnimationCounter >= 20) {
      this.currentFrame = (this.currentFrame + 1) % 2;
      this.skipAnimationCounter = 0;
    }
    this.draw();
  }
}
