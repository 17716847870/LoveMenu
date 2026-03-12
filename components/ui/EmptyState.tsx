import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <div className="mb-4 text-4xl text-muted-foreground">{icon || "🤔"}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-6 text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
