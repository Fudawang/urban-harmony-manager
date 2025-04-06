
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Download, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  Filter
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock member data
const mockMembers = [
  {
    id: '1',
    memberId: 'M001',
    idNumber: 'A123456789',
    name: '王大明',
    city: '台北市',
    district: '中山區',
    section: '中山段',
    subSection: '一小段',
    landNumber: '123-4',
    landShare: '1/4',
    landArea: '120.5',
    buildingNumber: 'B-567',
    buildingShare: '1/4',
    buildingArea: '85.3',
  },
  {
    id: '2',
    memberId: 'M002',
    idNumber: 'B234567890',
    name: '李小華',
    city: '台北市',
    district: '中山區',
    section: '中山段',
    subSection: '一小段',
    landNumber: '123-5',
    landShare: '1/4',
    landArea: '125.8',
    buildingNumber: 'B-568',
    buildingShare: '1/4',
    buildingArea: '90.2',
  },
  {
    id: '3',
    memberId: 'M003',
    idNumber: 'C345678901',
    name: '張美玲',
    city: '台北市',
    district: '中山區',
    section: '中山段',
    subSection: '一小段',
    landNumber: '124-1',
    landShare: '1/2',
    landArea: '200.3',
    buildingNumber: 'B-570',
    buildingShare: '1/2',
    buildingArea: '150.7',
  },
  {
    id: '4',
    memberId: 'M004',
    idNumber: 'D456789012',
    name: '陳志明',
    city: '台北市',
    district: '中山區',
    section: '中山段',
    subSection: '二小段',
    landNumber: '235-2',
    landShare: '1/1',
    landArea: '320.1',
    buildingNumber: 'B-612',
    buildingShare: '1/1',
    buildingArea: '275.4',
  },
  {
    id: '5',
    memberId: 'M005',
    idNumber: 'E567890123',
    name: '林雅芳',
    city: '台北市',
    district: '中山區',
    section: '中山段',
    subSection: '二小段',
    landNumber: '236-3',
    landShare: '1/3',
    landArea: '110.5',
    buildingNumber: 'B-615',
    buildingShare: '1/3',
    buildingArea: '75.8',
  },
];

// Format member ID card number for privacy
const formatIdNumber = (idNumber: string) => {
  return `******${idNumber.slice(-4)}`;
};

// Format member name for privacy
const formatName = (name: string) => {
  return `${name.charAt(0)}**`;
};

const MemberManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter members based on search term and active tab
  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = 
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.landNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.buildingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'section1') return matchesSearch && member.subSection === '一小段';
    if (activeTab === 'section2') return matchesSearch && member.subSection === '二小段';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">會員管理</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button className="bg-urban-600 hover:bg-urban-700">
            <Plus className="h-4 w-4 mr-2" />
            新增會員
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                匯出
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                匯出 PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                匯出 Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            匯入資料
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>會員資料</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋會員編號、姓名、地號..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                篩選
              </Button>
              <div className="text-sm text-muted-foreground">
                總計 {filteredMembers.length} 筆資料
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="section1">一小段</TabsTrigger>
              <TabsTrigger value="section2">二小段</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">會員編號</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>地號</TableHead>
                  <TableHead>土地持分</TableHead>
                  <TableHead>建號</TableHead>
                  <TableHead>建物持分</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.memberId}</TableCell>
                      <TableCell>{formatName(member.name)}</TableCell>
                      <TableCell>{member.landNumber}</TableCell>
                      <TableCell>{member.landShare}</TableCell>
                      <TableCell>{member.buildingNumber}</TableCell>
                      <TableCell>{member.buildingShare}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      沒有找到符合條件的會員資料
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberManagement;
