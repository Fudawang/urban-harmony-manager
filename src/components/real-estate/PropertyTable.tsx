
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Building, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RealEstateProperty } from "@/types/realEstate";

type PropertyTableProps = {
  properties: RealEstateProperty[];
  onDelete: (id: string) => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

const PropertyTable: React.FC<PropertyTableProps> = ({ 
  properties, 
  onDelete,
  title = "不動產清單",
  description = "管理都更會範圍內的不動產資料",
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
              <TableHead>面積(m²)</TableHead>
              <TableHead>地號/建號</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>最後更新</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length > 0 ? (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.address}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      property.type === '土地' ? 'bg-green-50 text-green-700 border-green-200' :
                      property.type === '建物' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-purple-50 text-purple-700 border-purple-200'
                    }>
                      {property.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.area}</TableCell>
                  <TableCell>{property.number}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      property.status === '更新前' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      property.status === '更新後' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2"
                      >
                        <FileText size={14} />
                        <span className="sr-only">檢視</span>
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
              ))
            ) : (
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
