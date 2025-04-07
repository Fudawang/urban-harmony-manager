
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssociation } from '@/contexts/AssociationContext';
import { Building2, MapPin, Phone, Mail, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const PublicInfoManagement: React.FC = () => {
  const { associationInfo } = useAssociation();
  const { toast: hookToast } = useToast();
  const navigate = useNavigate();
  
  const handleViewPublicPage = () => {
    // Navigate to the public info page
    navigate('/public-info');
    
    toast.info("正在查看公開資訊頁面");
    hookToast({
      title: "已前往公開資訊頁面",
      description: "您可以檢視公開頁面的顯示效果",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          公開資訊管理
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleViewPublicPage}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          查看公開頁面
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">公開資訊說明</h3>
          <p className="text-blue-700 text-sm">
            此頁面顯示的資訊將呈現在公開資訊頁面，訪客無需登入即可查看。
            您可以在系統設定中修改這些基本資訊，以及管理要公開的最新消息。
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium text-lg">目前公開的基本資訊</h3>
            
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium">{associationInfo.name}</div>
                <div className="text-sm text-muted-foreground">
                  統一編號: {associationInfo.unifiedNumber || '尚未設定'}
                </div>
                <div className="text-sm text-muted-foreground">
                  成立日期: {associationInfo.foundingDate}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium">聯絡地址</div>
                <div className="text-muted-foreground">{associationInfo.address}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium">聯絡電話</div>
                <div className="text-muted-foreground">{associationInfo.phone}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium">電子郵件</div>
                <div className="text-muted-foreground">{associationInfo.email}</div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button onClick={() => navigate('/settings')} variant="outline" size="sm">
                編輯基本資訊
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium text-lg mb-4">最新消息公開狀態</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-600" />
                  <span>公開的消息</span>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {associationInfo.news?.filter(n => n.isPublic).length || 0} 則
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-amber-600" />
                  <span>僅會員可見的消息</span>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {associationInfo.news?.filter(n => !n.isPublic).length || 0} 則
                </span>
              </div>
              
              <div className="mt-4">
                <Button onClick={() => navigate('/settings?tab=news')} variant="outline" size="sm">
                  管理最新消息
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicInfoManagement;
