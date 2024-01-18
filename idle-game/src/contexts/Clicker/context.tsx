import { createContext } from "react";

type ClickerContextType = {
  tick: () => void;
  toggleAuto: () => void;
  auto: boolean;
  value: number;
};

export const ClickerContext = createContext<ClickerContextType>({
  auto: false,
  value: 0,
} as ClickerContextType);
