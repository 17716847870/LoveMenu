import { PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type BadgeProps = PropsWithChildren<{
  variant?: "default" | "success" | "warning";
  className?: string;
}>;

export const Badge = ({ children, variant = "default", className }: BadgeProps) => {
  const variants = {
    default: "bg-[var(--color-accent)] text-[var(--color-text)]",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
