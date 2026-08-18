import React from "react";
import styles from "./Card.module.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={`${styles.card} ${className || ""}`.trim()} {...props}>
      {children}
    </div>
  );
};
