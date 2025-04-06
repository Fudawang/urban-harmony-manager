
import React, { useState } from 'react';
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
  ClipboardList 
} from 'lucide-react';
import { toast } from 'sonner';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`已開始準備匯出${selectedReport}報表，格式：${format === 'pdf' ? 'PDF' : 'Excel'}`);
    setTimeout(() => {
      toast.success(`${selectedReport}報表已準備完成，正在下載...`);
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
    }
  ];
  
  const previewData = {
    members: [
      { id: 'M001', name: '王*明', idNumber: '*****1234', landShare: '2.5%', buildingShare: '2.3%' },
      { id: 'M002', name: '李*華', idNumber: '*****5678', landShare: '1.8%', buildingShare: '1.7%' },
      { id: 'M003', name: '張*文', idNumber: '*****9012', landShare: '3.2%', buildingShare: '3.1%' },
      { id: 'M004', name: '林*芳', idNumber: '*****3456', landShare: '2.1%', buildingShare: '2.0%' },
      { id: 'M005', name: '陳*宏', idNumber: '*****7890', landShare: '1.5%', buildingShare: '1.4%' },
    ],
    meetings: [
      { id: 'MT001', type: '理監事會議', date: '2023-06-15', title: '第一屆第三次理監事會議', status: '已完成' },
      { id: 'MT002', type: '會員大會', date: '2023-08-20', title: '第一屆第二次會員大會', status: '已完成' },
      { id: 'MT003', type: '理監事會議', date: '2023-10-05', title: '第一屆第四次理監事會議', status: '已完成' },
      { id: 'MT004', type: '臨時會議', date: '2023-11-10', title: '臨時理監事會議', status: '已完成' },
      { id: 'MT005', type: '會員大會', date: '2024-02-25', title: '第一屆第三次會員大會', status: '準備中' },
    ],
    proposals: [
      { id: 'P001', meeting: '第一屆第二次會員大會', title: '都更計畫案修正案', type: '重要議案', result: '通過' },
      { id: 'P002', meeting: '第一屆第二次會員大會', title: '公共設施維護費用調整', type: '一般議案', result: '通過' },
      { id: 'P003', meeting: '第一屆第三次理監事會議', title: '社區管理辦法修訂', type: '一般議案', result: '通過' },
      { id: 'P004', meeting: '第一屆第四次理監事會議', title: '建築師變更提案', type: '重要議案', result: '未通過' },
      { id: 'P005', meeting: '臨時理監事會議', title: '法律顧問聘任案', type: '一般議案', result: '通過' },
    ]
  };

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
              {reportTypes.find(r => r.id === selectedReport)?.title} 報表
            </h2>
            <Button 
              variant="outline" 
              onClick={() => setSelectedReport(null)}
            >
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
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {selectedReport === 'members' && (
                    <TableRow>
                      <TableHead>會員編號</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>身份證號</TableHead>
                      <TableHead>土地持分</TableHead>
                      <TableHead>建物持分</TableHead>
                    </TableRow>
                  )}
                  
                  {selectedReport === 'meetings' && (
                    <TableRow>
                      <TableHead>會議編號</TableHead>
                      <TableHead>會議類型</TableHead>
                      <TableHead>日期</TableHead>
                      <TableHead>會議名稱</TableHead>
                      <TableHead>狀態</TableHead>
                    </TableRow>
                  )}
                  
                  {selectedReport === 'proposals' && (
                    <TableRow>
                      <TableHead>議案編號</TableHead>
                      <TableHead>會議</TableHead>
                      <TableHead>議案名稱</TableHead>
                      <TableHead>議案類型</TableHead>
                      <TableHead>決議結果</TableHead>
                    </TableRow>
                  )}
                </TableHeader>
                <TableBody>
                  {selectedReport === 'members' && previewData.members.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>{member.id}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.idNumber}</TableCell>
                      <TableCell>{member.landShare}</TableCell>
                      <TableCell>{member.buildingShare}</TableCell>
                    </TableRow>
                  ))}
                  
                  {selectedReport === 'meetings' && previewData.meetings.map(meeting => (
                    <TableRow key={meeting.id}>
                      <TableCell>{meeting.id}</TableCell>
                      <TableCell>{meeting.type}</TableCell>
                      <TableCell>{meeting.date}</TableCell>
                      <TableCell>{meeting.title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          meeting.status === '已完成' ? 'bg-urban-100 text-urban-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {meeting.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {selectedReport === 'proposals' && previewData.proposals.map(proposal => (
                    <TableRow key={proposal.id}>
                      <TableCell>{proposal.id}</TableCell>
                      <TableCell>{proposal.meeting}</TableCell>
                      <TableCell>{proposal.title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          proposal.type === '重要議案' ? 'bg-red-100 text-red-800' : 'bg-urban-100 text-urban-800'
                        }`}>
                          {proposal.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          proposal.result === '通過' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {proposal.result}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
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
