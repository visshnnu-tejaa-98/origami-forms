import React from "react";
import { Icon } from "../../components/icons";

type ErrorComponentProps = {
  message: string;
  onClick: () => void;
};

const ErrorComponent = (props: ErrorComponentProps) => {
  const { message, onClick } = props;
  return (
    <div className="forms-empty">
      <span className="art">
        <Icon name="crane" size={72} />
      </span>
      <h3>That didn&apos;t unfold.</h3>
      <p>{message}</p>
      <button className="o-btn o-btn--accent o-btn--lg" onClick={() => onClick()}>
        <Icon name="arrow" size={15} /> Try again
      </button>
    </div>
  );
};

export default ErrorComponent;
