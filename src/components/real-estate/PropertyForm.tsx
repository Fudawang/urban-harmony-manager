
import React from 'react';
import { RealEstateProperty } from '@/types/realEstate';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PropertyFormProps = {
  newProperty: Omit<RealEstateProperty, 'id' | 'lastUpdated'>;
  setNewProperty: React.Dispatch<React.SetStateAction<Omit<RealEstateProperty, 'id' | 'lastUpdated'>>>;
  handleAddProperty: () => void;
  onCancel: () => void;
};

const PropertyForm: React.FC<PropertyFormProps> = ({
  newProperty,
  setNewProperty,
  handleAddProperty,
  onCancel
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: name === 'area' || name === 'ownerCount' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewProperty({
      ...newProperty,
      [name]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>新增不動產</CardTitle>
        <CardDescription>
          填寫以下資訊以新增不動產資料
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address">地址</Label>
            <Input
              id="address"
              name="address"
              value={newProperty.address}
              onChange={handleInputChange}
              placeholder="例：台北市中山區中山北路一段85號"
            />
          </div>
          <div>
            <Label htmlFor="type">類型</Label>
            <Select 
              value={newProperty.type} 
              onValueChange={(value) => handleSelectChange('type', value as RealEstateProperty['type'])}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="選擇類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="土地">土地</SelectItem>
                <SelectItem value="建物">建物</SelectItem>
                <SelectItem value="土地及建物">土地及建物</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="district">行政區</Label>
            <Input
              id="district"
              name="district"
              value={newProperty.district}
              onChange={handleInputChange}
              placeholder="例：中山區"
            />
          </div>
          <div>
            <Label htmlFor="section">地段</Label>
            <Input
              id="section"
              name="section"
              value={newProperty.section}
              onChange={handleInputChange}
              placeholder="例：中山段"
            />
          </div>
          <div>
            <Label htmlFor="number">地號/建號</Label>
            <Input
              id="number"
              name="number"
              value={newProperty.number}
              onChange={handleInputChange}
              placeholder="例：123-45"
            />
          </div>
          <div>
            <Label htmlFor="area">面積（平方公尺）</Label>
            <Input
              id="area"
              name="area"
              type="number"
              value={newProperty.area || ''}
              onChange={handleInputChange}
              placeholder="例：120.5"
            />
          </div>
          <div>
            <Label htmlFor="ownerCount">所有權人數</Label>
            <Input
              id="ownerCount"
              name="ownerCount"
              type="number"
              value={newProperty.ownerCount || ''}
              onChange={handleInputChange}
              placeholder="例：1"
            />
          </div>
          <div>
            <Label htmlFor="status">狀態</Label>
            <Select 
              value={newProperty.status} 
              onValueChange={(value) => handleSelectChange('status', value as RealEstateProperty['status'])}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="選擇狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="更新前">更新前</SelectItem>
                <SelectItem value="更新後">更新後</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleAddProperty}>
          新增
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyForm;
