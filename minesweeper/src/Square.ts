import Board from "./Board";
import { Game } from "./Game";

export type SquareValue = "valid" | "bomb";
export default class Square {
  public index: number;
  public value: SquareValue;
  public total: number;
  public checked: boolean;
  public flagged: boolean;
  public element: HTMLDivElement;
  private digits = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  constructor(index: number, value: SquareValue) {
    this.index = index;
    this.value = value;
    this.checked = false;
    this.flagged = false;
    this.element = document.createElement("div");
    this.total = 0;
  }

  reveal = () => {
    if (Game.isGameOver || this.checked || this.flagged) return;
    if (this.value === "bomb") {
      Game.gameOver();
    } else {
      this.checked = true;
      this.show();
      if (this.total === 0) Board.checkNeighbors(this);
      return;
    }
    this.checked = true;
  };

  flag = (e: MouseEvent) => {
    debugger;
    e.preventDefault();
    if (Game.isGameOver) return;
    if (!this.checked && Game.flags < Game.bombAmount) {
      if (!this.flagged) {
        this.flagged = true;
        Game.flags++;
        Game.flagsLeft!.innerHTML = (Game.bombAmount - Game.flags).toString();
        this.show();
      } else {
        this.flagged = false;
        Game.flags--;
        Game.flagsLeft!.innerHTML = (Game.bombAmount - Game.flags).toString();
        this.show();
      }
    }
  };

  show() {
    if (this.flagged) {
      this.element.innerHTML = "🚩";
    } else if (this.value === "bomb") {
      this.element.innerHTML = "💣";
    } else if (this.checked) {
      if (this.total > 0) {
        this.element.classList.add(this.digits[this.total]!);
        this.element.innerHTML = this.total.toString();
      }
    } else{
      this.element.innerHTML = "";
    }
    this.element.classList.toggle("revealed");
  }
}
