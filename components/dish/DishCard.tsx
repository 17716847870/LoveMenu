import { Dish } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heart, User } from "lucide-react";
import Link from "next/link";

interface DishCardProps {
  dish: Dish;
  onAddToCart: (dish: Dish) => void;
}

export default function DishCard({ dish, onAddToCart }: DishCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Link href={`/menu/${dish.id}`} className="block relative aspect-[4/3] bg-muted w-full">
        {/* Placeholder for image */}
        {dish.image ? (
            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/30">
                🍽️
            </div>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/menu/${dish.id}`}>
            <h3 className="font-semibold text-lg">{dish.name}</h3>
        </Link>
        {dish.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{dish.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1">
          {dish.kissPrice > 0 && (
            <span className="flex items-center gap-1 text-pink-500 font-medium">
              <Heart size={16} fill="currentColor" /> {dish.kissPrice}
            </span>
          )}
          {dish.hugPrice > 0 && (
            <span className="flex items-center gap-1 text-orange-500 font-medium">
              <User size={16} /> {dish.hugPrice}
            </span>
          )}
        </div>
        <Button 
            className="w-full mt-2 rounded-full" 
            size="sm"
            onClick={() => onAddToCart(dish)}
        >
            加入购物车
        </Button>
      </div>
    </Card>
  );
}
