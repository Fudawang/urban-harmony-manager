
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Vote,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock proposal data
const mockProposals = [
  {
    id: '1',
    meetingId: '5',
    meetingTitle: '第二屆第一次會員大會',
    number: 'P001',
    title: '審議通過本會章程修正案',
    type: 'important',
    description: '因應法規變更，修正本會章程第5條、第8條及第12條條文',
    status: 'approved',
    votes: {
      total: 126,
      attended: 95,
      approved: 86,
      rejected: 5,
      abstained: 4,
      landShareApproved: 67,
      buildingShareApproved: 72,
    },
  },
  {
    id: '2',
    meetingId: '5',
    meetingTitle: '第二屆第一次會員大會',
    number: 'P002',
    title: '審議107年度財務報表',
    type: 'normal',
    description: '審議及核可本會107年度財務收支決算報表',
    status: 'approved',
    votes: {
      total: 126,
      attended: 95,
      approved: 90,
      rejected: 2,
      abstained: 3,
      landShareApproved: 0,
      buildingShareApproved: 0,
    },
  },
  {
    id: '3',
    meetingId: '5',
    meetingTitle: '第二屆第一次會員大會',
    number: 'P003',
    title: '審議108年度工作計畫',
    type: 'normal',
    description: '審議及核可本會108年度工作計畫及預算',
    status: 'approved',
    votes: {
      total: 126,
      attended: 95,
      approved: 88,
      rejected: 4,
      abstained: 3,
      landShareApproved: 0,
      buildingShareApproved: 0,
    },
  },
  {
    id: '4',
    meetingId: '3',
    meetingTitle: '第一屆第二次會員大會',
    number: 'P004',
    title: '審議本更新重建計畫細部設計',
    type: 'important',
    description: '審議通過本更新重建計畫建築設計及細部規劃方案',
    status: 'rejected',
    votes: {
      total: 126,
      attended: 92,
      approved: 48,
      rejected: 40,
      abstained: 4,
      landShareApproved: 42,
      buildingShareApproved: 45,
    },
  },
  {
    id: '5',
    meetingId: '7',
    meetingTitle: '第二屆第二次會員大會',
    number: 'P005',
    title: '審議都市更新事業計畫修正案',
    type: 'important',
    description: '依市府審查意見修正都市更新事業計畫',
    status: 'pending',
    votes: {
      total: 126,
      attended: 0,
      approved: 0,
      rejected: 0,
      abstained: 0,
      landShareApproved: 0,
      buildingShareApproved: 0,
    },
  },
  {
    id: '6',
    meetingId: '7',
    meetingTitle: '第二屆第二次會員大會',
    number: 'P006',
    title: '審議109年度財務報表',
    type: 'normal',
    description: '審議及核可本會109年度財務收支決算報表',
    status: 'pending',
    votes: {
      total: 126,
      attended: 0,
      approved: 0,
      rejected: 0,
      abstained: 0,
      landShareApproved: 0,
      buildingShareApproved: 0,
    },
  },
];

// Format proposal status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          已通過
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          未通過
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          待表決
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          {status}
        </Badge>
      );
  }
};

const ProposalManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter proposals based on search term and active tab
  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = 
      proposal.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'important') return matchesSearch && proposal.type === 'important';
    if (activeTab === 'normal') return matchesSearch && proposal.type === 'normal';
    if (activeTab === 'approved') return matchesSearch && proposal.status === 'approved';
    if (activeTab === 'rejected') return matchesSearch && proposal.status === 'rejected';
    if (activeTab === 'pending') return matchesSearch && proposal.status === 'pending';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">議案管理</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button className="bg-urban-600 hover:bg-urban-700">
            <Plus className="h-4 w-4 mr-2" />
            新增議案
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
          <CardTitle>議案資料</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋議案編號、標題、說明..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              總計 {filteredProposals.length} 筆資料
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">全部議案</TabsTrigger>
              <TabsTrigger value="important">重要議案</TabsTrigger>
              <TabsTrigger value="normal">一般議案</TabsTrigger>
              <TabsTrigger value="approved">已通過</TabsTrigger>
              <TabsTrigger value="rejected">未通過</TabsTrigger>
              <TabsTrigger value="pending">待表決</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">議案編號</TableHead>
                  <TableHead>議案名稱</TableHead>
                  <TableHead>議案類型</TableHead>
                  <TableHead>所屬會議</TableHead>
                  <TableHead>表決結果</TableHead>
                  <TableHead>表決狀況</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.length > 0 ? (
                  filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{proposal.number}</TableCell>
                      <TableCell>
                        <div>{proposal.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {proposal.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {proposal.type === 'important' ? (
                          <Badge variant="default" className="bg-amber-500">重要議案</Badge>
                        ) : (
                          <Badge variant="outline">一般議案</Badge>
                        )}
                      </TableCell>
                      <TableCell>{proposal.meetingTitle}</TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell>
                        {proposal.status !== 'pending' ? (
                          <div className="space-y-2 max-w-[180px]">
                            <div className="flex justify-between text-xs">
                              <span>同意票</span>
                              <span className="font-medium">
                                {proposal.votes.approved}/{proposal.votes.attended}
                                <span className="text-muted-foreground ml-1">
                                  ({Math.round((proposal.votes.approved / proposal.votes.attended) * 100)}%)
                                </span>
                              </span>
                            </div>
                            <Progress className="h-2" value={(proposal.votes.approved / proposal.votes.attended) * 100} />
                            
                            {proposal.type === 'important' && (
                              <>
                                <div className="flex justify-between text-xs">
                                  <span>土地持分同意</span>
                                  <span className="font-medium">
                                    {proposal.votes.landShareApproved}%
                                  </span>
                                </div>
                                <Progress 
                                  className="h-2" 
                                  value={proposal.votes.landShareApproved} 
                                  indicator={proposal.votes.landShareApproved >= 50 ? 'bg-green-500' : 'bg-orange-500'} 
                                />
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">尚未開始投票</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {proposal.status === 'pending' && (
                            <Button variant="ghost" size="icon" title="開始投票">
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
                      沒有找到符合條件的議案資料
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

export default ProposalManagement;
