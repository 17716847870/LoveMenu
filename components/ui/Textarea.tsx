import { TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/format";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea
    className={cn(
      "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]",
      className
    )}
    {...props}
  />
);
