import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  fullScreen?: boolean;
  overlay?: boolean;
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  variant = "spinner",
  fullScreen = false,
  overlay = false,
  text,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const Spinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} text-primary`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );

  const Dots = () => (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2 h-2" : "w-3 h-3"} bg-primary rounded-full`}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-primary/20 rounded-full`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="w-full h-full bg-primary rounded-full"
        animate={{ scale: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );

  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return <Spinner />;
      case "dots":
        return <Dots />;
      case "pulse":
        return <Pulse />;
      default:
        return <Spinner />;
    }
  };

  const loadingContent = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      {renderLoader()}
      {text && (
        <p className={`${textSizes[size]} text-muted-foreground font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <div className="bg-card rounded-xl shadow-lg p-8">{loadingContent}</div>
      </motion.div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

export const CardLoading: React.FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className = "",
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(rows)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-lg border p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-muted rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 bg-muted rounded w-1/3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-3 bg-muted rounded w-1/2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const TableLoading: React.FC<{ columns?: number; rows?: number }> = ({
  columns = 4,
  rows = 5,
}) => {
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="border-b bg-muted/50 px-4 py-3">
        <div className="flex gap-4">
          {[...Array(columns)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-4 bg-muted rounded ${i === 0 ? "w-1/4" : "w-1/6"}`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      </div>
      {[...Array(rows)].map((_, rowIndex) => (
        <motion.div
          key={rowIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: rowIndex * 0.05 }}
          className="border-b last:border-b-0 px-4 py-3"
        >
          <div className="flex gap-4 items-center">
            {[...Array(columns)].map((_, colIndex) => (
              <motion.div
                key={colIndex}
                className={`h-4 bg-muted/50 rounded ${
                  colIndex === 0 ? "w-1/4" : "w-1/6"
                }`}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: (rowIndex * columns + colIndex) * 0.02,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const InlineLoading: React.FC<{
  text?: string;
  className?: string;
}> = ({ text = "加载中...", className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-4 h-4 text-muted-foreground"
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
};

export const PageLoading: React.FC<{ text?: string }> = ({
  text = "加载中",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 text-primary"
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      <p className="text-lg text-muted-foreground font-medium">{text}...</p>
    </motion.div>
  );
};
