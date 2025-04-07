
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewsItem } from '@/contexts/AssociationContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const newsSchema = z.object({
  title: z.string().min(2, { message: '標題至少需要2個字元' }).max(100, { message: '標題不能超過100個字元' }),
  content: z.string().min(10, { message: '內容至少需要10個字元' }),
  date: z.string(),
  isPublic: z.boolean().default(false)
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface NewsFormProps {
  defaultValues?: Partial<NewsFormValues>;
  onSubmit: (data: NewsFormValues) => void;
  onCancel: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ defaultValues, onSubmit, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      content: defaultValues?.content || '',
      date: defaultValues?.date || today,
      isPublic: defaultValues?.isPublic || false
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>標題</FormLabel>
              <FormControl>
                <Input placeholder="請輸入消息標題" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>內容</FormLabel>
              <FormControl>
                <Textarea placeholder="請輸入消息內容" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>日期</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>公開此消息</FormLabel>
                <p className="text-sm text-muted-foreground">
                  設定為公開後，所有人都可以在首頁查看此消息
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>取消</Button>
          <Button type="submit">儲存</Button>
        </div>
      </form>
    </Form>
  );
};

export default NewsForm;
