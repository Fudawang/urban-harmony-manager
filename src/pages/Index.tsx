
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import { Building2, Phone, Mail, Calendar, MapPin, Users, History, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAssociation } from '@/contexts/AssociationContext';
import NewsList from '@/components/news/NewsList';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { associationInfo, news } = useAssociation();
  
  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Get only the latest 3 public news items
  const latestPublicNews = news
    .filter(item => item.isPublic)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-urban-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="order-2 md:order-1">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-urban-800 mb-4">
                  都市更新會管理系統
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  專為都市更新會打造的全方位管理平台，提供會員資料管理、會議紀錄、理監事管理、議案管理與投票決議等功能。
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    會員管理
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    會議管理
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 py-1">
                    <History className="h-3.5 w-3.5 mr-1" />
                    議案投票
                  </Badge>
                </div>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4 text-urban-700">更新會資訊</h2>
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <Newspaper className="h-5 w-5 mr-2" />
                      最新消息
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/public-info')}>
                      查看更多
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <NewsList news={latestPublicNews} showOnlyPublic={true} />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
