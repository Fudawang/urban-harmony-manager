
import React from 'react';
import { RealEstateProperty } from '@/types/realEstate';
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Building,
  MapPin, 
  Users, 
  FileText, 
  Pencil, 
  Trash,
  Square
} from 'lucide-react';

type PropertyTableProps = {
  properties: RealEstateProperty[];
  onDelete: (id: string) => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

const PropertyTable: React.FC<PropertyTableProps> = ({ 
  properties, 
  onDelete,
  title,
  description,
  icon = <Building size={20} className="text-urban-600" />
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>地址</TableHead>
              <TableHead>類型</TableHead>
              <TableHead>地段/地號</TableHead>
              <TableHead>面積(m²)</TableHead>
              <TableHead>所有權人數</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-urban-600" />
                    {property.address}
                  </div>
                </TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell>{property.section} {property.number}</TableCell>
                <TableCell>{property.area.toFixed(1)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-urban-600" />
                    {property.ownerCount}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    property.status === '更新前' ? 'bg-orange-100 text-orange-800' :
                    property.status === '更新後' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                    >
                      <FileText size={14} />
                      <span className="sr-only">詳情</span>
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
                      onClick={() => onDelete(property.id)}
                    >
                      <Trash size={14} />
                      <span className="sr-only">刪除</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {properties.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  沒有找到符合條件的不動產資料
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PropertyTable;
