import { ClickerContext } from "contexts/Clicker/context";
import { ComponentType, ReactNode, useContext } from "react";

export const useClicker = () => useContext(ClickerContext);

// export const withClicker =
//   <T extends { children: ReactNode }>(Child: ComponentType<T>) =>
//   (props: T) =>
//     (
//       <ClickerContext.Consumer>
//         {(context) => <Child {...props} {...context} />}
//       </ClickerContext.Consumer>
//     );
