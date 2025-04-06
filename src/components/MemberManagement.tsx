
import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

import MemberFormDialog from './member/MemberFormDialog';
import DeleteMemberDialog from './member/DeleteMemberDialog';
import { 
  Member,
  getAllMembers, 
  createMember, 
  updateMember, 
  deleteMember, 
  searchMembers 
} from '@/services/memberService';

// Format member ID card number for privacy
const formatIdNumber = (idNumber: string) => {
  return `******${idNumber.slice(-4)}`;
};

// Format member name for privacy
const formatName = (name: string) => {
  return `${name.charAt(0)}**`;
};

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members when search term or active tab changes
  useEffect(() => {
    filterMembers();
  }, [searchTerm, activeTab, members]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('無法載入會員資料');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = async () => {
    try {
      if (searchTerm === '') {
        // If no search term, filter only by tab
        let results = members;
        if (activeTab === 'section1') {
          results = members.filter(member => member.subSection === '一小段');
        } else if (activeTab === 'section2') {
          results = members.filter(member => member.subSection === '二小段');
        }
        setFilteredMembers(results);
      } else {
        // If search term exists, use search function
        const results = await searchMembers(searchTerm, activeTab);
        setFilteredMembers(results);
      }
    } catch (error) {
      console.error('Error filtering members:', error);
    }
  };

  const handleAddMember = async (data: Omit<Member, 'id'>) => {
    try {
      await createMember(data);
      await fetchMembers();
      toast.success('會員已成功新增');
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('新增會員失敗');
      throw error;
    }
  };

  const handleEditMember = async (data: Omit<Member, 'id'>) => {
    if (!selectedMember) return;
    try {
      await updateMember(selectedMember.id, data);
      await fetchMembers();
      toast.success('會員資料已更新');
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('更新會員資料失敗');
      throw error;
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    try {
      await deleteMember(selectedMember.id);
      await fetchMembers();
      toast.success('會員已成功刪除');
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('刪除會員失敗');
      throw error;
    }
  };

  const openEditDialog = (member: Member) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (member: Member) => {
    setSelectedMember(member);
    setIsViewDialogOpen(true);
  };

  const handleExport = () => {
    toast.info('匯出功能開發中');
  };

  const handleImport = () => {
    toast.info('匯入功能開發中');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">會員管理</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button className="bg-urban-600 hover:bg-urban-700" onClick={() => setIsAddDialogOpen(true)}>
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
              <DropdownMenuItem onClick={handleExport}>
                <FileText className="h-4 w-4 mr-2" />
                匯出 PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <FileText className="h-4 w-4 mr-2" />
                匯出 Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" onClick={handleImport}>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      正在載入會員資料...
                    </TableCell>
                  </TableRow>
                ) : filteredMembers.length > 0 ? (
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
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openViewDialog(member)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => openDeleteDialog(member)}
                          >
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
      
      {/* Add Member Dialog */}
      <MemberFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddMember}
      />
      
      {/* Edit Member Dialog */}
      <MemberFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        member={selectedMember}
        onSubmit={handleEditMember}
      />
      
      {/* View Member Dialog is the same form but readonly */}
      <MemberFormDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        member={selectedMember}
        onSubmit={async () => {}}
      />
      
      {/* Delete Member Dialog */}
      {selectedMember && (
        <DeleteMemberDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteMember}
          memberName={selectedMember.name}
        />
      )}
    </div>
  );
};

export default MemberManagement;
