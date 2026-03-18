import { PageContainer } from "../../components/ui/PageContainer";
import DashboardClient from "../../components/admin/dashboard/DashboardClient";

// Mock data fetchers (in a real app, these would call your DB or external API)
async function getStats() {
  // Simulating API call
  return {
    interactionsToday: 12,
    pointsToday: 85,
    priorityOrders: 2,
    newFeedback: 3,
    newWishlist: 5,
    interactionsTrend: 'up',
    pointsTrend: 'up',
    priorityTrend: 'down',
    feedbackTrend: 'up',
    wishlistTrend: 'up',
  };
}

async function getTrends() {
  return [
    { name: '周一', interactions: 8, points: 50, priority: 1 },
    { name: '周二', interactions: 10, points: 65, priority: 0 },
    { name: '周三', interactions: 7, points: 45, priority: 2 },
    { name: '周四', interactions: 12, points: 85, priority: 1 },
    { name: '周五', interactions: 15, points: 110, priority: 0 },
    { name: '周六', interactions: 22, points: 160, priority: 3 },
    { name: '周日', interactions: 18, points: 130, priority: 1 },
  ];
}

async function getDistribution() {
  return {
    categoryDistribution: [
      { name: '主食', value: 40 },
      { name: '小吃', value: 25 },
      { name: '饮品', value: 20 },
      { name: '甜点', value: 15 },
    ],
    sourceDistribution: [
      { name: '普通点餐', value: 60 },
      { name: '紧急想吃', value: 25 },
      { name: '想吃清单', value: 15 },
    ],
  };
}

async function getTopItems() {
  return {
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
  };
}

export default async function AdminPage() {
  // Fetch all data in parallel
  const [stats, trends, distribution, topItems] = await Promise.all([
    getStats(),
    getTrends(),
    getDistribution(),
    getTopItems(),
  ]);

  return (
    <PageContainer>
      <DashboardClient 
        initialStats={stats}
        initialTrends={trends}
        initialDistribution={distribution}
        initialTopItems={topItems}
      />
    </PageContainer>
  );
}
