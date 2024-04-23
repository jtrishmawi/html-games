import { Doodler } from "./Doodler";

export class Board {
  static width = 360;
  static height = 576;
  static canvas: HTMLCanvasElement = document.getElementById(
    "board"
  ) as HTMLCanvasElement;
  static context: CanvasRenderingContext2D = Board.canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  score = 0;
  maxScore = 0;

  constructor() {
    Board.canvas.height = Board.height;
    Board.canvas.width = Board.width;
  }

  clear() {
    Board.context.clearRect(0, 0, Board.width, Board.height);
  }

  updateScore(doodler: Doodler) {
    let points = Math.floor(50 * Math.random());
    if (doodler.velY < 0) {
      this.maxScore += points;
      if (this.score < this.maxScore) {
        this.score = this.maxScore;
      }
    } else if (doodler.velY >= 0) {
      this.maxScore -= points;
    }
    // this.score += points;
    Board.context.fillStyle = "black";
    Board.context.font = "16px sans-serif";
    Board.context.fillText(this.score.toString(), 5, 20);
  }

  gameOver() {
    Board.context.fillStyle = "black";
    Board.context.font = "16px sans-serif";
    Board.context.fillText(
      "Game over: Press 'Space' to restart",
      Board.width / 7,
      Board.height * (7 / 8)
    );
  }
}
