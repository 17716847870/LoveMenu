# LoveMenu 数据库设计文档

本项目采用关系型数据库，通过 Prisma 进行 ORM 建模。以下是核心数据表结构及关系说明：

## 1. 核心业务表 (Core Models)

### User (用户表)
用于存储后台管理员和前台用户的账号信息。
*   `id` (String): 主键，唯一标识
*   `username` (String): 登录账号 (唯一)
*   `password` (String): 登录密码
*   `name` (String): 用户昵称
*   `email` (String?): 邮箱地址 (可选，唯一)
*   `avatar` (String?): 头像URL (可选)
*   `role` (String): 角色，默认 `"user"`，可选值：`"admin" | "user"`
*   `createdAt` (DateTime): 创建时间
*   **关联**:
    *   `orders`: 关联 `Order` (一对多)
    *   `chat`: 关联 `ChatMessage` (一对多)

### DishCategory (菜品分类表)
用于管理菜单的分类（如：主食、甜点、饮品）。
*   `id` (String): 主键
*   `name` (String): 分类名称
*   `sortOrder` (Int): 排序权重，用于前端展示顺序
*   **关联**:
    *   `dishes`: 关联 `Dish` (一对多)

### Dish (菜品表)
存储所有菜品的信息。
*   `id` (String): 主键
*   `name` (String): 菜品名称
*   `description` (String): 菜品描述
*   `categoryId` (String): 外键，关联 `DishCategory`
*   `kissPrice` (Int): 亲亲价格 (货币1)
*   `hugPrice` (Int): 抱抱价格 (货币2)
*   `image` (String?): 菜品图片URL (可选)
*   `popularity` (Int): 流行度/点单次数，默认 0
*   `allowCook` (Boolean): 是否允许在家做，默认 true
*   `allowRestaurant` (Boolean): 是否允许去餐厅吃，默认 true
*   `createdAt` (DateTime): 创建时间
*   **关联**:
    *   `category`: 关联 `DishCategory` (多对一)
    *   `orderItems`: 关联 `OrderItem` (一对多)
    *   `cartItems`: 关联 `CartItem` (一对多)

## 2. 交易流转表 (Transaction Models)

### Order (订单表)
记录用户的点餐记录。
*   `id` (String): 主键
*   `userId` (String): 外键，关联 `User`
*   `status` (String): 订单状态 (如：`"pending" | "preparing" | "ready" | "completed" | "cancelled"`)
*   `totalKiss` (Int): 订单消耗的总亲亲数
*   `totalHug` (Int): 订单消耗的总抱抱数
*   `note` (String?): 订单备注 (可选)
*   `reason` (String?): 点餐理由 (可选)
*   `isEmergency` (Boolean): 是否为紧急订单 (如："饿晕了")，默认 false
*   `createdAt` (DateTime): 创建时间
*   **关联**:
    *   `items`: 关联 `OrderItem` (一对多)
    *   `feedback`: 关联 `OrderFeedback` (一对一)
    *   `user`: 关联 `User` (多对一)

### OrderItem (订单明细表)
记录每个订单中的具体菜品及数量。
*   `id` (String): 主键
*   `orderId` (String): 外键，关联 `Order`
*   `dishId` (String): 外键，关联 `Dish`
*   `quantity` (Int): 点餐数量
*   `note` (String?): 单品备注 (可选)
*   **关联**:
    *   `order`: 关联 `Order` (多对一)
    *   `dish`: 关联 `Dish` (多对一)

### CartItem (购物车表)
记录用户购物车中尚未下单的菜品。
*   `id` (String): 主键
*   `userId` (String): 外键，关联 `User`
*   `dishId` (String): 外键，关联 `Dish`
*   `quantity` (Int): 数量
*   **关联**:
    *   `user`: 关联 `User` (多对一)
    *   `dish`: 关联 `Dish` (多对一)

## 3. 互动与反馈表 (Interaction Models)

### OrderFeedback (订单回忆/反馈表)
当订单完成后，用户可以记录关于这顿饭的回忆（相册功能）。
*   `id` (String): 主键
*   `orderId` (String): 外键，关联 `Order` (唯一)
*   `text` (String): 回忆文字内容
*   `image` (String?): 回忆图片URL (可以是JSON数组字符串存储多图)
*   `createdAt` (DateTime): 创建时间
*   **关联**:
    *   `order`: 关联 `Order` (一对一)

### FoodRequest (食物请求表 / 心愿单)
用户想吃但菜单上没有的食物，可以提交请求。
*   `id` (String): 主键
*   `name` (String): 食物名称
*   `description` (String): 食物描述/做法要求
*   `image` (String?): 参考图片URL
*   `status` (String): 请求状态 (如：`"pending" | "approved" | "rejected"`)，默认 `"pending"`
*   `createdAt` (DateTime): 创建时间

### UrgentRequest (紧急请求表)
记录用户的紧急诉求（如一键呼叫）。
*   `id` (String): 主键
*   `content` (String): 呼叫内容
*   `createdAt` (DateTime): 创建时间

### Feedback (系统反馈表)
用户对系统本身提出的 Bug、新功能建议等。
*   `id` (String): 主键
*   `type` (String): 反馈类型 (`"bug" | "feature" | "menu" | "experience"`)
*   `title` (String): 反馈标题
*   `content` (String): 反馈详细内容
*   `image` (String?): 截图 (可选)
*   `status` (String): 处理状态 (`"open" | "processing" | "resolved"`)，默认 `"open"`
*   `createdAt` (DateTime): 创建时间

### ChatMessage (聊天消息表)
后台管理员与前台用户之间的消息记录。
*   `id` (String): 主键
*   `senderId` (String): 发送者外键，关联 `User`
*   `type` (String): 消息类型 (`"text" | "image" | "voice" | "emoji"`)
*   `content` (String): 消息内容 (文本或资源URL)
*   `createdAt` (DateTime): 创建时间
*   **关联**:
    *   `sender`: 关联 `User` (多对一)

## 4. 系统配置表 (System Models)

### SystemConfig (系统配置表)
用于存储系统级别的动态配置（如情侣信息、纪念日等）。
*   `id` (String): 主键
*   `key` (String): 配置键名 (唯一，如 `"couple_profile"`)
*   `value` (String): 配置内容 (通常存储 JSON 字符串)

---
*注：以上结构已同步在项目的 `prisma/schema.prisma` 文件中定义，并可随时通过 `npx prisma db push` 等命令推送到 PostgreSQL 数据库。*
