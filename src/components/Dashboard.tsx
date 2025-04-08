
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VersionInfo from "@/components/system/VersionInfo";
import { useInstallation } from "@/contexts/InstallationContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isCompleted, isLoading } = useInstallation();
  
  useEffect(() => {
    // If the system installation is not completed, redirect to installation wizard
    if (!isLoading && !isCompleted) {
      navigate("/installation");
    }
  }, [isLoading, isCompleted, navigate]);

  // If still loading or installation not complete, don't render dashboard content
  if (isLoading || !isCompleted) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">儀表板</h2>
        <Button onClick={() => navigate("/settings")} className="gap-2">
          <Settings className="h-4 w-4" />
          系統設定
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              總成員數
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">
              +2 本月新增
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              會議次數
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M8 12.2A3 3 0 0 1 6 9a3 3 0 0 1 3.8-2.8 5 5 0 0 1 7.4 4.2 5 5 0 0 1-7.4 6.6A3 3 0 0 1 8 14a3 3 0 0 1 1.3-2.7" />
              <path d="M12 9v3l1.5 1.5" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              上次會議: 2024/04/06
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              同意比例
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84.3%</div>
            <p className="text-xs text-muted-foreground">
              面積比例: 85.7%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              已提案數
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              待決議: 2
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>近期活動</CardTitle>
            <CardDescription>
              系統最近的活動記錄
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    更新成員資料
                  </p>
                  <p className="text-sm text-muted-foreground">
                    管理員更新了 2 筆成員資料
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2024/04/08 10:23
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    新增會議記錄
                  </p>
                  <p className="text-sm text-muted-foreground">
                    管理員新增了「第12次會議」記錄
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2024/04/06 14:05
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-yellow-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    提案待決議
                  </p>
                  <p className="text-sm text-muted-foreground">
                    管理員新增了「變更建築設計」提案
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2024/04/05 09:43
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>系統資訊</CardTitle>
            <CardDescription>
              系統狀態與版本資訊
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VersionInfo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
