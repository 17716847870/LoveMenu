# LoveMenu 数据库设计文档

本项目使用 PostgreSQL + Prisma ORM。本文仅描述数据库结构与数据关系。

## 1. 核心业务表（Core Models）

### User（用户表）
用于存储后台管理员和前台用户账号。

- `id` (String): 主键，`cuid()`
- `username` (String): 登录账号（唯一）
- `password` (String): 密码哈希
- `name` (String): 昵称
- `email` (String?): 邮箱（可选，唯一）
- `avatar` (String?): 头像 URL（可选）
- `role` (String): 角色，默认 `"user"`（`"admin" | "user"`）
- `kissBalance` (Int): 亲亲余额，默认 `100`
- `hugBalance` (Int): 抱抱余额，默认 `100`
- `createdAt` (DateTime): 创建时间

**关联：**
- `orders`: `User 1 - N Order`
- `chat`: `User 1 - N ChatMessage`（发送者）
- `cartItems`: `User 1 - N CartItem`

### DishCategory（菜品分类表）

- `id` (String): 主键
- `name` (String): 分类名称
- `sortOrder` (Int): 排序权重

**关联：**
- `dishes`: `DishCategory 1 - N Dish`

### Dish（菜品表）

- `id` (String): 主键
- `name` (String): 菜品名称
- `description` (String): 描述
- `categoryId` (String): 外键 -> `DishCategory.id`
- `kissPrice` (Int): 亲亲价格
- `hugPrice` (Int): 抱抱价格
- `image` (String?): 图片 URL
- `popularity` (Int): 热度，默认 `0`
- `allowCook` (Boolean): 是否支持在家做，默认 `true`
- `allowRestaurant` (Boolean): 是否支持外出吃，默认 `true`
- `createdAt` (DateTime): 创建时间

**关联：**
- `category`: `Dish N - 1 DishCategory`
- `orderItems`: `Dish 1 - N OrderItem`
- `cartItems`: `Dish 1 - N CartItem`

## 2. 交易流转表（Transaction Models）

### Order（订单表）

- `id` (String): 主键
- `userId` (String): 外键 -> `User.id`
- `status` (String): 订单状态（如 `pending / preparing / completed / cancelled`）
- `totalKiss` (Int): 总亲亲消耗
- `totalHug` (Int): 总抱抱消耗
- `note` (String?): 备注
- `reason` (String?): 下单理由
- `isEmergency` (Boolean): 紧急订单标记，默认 `false`
- `createdAt` (DateTime): 创建时间

**关联：**
- `items`: `Order 1 - N OrderItem`
- `feedback`: `Order 1 - 1 OrderFeedback`
- `user`: `Order N - 1 User`

### OrderItem（订单明细表）

- `id` (String): 主键
- `orderId` (String): 外键 -> `Order.id`
- `dishId` (String): 外键 -> `Dish.id`
- `quantity` (Int): 数量
- `note` (String?): 单品备注

**关联：**
- `order`: `OrderItem N - 1 Order`
- `dish`: `OrderItem N - 1 Dish`

### CartItem（购物车表）

- `id` (String): 主键
- `userId` (String): 外键 -> `User.id`
- `dishId` (String): 外键 -> `Dish.id`
- `quantity` (Int): 数量

**关联：**
- `user`: `CartItem N - 1 User`
- `dish`: `CartItem N - 1 Dish`

## 3. 互动与反馈表（Interaction Models）

### OrderFeedback（订单回忆/反馈）

- `id` (String): 主键
- `orderId` (String): 外键（唯一）-> `Order.id`
- `text` (String): 回忆文本
- `image` (String?): 图片 URL（支持 JSON 数组字符串）
- `createdAt` (DateTime): 创建时间

### FoodRequest（心愿单）

- `id` (String): 主键
- `name` (String): 食物名称
- `description` (String): 描述
- `image` (String?): 参考图
- `status` (String): `pending | approved | rejected`
- `createdAt` (DateTime): 创建时间

### UrgentRequest（紧急请求）

- `id` (String): 主键
- `content` (String): 内容
- `createdAt` (DateTime): 创建时间

### Feedback（系统反馈）

- `id` (String): 主键
- `type` (String): `bug | feature | menu | experience`
- `title` (String): 标题
- `content` (String): 内容
- `image` (String?): 截图
- `status` (String): `open | processing | resolved`，默认 `open`
- `createdAt` (DateTime): 创建时间

### ChatMessage（聊天消息）

> 本项目是双人聊天（1v1），无会话维度。

- `id` (String): 主键
- `senderId` (String): 发送者外键 -> `User.id`
- `type` (String): `text | image | voice | emoji`
- `content` (String): 文本内容或媒体 URL
- `createdAt` (DateTime): 创建时间

**关联：**
- `sender`: `ChatMessage N - 1 User`

### ChatMessageRead（消息已读表）

- `id` (String): 主键
- `messageId` (String): 外键语义 -> `ChatMessage.id`
- `userId` (String): 外键语义 -> `User.id`
- `createdAt` (DateTime): 已读时间

**约束与索引：**
- 唯一约束：`(messageId, userId)`
- 索引：`userId`、`messageId`

**用途：**
- 用于计算未读数
- 用于记录已读状态（每个用户对每条消息最多一条已读记录）

## 4. 系统配置表（System Models）

### SystemConfig（系统配置）

- `id` (String): 主键
- `key` (String): 配置键（唯一，如 `couple_profile`）
- `value` (String): 配置值（通常 JSON 字符串）

---

> 注：数据库实际字段与约束以 `prisma/schema.prisma` 及迁移脚本为准。
npx prisma migrate dev --name add-user-age
# 1. 先改 prisma/schema.prisma
# 2. 再生成 migration
npx prisma migrate dev --name 变更名

# 3. 生成客户端
npx prisma generate

# 4. 提交
git add prisma
git commit -m "feat: 数据库变更"
git push origin main