import { ChatMessage } from "../../types";
import { cn } from "../../utils/format";
import { formatDate } from "../../utils/format";

type ChatBubbleProps = {
  message: ChatMessage;
  isSelf?: boolean;
};

export const ChatBubble = ({ message, isSelf }: ChatBubbleProps) => {
  return (
    <div className={cn("flex", isSelf ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs rounded-2xl px-4 py-2 text-sm",
          isSelf
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-accent)] text-[var(--color-text)]",
        )}
      >
        <div>{message.content}</div>
        <div className="mt-1 text-[10px] text-white/70">
          {formatDate(message.createdAt)}
        </div>
      </div>
    </div>
  );
};
