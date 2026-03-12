# LoveMenu 首页新增模块优化 Prompt

当前 **LoveMenu H5 首页**已经包含以下模块：

```
CoupleMoodCard      情侣情绪卡片
FoodRouletteCard    随机吃什么转盘
TodayOrderedCard    今日已点
WeeklyFavoriteCard  本周最爱
```

现在需要 **新增 4 个首页模块**，提升产品完整度和情侣互动体验。

新增模块：

```
TodayRecommendCard  今日推荐
WishlistCard        想吃清单
UrgentCravingCard   紧急想吃
RecentFeedbackCard  最近反馈
```

所有组件 **必须支持主题系统**：

```
couple
cute
minimal
night
```

并且每个主题 **都需要有不同的视觉特色**。

只生成：

```
这 4 个组件
```

不要修改已有组件。

---

# 一、首页最终结构

首页模块顺序：

```
HomePage

 ├ CoupleMoodCard
 ├ FoodRouletteCard
 ├ TodayRecommendCard
 ├ TodayOrderedCard
 ├ WeeklyFavoriteCard
 ├ WishlistCard
 ├ UrgentCravingCard
 └ RecentFeedbackCard
```

页面最大宽度：

```
max-width: 480px
margin: auto
```

---

# 二、模块一：TodayRecommendCard（今日推荐）

组件路径：

```
components/mobile/TodayRecommendCard.tsx
```

功能：

系统根据历史订单或热门数据 **推荐一个菜品**。

---

## UI结构

```
┌──────────────────────┐
今日推荐 🍱

🍗 炸鸡

推荐原因：
你最近很喜欢

[加入购物车]
└──────────────────────┘
```

---

## 数据来源

接口：

```
/api/recommend/today
```

返回：

```json
{
 "dishName": "炸鸡",
 "reason": "你最近很喜欢"
}
```

---

## 组件结构

```
TodayRecommendCard
 ├ CardHeader
 ├ DishDisplay
 ├ RecommendReason
 └ ActionButton
```

---

# 三、模块二：WishlistCard（想吃清单）

组件路径：

```
components/mobile/WishlistCard.tsx
```

功能：

显示 **想吃但还没点的菜**。

---

## UI结构

```
┌──────────────────────┐
想吃清单 ❤️

🍣 寿司
🍰 蛋糕
🍜 螺蛳粉

[查看全部]
└──────────────────────┘
```

最多显示：

```
3 条
```

---

## 数据来源

接口：

```
/api/wishlist
```

返回：

```json
[
 { "dishName": "寿司" },
 { "dishName": "蛋糕" },
 { "dishName": "螺蛳粉" }
]
```

---

## 组件结构

```
WishlistCard
 ├ CardHeader
 ├ WishList
 │   ├ WishItem
 │   ├ WishItem
 │   └ WishItem
 └ ViewAllButton
```

---

# 四、模块三：UrgentCravingCard（紧急想吃）

组件路径：

```
components/mobile/UrgentCravingCard.tsx
```

功能：

当用户 **非常想吃某个菜时**，可以标记为紧急。

---

## UI结构

```
┌──────────────────────┐
⚡ 紧急想吃

🍗 炸鸡

[立即下单]
└──────────────────────┘
```

特点：

* 视觉更突出
* 卡片颜色更醒目

---

## 数据来源

接口：

```
/api/craving
```

返回：

```json
{
 "dishName": "炸鸡"
}
```

---

## 组件结构

```
UrgentCravingCard
 ├ CardHeader
 ├ DishDisplay
 └ OrderButton
```

---

# 五、模块四：RecentFeedbackCard（最近反馈）

组件路径：

```
components/mobile/RecentFeedbackCard.tsx
```

功能：

显示最近一次订单反馈。

支持：

```
文字
图片
```

---

## UI结构

```
┌──────────────────────┐
最近反馈 ❤️

🍜 拉面

很好吃！！

📷 图片
└──────────────────────┘
```

---

## 数据来源

接口：

```
/api/feedback/latest
```

返回：

```json
{
 "dishName": "拉面",
 "content": "很好吃！",
 "image": "/feedback/1.jpg"
}
```

---

## 组件结构

```
RecentFeedbackCard
 ├ CardHeader
 ├ DishInfo
 ├ FeedbackText
 └ FeedbackImage
```

---

# 六、主题系统设计（重点）

组件必须根据：

```
ThemeContext
```

切换主题。

主题：

```
couple
cute
minimal
night
```

---

# 七、主题 UI 设计

## Couple Theme（情侣风）

视觉特点：

```
粉色
爱心
温柔 UI
```

示例：

```
❤️ 今日推荐
❤️ 想吃清单
❤️ 最近反馈
```

卡片：

```
柔和渐变
大圆角
轻阴影
```

---

## Cute Theme（可爱风）

视觉特点：

```
糖果色
emoji
卡通 UI
```

示例：

```
🍭 今日推荐
🍩 想吃清单
🍓 最近反馈
```

卡片：

```
圆角
卡通阴影
sticker 风格
```

---

## Minimal Theme（极简风）

视觉特点：

```
黑白
线条
极简
```

示例：

```
Today Recommend
Wishlist
Recent Feedback
```

卡片：

```
细边框
无背景
无装饰
```

---

## Night Theme（夜间风）

视觉特点：

```
深色
neon glow
科技感
```

示例：

```
⚡ Today Recommend
⚡ Wishlist
⚡ Feedback
```

卡片：

```
深色背景
霓虹边框
发光阴影
```

---

# 八、组件 Props 示例

示例：

```ts
interface Dish {
 dishName: string
}
```

推荐：

```ts
interface Recommend {
 dishName: string
 reason: string
}
```

反馈：

```ts
interface Feedback {
 dishName: string
 content: string
 image?: string
}
```

---

# 九、技术要求

使用：

```
Next.js
React
TypeScript
TailwindCSS
ThemeContext
framer-motion
```

---

# 十、输出要求

生成以下组件：

```
components/mobile/TodayRecommendCard.tsx
components/mobile/WishlistCard.tsx
components/mobile/UrgentCravingCard.tsx
components/mobile/RecentFeedbackCard.tsx
```

输出内容：

```
完整组件代码
子组件
主题样式逻辑
数据渲染逻辑
使用示例
```

不要生成其它页面代码。
