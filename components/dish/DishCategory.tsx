import { Button } from "@/components/ui/Button";
import { DishCategory as CategoryType } from "@/types";

interface DishCategoryProps {
  category: CategoryType;
  isActive: boolean;
  onClick: (id: string) => void;
}

export default function DishCategory({ category, isActive, onClick }: DishCategoryProps) {
  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      className="rounded-full px-4 whitespace-nowrap"
      onClick={() => onClick(category.id)}
    >
      {category.name}
    </Button>
  );
}
