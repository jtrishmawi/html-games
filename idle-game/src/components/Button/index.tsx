import { HTMLAttributes } from "react";

const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button type="button" {...props}>
      {props.children ?? "Hit"}
    </button>
  );
};

export default Button;
