import ky, { type KyInstance, type Options } from 'ky';
import { toast } from 'sonner';
import { StorageKeyRedirectRouter } from '@/constants';
import { router } from '@/router';

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = 10000; // 10 秒

// 创建 ky 实例
const api: KyInstance = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // 从 localStorage 获取 token 并添加到请求头
        const token = localStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }

        // 开发环境下打印请求信息
        if (import.meta.env.DEV) {
          console.log('→', request.method, request.url);
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        // 开发环境下打印响应信息
        if (import.meta.env.DEV) {
          console.log('←', response.status, response.url);
        }
        return response;
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;

        // 物理网络错误（如断网）处理
        if (!response) {
          toast.error('网络连接异常，请检查网络');
          return error;
        }

        const resData = await response.json<ApiResponse>();
        // 将解析后的数据挂载到 error 对象上，供页面 catch 使用
        (error as any).data = resData;

        // 处理常见的 HTTP 错误
        if (resData) {
          switch (resData.code) {
            case 401:
              {
                const isLoginApi = response.url?.includes('/auth/login');
                if (!isLoginApi) {
                  toast.error('登录过期，请重新登录');
                  // 未授权，清除 token 并跳转到登录页
                  localStorage.removeItem('token');
                  // 设置 redirect router
                  localStorage.setItem(StorageKeyRedirectRouter, router.state.location.pathname);
                  router.navigate('/admin/login', { replace: true });
                } else {
                  toast.error('登录失败，请检查邮箱和密码');
                }
              }
              break;
            case 403:
              toast.error('无权限访问');
              break;
            case 404:
              toast.error('请求的资源不存在');
              break;
            case 500:
              toast.error('服务器错误');
              break;
            default:
              toast.error(resData.message || '请求失败');
              break;
          }
        }

        return error;
      },
    ],
  },
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
});

// 类型定义
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// 封装的请求方法
export const apiClient = {
  /**
   * GET 请求
   */
  get: <T = unknown>(url: string, options?: Options) => {
    return api.get(url, options).json<ApiResponse<T>>();
  },

  /**
   * POST 请求
   */
  post: <T = unknown>(url: string, data?: unknown, options?: Options) => {
    return api.post(url, { json: data, ...options }).json<ApiResponse<T>>();
  },

  /**
   * PUT 请求
   */
  put: <T = unknown>(url: string, data?: unknown, options?: Options) => {
    return api.put(url, { json: data, ...options }).json<ApiResponse<T>>();
  },

  /**
   * PATCH 请求
   */
  patch: <T = unknown>(url: string, data?: unknown, options?: Options) => {
    return api.patch(url, { json: data, ...options }).json<ApiResponse<T>>();
  },

  /**
   * DELETE 请求
   */
  delete: <T = unknown>(url: string, options?: Options) => {
    return api.delete(url, options).json<ApiResponse<T>>();
  },

  /**
   * 上传文件
   */
  upload: <T = unknown>(url: string, formData: FormData, options?: Options) => {
    return api.post(url, { body: formData, ...options }).json<ApiResponse<T>>();
  },

  /**
   * 下载文件
   */
  download: async (url: string, filename?: string, options?: Options) => {
    const response = await api.get(url, options);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

// 导出原始 ky 实例，以便需要时使用
export { api };

// 默认导出
export default apiClient;
