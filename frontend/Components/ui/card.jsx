import React from "react";
import clsx from "clsx";

const Card = ({ children, className }) => {
  return (
    <div className={clsx("rounded-lg shadow-sm", className)}>
      {children}
    </div>
  );
};

export default Card;
