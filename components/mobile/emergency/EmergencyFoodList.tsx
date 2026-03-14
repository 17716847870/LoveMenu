"use client";

import React from "react";
import EmergencyFoodItem from "./EmergencyFoodItem";
import { Dish } from "@/types";

interface EmergencyFoodListProps {
  dishes: Dish[];
  onQuickOrder: (dish: Dish) => void;
}

export default function EmergencyFoodList({ dishes, onQuickOrder }: EmergencyFoodListProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 pb-10">
      {dishes.map((dish) => (
        <EmergencyFoodItem
          key={dish.id}
          dish={dish}
          onQuickOrder={onQuickOrder}
        />
      ))}
    </div>
  );
}
