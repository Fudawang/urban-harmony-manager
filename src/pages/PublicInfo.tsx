
import React from 'react';
import { useAssociation } from '@/contexts/AssociationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewsList from '@/components/news/NewsList';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';

const PublicInfo: React.FC = () => {
  const { associationInfo, news } = useAssociation();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-urban-800">公開資訊</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-urban-700">更新會資訊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
        
        <div>
          <h2 className="text-xl font-bold mb-4 text-urban-700">最新消息</h2>
          <NewsList news={news} showOnlyPublic={true} />
        </div>
      </div>
    </div>
  );
};

export default PublicInfo;
