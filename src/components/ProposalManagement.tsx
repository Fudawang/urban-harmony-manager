
import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

import { 
  Proposal, 
  getAllProposals, 
  getProposalById,
  searchProposals
} from '@/services/proposalService';
import ProposalVoting from './proposal/ProposalVoting';

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
    case 'voting':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Vote className="h-3 w-3 mr-1" />
          投票中
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
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
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Selected proposal for voting
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isVotingMode, setIsVotingMode] = useState(false);
  
  // Load proposals on component mount
  useEffect(() => {
    fetchProposals();
  }, []);
  
  // Filter proposals when search term or active tab changes
  useEffect(() => {
    filterProposals();
  }, [searchTerm, activeTab, proposals]);
  
  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const data = await getAllProposals();
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('無法載入議案資料');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterProposals = async () => {
    try {
      let filter: { type?: string, status?: string } = {};
      
      if (activeTab === 'important') filter.type = 'important';
      if (activeTab === 'normal') filter.type = 'normal';
      if (activeTab === 'approved') filter.status = 'approved';
      if (activeTab === 'rejected') filter.status = 'rejected';
      if (activeTab === 'pending') filter.status = 'pending';
      if (activeTab === 'voting') filter.status = 'voting';
      
      const results = await searchProposals(searchTerm, filter);
      setFilteredProposals(results);
    } catch (error) {
      console.error('Error filtering proposals:', error);
    }
  };
  
  const handleUpdateProposal = (updatedProposal: Proposal) => {
    setProposals(proposals.map(p => p.id === updatedProposal.id ? updatedProposal : p));
    setSelectedProposal(updatedProposal);
  };
  
  const handleOpenVoting = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsVotingMode(true);
  };
  
  const handleExport = () => {
    toast.info('匯出功能開發中');
  };

  return (
    <div className="space-y-6">
      {!isVotingMode ? (
        <>
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
                  <TabsTrigger value="voting">投票中</TabsTrigger>
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                          正在載入議案資料...
                        </TableCell>
                      </TableRow>
                    ) : filteredProposals.length > 0 ? (
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
                                    {proposal.votes.approved}/{proposal.votes.attended > 0 ? proposal.votes.attended : proposal.votes.total}
                                    {proposal.votes.attended > 0 && (
                                      <span className="text-muted-foreground ml-1">
                                        ({Math.round((proposal.votes.approved / proposal.votes.attended) * 100)}%)
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <Progress 
                                  className="h-2" 
                                  value={proposal.votes.attended > 0 
                                    ? (proposal.votes.approved / proposal.votes.attended) * 100 
                                    : 0
                                  } 
                                />
                                
                                {proposal.type === 'important' && (
                                  <>
                                    <div className="flex justify-between text-xs">
                                      <span>土地持分同意</span>
                                      <span className="font-medium">
                                        {proposal.votes.landShareApproved}%
                                      </span>
                                    </div>
                                    <Progress 
                                      className="h-2 bg-secondary" 
                                      value={proposal.votes.landShareApproved} 
                                    />
                                    <div className="flex justify-between text-xs">
                                      <span>建物持分同意</span>
                                      <span className="font-medium">
                                        {proposal.votes.buildingShareApproved}%
                                      </span>
                                    </div>
                                    <Progress 
                                      className="h-2 bg-secondary" 
                                      value={proposal.votes.buildingShareApproved} 
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
                              {(proposal.status === 'pending' || proposal.status === 'voting') && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="議案投票"
                                  onClick={() => handleOpenVoting(proposal)}
                                >
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
        </>
      ) : (
        /* Proposal Voting Interface */
        <>
          <Button 
            variant="outline" 
            onClick={() => setIsVotingMode(false)}
            className="mb-4"
          >
            返回議案列表
          </Button>
          
          {selectedProposal && (
            <ProposalVoting 
              proposal={selectedProposal}
              onUpdate={handleUpdateProposal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProposalManagement;
