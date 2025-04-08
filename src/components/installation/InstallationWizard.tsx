
import { useInstallation } from "@/contexts/InstallationContext";
import DatabaseSetupStep from "./DatabaseSetupStep";
import AdminAccountStep from "./AdminAccountStep";
import AssociationInfoStep from "./AssociationInfoStep";
import MemberImportStep from "./MemberImportStep";
import CompleteStep from "./CompleteStep";
import { Loader2 } from "lucide-react";

const InstallationWizard = () => {
  const { isLoading, currentStep, steps, isCompleted } = useInstallation();

  // If installation is already completed, redirect to dashboard (handled by parent)
  if (isCompleted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render the appropriate step based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DatabaseSetupStep />;
      case 2:
        return <AdminAccountStep />;
      case 3:
        return <AssociationInfoStep />;
      case 4:
        return <MemberImportStep />;
      case 5:
        return <CompleteStep />;
      default:
        return <DatabaseSetupStep />;
    }
  };

  // Create step indicators
  const stepNames = [
    { name: "資料庫設定", step: "database_setup" },
    { name: "管理員設定", step: "admin_account" },
    { name: "都更會資訊", step: "association_info" },
    { name: "成員資料匯入", step: "member_import" },
    { name: "完成", step: "complete" }
  ];

  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <div className="mb-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">系統安裝精靈</h1>
          <p className="text-muted-foreground">
            完成以下步驟以設定您的都更會管理系統
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center max-w-3xl w-full">
            {stepNames.map((stepInfo, index) => {
              const stepData = steps.find(s => s.step_name === stepInfo.step);
              const isActive = index + 1 === currentStep;
              const isCompleted = stepData?.status === 'completed';
              const isSkipped = stepData?.status === 'skipped';

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center z-10
                      ${isCompleted ? 'bg-green-100 text-green-600 border border-green-600' : 
                        isSkipped ? 'bg-amber-100 text-amber-600 border border-amber-600' : 
                        isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 border border-gray-300'}`}
                  >
                    {index + 1}
                  </div>
                  <div className="text-xs mt-2 text-center max-w-[100px] truncate">
                    {stepInfo.name}
                  </div>
                  {index < stepNames.length - 1 && (
                    <div 
                      className={`h-0.5 absolute w-[calc(100%/${stepNames.length-1})] 
                        ${(isCompleted || isSkipped) ? 'bg-primary' : 'bg-gray-200'}`}
                      style={{ 
                        transform: `translateX(${50 + 100 * index}%)` 
                      }}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default InstallationWizard;
