import { ClickerContext } from "contexts/Clicker/context";
import { useScores } from "contexts/Score/hooks";
import { ReactNode, useCallback, useEffect, useState } from "react";

export const ClickerProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState(0);
  const [auto, setAuto] = useState(false);
  const { addScore } = useScores();

  const toggleAuto = () => setAuto((v) => !v);

  const tick = useCallback(() => {
    setValue((v) => v + 1);
    addScore(1);
  }, [addScore]);

  useEffect(() => {
    let interval: number | undefined;
    if (auto) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [auto, tick]);

  return (
    <ClickerContext.Provider value={{ tick, toggleAuto, auto, value }}>
      {children}
    </ClickerContext.Provider>
  );
};
