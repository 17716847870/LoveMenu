import { DishCategory } from "../../types";
import { Badge } from "../ui/Badge";

type DishCategoryProps = {
  category: DishCategory;
  active?: boolean;
  onSelect?: (id: string) => void;
};

export const DishCategoryTag = ({
  category,
  active,
  onSelect,
}: DishCategoryProps) => {
  return (
    <button onClick={() => onSelect?.(category.id)}>
      <Badge variant={active ? "success" : "default"}>{category.name}</Badge>
    </button>
  );
};
