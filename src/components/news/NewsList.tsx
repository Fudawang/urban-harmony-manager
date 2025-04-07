
import React, { useState } from 'react';
import { NewsItem as NewsItemType } from '@/contexts/AssociationContext';
import NewsItem from './NewsItem';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [searchTerm, setSearchTerm] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'public' | 'private'>(
    showOnlyPublic ? 'public' : 'all'
  );

  // Filter news by search term and visibility
  const filteredNews = news
    .filter(item => {
      if (showOnlyPublic) return item.isPublic;
      
      if (visibility === 'public') return item.isPublic;
      if (visibility === 'private') return !item.isPublic;
      return true; // 'all'
    })
    .filter(item => {
      if (!searchTerm) return true;
      return (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (news.length === 0) {
    return <p className="text-center text-gray-500 py-8">目前尚無最新消息</p>;
  }

  return (
    <div className="space-y-4">
      {isAdmin && !showOnlyPublic && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="搜尋消息..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={visibility}
            onValueChange={(value) => setVisibility(value as 'all' | 'public' | 'private')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="可見度篩選" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有消息</SelectItem>
              <SelectItem value="public">公開消息</SelectItem>
              <SelectItem value="private">僅會員消息</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredNews.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          {searchTerm ? '沒有符合搜尋條件的消息' : '目前尚無最新消息'}
        </p>
      ) : (
        filteredNews.map(item => (
          <NewsItem 
            key={item.id} 
            news={item} 
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default NewsList;
