# ScrollToFixed

一个轻量级的滚动固定 JavaScript 库，当元素滚动出视野范围时固定在顶部，再向上滚动回到元素原来位置时恢复文档流布局。

## 特性

- 🚀 **ESM 模块化构建** - 使用现代 ES 模块标准
- 📦 **模块化拆分** - 功能模块清晰分离
- 🎯 **智能固定** - 自动检测滚动位置
- 🔧 **可配置** - 支持自定义偏移量、样式类等
- 🧹 **完整清理** - 提供销毁方法清理资源
- 🧪 **测试友好** - 包含完整的测试案例
- 🎨 **SCSS 样式** - 使用 SCSS 定义默认样式
- 📱 **响应式支持** - 支持窗口缩放和调整大小
- ⚡ **性能优化** - 节流滚动事件处理

## 安装

```bash
npm install scroll-to-fixed
```

## 使用方法

### 基本使用

```javascript
import ScrollToFixed from 'scroll-to-fixed';

// 顶部固定
const navElement = document.getElementById('nav');
const topInstance = new ScrollToFixed(navElement, {});

// 底部固定
const footerElement = document.getElementById('footer');
const bottomInstance = new ScrollToFixed(footerElement, {
  position: 'bottom'   // 固定在底部
});
```

### 通过选择器初始化

```javascript
// 通过 CSS 选择器初始化
const instance = new ScrollToFixed('#mainNav', {
  offset: 20,
  className: 'my-fixed-nav'
});
```

### 通过 data 属性配置

```html
<nav class="nav"
     id="mainNav"
     data-offset="0"
     data-class="scroll-fixed"
     data-zindex="1000"
     data-position="top">
  <!-- 导航内容 -->
</nav>
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `position` | `string` | `'top'` | 固定位置：`'top'` 或 `'bottom'` |
| `offset` | `number` | `0` | 固定时的偏移量（距离顶部/底部的像素） |
| `className` | `string` | `'scroll-fixed'` | 固定时添加的 CSS 类名 |
| `zIndex` | `number` | `199` | 固定时的 z-index 值 |

### 实例方法

```javascript
// 更新配置
instance.update({
  offset: 50,
  className: 'my-fixed-class'
});

// 销毁实例，清理事件监听器和占位元素
instance.destroy();
```

## 样式系统

### 默认样式

项目使用 SCSS 定义默认样式，编译后提供以下 CSS 类：

```css
.scroll-fixed {
  position: fixed;
  z-index: 199;
  left: 0;
  width: 100%;
  box-sizing: border-box;
}

.scroll-fixed[data-position="top"] {
  top: 0;
  bottom: auto;
}

.scroll-fixed[data-position="bottom"] {
  top: auto;
  bottom: 0;
}
```

## API 文档

### ScrollToFixed 类

#### 构造函数
```typescript
new ScrollToFixed(element: HTMLElement | string, options?: ScrollToFixedOptions)
```

#### 方法
- `update(options: ScrollToFixedOptions): void` - 更新配置
- `destroy(): void` - 销毁实例，清理资源

#### 工具函数
```typescript
import { utils } from 'scroll-to-fixed';

// 节流函数
const throttledFunction = utils.throttle((event) => {
  // 处理事件
}, 100);
```

### 接口定义

```typescript
interface ScrollToFixedOptions {
  offset?: number;
  className?: string;
  zIndex?: number;
  position?: 'top' | 'bottom';
}
```

## 开发

### 项目结构

```
scrollToFixed/
├── src/
│   ├── index.ts          # 核心功能模块
│   └── index.scss        # SCSS 样式文件
├── test/
│   ├── index.html        # 测试页面
│   ├── style.css         # 测试页面样式
│   └── test.js           # 测试脚本
├── dist/                 # 构建输出目录
├── rspack.config.cjs     # Rspack 配置
└── package.json
```

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式（启动开发服务器）
npm run dev

# 构建项目
npm run build

# 运行测试
npm run test
```

### 构建输出

```
dist/
├── index.js           # ESM 格式，压缩
├── index.browser.js   # UMD 格式，压缩
├── style.js           # 编译后的 SCSS 样式
└── style.browser.js   # 浏览器版本的样式
```

## 技术栈

- **构建工具**: Rspack
- **模块系统**: ESM (ECMAScript Modules)
- **语言**: TypeScript
- **样式**: SCSS
- **包管理**: npm