import { PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type ModalProps = PropsWithChildren<{
  open: boolean;
  title?: string;
  onClose?: () => void;
}>;

export const Modal = ({ open, title, children, onClose }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-[var(--color-card)] p-6 text-[var(--color-text)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className={cn(
              "rounded-full bg-[var(--color-accent)] px-3 py-1 text-sm",
            )}
            onClick={onClose}
          >
            关闭
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
