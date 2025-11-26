/**
 * 滚动固定功能主模块
 * 当元素滚动出视野时固定在顶部，回到原来位置时恢复文档流布局
 */
import './index.css'

/**
 * 配置选项接口
 */
export interface ScrollToFixedOptions {
  offset?: number;
  className?: string;
  zIndex?: number;
  position?: 'top' | 'bottom';
}

/**
 * 元素原始样式接口
 */
interface OriginalStyles {
  position: string;
  left: string;
  width: string;
  height: string;
  top?: string;
  zIndex?: string;
  marginTop?: string;
  marginBottom?: string;
}

/**
 * 滚动固定类
 */
export class ScrollToFixed {
  /**
   * 默认配置选项
   */
  static readonly DEFAULT_OPTIONS: Required<ScrollToFixedOptions> = {
    offset: 0,
    className: 'scroll-fixed',
    zIndex: 199,
    position: 'top',
  };

  private element: HTMLElement;
  private options: Required<ScrollToFixedOptions>;
  private originalStyles: OriginalStyles;
  private isFixed: boolean;
  private originalOffsetTop: number;
  private originalOffsetBottom: number;
  private placeholder: HTMLElement | null;
  private boundHandleScroll: () => void = () => {};

  constructor(element: HTMLElement | string, options: ScrollToFixedOptions = {}) {
    this.element = this.resolveElement(element);
    this.options = this.parseOptions(options);
    this.originalStyles = {} as OriginalStyles;
    this.isFixed = false;
    this.originalOffsetTop = 0;
    this.originalOffsetBottom = 0;
    this.placeholder = null;

    this.init();
  }

  /**
   * 解析元素
   */
  private resolveElement(element: HTMLElement | string): HTMLElement {
    if (typeof element === 'string') {
      const el = document.querySelector(element);

      if (!el) {
        throw new Error(`Element not found: ${element}`);
      }

      if (!(el instanceof HTMLElement)) {
        throw new Error(`Element is not an HTMLElement: ${element}`);
      }

      return el;
    }

    return element;
  }

  /**
   * 解析配置选项
   */
  private parseOptions(options: ScrollToFixedOptions): Required<ScrollToFixedOptions> {
    // 从 data 属性获取配置
    const dataOptions = this.getDataOptions();

    // 合并配置：data 属性 < 构造函数选项 < 默认选项
    return {
      ...ScrollToFixed.DEFAULT_OPTIONS,
      ...dataOptions,
      ...options
    };
  }

  /**
   * 从 data 属性获取配置
   */
  private getDataOptions(): Partial<ScrollToFixedOptions> {
    const dataOptions: Partial<ScrollToFixedOptions> = {};

    // 获取 data-offset
    const offsetAttr = this.element.getAttribute('data-offset');
    if (offsetAttr) {
      const offset = parseInt(offsetAttr, 10);
      if (!isNaN(offset)) {
        dataOptions.offset = offset;
      }
    }

    // 获取 data-class
    const classAttr = this.element.getAttribute('data-class');
    if (classAttr) {
      dataOptions.className = classAttr;
    }

    // 获取 data-zindex
    const zIndexAttr = this.element.getAttribute('data-zindex');
    if (zIndexAttr) {
      const zIndex = parseInt(zIndexAttr, 10);
      if (!isNaN(zIndex)) {
        dataOptions.zIndex = zIndex;
      }
    }

    // 获取 data-position
    const positionAttr = this.element.getAttribute('data-position');
    if (positionAttr && (positionAttr === 'top' || positionAttr === 'bottom')) {
      dataOptions.position = positionAttr;
    }

    return dataOptions;
  }

  /**
   * 初始化方法
   */
  private init(): void {
    // 保存原始样式
    this.saveOriginalStyles();

    // 计算原始位置
    this.calculateOriginalPosition();

    // 创建占位元素
    this.createPlaceholder();

    // 绑定滚动事件
    this.bindScrollEvent();
  }

  /**
   * 保存原始样式
   */
  private saveOriginalStyles(): void {
    const styles = window.getComputedStyle(this.element);

    this.originalStyles = {
      position: styles.position,
      // top: styles.top,
      // zIndex: styles.zIndex,
      left: styles.left,
      width: styles.width,
      height: styles.height,
      marginTop: styles.marginTop,
      marginBottom: styles.marginBottom,
    };
  }

  /**
   * 计算原始位置
   */
  private calculateOriginalPosition(): void {
    const offset = this.getElementOffset();
    this.originalOffsetTop = offset.top;
    this.originalOffsetBottom = offset.bottom;
  }

  /**
   * 获取元素在文档中的位置
   */
  private getElementOffset(): { top: number; bottom: number; left: number } {
    const rect = this.element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      bottom: rect.bottom + window.pageYOffset,
      left: rect.left + window.pageXOffset,
    };
  }

  /**
   * 创建占位元素
   */
  private createPlaceholder(): void {
    this.placeholder = document.createElement('div');
    this.placeholder.style.height = `${this.element.offsetHeight}px`;
    this.placeholder.style.display = 'none';
    this.element.parentNode!.insertBefore(this.placeholder, this.element);
  }

  /**
   * 绑定滚动事件
   */
  private bindScrollEvent(): void {
    // 使用箭头函数或保存绑定后的函数引用
    this.boundHandleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.boundHandleScroll, { passive: true });
    window.addEventListener('resize', this.boundHandleScroll, { passive: true });

    // 初始检查
    this.handleScroll();
  }

  /**
   * 处理滚动事件
   */
  private handleScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    let shouldBeFixed = false;

    if (this.options.position === 'bottom') {
      // 底部固定逻辑：当元素从底部滚动离开可视区域时固定在底部
      const elementBottom = this.originalOffsetBottom;
      const viewportBottom = scrollTop + windowHeight;

      // 当元素底部离开可视区域底部时固定在底部
      shouldBeFixed = elementBottom > viewportBottom + this.options.offset;
    } else {
      // 顶部固定逻辑：当元素滚动出视窗顶部时固定在顶部
      shouldBeFixed = scrollTop > this.originalOffsetTop - this.options.offset;
    }

    if (shouldBeFixed && !this.isFixed) {
      this.fixElement();
    } else if (!shouldBeFixed && this.isFixed) {
      this.unfixElement();
    }
  }

  /**
   * 固定元素
   */
  private fixElement(): void {
    if (this.isFixed) return;

    // 更新占位元素尺寸
    if (this.placeholder) {
      this.placeholder.style.height = `${this.element.offsetHeight}px`;
      this.placeholder.style.display = 'block';
    }

    // 应用固定样式
    this.element.style.position = 'fixed';
    this.element.style.left = '0';
    this.element.style.width = '100%';

    // 只有当配置值与默认值不同时，才在 style 中设置
    if (this.options.zIndex !== ScrollToFixed.DEFAULT_OPTIONS.zIndex) {
      this.element.style.zIndex = this.options.zIndex.toString();
    }

    if (this.options.position === 'bottom') {
      if (this.options.offset !== ScrollToFixed.DEFAULT_OPTIONS.offset) {
        this.element.style.bottom = `${this.options.offset}px`;
      }
    } else {
      if (this.options.offset !== ScrollToFixed.DEFAULT_OPTIONS.offset) {
        this.element.style.top = `${this.options.offset}px`;
      }
    }

    this.element.classList.add(this.options.className);

    this.isFixed = true;
  }

  /**
   * 恢复元素
   */
  private unfixElement(): void {
    if (!this.isFixed) return;

    // 隐藏占位元素
    if (this.placeholder) {
      this.placeholder.style.display = 'none';
    }

    // 恢复原始样式
    Object.keys(this.originalStyles).forEach((property) => {
      (this.element.style as any)[property] = (this.originalStyles as any)[property];
    });

    // 特别处理宽度，确保恢复正确的宽度
    // 移除固定时设置的 100% 宽度，恢复原始宽度
    this.element.style.width = this.originalStyles.width;

    this.element.classList.remove(this.options.className);

    this.isFixed = false;
  }

  /**
   * 销毁实例
   */
  public destroy(): void {
    window.removeEventListener('scroll', this.boundHandleScroll);
    window.removeEventListener('resize', this.boundHandleScroll);

    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.parentNode.removeChild(this.placeholder);
    }

    this.unfixElement();
  }

  /**
   * 更新配置
   */
  public update(options: ScrollToFixedOptions): void {
    // 保存当前固定状态
    const wasFixed = this.isFixed;

    // 如果当前是固定状态，先恢复元素到原始位置
    if (wasFixed) {
      this.unfixElement();
    }

    // 更新配置
    this.options = { ...this.options, ...options };

    // 重新计算原始位置
    this.calculateOriginalPosition();

    // 重新检查是否需要固定
    this.handleScroll();
  }
}

/**
 * 工具函数模块
 */
export const utils = {
  /**
   * 节流函数
   */
  throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecTime = 0;

    return ((...args: Parameters<T>) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    }) as T;
  },
};

/**
 * 默认导出
 */
export default ScrollToFixed;
