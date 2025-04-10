
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';

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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

// Form validation schema
const meetingFormSchema = z.object({
  title: z.string().min(2, { message: '標題至少需要2個字元' }),
  type: z.enum(['general', 'board'], {
    required_error: '請選擇會議類型',
  }),
  term: z.coerce.number().min(1, { message: '屆次必須大於0' }),
  number: z.coerce.number().min(1, { message: '第次必須大於0' }),
  date: z.date({
    required_error: '請選擇日期',
  }),
  location: z.string().min(2, { message: '請輸入會議地點' }),
  status: z.enum(['upcoming', 'in-progress', 'completed'], {
    required_error: '請選擇會議狀態',
  }),
  totalMembers: z.coerce.number().min(1, { message: '總人數必須大於0' }),
  attendees: z.coerce.number().optional(),
  documents: z.coerce.number().min(0, { message: '文件數量不能為負' }).optional(),
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

type Meeting = {
  id?: string;
  type: 'general' | 'board';
  term: number;
  number: number;
  title: string;
  date: string;
  location: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  attendees: number;
  totalMembers: number;
  documents: number;
};

interface MeetingFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meeting?: Meeting;
  onSubmit: (data: Omit<Meeting, 'id'>) => Promise<void>;
  readonly?: boolean;
}

const MeetingFormDialog: React.FC<MeetingFormDialogProps> = ({
  isOpen,
  onClose,
  meeting,
  onSubmit,
  readonly = false,
}) => {
  const isEditMode = !!meeting;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: '',
      type: 'general',
      term: 1,
      number: 1,
      date: new Date(),
      location: '',
      status: 'upcoming',
      totalMembers: 126,
      attendees: 0,
      documents: 0,
    },
  });

  // Update form values when editing a meeting
  useEffect(() => {
    if (meeting) {
      form.reset({
        title: meeting.title,
        type: meeting.type,
        term: meeting.term,
        number: meeting.number,
        date: new Date(meeting.date),
        location: meeting.location,
        status: meeting.status,
        totalMembers: meeting.totalMembers,
        attendees: meeting.attendees,
        documents: meeting.documents,
      });
    } else {
      form.reset({
        title: '',
        type: 'general',
        term: 1,
        number: 1,
        date: new Date(),
        location: '',
        status: 'upcoming',
        totalMembers: 126,
        attendees: 0,
        documents: 0,
      });
    }
  }, [meeting, form]);

  const handleSubmit = async (data: MeetingFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Ensure all required properties are included and properly typed
      const formattedData: Omit<Meeting, 'id'> = {
        title: data.title,
        type: data.type,
        term: data.term,
        number: data.number,
        date: format(data.date, 'yyyy-MM-dd'),
        location: data.location,
        status: data.status,
        totalMembers: data.totalMembers,
        attendees: data.attendees || 0,
        documents: data.documents || 0,
      };
      
      await onSubmit(formattedData);
      form.reset();
      onClose();
      toast.success(isEditMode ? '會議資料已更新' : '會議已新增');
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
          <DialogTitle>{isEditMode ? (readonly ? '查看會議資料' : '編輯會議資料') : '新增會議'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>會議標題</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={readonly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>會議類型</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                      disabled={readonly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="請選擇會議類型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">會員大會</SelectItem>
                        <SelectItem value="board">理監事會議</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>屆次</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" readOnly={readonly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>第次</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" readOnly={readonly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>會議日期</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild disabled={readonly}>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd")
                            ) : (
                              <span>請選擇日期</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01") || readonly}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>會議地點</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={readonly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>會議狀態</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                      disabled={readonly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="請選擇會議狀態" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upcoming">即將舉行</SelectItem>
                        <SelectItem value="in-progress">進行中</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>總人數</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" readOnly={readonly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attendees"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>出席人數</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={value !== undefined ? value : ''} 
                        onChange={(e) => onChange(e.target.value === '' ? undefined : parseInt(e.target.value))} 
                        type="number" 
                        min="0"
                        readOnly={readonly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documents"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>文件數</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={value !== undefined ? value : ''} 
                        onChange={(e) => onChange(e.target.value === '' ? undefined : parseInt(e.target.value))} 
                        type="number" 
                        min="0" 
                        readOnly={readonly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default MeetingFormDialog;
