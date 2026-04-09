import { PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type TabsProps = PropsWithChildren<{
  items: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
}>;

export const Tabs = ({ items, activeId, onChange, children }: TabsProps) => {
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm",
              activeId === item.id
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-accent)] text-[var(--color-text)]"
            )}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
};
