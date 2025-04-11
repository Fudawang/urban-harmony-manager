
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Plus, 
  Square,
  Users,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RealEstateProperty } from '@/types/realEstate';
import PropertyTable from './real-estate/PropertyTable';
import PropertyForm from './real-estate/PropertyForm';
import PropertyFilters from './real-estate/PropertyFilters';
import OwnerManagement from './real-estate/OwnerManagement';
import { getProperties, createProperty, deleteProperty } from '@/services/supabaseServices/realEstateService';

const RealEstateManagement: React.FC = () => {
  const [properties, setProperties] = useState<RealEstateProperty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [activeTab, setActiveTab] = useState("properties");
  const [activePropertyTab, setActivePropertyTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  
  const [newProperty, setNewProperty] = useState<Omit<RealEstateProperty, 'id' | 'lastUpdated'>>({
    address: '',
    type: '土地',
    area: 0,
    ownerCount: 0,
    district: '',
    section: '',
    number: '',
    status: '更新前'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('無法載入不動產資料');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.district.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = !filterType || filterType === 'all' || property.type === filterType;
    const matchesStatus = !filterStatus || filterStatus === 'all' || property.status === filterStatus;
    
    // Filter by tab selection
    const matchesTab = 
      activePropertyTab === "all" || 
      (activePropertyTab === "land" && (property.type === '土地' || property.type === '土地及建物')) ||
      (activePropertyTab === "building" && (property.type === '建物' || property.type === '土地及建物'));
    
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  const handleAddProperty = async () => {
    if (!newProperty.address || !newProperty.district || !newProperty.number) {
      toast.error('請填寫必要欄位');
      return;
    }

    try {
      await createProperty(newProperty);
      toast.success('已新增不動產');
      await fetchProperties();
      
      setIsAddingProperty(false);
      setNewProperty({
        address: '',
        type: '土地',
        area: 0,
        ownerCount: 0,
        district: '',
        section: '',
        number: '',
        status: '更新前'
      });
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('新增不動產失敗');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteProperty(id);
      toast.success('已刪除不動產');
      await fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('刪除不動產失敗');
    }
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">不動產管理</h1>
      </div>

      <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building size={16} />
            不動產資料
          </TabsTrigger>
          <TabsTrigger value="owners" className="flex items-center gap-2">
            <Users size={16} />
            所有權人資料
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">不動產資料管理</h2>
            <Button onClick={() => setIsAddingProperty(true)} className="gap-1">
              <Plus size={16} />
              新增不動產
            </Button>
          </div>
          
          <PropertyFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
          
          {isAddingProperty && (
            <PropertyForm 
              newProperty={newProperty}
              setNewProperty={setNewProperty}
              handleAddProperty={handleAddProperty}
              onCancel={() => setIsAddingProperty(false)}
            />
          )}
          
          <Tabs defaultValue="all" value={activePropertyTab} onValueChange={setActivePropertyTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Layers size={16} />
                全部不動產
              </TabsTrigger>
              <TabsTrigger value="land" className="flex items-center gap-2">
                <Square size={16} />
                土地清冊
              </TabsTrigger>
              <TabsTrigger value="building" className="flex items-center gap-2">
                <Building size={16} />
                建物清冊
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="flex justify-center py-8 text-muted-foreground">正在載入資料...</div>
              ) : (
                <PropertyTable 
                  properties={filteredProperties} 
                  onDelete={handleDeleteProperty}
                  title="不動產清單"
                  description="管理都更會範圍內的全部不動產資料"
                />
              )}
            </TabsContent>
            
            <TabsContent value="land">
              {isLoading ? (
                <div className="flex justify-center py-8 text-muted-foreground">正在載入資料...</div>
              ) : (
                <PropertyTable 
                  properties={filteredProperties.filter(p => p.type === '土地' || p.type === '土地及建物')} 
                  onDelete={handleDeleteProperty}
                  title="土地清冊"
                  description="管理都更會範圍內的土地資料"
                  icon={<Square size={20} className="text-urban-600" />}
                />
              )}
            </TabsContent>
            
            <TabsContent value="building">
              {isLoading ? (
                <div className="flex justify-center py-8 text-muted-foreground">正在載入資料...</div>
              ) : (
                <PropertyTable 
                  properties={filteredProperties.filter(p => p.type === '建物' || p.type === '土地及建物')} 
                  onDelete={handleDeleteProperty} 
                  title="建物清冊"
                  description="管理都更會範圍內的建物資料"
                  icon={<Building size={20} className="text-urban-600" />}
                />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="owners">
          <OwnerManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealEstateManagement;
