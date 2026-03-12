import { PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type GridProps = PropsWithChildren<{
  className?: string;
  columns?: "2" | "3" | "4";
}>;

export const Grid = ({ children, className, columns = "3" }: GridProps) => {
  const cols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };
  return (
    <div className={cn("grid gap-4", cols[columns], className)}>{children}</div>
  );
};
