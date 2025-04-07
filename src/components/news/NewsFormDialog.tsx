
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import NewsForm from './NewsForm';
import { NewsItem } from '@/contexts/AssociationContext';

interface NewsFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<NewsItem, 'id'>) => void;
  defaultValues?: Partial<Omit<NewsItem, 'id'>>;
  isEditing?: boolean;
}

const NewsFormDialog: React.FC<NewsFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isEditing = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? '編輯消息' : '新增消息'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? '修改更新會消息內容，設定是否公開顯示。' 
              : '新增更新會最新消息，可設定是否公開顯示。'}
          </DialogDescription>
        </DialogHeader>
        <NewsForm 
          defaultValues={defaultValues} 
          onSubmit={onSubmit} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewsFormDialog;
