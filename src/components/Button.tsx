import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const Button = ({ variant = "primary", children, className, ...props }: ButtonProps) => {
  const combinedClassName = `${styles.button} ${styles[variant]} ${className || ""}`.trim();
  
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
