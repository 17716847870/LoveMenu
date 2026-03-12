# LoveMenu 项目开发说明

## 一、项目介绍

LoveMenu 是一个为情侣设计的互动点餐系统。

系统只有两个主要用户。一方负责点餐。另一方负责查看订单并准备食物。

用户可以在前台选择想吃的菜，并提交订单。
系统使用 **“亲亲” 和 “贴贴”** 作为价格单位，而不是使用金钱。

系统还支持聊天功能。用户可以发送文字、图片、语音和表情。

系统支持高度 UI 配置。管理员可以配置背景图片、主题颜色和情侣文案。

系统需要支持多个 UI 主题，并且用户可以在前台自由切换主题。

---

# 二、技术栈

前端框架：

* Next.js (App Router)
* React
* TypeScript

UI技术：

* TailwindCSS
* CSS Variables 主题系统

后端：

* Next.js API Routes

数据库：

* PostgreSQL

文件存储：

* 本地存储或对象存储

---

# 三、UI主题系统

系统需要支持主题切换。

支持以下主题：

* couple（情侣风）
* cute（可爱风）
* minimal（极简风）
* night（夜间模式）

主题需要使用 CSS Variables 实现。

示例：

```css
:root {
  --color-primary: #ff6b9a;
  --color-bg: #fff7f9;
  --color-card: #ffffff;
  --color-text: #333333;
}
```

用户可以在前台切换主题。

系统需要记住用户选择的主题。

---

# 四、UI组件清单

系统需要实现以下 UI 组件。

基础组件：

* Button
* IconButton
* Input
* Textarea
* Select
* Modal
* Avatar
* Badge
* Tabs
* ThemeSwitcher

布局组件：

* PageContainer
* Card
* Grid
* EmptyState

业务组件：

* DishCard
* DishCategory
* CartItem
* OrderCard
* OrderStatusTag
* ChatBubble
* MessageInput
* ImageUploader
* VoiceRecorder
* EmojiPicker

统计组件：

* PopularDishList
* WeeklyFavoriteList
* TodayOrderList

---

# 五、页面结构

前台页面：

* 首页
* 菜单页面
* 购物车页面
* 订单页面
* 历史订单页面
* 聊天页面

后台页面：

* 管理后台首页
* 菜品管理
* 分类管理
* 订单管理
* 聊天管理
* UI配置管理

---

# 六、数据库设计

需要以下数据表。

## users

用户表

字段：

* id
* name
* email
* avatar
* role
* created_at

---

## dish_categories

菜品分类

字段：

* id
* name
* sort_order

---

## dishes

菜品

字段：

* id
* name
* description
* category_id
* kiss_price
* hug_price
* image
* popularity
* allow_cook
* allow_restaurant
* created_at

---

## orders

订单

字段：

* id
* user_id
* status
* total_kiss
* total_hug
* note
* created_at

---

## order_items

订单菜品

字段：

* id
* order_id
* dish_id
* quantity
* note

---

## cart_items

购物车

字段：

* id
* user_id
* dish_id
* quantity

---

## wish_dishes

愿望菜

字段：

* id
* name
* description
* created_at

---

## urgent_requests

紧急想吃

字段：

* id
* content
* created_at

---

## order_feedback

订单反馈

字段：

* id
* order_id
* text
* image
* created_at

---

## chat_messages

聊天消息

字段：

* id
* sender_id
* type
* content
* created_at

消息类型：

* text
* image
* voice
* emoji

---

## system_configs

系统配置

字段：

* id
* key
* value

配置内容：

* background_image
* theme
* couple_text
* empty_state_image

---

# 七、Next.js 项目目录结构

项目目录结构如下：

```
/app
  /api
  /admin
  /menu
  /cart
  /orders
  /chat

/components
  /ui
  /dish
  /order
  /chat

/lib
  db.ts
  theme.ts

/themes
  couple.ts
  cute.ts
  minimal.ts
  night.ts

/hooks
  useTheme.ts
  useCart.ts

/utils
  format.ts

/types
  index.ts

/prisma
  schema.prisma
```

---

# 八、核心功能

系统需要实现以下核心功能：

1 菜单浏览
2 分类筛选
3 添加购物车
4 提交订单
5 订单状态管理
6 历史订单
7 今日已点
8 本周最爱
9 随机吃什么

互动功能：

* 聊天系统
* 表情消息
* 图片消息
* 语音消息

互动系统：

* 愿望菜
* 紧急想吃
* 订单反馈

系统功能：

* UI主题切换
* 背景图片配置
* 情侣文案配置

---

# 九、开发要求

代码需要满足以下要求：

* 使用 TypeScript
* 组件化设计
* 使用 TailwindCSS
* 支持主题切换
* 代码结构清晰
* API 使用 REST 风格

---

# 十、目标

生成一个可以运行的第一版系统。

系统需要包括：

* 前台页面
* 管理后台
* 数据库结构
* API接口
* UI组件
