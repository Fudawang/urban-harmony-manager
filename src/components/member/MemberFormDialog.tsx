
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateMemberId, getFilters } from '@/services/memberService';

// Form validation schema
const memberFormSchema = z.object({
  idNumber: z.string().min(8, { message: '身分證號碼格式錯誤' }),
  name: z.string().min(2, { message: '姓名至少需要2個字元' }),
  city: z.string().min(2, { message: '請選擇縣市名稱' }),
  district: z.string().min(2, { message: '請選擇區域名稱' }),
  section: z.string().min(1, { message: '請輸入段名稱' }),
  subSection: z.string().min(1, { message: '請輸入小段名稱' }),
  landNumber: z.string().min(1, { message: '請輸入地號' }),
  landShare: z.string().min(1, { message: '請輸入土地持分' }),
  landArea: z.string().min(1, { message: '請輸入土地面積' }),
  buildingNumber: z.string().min(1, { message: '請輸入建號' }),
  buildingShare: z.string().min(1, { message: '請輸入建物持分' }),
  buildingArea: z.string().min(1, { message: '請輸入建物面積' }),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

type Member = {
  id?: string;
  memberId: string;
  idNumber: string;
  name: string;
  city: string;
  district: string;
  section: string;
  subSection: string;
  landNumber: string;
  landShare: string;
  landArea: string;
  buildingNumber: string;
  buildingShare: string;
  buildingArea: string;
};

interface MemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member;
  onSubmit: (data: MemberFormValues) => Promise<void>;
  readonly?: boolean; // Add readonly prop to support view mode
}

const MemberFormDialog: React.FC<MemberFormDialogProps> = ({
  isOpen,
  onClose,
  member,
  onSubmit,
  readonly = false, // Default to false
}) => {
  const isEditMode = !!member;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<{[key: string]: string[]}>({});
  const [selectedCity, setSelectedCity] = useState<string>('台北市');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      idNumber: '',
      name: '',
      city: '台北市',
      district: '中山區',
      section: '中山段',
      subSection: '一小段',
      landNumber: '',
      landShare: '',
      landArea: '',
      buildingNumber: '',
      buildingShare: '',
      buildingArea: '',
    },
  });

  // Load available city and district filters
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const { cities: citiesData, districts: districtsData } = await getFilters();
        setCities(citiesData);
        setDistricts(districtsData);
        
        // Initialize available districts
        if (member?.city && districtsData[member.city]) {
          setSelectedCity(member.city);
          setAvailableDistricts(districtsData[member.city]);
        } else if (districtsData['台北市']) {
          setAvailableDistricts(districtsData['台北市']);
        }
      } catch (error) {
        console.error('Error loading location filters:', error);
      }
    };
    
    loadFilters();
  }, [member]);

  // Update districts when city changes
  useEffect(() => {
    if (districts[selectedCity]) {
      setAvailableDistricts(districts[selectedCity]);
      
      // Set the first district as default if current selection is not in the new city
      const currentDistrict = form.getValues('district');
      if (!districts[selectedCity].includes(currentDistrict)) {
        form.setValue('district', districts[selectedCity][0]);
      }
    }
  }, [selectedCity, districts, form]);

  // Update form values when editing a member
  useEffect(() => {
    if (member) {
      form.reset({
        idNumber: member.idNumber,
        name: member.name,
        city: member.city,
        district: member.district,
        section: member.section,
        subSection: member.subSection,
        landNumber: member.landNumber,
        landShare: member.landShare,
        landArea: member.landArea,
        buildingNumber: member.buildingNumber,
        buildingShare: member.buildingShare,
        buildingArea: member.buildingArea,
      });
      
      setSelectedCity(member.city);
    } else {
      form.reset({
        idNumber: '',
        name: '',
        city: '台北市',
        district: '中山區',
        section: '中山段',
        subSection: '一小段',
        landNumber: '',
        landShare: '',
        landArea: '',
        buildingNumber: '',
        buildingShare: '',
        buildingArea: '',
      });
      
      setSelectedCity('台北市');
    }
  }, [member, form]);

  const handleSubmit = async (data: MemberFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      onClose();
      toast.success(isEditMode ? '會員資料已更新' : '會員已新增');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('操作失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {readonly ? '查看會員資料' : isEditMode ? '編輯會員資料' : '新增會員'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditMode && (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>會員編號</FormLabel>
                  <Input value={member?.memberId || ''} readOnly className="bg-gray-100" />
                </FormItem>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={readonly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>身分證號碼</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={readonly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <h3 className="text-lg font-medium mt-2 mb-4">土地資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>縣市</FormLabel>
                        <Select
                          disabled={readonly}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCity(value);
                          }}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇縣市" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>區域</FormLabel>
                        <Select
                          disabled={readonly}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇區域" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>段</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subSection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>小段</FormLabel>
                        <Select
                          disabled={readonly}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇小段" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="一小段">一小段</SelectItem>
                            <SelectItem value="二小段">二小段</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="landNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>地號</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="landShare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>土地持分</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="landArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>土地面積(m²)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" readOnly={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="col-span-2">
                <h3 className="text-lg font-medium mt-2 mb-4">建物資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="buildingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>建號</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buildingShare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>建物持分</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buildingArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>建物面積(m²)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" readOnly={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {readonly ? '關閉' : '取消'}
              </Button>
              {!readonly && (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '處理中...' : isEditMode ? '更新' : '新增'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberFormDialog;
