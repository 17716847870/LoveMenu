import { CartItem as CartItemType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Heart, User, Minus, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";


interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateNote: (id: string, note: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onUpdateNote }: CartItemProps) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{item.dish.name}</h3>
          <div className="flex items-center gap-3 text-sm mt-1">
            {item.dish.kissPrice > 0 && (
              <span className="flex items-center gap-1 text-pink-500">
                <Heart size={14} fill="currentColor" /> {item.dish.kissPrice}
              </span>
            )}
            {item.dish.hugPrice > 0 && (
              <span className="flex items-center gap-1 text-orange-500">
                <User size={14} /> {item.dish.hugPrice}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
          >
            <Minus size={14} />
          </Button>
          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>
      <Input
        placeholder="备注 (例如：少辣)"
        value={item.note || ""}
        onChange={(e) => onUpdateNote(item.id, e.target.value)}
        className="h-8 text-xs bg-muted/50 border-transparent focus:bg-background focus:border-input"
      />
    </Card>
  );
}
