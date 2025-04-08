
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  getInstallationSteps, 
  getSystemSetting, 
  getVersionInfo,
  updateCurrentInstallationStep,
  updateInstallationStep,
  completeInstallation,
  checkForUpdates,
  updateSystemVersion
} from "@/services/systemService";
import { InstallationStep, VersionInfo, SystemInstallationState } from "@/types/system";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface InstallationContextType extends SystemInstallationState {
  goToNextStep: () => Promise<boolean>;
  goToPreviousStep: () => Promise<boolean>;
  goToStep: (step: number) => Promise<boolean>;
  completeStep: (stepName: string) => Promise<boolean>;
  skipStep: (stepName: string) => Promise<boolean>;
  finishInstallation: () => Promise<boolean>;
  checkForSystemUpdates: () => Promise<{ available: boolean, version: string | null }>;
  updateToNewVersion: (version: string) => Promise<boolean>;
}

const InstallationContext = createContext<InstallationContextType | undefined>(undefined);

export const InstallationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState<SystemInstallationState>({
    isLoading: true,
    steps: [],
    currentStep: 1,
    isCompleted: false,
    version: { current: "1.0.0", latest_check: null, latest_available: null }
  });

  // Load installation data
  const loadInstallationData = async () => {
    if (!user) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      // Get installation steps
      const steps = await getInstallationSteps();
      
      // Get installation status
      const installationStatus = await getSystemSetting('installation_status');
      const { completed = false, current_step = 1 } = 
        installationStatus?.value || { completed: false, current_step: 1 };
      
      // Get version info
      const versionInfo = await getVersionInfo() || 
        { current: "1.0.0", latest_check: null, latest_available: null };
      
      setState({
        isLoading: false,
        steps,
        currentStep: current_step,
        isCompleted: completed,
        version: versionInfo
      });
    } catch (error) {
      console.error("Error loading installation data:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    loadInstallationData();
  }, [user]);

  // Go to next step
  const goToNextStep = async (): Promise<boolean> => {
    if (state.currentStep >= state.steps.length) return false;
    
    const nextStep = state.currentStep + 1;
    const success = await updateCurrentInstallationStep(nextStep);
    
    if (success) {
      setState(prev => ({ ...prev, currentStep: nextStep }));
      return true;
    }
    
    return false;
  };

  // Go to previous step
  const goToPreviousStep = async (): Promise<boolean> => {
    if (state.currentStep <= 1) return false;
    
    const prevStep = state.currentStep - 1;
    const success = await updateCurrentInstallationStep(prevStep);
    
    if (success) {
      setState(prev => ({ ...prev, currentStep: prevStep }));
      return true;
    }
    
    return false;
  };

  // Go to specific step
  const goToStep = async (step: number): Promise<boolean> => {
    if (step < 1 || step > state.steps.length) return false;
    
    const success = await updateCurrentInstallationStep(step);
    
    if (success) {
      setState(prev => ({ ...prev, currentStep: step }));
      return true;
    }
    
    return false;
  };

  // Complete a step
  const completeStep = async (stepName: string): Promise<boolean> => {
    const success = await updateInstallationStep(stepName, 'completed');
    
    if (success) {
      const updatedSteps = state.steps.map(step => 
        step.step_name === stepName 
          ? { ...step, status: 'completed' as const, completed_at: new Date().toISOString() } 
          : step
      );
      
      setState(prev => ({ ...prev, steps: updatedSteps }));
      return true;
    }
    
    return false;
  };

  // Skip a step
  const skipStep = async (stepName: string): Promise<boolean> => {
    const success = await updateInstallationStep(stepName, 'skipped');
    
    if (success) {
      const updatedSteps = state.steps.map(step => 
        step.step_name === stepName 
          ? { ...step, status: 'skipped' as const } 
          : step
      );
      
      setState(prev => ({ ...prev, steps: updatedSteps }));
      return true;
    }
    
    return false;
  };

  // Finish installation
  const finishInstallation = async (): Promise<boolean> => {
    const success = await completeInstallation();
    
    if (success) {
      setState(prev => ({ ...prev, isCompleted: true }));
      return true;
    }
    
    return false;
  };

  // Check for updates
  const checkForSystemUpdates = async () => {
    const result = await checkForUpdates();
    
    if (result.available && result.version) {
      // Update state with new version info
      setState(prev => ({
        ...prev,
        version: {
          ...prev.version,
          latest_check: new Date().toISOString(),
          latest_available: result.version
        }
      }));
      
      toast.info(`有新版本可用: ${result.version}`);
    } else {
      toast.success('已是最新版本');
    }
    
    return result;
  };

  // Update to new version
  const updateToNewVersion = async (version: string): Promise<boolean> => {
    if (!isAdmin()) {
      toast.error('只有管理員可以更新系統版本');
      return false;
    }
    
    const success = await updateSystemVersion(version);
    
    if (success) {
      setState(prev => ({
        ...prev,
        version: {
          ...prev.version,
          current: version
        }
      }));
      return true;
    }
    
    return false;
  };

  return (
    <InstallationContext.Provider
      value={{
        ...state,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        completeStep,
        skipStep,
        finishInstallation,
        checkForSystemUpdates,
        updateToNewVersion
      }}
    >
      {children}
    </InstallationContext.Provider>
  );
};

export const useInstallation = () => {
  const context = useContext(InstallationContext);
  if (context === undefined) {
    throw new Error("useInstallation must be used within an InstallationProvider");
  }
  return context;
};
