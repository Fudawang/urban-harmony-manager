
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstallation } from "@/contexts/InstallationContext";
import { Building2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AssociationInfoStep = () => {
  const { completeStep, goToNextStep, goToPreviousStep } = useInstallation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [associationInfo, setAssociationInfo] = useState({
    name: "",
    address: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAssociationInfo(prev => ({
      ...prev,
      [id.replace("association-", "")]: value
    }));
  };

  const isFormValid = () => {
    return associationInfo.name.trim() !== "" && 
           associationInfo.contactPerson.trim() !== "" &&
           associationInfo.contactEmail.trim() !== "";
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      toast.error("請填寫必填欄位");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would save association info here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
      
      await completeStep("association_info");
      await goToNextStep();
      toast.success("都更會資訊已儲存");
    } catch (error) {
      console.error("Error saving association info:", error);
      toast.error("儲存都更會資訊失敗");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const handleSkip = async () => {
    await completeStep("association_info"); // Mark as completed anyway
    await goToNextStep();
    toast.info("已跳過都更會資訊設定");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Building2 className="h-6 w-6 text-primary" />
          <CardTitle>都更會資訊</CardTitle>
        </div>
        <CardDescription>
          填寫都市更新會基本資訊
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="association-name">都更會名稱 *</Label>
              <Input 
                id="association-name" 
                value={associationInfo.name} 
                onChange={handleInputChange}
                placeholder="例：臺北市○○路○○段○○號都市更新會"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="association-address">地址</Label>
              <Input 
                id="association-address" 
                value={associationInfo.address} 
                onChange={handleInputChange}
                placeholder="都更會地址"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="association-contactPerson">聯絡人 *</Label>
                <Input 
                  id="association-contactPerson" 
                  value={associationInfo.contactPerson} 
                  onChange={handleInputChange}
                  placeholder="聯絡人姓名"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="association-contactEmail">聯絡信箱 *</Label>
                <Input 
                  id="association-contactEmail" 
                  type="email"
                  value={associationInfo.contactEmail} 
                  onChange={handleInputChange}
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="association-contactPhone">聯絡電話</Label>
              <Input 
                id="association-contactPhone" 
                value={associationInfo.contactPhone} 
                onChange={handleInputChange}
                placeholder="02-12345678"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> 上一步
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleSkip} 
            disabled={isSubmitting}
          >
            跳過此步驟
          </Button>
        </div>
        <Button 
          onClick={handleContinue} 
          disabled={isSubmitting || !isFormValid()}
          className="gap-2"
        >
          {isSubmitting ? "儲存中..." : "下一步"} {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssociationInfoStep;
