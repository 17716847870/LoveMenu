# LoveMenu 菜单详情页面 UI 重设计

目标：

当前菜单详情页结构过于简单，需要重新设计。

新页面需要：

1 提升视觉层级
2 增加情侣互动感
3 每个主题有不同设计风格
4 页面更加像真实产品

---

# 一、页面结构（新版）

新的页面结构：

DishDetailPage

Header
DishHero
DishMainCard
LoveInteraction
IngredientCost
MemoryTip
AddToMenuBar

---

# 二、Header

左侧：

返回按钮

右侧：

收藏按钮 ❤️

情侣风：

爱心按钮动画

可爱风：

跳动表情按钮

极简风：

简单线性图标

夜间模式：

霓虹发光按钮

---

# 三、DishHero（菜品大图区域）

尺寸：

16:9

图片底部增加渐变遮罩：

dark gradient overlay

用于提升文字可读性

图片底部显示：

菜名

示例：

日式炸猪排

字体：

大标题

---

# 四、DishMainCard（核心信息卡片）

图片下方增加一张 **浮动卡片**

卡片内容：

菜品介绍
点赞数据
分享数据

示例：

外酥里嫩
配特制酱汁

❤️ 90 次
👫 45 分享

卡片设计：

情侣风

圆角大卡片
粉色阴影

可爱风

气泡卡片
彩色边框

极简风

白卡片
细边框

夜间模式

深色卡片
霓虹边框

---

# 五、LoveInteraction（情侣互动）

新增模块：

情侣互动统计

示例：

今天TA想吃 ❤️
被点次数

❤️ 被点 90 次
💌 被分享 45 次

情侣风：

爱心图标动画

可爱风：

表情图标

极简风：

简单文本

夜间模式：

发光数字

---

# 六、IngredientCost（点菜消耗）

新增模块：

点菜需要消耗

示例：

需要：

❤️ 爱心 3
😊 贴贴 1

UI设计：

情侣风

爱心徽章

可爱风

贴纸风格

极简风

简单标签

夜间模式

发光标签

---

# 七、MemoryTip（情侣小提示）

新增模块：

情侣提示

示例：

💡 小提示

这道菜适合
一起追剧的时候吃

或者

适合周末一起做

这个模块可以增加产品温度

---

# 八、AddToMenuBar（底部按钮）

固定底部按钮

按钮文案：

加入菜单

按钮设计根据主题变化

情侣风

粉色渐变按钮

可爱风

糖果色按钮

极简风

黑白按钮

夜间模式

霓虹按钮

---

# 九、主题设计（关键）

四个主题不仅换颜色，还要换风格。

---

## 情侣风（couple）

风格：

浪漫
柔和
粉色

设计元素：

爱心
渐变
圆角

背景：

粉色渐变

卡片：

柔和阴影

按钮：

粉色渐变按钮

---

## 可爱风（cute）

风格：

卡通
活泼
糖果色

设计元素：

emoji
贴纸
气泡卡片

卡片：

圆角气泡

按钮：

糖果按钮

---

## 极简风（minimal）

风格：

黑白
简约

设计元素：

细线条
留白

卡片：

白色边框卡片

按钮：

黑色按钮

---

## 夜间模式（night）

风格：

深色
霓虹

设计元素：

霓虹边框
发光按钮

背景：

深灰

卡片：

深色卡片

按钮：

紫色霓虹按钮

---

# 十、动画

加入轻量动画：

页面加载：

fade in

按钮点击：

scale

爱心点击：

bounce

---

# 十一、组件结构

/components/mobile/dish

DishHero.tsx

DishMainCard.tsx

LoveInteraction.tsx

IngredientCost.tsx

MemoryTip.tsx

AddToMenuBar.tsx

---

# 十二、生成页面

/app/(mobile)/menu/[id]/page.tsx

要求：

使用 ThemeContext

根据 theme 渲染不同 UI

主题：

couple
cute
minimal
night
