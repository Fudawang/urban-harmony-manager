
import React, { useState, useEffect } from 'react';
import { RealEstateOwner } from '@/types/realEstate';
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Search, 
  Plus, 
  Pencil, 
  Trash,
  UserCheck
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { getOwners, createOwner, deleteOwner } from '@/services/supabaseServices/realEstateService';

const OwnerManagement: React.FC = () => {
  const [owners, setOwners] = useState<RealEstateOwner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingOwner, setIsAddingOwner] = useState(false);
  const [filterOwnershipType, setFilterOwnershipType] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newOwner, setNewOwner] = useState<Omit<RealEstateOwner, 'id'>>({
    name: '',
    idNumber: '',
    contactInfo: '',
    ownershipType: '單一所有權',
    ownershipRatio: '',
    notes: ''
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setIsLoading(true);
    try {
      const data = await getOwners();
      setOwners(data);
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast.error('無法載入所有權人資料');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOwners = owners.filter(owner => {
    const matchesSearch = 
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.contactInfo.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = !filterOwnershipType || owner.ownershipType === filterOwnershipType;
    
    return matchesSearch && matchesType;
  });

  const handleAddOwner = async () => {
    if (!newOwner.name || !newOwner.idNumber) {
      toast.error('請填寫必要欄位');
      return;
    }

    try {
      await createOwner(newOwner);
      toast.success('已新增所有權人');
      await fetchOwners();
      
      setIsAddingOwner(false);
      setNewOwner({
        name: '',
        idNumber: '',
        contactInfo: '',
        ownershipType: '單一所有權',
        ownershipRatio: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding owner:', error);
      toast.error('新增所有權人失敗');
    }
  };

  const handleDeleteOwner = async (id: string) => {
    try {
      await deleteOwner(id);
      toast.success('已刪除所有權人');
      await fetchOwners();
    } catch (error) {
      console.error('Error deleting owner:', error);
      toast.error('刪除所有權人失敗');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOwner({
      ...newOwner,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewOwner({
      ...newOwner,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">所有權人管理</h2>
        <Button onClick={() => setIsAddingOwner(true)} className="gap-1">
          <Plus size={16} />
          新增所有權人
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Search size={20} className="text-urban-600" />
            搜尋與篩選
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="owner-search">關鍵字搜尋</Label>
              <Input
                id="owner-search"
                placeholder="搜尋姓名、身分證字號或聯絡資訊"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ownership-type-filter">所有權類型</Label>
              <Select 
                value={filterOwnershipType} 
                onValueChange={(value) => setFilterOwnershipType(value || undefined)}
              >
                <SelectTrigger id="ownership-type-filter">
                  <SelectValue placeholder="全部類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部類型</SelectItem>
                  <SelectItem value="單一所有權">單一所有權</SelectItem>
                  <SelectItem value="共同持分">共同持分</SelectItem>
                  <SelectItem value="分別持分">分別持分</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAddingOwner && (
        <Card>
          <CardHeader>
            <CardTitle>新增所有權人</CardTitle>
            <CardDescription>
              填寫以下資訊以新增不動產所有權人資料
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  name="name"
                  value={newOwner.name}
                  onChange={handleInputChange}
                  placeholder="例：王大明"
                />
              </div>
              <div>
                <Label htmlFor="idNumber">身分證字號/統一編號</Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  value={newOwner.idNumber}
                  onChange={handleInputChange}
                  placeholder="例：A123456789"
                />
              </div>
              <div>
                <Label htmlFor="contactInfo">聯絡資訊</Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  value={newOwner.contactInfo}
                  onChange={handleInputChange}
                  placeholder="例：0912-345-678"
                />
              </div>
              <div>
                <Label htmlFor="ownershipType">所有權類型</Label>
                <Select 
                  value={newOwner.ownershipType} 
                  onValueChange={(value) => handleSelectChange('ownershipType', value as RealEstateOwner['ownershipType'])}
                >
                  <SelectTrigger id="ownershipType">
                    <SelectValue placeholder="選擇所有權類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="單一所有權">單一所有權</SelectItem>
                    <SelectItem value="共同持分">共同持分</SelectItem>
                    <SelectItem value="分別持分">分別持分</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(newOwner.ownershipType === '共同持分' || newOwner.ownershipType === '分別持分') && (
                <div>
                  <Label htmlFor="ownershipRatio">持分比例</Label>
                  <Input
                    id="ownershipRatio"
                    name="ownershipRatio"
                    value={newOwner.ownershipRatio}
                    onChange={handleInputChange}
                    placeholder="例：1/2 或 30%"
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <Label htmlFor="notes">備註</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={newOwner.notes}
                  onChange={handleInputChange}
                  placeholder="其他相關資訊"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingOwner(false)}>
              取消
            </Button>
            <Button onClick={handleAddOwner}>
              新增
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users size={20} className="text-urban-600" />
            所有權人清單
          </CardTitle>
          <CardDescription>
            管理都更會範圍內的不動產所有權人資料
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8 text-muted-foreground">正在載入資料...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>身分證字號/統一編號</TableHead>
                  <TableHead>聯絡資訊</TableHead>
                  <TableHead>所有權類型</TableHead>
                  <TableHead>持分比例</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.length > 0 ? (
                  filteredOwners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <UserCheck size={16} className="text-urban-600" />
                          {owner.name}
                        </div>
                      </TableCell>
                      <TableCell>{owner.idNumber}</TableCell>
                      <TableCell>{owner.contactInfo}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          owner.ownershipType === '單一所有權' ? 'bg-green-100 text-green-800' :
                          owner.ownershipType === '共同持分' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {owner.ownershipType}
                        </span>
                      </TableCell>
                      <TableCell>{owner.ownershipRatio || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
                            onClick={() => handleDeleteOwner(owner.id)}
                          >
                            <Trash size={14} />
                            <span className="sr-only">刪除</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      沒有找到符合條件的所有權人資料
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerManagement;
