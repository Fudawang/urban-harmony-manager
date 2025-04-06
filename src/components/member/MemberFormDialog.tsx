
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

// Form validation schema
const memberFormSchema = z.object({
  memberId: z.string().min(3, { message: '會員編號至少需要3個字元' }),
  idNumber: z.string().min(8, { message: '身分證號碼格式錯誤' }),
  name: z.string().min(2, { message: '姓名至少需要2個字元' }),
  city: z.string().min(2, { message: '請輸入縣市名稱' }),
  district: z.string().min(2, { message: '請輸入區域名稱' }),
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
}

const MemberFormDialog: React.FC<MemberFormDialogProps> = ({
  isOpen,
  onClose,
  member,
  onSubmit,
}) => {
  const isEditMode = !!member;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      memberId: '',
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

  // Update form values when editing a member
  useEffect(() => {
    if (member) {
      form.reset(member);
    } else {
      form.reset({
        memberId: '',
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
          <DialogTitle>{isEditMode ? '編輯會員資料' : '新增會員'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="memberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>會員編號</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                          <Input {...field} />
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
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} type="number" step="0.01" />
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} type="number" step="0.01" />
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
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '處理中...' : isEditMode ? '更新' : '新增'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberFormDialog;
