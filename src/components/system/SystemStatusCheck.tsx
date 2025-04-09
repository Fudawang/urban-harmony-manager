
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstallation } from "@/contexts/InstallationContext";
import { Database, Check, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const SystemStatusCheck = () => {
  const { completeStep } = useInstallation();
  const [isChecking, setIsChecking] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleCheckSystem = async () => {
    setIsChecking(true);
    
    try {
      // In a real app, you would check system status here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate check
      
      setIsReady(true);
      toast.success("系統狀態檢查完成");
      
      // Mark database setup step as completed if not already
      await completeStep("database_setup");
    } catch (error) {
      console.error("Error checking system:", error);
      toast.error("系統狀態檢查失敗");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-primary" />
          <CardTitle>系統狀態檢查</CardTitle>
        </div>
        <CardDescription>
          檢查系統連線和設定是否正常
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4 bg-muted/50">
          <h3 className="font-medium mb-2">系統資訊</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">資料庫主機:</div>
            <div>ugvilvgsrupeoegealae.supabase.co</div>
            <div className="text-muted-foreground">資料庫名稱:</div>
            <div>postgres</div>
            <div className="text-muted-foreground">用戶端:</div>
            <div>PostgreSQL</div>
          </div>
        </div>

        {isReady && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center text-green-700">
              <Check className="h-5 w-5 mr-2" />
              <span className="font-medium">系統狀態正常</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCheckSystem} 
          disabled={isChecking}
          className="gap-2"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              檢查中...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              檢查系統狀態
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SystemStatusCheck;
