
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, UserCheck, Building, LandPlot, Search } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Meeting, 
  MeetingAttendance, 
  toggleCheckInMode, 
  checkInMember, 
  getMeetingAttendance, 
  completeMeeting 
} from '@/services/meetingService';
import { getMemberById, getAllMembers, Member } from '@/services/memberService';

interface MeetingCheckInProps {
  meeting: Meeting;
  onUpdate: (meeting: Meeting) => void;
}

const MeetingCheckIn: React.FC<MeetingCheckInProps> = ({ meeting, onUpdate }) => {
  const [memberId, setMemberId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attendanceList, setAttendanceList] = useState<MeetingAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberList, setShowMemberList] = useState(false);

  // Load attendance on component mount and when meeting changes
  useEffect(() => {
    if (meeting.status === 'in-progress' || meeting.status === 'completed') {
      loadAttendance();
    }
    loadMembers();
  }, [meeting]);

  const loadAttendance = async () => {
    setIsLoading(true);
    try {
      const attendance = await getMeetingAttendance(meeting.id);
      setAttendanceList(attendance);
    } catch (error) {
      console.error('Error loading attendance:', error);
      toast.error('無法載入出席紀錄');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const response = await getAllMembers(1, 100);
      setMemberList(response.data);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('無法載入會員名單');
    }
  };

  const handleToggleCheckIn = async () => {
    setIsProcessing(true);
    try {
      const updatedMeeting = await toggleCheckInMode(meeting.id, !meeting.checkInEnabled);
      onUpdate(updatedMeeting);
      toast.success(updatedMeeting.checkInEnabled ? '報到系統已啟動' : '報到系統已暫停');
      
      if (updatedMeeting.checkInEnabled) {
        await loadAttendance();
      }
    } catch (error) {
      console.error('Error toggling check-in:', error);
      toast.error('操作失敗，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteMeeting = async () => {
    if (window.confirm('確定要完成此會議嗎？報到系統將關閉且無法重新開啟。')) {
      setIsProcessing(true);
      try {
        const updatedMeeting = await completeMeeting(meeting.id);
        onUpdate(updatedMeeting);
        toast.success('會議已標記為完成');
      } catch (error) {
        console.error('Error completing meeting:', error);
        toast.error('操作失敗，請稍後再試');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCheckIn = async () => {
    if (!memberId.trim()) {
      toast.error('請輸入會員編號');
      return;
    }

    setIsProcessing(true);
    try {
      // Get member details - strip 'M' if present to match the ID format in the service
      const cleanMemberId = memberId.replace(/^M/i, '');
      const member = await getMemberById(cleanMemberId);
      
      if (!member) {
        toast.error('找不到此會員編號');
        return;
      }

      // Check if member is already checked in
      const alreadyCheckedIn = attendanceList.some(a => a.memberId === member.id);
      if (alreadyCheckedIn) {
        toast.error(`${member.name} 已經報到過了`);
        return;
      }

      // Check in the member
      await checkInMember(meeting.id, member.id, {
        memberName: member.name,
        landShare: member.landShare,
        buildingShare: member.buildingShare
      });

      // Update attendance list and meeting stats
      await loadAttendance();
      const updatedMeeting = { ...meeting };
      updatedMeeting.attendees += 1;
      onUpdate(updatedMeeting);
      
      toast.success(`${member.name} 報到成功`);
      setMemberId('');
      setShowMemberList(false);
    } catch (error: any) {
      console.error('Error checking in member:', error);
      toast.error(error.message || '報到失敗，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSelectMember = (member: Member) => {
    setMemberId(member.memberId);
    setShowMemberList(false);
  };

  // Filter member list based on search
  const filteredMembers = memberList.filter(member => 
    member.memberId.toLowerCase().includes(memberSearch.toLowerCase()) || 
    member.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Calculate attendance percentage
  const attendancePercent = meeting.totalMembers > 0 
    ? Math.round((meeting.attendees / meeting.totalMembers) * 100) 
    : 0;

  // Sort attendance list by check-in time (newest first)
  const sortedAttendance = [...attendanceList].sort(
    (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-2xl font-bold">{meeting.title} - 報到系統</h2>
        
        <div className="space-x-2">
          {meeting.status !== 'completed' && (
            <>
              <Button 
                variant={meeting.checkInEnabled ? "destructive" : "default"} 
                onClick={handleToggleCheckIn}
                disabled={isProcessing}
              >
                {meeting.checkInEnabled ? '暫停報到' : '開始報到'}
              </Button>
              
              {meeting.checkInEnabled && (
                <Button
                  variant="outline"
                  onClick={handleCompleteMeeting}
                  disabled={isProcessing}
                >
                  完成會議
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
              <CardTitle>會員報到</CardTitle>
              <CardDescription>
                {meeting.status === 'completed' 
                  ? '會議已結束，報到系統已關閉' 
                  : meeting.checkInEnabled 
                    ? '請輸入會員編號進行報到' 
                    : '報到系統尚未開始'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {meeting.checkInEnabled && (
                <div className="space-y-4 mb-6">
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="輸入會員編號或搜尋會員姓名"
                        value={memberId}
                        onChange={(e) => {
                          setMemberId(e.target.value);
                          setMemberSearch(e.target.value);
                          setShowMemberList(e.target.value.length > 0);
                        }}
                        onClick={() => setShowMemberList(true)}
                        disabled={isProcessing || meeting.status === 'completed'}
                        className="pl-8"
                      />
                      
                      {showMemberList && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                              <div 
                                key={member.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                                onClick={() => handleSelectMember(member)}
                              >
                                <span>{member.name}</span>
                                <span className="text-muted-foreground">{member.memberId}</span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-muted-foreground">
                              找不到符合的會員
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handleCheckIn} 
                      disabled={isProcessing || meeting.status === 'completed'}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      報到
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="border rounded-md">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <h3 className="font-medium">報到會員名單</h3>
                  <span className="text-sm text-muted-foreground">
                    共 {attendanceList.length} 人
                  </span>
                </div>
                
                <div className="max-h-[400px] overflow-auto">
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      正在載入報到資料...
                    </div>
                  ) : sortedAttendance.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-sm">會員編號</th>
                          <th className="text-left p-3 font-medium text-sm">姓名</th>
                          <th className="text-left p-3 font-medium text-sm">報到時間</th>
                          <th className="text-left p-3 font-medium text-sm">持分</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedAttendance.map((record) => (
                          <tr key={record.id} className="border-t">
                            <td className="p-3">{record.memberId}</td>
                            <td className="p-3">{record.memberName}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {new Date(record.checkInTime).toLocaleString('zh-TW', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="p-3 text-sm">
                              <div className="flex flex-col">
                                <span>土地: {record.landShare}</span>
                                <span>建物: {record.buildingShare}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      尚無會員報到
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>報到統計</CardTitle>
            <CardDescription>
              {meeting.status === 'completed' ? '會議最終統計結果' : '即時報到統計數據'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                  出席人數
                </span>
                <span className="font-medium">
                  {meeting.attendees}/{meeting.totalMembers}
                </span>
              </div>
              <Progress className="h-2" value={attendancePercent} />
              <div className="text-xs text-right text-muted-foreground">
                {attendancePercent}% 出席率
              </div>
            </div>
            
            {meeting.attendanceStats && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <LandPlot className="h-4 w-4 mr-1 text-muted-foreground" />
                      土地持分
                    </span>
                    <span className="font-medium">
                      {meeting.attendanceStats.landSharePercentage}%
                    </span>
                  </div>
                  <Progress className="h-2" value={meeting.attendanceStats.landSharePercentage} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                      建物持分
                    </span>
                    <span className="font-medium">
                      {meeting.attendanceStats.buildingSharePercentage}%
                    </span>
                  </div>
                  <Progress className="h-2" value={meeting.attendanceStats.buildingSharePercentage} />
                </div>
              </>
            )}
            
            <div className="pt-2 border-t text-sm text-muted-foreground">
              {meeting.status === 'completed' ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  會議已結束
                </div>
              ) : meeting.checkInEnabled ? (
                <div>報到系統開放中</div>
              ) : (
                <div>報到系統尚未開始</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeetingCheckIn;
