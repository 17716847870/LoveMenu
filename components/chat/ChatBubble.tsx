import { Avatar } from "@/components/ui/Avatar";

// Simple cn replacement
function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ChatBubbleProps {
  message: {
    id: string;
    content: string;
    isSender: boolean;
    type: "text" | "image" | "voice" | "emoji";
    createdAt: string;
  };
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isSender = message.isSender;
  
  return (
    <div className={classNames("flex gap-3 w-full", isSender ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="h-8 w-8" />
      <div
        className={classNames(
          "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
          isSender
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted text-muted-foreground rounded-tl-none"
        )}
      >
        {message.type === "text" && <p>{message.content}</p>}
        {message.type === "image" && (
            <img src={message.content} alt="image" className="rounded-lg max-w-full" />
        )}
        {message.type === "emoji" && <span className="text-4xl">{message.content}</span>}
        {/* Voice placeholder */}
        {message.type === "voice" && <span>🎤 语音消息</span>}
      </div>
    </div>
  );
}
