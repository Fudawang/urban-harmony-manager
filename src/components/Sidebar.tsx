
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Calendar, 
  ClipboardList, 
  FileText, 
  Settings, 
  LogIn,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

type SidebarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const { closeSidebar } = useSidebar();
  
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        "text-gray-700 hover:bg-urban-50 hover:text-urban-700",
        isActive && "bg-urban-100 text-urban-800 font-medium"
      )}
      onClick={() => closeSidebar()}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const { isOpen, toggleSidebar } = useSidebar();
  
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 ease-in-out pt-16",
        "transform md:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden mb-4 text-gray-500"
            onClick={toggleSidebar}
          >
            <ChevronLeft size={16} className="mr-2" />
            收起選單
          </Button>
          
          <nav className="space-y-1">
            <NavItem to="/dashboard" icon={<Home size={18} />} label="首頁" />
            
            {isAdmin() && (
              <>
                <NavItem to="/members" icon={<Users size={18} />} label="會員管理" />
                <NavItem to="/meetings" icon={<Calendar size={18} />} label="會議管理" />
                <NavItem to="/board" icon={<Users size={18} />} label="理監事管理" />
                <NavItem to="/proposals" icon={<ClipboardList size={18} />} label="議案管理" />
                <NavItem to="/reports" icon={<FileText size={18} />} label="報表輸出" />
                <NavItem to="/settings" icon={<Settings size={18} />} label="系統設定" />
              </>
            )}
            
            {!isAdmin() && (
              <NavItem to="/public-info" icon={<FileText size={18} />} label="公開資訊" />
            )}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
