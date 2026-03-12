import { PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export const Card = ({ children, className }: CardProps) => (
  <div
    className={cn(
      "rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 text-[var(--color-text)] shadow-sm",
      className,
    )}
  >
    {children}
  </div>
);
