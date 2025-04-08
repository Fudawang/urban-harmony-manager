
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

export interface VersionInfo {
  current: string;
  latest_check: string | null;
  latest_available: string | null;
}

export interface InstallationStatus {
  completed: boolean;
  current_step: number;
}

export interface InstallationStep {
  id: string;
  step_name: string;
  status: 'pending' | 'completed' | 'skipped';
  completed_at: string | null;
  created_at: string;
  sort_order: number;
}

export interface SystemInstallationState {
  isLoading: boolean;
  steps: InstallationStep[];
  currentStep: number;
  isCompleted: boolean;
  version: VersionInfo;
}
