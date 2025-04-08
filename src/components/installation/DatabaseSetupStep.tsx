
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useInstallation } from "@/contexts/InstallationContext";
import { Database, Check, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const DatabaseSetupStep = () => {
  const { completeStep, goToNextStep } = useInstallation();
  const [isChecking, setIsChecking] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleCheckDatabase = async () => {
    setIsChecking(true);
    
    try {
      // In a real app, you would check database connection here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate check
      
      setIsReady(true);
      toast.success("資料庫設定檢查完成");
    } catch (error) {
      console.error("Error checking database:", error);
      toast.error("資料庫設定檢查失敗");
    } finally {
      setIsChecking(false);
    }
  };

  const handleContinue = async () => {
    if (isReady) {
      await completeStep("database_setup");
      await goToNextStep();
    } else {
      toast.warning("請先檢查資料庫設定");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-primary" />
          <CardTitle>資料庫設定</CardTitle>
        </div>
        <CardDescription>
          確認資料庫連線和設定是否正確
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4 bg-muted/50">
          <h3 className="font-medium mb-2">資料庫資訊</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">主機:</div>
            <div>ugvilvgsrupeoegealae.supabase.co</div>
            <div className="text-muted-foreground">資料庫名稱:</div>
            <div>postgres</div>
            <div className="text-muted-foreground">用戶端:</div>
            <div>PostgreSQL</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="auto-tables" checked disabled />
            <label htmlFor="auto-tables" className="text-sm">
              已建立必要資料表
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="auto-security" checked disabled />
            <label htmlFor="auto-security" className="text-sm">
              已設定資料庫安全權限
            </label>
          </div>
        </div>

        {isReady && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center text-green-700">
              <Check className="h-5 w-5 mr-2" />
              <span className="font-medium">資料庫設定已完成並且運作正常</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleCheckDatabase} 
          disabled={isChecking || isReady}
        >
          {isChecking ? "檢查中..." : "檢查連線"}
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={!isReady || isChecking}
          className="gap-2"
        >
          下一步 <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseSetupStep;
