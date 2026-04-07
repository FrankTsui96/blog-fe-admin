import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ReactMarkdown from 'react-markdown';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArticleType } from '@/constants';

const formSchema = z.object({
  title: z.string().min(2, '标题太短了'),
  slug: z.string().optional(),
  content: z.string().min(1, '内容不能为空'),
  type: z.enum([ArticleType.LIFE, ArticleType.TECH, ArticleType.SIGHT, ArticleType.SHUOZI]),
  published: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditArticles() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      type: ArticleType.TECH,
      published: false,
    },
  });

  const content = form.watch('content');

  const onSubmit = async (data: FormValues) => {
    console.log('提交数据:', data);
    // 这里调用你之前的 articlesApi.create(data)
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">撰写文章</h1>
            <Button type="submit">发布文章</Button>
          </div>

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input placeholder="输入文章标题..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 左侧：编辑区 */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="开始你的创作 (支持 Markdown)..."
                        className="min-h-[500px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 右侧：设置区 (分类、状态等) */}
            <div className="space-y-4">
              <div className="border rounded-md p-4 min-h-[500px] bg-white dark:bg-zinc-950">
                {/* 这里可以放 Select 组件选 type，或者 Switch 选 published */}
                {/* 也可以放你之前的 Tags 选择器、Hanzi 关联等 */}
                {/* 右侧/预览区：使用 react-markdown */}
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </article>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
