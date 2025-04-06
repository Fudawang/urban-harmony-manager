
import React, { useState } from 'react';
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

// Mock meeting data
const mockMeetings = [
  {
    id: '1',
    type: 'general',
    term: 1,
    number: 1,
    title: '第一屆第一次會員大會',
    date: '2022-05-15',
    location: '台北市中山區中山北路二段100號5樓會議室',
    status: 'completed',
    attendees: 87,
    totalMembers: 126,
    documents: 3,
  },
  {
    id: '2',
    type: 'board',
    term: 1,
    number: 1,
    title: '第一屆第一次理監事會議',
    date: '2022-06-10',
    location: '台北市中山區中山北路二段100號5樓會議室',
    status: 'completed',
    attendees: 15,
    totalMembers: 15,
    documents: 2,
  },
  {
    id: '3',
    type: 'general',
    term: 1,
    number: 2,
    title: '第一屆第二次會員大會',
    date: '2022-12-18',
    location: '台北市中山區中山北路二段100號5樓會議室',
    status: 'completed',
    attendees: 92,
    totalMembers: 126,
    documents: 4,
  },
  {
    id: '4',
    type: 'board',
    term: 1,
    number: 2,
    title: '第一屆第二次理監事會議',
    date: '2023-01-20',
    location: '台北市中山區中山北路二段100號5樓會議室',
    status: 'completed',
    attendees: 14,
    totalMembers: 15,
    documents: 3,
  },
  {
    id: '5',
    type: 'general',
    term: 2,
    number: 1,
    title: '第二屆第一次會員大會',
    date: '2023-06-20',
    location: '台北市中山區中山北路二段100號5樓會議室',
    status: 'completed',
    attendees: 95,
    totalMembers: 126,
    documents: 5,
  },
  {
    id: '6',
    type: 'board',
    term: 2,
    number: 1,
    title: '第二屆第一次理監事會議',
    date: '2023-07-15',
    location: '台北市中山區中山北路二段100號5樓會議室',
    status: 'completed',
    attendees: 15,
    totalMembers: 15,
    documents: 2,
  },
  {
    id: '7',
    type: 'general',
    term: 2,
    number: 2,
    title: '第二屆第二次會員大會',
    date: '2024-03-25',
    location: '台北市中山區中山北路二段100號5樓會議室',
    status: 'upcoming',
    attendees: 0,
    totalMembers: 126,
    documents: 1,
  },
];

const MeetingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter meetings based on search term and active tab
  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.date.includes(searchTerm) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'general') return matchesSearch && meeting.type === 'general';
    if (activeTab === 'board') return matchesSearch && meeting.type === 'board';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">會議管理</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button className="bg-urban-600 hover:bg-urban-700">
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
                {filteredMeetings.length > 0 ? (
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
                          <Button variant="ghost" size="icon" title="查看">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="編輯">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="刪除" className="text-destructive">
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
    </div>
  );
};

export default MeetingManagement;
