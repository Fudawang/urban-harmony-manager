
import React from 'react';
import { NewsItem as NewsItemType } from '@/contexts/AssociationContext';
import NewsItem from './NewsItem';

interface NewsListProps {
  news: NewsItemType[];
  isAdmin?: boolean;
  showOnlyPublic?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NewsList: React.FC<NewsListProps> = ({ 
  news, 
  isAdmin = false, 
  showOnlyPublic = false,
  onEdit,
  onDelete
}) => {
  const filteredNews = showOnlyPublic ? news.filter(item => item.isPublic) : news;
  
  if (filteredNews.length === 0) {
    return <p className="text-center text-gray-500 py-8">目前尚無最新消息</p>;
  }

  return (
    <div className="space-y-4">
      {filteredNews.map(item => (
        <NewsItem 
          key={item.id} 
          news={item} 
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NewsList;
