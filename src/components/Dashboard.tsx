
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, ClipboardList, User, FileText, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAssociation } from '@/contexts/AssociationContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const StatCard = ({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: React.ReactNode, 
  value: string | number, 
  label: string, 
  color: string 
}) => (
  <Card>
    <CardContent className="p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

// Mock recent activity data
const recentActivity = [
  { id: 1, type: '會議紀錄', title: '第三次會員大會', user: '管理員', date: '2025-04-02' },
  { id: 2, type: '系統設定', title: '更新會基本資料', user: '管理員', date: '2025-04-01' },
  { id: 3, type: '會員管理', title: '新增會員資料', user: '管理員', date: '2025-03-30' },
  { id: 4, type: '議案管理', title: '修改議案編號A001', user: '管理員', date: '2025-03-28' },
];

const Dashboard: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { associationInfo } = useAssociation();
  const navigate = useNavigate();
  
  // Format the last login time if available
  const lastLoginFormatted = user?.lastLogin 
    ? format(new Date(user.lastLogin), 'yyyy-MM-dd HH:mm:ss')
    : '從未登入';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">系統儀表板</h1>
        <div className="text-sm text-muted-foreground">
          上次登入時間: {lastLoginFormatted}
        </div>
      </div>

      {isAdmin() ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              icon={<Users className="h-6 w-6 text-blue-700" />} 
              value={126} 
              label="會員總數" 
              color="bg-blue-100 text-blue-700" 
            />
            <StatCard 
              icon={<Calendar className="h-6 w-6 text-green-700" />} 
              value={8} 
              label="會議總數" 
              color="bg-green-100 text-green-700" 
            />
            <StatCard 
              icon={<ClipboardList className="h-6 w-6 text-amber-700" />} 
              value={24} 
              label="議案總數" 
              color="bg-amber-100 text-amber-700" 
            />
            <StatCard 
              icon={<User className="h-6 w-6 text-purple-700" />} 
              value={15} 
              label="理監事總數" 
              color="bg-purple-100 text-purple-700" 
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>更新會資訊</CardTitle>
                <CardDescription>都市更新會基本資料</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">更新會名稱</p>
                    <p className="font-medium">{associationInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">成立日期</p>
                    <p className="font-medium">{associationInfo.foundingDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">理事長</p>
                    <p className="font-medium">{associationInfo.president}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">統一編號</p>
                    <p className="font-medium">{associationInfo.unifiedNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">聯絡電話</p>
                    <p className="font-medium">{associationInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">電子郵件</p>
                    <p className="font-medium">{associationInfo.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">聯絡地址</p>
                  <p className="font-medium">{associationInfo.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>最近活動</CardTitle>
                <CardDescription>系統最近操作記錄</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-urban-100 text-urban-800 text-xs px-2 py-0.5 rounded">
                            {activity.type}
                          </span>
                          <span className="text-sm font-medium">{activity.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          操作者: {activity.user}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.date}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                公開資訊管理
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/public-info')}
              >
                查看公開頁面
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                您可以在系統設定中管理公開資訊頁面所顯示的內容，包括基本資料和最新消息的發佈。
              </p>
              <div className="mt-4">
                <Button onClick={() => navigate('/settings')} variant="outline" size="sm">
                  前往管理公開資訊
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>歡迎 {user?.username}</CardTitle>
              <CardDescription>您目前是以訪客身分登入</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">您可以在這裡查看：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>公開的會議紀錄</li>
                <li>公開的決議事項</li>
                <li>更新會公開資訊</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                如需查看更多資訊或執行管理功能，請聯繫管理員取得適當的權限。
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate('/public-info')} className="w-full">
                  前往公開資訊頁面
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>更新會資訊</CardTitle>
              <CardDescription>都市更新會基本資料</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">更新會名稱</p>
                  <p className="font-medium">{associationInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">成立日期</p>
                  <p className="font-medium">{associationInfo.foundingDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">聯絡地址</p>
                  <p className="font-medium">{associationInfo.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
