
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/Sidebar";
import { AssociationProvider } from "@/contexts/AssociationContext";
import Sidebar from "@/components/Sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/Dashboard";
import MemberManagement from "./components/MemberManagement";
import MeetingManagement from "./components/MeetingManagement";
import BoardManagement from "./components/BoardManagement";
import ProposalManagement from "./components/ProposalManagement";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import DatabaseManagement from "./components/DatabaseManagement";
import AuthLayout from "./components/AuthLayout";
import PublicInfo from "./pages/PublicInfo";

function App() {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AssociationProvider>
              <SidebarProvider>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Sidebar />
                  <Toaster />
                  <SonnerToaster position="top-right" />
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/public-info" element={<PublicInfo />} />
                    
                    {/* Protected routes */}
                    <Route element={<AuthLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                    
                    {/* Admin-only routes */}
                    <Route element={<AuthLayout requireAdmin />}>
                      <Route path="/members" element={<MemberManagement />} />
                      <Route path="/meetings" element={<MeetingManagement />} />
                      <Route path="/board" element={<BoardManagement />} />
                      <Route path="/proposals" element={<ProposalManagement />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/database" element={<DatabaseManagement />} />
                    </Route>
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </SidebarProvider>
            </AssociationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
