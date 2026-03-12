# LoveMenu 首页「随机吃什么转盘」组件设计 Prompt

请重新设计 **LoveMenu H5 首页的“随机吃什么”模块**。
该模块需要升级为 **互动转盘（Food Roulette）组件**。

当前版本只是一个按钮：

```text
随机吃什么
不知道吃什么？
帮我选一个
```

问题：

* 互动感弱
* 没有游戏感
* 没有视觉吸引力
* 不符合 App 产品体验

目标：

升级为：

```text
FoodRouletteCard（随机吃什么转盘卡片）
```

用户点击后 **转盘旋转并随机停在某个菜品上**。

只生成：

```text
FoodRouletteCard 组件
```

不要生成整个页面。

---

# 一、组件位置

组件路径：

```
components/mobile/FoodRouletteCard.tsx
```

首页结构：

```
HomePage
 ├ CoupleMoodCard
 ├ FoodRouletteCard
 ├ TodayOrderCard
 └ WeeklyFavoriteCard
```

---

# 二、组件 UI 结构

基础结构：

```
┌─────────────────────────┐
│ 🎲 随机吃什么           │
│                         │
│        (转盘)           │
│                         │
│      [开始转盘]         │
└─────────────────────────┘
```

转盘中心显示：

```
开始
```

转盘周围显示：

```
🍜 🍗 🍔 🍣 🍕
```

---

# 三、转盘交互流程

用户点击：

```
开始转盘
```

流程：

1 用户点击按钮
2 转盘开始快速旋转
3 逐渐减速
4 停在一个菜品

结果展示：

```
今天推荐吃：

🍜 拉面
```

---

# 四、组件结构

组件结构：

```
FoodRouletteCard
 ├ CardHeader
 ├ RouletteWheel
 ├ ResultDisplay
 └ ActionButton
```

组件状态：

```
idle
spinning
result
```

---

# 五、转盘逻辑

转盘数据：

```
[
 "拉面",
 "炒饭",
 "炸鸡",
 "汉堡",
 "寿司"
]
```

实现逻辑：

1 随机选一个菜
2 计算旋转角度
3 执行动画
4 停在对应菜品

示例：

```
rotation = 360 * 4 + randomAngle
```

---

# 六、动画设计

使用：

```
framer-motion
```

转盘动画：

```
initial: rotate(0)
animate: rotate(1440deg + randomAngle)
duration: 2s
ease: easeOut
```

按钮动画：

```
hover scale 1.05
tap scale 0.95
```

结果出现动画：

```
fade in + scale
```

---

# 七、主题系统（重点）

组件必须支持主题系统。

主题：

```
couple
cute
minimal
night
```

每个主题需要 **不同视觉设计**。

---

# 八、主题 UI 设计

## 1 Couple Theme（情侣风）

视觉特点：

* 粉色渐变
* 爱心元素
* 温柔风格

示例：

```
┌─────────────────────────┐
│ ❤️ 随机吃什么           │
│                         │
│        ❤️转盘❤️         │
│                         │
│     ❤️ 开始选择 ❤️      │
└─────────────────────────┘
```

转盘装饰：

```
爱心图标
```

结果展示：

```
今天适合吃：

🍗 炸鸡
```

---

## 2 Cute Theme（可爱风）

视觉特点：

* 糖果色
* 圆形 UI
* Q弹动画

示例：

```
┌─────────────────────────┐
│ 🎲 今天吃什么？         │
│                         │
│       🍭转盘🍭          │
│                         │
│      🍱 随机一下        │
└─────────────────────────┘
```

转盘元素：

```
🍜 🍔 🍟 🍣 🍕
```

动画：

```
emoji bounce
```

---

## 3 Minimal Theme（极简风）

视觉特点：

* 黑白
* 线条
* 简约

示例：

```
┌─────────────────────────┐
│ 随机选择                │
│                         │
│        转盘             │
│                         │
│        Start →          │
└─────────────────────────┘
```

转盘：

```
黑白线条
```

结果：

```
拉面
```

---

## 4 Night Theme（夜间风）

视觉特点：

* 深色背景
* neon glow
* 科技感

示例：

```
┌─────────────────────────┐
│ ⚡ Food Roulette        │
│                         │
│        ⚡转盘⚡          │
│                         │
│      ⚡ Start           │
└─────────────────────────┘
```

转盘效果：

```
霓虹光环
```

结果：

```
🍜 拉面
```

---

# 九、数据来源

菜品数据来自：

```
/api/dishes
```

返回示例：

```json
[
 { "name": "拉面" },
 { "name": "炒饭" },
 { "name": "炸鸡" },
 { "name": "汉堡" }
]
```

组件随机选择一个。

---

# 十、组件 Props

```ts
interface FoodRouletteCardProps {
 dishes: Dish[]
}
```

Dish 类型：

```ts
interface Dish {
 id: string
 name: string
}
```

---

# 十一、技术要求

使用：

* Next.js
* React
* TypeScript
* TailwindCSS
* ThemeContext
* framer-motion

---

# 十二、输出要求

请生成：

```
components/mobile/FoodRouletteCard.tsx
```

输出内容：

1 完整组件代码
2 转盘动画实现
3 随机逻辑
4 主题样式逻辑
5 使用示例

不要生成其它页面代码。
