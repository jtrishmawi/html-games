import Board from "./Board";
import Square, { SquareValue } from "./Square";

export class Game {
  public static SIZE = 10;
  public static bombAmount = 10;
  public static flags = 0;
  public static isGameOver = false;
  public static board: Board;
  public static results = document.querySelector<HTMLDivElement>("#results");
  public static flagsLeft =
    document.querySelector<HTMLDivElement>("#flags-left");

  constructor() {
    // const squaresValue = ['valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'bomb', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'bomb', 'valid', 'valid', 'bomb', 'valid', 'valid', 'valid', 'valid', 'valid', 'bomb', 'bomb', 'valid', 'valid', 'bomb', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'bomb', 'valid', 'valid', 'bomb', 'bomb', 'bomb']
    const squaresValue = [
      ...Array(Game.SIZE * Game.SIZE - Game.bombAmount).fill("valid"),
      ...Array(Game.bombAmount).fill("bomb"),
    ].sort(() => Math.random() - 0.5);
    // console.log(squaresValue);
    const squares = squaresValue.map(
      (value, index) => new Square(index, value as SquareValue)
    );

    Game.board = new Board(squares);
  }

  static gameOver() {
    let matches = 0;
    for (let i = 0; i < Board.squares.length; i++) {
      const square = Board.squares[i];
      if (square.flagged === true && square.value === "bomb") {
        matches++;
      }
    }
    Game.results!.innerHTML = `You Lose! found ${matches} out of ${Game.bombAmount} bombs`;
    Game.isGameOver = true;

    Board.squares.forEach((square) => {
      if (square.value === "bomb") {
        square.checked = true;
        square.show();
      }
    });
  }

  static checkForWin() {
    let matches = 0;

    for (let i = 0; i < Board.squares.length; i++) {
      const square = Board.squares[i];
      if (square.flagged === true && square.value === "bomb") {
        matches++;
      }
      if (matches === Game.bombAmount) {
        Game.results!.innerHTML = `You Win!`;
        Game.isGameOver = true;
      }
    }
  }
}
