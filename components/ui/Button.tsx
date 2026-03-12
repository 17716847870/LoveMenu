import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
  }>;

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition disabled:opacity-60";
  const variants = {
    primary: "bg-[var(--color-primary)] text-white",
    secondary: "bg-[var(--color-accent)] text-[var(--color-text)]",
    ghost: "bg-transparent text-[var(--color-text)]",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
