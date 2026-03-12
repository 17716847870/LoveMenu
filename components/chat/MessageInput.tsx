import { FormEvent, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type MessageInputProps = {
  onSend: (value: string) => void;
};

export const MessageInput = ({ onSend }: MessageInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="发送一句甜甜的话"
      />
      <Button type="submit">发送</Button>
    </form>
  );
};
