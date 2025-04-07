
// This is a mock service that simulates database operations
// In a real application, this would interact with an actual database

// Generate 80 mock members
const generateMockMembers = () => {
  const members = [];
  const sections = ['一小段', '二小段'];
  const cities = ['台北市', '新北市', '桃園市', '新竹市'];
  const districts = ['中山區', '信義區', '板橋區', '中壢區', '東區'];
  
  for (let i = 1; i <= 80; i++) {
    const sectionIndex = i % 2;
    const section = sections[sectionIndex];
    const cityIndex = i % cities.length;
    const districtIndex = i % districts.length;
    
    const idFormatted = i.toString().padStart(3, '0');
    members.push({
      id: i.toString(),
      memberId: `M${idFormatted}`,
      idNumber: `A${Math.floor(100000000 + Math.random() * 900000000)}`,
      name: `會員${idFormatted}`,
      city: cities[cityIndex],
      district: districts[districtIndex],
      section: '中山段',
      subSection: section,
      landNumber: `${100 + i}-${i % 10}`,
      landShare: `1/${(i % 4) + 1}`,
      landArea: (100 + Math.random() * 300).toFixed(1),
      buildingNumber: `B-${500 + i}`,
      buildingShare: `1/${(i % 4) + 1}`,
      buildingArea: (70 + Math.random() * 200).toFixed(1),
    });
  }
  return members;
};

let mockMembers = generateMockMembers();

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

// Type for pagination
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Get all members with pagination
export const getAllMembers = async (
  page = 1, 
  pageSize = 20
): Promise<PaginatedResponse<Member>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = mockMembers.slice(start, end);
  
  return {
    data: paginatedData,
    total: mockMembers.length,
    page,
    pageSize,
    totalPages: Math.ceil(mockMembers.length / pageSize)
  };
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

// Enhanced search members with pagination, filtering and sorting
export const searchMembers = async (
  searchTerm = '', 
  filter = 'all', 
  page = 1, 
  pageSize = 20
): Promise<PaginatedResponse<Member>> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter the members based on search term and tab selection
  let results = mockMembers.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.landNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.buildingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.district.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'section1') return matchesSearch && member.subSection === '一小段';
    if (filter === 'section2') return matchesSearch && member.subSection === '二小段';
    
    return matchesSearch;
  });
  
  // Calculate pagination
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  // Slice the data for the current page
  const paginatedData = results.slice(start, end);
  
  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages
  };
};

