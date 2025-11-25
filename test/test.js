/**
 * 滚动固定功能测试脚本
 * 整合顶部和底部固定测试案例
 */

import * as ScrollToFixedModule from "../dist/index.js";
const ScrollToFixed = ScrollToFixedModule.default || ScrollToFixedModule;
const utils = ScrollToFixedModule.utils;

// 全局变量
let topFixedInstance = null;
let bottomFixedInstance = null;

// DOM 元素
const navElement = document.getElementById("mainNav");
const footerElement = document.getElementById("bottomFooter");
const topStatusElement = document.getElementById("topStatus");
const bottomStatusElement = document.getElementById("bottomStatus");

// 控制按钮
const initTopBtn = document.getElementById("initTopBtn");
const destroyTopBtn = document.getElementById("destroyTopBtn");
const updateTopBtn = document.getElementById("updateTopBtn");
const initBottomBtn = document.getElementById("initBottomBtn");
const destroyBottomBtn = document.getElementById("destroyBottomBtn");
const updateBottomBtn = document.getElementById("updateBottomBtn");

/**
 * 更新顶部状态显示
 */
function updateTopStatus(message, isFixed = false) {
  topStatusElement.textContent = `状态: ${message}`;
  if (isFixed) {
    topStatusElement.classList.add("fixed");
  } else {
    topStatusElement.classList.remove("fixed");
  }
}

/**
 * 更新底部状态显示
 */
function updateBottomStatus(message, isFixed = false) {
  bottomStatusElement.textContent = `状态: ${message}`;
  if (isFixed) {
    bottomStatusElement.classList.add("fixed");
  } else {
    bottomStatusElement.classList.remove("fixed");
  }
}

/**
 * 初始化顶部固定功能
 */
function initTopFixed() {
  // 如果已经初始化，先销毁再重新初始化
  if (topFixedInstance) {
    console.warn("顶部固定功能已经初始化，先销毁再重新初始化");
    destroyTopFixed();
  }

  try {
    // 演示两种初始化方式
    // 方式1：使用选择器
    topFixedInstance = new ScrollToFixed("#mainNav");

    // 方式2：使用元素对象（注释掉上面的代码，使用下面的代码）
    // topFixedInstance = new ScrollToFixed(navElement);

    updateTopStatus("已初始化 (使用选择器)");
    console.log("顶部固定功能初始化成功");
    console.log("当前配置:", topFixedInstance.options);
  } catch (error) {
    console.error("初始化顶部固定功能失败:", error);
    updateTopStatus("初始化失败");
  }
}

/**
 * 销毁顶部固定功能
 */
function destroyTopFixed() {
  if (!topFixedInstance) {
    console.warn("顶部固定功能未初始化");
    return;
  }

  try {
    topFixedInstance.destroy();
    topFixedInstance = null;
    updateTopStatus("已销毁");
    console.log("顶部固定功能已销毁");
  } catch (error) {
    console.error("销毁顶部固定功能失败:", error);
    updateTopStatus("销毁失败");
  }
}

/**
 * 更新顶部配置
 */
function updateTopConfig() {
  if (!topFixedInstance) {
    console.warn("顶部固定功能未初始化");
    return;
  }

  try {
    const newOffset = Math.floor(Math.random() * 50) + 20; // 随机偏移量 20-70

    topFixedInstance.update({
      offset: newOffset,
      zIndex: 1000 + Math.floor(Math.random() * 100),
    });

    updateTopStatus(`配置已更新 (偏移量: ${newOffset}px)`);
    console.log(`顶部配置已更新，偏移量: ${newOffset}px`);
  } catch (error) {
    console.error("更新顶部配置失败:", error);
    updateTopStatus("更新配置失败");
  }
}

/**
 * 初始化底部固定功能
 */
function initBottomFixed() {
  // 如果已经初始化，先销毁再重新初始化
  if (bottomFixedInstance) {
    console.warn("底部固定功能已经初始化，先销毁再重新初始化");
    destroyBottomFixed();
  }

  try {
    bottomFixedInstance = new ScrollToFixed(footerElement, {
      position: "bottom",
    });

    updateBottomStatus("已初始化");
    console.log("底部固定功能初始化成功");
  } catch (error) {
    console.error("初始化底部固定功能失败:", error);
    updateBottomStatus("初始化失败");
  }
}

/**
 * 销毁底部固定功能
 */
function destroyBottomFixed() {
  if (!bottomFixedInstance) {
    console.warn("底部固定功能未初始化");
    return;
  }

  try {
    bottomFixedInstance.destroy();
    bottomFixedInstance = null;
    updateBottomStatus("已销毁");
    console.log("底部固定功能已销毁");
  } catch (error) {
    console.error("销毁底部固定功能失败:", error);
    updateBottomStatus("销毁失败");
  }
}

/**
 * 更新底部配置
 */
function updateBottomConfig() {
  if (!bottomFixedInstance) {
    console.warn("底部固定功能未初始化");
    return;
  }

  try {
    const newOffset = Math.floor(Math.random() * 50) + 20; // 随机偏移量 20-70
    bottomFixedInstance.update({
      offset: newOffset,
      zIndex: 999 + Math.floor(Math.random() * 100),
    });

    updateBottomStatus(`配置已更新 (偏移量: ${newOffset}px)`);
    console.log(`底部配置已更新，偏移量: ${newOffset}px`);
  } catch (error) {
    console.error("更新底部配置失败:", error);
    updateBottomStatus("更新配置失败");
  }
}

/**
 * 自动初始化所有固定功能
 */
function autoInitAllFixed() {
  // 只在页面首次加载时自动初始化
  // 销毁后不会自动重新初始化
  if (!topFixedInstance) {
    initTopFixed();
  }
  if (!bottomFixedInstance) {
    initBottomFixed();
  }
}

/**
 * 测试工具函数
 */
function testUtils() {
  console.log("=== 工具函数测试 ===");

  // 测试节流函数
  const throttledLog = utils.throttle((msg) => {
    console.log(`节流函数执行: ${msg}`, new Date().toISOString());
  }, 1000);

  // 快速调用多次，应该只有一次执行
  console.log("测试节流函数...");
  throttledLog("第一次调用");
  throttledLog("第二次调用");
  throttledLog("第三次调用");

  // 测试元素位置获取（通过实例）
  if (topFixedInstance) {
    console.log("顶部固定实例已初始化，可通过实例访问元素位置");
  }
  if (bottomFixedInstance) {
    console.log("底部固定实例已初始化，可通过实例访问元素位置");
  }
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
  // 顶部固定控制
  initTopBtn.addEventListener("click", initTopFixed);
  destroyTopBtn.addEventListener("click", destroyTopFixed);
  updateTopBtn.addEventListener("click", updateTopConfig);

  // 底部固定控制
  initBottomBtn.addEventListener("click", initBottomFixed);
  destroyBottomBtn.addEventListener("click", destroyBottomFixed);
  updateBottomBtn.addEventListener("click", updateBottomConfig);

  // 添加键盘快捷键
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "t":
          event.preventDefault();
          initTopFixed();
          break;
        case "b":
          event.preventDefault();
          initBottomFixed();
          break;
        case "d":
          event.preventDefault();
          destroyTopFixed();
          destroyBottomFixed();
          break;
      }
    }
  });
}

/**
 * 性能测试
 */
function performanceTest() {
  console.log("=== 性能测试 ===");

  const startTime = performance.now();

  // 模拟快速滚动
  let scrollCount = 0;
  const maxScrolls = 50;

  function simulateScroll() {
    if (scrollCount >= maxScrolls) {
      const endTime = performance.now();
      console.log(
        `性能测试完成: ${maxScrolls} 次滚动耗时 ${(endTime - startTime).toFixed(
          2
        )}ms`
      );
      return;
    }

    window.scrollTo(0, Math.random() * document.documentElement.scrollHeight);
    scrollCount++;
    requestAnimationFrame(simulateScroll);
  }

  // 只在开发模式下运行性能测试
  if (process.env.NODE_ENV === "development") {
    console.log("开始性能测试...");
    simulateScroll();
  }
}

/**
 * 初始化测试
 */
function initTest() {
  console.log("=== 滚动固定功能测试开始 ===");

  // 测试工具函数
  testUtils();

  // 绑定事件
  bindEventListeners();

  // 自动初始化所有固定功能
  autoInitAllFixed();

  // 性能测试（可选）
  // performanceTest();

  console.log("测试环境准备就绪");
  console.log("可用命令:");
  console.log('- 点击"初始化顶部固定"按钮或按 Ctrl+T');
  console.log('- 点击"初始化底部固定"按钮或按 Ctrl+B');
  console.log("- 按 Ctrl+D 销毁所有固定功能");
  console.log("- 滚动页面测试固定效果");
}

// 页面加载完成后初始化测试
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTest);
} else {
  initTest();
}

// 导出测试函数供外部使用
export {
  initTopFixed,
  destroyTopFixed,
  updateTopConfig,
  initBottomFixed,
  destroyBottomFixed,
  updateBottomConfig,
  testUtils,
  performanceTest,
};
