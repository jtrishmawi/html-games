import { ScoreContext } from "contexts/Score/context";
import { ComponentType, ReactNode, useContext } from "react";

export const useScores = () => useContext(ScoreContext);

// export const withScores =
//   <T extends { children: ReactNode }>(Child: ComponentType<T>) =>
//   (props: T) =>
//     (
//       <ScoreContext.Consumer>
//         {(context) => <Child {...props} {...context} />}
//       </ScoreContext.Consumer>
//     );
