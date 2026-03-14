# LoveMenu 想吃清单系统设计任务（Food Request / Wishlist System）

## 一、功能重新定义

当前的 **想吃清单模块**需要重新设计。

这个功能的真实目标是：

```text
用户可以提交菜单里没有的食物
请求系统未来加入菜单
```

也就是：

```text
用户点菜建议系统
```

流程是：

```text
用户提交想吃的食物
↓
进入想吃清单
↓
后台审核
↓
决定是否加入菜单
```

因此这个模块本质是：

```text
Food Request System
```

而不是普通的收藏系统。

---

# 二、核心目标

系统需要支持：

```text
用户提交想吃的食物
用户查看自己提交的食物
用户修改想吃内容
用户删除想吃内容
后台审核是否加入菜单
```

完整流程：

```text
用户想到一个想吃的东西
↓
提交想吃请求
↓
后台审核
↓
可能加入菜单
```

这个模块会成为：

```text
LoveMenu 的菜单进化系统
```

---

# 三、首页模块重新设计

首页已经有 **想吃清单模块**。

现在需要升级为：

```text
想吃提议入口
```

模块示例：

```text
┌─────────────────────┐
想吃清单

寿司
韩式炸鸡
抹茶蛋糕

＋ 提议新食物
└─────────────────────┘
```

点击模块：

```text
进入 Wishlist 页面
```

页面路径：

```text
/app/(mobile)/wishlist/page.tsx
```

首页规则：

```text
显示最近 3 条
```

如果超过：

```text
查看更多 →
```

点击：

```text
进入完整列表
```

---

# 四、提交想吃食物

页面需要一个 **新增按钮**：

```text
＋ 提议想吃
```

点击后：

```text
打开提交表单
```

组件：

```text
CreateFoodRequest
```

路径：

```text
/components/mobile/wishlist/CreateFoodRequest.tsx
```

---

# 五、提交表单设计

表单内容：

```text
食物名称
食物描述
图片（可选）
备注
```

示例：

```text
┌──────────────────┐
提议一个新食物

食物名称
[ 韩式炸鸡 ]

描述
[ 很想吃韩式炸鸡 ]

上传图片

提交
└──────────────────┘
```

数据结构：

```ts
{
 id: string
 name: string
 description: string
 image?: string
 createdAt: Date
 status: "pending" | "approved" | "rejected"
}
```

状态说明：

```text
pending   等待审核
approved  已加入菜单
rejected  未通过
```

---

# 六、想吃清单页面结构

页面结构：

```text
WishlistPage
 ├ WishlistHeader
 ├ RequestList
 │   └ RequestItem
 ├ AddRequestButton
 └ EmptyRequest
```

示意：

```text
┌──────────────────────┐
← 返回      想吃清单
──────────────────────

韩式炸鸡
寿司
抹茶蛋糕

＋ 提议新食物
└──────────────────────┘
```

---

# 七、RequestItem 设计

每个请求需要展示：

```text
图片
食物名称
描述
审核状态
编辑
删除
```

示例：

```text
┌────────────────────┐
🍗 韩式炸鸡

很想吃韩式炸鸡

状态：审核中

编辑  删除
└────────────────────┘
```

状态展示：

```text
审核中
已加入菜单
未通过
```

颜色区分：

```text
黄色 pending
绿色 approved
红色 rejected
```

---

# 八、编辑功能

用户可以：

```text
修改自己提交的请求
```

点击：

```text
编辑
```

打开：

```text
编辑表单
```

组件：

```text
EditFoodRequest
```

路径：

```text
/components/mobile/wishlist/EditFoodRequest.tsx
```

---

# 九、删除功能

用户可以删除请求。

流程：

```text
点击删除
↓
弹出确认
↓
删除成功
```

提示：

```text
已删除
```

---

# 十、空状态页面

如果没有任何想吃提议：

组件：

```text
EmptyRequest
```

显示：

```text
🍜

还没有新的想吃提议

告诉我们你想吃什么
```

按钮：

```text
＋ 提议新食物
```

---

# 十一、后台审核逻辑（说明）

后台会看到：

```text
用户提议的食物
```

管理员可以：

```text
通过
拒绝
```

通过后：

```text
status = approved
```

系统可以：

```text
加入菜单
```

---

# 十二、首页模块主题设计

首页的 **想吃清单模块**需要支持四种主题。

主题：

```text
couple
cute
minimal
night
```

---

# 十三、情侣主题（couple）

主题氛围：

```text
浪漫
温柔
恋爱感
```

背景：

```css
linear-gradient(180deg,#ffe4ec,#ffd1e0)
```

模块设计：

```text
圆角卡片
爱心装饰
柔和阴影
```

按钮：

```text
💗 提议新食物
```

模块文案：

```text
宝贝最近想吃什么 ❤️
```

列表项：

```text
💞 韩式炸鸡
```

动画：

```text
爱心轻微跳动
```

---

# 十四、可爱主题（cute）

主题氛围：

```text
卡通
活泼
糖果色
```

背景：

```css
#fff5fb
```

模块设计：

```text
气泡卡片
圆润边框
```

按钮：

```text
🍭 提议新食物
```

模块文案：

```text
今天想吃什么好吃的 🍓
```

列表项：

```text
⭐ 抹茶蛋糕
```

动画：

```text
卡片弹跳动画
```

---

# 十五、极简主题（minimal）

主题氛围：

```text
克制
高级
极简
```

背景：

```text
纯白
```

模块设计：

```text
细边框
无阴影
```

按钮：

```text
＋ 提议
```

模块文案：

```text
记录新的菜单想法
```

列表项：

```text
Sushi
```

动画：

```text
轻微淡入
```

---

# 十六、夜间主题（night）

主题氛围：

```text
夜晚
科技
霓虹
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

按钮：

```text
🌙 提议新食物
```

模块文案：

```text
夜宵想吃什么
```

列表项：

```text
🍜 拉面
```

动画：

```text
霓虹呼吸动画
```

---

# 十七、文件结构

新增目录：

```text
/components/mobile/wishlist
```

组件：

```text
wishlist
 WishlistHeader.tsx
 RequestList.tsx
 RequestItem.tsx
 CreateFoodRequest.tsx
 EditFoodRequest.tsx
 EmptyRequest.tsx
```

页面：

```text
/app/(mobile)/wishlist/page.tsx
```

---

# 十八、生成代码要求

AI 生成代码必须：

```text
使用 Next.js App Router
使用 ThemeContext
支持 CRUD
支持图片上传
支持状态展示
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

新的 **想吃清单系统**将变成：

```text
用户参与菜单设计
```

用户体验：

```text
想到想吃的
提交提议
等待加入菜单
```

这个系统将让：

```text
菜单不断进化
```

最终形成：

```text
LoveMenu 的社区菜单系统
```
