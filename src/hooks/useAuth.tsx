
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type User = {
  id: string;
  username: string;
  role: 'admin' | 'visitor';
  lastLogin?: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
};

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: '2',
    username: 'visitor',
    password: 'visitor123',
    role: 'visitor' as const,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = localStorage.getItem('urbanRenewalUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // This is a mock authentication that would be replaced with actual API calls
    const foundUser = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      const now = new Date().toISOString();
      const userWithLastLogin = {
        ...userWithoutPassword,
        lastLogin: now
      };
      
      setUser(userWithLastLogin);
      setIsAuthenticated(true);
      localStorage.setItem('urbanRenewalUser', JSON.stringify(userWithLastLogin));
      toast.success('登入成功');
      
      // Navigate admin to dashboard and regular users to public info
      if (foundUser.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/public-info');
      }
    } else {
      toast.error('帳號或密碼錯誤');
      throw new Error('帳號或密碼錯誤');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('urbanRenewalUser');
    navigate('/');
    toast.success('已登出系統');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
