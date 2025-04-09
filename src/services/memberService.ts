
// This is a mock service that simulates database operations
// In a real application, this would interact with an actual database

// Generate 80 mock members
const generateMockMembers = () => {
  const members = [];
  const sections = ['一小段', '二小段'];
  const cities = ['台北市', '新北市', '桃園市', '新竹市'];
  const districts = {
    '台北市': ['中山區', '信義區', '大安區', '內湖區', '松山區'],
    '新北市': ['板橋區', '中和區', '永和區', '新莊區', '三重區'],
    '桃園市': ['中壢區', '桃園區', '平鎮區', '龜山區', '八德區'],
    '新竹市': ['東區', '北區', '香山區']
  };
  
  for (let i = 1; i <= 80; i++) {
    const sectionIndex = i % 2;
    const section = sections[sectionIndex];
    const cityIndex = i % cities.length;
    const city = cities[cityIndex];
    const districtsList = districts[city] || ['中山區'];
    const districtIndex = i % districtsList.length;
    const district = districtsList[districtIndex];
    
    const idFormatted = i.toString().padStart(6, '0');
    members.push({
      id: i.toString(),
      memberId: `M${idFormatted}`,
      idNumber: `A${Math.floor(100000000 + Math.random() * 900000000)}`,
      name: `會員${idFormatted}`,
      city: city,
      district: district,
      section: '中山段',
      subSection: section,
      landNumber: `${100 + i}-${i % 10}`,
      landShare: `${(1 + Math.random() * 10).toFixed(2)}%`,
      landArea: (100 + Math.random() * 300).toFixed(1),
      buildingNumber: `B-${500 + i}`,
      buildingShare: `${(1 + Math.random() * 10).toFixed(2)}%`,
      buildingArea: (70 + Math.random() * 200).toFixed(1),
    });
  }
  return members;
};

let mockMembers = generateMockMembers();
let nextMemberId = Math.max(...mockMembers.map(m => parseInt(m.id))) + 1;

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

// Get available filters
export const getFilters = async (): Promise<{cities: string[], districts: {[key: string]: string[]}}> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Extract unique cities and their districts
  const cities = [...new Set(mockMembers.map(member => member.city))];
  const districts: {[key: string]: string[]} = {};
  
  cities.forEach(city => {
    districts[city] = [...new Set(
      mockMembers
        .filter(member => member.city === city)
        .map(member => member.district)
    )];
  });
  
  return { cities, districts };
};

// Generate new member ID
export const generateMemberId = async (): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return `M${nextMemberId.toString().padStart(6, '0')}`;
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
export const createMember = async (memberData: Omit<Member, 'id' | 'memberId'>): Promise<Member> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newId = nextMemberId.toString();
  nextMemberId++;
  
  const newMemberId = `M${newId.padStart(6, '0')}`;
  
  const newMember = {
    ...memberData,
    id: newId,
    memberId: newMemberId,
  };
  
  mockMembers.push(newMember);
  return newMember;
};

// Update member
export const updateMember = async (id: string, memberData: Omit<Member, 'id' | 'memberId'>): Promise<Member> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockMembers.findIndex(member => member.id === id);
  if (index === -1) {
    throw new Error('會員不存在');
  }
  
  const existingMember = mockMembers[index];
  
  const updatedMember = {
    ...memberData,
    id,
    memberId: existingMember.memberId, // Keep the original memberId
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
  filter: {city?: string, district?: string, section?: string} = {}, 
  page = 1, 
  pageSize = 20
): Promise<PaginatedResponse<Member>> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter the members based on search term and filter selection
  let results = mockMembers.filter(member => {
    // Search term matching
    const matchesSearch = searchTerm === '' || 
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.landNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.buildingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.district.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter matching
    const matchesCity = !filter.city || member.city === filter.city;
    const matchesDistrict = !filter.district || member.district === filter.district;
    const matchesSection = !filter.section || member.subSection === filter.section;
    
    return matchesSearch && matchesCity && matchesDistrict && matchesSection;
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
