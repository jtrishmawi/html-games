import Clicker from "components/Clicker";
import { ClickerProvider } from "contexts/Clicker/provider";
import { useScores } from "contexts/Score/hooks";

const Board = () => {
  const { score } = useScores();
  return (
    <>
      <p>Score: {score}</p>
      {[...Array(10)].map((_, key) => (
        <ClickerProvider key={key}>
          <Clicker />
        </ClickerProvider>
      ))}
    </>
  );
};

export default Board;
