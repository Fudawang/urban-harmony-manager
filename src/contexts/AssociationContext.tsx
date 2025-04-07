
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isPublic: boolean;
}

export interface AssociationInfo {
  name: string;
  president: string;
  phone: string;
  email: string;
  address: string;
  foundingDate: string;
  unifiedNumber?: string;
}

interface AssociationContextType {
  associationInfo: AssociationInfo;
  updateAssociationInfo: (info: Partial<AssociationInfo>) => void;
  news: NewsItem[];
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, news: Partial<Omit<NewsItem, 'id'>>) => void;
  deleteNews: (id: string) => void;
}

const defaultAssociationInfo: AssociationInfo = {
  name: '台北市中山區第一都市更新會',
  president: '王大明',
  phone: '02-2345-6789',
  email: 'info@tpeurban1.org.tw',
  address: '台北市中山區中山北路二段100號5樓',
  foundingDate: '2022-03-15',
  unifiedNumber: '87654321'
};

// Sample news data
const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: '都市更新會第一季會議通知',
    content: '親愛的會員，本會訂於4月15日舉行第一季會議，請各位準時參加。會議地點：台北市中山區中山北路二段100號5樓會議室。',
    date: '2025-03-30',
    isPublic: true
  },
  {
    id: '2',
    title: '中山區都市更新進度報告',
    content: '本會已完成中山區都市更新計畫第一階段規劃，預計於5月份提交都市更新審議委員會審議。',
    date: '2025-03-25',
    isPublic: true
  },
  {
    id: '3',
    title: '會員費繳納通知',
    content: '請各位會員於4月30日前完成本年度會員費繳納，感謝您的配合。',
    date: '2025-03-20',
    isPublic: false
  },
  {
    id: '4',
    title: '都市更新法規修訂說明會',
    content: '因應最新都市更新法規修訂，本會將於4月10日舉辦說明會，歡迎會員參加。',
    date: '2025-03-15',
    isPublic: true
  },
  {
    id: '5',
    title: '理事長交接典禮通知',
    content: '本會將於4月20日舉行理事長交接典禮，歡迎各位會員蒞臨參加。',
    date: '2025-03-10',
    isPublic: true
  }
];

const AssociationContext = createContext<AssociationContextType | undefined>(undefined);

export const useAssociation = () => {
  const context = useContext(AssociationContext);
  if (!context) {
    throw new Error('useAssociation must be used within an AssociationProvider');
  }
  return context;
};

export const AssociationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [associationInfo, setAssociationInfo] = useState<AssociationInfo>(defaultAssociationInfo);
  const [news, setNews] = useState<NewsItem[]>(defaultNews);

  const updateAssociationInfo = (info: Partial<AssociationInfo>) => {
    setAssociationInfo(prevInfo => ({
      ...prevInfo,
      ...info
    }));
  };

  const addNews = (newsItem: Omit<NewsItem, 'id'>) => {
    const newId = Date.now().toString();
    setNews(prev => [...prev, { ...newsItem, id: newId }]);
  };

  const updateNews = (id: string, newsItem: Partial<Omit<NewsItem, 'id'>>) => {
    setNews(prev => prev.map(item => item.id === id ? { ...item, ...newsItem } : item));
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AssociationContext.Provider value={{ 
      associationInfo, 
      updateAssociationInfo, 
      news, 
      addNews, 
      updateNews, 
      deleteNews 
    }}>
      {children}
    </AssociationContext.Provider>
  );
};
