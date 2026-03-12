# LoveMenu 聊天页面 UI 重构 Prompt

当前聊天页面需要升级为 **沉浸式情侣聊天界面**。

设计目标：

1. 移除电话和视频按钮
2. 移除 BottomNavigationBar
3. 移除主题切换按钮
4. 优化聊天气泡
5. 增加情侣互动元素
6. 增加聊天动效

---

# 一、页面路径

```text
/app/(mobile)/chat/page.tsx
```

该页面属于 **沉浸式页面**。

需要：

```text
独立 layout
```

路径：

```text
/app/(mobile)/chat/layout.tsx
```

此 layout **不包含 BottomNavigationBar**。

---

# 二、页面结构

```text
ChatPage
 ├ ChatHeader
 ├ ChatMessages
 └ ChatInputBar
```

---

# 三、顶部聊天栏

UI：

```
[头像] 亲爱的
      在线
```

结构：

```text
ChatHeader
 ├ Avatar
 ├ UserInfo
 │   ├ Name
 │   └ Status
 └ MoreButton
```

说明：

删除：

```
电话按钮
视频按钮
```

只保留：

```
更多按钮 (...)
```

点击可以打开：

```
聊天设置
```

---

# 四、聊天消息区域

组件：

```text
ChatMessages
```

结构：

```text
ChatMessages
 ├ DateDivider
 ├ MessageBubble
 ├ MessageBubble
 └ MessageBubble
```

---

# 五、消息气泡设计

需要区分：

```text
自己消息
对象消息
```

结构：

```text
MessageBubble
 ├ Avatar
 └ Bubble
```

UI示例：

对象消息：

```
U   想要草莓松饼！
```

自己消息：

```
      今天想吃点什么呀？
                       U
```

样式：

对象消息：

```
左侧
白色气泡
```

自己消息：

```
右侧
粉色气泡
```

---

# 六、情侣互动气泡

增加特殊消息类型：

```text
LoveMessage
```

示例：

```
💗 发送了一个亲亲
```

或者：

```
🤗 发送了一个抱抱
```

UI：

```
[爱心卡片]
亲亲 +1
```

---

# 七、时间分隔线

组件：

```text
DateDivider
```

示例：

```
———— 今天 ————
```

样式：

```css
font-size:12px
opacity:0.6
text-align:center
```

---

# 八、聊天输入区

当前输入区太简单，需要升级。

结构：

```text
ChatInputBar
 ├ ActionButtons
 │   ├ VoiceButton
 │   ├ ImageButton
 │   └ EmojiButton
 ├ InputField
 └ SendButton
```

UI示例：

```
🎤  🖼  😊   [说点什么...]   ❤️
```

说明：

发送按钮：

```
爱心按钮
```

---

# 九、情侣快捷互动

在输入框上方增加：

```text
QuickLoveActions
```

UI：

```
💋 亲亲
🤗 抱抱
🍰 想吃
```

点击会发送：

```
互动消息
```

示例：

```
💋 亲亲 +1
```

---

# 十、空聊天状态

如果没有聊天记录，需要显示：

```
LoveMenu AI
```

示例：

```
今天想吃点什么？
```

或者：

```
试试发送一个亲亲 💋
```

---

# 十一、聊天动画

使用：

```
framer-motion
```

动画：

新消息：

```
fade in
slide up
```

时间：

```
200ms
```

---

# 十二、组件目录

```text
/components/mobile/chat

ChatHeader.tsx
ChatMessages.tsx
MessageBubble.tsx
DateDivider.tsx
ChatInputBar.tsx
QuickLoveActions.tsx
LoveMessage.tsx
```

---

# 十三、数据结构

消息结构：

```ts
interface Message {
 id: string
 type: "text" | "love"
 content: string
 sender: "me" | "partner"
 createdAt: string
}
```

love消息：

```json
{
 "type":"love",
 "content":"kiss"
}
```

---

# 十四、主题适配

聊天页面需要适配主题：

```
couple
cute
minimal
night
```

但：

```
不要出现主题切换按钮
```

---

# 十五、输出要求

生成：

```
/app/(mobile)/chat/layout.tsx
/app/(mobile)/chat/page.tsx

/components/mobile/chat
 ChatHeader.tsx
 ChatMessages.tsx
 MessageBubble.tsx
 ChatInputBar.tsx
 QuickLoveActions.tsx
 LoveMessage.tsx
```

实现：

```
沉浸式聊天页面
```

不要生成 BottomNavigationBar。
