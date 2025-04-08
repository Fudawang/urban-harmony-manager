
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import { Building2, Phone, Mail, Calendar, MapPin, Users, History, Newspaper, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAssociation } from '@/contexts/AssociationContext';
import NewsList from '@/components/news/NewsList';
import Header from '@/components/Header';

const Index: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { associationInfo, news } = useAssociation();
  
  // If already authenticated, redirect to the appropriate page
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin()) {
        navigate('/dashboard');
      } else {
        navigate('/public-info');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Get only the latest 3 public news items
  const latestPublicNews = news
    .filter(item => item.isPublic)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-urban-50 to-white flex flex-col">
      {/* Header is now outside the main content flow */}
      <Header />
      
      {/* Main content area with correct padding */}
      <div className="flex-1 md:pl-64 pt-2">
        {/* 上方主要標題與介紹區塊 */}
        <div className="bg-gradient-to-r from-urban-700 to-urban-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                都市更新會管理系統
              </h1>
              <p className="text-lg opacity-90 mb-6">
                專為都市更新會打造的全方位管理平台，提供會員資料管理、會議紀錄、理監事管理、議案管理與投票決議等功能。
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 py-1">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  會員管理
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 py-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  會議管理
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 py-1">
                  <History className="h-3.5 w-3.5 mr-1" />
                  議案投票
                </Badge>
              </div>
              <Button 
                variant="outline" 
                className="bg-white text-urban-800 hover:bg-urban-50"
                onClick={() => navigate('/public-info')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                查看公開資訊
              </Button>
            </div>
          </div>
        </div>

        {/* 主要內容區塊 */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* 左側登入區塊 */}
            <div className="lg:col-span-2 lg:order-1 order-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-urban-800 mb-6">會員登入</h2>
                <LoginForm />
              </div>
            </div>
            
            {/* 右側更新會資訊與最新消息 */}
            <div className="lg:col-span-3 lg:order-2 order-1 space-y-8">
              {/* 更新會資訊卡片 */}
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-urban-50 border-b">
                  <CardTitle className="text-urban-700">更新會資訊</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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
                    </div>
                    
                    <div className="space-y-4">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 最新消息卡片 */}
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-urban-50 border-b flex justify-between items-center pb-3">
                  <CardTitle className="flex items-center text-urban-700">
                    <Newspaper className="h-5 w-5 mr-2" />
                    最新消息
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/public-info')} className="text-urban-600 hover:text-urban-800">
                    查看更多
                  </Button>
                </CardHeader>
                <CardContent className="pt-5">
                  <NewsList news={latestPublicNews} showOnlyPublic={true} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* 頁尾 */}
      <footer className="bg-urban-800 text-white/80 py-6 mt-auto md:pl-64">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} 都市更新會管理系統 - 提供完整的都市更新會運作管理解決方案</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
