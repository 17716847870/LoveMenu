import { ChatMessage, Dish, DishCategory, Order } from "../types";

export const dishCategories: DishCategory[] = [
  { id: "c1", name: "甜品", sortOrder: 1 },
  { id: "c2", name: "主食", sortOrder: 2 },
  { id: "c3", name: "小食", sortOrder: 3 },
];

export const dishes: Dish[] = [
  {
    id: "d1",
    name: "草莓松饼",
    description: "微甜松软，配草莓酱",
    categoryId: "c1",
    kissPrice: 2,
    hugPrice: 1,
    popularity: 86,
    allowCook: true,
    allowRestaurant: true,
    image: "/next.svg",
  },
  {
    id: "d2",
    name: "番茄意面",
    description: "酸甜适口，奶香轻盈",
    categoryId: "c2",
    kissPrice: 3,
    hugPrice: 2,
    popularity: 92,
    allowCook: true,
    allowRestaurant: true,
    image: "/vercel.svg",
  },
  {
    id: "d3",
    name: "香烤鸡翅",
    description: "外酥里嫩，辣度可选",
    categoryId: "c3",
    kissPrice: 2,
    hugPrice: 2,
    popularity: 76,
    allowCook: true,
    allowRestaurant: false,
    image: "/file.svg",
  },
];

export const orders: Order[] = [
  {
    id: "2025031201",
    status: "preparing",
    totalKiss: 5,
    totalHug: 3,
    createdAt: new Date().toISOString(),
    items: [
      {
        id: "oi-1",
        dishId: "d1",
        name: "草莓松饼",
        kissPrice: 2,
        hugPrice: 1,
        quantity: 1,
      },
      {
        id: "oi-2",
        dishId: "d2",
        name: "番茄意面",
        kissPrice: 3,
        hugPrice: 2,
        quantity: 1,
      },
    ],
  },
  {
    id: "2025031202",
    status: "completed",
    totalKiss: 2,
    totalHug: 2,
    createdAt: new Date().toISOString(),
    items: [
      {
        id: "oi-3",
        dishId: "d3",
        name: "香烤鸡翅",
        kissPrice: 2,
        hugPrice: 2,
        quantity: 1,
      },
    ],
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "m1",
    senderId: "user-a",
    type: "text",
    content: "今天想吃点什么呀？",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m2",
    senderId: "user-b",
    type: "text",
    content: "想要草莓松饼！",
    createdAt: new Date().toISOString(),
  },
];
