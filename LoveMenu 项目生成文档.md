# LoveMenu 加入购物车动画重构任务（商品 → 底部购物车动画）

## 一、任务目标

当前项目存在的问题：

当用户点击 **加入购物车** 时，会弹出一个 **右下角浮动购物车组件**（图中圈出的组件）。

该组件需要 **删除**。

新的交互目标：

当用户点击 **加入购物车** 时：

商品图片需要 **飞入底部导航栏的购物车按钮**，形成一个 **Add To Cart 动画效果**。

这种交互在很多 App 中使用，例如：

* 外卖 App
* 电商 App
* Food App

效果：

```text
商品卡片
   ↓
商品图标飞出
   ↓
沿曲线飞向
   ↓
底部导航栏购物车
   ↓
购物车产生心跳动画
```

这样可以大幅提升 **产品体验和趣味性**。

---

# 二、需要删除的旧功能

删除以下组件：

```text
FloatingCartButton
MiniCart
右下角悬浮购物车
```

如果项目存在类似组件：

```text
/components/mobile/FloatingCart.tsx
/components/mobile/CartFloatButton.tsx
```

需要：

```text
完全删除
```

页面中也需要移除引用。

---

# 三、新的交互流程

新的 **加入购物车流程**：

```text
点击加入购物车
        ↓
获取商品图片位置
        ↓
创建一个飞行动画元素
        ↓
飞向底部导航栏购物车
        ↓
购物车触发心跳动画
        ↓
更新购物车数量
```

---

# 四、动画设计

动画名称：

```text
FlyToCart Animation
```

动画过程：

### 第一阶段

复制商品图片。

尺寸：

```text
40px
```

位置：

```text
商品图片中心
```

---

### 第二阶段

商品图标开始移动。

移动路径：

```text
贝塞尔曲线
```

视觉效果：

```text
抛物线
```

持续时间：

```text
600ms
```

---

### 第三阶段

商品飞到：

```text
BottomTabBar 购物车按钮
```

然后：

```text
购物车按钮心跳
```

动画：

```text
scale: 1 → 1.2 → 1
```

---

# 五、动画技术方案

推荐使用：

```text
framer-motion
```

或：

```text
requestAnimationFrame
```

但推荐：

```text
framer-motion
```

因为项目已经在使用它。

安装：

```bash
npm install framer-motion
```

---

# 六、需要修改的组件

涉及组件：

```text
/components/mobile/FoodCard.tsx
/components/mobile/BottomTabBar.tsx
```

新增组件：

```text
/components/animation/FlyToCart.tsx
```

---

# 七、FlyToCart 动画组件

新建组件：

```text
/components/animation/FlyToCart.tsx
```

作用：

```text
控制商品飞向购物车动画
```

Props：

```ts
startX
startY
endX
endY
image
```

逻辑：

```text
1 创建一个 fixed 图层
2 显示商品图片
3 执行动画
4 动画结束后删除
```

---

# 八、获取动画起点

点击商品时获取：

```ts
element.getBoundingClientRect()
```

示例：

```ts
const rect = e.currentTarget.getBoundingClientRect()
```

得到：

```text
startX
startY
```

---

# 九、获取购物车位置

在：

```text
BottomTabBar
```

中给购物车按钮增加：

```ts
ref
```

示例：

```ts
const cartRef = useRef()
```

获取：

```ts
cartRef.current.getBoundingClientRect()
```

得到：

```text
endX
endY
```

---

# 十、FoodCard 修改

当前：

```text
点击按钮 → 直接加入购物车
```

修改为：

```text
点击按钮
 ↓
触发飞行动画
 ↓
动画结束
 ↓
加入购物车
```

逻辑：

```ts
handleAddToCart()
```

流程：

```ts
1 获取商品位置
2 获取购物车位置
3 启动 FlyToCart
4 更新 CartStore
```

---

# 十一、购物车按钮动画

当商品飞入购物车时：

购物车按钮需要：

```text
心跳动画
```

动画：

```text
scale 1 → 1.2 → 1
```

持续：

```text
0.4s
```

实现方式：

```text
framer-motion
```

---

# 十二、购物车数量更新

飞入动画结束后：

更新：

```text
CartStore
```

例如：

```ts
addToCart(product)
```

然后：

```text
CartBadge 自动更新
```

---

# 十三、四种主题动画

动画颜色必须适配主题：

主题来自：

```text
ThemeContext
```

支持主题：

```text
couple
cute
minimal
night
```

---

## 情侣主题

飞行动画：

```text
粉色
```

购物车心跳：

```text
爱心动画
```

---

## 可爱主题

飞行动画：

```text
糖果色
```

购物车：

```text
气泡弹跳
```

---

## 极简主题

飞行动画：

```text
灰色
```

购物车：

```text
轻微缩放
```

---

## 夜间主题

飞行动画：

```text
紫色霓虹
```

购物车：

```text
发光动画
```

---

# 十四、最终效果

用户点击：

```text
加入购物车
```

看到：

```text
商品图标飞向购物车
```

购物车：

```text
跳动
```

购物车数量：

```text
+1
```

整个交互：

```text
非常流畅
非常高级
非常有产品感
```

---

# 十五、最终文件结构

```text
/components

animation
 FlyToCart.tsx

mobile
 FoodCard.tsx
 BottomTabBar.tsx
 CartBadge.tsx
```

---

# 十六、生成代码要求

AI 生成代码必须：

1 使用 **Next.js App Router**
2 使用 **framer-motion**
3 删除 **旧浮动购物车组件**
4 新增 **FlyToCart 动画**
5 支持 **四种主题**
6 动画 **流畅不卡顿**
7 购物车按钮 **触发心跳动画**

主题：

```text
couple
cute
minimal
night
```

---

# 十七、产品效果

最终体验：

```text
点击商品
      ↓
商品飞向购物车
      ↓
购物车跳动
      ↓
数量+1
```

这是 **电商级别的交互体验**。
