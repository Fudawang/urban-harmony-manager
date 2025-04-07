
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building, 
  Phone, 
  AtSign, 
  MapPin, 
  Calendar, 
  User, 
  Save,
  Lock,
  Key,
  UserPlus,
  UserX
} from 'lucide-react';
import { toast } from 'sonner';
import { useAssociation } from '@/contexts/AssociationContext';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('association');
  const [saving, setSaving] = useState(false);
  const { associationInfo, updateAssociationInfo } = useAssociation();
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('設定已儲存');
    }, 1000);
  };

  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'admin', lastLogin: '2024-04-06 08:32:15' },
    { id: 2, username: 'visitor', role: 'visitor', lastLogin: '2024-04-05 14:21:45' },
    { id: 3, username: 'secretary', role: 'admin', lastLogin: '2024-04-04 16:45:22' }
  ]);

  const handleInputChange = (field: string, value: string) => {
    updateAssociationInfo({ [field]: value });
  };

  const handleResetPassword = (userId: number) => {
    toast.success(`使用者密碼已重設，已發送臨時密碼至使用者信箱`);
  };

  const handleDeleteUser = (userId: number) => {
    toast.success(`使用者已刪除`);
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="page-container space-y-6">
      <h1 className="page-title">系統設定</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="association">都市更新會基本資料</TabsTrigger>
          <TabsTrigger value="users">系統使用者管理</TabsTrigger>
        </TabsList>
        
        <TabsContent value="association">
          <Card>
            <CardHeader>
              <CardTitle>都市更新會基本資料設定</CardTitle>
              <CardDescription>
                設定都市更新會的基本資料，包括名稱、聯絡資訊等
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Building size={16} />
                    更新會名稱
                  </Label>
                  <Input 
                    id="name" 
                    value={associationInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="president" className="flex items-center gap-2">
                    <User size={16} />
                    理事長姓名
                  </Label>
                  <Input 
                    id="president" 
                    value={associationInfo.president}
                    onChange={(e) => handleInputChange('president', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone size={16} />
                    聯絡電話
                  </Label>
                  <Input 
                    id="phone" 
                    value={associationInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <AtSign size={16} />
                    電子郵件
                  </Label>
                  <Input 
                    id="email" 
                    value={associationInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin size={16} />
                    聯絡地址
                  </Label>
                  <Input 
                    id="address" 
                    value={associationInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foundingDate" className="flex items-center gap-2">
                    <Calendar size={16} />
                    成立日期
                  </Label>
                  <Input 
                    id="foundingDate" 
                    type="date"
                    value={associationInfo.foundingDate}
                    onChange={(e) => handleInputChange('foundingDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unifiedNumber" className="flex items-center gap-2">
                    <Building size={16} />
                    統一編號
                  </Label>
                  <Input 
                    id="unifiedNumber" 
                    value={associationInfo.unifiedNumber}
                    onChange={(e) => handleInputChange('unifiedNumber', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="ml-auto"
              >
                {saving ? '儲存中...' : (
                  <>
                    <Save size={16} className="mr-2" />
                    儲存設定
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>系統使用者管理</CardTitle>
              <CardDescription>
                管理系統使用者帳號、密碼與權限
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">使用者列表</h3>
                  <Button>
                    <UserPlus size={16} className="mr-2" />
                    新增使用者
                  </Button>
                </div>
                
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          使用者名稱
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          角色
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          上次登入
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-urban-100 rounded-full flex items-center justify-center">
                                <User size={18} className="text-urban-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-urban-100 text-urban-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'admin' ? '管理者' : '訪客'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleResetPassword(user.id)}
                              >
                                <Key size={14} className="mr-1" />
                                重設密碼
                              </Button>
                              {user.username !== 'admin' && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <UserX size={14} className="mr-1" />
                                  刪除
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">密碼安全性設定</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <Lock size={16} className="mr-2 text-urban-600" />
                        <span>強制密碼複雜度要求</span>
                      </div>
                      <Button size="sm" variant="secondary">啟用</Button>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <Lock size={16} className="mr-2 text-urban-600" />
                        <span>90天強制變更密碼</span>
                      </div>
                      <Button size="sm" variant="secondary">啟用</Button>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <Lock size={16} className="mr-2 text-urban-600" />
                        <span>登入失敗鎖定機制</span>
                      </div>
                      <Button size="sm">已啟用</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="ml-auto"
              >
                {saving ? '儲存中...' : (
                  <>
                    <Save size={16} className="mr-2" />
                    儲存設定
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
