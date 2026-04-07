/** 文章类型 */
export const ArticleType = {
  /** 技术笔记 */
  TECH: 'TECH',
  /** 生活与想象 */
  LIFE: 'LIFE',
  /** 弗兰克的视线 */
  SIGHT: 'SIGHT',
  /** 说字 */
  SHUOZI: 'SHUOZI',
  /** 其他 */
  OTHER: 'OTHER',
} as const;
export type ArticleType = (typeof ArticleType)[keyof typeof ArticleType];
