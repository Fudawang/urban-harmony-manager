import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building, 
  Plus, 
  Search, 
  FileText, 
  Pencil, 
  Trash,
  MapPin,
  Square,
  Users
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

type RealEstateProperty = {
  id: string;
  address: string;
  type: '土地' | '建物' | '土地及建物';
  area: number;  // in square meters
  ownerCount: number;
  district: string;
  section: string;
  number: string;
  status: '更新前' | '更新後' | '其他';
  lastUpdated: string;
};

const RealEstateManagement: React.FC = () => {
  const [properties, setProperties] = useState<RealEstateProperty[]>([
    {
      id: "1",
      address: "台北市中山區中山北路一段85號",
      type: "土地及建物",
      area: 120.5,
      ownerCount: 3,
      district: "中山區",
      section: "中山段",
      number: "123-45",
      status: "更新前",
      lastUpdated: "2024-04-08"
    },
    {
      id: "2",
      address: "台北市信義區松仁路58號",
      type: "建物",
      area: 85.2,
      ownerCount: 1,
      district: "信義區",
      section: "信義段",
      number: "987-32",
      status: "更新後",
      lastUpdated: "2024-04-07"
    },
    {
      id: "3",
      address: "台北市大安區和平東路二段106號",
      type: "土地",
      area: 250.0,
      ownerCount: 5,
      district: "大安區",
      section: "大安段",
      number: "456-78",
      status: "其他",
      lastUpdated: "2024-04-06"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  
  const [newProperty, setNewProperty] = useState<Omit<RealEstateProperty, 'id' | 'lastUpdated'>>({
    address: '',
    type: '土地',
    area: 0,
    ownerCount: 0,
    district: '',
    section: '',
    number: '',
    status: '更新前'
  });

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.district.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = !filterType || property.type === filterType;
    const matchesStatus = !filterStatus || property.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddProperty = () => {
    if (!newProperty.address || !newProperty.district || !newProperty.number) {
      toast.error('請填寫必要欄位');
      return;
    }

    const newId = (properties.length + 1).toString();
    const today = new Date().toISOString().split('T')[0];
    
    setProperties([
      ...properties,
      {
        ...newProperty,
        id: newId,
        lastUpdated: today
      }
    ]);
    
    setIsAddingProperty(false);
    setNewProperty({
      address: '',
      type: '土地',
      area: 0,
      ownerCount: 0,
      district: '',
      section: '',
      number: '',
      status: '更新前'
    });
    
    toast.success('已新增不動產');
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(property => property.id !== id));
    toast.success('已刪除不動產');
  };

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
    <div className="page-container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">不動產管理</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddingProperty(true)} className="gap-1">
            <Plus size={16} />
            新增不動產
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Search size={20} className="text-urban-600" />
            搜尋與篩選
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">關鍵字搜尋</Label>
              <Input
                id="search"
                placeholder="搜尋地址、地號或行政區"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="type-filter">類型</Label>
              <Select value={filterType} onValueChange={(value) => setFilterType(value || undefined)}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="全部類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部類型</SelectItem>
                  <SelectItem value="土地">土地</SelectItem>
                  <SelectItem value="建物">建物</SelectItem>
                  <SelectItem value="土地及建物">土地及建物</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">狀態</Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value || undefined)}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="全部狀態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部狀態</SelectItem>
                  <SelectItem value="更新前">更新前</SelectItem>
                  <SelectItem value="更新後">更新後</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAddingProperty && (
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
            <Button variant="outline" onClick={() => setIsAddingProperty(false)}>
              取消
            </Button>
            <Button onClick={handleAddProperty}>
              新增
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Building size={20} className="text-urban-600" />
            不動產清單
          </CardTitle>
          <CardDescription>
            管理都更會範圍內的不動產資料
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>地址</TableHead>
                <TableHead>類型</TableHead>
                <TableHead>地段/地號</TableHead>
                <TableHead>面積(m²)</TableHead>
                <TableHead>所有權人數</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-urban-600" />
                      {property.address}
                    </div>
                  </TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{property.section} {property.number}</TableCell>
                  <TableCell>{property.area.toFixed(1)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-urban-600" />
                      {property.ownerCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      property.status === '更新前' ? 'bg-orange-100 text-orange-800' :
                      property.status === '更新後' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                      >
                        <FileText size={14} />
                        <span className="sr-only">詳情</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2"
                      >
                        <Pencil size={14} />
                        <span className="sr-only">編輯</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        <Trash size={14} />
                        <span className="sr-only">刪除</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProperties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    沒有找到符合條件的不動產資料
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstateManagement;
