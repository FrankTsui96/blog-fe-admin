import { useNavigate } from 'react-router-dom';
import type { ArticleRecord } from '@/api/articles';
import { useArticles } from '@/hooks/useArticles';

import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';

const columns: ColumnDef<ArticleRecord>[] = [
  {
    accessorKey: 'title',
    header: '文章标题',
  },
  {
    accessorKey: 'subtitle',
    header: '文章副标题',
  },
  {
    accessorKey: 'type',
    header: '文章类型',
  },
];

export default function Articles() {
  const navigate = useNavigate();
  const { data: articles } = useArticles({ page: 1, pageSize: 10 });

  const handleCreateArticle = async () => {
    navigate('/articles/edit');
  };

  return (
    <div className="container mx-auto py-10">
      <div>
        <Button onClick={handleCreateArticle}>创建文章</Button>
      </div>
      <DataTable columns={columns} data={articles?.data.records || []} />
    </div>
  );
}
