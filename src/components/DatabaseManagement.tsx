
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Link, 
  FileText, 
  FilePlus, 
  FileSearch,
  Settings,
  Trash,
  Download,
  Upload,
  Plus,
  Pencil,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';

type DatabaseTable = {
  id: number;
  name: string;
  recordCount: number;
  lastUpdated: string;
  description: string;
}

const DatabaseManagement: React.FC = () => {
  const [tables, setTables] = useState<DatabaseTable[]>([
    { 
      id: 1, 
      name: '地主資料', 
      recordCount: 85, 
      lastUpdated: '2024-04-05', 
      description: '都更範圍內的所有地主的基本聯絡資料。'
    },
    { 
      id: 2, 
      name: '土地資料', 
      recordCount: 42, 
      lastUpdated: '2024-04-01', 
      description: '都更範圍內的所有土地資料，包含地號、面積等資訊。'
    },
    { 
      id: 3, 
      name: '建物資料', 
      recordCount: 108, 
      lastUpdated: '2024-03-28', 
      description: '都更範圍內的所有建物資料，包含建號、面積、樓層等資訊。'
    },
    { 
      id: 4, 
      name: '會議記錄', 
      recordCount: 12, 
      lastUpdated: '2024-04-06', 
      description: '都更會所有會議的記錄，包含會議日期、出席人員、決議事項等。'
    }
  ]);

  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableDescription, setNewTableDescription] = useState('');
  const [isConnectionOpen, setIsConnectionOpen] = useState(false);

  const handleAddTable = () => {
    if (newTableName.trim() === '') {
      toast.error('請輸入資料表名稱');
      return;
    }

    const newTable: DatabaseTable = {
      id: tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1,
      name: newTableName,
      recordCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      description: newTableDescription
    };

    setTables([...tables, newTable]);
    setNewTableName('');
    setNewTableDescription('');
    setIsAddingTable(false);
    toast.success('已新增資料表');
  };

  const handleDeleteTable = (id: number) => {
    setTables(tables.filter(table => table.id !== id));
    toast.success('已刪除資料表');
  };

  const handleImportData = () => {
    toast.info('資料匯入功能開發中');
  };

  const handleExportData = () => {
    toast.info('資料匯出功能開發中');
  };

  const handleViewTableData = (tableName: string) => {
    toast.info(`正在載入 "${tableName}" 資料表內容`);
  };

  const handleCopyConnectionString = () => {
    navigator.clipboard.writeText('postgresql://user:password@db.urbanrenewal.org:5432/urban_renewal')
      .then(() => toast.success('連線資訊已複製到剪貼簿'))
      .catch(() => toast.error('複製連線資訊失敗'));
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">資料庫管理</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddingTable(true)} className="gap-1">
            <Plus size={16} />
            新增資料表
          </Button>
          <Button variant="outline" onClick={handleImportData} className="gap-1">
            <Upload size={16} />
            匯入資料
          </Button>
          <Button variant="outline" onClick={handleExportData} className="gap-1">
            <Download size={16} />
            匯出資料
          </Button>
        </div>
      </div>

      <Collapsible
        open={isConnectionOpen}
        onOpenChange={setIsConnectionOpen}
        className="w-full"
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Database size={20} className="text-urban-600" />
                資料庫連線資訊
              </CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isConnectionOpen ? '收起' : '展開'}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CardDescription>
              資料庫的連線資訊，可用於外部工具連接
            </CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pb-3">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="host">主機名稱</Label>
                    <Input id="host" value="db.urbanrenewal.org" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="port">連接埠</Label>
                    <Input id="port" value="5432" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="database">資料庫名稱</Label>
                    <Input id="database" value="urban_renewal" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="username">使用者名稱</Label>
                    <Input id="username" value="user" readOnly />
                  </div>
                </div>
                <div className="pt-2">
                  <Label htmlFor="connection-string">完整連線字串</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="connection-string" 
                      value="postgresql://user:password@db.urbanrenewal.org:5432/urban_renewal" 
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleCopyConnectionString}
                      className="flex-shrink-0"
                    >
                      複製
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {isAddingTable && (
        <Card>
          <CardHeader>
            <CardTitle>新增資料表</CardTitle>
            <CardDescription>
              填寫以下資訊來新增資料表
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="table-name">資料表名稱</Label>
                <Input 
                  id="table-name" 
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="例如：地主資料、土地資料等"
                />
              </div>
              <div>
                <Label htmlFor="table-description">資料表描述</Label>
                <Input 
                  id="table-description" 
                  value={newTableDescription}
                  onChange={(e) => setNewTableDescription(e.target.value)}
                  placeholder="簡短描述此資料表的用途"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingTable(false)}>
              取消
            </Button>
            <Button onClick={handleAddTable}>
              新增
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Database size={20} className="text-urban-600" />
            資料表清單
          </CardTitle>
          <CardDescription>
            管理都更會使用的各種資料表
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>資料表名稱</TableHead>
                <TableHead>資料筆數</TableHead>
                <TableHead>最後更新</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-urban-600" />
                      {table.name}
                    </div>
                  </TableCell>
                  <TableCell>{table.recordCount}</TableCell>
                  <TableCell>{table.lastUpdated}</TableCell>
                  <TableCell className="max-w-xs truncate" title={table.description}>
                    {table.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewTableData(table.name)}
                        className="h-8 px-2"
                      >
                        <FileSearch size={14} />
                        <span className="sr-only">查看</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2"
                      >
                        <Pencil size={14} />
                        <span className="sr-only">編輯</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTable(table.id)}
                      >
                        <Trash size={14} />
                        <span className="sr-only">刪除</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Link size={20} className="text-urban-600" />
            相關資源連結
          </CardTitle>
          <CardDescription>
            都更資料庫相關的外部資源連結
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
              <Link size={16} className="text-urban-600 flex-shrink-0" />
              <a href="https://data.gov.tw/dataset/102765" target="_blank" rel="noopener noreferrer" className="text-urban-600 hover:underline">
                內政部營建署都市更新核准案件資料集
              </a>
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
              <Link size={16} className="text-urban-600 flex-shrink-0" />
              <a href="https://urban.cpami.gov.tw/" target="_blank" rel="noopener noreferrer" className="text-urban-600 hover:underline">
                內政部營建署都市更新入口網
              </a>
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
              <Link size={16} className="text-urban-600 flex-shrink-0" />
              <a href="https://land.planning.gov.tw/" target="_blank" rel="noopener noreferrer" className="text-urban-600 hover:underline">
                內政部國土規劃地理資訊圖台
              </a>
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
              <Link size={16} className="text-urban-600 flex-shrink-0" />
              <a href="https://www.land.nat.gov.tw/" target="_blank" rel="noopener noreferrer" className="text-urban-600 hover:underline">
                內政部地政司全球資訊網
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseManagement;
