"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type MessageType = "success" | "error" | "warning" | "info";

export interface MessageProps {
  id: string;
  type: MessageType;
  content: string;
  duration?: number;
  onClose: (id: string) => void;
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styleMap = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-500",
    text: "text-green-800",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-500",
    text: "text-red-800",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "text-yellow-500",
    text: "text-yellow-800",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-500",
    text: "text-blue-800",
  },
};

export const Toast: React.FC<MessageProps> = ({
  id,
  type,
  content,
  duration = 3000,
  onClose,
}) => {
  const Icon = iconMap[type];
  const styles = styleMap[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm w-full pointer-events-auto`}
    >
      <Icon className={`${styles.icon} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <div className={`${styles.text} flex-1 text-sm font-medium break-words`}>
        {content}
      </div>
      <button
        onClick={() => onClose(id)}
        className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
