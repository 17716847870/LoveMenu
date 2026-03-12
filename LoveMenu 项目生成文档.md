# LoveMenu 菜单页面（MenuPage）UI 重构 Prompt（含底部导航栏）

当前 **LoveMenu H5 菜单页面** UI 结构比较基础，需要进行全面升级。

当前问题：

```text
1 UI过于简单
2 没有动效
3 菜品卡片没有层级感
4 分类导航不够明显
5 没有主题风格
6 没有菜品热度展示
7 页面缺乏真实 App 体验
```

目标：

```text
设计一个现代、有动效、支持主题系统，并且符合 H5 App 结构的菜单页面
```

需要优化组件：

```text
MenuPage
DishCard
CategoryTabs
FloatingCartButton
```

注意：

```text
页面底部仍然存在 BottomNavigationBar
```

不要重新生成导航栏组件，只需要 **适配已有导航栏布局**。

---

# 一、页面结构设计

页面路径：

```text
/app/menu/page.tsx
```

完整页面结构：

```text
AppLayout
 ├ PageHeader
 ├ CategoryTabs
 ├ DishGrid
 │   ├ DishCard
 │   ├ DishCard
 │   └ DishCard
 ├ FloatingCartButton
 └ BottomNavigationBar
```

页面宽度：

```css
max-width: 480px;
margin: auto;
padding: 16px;
padding-bottom: 90px;
```

说明：

```text
padding-bottom 用于避免内容被底部导航栏遮挡
```

---

# 二、顶部标题区

当前标题：

```text
菜单
```

升级为：

```text
LoveMenu
今天想吃什么？
```

UI结构：

```text
┌──────────────────┐
LoveMenu

今天想吃什么？
└──────────────────┘
```

特点：

```text
标题更像 App
增加情绪化文案
```

---

# 三、分类导航（CategoryTabs）

分类示例：

```text
全部 甜品 主食 小食 饮品
```

升级为：

```text
横向滚动分类导航
```

UI结构：

```text
┌────────────────────────┐
[全部] [甜品] [主食] [小食] [饮品]
└────────────────────────┘
```

功能：

```text
横向滚动
选中高亮
点击切换分类
```

动画：

```text
滑动过渡动画
```

---

# 四、菜品布局

使用：

```text
两列 Grid 布局
```

示例：

```text
┌──────────────┐ ┌──────────────┐
DishCard        DishCard

DishCard        DishCard
└──────────────┘ └──────────────┘
```

CSS：

```css
grid-template-columns: repeat(2, 1fr);
gap: 16px;
```

---

# 五、DishCard 卡片设计

当前卡片问题：

```text
图片比例混乱
视觉普通
信息层级不明显
没有动效
```

升级为 **现代卡片 UI**。

---

## DishCard 结构

```text
DishCard
 ├ DishImage
 ├ HotBadge
 ├ DishInfo
 │   ├ DishName
 │   ├ DishDesc
 │   └ PriceTag
 └ AddToCartButton
```

---

# 六、菜品热度设计

每个菜品支持：

```text
hotScore
```

表示热度。

规则：

```text
hotScore > 80 显示 本周最火
hotScore > 50 显示 热门
```

UI示例：

```text
🔥 本周最火
🔥 热门
```

卡片展示：

```text
┌─────────────────────┐
│ 🔥 本周最火          │
│        图片          │
├─────────────────────┤
草莓松饼

微甜松软，配草莓酱

❤️ 2   🤗 1

[加入购物车]
└─────────────────────┘
```

---

# 七、价格展示（情侣价格）

LoveMenu 价格单位：

```text
亲亲
贴贴
```

UI展示：

```text
❤️ 2   🤗 1
```

含义：

```text
2个亲亲
1个贴贴
```

---

# 八、动效设计

使用：

```text
framer-motion
```

---

## 卡片加载动画

页面加载：

```text
fade in + slide up
```

动画：

```text
initial: opacity 0
animate: opacity 1
translateY: 20 → 0
```

---

## DishCard hover 动画

hover：

```text
scale: 1 → 1.03
shadow增强
```

tap：

```text
scale: 0.97
```

---

## 加入购物车按钮动画

点击：

```text
按钮缩放
```

触发：

```text
购物车数量动画
```

---

# 九、FloatingCartButton

新增：

```text
FloatingCartButton
```

位置：

```text
右下角
在 BottomNavigationBar 上方
```

示例：

```text
🛒 2
```

点击：

```text
跳转购物车页面
```

动画：

```text
点击弹跳
```

---

# 十、主题系统（重点）

组件必须支持主题系统：

```text
couple
cute
minimal
night
```

每个主题必须有明显视觉差异。

---

# 十一、主题 UI 设计

## Couple Theme（情侣风）

视觉：

```text
粉色
爱心
柔和渐变
```

示例：

```text
❤️ 草莓松饼

❤️ 2   🤗 1

❤️ 加入购物车
```

特点：

```text
粉色按钮
柔和阴影
爱心 icon
```

---

## Cute Theme（可爱风）

视觉：

```text
糖果色
emoji
卡通风
```

示例：

```text
🍓 草莓松饼

💗 2  🤗 1

🍱 加入购物车
```

特点：

```text
更圆角
更大阴影
sticker风格
```

---

## Minimal Theme（极简风）

视觉：

```text
黑白
极简
线条
```

示例：

```text
草莓松饼

2 ♥  1 🤗

加入购物车 →
```

特点：

```text
细边框
无背景
简洁按钮
```

---

## Night Theme（夜间风）

视觉：

```text
深色
neon glow
科技感
```

示例：

```text
⚡ 草莓松饼

❤️ 2   🤗 1

⚡ 加入购物车
```

特点：

```text
深色卡片
霓虹边框
glow阴影
```

---

# 十二、数据结构

接口：

```text
/api/dishes
```

返回示例：

```json
[
 {
   "id": "1",
   "name": "草莓松饼",
   "desc": "微甜松软，配草莓酱",
   "kissPrice": 2,
   "hugPrice": 1,
   "hotScore": 82,
   "image": "/dish1.jpg"
 }
]
```

---

# 十三、组件 Props

Dish 类型：

```ts
interface Dish {
 id: string
 name: string
 desc: string
 kissPrice: number
 hugPrice: number
 hotScore: number
 image: string
}
```

---

# 十四、技术要求

使用：

```text
Next.js
React
TypeScript
TailwindCSS
framer-motion
ThemeContext
```

---

# 十五、输出要求

请生成：

```text
/app/menu/page.tsx
/components/mobile/DishCard.tsx
/components/mobile/CategoryTabs.tsx
/components/mobile/FloatingCartButton.tsx
```

输出内容：

```text
完整组件代码
动画实现
主题样式逻辑
数据渲染逻辑
使用示例
```

注意：

```text
不要重新生成 BottomNavigationBar
只需要保证页面布局不会被底部导航遮挡
```

不要生成其它页面代码。
