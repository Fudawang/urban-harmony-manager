
import { supabase } from "@/integrations/supabase/client";
import { SystemSetting, InstallationStep, VersionInfo, InstallationStatus } from "@/types/system";
import { toast } from "sonner";

// Get system settings
export const getSystemSetting = async (key: string): Promise<SystemSetting | null> => {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')
    .eq('key', key)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching system setting:', error);
    return null;
  }
  
  return data;
};

// Get all installation steps
export const getInstallationSteps = async (): Promise<InstallationStep[]> => {
  const { data, error } = await supabase
    .from('installation_steps')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching installation steps:', error);
    return [];
  }
  
  // Type cast the status to ensure it matches the expected union type
  return data.map(step => ({
    ...step,
    status: step.status as 'pending' | 'completed' | 'skipped'
  }));
};

// Update installation step status
export const updateInstallationStep = async (
  stepName: string, 
  status: 'pending' | 'completed' | 'skipped'
): Promise<boolean> => {
  const { error } = await supabase
    .from('installation_steps')
    .update({ 
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null 
    })
    .eq('step_name', stepName);
  
  if (error) {
    console.error('Error updating installation step:', error);
    toast.error('無法更新安裝步驟');
    return false;
  }
  
  return true;
};

// Update current installation step in system settings
export const updateCurrentInstallationStep = async (step: number): Promise<boolean> => {
  const settingKey = 'installation_status';
  
  // First get current value
  const currentSetting = await getSystemSetting(settingKey);
  if (!currentSetting) return false;
  
  const currentValue = currentSetting.value as InstallationStatus;
  const newValue = { ...currentValue, current_step: step };
  
  const { error } = await supabase
    .from('system_settings')
    .update({ value: newValue })
    .eq('key', settingKey);
  
  if (error) {
    console.error('Error updating installation status:', error);
    toast.error('無法更新安裝狀態');
    return false;
  }
  
  return true;
};

// Mark installation as completed
export const completeInstallation = async (): Promise<boolean> => {
  const settingKey = 'installation_status';
  
  // First get current value
  const currentSetting = await getSystemSetting(settingKey);
  if (!currentSetting) return false;
  
  const currentValue = currentSetting.value as InstallationStatus;
  const newValue = { ...currentValue, completed: true };
  
  const { error } = await supabase
    .from('system_settings')
    .update({ value: newValue })
    .eq('key', settingKey);
  
  if (error) {
    console.error('Error completing installation:', error);
    toast.error('無法完成安裝流程');
    return false;
  }
  
  return true;
};

// Get current version information
export const getVersionInfo = async (): Promise<VersionInfo | null> => {
  const versionSetting = await getSystemSetting('version');
  if (!versionSetting) return null;
  
  return versionSetting.value as VersionInfo;
};

// Check for latest version (could connect to a remote API)
export const checkForUpdates = async (): Promise<{ available: boolean, version: string | null }> => {
  try {
    // This would be replaced with an actual API call in production
    // For now, simulate a version check with a mock response
    const mockLatestVersion = "1.1.0";
    const currentVersion = await getVersionInfo();
    
    if (!currentVersion) return { available: false, version: null };
    
    // Update the check timestamp and latest available version
    await supabase
      .from('system_settings')
      .update({
        value: {
          ...currentVersion,
          latest_check: new Date().toISOString(),
          latest_available: mockLatestVersion
        }
      })
      .eq('key', 'version');
    
    // Compare versions
    const isNewer = mockLatestVersion > currentVersion.current;
    
    return {
      available: isNewer,
      version: isNewer ? mockLatestVersion : null
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return { available: false, version: null };
  }
};

// Update system version
export const updateSystemVersion = async (newVersion: string): Promise<boolean> => {
  try {
    const currentVersion = await getVersionInfo();
    if (!currentVersion) return false;
    
    const { error } = await supabase
      .from('system_settings')
      .update({
        value: {
          ...currentVersion,
          current: newVersion,
          latest_check: new Date().toISOString()
        }
      })
      .eq('key', 'version');
    
    if (error) {
      console.error('Error updating system version:', error);
      return false;
    }
    
    toast.success(`系統已更新至版本 ${newVersion}`);
    return true;
  } catch (error) {
    console.error('Error updating system version:', error);
    return false;
  }
};
