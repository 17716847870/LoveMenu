"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { registerMessage } from "@/lib/message";

type MessageType = "success" | "error" | "warning" | "info";

interface MessageContextType {
  show: (type: MessageType, content: string, duration?: number) => void;
  success: (content: string, duration?: number) => void;
  error: (content: string, duration?: number) => void;
  warning: (content: string, duration?: number) => void;
  info: (content: string, duration?: number) => void;
}

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const show = useCallback(
    (type: MessageType, content: string, duration = 3000) => {
      switch (type) {
        case "success":
          toast.success(content, { duration });
          break;
        case "error":
          toast.error(content, { duration });
          break;
        case "warning":
          toast.warning(content, { duration });
          break;
        case "info":
          toast.info(content, { duration });
          break;
      }
    },
    []
  );

  const success = useCallback((content: string, duration?: number) => {
    toast.success(content, { duration });
  }, []);

  const error = useCallback((content: string, duration?: number) => {
    toast.error(content, { duration });
  }, []);

  const warning = useCallback((content: string, duration?: number) => {
    toast.warning(content, { duration });
  }, []);

  const info = useCallback((content: string, duration?: number) => {
    toast.info(content, { duration });
  }, []);

  useEffect(() => {
    registerMessage({ show, success, error, warning, info });
  }, [show, success, error, warning, info]);

  const contextValue = useMemo(
    () => ({ show, success, error, warning, info }),
    [show, success, error, warning, info]
  );

  return <>{children}</>;
};

export const useMessage = (): MessageContextType => {
  return useMemo(
    () => ({
      show: (type: MessageType, content: string, duration?: number) => {
        switch (type) {
          case "success":
            toast.success(content, { duration });
            break;
          case "error":
            toast.error(content, { duration });
            break;
          case "warning":
            toast.warning(content, { duration });
            break;
          case "info":
            toast.info(content, { duration });
            break;
        }
      },
      success: (content: string, duration?: number) =>
        toast.success(content, { duration }),
      error: (content: string, duration?: number) =>
        toast.error(content, { duration }),
      warning: (content: string, duration?: number) =>
        toast.warning(content, { duration }),
      info: (content: string, duration?: number) =>
        toast.info(content, { duration }),
    }),
    []
  );
};
