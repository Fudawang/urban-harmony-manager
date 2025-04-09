
// Proposal service with voting functionality

// Define Proposal type
export type Proposal = {
  id: string;
  meetingId: string;
  meetingTitle: string;
  number: string;
  title: string;
  type: 'important' | 'normal';
  description: string;
  status: 'pending' | 'voting' | 'approved' | 'rejected';
  votes: {
    total: number;
    attended: number;
    approved: number;
    rejected: number;
    abstained: number;
    landShareApproved: number;
    buildingShareApproved: number;
  };
  votingEnabled?: boolean;
};

// Define Vote type
export type Vote = {
  id: string;
  proposalId: string;
  memberId: string;
  memberName: string;
  decision: 'approve' | 'reject' | 'abstain';
  timestamp: string;
  landShare: string;
  buildingShare: string;
};

// Mock proposal data
let mockProposals: Proposal[] = [
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
    votingEnabled: false,
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
    votingEnabled: false,
  },
];

// Mock votes data
let mockVotes: Vote[] = [];

// Get all proposals
export const getAllProposals = async (): Promise<Proposal[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockProposals];
};

// Get proposals by meeting
export const getProposalsByMeeting = async (meetingId: string): Promise<Proposal[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProposals.filter(proposal => proposal.meetingId === meetingId);
};

// Get proposal by ID
export const getProposalById = async (id: string): Promise<Proposal | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProposals.find(proposal => proposal.id === id);
};

// Create new proposal
export const createProposal = async (proposalData: Omit<Proposal, 'id'>): Promise<Proposal> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newProposal = {
    ...proposalData,
    id: String(Math.max(...mockProposals.map(p => Number(p.id)), 0) + 1),
  };
  
  mockProposals.push(newProposal);
  return newProposal;
};

// Update proposal
export const updateProposal = async (id: string, proposalData: Omit<Proposal, 'id'>): Promise<Proposal> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockProposals.findIndex(proposal => proposal.id === id);
  if (index === -1) {
    throw new Error('議案不存在');
  }
  
  const updatedProposal = {
    ...proposalData,
    id,
  };
  
  mockProposals[index] = updatedProposal;
  return updatedProposal;
};

// Delete proposal
export const deleteProposal = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockProposals.findIndex(proposal => proposal.id === id);
  if (index === -1) {
    throw new Error('議案不存在');
  }
  
  mockProposals.splice(index, 1);
};

// Toggle voting for a proposal
export const toggleVoting = async (proposalId: string, enabled: boolean): Promise<Proposal> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const proposalIndex = mockProposals.findIndex(p => p.id === proposalId);
  if (proposalIndex === -1) {
    throw new Error('議案不存在');
  }
  
  const updatedProposal = {
    ...mockProposals[proposalIndex],
    votingEnabled: enabled,
    status: enabled ? 'voting' : mockProposals[proposalIndex].status,
  };
  
  mockProposals[proposalIndex] = updatedProposal;
  return updatedProposal;
};

// Record a vote
export const recordVote = async (proposalId: string, voteData: {
  memberId: string,
  memberName: string,
  decision: 'approve' | 'reject' | 'abstain',
  landShare: string,
  buildingShare: string
}): Promise<Vote> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if the proposal exists and voting is enabled
  const proposalIndex = mockProposals.findIndex(p => p.id === proposalId);
  if (proposalIndex === -1) {
    throw new Error('議案不存在');
  }
  
  if (mockProposals[proposalIndex].status !== 'voting' || !mockProposals[proposalIndex].votingEnabled) {
    throw new Error('議案尚未開始投票');
  }
  
  // Check if member has already voted
  const existingVote = mockVotes.find(v => v.proposalId === proposalId && v.memberId === voteData.memberId);
  if (existingVote) {
    throw new Error('會員已投票');
  }
  
  // Create vote record
  const newVote: Vote = {
    id: String(Date.now()),
    proposalId,
    memberId: voteData.memberId,
    memberName: voteData.memberName,
    decision: voteData.decision,
    timestamp: new Date().toISOString(),
    landShare: voteData.landShare,
    buildingShare: voteData.buildingShare,
  };
  
  mockVotes.push(newVote);
  
  // Update proposal vote stats
  const proposalVotes = mockVotes.filter(v => v.proposalId === proposalId);
  const approvedVotes = proposalVotes.filter(v => v.decision === 'approve');
  const rejectedVotes = proposalVotes.filter(v => v.decision === 'reject');
  const abstainedVotes = proposalVotes.filter(v => v.decision === 'abstain');
  
  // Calculate share percentages
  const landSharesApproved = approvedVotes.map(v => parseFloat(v.landShare.replace('%', '')));
  const buildingSharesApproved = approvedVotes.map(v => parseFloat(v.buildingShare.replace('%', '')));
  
  const landSharePercentageApproved = landSharesApproved.reduce((sum, share) => sum + share, 0);
  const buildingSharePercentageApproved = buildingSharesApproved.reduce((sum, share) => sum + share, 0);
  
  mockProposals[proposalIndex] = {
    ...mockProposals[proposalIndex],
    votes: {
      total: mockProposals[proposalIndex].votes.total,
      attended: mockProposals[proposalIndex].votes.attended,
      approved: approvedVotes.length,
      rejected: rejectedVotes.length,
      abstained: abstainedVotes.length,
      landShareApproved: parseFloat(landSharePercentageApproved.toFixed(1)),
      buildingShareApproved: parseFloat(buildingSharePercentageApproved.toFixed(1)),
    }
  };
  
  return newVote;
};

// Get votes for a proposal
export const getProposalVotes = async (proposalId: string): Promise<Vote[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockVotes.filter(v => v.proposalId === proposalId);
};

// Complete voting for a proposal
export const completeVoting = async (proposalId: string): Promise<Proposal> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const proposalIndex = mockProposals.findIndex(p => p.id === proposalId);
  if (proposalIndex === -1) {
    throw new Error('議案不存在');
  }
  
  const proposal = mockProposals[proposalIndex];
  const votes = proposal.votes;
  
  // Determine result based on proposal type
  let result: 'approved' | 'rejected';
  if (proposal.type === 'normal') {
    // Normal proposals require simple majority of attendees
    result = votes.approved > votes.attended / 2 ? 'approved' : 'rejected';
  } else {
    // Important proposals require majority of total members, land and building share
    const passesAttendance = votes.approved > votes.total / 2;
    const passesLandShare = votes.landShareApproved > 50;
    const passesBuildingShare = votes.buildingShareApproved > 50;
    result = (passesAttendance && passesLandShare && passesBuildingShare) ? 'approved' : 'rejected';
  }
  
  const updatedProposal = {
    ...proposal,
    status: result,
    votingEnabled: false,
  };
  
  mockProposals[proposalIndex] = updatedProposal;
  return updatedProposal;
};

// Search proposals
export const searchProposals = async (
  searchTerm: string,
  filter: {
    type?: string,
    status?: string,
    meetingId?: string
  } = {}
): Promise<Proposal[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockProposals.filter(proposal => {
    // Search term matching
    const matchesSearch = searchTerm === '' || 
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter matching
    const matchesType = !filter.type || filter.type === 'all' || proposal.type === filter.type;
    const matchesStatus = !filter.status || filter.status === 'all' || proposal.status === filter.status;
    const matchesMeeting = !filter.meetingId || proposal.meetingId === filter.meetingId;
    
    return matchesSearch && matchesType && matchesStatus && matchesMeeting;
  });
};
