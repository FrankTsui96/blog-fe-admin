# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

个人博客前端，基于 React 19 + TypeScript 构建。包含两个独立区域：**客户端**（阅读文章）和 **管理端**（管理文章）。代码注释、类型定义和 UI 文本均使用中文。

## 常用命令

- `pnpm dev` — 启动开发服务器（Vite）
- `pnpm build` — 先类型检查（`tsc -b`）再构建（`vite build`）
- `pnpm lint` / `pnpm lint:fix` — ESLint 检查 / 自动修复
- `pnpm format` / `pnpm format:check` — Prettier 格式化 / 检查
- `pnpm preview` — 预览生产构建

当前未配置测试框架。

## 架构

### 路由与布局

`src/router/index.tsx` 使用 `createBrowserRouter`（React Router v7）定义所有路由，所有页面组件均使用 `lazy` 懒加载。`src/router/utils.tsx` 为每个叶子路由包裹 `<Suspense fallback={<GlobalSpin />}>`。

两个布局根组件：
- **客户端**（`src/layouts/client/Layout.tsx`）— `Header` + `<Outlet />`
- **管理端**（`src/layouts/admin/Layout.tsx`）— Radix Sidebar + `<Outlet />`

### API 层

`src/lib/api.ts` — 基于 Ky 的 HTTP 客户端（`apiClient`）。所有 API 响应遵循 `ApiResponse<T>`（`{ code, message, data }`）。客户端自动处理：
- 从 `localStorage` 读取并附加 Bearer token
- 401 时重定向至 `/admin/login`（同时存储来源路径用于登录后跳回）
- 通过 `sonner` 弹出错误提示
- 开发环境下打印请求/响应日志

`src/api/` — 按领域划分的 API 模块（`articles.ts`、`auth.ts`），使用 `I*`（输入）和 `O*`（输出）的类型命名约定。

`src/api/types.ts` — 共享的 `PaginatedResponse<T>` 分页类型。

### 状态与数据请求

- **React Query**（`@tanstack/react-query`）— 在 `src/lib/queryClient.ts` 中配置，staleTime 5 分钟、retry 1 次、关闭窗口聚焦重请求。自定义 Hooks 在 `src/hooks/`（如 `useArticles.ts`）。
- **Zustand** — 用于全局 UI 状态（`src/store/useLoadingStore.ts`）。

### 常量

`src/constants/articles.ts` — `ArticleType` 枚举（TECH、LIFE、SIGHT、SHUOZI、OTHER），每种类型对应客户端的一个独立栏目，各有列表页 + 详情页。

### UI 组件

`src/components/ui/` — shadcn/ui 组件（Radix UI + Tailwind CSS + CVA）。`src/components/common/` — 项目通用组件。

### 路径别名

`@/*` 映射到 `./src/*`（在 `vite.config.ts` 和 `tsconfig.json` 中配置）。

### 环境变量

- `VITE_API_BASE_URL` — API 基础地址（默认 `/api`），参见 `.env.example`。
- 使用 Tailwind CSS v4 + `@tailwindcss/vite` 插件。
