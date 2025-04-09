
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Users, 
  Calendar, 
  ClipboardList, 
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getMeetingsByType } from '@/services/meetingService';
import { getAllProposals } from '@/services/proposalService';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  
  const loadData = async () => {
    if (selectedReport === 'meetings' || selectedReport === 'attendance') {
      setIsLoading(true);
      try {
        const generalMeetings = await getMeetingsByType('general');
        setMeetings(generalMeetings);
      } catch (error) {
        console.error('Error loading meetings:', error);
        toast.error('無法載入會議資料');
      } finally {
        setIsLoading(false);
      }
    } else if (selectedReport === 'proposals' || selectedReport === 'voting') {
      setIsLoading(true);
      try {
        const allProposals = await getAllProposals();
        setProposals(allProposals);
      } catch (error) {
        console.error('Error loading proposals:', error);
        toast.error('無法載入議案資料');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  useEffect(() => {
    loadData();
  }, [selectedReport]);
  
  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`已開始準備匯出${getReportTitle()}，格式：${format === 'pdf' ? 'PDF' : 'Excel'}`);
    setTimeout(() => {
      toast.success(`${getReportTitle()}已準備完成，正在下載...`);
    }, 1500);
  };

  const reportTypes = [
    { 
      id: 'members', 
      title: '會員名冊', 
      description: '所有會員基本資料與持分統計', 
      icon: <Users className="h-8 w-8 text-urban-600" /> 
    },
    { 
      id: 'meetings', 
      title: '會議紀錄', 
      description: '會員大會與理監事會議紀錄', 
      icon: <Calendar className="h-8 w-8 text-urban-600" /> 
    },
    { 
      id: 'proposals', 
      title: '議案決議', 
      description: '議案投票結果與決議摘要', 
      icon: <ClipboardList className="h-8 w-8 text-urban-600" /> 
    },
    { 
      id: 'attendance', 
      title: '出席統計', 
      description: '會員大會出席率與持分統計圖表', 
      icon: <Users className="h-8 w-8 text-urban-600" /> 
    },
    { 
      id: 'voting', 
      title: '投票統計', 
      description: '議案投票結果統計圖表', 
      icon: <ClipboardList className="h-8 w-8 text-urban-600" /> 
    }
  ];
  
  const getReportTitle = () => {
    const report = reportTypes.find(r => r.id === selectedReport);
    return report ? report.title : '報表';
  };
  
  const previewData = {
    members: [
      { id: 'M000001', name: '王*明', idNumber: '*****1234', landShare: '2.5%', buildingShare: '2.3%' },
      { id: 'M000002', name: '李*華', idNumber: '*****5678', landShare: '1.8%', buildingShare: '1.7%' },
      { id: 'M000003', name: '張*文', idNumber: '*****9012', landShare: '3.2%', buildingShare: '3.1%' },
      { id: 'M000004', name: '林*芳', idNumber: '*****3456', landShare: '2.1%', buildingShare: '2.0%' },
      { id: 'M000005', name: '陳*宏', idNumber: '*****7890', landShare: '1.5%', buildingShare: '1.4%' },
    ]
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Generate attendance chart data
  const attendanceChartData = meetings
    .filter(meeting => meeting.status === 'completed' && meeting.attendanceStats)
    .map(meeting => ({
      name: meeting.title.replace(/^第.+屆第.+次/, ''),
      出席率: Math.round((meeting.attendees / meeting.totalMembers) * 100),
      土地持分: meeting.attendanceStats?.landSharePercentage || 0,
      建物持分: meeting.attendanceStats?.buildingSharePercentage || 0,
    }));
  
  // Generate voting chart data for pie chart (important vs normal)
  const proposalTypeData = [
    { name: '重要議案', value: proposals.filter(p => p.type === 'important').length },
    { name: '一般議案', value: proposals.filter(p => p.type === 'normal').length }
  ];
  
  // Generate voting chart data for pie chart (approved vs rejected)
  const proposalResultData = [
    { name: '已通過', value: proposals.filter(p => p.status === 'approved').length },
    { name: '未通過', value: proposals.filter(p => p.status === 'rejected').length },
    { name: '待表決', value: proposals.filter(p => p.status === 'pending' || p.status === 'voting').length }
  ];
  
  // Generate voting chart data for bar chart
  const voteChartData = proposals
    .filter(proposal => proposal.status === 'approved' || proposal.status === 'rejected')
    .map(proposal => ({
      name: proposal.number,
      同意票: proposal.votes.approved,
      反對票: proposal.votes.rejected,
      棄權票: proposal.votes.abstained,
    }));

  return (
    <div className="page-container space-y-6">
      <h1 className="page-title">報表輸出</h1>
      
      {!selectedReport ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map(report => (
            <Card 
              key={report.id} 
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedReport(report.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
                <div className="p-2">{report.icon}</div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedReport(report.id);
                }}>
                  選擇此報表
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-urban-800">
              {getReportTitle()}
            </h2>
            <Button 
              variant="outline" 
              onClick={() => setSelectedReport(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回報表列表
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Button onClick={() => handleExport('pdf')} className="flex items-center gap-2">
                <FileText size={18} />
                匯出 PDF
              </Button>
              <Button 
                onClick={() => handleExport('excel')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <FileSpreadsheet size={18} />
                匯出 Excel
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                正在載入報表資料...
              </div>
            ) : selectedReport === 'members' ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>會員編號</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>身份證號</TableHead>
                      <TableHead>土地持分</TableHead>
                      <TableHead>建物持分</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.members.map(member => (
                      <TableRow key={member.id}>
                        <TableCell>{member.id}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.idNumber}</TableCell>
                        <TableCell>{member.landShare}</TableCell>
                        <TableCell>{member.buildingShare}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : selectedReport === 'meetings' ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>會議名稱</TableHead>
                      <TableHead>日期</TableHead>
                      <TableHead>出席人數</TableHead>
                      <TableHead>出席率</TableHead>
                      <TableHead>土地持分</TableHead>
                      <TableHead>建物持分</TableHead>
                      <TableHead>狀態</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetings.map(meeting => (
                      <TableRow key={meeting.id}>
                        <TableCell>{meeting.title}</TableCell>
                        <TableCell>{meeting.date}</TableCell>
                        <TableCell>{meeting.attendees}/{meeting.totalMembers}</TableCell>
                        <TableCell>
                          {Math.round((meeting.attendees / meeting.totalMembers) * 100)}%
                        </TableCell>
                        <TableCell>
                          {meeting.attendanceStats?.landSharePercentage || '-'}%
                        </TableCell>
                        <TableCell>
                          {meeting.attendanceStats?.buildingSharePercentage || '-'}%
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            meeting.status === 'completed' ? 'bg-urban-100 text-urban-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {meeting.status === 'completed' ? '已完成' : '準備中'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : selectedReport === 'proposals' ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>議案編號</TableHead>
                      <TableHead>會議</TableHead>
                      <TableHead>議案名稱</TableHead>
                      <TableHead>議案類型</TableHead>
                      <TableHead>同意票數</TableHead>
                      <TableHead>決議結果</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposals.map(proposal => (
                      <TableRow key={proposal.id}>
                        <TableCell>{proposal.number}</TableCell>
                        <TableCell>{proposal.meetingTitle}</TableCell>
                        <TableCell>{proposal.title}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            proposal.type === 'important' ? 'bg-red-100 text-red-800' : 'bg-urban-100 text-urban-800'
                          }`}>
                            {proposal.type === 'important' ? '重要議案' : '一般議案'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {proposal.votes.approved}/{proposal.votes.attended}
                          {proposal.votes.attended > 0 && (
                            <span className="text-xs ml-1 text-muted-foreground">
                              ({Math.round((proposal.votes.approved / proposal.votes.attended) * 100)}%)
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            proposal.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {proposal.status === 'approved' ? '通過' : 
                             proposal.status === 'rejected' ? '未通過' : 
                             proposal.status === 'voting' ? '投票中' : '待表決'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : selectedReport === 'attendance' ? (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>會員大會出席率統計</CardTitle>
                    <CardDescription>各次會員大會的出席率、土地與建物持分比例</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {attendanceChartData.length > 0 ? (
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={attendanceChartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, '']} />
                            <Legend />
                            <Bar dataKey="出席率" fill="#0088FE" />
                            <Bar dataKey="土地持分" fill="#00C49F" />
                            <Bar dataKey="建物持分" fill="#FFBB28" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        尚無出席資料可供統計
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : selectedReport === 'voting' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>議案類型分布</CardTitle>
                      <CardDescription>重要議案與一般議案的數量分布</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {proposalTypeData.some(item => item.value > 0) ? (
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={proposalTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {proposalTypeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [value, '數量']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          尚無議案資料可供統計
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>議案結果分布</CardTitle>
                      <CardDescription>已通過、未通過與待表決議案的數量分布</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {proposalResultData.some(item => item.value > 0) ? (
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={proposalResultData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {proposalResultData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [value, '數量']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          尚無議案資料可供統計
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>議案投票統計</CardTitle>
                    <CardDescription>各議案的同意票、反對票與棄權票數量</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {voteChartData.length > 0 ? (
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={voteChartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="同意票" fill="#4CAF50" />
                            <Bar dataKey="反對票" fill="#F44336" />
                            <Bar dataKey="棄權票" fill="#9E9E9E" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        尚無投票資料可供統計
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : null}
            
            <div className="mt-4 text-sm text-gray-500">
              <Download className="inline-block mr-1" size={16} />
              報表輸出僅供參考，實際數據請以系統紀錄為準。
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
