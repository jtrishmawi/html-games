import { ctx } from "./index.js";

export class Projectile {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.radius = 3;
    this.velocity = -5;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.y += this.velocity;
  }
}
