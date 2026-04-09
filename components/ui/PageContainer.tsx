import { PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type PageContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("mx-auto w-full px-4 py-8", className)}>{children}</div>
  );
};
