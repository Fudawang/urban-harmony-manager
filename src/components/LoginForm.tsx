
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { LogIn, Lock, User } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(username, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
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
      <CardFooter className="justify-between text-xs text-gray-500 border-t pt-4">
        <p>測試帳號: admin / admin123</p>
        <p>訪客帳號: visitor / visitor123</p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
