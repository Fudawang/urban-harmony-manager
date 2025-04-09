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
  SlidersHorizontal
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from 'sonner';

import MemberFormDialog from './member/MemberFormDialog';
import DeleteMemberDialog from './member/DeleteMemberDialog';
import { 
  Member,
  PaginatedResponse,
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

// Interface for filter options
interface FilterOptions {
  city?: string;
  district?: string;
  section?: string;
}

const MemberManagement: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  
  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch members on component mount and when pagination, search, or tab changes
  useEffect(() => {
    fetchMembers();
  }, [currentPage, activeTab, searchTerm]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      let response: PaginatedResponse<Member>;
      
      if (searchTerm === '' && activeTab === 'all') {
        response = await getAllMembers(currentPage, pageSize);
      } else {
        // Convert activeTab to proper filter object
        const filter: FilterOptions = { ...filterOptions };
        if (activeTab === 'section1') {
          filter.section = '一小段';
        } else if (activeTab === 'section2') {
          filter.section = '二小段';
        }
        
        response = await searchMembers(searchTerm, filter, currentPage, pageSize);
      }
      
      setMembers(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('無法載入會員資料');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (data: Omit<Member, 'id'>) => {
    try {
      await createMember(data);
      toast.success('會員已成功新增');
      setCurrentPage(1); // Reset to first page after adding
      await fetchMembers();
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
      toast.success('會員資料已更新');
      await fetchMembers();
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
      toast.success('會員已成功刪除');
      await fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('刪除會員失敗');
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page when tab changes
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

  // Generate pagination links
  const renderPaginationLinks = () => {
    const links = [];
    const maxDisplayedPages = 5; // Maximum number of page links to display
    
    let startPage: number;
    let endPage: number;
    
    if (totalPages <= maxDisplayedPages) {
      // If total pages are less than max, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(maxDisplayedPages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxDisplayedPages / 2) - 1;
      
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // Current page near the start
        startPage = 1;
        endPage = maxDisplayedPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // Current page near the end
        startPage = totalPages - maxDisplayedPages + 1;
        endPage = totalPages;
      } else {
        // Current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
    
    // Add first page with ellipsis if needed
    if (startPage > 1) {
      links.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        links.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Add numbered page links
    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add last page with ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        links.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      links.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return links;
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
                placeholder="搜尋會員編號、姓名、地址..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    進階篩選
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>依縣市篩選</DropdownMenuItem>
                  <DropdownMenuItem>依區域篩選</DropdownMenuItem>
                  <DropdownMenuItem>依持分比例篩選</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="text-sm text-muted-foreground">
                總計 {totalItems} 筆資料
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6" onValueChange={handleTabChange}>
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
                  <TableHead>地址</TableHead>
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
                    <TableCell colSpan={8} className="text-center h-24">
                      正在載入會員資料...
                    </TableCell>
                  </TableRow>
                ) : members.length > 0 ? (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.memberId}</TableCell>
                      <TableCell>{formatName(member.name)}</TableCell>
                      <TableCell>{`${member.city}${member.district}`}</TableCell>
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
                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                      沒有找到符合條件的會員資料
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {!isLoading && totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {renderPaginationLinks()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
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
        readonly={true}
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
