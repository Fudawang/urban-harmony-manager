
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Hand, 
  Vote as VoteIcon, 
  UserCheck, 
  BarChart3,
  LandPlot,
  Building,
  Check,
  XIcon,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Proposal, 
  Vote, 
  toggleVoting, 
  recordVote, 
  getProposalVotes, 
  completeVoting 
} from '@/services/proposalService';
import { getMemberById } from '@/services/memberService';
import { Badge } from '@/components/ui/badge';

interface ProposalVotingProps {
  proposal: Proposal;
  onUpdate: (proposal: Proposal) => void;
}

const ProposalVoting: React.FC<ProposalVotingProps> = ({ proposal, onUpdate }) => {
  const [memberId, setMemberId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [votesList, setVotesList] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load votes on component mount and when proposal changes
  useEffect(() => {
    if (proposal.status === 'voting' || proposal.status === 'approved' || proposal.status === 'rejected') {
      loadVotes();
    }
  }, [proposal]);

  const loadVotes = async () => {
    setIsLoading(true);
    try {
      const votes = await getProposalVotes(proposal.id);
      setVotesList(votes);
    } catch (error) {
      console.error('Error loading votes:', error);
      toast.error('無法載入投票紀錄');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoting = async () => {
    setIsProcessing(true);
    try {
      const updatedProposal = await toggleVoting(proposal.id, !proposal.votingEnabled);
      onUpdate(updatedProposal);
      toast.success(updatedProposal.votingEnabled ? '議案投票已開始' : '議案投票已暫停');
      
      if (updatedProposal.votingEnabled) {
        await loadVotes();
      }
    } catch (error) {
      console.error('Error toggling voting:', error);
      toast.error('操作失敗，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteVoting = async () => {
    if (window.confirm('確定要結束此議案投票並計算結果嗎？')) {
      setIsProcessing(true);
      try {
        const updatedProposal = await completeVoting(proposal.id);
        onUpdate(updatedProposal);
        toast.success(`投票已結束，議案${updatedProposal.status === 'approved' ? '通過' : '未通過'}`);
      } catch (error) {
        console.error('Error completing voting:', error);
        toast.error('操作失敗，請稍後再試');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleVote = async (decision: 'approve' | 'reject' | 'abstain') => {
    if (!memberId.trim()) {
      toast.error('請輸入會員編號');
      return;
    }

    setIsProcessing(true);
    try {
      // Get member details
      const member = await getMemberById(memberId.replace(/^M/, ''));
      if (!member) {
        toast.error('找不到此會員編號');
        return;
      }

      // Record the vote
      await recordVote(proposal.id, {
        memberId: member.id,
        memberName: member.name,
        decision,
        landShare: member.landShare,
        buildingShare: member.buildingShare
      });

      // Update votes list and proposal stats
      toast.success(`${member.name} 投票成功`);
      await loadVotes();
      
      // Refresh proposal data to get updated vote counts
      const updatedProposal = { ...proposal };
      updatedProposal.votes.approved = votesList.filter(v => v.decision === 'approve').length + (decision === 'approve' ? 1 : 0);
      updatedProposal.votes.rejected = votesList.filter(v => v.decision === 'reject').length + (decision === 'reject' ? 1 : 0);
      updatedProposal.votes.abstained = votesList.filter(v => v.decision === 'abstain').length + (decision === 'abstain' ? 1 : 0);
      onUpdate(updatedProposal);
      
      setMemberId('');
    } catch (error: any) {
      console.error('Error recording vote:', error);
      toast.error(error.message || '投票失敗，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate voting percentages
  const approvePercent = proposal.votes.attended > 0 
    ? Math.round((proposal.votes.approved / proposal.votes.attended) * 100) 
    : 0;
  const rejectPercent = proposal.votes.attended > 0 
    ? Math.round((proposal.votes.rejected / proposal.votes.attended) * 100) 
    : 0;
  const abstainPercent = proposal.votes.attended > 0 
    ? Math.round((proposal.votes.abstained / proposal.votes.attended) * 100) 
    : 0;

  // Determine if the proposal meets the requirements to pass
  const meetsRequirements = () => {
    if (proposal.status !== 'approved' && proposal.status !== 'rejected') return null;
    
    if (proposal.type === 'normal') {
      // Normal proposals require simple majority
      return proposal.votes.approved > proposal.votes.attended / 2;
    } else {
      // Important proposals require majority of all members, land and building share
      const passesAttendance = proposal.votes.approved > proposal.votes.total / 2;
      const passesLandShare = proposal.votes.landShareApproved > 50;
      const passesBuildingShare = proposal.votes.buildingShareApproved > 50;
      return passesAttendance && passesLandShare && passesBuildingShare;
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (proposal.status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            已通過
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XIcon className="h-3 w-3 mr-1" />
            未通過
          </Badge>
        );
      case 'voting':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <VoteIcon className="h-3 w-3 mr-1" />
            投票中
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            待表決
          </Badge>
        );
    }
  };

  // Sort votes list by timestamp (newest first)
  const sortedVotes = [...votesList].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{proposal.title}</h2>
            {getStatusBadge()}
          </div>
          <p className="text-muted-foreground mt-1">{proposal.description}</p>
        </div>
        
        <div className="space-x-2">
          {(proposal.status === 'pending' || proposal.status === 'voting') && (
            <>
              <Button 
                variant={proposal.votingEnabled ? "destructive" : "default"} 
                onClick={handleToggleVoting}
                disabled={isProcessing}
              >
                {proposal.votingEnabled ? '暫停投票' : '開始投票'}
              </Button>
              
              {proposal.votingEnabled && (
                <Button
                  variant="outline"
                  onClick={handleCompleteVoting}
                  disabled={isProcessing}
                >
                  結束投票
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>會員投票</CardTitle>
              <CardDescription>
                {proposal.status === 'approved' 
                  ? '議案已通過，投票已結束' 
                  : proposal.status === 'rejected'
                  ? '議案未通過，投票已結束'
                  : proposal.votingEnabled 
                    ? '請輸入會員編號進行投票' 
                    : '投票尚未開始'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {proposal.votingEnabled && (
                <div className="space-y-4 mb-6">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="輸入會員編號"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      disabled={isProcessing || proposal.status === 'approved' || proposal.status === 'rejected'}
                      className="max-w-xs"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => handleVote('approve')} 
                      disabled={isProcessing || !proposal.votingEnabled}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      同意
                    </Button>
                    <Button 
                      onClick={() => handleVote('reject')} 
                      disabled={isProcessing || !proposal.votingEnabled}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      不同意
                    </Button>
                    <Button 
                      onClick={() => handleVote('abstain')} 
                      disabled={isProcessing || !proposal.votingEnabled}
                      variant="outline"
                    >
                      <Hand className="h-4 w-4 mr-2" />
                      棄權
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="border rounded-md">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <h3 className="font-medium">最近投票記錄</h3>
                  <span className="text-sm text-muted-foreground">
                    共 {votesList.length} 人
                  </span>
                </div>
                
                <div className="max-h-[400px] overflow-auto">
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      正在載入投票資料...
                    </div>
                  ) : sortedVotes.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-sm">會員編號</th>
                          <th className="text-left p-3 font-medium text-sm">姓名</th>
                          <th className="text-left p-3 font-medium text-sm">投票結果</th>
                          <th className="text-left p-3 font-medium text-sm">時間</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedVotes.map((vote) => (
                          <tr key={vote.id} className="border-t">
                            <td className="p-3">{vote.memberId}</td>
                            <td className="p-3">{vote.memberName}</td>
                            <td className="p-3">
                              {vote.decision === 'approve' && (
                                <span className="text-green-600 flex items-center">
                                  <ThumbsUp className="h-3 w-3 mr-1" /> 同意
                                </span>
                              )}
                              {vote.decision === 'reject' && (
                                <span className="text-red-600 flex items-center">
                                  <ThumbsDown className="h-3 w-3 mr-1" /> 不同意
                                </span>
                              )}
                              {vote.decision === 'abstain' && (
                                <span className="text-gray-500 flex items-center">
                                  <Hand className="h-3 w-3 mr-1" /> 棄權
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {new Date(vote.timestamp).toLocaleString('zh-TW', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      尚無投票紀錄
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>投票統計</CardTitle>
            <CardDescription>
              {proposal.status === 'approved' || proposal.status === 'rejected' 
                ? '最終投票結果' 
                : '即時投票統計數據'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1 text-green-600" />
                    同意票
                  </span>
                  <span className="font-medium">
                    {proposal.votes.approved}/{proposal.votes.attended}
                  </span>
                </div>
                <Progress className="h-2 bg-gray-100" value={approvePercent} indicatorClassName="bg-green-600" />
                <div className="text-xs text-right text-green-600">
                  {approvePercent}%
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <ThumbsDown className="h-4 w-4 mr-1 text-red-600" />
                    反對票
                  </span>
                  <span className="font-medium">
                    {proposal.votes.rejected}/{proposal.votes.attended}
                  </span>
                </div>
                <Progress className="h-2 bg-gray-100" value={rejectPercent} indicatorClassName="bg-red-600" />
                <div className="text-xs text-right text-red-600">
                  {rejectPercent}%
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Hand className="h-4 w-4 mr-1 text-gray-500" />
                    棄權票
                  </span>
                  <span className="font-medium">
                    {proposal.votes.abstained}/{proposal.votes.attended}
                  </span>
                </div>
                <Progress className="h-2 bg-gray-100" value={abstainPercent} indicatorClassName="bg-gray-500" />
                <div className="text-xs text-right text-gray-500">
                  {abstainPercent}%
                </div>
              </div>
            </div>
            
            {proposal.type === 'important' && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">重要議案通過門檻</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                      總會員同意
                    </span>
                    <span className="font-medium">
                      {proposal.votes.approved}/{proposal.votes.total}
                    </span>
                  </div>
                  <Progress 
                    className="h-2" 
                    value={(proposal.votes.approved / proposal.votes.total) * 100} 
                  />
                  <div className="text-xs text-right text-muted-foreground">
                    需超過 50%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <LandPlot className="h-4 w-4 mr-1 text-muted-foreground" />
                      土地持分同意
                    </span>
                    <span className="font-medium">
                      {proposal.votes.landShareApproved}%
                    </span>
                  </div>
                  <Progress 
                    className="h-2" 
                    value={proposal.votes.landShareApproved} 
                  />
                  <div className="text-xs text-right text-muted-foreground">
                    需超過 50%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                      建物持分同意
                    </span>
                    <span className="font-medium">
                      {proposal.votes.buildingShareApproved}%
                    </span>
                  </div>
                  <Progress 
                    className="h-2" 
                    value={proposal.votes.buildingShareApproved} 
                  />
                  <div className="text-xs text-right text-muted-foreground">
                    需超過 50%
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          {(proposal.status === 'approved' || proposal.status === 'rejected') && (
            <CardFooter className="bg-gray-50 border-t">
              <div className="w-full">
                {meetsRequirements() ? (
                  <div className="text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    議案已通過
                  </div>
                ) : (
                  <div className="text-red-600 flex items-center">
                    <XIcon className="h-4 w-4 mr-1" />
                    議案未通過
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {proposal.type === 'important' 
                    ? '重要議案需總會員、土地與建物持分皆過半同意' 
                    : '一般議案需出席會員過半同意'}
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProposalVoting;
