import { HTMLAttributes } from "react";

const Checkbox = (props: HTMLAttributes<HTMLInputElement>) => {
  return <input type="checkbox" {...props} />;
};

export default Checkbox;
