export type ThemeName = "couple" | "cute" | "minimal" | "night";

export type UserRole = "customer" | "cook" | "admin";

export type Dish = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  kissPrice: number;
  hugPrice: number;
  image?: string;
  popularity: number;
  allowCook: boolean;
  allowRestaurant: boolean;
};

export type DishCategory = {
  id: string;
  name: string;
  sortOrder: number;
};

export type CartItem = {
  id: string;
  dishId: string;
  name: string;
  kissPrice: number;
  hugPrice: number;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "canceled";

export type Order = {
  id: string;
  status: OrderStatus;
  totalKiss: number;
  totalHug: number;
  note?: string;
  createdAt: string;
  items: CartItem[];
};

export type ChatMessageType = "text" | "image" | "voice" | "emoji";

export type ChatMessage = {
  id: string;
  senderId: string;
  type: ChatMessageType;
  content: string;
  createdAt: string;
};

export type SystemConfig = {
  id: string;
  key: string;
  value: string;
};
