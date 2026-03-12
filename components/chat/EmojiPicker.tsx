import { cn } from "../../utils/format";

const emojis = ["💗", "💋", "🤗", "✨", "🍓", "🍰"];

type EmojiPickerProps = {
  onSelect?: (emoji: string) => void;
  className?: string;
};

export const EmojiPicker = ({ onSelect, className }: EmojiPickerProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {emojis.map((emoji) => (
        <button
          key={emoji}
          className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-sm"
          onClick={() => onSelect?.(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
