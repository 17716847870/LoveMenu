"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { ToastContainer, ToastItem } from "./ToastContainer";
import { MessageType } from "./Toast";
import { registerMessage } from "@/lib/message";

interface MessageContextType {
  show: (type: MessageType, content: string, duration?: number) => void;
  success: (content: string, duration?: number) => void;
  error: (content: string, duration?: number) => void;
  warning: (content: string, duration?: number) => void;
  info: (content: string, duration?: number) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((type: MessageType, content: string, duration = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, content, duration }]);
  }, []);

  const success = useCallback((content: string, duration?: number) => {
    show("success", content, duration);
  }, [show]);

  const error = useCallback((content: string, duration?: number) => {
    show("error", content, duration);
  }, [show]);

  const warning = useCallback((content: string, duration?: number) => {
    show("warning", content, duration);
  }, [show]);

  const info = useCallback((content: string, duration?: number) => {
    show("info", content, duration);
  }, [show]);

  const handleClose = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    registerMessage({ show, success, error, warning, info });
  }, [show, success, error, warning, info]);

  const contextValue = useMemo(
    () => ({ show, success, error, warning, info }),
    [show, success, error, warning, info]
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onClose={handleClose} />
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
