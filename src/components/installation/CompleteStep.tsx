
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstallation } from "@/contexts/InstallationContext";
import { CheckCircle, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CompleteStep = () => {
  const { finishInstallation, goToPreviousStep, steps } = useInstallation();
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length - 1; // Exclude the "complete" step itself

  const handleComplete = async () => {
    setIsCompleting(true);
    
    try {
      await finishInstallation();
      toast.success("系統設定已完成");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing installation:", error);
      toast.error("完成系統設定時發生錯誤");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">安裝完成</CardTitle>
        </div>
        <CardDescription>
          系統設定已完成，您可以開始使用都更會管理系統
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">安裝進度</h3>
            <span className="text-sm">{completedSteps}/{totalSteps} 步驟</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">快速使用指南</h3>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>前往儀表板查看系統概況</li>
            <li>在「成員管理」頁面可以管理都更會成員</li>
            <li>在「會議管理」頁面可以新增及管理會議記錄</li>
            <li>在「設定」頁面可以修改都更會資訊及系統設定</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={isCompleting}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> 上一步
        </Button>
        <Button 
          onClick={handleComplete} 
          disabled={isCompleting}
          className="gap-2"
        >
          {isCompleting ? "完成中..." : "前往首頁"} {!isCompleting && <Home className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompleteStep;
