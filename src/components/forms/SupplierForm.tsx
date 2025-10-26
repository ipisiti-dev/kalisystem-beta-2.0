import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { PAYMENT_TAGS, ORDER_TYPE_TAGS } from '@/constants/tags';
import React from 'react';

export interface SupplierFormProps {
  data: any;
  setData: (d: any) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit?: boolean;
  onDelete?: () => void;
}

export function SupplierForm({ data, setData, onSave, onCancel, isEdit, onDelete }: SupplierFormProps) {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
            placeholder="Supplier name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Contact (Telegram/URL)</label>
          <Input
            value={data.contact}
            onChange={e => setData({ ...data, contact: e.target.value })}
            placeholder="https://t.me/lelegram"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Picture URL</label>
          <Input
            value={data.imageUrl || ''}
            onChange={e => setData({ ...data, imageUrl: e.target.value })}
            placeholder="https://..."
          />
          {data.imageUrl && (
            <img src={data.imageUrl} alt="profile preview" className="w-16 h-16 rounded-full object-cover border mt-1" />
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Default Payment Method</label>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_TAGS.map(tag => (
              <Button
                key={tag.value}
                size="sm"
                variant={data.defaultPaymentMethod === tag.value ? 'default' : 'outline'}
                onClick={() => setData({ ...data, defaultPaymentMethod: tag.value })}
                style={data.defaultPaymentMethod === tag.value ? { fontWeight: 600 } : {}}
                data-testid={`tag-payment-${tag.value}`}
              >
                {tag.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Default Order Type</label>
          <div className="flex flex-wrap gap-2">
            {ORDER_TYPE_TAGS.map(tag => (
              <Button
                key={tag.value}
                size="sm"
                variant={data.defaultOrderType === tag.value ? 'default' : 'outline'}
                onClick={() => setData({ ...data, defaultOrderType: tag.value })}
                style={data.defaultOrderType === tag.value ? { fontWeight: 600 } : {}}
                data-testid={`tag-ordertype-${tag.value}`}
              >
                {tag.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {isEdit && onDelete && (
          <Button variant="destructive" onClick={onDelete} data-testid="button-delete-supplier">
            Delete
          </Button>
        )}
        <Button onClick={onSave} disabled={!data.name} data-testid={isEdit ? 'button-save-supplier-edit' : 'button-save-supplier-add'}>
          {isEdit ? 'Save Changes' : 'Add Supplier'}
        </Button>
      </DialogFooter>
    </>
  );
}
