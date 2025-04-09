
// Meeting service with attendance tracking and voting

// Define Meeting type
export type Meeting = {
  id: string;
  type: 'general' | 'board';
  term: number;
  number: number;
  title: string;
  date: string;
  location: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  attendees: number;
  totalMembers: number;
  documents: number;
  checkInEnabled?: boolean;
  attendanceStats?: {
    memberCount: number;
    landSharePercentage: number;
    buildingSharePercentage: number;
  };
};

// Define MeetingDocument type
export type MeetingDocument = {
  id: string;
  meetingId: string;
  title: string;
  type: 'agenda' | 'minutes' | 'presentation' | 'attachment';
  fileUrl: string;
  uploadDate: string;
  size: number; // in KB
};

// Define MeetingAttendance type
export type MeetingAttendance = {
  id: string;
  meetingId: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  landShare: string;
  buildingShare: string;
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
    attendanceStats: {
      memberCount: 87,
      landSharePercentage: 68.5,
      buildingSharePercentage: 69.2
    }
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
    attendanceStats: {
      memberCount: 92,
      landSharePercentage: 73.1,
      buildingSharePercentage: 74.8
    }
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
    attendanceStats: {
      memberCount: 95,
      landSharePercentage: 75.3,
      buildingSharePercentage: 76.1
    }
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
    date: '2024-06-25',
    location: '台北市中山區中山北路二段100號5樓會議室',
    status: 'upcoming',
    attendees: 0,
    totalMembers: 126,
    documents: 1,
    checkInEnabled: false,
  },
  {
    id: '8',
    type: 'board',
    term: 2,
    number: 2,
    title: '第二屆第二次理監事會議',
    date: '2024-05-10',
    location: '台北市中山區中山北路二段100號5樓會議室',
    status: 'upcoming',
    attendees: 0,
    totalMembers: 15,
    documents: 1,
  },
];

// Mock attendance records
let mockAttendance: MeetingAttendance[] = [];

// Mock meeting documents
let mockDocuments: MeetingDocument[] = [
  {
    id: '1',
    meetingId: '1',
    title: '第一屆第一次會員大會會議議程',
    type: 'agenda',
    fileUrl: '/documents/agenda-1-1.pdf',
    uploadDate: '2022-05-01',
    size: 256,
  },
  {
    id: '2',
    meetingId: '1',
    title: '第一屆第一次會員大會會議紀錄',
    type: 'minutes',
    fileUrl: '/documents/minutes-1-1.pdf',
    uploadDate: '2022-05-30',
    size: 512,
  },
  {
    id: '3',
    meetingId: '1',
    title: '第一屆第一次會員大會簡報資料',
    type: 'presentation',
    fileUrl: '/documents/presentation-1-1.pdf',
    uploadDate: '2022-05-15',
    size: 1024,
  },
];

// Get all meetings
export const getAllMeetings = async (): Promise<Meeting[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockMeetings];
};

// Get meetings by type
export const getMeetingsByType = async (type: 'general' | 'board'): Promise<Meeting[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMeetings.filter(meeting => meeting.type === type);
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

// Get meeting documents
export const getMeetingDocuments = async (meetingId: string): Promise<MeetingDocument[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDocuments.filter(doc => doc.meetingId === meetingId);
};

// Add meeting document
export const addMeetingDocument = async (document: Omit<MeetingDocument, 'id'>): Promise<MeetingDocument> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newDocument = {
    ...document,
    id: String(Math.max(...mockDocuments.map(d => Number(d.id)), 0) + 1),
  };
  
  mockDocuments.push(newDocument);
  
  // Update the documents count in the meeting
  const meetingIndex = mockMeetings.findIndex(m => m.id === document.meetingId);
  if (meetingIndex !== -1) {
    mockMeetings[meetingIndex].documents += 1;
  }
  
  return newDocument;
};

// Delete meeting document
export const deleteMeetingDocument = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const docIndex = mockDocuments.findIndex(doc => doc.id === id);
  if (docIndex === -1) {
    throw new Error('文件不存在');
  }
  
  const meetingId = mockDocuments[docIndex].meetingId;
  mockDocuments.splice(docIndex, 1);
  
  // Update the documents count in the meeting
  const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
  if (meetingIndex !== -1 && mockMeetings[meetingIndex].documents > 0) {
    mockMeetings[meetingIndex].documents -= 1;
  }
};

// Toggle check-in mode for a meeting
export const toggleCheckInMode = async (meetingId: string, enabled: boolean): Promise<Meeting> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
  if (meetingIndex === -1) {
    throw new Error('會議不存在');
  }
  
  const updatedMeeting = {
    ...mockMeetings[meetingIndex],
    checkInEnabled: enabled,
    status: enabled ? 'in-progress' : mockMeetings[meetingIndex].status,
  };
  
  mockMeetings[meetingIndex] = updatedMeeting;
  return updatedMeeting;
};

// Check in a member to a meeting
export const checkInMember = async (meetingId: string, memberId: string, memberData: {
  memberName: string,
  landShare: string,
  buildingShare: string
}): Promise<MeetingAttendance> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if the meeting exists and check-in is enabled
  const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
  if (meetingIndex === -1) {
    throw new Error('會議不存在');
  }
  
  if (mockMeetings[meetingIndex].status !== 'in-progress' || !mockMeetings[meetingIndex].checkInEnabled) {
    throw new Error('會議尚未開始報到');
  }
  
  // Check if member is already checked in
  const existingAttendance = mockAttendance.find(a => a.meetingId === meetingId && a.memberId === memberId);
  if (existingAttendance) {
    throw new Error('會員已報到');
  }
  
  // Create attendance record
  const newAttendance: MeetingAttendance = {
    id: String(Date.now()),
    meetingId,
    memberId,
    memberName: memberData.memberName,
    checkInTime: new Date().toISOString(),
    landShare: memberData.landShare,
    buildingShare: memberData.buildingShare,
  };
  
  mockAttendance.push(newAttendance);
  
  // Update meeting attendance stats
  const attendedMembers = mockAttendance.filter(a => a.meetingId === meetingId);
  const attendeeCount = attendedMembers.length;
  
  // Calculate share percentages (simple calculation for mock)
  const landShares = attendedMembers.map(a => parseFloat(a.landShare.replace('%', '')));
  const buildingShares = attendedMembers.map(a => parseFloat(a.buildingShare.replace('%', '')));
  
  const landSharePercentage = landShares.reduce((sum, share) => sum + share, 0);
  const buildingSharePercentage = buildingShares.reduce((sum, share) => sum + share, 0);
  
  mockMeetings[meetingIndex] = {
    ...mockMeetings[meetingIndex],
    attendees: attendeeCount,
    attendanceStats: {
      memberCount: attendeeCount,
      landSharePercentage: parseFloat(landSharePercentage.toFixed(1)),
      buildingSharePercentage: parseFloat(buildingSharePercentage.toFixed(1)),
    }
  };
  
  return newAttendance;
};

// Get attendance for a meeting
export const getMeetingAttendance = async (meetingId: string): Promise<MeetingAttendance[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAttendance.filter(a => a.meetingId === meetingId);
};

// Complete a meeting
export const completeMeeting = async (meetingId: string): Promise<Meeting> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
  if (meetingIndex === -1) {
    throw new Error('會議不存在');
  }
  
  const updatedMeeting = {
    ...mockMeetings[meetingIndex],
    status: 'completed',
    checkInEnabled: false,
  };
  
  mockMeetings[meetingIndex] = updatedMeeting;
  return updatedMeeting;
};
