
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAssociation } from '@/contexts/AssociationContext';
import { useToast } from '@/hooks/use-toast';
import NewsManagement from './news/NewsManagement';
import PublicInfoManagement from './PublicInfoManagement';
import { useSearchParams } from 'react-router-dom';
import { Settings as SettingsIcon, Newspaper, Globe, Database } from 'lucide-react';
import SystemStatusCheck from './system/SystemStatusCheck';
import VersionInfo from './system/VersionInfo';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "更新會名稱不能少於2個字",
  }),
  president: z.string().min(2, {
    message: "會長姓名不能少於2個字",
  }),
  phone: z.string().min(8, {
    message: "請輸入有效的電話號碼",
  }),
  email: z.string().email({
    message: "請輸入有效的電子郵件地址",
  }),
  address: z.string().min(5, {
    message: "地址不能少於5個字",
  }),
  foundingDate: z.string(),
  unifiedNumber: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Settings = () => {
  const { associationInfo, updateAssociationInfo } = useAssociation();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get tab from URL or default to "basic"
  const tab = searchParams.get('tab') || 'basic';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: associationInfo.name,
      president: associationInfo.president,
      phone: associationInfo.phone,
      email: associationInfo.email,
      address: associationInfo.address,
      foundingDate: associationInfo.foundingDate,
      unifiedNumber: associationInfo.unifiedNumber,
    },
  });

  // Update the URL when tab changes
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };
  
  // Set form values when associationInfo changes
  useEffect(() => {
    form.reset({
      name: associationInfo.name,
      president: associationInfo.president,
      phone: associationInfo.phone,
      email: associationInfo.email,
      address: associationInfo.address,
      foundingDate: associationInfo.foundingDate,
      unifiedNumber: associationInfo.unifiedNumber,
    });
  }, [associationInfo, form]);

  function onSubmit(values: FormData) {
    updateAssociationInfo(values);
    toast({
      title: "更新成功",
      description: "更新會資訊已更新",
    });
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-urban-800">系統設定</h1>

      <Tabs value={tab} onValueChange={handleTabChange} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-1">
            <SettingsIcon className="h-4 w-4" />
            基本設定
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            系統狀態
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-1">
            <Newspaper className="h-4 w-4" />
            最新消息管理
          </TabsTrigger>
          <TabsTrigger value="public-info" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            公開資訊管理
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">更新會資訊</CardTitle>
              <CardDescription>
                更新會的基本資訊設定，這些資訊將顯示在系統首頁及相關文件中。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>更新會名稱</FormLabel>
                          <FormControl>
                            <Input placeholder="都市更新會名稱" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="president"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>會長姓名</FormLabel>
                          <FormControl>
                            <Input placeholder="會長姓名" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>聯絡電話</FormLabel>
                          <FormControl>
                            <Input placeholder="聯絡電話" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>電子郵件</FormLabel>
                          <FormControl>
                            <Input placeholder="電子郵件" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>聯絡地址</FormLabel>
                          <FormControl>
                            <Input placeholder="聯絡地址" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="foundingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>成立日期</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unifiedNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>統一編號</FormLabel>
                          <FormControl>
                            <Input placeholder="統一編號" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">儲存設定</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="pt-4">
          <div className="grid gap-6">
            <SystemStatusCheck />
            <VersionInfo />
          </div>
        </TabsContent>
        
        <TabsContent value="news" className="pt-4">
          <NewsManagement />
        </TabsContent>
        
        <TabsContent value="public-info" className="pt-4">
          <PublicInfoManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
