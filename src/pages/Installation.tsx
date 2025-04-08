
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInstallation } from "@/contexts/InstallationContext";
import { useAuth } from "@/hooks/useAuth";
import InstallationWizard from "@/components/installation/InstallationWizard";

const Installation = () => {
  const { isAuthenticated } = useAuth();
  const { isLoading, isCompleted } = useInstallation();
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
    
    // If installation is already completed, redirect to dashboard
    if (!isLoading && isCompleted) {
      navigate("/dashboard");
    }
  }, [isLoading, isAuthenticated, isCompleted, navigate]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <InstallationWizard />;
};

export default Installation;
