
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown,
  User
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Mock board member data
const mockBoardMembers = [
  {
    id: '1',
    name: '王大明',
    position: 'director',
    title: '理事長',
    term: 2,
    memberId: 'M001',
    contactPhone: '0912-345-678',
    email: 'wang@example.com',
    notes: '第二屆理事長',
  },
  {
    id: '2',
    name: '李小華',
    position: 'director',
    title: '常務理事',
    term: 2,
    memberId: 'M002',
    contactPhone: '0923-456-789',
    email: 'lee@example.com',
    notes: '',
  },
  {
    id: '3',
    name: '張美玲',
    position: 'director',
    title: '理事',
    term: 2,
    memberId: 'M003',
    contactPhone: '0934-567-890',
    email: 'chang@example.com',
    notes: '',
  },
  {
    id: '4',
    name: '陳志明',
    position: 'director',
    title: '理事',
    term: 2,
    memberId: 'M004',
    contactPhone: '0945-678-901',
    email: 'chen@example.com',
    notes: '',
  },
  {
    id: '5',
    name: '林雅芳',
    position: 'director',
    title: '理事',
    term: 2,
    memberId: 'M005',
    contactPhone: '0956-789-012',
    email: 'lin@example.com',
    notes: '',
  },
  {
    id: '6',
    name: '劉建宏',
    position: 'supervisor',
    title: '監事主席',
    term: 2,
    memberId: 'M008',
    contactPhone: '0967-890-123',
    email: 'liu@example.com',
    notes: '',
  },
  {
    id: '7',
    name: '黃美珠',
    position: 'supervisor',
    title: '監事',
    term: 2,
    memberId: 'M010',
    contactPhone: '0978-901-234',
    email: 'huang@example.com',
    notes: '',
  },
  {
    id: '8',
    name: '吳志豪',
    position: 'supervisor',
    title: '監事',
    term: 2,
    memberId: 'M012',
    contactPhone: '0989-012-345',
    email: 'wu@example.com',
    notes: '',
  },
];

// Map position to text
const positionMap = {
  director: '理事',
  supervisor: '監事',
};

const BoardManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">理監事管理</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button className="bg-urban-600 hover:bg-urban-700">
            <Plus className="h-4 w-4 mr-2" />
            新增理監事
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                匯出
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                匯出 PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                匯出 Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>理監事名冊</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              第二屆 (現任)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="directors">理事</TabsTrigger>
              <TabsTrigger value="supervisors">監事</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">職稱</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>會員編號</TableHead>
                      <TableHead>聯絡電話</TableHead>
                      <TableHead>電子郵件</TableHead>
                      <TableHead>備註</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBoardMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          <Badge variant={member.position === 'director' ? 'default' : 'secondary'} className="bg-urban-600">
                            {member.title}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {member.name}
                        </TableCell>
                        <TableCell>{member.memberId}</TableCell>
                        <TableCell>{member.contactPhone}</TableCell>
                        <TableCell className="text-blue-600 hover:underline">
                          <a href={`mailto:${member.email}`}>{member.email}</a>
                        </TableCell>
                        <TableCell>{member.notes}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="編輯">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="刪除" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="directors">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">職稱</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>會員編號</TableHead>
                      <TableHead>聯絡電話</TableHead>
                      <TableHead>電子郵件</TableHead>
                      <TableHead>備註</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBoardMembers
                      .filter(member => member.position === 'director')
                      .map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <Badge variant="default" className="bg-urban-600">
                              {member.title}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {member.name}
                          </TableCell>
                          <TableCell>{member.memberId}</TableCell>
                          <TableCell>{member.contactPhone}</TableCell>
                          <TableCell className="text-blue-600 hover:underline">
                            <a href={`mailto:${member.email}`}>{member.email}</a>
                          </TableCell>
                          <TableCell>{member.notes}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="編輯">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="刪除" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="supervisors">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">職稱</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>會員編號</TableHead>
                      <TableHead>聯絡電話</TableHead>
                      <TableHead>電子郵件</TableHead>
                      <TableHead>備註</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBoardMembers
                      .filter(member => member.position === 'supervisor')
                      .map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <Badge variant="secondary">
                              {member.title}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {member.name}
                          </TableCell>
                          <TableCell>{member.memberId}</TableCell>
                          <TableCell>{member.contactPhone}</TableCell>
                          <TableCell className="text-blue-600 hover:underline">
                            <a href={`mailto:${member.email}`}>{member.email}</a>
                          </TableCell>
                          <TableCell>{member.notes}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="編輯">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="刪除" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>歷屆理事長</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <div className="font-medium">第二屆 (現任)</div>
                  <div className="text-sm text-muted-foreground">2023-06-20 至今</div>
                </div>
                <div className="font-medium text-urban-700">王大明</div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <div className="font-medium">第一屆</div>
                  <div className="text-sm text-muted-foreground">2022-03-15 至 2023-06-19</div>
                </div>
                <div className="font-medium text-urban-700">張志豪</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>任期資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">現任理監事 (第二屆)</h3>
                <div className="rounded-md bg-muted p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">起始日期</div>
                      <div className="font-medium">2023-06-20</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">截止日期</div>
                      <div className="font-medium">2025-06-19</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">理事人數</div>
                      <div className="font-medium">5 人</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">監事人數</div>
                      <div className="font-medium">3 人</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">前任理監事 (第一屆)</h3>
                <div className="rounded-md bg-muted p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">起始日期</div>
                      <div className="font-medium">2022-03-15</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">截止日期</div>
                      <div className="font-medium">2023-06-19</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">理事人數</div>
                      <div className="font-medium">5 人</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">監事人數</div>
                      <div className="font-medium">3 人</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BoardManagement;
