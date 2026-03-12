# LoveMenu 主题系统 UI 升级 Prompt

当前页面是 **主题切换页面**，需要升级为更高级的 **主题控制中心**。

目标：

1. 用户可以在任何页面切换主题
2. 每个主题有自己的视觉风格
3. 用户可以实时预览主题效果
4. 切换具有动画效果

---

# 一、全局主题系统

主题必须是 **全局状态**。

技术方案：

```text
ThemeContext
```

目录：

```text
/context
 └ ThemeContext.tsx
```

支持主题：

```text
couple
cute
minimal
night
```

主题需要保存：

```text
localStorage
```

刷新页面保持主题。

---

# 二、任何页面都可以切换主题

需要新增：

```text
FloatingThemeButton
```

组件路径：

```text
/components/mobile/FloatingThemeButton.tsx
```

UI：

右下角浮动按钮：

```text
🎨
```

样式：

```css
position: fixed
right: 16px
bottom: 90px
width: 48px
height: 48px
border-radius: 50%
box-shadow
```

点击：

```text
打开 Theme Drawer
```

---

# 三、主题抽屉（Theme Drawer）

UI：

从底部滑出：

```text
ThemeDrawer
```

结构：

```text
ThemeDrawer
 ├ DrawerHeader
 ├ ThemeGrid
 │   ├ ThemeCard
 │   ├ ThemeCard
 │   ├ ThemeCard
 │   └ ThemeCard
 └ CloseButton
```

动画：

```text
slide up
```

使用：

```text
framer-motion
```

---

# 四、主题卡片升级

当前主题卡片过于简单。

需要增加：

```text
主题预览
主题说明
选中状态
```

新卡片结构：

```text
ThemeCard
 ├ ThemePreview
 ├ ThemeName
 ├ ThemeDescription
 └ ActiveIndicator
```

---

# 五、主题预览设计

## 情侣风

预览：

```text
粉色渐变
爱心元素
圆角卡片
```

卡片示例：

```text
┌─────────────┐
💗 情侣风
浪漫恋爱主题
└─────────────┘
```

---

## 可爱风

预览：

```text
糖果色
卡通emoji
圆形组件
```

示例：

```text
┌─────────────┐
🍭 可爱风
元气少女主题
└─────────────┘
```

---

## 极简风

预览：

```text
黑白
细边框
干净布局
```

示例：

```text
┌─────────────┐
⬛ 极简风
纯净极简设计
└─────────────┘
```

---

## 夜间模式

预览：

```text
深色背景
霓虹色按钮
发光元素
```

示例：

```text
┌─────────────┐
🌙 夜间模式
深色护眼主题
└─────────────┘
```

---

# 六、当前主题提示

当前主题卡片需要高亮：

```text
边框高亮
选中标记
```

示例：

```text
✔ 当前使用
```

样式：

```css
border:2px solid
```

---

# 七、主题切换动效

切换主题时需要动画：

```text
background fade
```

动画：

```text
300ms
```

使用：

```text
framer-motion
```

---

# 八、页面优化

当前主题页面可以增加：

## 1 主题介绍

页面顶部增加：

```text
个性化你的 LoveMenu
选择你喜欢的主题
```

---

## 2 今日推荐主题

可以随机推荐：

```text
今日推荐主题
```

示例：

```text
🌙 今天适合夜间模式
```

---

## 3 主题自动切换

夜间模式可以支持：

```text
自动跟随系统
```

---

# 九、组件结构

需要生成组件：

```text
/components/mobile

ThemeCard.tsx
ThemeDrawer.tsx
FloatingThemeButton.tsx
```

---

# 十、页面结构

```text
ThemePage
 ├ PageHeader
 ├ ThemeIntro
 ├ ThemeGrid
 │   ├ ThemeCard
 │   ├ ThemeCard
 │   ├ ThemeCard
 │   └ ThemeCard
```

---

# 十一、技术要求

使用：

```text
Next.js
React
TypeScript
TailwindCSS
framer-motion
Context API
```

---

# 十二、输出要求

生成：

```text
/context/ThemeContext.tsx

/components/mobile
 ThemeCard.tsx
 ThemeDrawer.tsx
 FloatingThemeButton.tsx
```

并修改：

```text
/app/layout.tsx
```

加入：

```text
ThemeProvider
FloatingThemeButton
```

确保：

```text
任何页面都可以切换主题
```

不要生成其它页面代码。
