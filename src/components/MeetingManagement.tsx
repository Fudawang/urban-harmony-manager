
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Download, 
  FileText,
  CheckCircle2,
  Users,
  Vote
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import MeetingFormDialog from './meeting/MeetingFormDialog';
import DeleteMeetingDialog from './meeting/DeleteMeetingDialog';
import { 
  Meeting,
  getAllMeetings, 
  createMeeting, 
  updateMeeting, 
  deleteMeeting, 
  searchMeetings 
} from '@/services/meetingService';

const MeetingManagement: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>(undefined);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch meetings on component mount
  useEffect(() => {
    fetchMeetings();
  }, []);

  // Filter meetings when search term or active tab changes
  useEffect(() => {
    filterMeetings();
  }, [searchTerm, activeTab, meetings]);

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMeetings();
      setMeetings(data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('無法載入會議資料');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMeetings = async () => {
    try {
      if (searchTerm === '') {
        // If no search term, filter only by tab
        let results = meetings;
        if (activeTab === 'general') {
          results = meetings.filter(meeting => meeting.type === 'general');
        } else if (activeTab === 'board') {
          results = meetings.filter(meeting => meeting.type === 'board');
        }
        setFilteredMeetings(results);
      } else {
        // If search term exists, use search function
        const results = await searchMeetings(searchTerm, activeTab);
        setFilteredMeetings(results);
      }
    } catch (error) {
      console.error('Error filtering meetings:', error);
    }
  };

  const handleAddMeeting = async (data: Omit<Meeting, 'id'>) => {
    try {
      await createMeeting(data);
      await fetchMeetings();
      toast.success('會議已成功新增');
    } catch (error) {
      console.error('Error adding meeting:', error);
      toast.error('新增會議失敗');
      throw error;
    }
  };

  const handleEditMeeting = async (data: Omit<Meeting, 'id'>) => {
    if (!selectedMeeting) return;
    try {
      await updateMeeting(selectedMeeting.id, data);
      await fetchMeetings();
      toast.success('會議資料已更新');
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast.error('更新會議資料失敗');
      throw error;
    }
  };

  const handleDeleteMeeting = async () => {
    if (!selectedMeeting) return;
    try {
      await deleteMeeting(selectedMeeting.id);
      await fetchMeetings();
      toast.success('會議已成功刪除');
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error('刪除會議失敗');
      throw error;
    }
  };

  const openEditDialog = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsViewDialogOpen(true);
  };

  const handleExport = () => {
    toast.info('匯出功能開發中');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">會議管理</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button className="bg-urban-600 hover:bg-urban-700" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增會議
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
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>會議紀錄</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋會議標題、日期、地點..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              總計 {filteredMeetings.length} 筆資料
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">全部會議</TabsTrigger>
              <TabsTrigger value="general">會員大會</TabsTrigger>
              <TabsTrigger value="board">理監事會議</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>會議名稱</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>地點</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>出席率</TableHead>
                  <TableHead>文件</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      正在載入會議資料...
                    </TableCell>
                  </TableRow>
                ) : filteredMeetings.length > 0 ? (
                  filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        <div>{meeting.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {meeting.type === 'general' ? '會員大會' : '理監事會議'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(meeting.date), 'yyyy/MM/dd')}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {meeting.location}
                      </TableCell>
                      <TableCell>
                        {meeting.status === 'completed' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            已完成
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            即將舉行
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {meeting.attendees}/{meeting.totalMembers}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({Math.round((meeting.attendees / meeting.totalMembers) * 100)}%)
                            </span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          {meeting.documents}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {meeting.status === 'upcoming' && (
                            <Button variant="ghost" size="icon" title="會員報到">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          {meeting.type === 'general' && (
                            <Button variant="ghost" size="icon" title="議案投票">
                              <Vote className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="查看"
                            onClick={() => openViewDialog(meeting)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="編輯"
                            onClick={() => openEditDialog(meeting)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="刪除" 
                            className="text-destructive"
                            onClick={() => openDeleteDialog(meeting)}
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
                      沒有找到符合條件的會議紀錄
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Meeting Dialog */}
      <MeetingFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddMeeting}
      />
      
      {/* Edit Meeting Dialog */}
      <MeetingFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        meeting={selectedMeeting}
        onSubmit={handleEditMeeting}
      />
      
      {/* View Meeting Dialog is the same form but readonly */}
      {selectedMeeting && (
        <MeetingFormDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          meeting={selectedMeeting}
          onSubmit={async () => {}}
        />
      )}
      
      {/* Delete Meeting Dialog */}
      {selectedMeeting && (
        <DeleteMeetingDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteMeeting}
          meetingTitle={selectedMeeting.title}
        />
      )}
    </div>
  );
};

export default MeetingManagement;
