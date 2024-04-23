import { Board } from "./Board";
import rightImage from "../assets/doodler-right.png";
import leftImage from "../assets/doodler-left.png";
import { Platform } from "./Platform";

export class Doodler {
  static width = 46;
  static height = 46;
  x: number;
  y: number;
  velX = 0;
  velY = -8;
  gravity = 0.5;
  img: HTMLImageElement | null = null;
  rightImg: HTMLImageElement | null = null;
  leftImg: HTMLImageElement | null = null;
  constructor() {
    this.x = Board.width / 2 - Doodler.width / 2;
    this.y = Board.height * (7 / 8) - Doodler.height;
    this.rightImg = new Image();
    this.rightImg.src = rightImage;
    this.rightImg.onload = () => {
      this.img = this.rightImg;
    };

    this.leftImg = new Image();
    this.leftImg.src = leftImage;
  }

  show() {
    // Board.context.fillStyle = "green";
    // Board.context.fillRect(this.x, this.y, Doodler.width, Doodler.height);
    if (!this.img) return;
    Board.context.drawImage(
      this.img,
      this.x,
      this.y,
      Doodler.width,
      Doodler.height
    );
  }

  update() {
    this.x += this.velX;

    if (this.x > Board.width) {
      this.x = 0;
    } else if (this.x + Doodler.width < 0) {
      this.x = Board.width;
    }

    this.velY += this.gravity;
    this.y += this.velY;
  }

  moveRight() {
    this.velX = 4;
    this.img = this.rightImg;
  }

  moveLeft() {
    this.velX = -4;
    this.img = this.leftImg;
  }

  collides(platform: Platform) {
    return (
      this.x < platform.x + Platform.width &&
      this.x + Doodler.width > platform.x &&
      this.y < platform.y + Platform.height &&
      this.y + Doodler.height > platform.y
    );
  }
}
