
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, Plus, Filter, Eye, EyeOff } from 'lucide-react';
import { useAssociation, NewsItem } from '@/contexts/AssociationContext';
import NewsList from './NewsList';
import NewsFormDialog from './NewsFormDialog';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card as CardPrimitive,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const NewsManagement: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useAssociation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { toast: hookToast } = useToast();

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
      toast.success("消息已更新", {
        description: "消息資料已成功更新"
      });
      hookToast({
        title: "已更新消息",
        description: "消息資料已成功更新",
      });
    } else {
      // Add new news
      addNews(data);
      toast.success("新增消息成功", {
        description: "消息資料已成功新增"
      });
      hookToast({
        title: "已新增消息",
        description: "消息資料已成功新增",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedNews) {
      deleteNews(selectedNews.id);
      toast.success("消息已刪除", {
        description: "消息資料已成功刪除"
      });
      hookToast({
        title: "已刪除消息",
        description: "消息資料已成功刪除",
      });
      setIsDeleteDialogOpen(false);
    }
  };

  // Stats for news
  const publicNewsCount = news.filter(item => item.isPublic).length;
  const privateNewsCount = news.filter(item => !item.isPublic).length;

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <CardPrimitive className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">總消息數</p>
                <p className="text-2xl font-bold text-blue-700">{news.length}</p>
              </div>
              <Newspaper className="h-8 w-8 text-blue-500" />
            </CardContent>
          </CardPrimitive>
          
          <CardPrimitive className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">公開消息</p>
                <p className="text-2xl font-bold text-green-700">{publicNewsCount}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </CardContent>
          </CardPrimitive>
          
          <CardPrimitive className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">僅會員消息</p>
                <p className="text-2xl font-bold text-amber-700">{privateNewsCount}</p>
              </div>
              <EyeOff className="h-8 w-8 text-amber-500" />
            </CardContent>
          </CardPrimitive>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Newspaper className="h-4 w-4" /> 所有消息
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> 公開消息
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-1">
              <EyeOff className="h-4 w-4" /> 僅會員消息
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <NewsList 
              news={news} 
              isAdmin={true}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </TabsContent>
          
          <TabsContent value="public">
            <NewsList 
              news={news.filter(item => item.isPublic)} 
              isAdmin={true}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </TabsContent>
          
          <TabsContent value="private">
            <NewsList 
              news={news.filter(item => !item.isPublic)} 
              isAdmin={true}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </TabsContent>
        </Tabs>
        
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
                {selectedNews && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">{selectedNews.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedNews.date} · {selectedNews.isPublic ? '公開' : '僅會員'}
                    </p>
                  </div>
                )}
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
