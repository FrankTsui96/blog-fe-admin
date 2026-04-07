import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { getRouterData } from './utils';

/**
 * 客户端
 */
const ClientLayout = lazy(() => import('@/layouts/client/Layout'));
const Home = lazy(() => import('@/pages/client/Home/Home'));
const Tech = lazy(() => import('@/pages/client/tech/Tech'));
const TechDetail = lazy(() => import('@/pages/client/tech/TechDetail'));
const Life = lazy(() => import('@/pages/client/life/Life'));
const LifeDetail = lazy(() => import('@/pages/client/life/LifeDetail'));
const Sight = lazy(() => import('@/pages/client/sight/Sight'));
const SightDetail = lazy(() => import('@/pages/client/sight/SightDetail'));
const Hanzi = lazy(() => import('@/pages/client/hanzi/Hanzi'));
const HanziDetail = lazy(() => import('@/pages/client/hanzi/HanziDetail'));

/**
 * 管理端
 */
const AdminLayout = lazy(() => import('@/layouts/admin/Layout'));
const Console = lazy(() => import('@/pages/admin/Console'));
const Login = lazy(() => import('@/pages/admin/Login'));
const Articles = lazy(() => import('@/pages/admin/articles/Articles'));
const EditArticles = lazy(() => import('@/pages/admin/articles/EditArticles'));

/**
 * 路由数据
 */
const routerData: RouteObject[] = [
  /**
   * 客户端路由
   */
  {
    path: '/',
    element: <Home />,
  },
  {
    element: <ClientLayout />,
    children: [
      {
        path: '/tech',
        element: <Tech />,
      },
      {
        path: '/tech/:slug',
        element: <TechDetail />,
      },
      {
        path: '/life',
        element: <Life />,
      },
      {
        path: '/life/:slug',
        element: <LifeDetail />,
      },
      {
        path: '/sight',
        element: <Sight />,
      },
      {
        path: '/sight/:slug',
        element: <SightDetail />,
      },
      {
        path: '/hanzi',
        element: <Hanzi />,
      },
      {
        path: '/hanzi/:slug',
        element: <HanziDetail />,
      },
    ],
  },
  /**
   * 管理端路由
   */
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Console />,
      },
      {
        path: 'articles',
        element: <Articles />,
      },
      {
        path: 'articles/edit',
        element: <EditArticles />,
      },
    ],
  },
];

/**
 * 路由配置
 *
 * 使用 React Router v7 的 createBrowserRouter
 * 支持 loader、action 等新特性
 */
export const router = createBrowserRouter(getRouterData(routerData), { basename: '/admin' });

export default router;
