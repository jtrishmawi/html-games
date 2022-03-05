import { canvas, ctx } from "./index.js";

export class Player {
  static directions = {
    ArrowLeft: -5,
    ArrowRight: 5,
  };

  static loseAnimation = [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ];

  constructor({ x, image }) {
    this.image = image;
    this.x = x;
    this.y = canvas.height - this.image.height / 2 - 40;
    this.velocity = 0;
  }

  draw() {
    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width / 3,
      this.image.height / 2,
      this.x,
      this.y,
      this.image.width / 3,
      this.image.height / 2
    );
  }

  update() {
    this.draw();
    this.x += this.velocity;
  }

  lose() {
    const animation = [];
    for (let i = 0; i < Player.loseAnimation.length * 2; i++) {
      animation.push(
        new Promise((resolve) => {
          setTimeout(() => {
            const element =
              Player.loseAnimation[i % Player.loseAnimation.length];
            ctx.clearRect(
              this.x,
              this.y,
              this.image.width / 3,
              this.image.height / 2
            );
            ctx.drawImage(
              this.image,
              (element.x * this.image.width) / 3,
              (element.y * this.image.height) / 2,
              this.image.width / 3,
              this.image.height / 2,
              this.x,
              this.y,
              this.image.width / 3,
              this.image.height / 2
            );
            resolve();
          }, i * 100);
        })
      );
    }
    Promise.all(animation).then(() => {
      this.draw();
    });
  }
}
