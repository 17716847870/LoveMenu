import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mic, Image as ImageIcon, Smile, Send } from "lucide-react";
import { useState } from "react";

interface MessageInputProps {
  onSend: (content: string, type: "text" | "image" | "voice" | "emoji") => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text, "text");
    setText("");
  };

  return (
    <div className="flex items-center gap-2 p-2 border-t bg-background">
      <Button variant="ghost" size="icon" className="rounded-full">
        <Mic size={20} />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full">
        <ImageIcon size={20} />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Smile size={20} />
      </Button>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="说点什么..."
        className="flex-1 rounded-full bg-muted/50 border-transparent focus:bg-background"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button
        size="icon"
        className="rounded-full"
        onClick={handleSend}
        disabled={!text.trim()}
      >
        <Send size={18} />
      </Button>
    </div>
  );
}
