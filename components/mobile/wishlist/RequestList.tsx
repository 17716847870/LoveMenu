"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import RequestItem from "./RequestItem";
import { FoodRequest } from "@/types";

interface RequestListProps {
  requests: FoodRequest[];
  onEdit: (request: FoodRequest) => void;
  onDelete: (id: string) => void;
}

export default function RequestList({ requests, onEdit, onDelete }: RequestListProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 pb-24">
      <AnimatePresence>
        {requests.map((request) => (
          <RequestItem
            key={request.id}
            request={request}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
