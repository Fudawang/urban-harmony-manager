
// Mock board service

// Define BoardMember type
export type BoardMember = {
  id: string;
  term: number;
  name: string;
  position: string;
  title: string;
  contact: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  memberId: string; // Reference to the association member
};

// Mock board data
let mockBoardMembers: BoardMember[] = [
  {
    id: '1',
    term: 2,
    name: '王大明',
    position: 'chair',
    title: '理事長',
    contact: '0912-345-678',
    startDate: '2023-06-20',
    endDate: '2025-06-19',
    isActive: true,
    memberId: 'M000001',
  },
  {
    id: '2',
    term: 2,
    name: '李小芳',
    position: 'vice-chair',
    title: '副理事長',
    contact: '0923-456-789',
    startDate: '2023-06-20',
    endDate: '2025-06-19',
    isActive: true,
    memberId: 'M000002',
  },
  {
    id: '3',
    term: 2,
    name: '張文華',
    position: 'supervisor-chair',
    title: '監事長',
    contact: '0934-567-890',
    startDate: '2023-06-20',
    endDate: '2025-06-19',
    isActive: true,
    memberId: 'M000003',
  },
  {
    id: '4',
    term: 2,
    name: '陳建國',
    position: 'director',
    title: '理事',
    contact: '0945-678-901',
    startDate: '2023-06-20',
    endDate: '2025-06-19',
    isActive: true,
    memberId: 'M000004',
  },
  {
    id: '5',
    term: 2,
    name: '林美玲',
    position: 'director',
    title: '理事',
    contact: '0956-789-012',
    startDate: '2023-06-20',
    endDate: '2025-06-19',
    isActive: true,
    memberId: 'M000005',
  },
  {
    id: '6',
    term: 2,
    name: '黃志明',
    position: 'supervisor',
    title: '監事',
    contact: '0967-890-123',
    startDate: '2023-06-20',
    endDate: '2025-06-19',
    isActive: true,
    memberId: 'M000006',
  },
  {
    id: '7',
    term: 1,
    name: '王大明',
    position: 'chair',
    title: '理事長',
    contact: '0912-345-678',
    startDate: '2020-05-15',
    endDate: '2022-05-14',
    isActive: false,
    memberId: 'M000001',
  },
  {
    id: '8',
    term: 1,
    name: '李小芳',
    position: 'supervisor-chair',
    title: '監事長',
    contact: '0923-456-789',
    startDate: '2020-05-15',
    endDate: '2022-05-14',
    isActive: false,
    memberId: 'M000002',
  },
];

// Get all board members
export const getAllBoardMembers = async (): Promise<BoardMember[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockBoardMembers];
};

// Get board members by term
export const getBoardMembersByTerm = async (term: number): Promise<BoardMember[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockBoardMembers.filter(member => member.term === term);
};

// Get active board members
export const getActiveBoardMembers = async (): Promise<BoardMember[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockBoardMembers.filter(member => member.isActive);
};

// Get board terms
export const getBoardTerms = async (): Promise<number[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const terms = [...new Set(mockBoardMembers.map(member => member.term))];
  return terms.sort((a, b) => b - a); // Sort in descending order (latest first)
};

// Get board member by ID
export const getBoardMemberById = async (id: string): Promise<BoardMember | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockBoardMembers.find(member => member.id === id);
};

// Create new board member
export const createBoardMember = async (boardMemberData: Omit<BoardMember, 'id'>): Promise<BoardMember> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newBoardMember = {
    ...boardMemberData,
    id: String(Math.max(...mockBoardMembers.map(m => Number(m.id))) + 1),
  };
  
  mockBoardMembers.push(newBoardMember);
  return newBoardMember;
};

// Update board member
export const updateBoardMember = async (id: string, boardMemberData: Omit<BoardMember, 'id'>): Promise<BoardMember> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockBoardMembers.findIndex(member => member.id === id);
  if (index === -1) {
    throw new Error('理監事不存在');
  }
  
  const updatedBoardMember = {
    ...boardMemberData,
    id,
  };
  
  mockBoardMembers[index] = updatedBoardMember;
  return updatedBoardMember;
};

// Delete board member
export const deleteBoardMember = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockBoardMembers.findIndex(member => member.id === id);
  if (index === -1) {
    throw new Error('理監事不存在');
  }
  
  mockBoardMembers.splice(index, 1);
};

// Change active term
export const changeActiveTerm = async (term: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Set all board members to inactive
  mockBoardMembers = mockBoardMembers.map(member => ({
    ...member,
    isActive: false,
  }));
  
  // Set board members of the specified term to active
  mockBoardMembers = mockBoardMembers.map(member => ({
    ...member,
    isActive: member.term === term ? true : false,
  }));
};
