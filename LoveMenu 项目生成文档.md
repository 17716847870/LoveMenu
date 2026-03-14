# LoveMenu 订单原因记录系统任务（Order Reason System）

## 一、问题说明

当前项目存在一个逻辑问题：

用户点击 **立即下单** 时：

```text
订单被创建
```

但是系统 **没有记录下单原因**。

例如：

```text
为什么下单
为什么点这顿
是谁想吃
```

但在 **历史订单页面** 中却会展示：

```text
情侣回忆
```

这会导致一个问题：

```text
订单数据不完整
```

因为订单没有真正的 **回忆来源数据**。

---

# 二、任务目标

在 **下单时记录订单原因**。

这样在 **历史订单 / 情侣回忆系统** 中可以展示：

```text
下单原因
```

例如：

```text
今天宝贝想吃草莓松饼
```

或：

```text
庆祝纪念日
```

或：

```text
今天一起吃点甜的
```

这样历史订单就会变成：

```text
情侣回忆记录
```

---

# 三、下单流程修改

当前流程：

```text
加入购物车
 ↓
进入购物车
 ↓
点击立即下单
 ↓
创建订单
```

新的流程：

```text
加入购物车
 ↓
进入购物车
 ↓
点击立即下单
 ↓
弹出原因选择
 ↓
确认下单
 ↓
创建订单
```

---

# 四、订单原因选择模块

新增组件：

```text
OrderReasonSelector
```

路径：

```text
/components/mobile/cart/OrderReasonSelector.tsx
```

作用：

```text
选择下单原因
```

显示方式：

```text
BottomSheet
```

从底部弹出。

---

# 五、原因选择内容

提供几个 **情侣场景原因**。

示例：

```text
今天宝贝想吃
今天我想吃
纪念日
一起看电影
夜宵时间
随便吃点
```

UI 示例：

```text
请选择下单原因

[ 宝贝想吃 ]
[ 我想吃 ]
[ 纪念日 ]
[ 夜宵 ]
[ 看电影 ]
[ 随便吃点 ]
```

支持：

```text
自定义输入
```

例如：

```text
输入原因
```

---

# 六、组件结构

组件：

```text
OrderReasonSelector
```

结构：

```text
标题
原因列表
自定义输入
确认按钮
```

示例：

```text
┌──────────────────┐
为什么要下单呢？

宝贝想吃
我想吃
纪念日
夜宵

输入原因

确认
└──────────────────┘
```

---

# 七、数据结构修改

订单数据结构需要增加字段：

```ts
reason
```

示例：

```ts
{
 id: string
 items: CartItem[]
 totalPrice: number
 reason: string
 createdAt: Date
}
```

示例订单：

```ts
{
 id: "order_001",
 items: [...],
 totalPrice: 35,
 reason: "今天宝贝想吃草莓松饼",
 createdAt: "2026-03-14"
}
```

---

# 八、创建订单逻辑修改

文件：

```text
/components/mobile/cart/CheckoutBar.tsx
```

当前逻辑：

```ts
createOrder(cartItems)
```

需要改成：

```ts
createOrder(cartItems, reason)
```

流程：

```text
点击立即下单
 ↓
打开原因选择
 ↓
确认原因
 ↓
创建订单
```

---

# 九、历史订单展示

历史订单页面路径：

```text
/app/(mobile)/orders/page.tsx
```

订单卡片需要增加：

```text
订单原因
```

示例：

```text
鸡翅 + 炒饭

今天宝贝想吃 ❤️

2024-03-12 18:30
```

组件：

```text
OrderCard
```

路径：

```text
/components/mobile/orders/OrderCard.tsx
```

---

# 十、情侣回忆展示

历史订单页面已经升级为：

```text
情侣回忆系统
```

现在可以展示：

```text
那天为什么吃这顿
```

示例：

```text
2024-03-12

鸡翅 + 炒饭

原因：
今天宝贝想吃
```

这样订单记录就会变成：

```text
情侣生活记录
```

---

# 十一、空原因处理

如果用户没有输入原因：

系统自动生成：

```text
今天一起吃点好吃的
```

或：

```text
随便吃点
```

避免出现：

```text
空数据
```

---

# 十二、主题设计

原因选择弹窗需要支持四种主题。

主题：

```text
couple
cute
minimal
night
```

---

## 情侣主题

背景：

```text
粉色渐变
```

按钮：

```text
爱心按钮
```

原因按钮：

```text
圆角卡片
```

---

## 可爱主题

设计：

```text
糖果色
```

原因按钮：

```text
气泡按钮
```

---

## 极简主题

设计：

```text
白色
细边框
```

---

## 夜间主题

设计：

```text
深色背景
霓虹按钮
```

---

# 十三、文件结构

新增组件：

```text
/components/mobile/cart
 OrderReasonSelector.tsx
```

修改组件：

```text
/components/mobile/cart
 CheckoutBar.tsx
```

修改页面：

```text
/app/(mobile)/orders/page.tsx
```

---

# 十四、生成代码要求

AI 生成代码必须：

1 使用 **Next.js App Router**
2 使用 **ThemeContext**
3 使用 **BottomSheet UI**
4 支持 **四种主题**
5 订单数据增加 **reason 字段**
6 历史订单展示 **reason**

主题：

```text
couple
cute
minimal
night
```

---

# 十五、最终效果

新的下单流程：

```text
点击下单
 ↓
选择原因
 ↓
创建订单
 ↓
历史订单记录原因
```

历史订单：

```text
不仅是订单
也是情侣回忆
```

产品体验将变成：

```text
恋爱记录
美食记录
生活记录
```
