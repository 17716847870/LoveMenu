import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    topDishes: [
      { id: 1, name: '可乐鸡翅', category: '主食', orderCount: 45, likes: 120, status: '已上菜单' },
      { id: 2, name: '草莓松饼', category: '甜点', orderCount: 38, likes: 95, status: '已上菜单' },
      { id: 3, name: '珍珠奶茶', category: '饮品', orderCount: 35, likes: 88, status: '已上菜单' },
      { id: 4, name: '炸鸡排', category: '小吃', orderCount: 28, likes: 76, status: '已上菜单' },
      { id: 5, name: '芝士披萨', category: '主食', orderCount: 20, likes: 65, status: '已上菜单' },
    ],
    topWishlist: [
      { id: 101, name: '麻辣香锅', category: '主食', mentionCount: 12, likes: 45, status: '待审核' },
      { id: 102, name: '提拉米苏', category: '甜点', mentionCount: 8, likes: 32, status: '待审核' },
      { id: 103, name: '烤冷面', category: '主食', mentionCount: 7, likes: 28, status: '待审核' },
      { id: 104, name: '杨枝甘露', category: '甜点', mentionCount: 5, likes: 20, status: '待审核' },
      { id: 105, name: '冰糖葫芦', category: '小吃', mentionCount: 4, likes: 15, status: '待审核' },
    ]
  });
}
