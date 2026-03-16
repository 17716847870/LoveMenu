# LoveMenu PC 通用分页组件设计任务（LovePagination）

## 一、任务目标

为后台 **PC端管理系统**设计一个 **通用分页组件**。

组件名称：

```text
LovePagination
```

组件必须：

```text
支持页码跳转
支持上一页 / 下一页
支持每页数量选择
支持总数据展示
支持快速跳页
```

并且 **UI 风格必须符合 LoveMenu 情侣主题设计**。

该组件未来会在所有 **后台数据列表页面**复用，例如：

* 菜单管理
* 订单管理
* 用户管理
* 想吃请求管理
* 反馈管理

因此必须设计为 **高复用基础组件**。

---

# 二、组件位置

组件路径：

```text
/components/admin/ui/LovePagination
```

文件结构：

```text
LovePagination
 ├ LovePagination.tsx
 ├ PageButton.tsx
 ├ PageSizeSelect.tsx
 └ style.module.css
```

---

# 三、组件功能设计

LovePagination 需要支持以下核心功能：

## 1 页码切换

基本分页结构：

```text
< 上一页  1 2 3 4 5  下一页 >
```

当前页需要高亮。

示例：

```text
< 1 [2] 3 4 5 >
```

点击页码：

```text
跳转到对应页
```

---

## 2 上一页 / 下一页

按钮：

```text
< 上一页
下一页 >
```

逻辑：

```text
当前页 = 1
上一页 disabled

当前页 = 最后一页
下一页 disabled
```

UI 示例：

```text
< 1 2 3 4 5 >
```

---

## 3 省略页码（大数据分页）

如果页数很多：

```text
1 2 3 ... 10
```

示例：

```text
< 1 ... 6 7 [8] 9 10 ... 20 >
```

逻辑：

```text
只展示当前页附近页码
```

---

## 4 每页数量选择

右侧需要有 **每页数量选择器**。

示例：

```text
每页 20 条 ▼
```

可选：

```text
10
20
50
100
```

选择后：

```text
重新请求数据
```

组件使用：

```text
LoveSelect
```

---

## 5 总数据展示

分页左侧显示：

```text
共 125 条数据
```

示例：

```text
共 125 条 ｜ 每页 20 条 ｜ < 1 2 3 4 >
```

---

## 6 快速跳页

支持输入页码：

```text
跳至 [ 5 ] 页
```

用户输入：

```text
10
```

点击：

```text
跳转
```

示例：

```text
共125条   每页20条

< 1 2 3 4 5 >

跳至 [ 8 ] 页
```

---

# 四、组件布局设计

PC分页布局：

```text
┌──────────────────────────────────────────────┐
共 125 条数据

< 上一页  1 2 3 4 5  下一页 >

每页 20 条 ▼        跳至 [ 5 ] 页
└──────────────────────────────────────────────┘
```

或者单行版本：

```text
共125条 ｜ 每页20条 ▼ ｜ < 1 2 3 4 5 > ｜ 跳至 [ 5 ] 页
```

推荐布局：

```text
左：数据统计
中：分页
右：页大小 + 跳页
```

---

# 五、情侣主题 UI 设计

整体风格：

```text
温柔
轻量
圆角
粉色主题
```

分页按钮：

```css
height: 36px;
min-width: 36px;
border-radius: 10px;
```

普通页码：

```css
background: white;
border: 1px solid #f2d3e0;
```

hover：

```css
background: #fff0f6;
border-color: #ff8fb8;
```

当前页：

```css
background: #ff6fa5;
color: white;
border: none;
```

效果：

```text
1 2 [3] 4 5
```

---

# 六、分页按钮设计

按钮示例：

普通：

```text
2
```

hover：

```text
(浅粉色背景)
```

当前页：

```text
[3]
```

禁用按钮：

```css
opacity: 0.4;
cursor: not-allowed;
```

---

# 七、组件 Props 设计

组件类型：

```ts
type LovePaginationProps = {
  total: number
  page: number
  pageSize: number
  pageSizeOptions?: number[]
  onPageChange?: (page:number)=>void
  onPageSizeChange?: (size:number)=>void
}
```

示例：

```tsx
<LovePagination
  total={120}
  page={1}
  pageSize={20}
  pageSizeOptions={[10,20,50,100]}
  onPageChange={handlePageChange}
  onPageSizeChange={handleSizeChange}
/>
```

---

# 八、组件交互逻辑

点击页码：

```ts
onPageChange(page)
```

点击上一页：

```ts
onPageChange(page - 1)
```

点击下一页：

```ts
onPageChange(page + 1)
```

修改每页数量：

```ts
onPageSizeChange(size)
```

并且：

```text
自动回到第一页
```

---

# 九、分页算法设计

核心逻辑：

```ts
const totalPages = Math.ceil(total / pageSize)
```

显示规则：

```text
最多显示 5 个页码
```

示例：

当前：

```text
8
```

显示：

```text
6 7 [8] 9 10
```

边界情况：

```text
1 2 3 4 5 ... 20
```

---

# 十、组件使用场景

未来后台页面都会使用：

### 菜单管理

```text
菜单分页
```

### 订单管理

```text
订单分页
```

### 用户管理

```text
用户分页
```

### 反馈系统

```text
反馈列表分页
```

---

# 十一、视觉效果目标

LovePagination 需要达到：

```text
专业后台体验
```

但视觉保持：

```text
情侣主题
```

最终效果：

```text
可爱
清爽
专业
```

---

# 十二、最终目标

LovePagination 将成为：

```text
LoveMenu 后台核心分页组件
```

特点：

```text
高复用
高颜值
高效率
```

所有后台数据列表：

```text
统一使用 LovePagination
```
