import { useState } from "react";
import { Button } from "../ui/Button";

export const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);

  return (
    <Button
      variant={recording ? "primary" : "secondary"}
      size="sm"
      onClick={() => setRecording((prev) => !prev)}
    >
      {recording ? "录音中" : "语音"}
    </Button>
  );
};
