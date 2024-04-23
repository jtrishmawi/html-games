import { Board } from "./Board";
import { Platform } from "./Platform";

export class PlatformSpawner {
  platforms: Platform[] = [];
  constructor() {
    this.platforms.push(new Platform(Board.width / 2, Board.height - 50));
    for (let i = 0; i < 6; i++) {
      let randomX = Math.floor(Math.random() * Board.width * (3 / 4));
      this.platforms.push(new Platform(randomX, Board.height - 75 * i - 150));
    }
  }
  spawn() {
    let randomX = Math.floor(Math.random() * Board.width * (3 / 4));
    this.platforms.push(new Platform(randomX, -Platform.height));
  }
}
