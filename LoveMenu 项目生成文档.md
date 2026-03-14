# LoveMenu 紧急想吃功能设计任务（Emergency Order System）

## 一、问题说明

当前首页已经存在 **紧急想吃模块**。

但是目前存在问题：

```text
只是静态展示
没有真实交互
没有真正的下单逻辑
```

用户现在看到的只是：

```text
一个按钮
```

但点击后没有完整流程。

---

# 二、功能定位

**紧急想吃** 本质上不是新的订单系统。

它其实是：

```text
普通订单 + 紧急标记
```

核心逻辑：

```text
快速下单
减少步骤
增加紧急标签
```

适用场景：

```text
特别饿
突然想吃
深夜想吃
```

所以这个功能的目标是：

```text
最快速度完成一次下单
```

---

# 三、完整流程设计

普通下单流程：

```text
菜单
↓
加入购物车
↓
进入购物车
↓
下单
```

紧急下单流程：

```text
首页点击紧急想吃
↓
快速选择食物
↓
直接下单
```

流程更短：

```text
减少操作
```

---

# 四、首页模块重新设计

首页模块：

```text
紧急想吃
```

需要升级为：

```text
快速点单入口
```

模块示例：

```text
┌──────────────────────┐
紧急想吃

🍔 汉堡
🍟 薯条
🍜 拉面

⚡ 立即点单
└──────────────────────┘
```

规则：

```text
显示3个热门食物
```

点击：

```text
进入紧急点单页面
```

页面路径：

```text
/app/(mobile)/emergency/page.tsx
```

---

# 五、紧急点单页面设计

页面结构：

```text
EmergencyPage
 ├ EmergencyHeader
 ├ EmergencyFoodList
 │   └ EmergencyFoodItem
 └ EmergencyCheckoutBar
```

页面示意：

```text
┌──────────────────────┐
← 返回     紧急想吃
──────────────────────

🍔 汉堡
🍜 拉面
🍗 炸鸡

立即点单
└──────────────────────┘
```

特点：

```text
简化页面
减少信息
快速操作
```

---

# 六、EmergencyFoodItem 设计

每个食物卡片包含：

```text
图片
食物名称
价格
立即点
```

示例：

```text
┌────────────────────┐
🍔 汉堡

¥15

⚡ 立即点
└────────────────────┘
```

点击：

```text
直接加入购物车
```

并触发：

```text
紧急订单流程
```

---

# 七、紧急订单逻辑

紧急订单与普通订单唯一差别：

订单数据增加字段：

```ts
isEmergency
```

数据结构：

```ts
{
 id: string
 items: CartItem[]
 totalPrice: number
 isEmergency: boolean
 createdAt: Date
}
```

示例：

```ts
{
 id: "order_003",
 items: [...],
 totalPrice: 32,
 isEmergency: true
}
```

---

# 八、紧急订单提示

在订单创建时显示：

```text
紧急订单
```

例如：

```text
⚡ 紧急订单
```

历史订单展示：

```text
⚡ 紧急想吃
```

组件修改：

```text
OrderCard
```

路径：

```text
/components/mobile/orders/OrderCard.tsx
```

---

# 九、快速下单逻辑

紧急点单按钮：

```text
⚡ 立即点
```

点击流程：

```text
加入购物车
↓
自动进入下单确认
↓
直接下单
```

减少步骤：

```text
不进入完整购物车页面
```

---

# 十、紧急提示模块

紧急页面顶部增加提示：

组件：

```text
EmergencyTip
```

示例：

```text
饿了吗？
快速点一份
```

或者：

```text
给宝贝准备点吃的 ⚡
```

---

# 十一、空状态页面

如果没有可紧急点的食物：

组件：

```text
EmptyEmergency
```

示例：

```text
⚡

暂时没有推荐

去菜单看看吧
```

按钮：

```text
去菜单
```

---

# 十二、首页模块主题设计

首页 **紧急想吃模块**需要支持四种主题。

主题：

```text
couple
cute
minimal
night
```

---

# 十三、情侣主题（couple）

氛围：

```text
浪漫
温柔
```

背景：

```css
linear-gradient(180deg,#ffd1e0,#ffb6c9)
```

模块设计：

```text
爱心卡片
柔和阴影
```

文案：

```text
宝贝是不是饿了 ❤️
```

按钮：

```text
💗 立即投喂
```

动画：

```text
爱心跳动
```

---

# 十四、可爱主题（cute）

氛围：

```text
活泼
卡通
```

背景：

```css
#fff5fb
```

模块设计：

```text
气泡卡片
```

文案：

```text
肚子饿啦 🍓
```

按钮：

```text
🍭 快速点单
```

动画：

```text
按钮弹跳
```

---

# 十五、极简主题（minimal）

氛围：

```text
简洁
理性
```

背景：

```text
纯白
```

模块设计：

```text
细边框
```

文案：

```text
快速下单
```

按钮：

```text
Quick Order
```

动画：

```text
淡入
```

---

# 十六、夜间主题（night）

氛围：

```text
夜宵
科技感
```

背景：

```css
#1f1f1f
```

模块设计：

```text
深色卡片
霓虹边框
```

文案：

```text
夜宵时间 🌙
```

按钮：

```text
⚡ 快速点单
```

动画：

```text
霓虹呼吸
```

---

# 十七、文件结构

新增目录：

```text
/components/mobile/emergency
```

组件：

```text
EmergencyHeader.tsx
EmergencyTip.tsx
EmergencyFoodList.tsx
EmergencyFoodItem.tsx
EmptyEmergency.tsx
```

页面：

```text
/app/(mobile)/emergency/page.tsx
```

首页模块：

```text
/components/mobile/home/EmergencySection.tsx
```

---

# 十八、生成代码要求

AI 生成代码必须：

```text
使用 Next.js App Router
使用 ThemeContext
支持紧急订单字段
支持快速下单
支持四种主题
```

主题：

```text
couple
cute
minimal
night
```

---

# 十九、最终效果

新的 **紧急想吃系统**将实现：

```text
最短路径下单
快速点餐
情绪化功能
```

用户体验：

```text
特别饿
↓
点紧急想吃
↓
立即下单
```

最终形成：

```text
LoveMenu 的极速点单系统
```
