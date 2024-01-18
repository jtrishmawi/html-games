import { createContext } from "react";

type ScoreContextType = {
  score: number;
  addScore: (newScore: number) => void;
};

export const ScoreContext = createContext<ScoreContextType>({
  score: 0,
} as ScoreContextType);
