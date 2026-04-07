/**
 * 安全获取 localStorage 数据的工具函数
 * @param key 键名
 * @param defaultValue 默认值（可选）
 * @returns 返回解析后的数据或默认值
 */
export const getSafeLocalStorage = (key: string, defaultValue: string | null = null) => {
  try {
    // 1. 检查浏览器是否支持 localStorage (处理隐私模式或无痕模式)
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('当前环境不支持 localStorage');
      return defaultValue;
    }

    const item = window.localStorage.getItem(key);

    // 2. 如果不存在该键，返回默认值
    if (item === null) {
      return defaultValue;
    }

    // 3. 尝试解析 JSON（localStorage 存储的必须是字符串）
    try {
      return JSON.parse(item);
    } catch (e: any) {
      // 如果不是有效的 JSON（比如只是纯字符串），直接返回原始值
      console.error(`不是有效的 JSON, 解析失败:`, e);
      console.warn();
      return item;
    }
  } catch (error) {
    // 4. 捕获 SecurityError 或其他异常
    console.error(`读取 localStorage [${key}] 失败:`, error);
    return defaultValue;
  }
};
