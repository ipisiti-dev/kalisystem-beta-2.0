import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

export function CategoryForm({ data, setData, onSave, onCancel, isEdit, parentCategories }: {
  data: any;
  setData: (d: any) => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  isEdit?: boolean;
  parentCategories: string[];
}) {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
            placeholder="Category name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Parent Category (optional)</label>
          <Select
            value={data.parentCategory}
            onValueChange={value => setData({ ...data, parentCategory: value })}
          >
            <SelectTrigger data-testid="select-parent-category">
              <SelectValue placeholder="Select parent category (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {parentCategories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
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
        <Button onClick={onSave} disabled={!data.name} data-testid={isEdit ? 'button-save-category-edit' : 'button-save-category-add'}>
          {isEdit ? 'Save Changes' : 'Add Category'}
        </Button>
      </DialogFooter>
    </>
  );
}
