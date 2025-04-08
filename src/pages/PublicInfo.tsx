
import React from 'react';
import { useAssociation } from '@/contexts/AssociationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewsList from '@/components/news/NewsList';
import { Building2, MapPin, Phone, Mail, Calendar, FileText, Users } from 'lucide-react';
import Header from '@/components/Header';

const PublicInfo: React.FC = () => {
  const { associationInfo, news } = useAssociation();
  
  // Get only public news items, sorted by date
  const publicNews = news
    .filter(item => item.isPublic)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 md:pl-64 pt-2">
        <h1 className="text-3xl font-bold mb-2 text-urban-800">公開資訊</h1>
        <p className="text-muted-foreground mb-8">
          {associationInfo.name}的公開資訊，包含基本資料與最新公告。
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-urban-700">更新會資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-urban-600 mt-0.5" />
                  <div>
                    <div className="font-medium">{associationInfo.name}</div>
                    <div className="text-sm text-muted-foreground">統一編號: {associationInfo.unifiedNumber}</div>
                    <div className="text-sm text-muted-foreground">成立日期: {associationInfo.foundingDate}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-urban-600 mt-0.5" />
                  <div>
                    <div className="font-medium">聯絡地址</div>
                    <div className="text-muted-foreground">{associationInfo.address}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-urban-600 mt-0.5" />
                  <div>
                    <div className="font-medium">聯絡電話</div>
                    <div className="text-muted-foreground">{associationInfo.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-urban-600 mt-0.5" />
                  <div>
                    <div className="font-medium">電子郵件</div>
                    <div className="text-muted-foreground">{associationInfo.email}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-urban-700">更新會現況</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-urban-600" />
                      <span>會員總數</span>
                    </div>
                    <span className="font-bold">126 位</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-urban-600" />
                      <span>最近會議</span>
                    </div>
                    <span className="font-medium">2025-03-15</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-urban-600" />
                      <span>公告事項</span>
                    </div>
                    <span className="font-bold">{publicNews.length} 則</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-urban-700">最新消息</h2>
            {publicNews.length > 0 ? (
              <NewsList news={publicNews} showOnlyPublic={true} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  目前沒有公開的最新消息
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicInfo;
