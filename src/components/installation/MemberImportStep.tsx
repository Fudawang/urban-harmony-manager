
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstallation } from "@/contexts/InstallationContext";
import { Users, Upload, FileText, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

const MemberImportStep = () => {
  const { completeStep, goToNextStep, goToPreviousStep } = useInstallation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileUpload = () => {
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      toast.success("範例成員資料已匯入");
    }, 2000);
  };

  const handleContinue = async () => {
    await completeStep("member_import");
    await goToNextStep();
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const handleSkip = async () => {
    await completeStep("member_import"); // Mark as completed anyway
    await goToNextStep();
    toast.info("已跳過成員資料匯入");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-primary" />
          <CardTitle>成員資料匯入</CardTitle>
        </div>
        <CardDescription>
          匯入都更會成員名冊
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg border p-8 flex flex-col items-center justify-center">
          {!uploadComplete ? (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">拖曳檔案或點擊上傳</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                支援 Excel 或 CSV 格式，請依照範本格式匯入
              </p>
              <Button 
                onClick={handleFileUpload} 
                disabled={isUploading} 
                className="gap-2"
              >
                {isUploading ? "上傳中..." : "上傳檔案"} {!isUploading && <FileText className="h-4 w-4" />}
              </Button>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">檔案已成功匯入</h3>
              <p className="text-sm text-muted-foreground">成員資料已匯入系統</p>
            </>
          )}
        </div>

        <div className="text-sm">
          <p className="font-medium mb-2">匯入說明：</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>請依照系統範本格式匯入資料</li>
            <li>必填欄位：姓名、身分證字號、聯絡電話</li>
            <li>支援匯入：地主、建物所有權人資料</li>
            <li>特殊符號可能導致匯入錯誤</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={isUploading}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> 上一步
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleSkip} 
            disabled={isUploading}
          >
            跳過此步驟
          </Button>
        </div>
        <Button 
          onClick={handleContinue} 
          disabled={isUploading}
          className="gap-2"
        >
          下一步 <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberImportStep;
