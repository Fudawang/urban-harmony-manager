
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { NewsItem as NewsItemType } from '@/contexts/AssociationContext';

interface NewsItemProps {
  news: NewsItemType;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NewsItem: React.FC<NewsItemProps> = ({ 
  news, 
  isAdmin = false,
  onEdit,
  onDelete
}) => {
  const formattedDate = format(new Date(news.date), 'yyyy年MM月dd日');
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{news.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </div>
          {news.isPublic && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              公開
            </Badge>
          )}
          {!news.isPublic && isAdmin && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              僅會員
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{news.content}</p>
      </CardContent>
      {isAdmin && (
        <CardFooter className="pt-1 flex justify-end gap-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(news.id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              編輯
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(news.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              刪除
            </button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default NewsItem;
