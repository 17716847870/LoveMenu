import { Button } from "@/components/ui/Button";
import { Mic, Square } from "lucide-react";
import { useState } from "react";

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);

  return (
    <Button
      variant={recording ? "destructive" : "secondary"}
      size="icon"
      className="rounded-full"
      onClick={() => setRecording(!recording)}
    >
      {recording ? <Square size={20} /> : <Mic size={20} />}
    </Button>
  );
}
