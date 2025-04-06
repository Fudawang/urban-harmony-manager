
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';

type AuthLayoutProps = {
  requireAdmin?: boolean;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect to dashboard if user is not admin but admin is required
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block md:w-64 flex-shrink-0" />
        <main className="flex-1 p-4 md:p-6 pt-4 pb-20 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
