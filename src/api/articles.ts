import { apiClient } from '@/lib/api';
import { ArticleType } from '@/constants';
import type { PaginatedResponse } from './types';

/** 创建文章 Input */
export type ICreateArticle = {
  /** 标题 */
  title: string;
  /** 副标题 */
  subtitle?: string;
  /** 封面图片URL */
  coverUrl?: string;
  /** 内容 */
  content?: string;
  /** 类型 */
  type: ArticleType;
  /** 标签 */
  tagNames?: string[];
  /** 照片 */
  photos?: ICreateArticlePhoto[];
  /** 作品 */
  workIds?: string[];
  /** 汉字 */
  characters?: string[];
};
/** 创建文章 Input - 照片 */
export type ICreateArticlePhoto = {
  /** 图片URL */
  url: string;
  /** 图片标题 */
  title: string;
  /** 图片描述 */
  description?: string;
  /** 图片拍摄时间 */
  shotAt?: string;
};
/** 创建文章 Output */
export type OCreateArticle = {
  id: string;
  title: string;
  content: string;
};

/** 获取文章列表 Input */
export type IGetArticles = {
  page: number;
  pageSize: number;
};

/** 获取文章列表 Output */
export type OGetArticles = PaginatedResponse<ArticleRecord>;
export interface ArticleRecord {
  id: string;
  slug: string;
  type: ArticleType;
  title: string;
  content: string;
  coverUrl: string | null;
  authorId: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any> | null;
  author: {
    name: string;
  };
  tags: string[];
}

export const articlesApi = {
  /** 创建文章 */
  createArticle: (data: ICreateArticle) => apiClient.post<OCreateArticle>('articles', data),
  /** 获取文章列表 */
  getArticles: (searchParams: IGetArticles) =>
    apiClient.get<OGetArticles>('articles', { searchParams }),
  /** 管理员获取文章列表 */
  getAdminArticles: (searchParams: IGetArticles) =>
    apiClient.get<OGetArticles>('articles/admin', { searchParams }),
};
