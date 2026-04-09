import { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/format";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md";
};

export const IconButton = ({
  className,
  size = "md",
  ...props
}: IconButtonProps) => {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-text)] transition",
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
