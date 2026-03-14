"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import FeedbackItem from "./FeedbackItem";
import { Feedback } from "@/types";

interface FeedbackListProps {
  feedbacks: Feedback[];
  onEdit: (feedback: Feedback) => void;
  onDelete: (id: string) => void;
}

export default function FeedbackList({ feedbacks, onEdit, onDelete }: FeedbackListProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 pb-24">
      <AnimatePresence>
        {feedbacks.map((feedback) => (
          <FeedbackItem
            key={feedback.id}
            feedback={feedback}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
