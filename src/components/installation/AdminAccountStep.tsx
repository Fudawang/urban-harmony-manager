
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstallation } from "@/contexts/InstallationContext";
import { useAuth } from "@/hooks/useAuth";
import { UserCog, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AdminAccountStep = () => {
  const { completeStep, goToNextStep, goToPreviousStep } = useInstallation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminAccountSetup, setAdminAccountSetup] = useState({
    username: "admin",
    role: "admin"
  });

  const handleContinue = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would save admin details here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
      
      await completeStep("admin_account");
      await goToNextStep();
      toast.success("管理員設定已完成");
    } catch (error) {
      console.error("Error setting up admin:", error);
      toast.error("管理員設定失敗");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <UserCog className="h-6 w-6 text-primary" />
          <CardTitle>管理員設定</CardTitle>
        </div>
        <CardDescription>
          設定系統管理員帳號資訊
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
          <p className="text-sm text-amber-800">
            您目前已使用 {user?.username} 登入系統，將自動設為管理員帳號。
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username">管理員使用者名稱</Label>
              <Input 
                id="admin-username" 
                value={user?.username || adminAccountSetup.username} 
                readOnly 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-role">角色</Label>
              <Input 
                id="admin-role" 
                value={adminAccountSetup.role} 
                readOnly 
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={isSubmitting}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> 上一步
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? "處理中..." : "下一步"} {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminAccountStep;
