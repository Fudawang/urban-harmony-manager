
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, Plus } from 'lucide-react';
import { useAssociation, NewsItem } from '@/contexts/AssociationContext';
import NewsList from './NewsList';
import NewsFormDialog from './NewsFormDialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const NewsManagement: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useAssociation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { toast } = useToast();

  const handleAddClick = () => {
    setSelectedNews(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (id: string) => {
    const newsToEdit = news.find(item => item.id === id);
    if (newsToEdit) {
      setSelectedNews(newsToEdit);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    const newsToDelete = news.find(item => item.id === id);
    if (newsToDelete) {
      setSelectedNews(newsToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleSubmit = (data: Omit<NewsItem, 'id'>) => {
    if (selectedNews) {
      // Update existing news
      updateNews(selectedNews.id, data);
      toast({
        title: "已更新消息",
        description: "消息資料已成功更新",
      });
    } else {
      // Add new news
      addNews(data);
      toast({
        title: "已新增消息",
        description: "消息資料已成功新增",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedNews) {
      deleteNews(selectedNews.id);
      toast({
        title: "已刪除消息",
        description: "消息資料已成功刪除",
      });
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          最新消息管理
        </CardTitle>
        <Button size="sm" onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-1" /> 新增消息
        </Button>
      </CardHeader>
      <CardContent>
        <NewsList 
          news={news} 
          isAdmin={true}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        
        <NewsFormDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          defaultValues={selectedNews ? {
            title: selectedNews.title,
            content: selectedNews.content,
            date: selectedNews.date,
            isPublic: selectedNews.isPublic
          } : undefined}
          isEditing={!!selectedNews}
        />
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>確定要刪除此消息嗎？</AlertDialogTitle>
              <AlertDialogDescription>
                刪除後將無法恢復，請確認您的操作。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                刪除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default NewsManagement;
