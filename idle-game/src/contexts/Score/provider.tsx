import { ScoreContext } from "contexts/Score/context";
import { ReactNode, useState } from "react";

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);

  const addScore = (scoreToAdd: number) =>
    setScore((score) => score + scoreToAdd);
    
  return (
    <ScoreContext.Provider value={{ score, addScore }}>
      {children}
    </ScoreContext.Provider>
  );
};
