import { useQuery } from '@tanstack/react-query';
import { articlesApi } from '@/api/articles';
import type { IGetArticles } from '@/api/articles';

export const useArticles = (params: IGetArticles) => {
  return useQuery({
    // 只要参数变了，自动重新拉取
    queryKey: ['articles', params],
    queryFn: () => articlesApi.getAdminArticles(params),
    // 缓存时间设置为 0，数据过期后立即删除
    gcTime: 0,
  });
};
