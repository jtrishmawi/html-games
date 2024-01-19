import Square from "./Square";
import { Game } from "./Game";

export default class Board {
  public static squares: Square[] = [];
  public grid = document.querySelector<HTMLDivElement>("#grid");
  constructor(squares: Square[]) {
    this.grid?.replaceChildren();
    Board.squares = squares;
    this.createBoard();
  }
  createBoard() {
    Game.flagsLeft!.innerHTML = Game.bombAmount.toString();
    Board.squares.forEach((square) => {
      square.element.setAttribute("id", square.index.toString());
      this.grid?.appendChild(square.element);
      square.element.addEventListener("click", square.reveal);
      square.element.addEventListener("contextmenu", square.flag);
    });

    for (let i = 0; i < Board.squares.length; i++) {
      const square = Board.squares[i];
      let total = 0;
      const isLeftEdge = i % Game.SIZE === 0;
      const isRightEdge = i % Game.SIZE === Game.SIZE - 1;

      if (square.value === "bomb") continue;
      if (i > 0 && !isLeftEdge && Board.squares[i - 1].value === "bomb")
        total++;
      if (
        i > 9 &&
        !isRightEdge &&
        Board.squares[i + 1 - Game.SIZE].value === "bomb"
      )
        total++;
      if (i > 10 && Board.squares[i - Game.SIZE].value === "bomb") total++;
      if (
        i > 11 &&
        !isLeftEdge &&
        Board.squares[i - 1 - Game.SIZE].value === "bomb"
      )
        total++;
      if (
        i > 11 &&
        !isRightEdge &&
        Board.squares[i + 1 - Game.SIZE].value === "bomb"
      )
        total++;
      if (i < 98 && !isRightEdge && Board.squares[i + 1].value === "bomb")
        total++;
      if (
        i < 90 &&
        !isLeftEdge &&
        Board.squares[i - 1 + Game.SIZE].value === "bomb"
      )
        total++;
      if (
        i < 88 &&
        !isRightEdge &&
        Board.squares[i + 1 + Game.SIZE].value === "bomb"
      )
        total++;
      if (i < 89 && Board.squares[i + Game.SIZE].value === "bomb") total++;

      square.total = total;
    }
  }

  static checkNeighbors = (square: Square) => {
    const isLeftEdge = square.index % Game.SIZE === 0;
    const isRightEdge = square.index % Game.SIZE === Game.SIZE - 1;

    setTimeout(() => {
      if (square.index > 0 && !isLeftEdge) {
        this.squares[square.index - 1].reveal();
      }
      if (square.index > 9 && !isRightEdge) {
        this.squares[square.index + 1 - Game.SIZE].reveal();
      }
      if (square.index > 10) {
        this.squares[square.index - Game.SIZE].reveal();
      }
      if (square.index > 11 && !isLeftEdge) {
        this.squares[square.index - 1 - Game.SIZE].reveal();
      }
      if (square.index > 11 && !isRightEdge) {
        this.squares[square.index + 1 - Game.SIZE].reveal();
      }
      if (square.index < 98 && !isRightEdge) {
        this.squares[square.index + 1].reveal();
      }
      if (square.index < 90 && !isLeftEdge) {
        this.squares[square.index - 1 + Game.SIZE].reveal();
      }
      if (square.index < 88 && !isRightEdge) {
        this.squares[square.index + 1 + Game.SIZE].reveal();
      }
    }, 10);
  };
}
