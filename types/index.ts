export type ThemeName = "couple" | "cute" | "minimal" | "night";

export interface User {
  id: string;
  name: string;
  avatar?: string;
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
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  totalKiss: number;
  totalHug: number;
  items: CartItem[];
  reason?: string;
  isEmergency?: boolean;
  createdAt: string;
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
  isSender?: boolean;
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
