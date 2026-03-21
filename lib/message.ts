import { MessageType } from "@/components/ui/Message/Toast";

let messageFuncs: {
  show: (type: MessageType, content: string, duration?: number) => void;
  success: (content: string, duration?: number) => void;
  error: (content: string, duration?: number) => void;
  warning: (content: string, duration?: number) => void;
  info: (content: string, duration?: number) => void;
} | null = null;

export const registerMessage = (
  funcs: typeof messageFuncs
) => {
  messageFuncs = funcs;
};

export const message = {
  show: (type: MessageType, content: string, duration?: number) => {
    if (messageFuncs) {
      messageFuncs.show(type, content, duration);
    }
  },
  success: (content: string, duration?: number) => {
    if (messageFuncs) {
      messageFuncs.success(content, duration);
    }
  },
  error: (content: string, duration?: number) => {
    if (messageFuncs) {
      messageFuncs.error(content, duration);
    }
  },
  warning: (content: string, duration?: number) => {
    if (messageFuncs) {
      messageFuncs.warning(content, duration);
    }
  },
  info: (content: string, duration?: number) => {
    if (messageFuncs) {
      messageFuncs.info(content, duration);
    }
  },
};
