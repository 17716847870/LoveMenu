export type ThemeName = "couple" | "cute" | "minimal" | "night";

export interface User {
  id: string;
  username?: string;
  password?: string;
  role?: "admin" | "user";
  name: string;
  avatar?: string;
  kissBalance?: number;
  hugBalance?: number;
}

export interface Dish {
  id: string;
  name: string;
  image?: string;
  kissPrice: number;
  hugPrice: number;
  categoryId: string;
  description?: string;
  popularity?: number;
  allowCook?: boolean;
  allowRestaurant?: boolean;
  createdAt?: string;
}

export interface DishFavorite {
  id: string;
  userId: string;
  dishId: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  dish: Dish;
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "preparing" | "completed" | "cancelled";
  totalKiss: number;
  totalHug: number;
  items: CartItem[];
  reason?: string;
  isEmergency?: boolean;
  createdAt: string;
  memory?: {
    text: string;
    image?: string | string[];
  };
}

export interface DishCategory {
  id: string;
  name: string;
  sortOrder: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  type: "text" | "image" | "voice" | "emoji";
  content: string;
  createdAt: string;
  isRead?: boolean;
  isSender?: boolean;
  isPending?: boolean;
}

export interface FoodRequest {
  id: string;
  name: string;
  description: string;
  image?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export type FeedbackType = "bug" | "feature" | "menu" | "experience";
export type FeedbackStatus = "open" | "processing" | "resolved";

export interface Feedback {
  id: string;
  type: FeedbackType;
  title: string;
  content: string;
  image?: string;
  status: FeedbackStatus;
  createdAt: string;
}
