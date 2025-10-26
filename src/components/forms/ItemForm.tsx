import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

export function ItemForm({ data, setData, onSave, onCancel, isEdit, categories, suppliers }: {
  data: any;
  setData: (d: any) => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  isEdit?: boolean;
  categories: any[];
  suppliers: any[];
}) {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
            placeholder="Item name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={data.category}
            onValueChange={value => setData({ ...data, category: value })}
          >
            <SelectTrigger data-testid="select-item-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.emoji} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Supplier</label>
          <Select
            value={data.supplier}
            onValueChange={value => setData({ ...data, supplier: value })}
          >
            <SelectTrigger data-testid="select-item-supplier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map(sup => (
                <SelectItem key={sup.id} value={sup.name}>
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!data.name} data-testid={isEdit ? 'button-save-item-edit' : 'button-save-item-add'}>
          {isEdit ? 'Save Changes' : 'Add Item'}
        </Button>
      </DialogFooter>
    </>
  );
}