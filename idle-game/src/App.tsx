import Board from "Board";
import { ScoreProvider } from "contexts/Score/provider";

function App() {
  return (
    <ScoreProvider>
      <Board />
    </ScoreProvider>
  );
}

export default App;
