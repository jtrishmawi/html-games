import Button from "components/Button";
import Checkbox from "components/Checkbox";
import { useClicker } from "contexts/Clicker/hooks";
import styles from "./Clicker.module.css";

const Clicker = () => {
  const { auto, value, toggleAuto, tick } = useClicker();

  return (
    <article className={styles.clicker}>
      <label>
        <Checkbox defaultChecked={auto} onChange={toggleAuto} />
        Auto
      </label>
      <Button onClick={tick} />
      <span>{value} times</span>
    </article>
  );
};

export default Clicker;
