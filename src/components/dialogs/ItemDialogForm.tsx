import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ItemForm } from '@/components/forms/ItemForm';
import type { Category, Supplier } from '@/types';

interface ItemDialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    name: string;
    category: string;
    supplier: string;
  };
  onSave: (data: { name: string; category: string; supplier: string; emoji?: string }) => void;
  categories: Category[];
  suppliers: Supplier[];
  title?: string;
}

export function ItemDialogForm({
  open,
  onOpenChange,
  initialData = { name: '', category: '', supplier: '' },
  onSave,
  categories,
  suppliers,
  title = "Add New Item"
}: ItemDialogFormProps) {
  const [data, setData] = useState(initialData);

  const handleClose = () => {
    setData(initialData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ItemForm
          data={data}
          setData={setData}
          onSave={() => {
            onSave(data);
            handleClose();
          }}
          onCancel={handleClose}
          categories={categories}
          suppliers={suppliers}
        />
      </DialogContent>
    </Dialog>
  );
}