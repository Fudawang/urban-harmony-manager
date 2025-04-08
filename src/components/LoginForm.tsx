
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { LogIn, Lock, User, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'visitor'>('admin');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('請輸入帳號和密碼');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(username, password);
      // No need for toast here, the login function already does that
    } catch (error) {
      console.error('Login failed:', error);
      // Error toast is already handled in the login function
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (type: 'admin' | 'visitor') => {
    setUsername(type === 'admin' ? 'admin' : 'visitor');
    setPassword(type === 'admin' ? 'admin123' : 'visitor123');
    setLoginType(type);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-urban-600 rounded-full flex items-center justify-center mb-4">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-urban-800">都市更新會管理系統</CardTitle>
        <CardDescription className="text-gray-500">請輸入帳號密碼登入系統</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="admin" value={loginType} onValueChange={(val) => setLoginType(val as 'admin' | 'visitor')}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="admin" className="flex items-center gap-1">
              <Shield className="h-4 w-4" /> 管理員登入
            </TabsTrigger>
            <TabsTrigger value="visitor" className="flex items-center gap-1">
              <Info className="h-4 w-4" /> 訪客登入
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 text-sm text-blue-800">
              管理員可以存取所有功能，包括會員管理、會議管理與資料設定。
            </div>
          </TabsContent>
          
          <TabsContent value="visitor">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-sm text-amber-800">
              訪客只能查看公開資訊頁面，無法進行管理操作。
            </div>
          </TabsContent>
        </Tabs>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              帳號
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <User size={16} />
              </div>
              <Input
                id="username"
                type="text"
                placeholder="請輸入帳號"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密碼
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock size={16} />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="請輸入密碼"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-urban-600 hover:bg-urban-700" 
            disabled={isLoading}
          >
            {isLoading ? '登入中...' : '登入系統'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-xs text-gray-500 border-t pt-4">
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleQuickLogin('admin')} 
            className="text-xs"
          >
            <Shield className="h-3 w-3 mr-1" />
            使用管理員帳號
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleQuickLogin('visitor')} 
            className="text-xs"
          >
            <Info className="h-3 w-3 mr-1" />
            使用訪客帳號
          </Button>
        </div>
        <div className="text-center w-full">
          <p className="text-xs text-gray-400">管理員: admin / admin123 | 訪客: visitor / visitor123</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
