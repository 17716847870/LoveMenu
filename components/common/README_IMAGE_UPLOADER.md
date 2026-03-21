# 通用图片上传组件使用指南

## 📦 组件位置

`components/common/MultiImageUploader.tsx`

## ✨ 功能特性

### 单文件模式
- ✅ 单个图片上传
- ✅ 图片预览
- ✅ 删除功能
- ✅ 文件大小验证
- ✅ 文件类型验证

### 多文件模式
- ✅ 多个图片上传（最多9张）
- ✅ 网格布局展示
- ✅ 拖拽排序（预留）
- ✅ 拖拽上传
- ✅ 批量删除
- ✅ 序号显示
- ✅ 图片计数显示

### 通用功能
- 🎨 精美的UI设计
- ⚡ 异步上传
- 📊 上传进度显示
- 🔒 禁用状态支持
- 📱 响应式布局
- 🎯 TypeScript 类型安全
- 💬 消息提示集成

## 🚀 快速开始

### 1. 单文件上传

```tsx
import MultiImageUploader from '@/components/common/MultiImageUploader';
import { useState } from 'react';

function SingleImageUpload() {
  const [imageUrl, setImageUrl] = useState<string>('');

  return (
    <MultiImageUploader
      value={imageUrl}
      onChange={(urls) => setImageUrl(urls as string)}
      mode="single"
      path="avatars"
      maxSize={2}
      showTitle={true}
    />
  );
}
```

### 2. 多文件上传

```tsx
import MultiImageUploader from '@/components/common/MultiImageUploader';
import { useState } from 'react';

function MultipleImageUpload() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  return (
    <MultiImageUploader
      value={imageUrls}
      onChange={(urls) => setImageUrls(urls as string[])}
      mode="multiple"
      path="gallery"
      maxSize={5}
      maxCount={9}
      showTitle={true}
    />
  );
}
```

### 3. 在表单中使用

```tsx
import MultiImageUploader from '@/components/common/MultiImageUploader';
import { useState } from 'react';

function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    images: [] as string[],
  });

  const handleSubmit = () => {
    console.log('表单数据:', formData);
  };

  return (
    <form>
      <div>
        <label>主图</label>
        <MultiImageUploader
          value={formData.image}
          onChange={(urls) => setFormData(prev => ({ ...prev, image: urls as string }))}
          mode="single"
          path="products"
        />
      </div>

      <div>
        <label>图片集</label>
        <MultiImageUploader
          value={formData.images}
          onChange={(urls) => setFormData(prev => ({ ...prev, images: urls as string[] }))}
          mode="multiple"
          path="products"
          maxCount={6}
        />
      </div>

      <button type="button" onClick={handleSubmit}>
        提交
      </button>
    </form>
  );
}
```

## 📝 API 文档

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string \| string[]` | `''` 或 `[]` | 图片URL或URL数组 |
| `onChange` | `(urls: string \| string[]) => void` | - | 值变化回调 |
| `mode` | `'single' \| 'multiple'` | `'single'` | 上传模式 |
| `path` | `string` | `'uploads'` | OSS存储路径 |
| `accept` | `string` | `'image/jpeg,image/png,image/gif,image/webp'` | 接受的文件类型 |
| `maxSize` | `number` | `5` | 单个文件最大大小（MB） |
| `maxCount` | `number` | `9` | 多文件模式最大数量 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `showTitle` | `boolean` | `true` | 是否显示标题 |

### value 和 onChange 类型

#### 单文件模式
```typescript
value: string; // 单个图片URL
onChange: (urls: string) => void;
```

#### 多文件模式
```typescript
value: string[]; // 图片URL数组
onChange: (urls: string[]) => void;
```

### 示例

```typescript
// 单文件
<MultiImageUploader
  value={singleUrl}
  onChange={(url) => setSingleUrl(url)}
  mode="single"
/>

// 多文件
<MultiImageUploader
  value={multipleUrls}
  onChange={(urls) => setMultipleUrls(urls)}
  mode="multiple"
  maxCount={6}
/>
```

## 🎨 自定义配置

### 限制文件类型

```tsx
<MultiImageUploader
  accept="image/png,image/jpeg"
  onChange={handleChange}
/>
```

### 限制文件大小

```tsx
<MultiImageUploader
  maxSize={2} // 2MB
  onChange={handleChange}
/>
```

### 限制上传数量

```tsx
<MultiImageUploader
  mode="multiple"
  maxCount={3}
  onChange={handleChange}
/>
```

### 自定义存储路径

```tsx
<MultiImageUploader
  path="products/main-images"
  onChange={handleChange}
/>
```

## 📋 完整示例

### 菜品表单集成

```tsx
import MultiImageUploader from '@/components/common/MultiImageUploader';
import { useState } from 'react';
import { Dish } from '@/types';

function DishForm() {
  const [dish, setDish] = useState<Partial<Dish>>({
    name: '',
    image: '',
    categoryId: '',
    kissPrice: 0,
    hugPrice: 0,
  });

  const handleSave = () => {
    // 保存菜品，image 字段存储的就是图片URL
    console.log('保存菜品:', dish);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2">菜品图片</label>
        <MultiImageUploader
          value={dish.image || ''}
          onChange={(urls) => setDish(prev => ({ ...prev, image: urls as string }))}
          mode="single"
          path="dishes"
          maxSize={5}
        />
      </div>

      <div>
        <label className="block mb-2">菜品名称</label>
        <input
          type="text"
          value={dish.name}
          onChange={(e) => setDish(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <button onClick={handleSave}>保存</button>
    </div>
  );
}
```

### 图集管理

```tsx
import MultiImageUploader from '@/components/common/MultiImageUploader';
import { useState } from 'react';

function GalleryManager() {
  const [gallery, setGallery] = useState<string[]>([]);

  const handleSave = () => {
    // gallery 数组中存储的就是所有图片的URL
    console.log('保存图集:', gallery);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2>商品图集管理</h2>
        <MultiImageUploader
          value={gallery}
          onChange={(urls) => setGallery(urls as string[])}
          mode="multiple"
          path="gallery"
          maxSize={3}
          maxCount={12}
          showTitle={true}
        />
      </div>

      <button onClick={handleSave}>保存图集</button>
    </div>
  );
}
```

## 🔧 高级用法

### 禁用状态

```tsx
<MultiImageUploader
  value={imageUrl}
  onChange={handleChange}
  disabled={true} // 禁用上传和删除
/>
```

### 隐藏标题

```tsx
<MultiImageUploader
  value={imageUrl}
  onChange={handleChange}
  showTitle={false} // 隐藏顶部标题和提示
/>
```

### 与其他表单库集成

```tsx
import { useForm, Controller } from 'react-hook-form';
import MultiImageUploader from '@/components/common/MultiImageUploader';

function MyForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      image: '',
    }
  });

  const onSubmit = (data) => {
    console.log(data.image); // 图片URL
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <MultiImageUploader
            value={field.value}
            onChange={field.onChange}
            mode="single"
          />
        )}
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

## 📊 数据库存储

数据库中只需存储图片的URL地址：

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  image       String?  // 单个图片URL
  images      String?  // JSON数组字符串存储多个图片
  createdAt   DateTime @default(now())
}
```

或者使用 JSON 类型：

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  image       String?  // 单个图片URL
  gallery     Json     // 多图片数组
  createdAt   DateTime @default(now())
}
```

## 💡 最佳实践

1. **合理设置文件大小限制**
   - 列表图：2-3MB
   - 详情图：5MB
   - 缩略图：1MB

2. **选择合适的存储路径**
   - 菜品：`path="dishes"`
   - 用户头像：`path="avatars"`
   - 商品图集：`path="products/gallery"`

3. **多文件模式设置合理的最大数量**
   - 商品图集：6-12张
   - 用户相册：9-20张
   - 评论图片：1-9张

4. **做好错误处理**
   - 监听 `onChange` 回调
   - 显示上传错误消息
   - 提供重试机制

## 🎯 使用场景

- ✅ 菜品图片上传
- ✅ 用户头像上传
- ✅ 商品图片管理
- ✅ 相册管理
- ✅ 评论图片上传
- ✅ 动态图片发布
- ✅ 资料图片上传
