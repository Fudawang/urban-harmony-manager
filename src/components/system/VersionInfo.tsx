
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstallation } from "@/contexts/InstallationContext";
import { useAuth } from "@/hooks/useAuth";
import { 
  Tag, 
  RefreshCw, 
  Download, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { toast } from "sonner";

const VersionInfo = () => {
  const { version, checkForSystemUpdates, updateToNewVersion } = useInstallation();
  const { isAdmin } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCheckForUpdates = async () => {
    setIsChecking(true);
    
    try {
      await checkForSystemUpdates();
    } catch (error) {
      console.error("Error checking for updates:", error);
      toast.error("檢查更新時發生錯誤");
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpdate = async () => {
    if (!version.latest_available) return;
    
    setIsUpdating(true);
    
    try {
      await updateToNewVersion(version.latest_available);
    } catch (error) {
      console.error("Error updating system:", error);
      toast.error("更新系統時發生錯誤");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "從未檢查";
    return new Date(dateString).toLocaleString('zh-TW');
  };

  const hasUpdate = version.latest_available && version.latest_available !== version.current;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Tag className="h-5 w-5" />
          系統版本資訊
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">目前版本</span>
          <span className="font-medium">{version.current}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">最後檢查時間</span>
          <span>{formatDate(version.latest_check)}</span>
        </div>
        
        {hasUpdate && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">有新版本可用</p>
              <p className="text-sm text-amber-700">
                最新版本 {version.latest_available} 已可更新
              </p>
            </div>
          </div>
        )}
        
        {!hasUpdate && version.latest_check && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="font-medium text-green-800">
              系統已是最新版本
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleCheckForUpdates} 
          disabled={isChecking}
          className="gap-1"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              檢查中...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              檢查更新
            </>
          )}
        </Button>
        
        {hasUpdate && isAdmin() && (
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            className="gap-1"
          >
            {isUpdating ? (
              <>
                <Download className="h-4 w-4 animate-spin" />
                更新中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                更新至 {version.latest_available}
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VersionInfo;
