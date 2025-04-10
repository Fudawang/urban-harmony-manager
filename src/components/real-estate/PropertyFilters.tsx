
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PropertyFiltersProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterType: string | undefined;
  setFilterType: React.Dispatch<React.SetStateAction<string | undefined>>;
  filterStatus: string | undefined;
  setFilterStatus: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Search size={20} className="text-urban-600" />
          搜尋與篩選
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="search">關鍵字搜尋</Label>
            <Input
              id="search"
              placeholder="搜尋地址、地號或行政區"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type-filter">類型</Label>
            <Select value={filterType} onValueChange={(value) => setFilterType(value || undefined)}>
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="全部類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部類型</SelectItem>
                <SelectItem value="土地">土地</SelectItem>
                <SelectItem value="建物">建物</SelectItem>
                <SelectItem value="土地及建物">土地及建物</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status-filter">狀態</Label>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value || undefined)}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="全部狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部狀態</SelectItem>
                <SelectItem value="更新前">更新前</SelectItem>
                <SelectItem value="更新後">更新後</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFilters;
