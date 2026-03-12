import { PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type EmptyStateProps = PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
}>;

export const EmptyState = ({
  title,
  description,
  className,
  children,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-card)] px-6 py-10 text-center",
      className,
    )}
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    {description ? (
      <p className="text-sm text-[var(--color-muted)]">{description}</p>
    ) : null}
    {children}
  </div>
);
