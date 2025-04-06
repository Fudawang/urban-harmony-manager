
// This is a mock service that simulates database operations
// In a real application, this would interact with an actual database

// Mock member data
let mockMembers = [
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

// Type for member
export type Member = {
  id: string;
  memberId: string;
  idNumber: string;
  name: string;
  city: string;
  district: string;
  section: string;
  subSection: string;
  landNumber: string;
  landShare: string;
  landArea: string;
  buildingNumber: string;
  buildingShare: string;
  buildingArea: string;
};

// Get all members
export const getAllMembers = async (): Promise<Member[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockMembers];
};

// Get member by ID
export const getMemberById = async (id: string): Promise<Member | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMembers.find(member => member.id === id);
};

// Create new member
export const createMember = async (memberData: Omit<Member, 'id'>): Promise<Member> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newMember = {
    ...memberData,
    id: String(Math.max(...mockMembers.map(m => Number(m.id))) + 1),
  };
  
  mockMembers.push(newMember);
  return newMember;
};

// Update member
export const updateMember = async (id: string, memberData: Omit<Member, 'id'>): Promise<Member> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockMembers.findIndex(member => member.id === id);
  if (index === -1) {
    throw new Error('會員不存在');
  }
  
  const updatedMember = {
    ...memberData,
    id,
  };
  
  mockMembers[index] = updatedMember;
  return updatedMember;
};

// Delete member
export const deleteMember = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockMembers.findIndex(member => member.id === id);
  if (index === -1) {
    throw new Error('會員不存在');
  }
  
  mockMembers.splice(index, 1);
};

// Search members
export const searchMembers = async (searchTerm: string, filter?: string): Promise<Member[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let results = mockMembers.filter(member => {
    const matchesSearch = 
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.landNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.buildingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!filter || filter === 'all') return matchesSearch;
    if (filter === 'section1') return matchesSearch && member.subSection === '一小段';
    if (filter === 'section2') return matchesSearch && member.subSection === '二小段';
    
    return matchesSearch;
  });
  
  return results;
};
