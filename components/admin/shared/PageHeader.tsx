import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  className,
  action,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[var(--muted-foreground)] mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex items-center shrink-0">{action}</div>}
    </header>
  );
}
