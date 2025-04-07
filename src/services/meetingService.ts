
// Mock meeting service

// Define Meeting type
export type Meeting = {
  id: string;
  type: 'general' | 'board';
  term: number;
  number: number;
  title: string;
  date: string;
  location: string;
  status: 'upcoming' | 'completed';
  attendees: number;
  totalMembers: number;
  documents: number;
};

// Mock meeting data
let mockMeetings: Meeting[] = [
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

// Get all meetings
export const getAllMeetings = async (): Promise<Meeting[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockMeetings];
};

// Get meeting by ID
export const getMeetingById = async (id: string): Promise<Meeting | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMeetings.find(meeting => meeting.id === id);
};

// Create new meeting
export const createMeeting = async (meetingData: Omit<Meeting, 'id'>): Promise<Meeting> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newMeeting = {
    ...meetingData,
    id: String(Math.max(...mockMeetings.map(m => Number(m.id))) + 1),
  };
  
  mockMeetings.push(newMeeting);
  return newMeeting;
};

// Update meeting
export const updateMeeting = async (id: string, meetingData: Omit<Meeting, 'id'>): Promise<Meeting> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockMeetings.findIndex(meeting => meeting.id === id);
  if (index === -1) {
    throw new Error('會議不存在');
  }
  
  const updatedMeeting = {
    ...meetingData,
    id,
  };
  
  mockMeetings[index] = updatedMeeting;
  return updatedMeeting;
};

// Delete meeting
export const deleteMeeting = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockMeetings.findIndex(meeting => meeting.id === id);
  if (index === -1) {
    throw new Error('會議不存在');
  }
  
  mockMeetings.splice(index, 1);
};

// Search meetings
export const searchMeetings = async (searchTerm: string, filter?: string): Promise<Meeting[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let results = mockMeetings.filter(meeting => {
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.date.includes(searchTerm) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!filter || filter === 'all') return matchesSearch;
    if (filter === 'general') return matchesSearch && meeting.type === 'general';
    if (filter === 'board') return matchesSearch && meeting.type === 'board';
    
    return matchesSearch;
  });
  
  return results;
};
