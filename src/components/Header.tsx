
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from './Sidebar';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 md:pl-64">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 md:hidden" 
              onClick={toggleSidebar}
              aria-label="Menu"
            >
              <Menu size={20} />
            </Button>
          )}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-urban-600 rounded-md flex items-center justify-center text-white font-bold mr-2">
              UR
            </div>
            <h1 className="text-xl font-bold text-urban-800">都市更新會管理系統</h1>
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <span className="text-sm text-gray-600 mr-2">您好，</span>
              <span className="font-medium text-urban-700">{user?.username}</span>
              <span className="ml-2 text-xs bg-urban-100 text-urban-700 py-0.5 px-2 rounded-full">
                {user?.role === 'admin' ? '管理者' : '訪客'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout} 
              className="text-gray-600 hover:text-urban-700"
            >
              <LogOut size={16} className="mr-1" />
              <span className="hidden sm:inline">登出</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
