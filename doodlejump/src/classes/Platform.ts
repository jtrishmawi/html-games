import platformImg from "../assets/platform.png";
import { Board } from "./Board";

export class Platform {
  static width = 60;
  static height = 18;
  x: number;
  y: number;
  img: HTMLImageElement | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = platformImg;
  }

  show() {
    if (!this.img) return;
    Board.context.drawImage(
      this.img,
      this.x,
      this.y,
      Platform.width,
      Platform.height
    );
  }
}
