# LoveMenu 数据库设计文档

本项目当前使用 `PostgreSQL + Prisma ORM`。
本文档根据最新的 `prisma/schema.prisma` 同步整理，描述**现有表结构、字段含义、关系、约束与主要业务流转**。

---

## 1. 技术栈与数据源

- 数据库：`PostgreSQL`
- ORM：`Prisma`
- 主键策略：大多数表使用 `String @id @default(cuid())`
- 时间字段：统一使用 `DateTime`
- 文档基准：`prisma/schema.prisma`

> 如果文档与代码不一致，以 `prisma/schema.prisma` 为准。

---

## 2. ER 概览

### 用户与交易
- `User` 1 - N `Order`
- `Order` 1 - N `OrderItem`
- `Dish` 1 - N `OrderItem`
- `User` 1 - N `CartItem`
- `Dish` 1 - N `CartItem`

### 菜品与分类/收藏
- `DishCategory` 1 - N `Dish`
- `User` 1 - N `DishFavorite`
- `Dish` 1 - N `DishFavorite`

### 聊天与已读
- `User` 1 - N `ChatMessage`
- `ChatMessage` 1 - N `ChatMessageRead`
- `User` 1 - N `ChatMessageRead`

### 订单反馈
- `Order` 1 - 1 `OrderFeedback`

### 纪念日提醒
- `Anniversary` 1 - N `AnniversaryLog`

---

## 3. 核心业务表

## 3.1 `User` 用户表

用于存储系统用户，当前既可表示普通用户，也可表示管理员。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键，`cuid()` |
| `username` | `String` | 登录账号，唯一 |
| `password` | `String` | 密码哈希 |
| `name` | `String` | 昵称/展示名 |
| `email` | `String?` | 邮箱，可空，唯一 |
| `avatar` | `String?` | 头像 URL |
| `role` | `String` | 角色，默认 `"user"` |
| `kissBalance` | `Int` | 亲亲余额，默认 `100` |
| `hugBalance` | `Int` | 贴贴余额，默认 `100` |
| `createdAt` | `DateTime` | 创建时间，默认 `now()` |

### 关联
- `cartItems`: 用户购物车项
- `orders`: 用户订单
- `chat`: 用户发送的聊天消息
- `chatReads`: 用户的消息已读记录
- `favorites`: 用户收藏的菜品

### 说明
- 当前 schema 未拆分独立的管理员表，管理员通过 `role` 区分。
- `hugBalance` 是数据库字段名，前端文案目前展示为“贴贴”。

---

## 3.2 `DishCategory` 菜品分类表

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `name` | `String` | 分类名称 |
| `sortOrder` | `Int` | 排序值 |

### 关联
- `dishes`: 一个分类下的多个菜品

---

## 3.3 `Dish` 菜品表

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `name` | `String` | 菜品名称 |
| `description` | `String` | 菜品描述 |
| `categoryId` | `String` | 外键，关联 `DishCategory.id` |
| `kissPrice` | `Int` | 亲亲价格 |
| `hugPrice` | `Int` | 贴贴价格 |
| `image` | `String?` | 图片 URL |
| `popularity` | `Int` | 热度，默认 `0` |
| `allowCook` | `Boolean` | 是否支持在家做，默认 `true` |
| `allowRestaurant` | `Boolean` | 是否支持外出吃，默认 `true` |
| `createdAt` | `DateTime` | 创建时间 |

### 关联
- `category`: 所属分类
- `orderItems`: 被哪些订单引用
- `cartItems`: 被哪些购物车项引用
- `favorites`: 被哪些收藏记录引用

---

## 4. 交易与订单表

## 4.1 `Order` 订单表

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `userId` | `String` | 外键，关联 `User.id` |
| `status` | `String` | 订单状态 |
| `totalKiss` | `Int` | 订单总亲亲消耗 |
| `totalHug` | `Int` | 订单总贴贴消耗 |
| `note` | `String?` | 订单备注 |
| `reason` | `String?` | 下单理由 |
| `isEmergency` | `Boolean` | 是否紧急订单，默认 `false` |
| `createdAt` | `DateTime` | 下单时间 |

### 关联
- `user`: 下单用户
- `items`: 订单明细
- `feedback`: 订单回忆/反馈（可选，一对一）

### 当前业务状态
当前接口层已按以下状态流转处理：

- `pending -> preparing`
- `pending -> cancelled`
- `preparing -> completed`

不允许：
- `completed -> cancelled`
- `cancelled -> pending`
- 其它任意非法跳转

### 当前余额规则
- 下单时扣减 `User.kissBalance` / `User.hugBalance`
- 订单从 `pending -> cancelled` 时退回余额

---

## 4.2 `OrderItem` 订单明细表

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `orderId` | `String` | 外键，关联 `Order.id` |
| `dishId` | `String` | 外键，关联 `Dish.id` |
| `quantity` | `Int` | 数量 |
| `note` | `String?` | 单项备注 |

### 关联
- `order`: 所属订单
- `dish`: 对应菜品

---

## 4.3 `CartItem` 购物车表

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `userId` | `String` | 外键，关联 `User.id` |
| `dishId` | `String` | 外键，关联 `Dish.id` |
| `quantity` | `Int` | 数量 |

### 关联
- `user`: 所属用户
- `dish`: 对应菜品

---

## 4.4 `DishFavorite` 菜品收藏表

用于记录用户收藏的菜品。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `userId` | `String` | 外键，关联 `User.id` |
| `dishId` | `String` | 外键，关联 `Dish.id` |
| `createdAt` | `DateTime` | 收藏时间 |

### 关联
- `user`: 收藏者
- `dish`: 被收藏菜品

### 约束与索引
- 唯一约束：`@@unique([userId, dishId])`
- 索引：`@@index([userId])`
- 索引：`@@index([dishId])`
- 删除策略：`dish` / `user` 关联使用 `onDelete: Cascade`

---

## 5. 互动与反馈表

## 5.1 `OrderFeedback` 订单反馈/回忆表

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `orderId` | `String` | 外键，且唯一，关联 `Order.id` |
| `text` | `String` | 回忆文字 |
| `image` | `String?` | 图片数据，通常为 URL 或 JSON 字符串 |
| `createdAt` | `DateTime` | 创建时间 |

### 关系
- `Order 1 - 1 OrderFeedback`

---

## 5.2 `FoodRequest` 心愿单/想吃清单

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `name` | `String` | 食物名称 |
| `description` | `String` | 描述 |
| `image` | `String?` | 参考图 |
| `status` | `String` | 状态，默认 `"pending"` |
| `createdAt` | `DateTime` | 创建时间 |

### 状态说明
当前 schema 中仅存字符串，业务上常见值为：
- `pending`
- `approved`
- `rejected`

---

## 5.3 `UrgentRequest` 紧急请求表

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `content` | `String` | 请求内容 |
| `createdAt` | `DateTime` | 创建时间 |

---

## 5.4 `Feedback` 系统反馈表

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `type` | `String` | 反馈类型 |
| `title` | `String` | 标题 |
| `content` | `String` | 内容 |
| `image` | `String?` | 图片/截图 |
| `status` | `String` | 状态，默认 `"open"` |
| `createdAt` | `DateTime` | 创建时间 |

### 常见业务值
- `type`: `bug | feature | menu | experience`
- `status`: `open | processing | resolved`

---

## 5.5 `ChatMessage` 聊天消息表

当前项目是双人聊天模型，没有单独的会话表。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `senderId` | `String` | 外键，关联 `User.id` |
| `type` | `String` | 消息类型 |
| `content` | `String` | 文本内容或资源地址 |
| `createdAt` | `DateTime` | 发送时间 |

### 关联
- `sender`: 发送者
- `reads`: 已读记录

### 常见业务值
- `text`
- `image`
- `voice`
- `emoji`

---

## 5.6 `ChatMessageRead` 消息已读表

记录“某个用户是否已读某条消息”。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `messageId` | `String` | 外键，关联 `ChatMessage.id` |
| `userId` | `String` | 外键，关联 `User.id` |
| `createdAt` | `DateTime` | 已读时间 |

### 关联
- `message`: 对应消息，`onDelete: Cascade`
- `user`: 对应用户，`onDelete: Cascade`

### 约束与索引
- 唯一约束：`@@unique([messageId, userId])`
- 索引：`@@index([userId])`
- 索引：`@@index([messageId])`

---

## 6. 系统配置与运维表

## 6.1 `SystemConfig` 系统配置表

用于保存全局配置项。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `key` | `String` | 配置键，唯一 |
| `value` | `String` | 配置值，通常为字符串或 JSON 字符串 |

### 用途示例
- 在一起日期
- 首页展示配置
- 其它轻量系统配置

---

## 6.2 `ErrorLog` 错误日志表

用于统一记录接口报错和前端运行时错误。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `source` | `String` | 来源，如 `api` / `frontend` |
| `level` | `String` | 日志等级，默认 `"error"` |
| `scope` | `String?` | 错误作用域 |
| `path` | `String?` | 路由路径 |
| `method` | `String?` | HTTP 方法 |
| `message` | `String` | 错误消息 |
| `stack` | `String?` | 堆栈信息 |
| `url` | `String?` | 请求地址或页面地址 |
| `userAgent` | `String?` | 用户代理 |
| `metadata` | `Json?` | 额外上下文 |
| `createdAt` | `DateTime` | 创建时间 |

### 索引
- `@@index([source, createdAt])`
- `@@index([createdAt])`

---

## 7. 纪念日提醒模块

## 7.1 `Anniversary` 纪念日表

用于配置周期性纪念日提醒。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `title` | `String` | 纪念日标题 |
| `calendarType` | `String` | 日历类型，如 `solar` / `lunar` |
| `month` | `Int` | 月份 |
| `day` | `Int` | 日期 |
| `weekday` | `Int?` | 周几，仅周循环规则时使用 |
| `repeatType` | `String` | 重复规则 |
| `advanceDays` | `Int` | 提前提醒天数，默认 `0` |
| `emailTo` | `String` | 收件邮箱 |
| `emailSubject` | `String` | 邮件主题 |
| `emailContent` | `String` | 邮件正文 |
| `status` | `String` | 状态，默认 `"active"` |
| `nextRemindAt` | `DateTime?` | 下一次提醒时间 |
| `createdAt` | `DateTime` | 创建时间 |
| `updatedAt` | `DateTime` | 更新时间，`@updatedAt` |

### 关联
- `logs`: 发送日志

### 常见业务值
- `calendarType`: `solar | lunar`
- `repeatType`: `once | weekly | monthly | quarterly | halfyear | yearly`
- `status`: `active | paused | done`

---

## 7.2 `AnniversaryLog` 纪念日发送日志表

记录纪念日提醒的实际发送结果。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `String` | 主键 |
| `anniversaryId` | `String` | 外键，关联 `Anniversary.id` |
| `sentAt` | `DateTime` | 发送时间，默认 `now()` |
| `emailTo` | `String` | 实际收件人 |
| `status` | `String` | 发送结果 |
| `error` | `String?` | 失败原因 |

### 关联
- `anniversary`: 所属纪念日，`onDelete: Cascade`

### 索引
- `@@index([anniversaryId])`

### 常见业务值
- `status`: `success | failed`

---

## 8. 当前 schema 中的重要约束汇总

### 唯一约束
- `User.username`
- `User.email`
- `SystemConfig.key`
- `OrderFeedback.orderId`
- `DishFavorite(userId, dishId)`
- `ChatMessageRead(messageId, userId)`

### 级联删除
- `DishFavorite.dish -> onDelete: Cascade`
- `DishFavorite.user -> onDelete: Cascade`
- `ChatMessageRead.message -> onDelete: Cascade`
- `ChatMessageRead.user -> onDelete: Cascade`
- `AnniversaryLog.anniversary -> onDelete: Cascade`

### 索引
- `DishFavorite.userId`
- `DishFavorite.dishId`
- `ChatMessageRead.userId`
- `ChatMessageRead.messageId`
- `AnniversaryLog.anniversaryId`
- `ErrorLog(source, createdAt)`
- `ErrorLog(createdAt)`

---

## 9. 与旧文档相比的主要更新点

本次已补齐并同步以下内容：

- 新增 `DishFavorite` 收藏表说明
- 新增 `Anniversary` / `AnniversaryLog` 纪念日模块说明
- 新增 `ErrorLog` 错误日志表说明
- 同步 `ChatMessageRead` 的唯一约束与索引
- 同步 `DishFavorite` / `ChatMessageRead` / `AnniversaryLog` 的级联删除策略
- 同步订单取消退款与状态流转规则说明
- 将“抱抱”前台文案语义更新为“贴贴”，同时保留数据库字段名 `hug*`
- 去掉了旧文档底部无关的迁移命令残留

---

## 10. 数据库变更建议流程

如果后续要改表结构，建议按下面流程进行：

1. 修改 `prisma/schema.prisma`
2. 生成迁移：

```bash
npx prisma migrate dev --name your_migration_name
```

3. 重新生成 Prisma Client：

```bash
npx prisma generate
```

4. 同步更新本文档 `DATABASE_DESIGN.md`

---

最后更新时间：基于当前仓库中的 `prisma/schema.prisma` 自动对齐整理。
