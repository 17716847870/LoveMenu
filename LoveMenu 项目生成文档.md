# LoveMenu 购物车页面重新设计任务（Cart Page Redesign）

## 一、任务目标

当前项目的 **购物车页面（Cart Page）** 需要重新设计。

目标：

1. 页面 **视觉更精致**
2. 页面 **结构更完整**
3. **顶部增加返回按钮**
4. **支持四种主题风格**
5. 页面具有 **情侣产品氛围**
6. 提升 **购物车操作体验**

该页面路径：

```text
/app/(mobile)/cart/page.tsx
```

---

# 二、页面整体结构

新的购物车页面结构：

```text
CartPage
 ├ CartHeader
 ├ CartList
 │   └ CartItem
 ├ CartSummary
 └ CheckoutBar
```

页面结构示意：

```text
┌──────────────────────┐
← 返回        购物车
──────────────────────
情侣提示语 / 今日菜单

商品列表
商品列表
商品列表

──────────────
小计
亲亲余额抵扣
贴贴余额抵扣

──────────────
立即下单按钮
└──────────────────────┘
```

---

# 三、顶部导航（CartHeader）

页面顶部需要增加 **返回按钮**。

设计：

```text
← 返回      购物车
```

组件：

```text
CartHeader
```

路径：

```text
/components/mobile/cart/CartHeader.tsx
```

功能：

```text
返回上一页
```

实现：

```ts
router.back()
```

按钮位置：

```text
左侧
```

标题：

```text
购物车
```

---

# 四、情侣提示模块

购物车页面增加一个 **情侣提示模块**。

作用：

```text
增强情侣产品氛围
```

示例：

```text
今天一起吃点什么呢？
```

或：

```text
给宝贝准备一顿好吃的 ❤️
```

组件：

```text
CartLoveTip
```

路径：

```text
/components/mobile/cart/CartLoveTip.tsx
```

显示位置：

```text
CartHeader 下方
```

---

# 五、购物车商品列表

组件：

```text
CartList
```

路径：

```text
/components/mobile/cart/CartList.tsx
```

结构：

```text
CartItem
CartItem
CartItem
```

---

# 六、CartItem 设计

每个商品结构：

```text
商品图片
商品名称
商品描述

数量控制
删除按钮
```

视觉示意：

```text
┌───────────────────┐
🍰 草莓松饼
微甜松软 配草莓酱

 -  1  +
删除
└───────────────────┘
```

组件：

```text
CartItem
```

路径：

```text
/components/mobile/cart/CartItem.tsx
```

功能：

```text
增加数量
减少数量
删除商品
```

---

# 七、数量控制

数量控制器：

```text
[-]   1   [+]
```

点击：

```text
增加数量
减少数量
```

组件：

```text
QuantitySelector
```

路径：

```text
/components/mobile/cart/QuantitySelector.tsx
```

---

# 八、购物车统计

购物车底部需要一个 **统计模块**。

组件：

```text
CartSummary
```

路径：

```text
/components/mobile/cart/CartSummary.tsx
```

显示：

```text
商品小计
亲亲余额
贴贴余额
```

示例：

```text
商品小计 ¥38
亲亲抵扣 -2
贴贴抵扣 -1
```

最终：

```text
总价 ¥35
```

---

# 九、结算按钮

页面底部需要一个 **结算按钮**。

组件：

```text
CheckoutBar
```

路径：

```text
/components/mobile/cart/CheckoutBar.tsx
```

按钮：

```text
立即下单
```

按钮需要：

```text
固定底部
```

示例：

```text
┌──────────────────────┐
总价 ¥35     立即下单
└──────────────────────┘
```

---

# 十、空购物车页面

如果购物车为空，需要显示 **EmptyCart 页面**。

组件：

```text
EmptyCart
```

路径：

```text
/components/mobile/cart/EmptyCart.tsx
```

示例：

```text
🛒
购物车还是空的

快去选点好吃的吧
```

按钮：

```text
去菜单
```

点击：

```text
跳转 /menu
```

---

# 十一、主题系统

购物车页面必须支持四种主题。

主题来自：

```text
ThemeContext
```

支持：

```text
couple
cute
minimal
night
```

---

# 十二、情侣主题（couple）

设计：

```text
浪漫
粉色
温柔
```

页面背景：

```text
粉色渐变
```

示例：

```css
linear-gradient(180deg,#ffe4ec,#ffd1e0)
```

按钮：

```text
爱心渐变
```

商品卡片：

```text
圆角卡片
柔和阴影
```

情侣提示：

```text
今天也要喂饱宝贝 ❤️
```

---

# 十三、可爱主题（cute）

设计：

```text
卡通
糖果色
活泼
```

背景：

```text
浅粉色
```

示例：

```css
#fff5fb
```

商品卡片：

```text
气泡卡片
```

按钮：

```text
橙色糖果按钮
```

提示：

```text
今天吃点甜甜的 🍓
```

---

# 十四、极简主题（minimal）

设计：

```text
简洁
黑白
留白
```

背景：

```text
纯白
```

商品卡片：

```text
细边框
```

按钮：

```text
黑色按钮
```

提示：

```text
简单吃点就好
```

---

# 十五、夜间主题（night）

设计：

```text
深色
科技感
```

背景：

```text
#1f1f1f
```

商品卡片：

```text
深灰
```

按钮：

```text
霓虹紫
```

提示：

```text
夜宵时间 🌙
```

---

# 十六、动画效果

购物车页面需要轻量动画。

CartItem：

```text
进入动画
```

动画：

```text
opacity 0 → 1
y 20 → 0
```

数量变化：

```text
scale 1 → 1.1 → 1
```

删除商品：

```text
滑出动画
```

---

# 十七、文件结构

新增目录：

```text
/components/mobile/cart
```

组件结构：

```text
cart
 CartHeader.tsx
 CartLoveTip.tsx
 CartList.tsx
 CartItem.tsx
 QuantitySelector.tsx
 CartSummary.tsx
 CheckoutBar.tsx
 EmptyCart.tsx
```

页面：

```text
/app/(mobile)/cart/page.tsx
```

---

# 十八、生成代码要求

AI 生成代码必须：

1 使用 **Next.js App Router**
2 使用 **ThemeContext**
3 支持 **四种主题**
4 页面 **移动端优先**
5 组件 **模块化**
6 支持 **购物车动画**
7 购物车 **空状态页面**

主题：

```text
couple
cute
minimal
night
```

---

# 十九、最终效果

新的购物车页面应该具备：

视觉：

```text
精致
温馨
情侣感
```

交互：

```text
流畅
易用
清晰
```

产品体验：

```text
比普通购物车更有情感氛围
```

最终购物车将成为 **LoveMenu 产品体验的重要页面**。
