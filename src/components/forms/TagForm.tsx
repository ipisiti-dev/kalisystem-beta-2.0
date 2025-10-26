import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types';

function getRandomGradient() {
  // Example gradients, you can expand this list
  const gradients = [
    'linear-gradient(90deg, #3b82f6, #06b6d4)',
    'linear-gradient(90deg, #f59e42, #f43f5e)',
    'linear-gradient(90deg, #a78bfa, #f472b6)',
    'linear-gradient(90deg, #34d399, #3b82f6)',
    'linear-gradient(90deg, #fbbf24, #10b981)',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

export function TagForm({ data, setData, onSave, onCancel, categories }: {
  data: { name: string; category: string; color?: string; emoji?: string };
  setData: (d: any) => void;
  onSave: () => void;
  onCancel: () => void;
  categories: Category[];
}) {
  const [emoji, setEmoji] = useState(data.emoji || '');

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tag Name</label>
          <Input
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
            placeholder="Tag name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={data.category}
            onValueChange={value => setData({ ...data, category: value })}
          >
            <SelectTrigger data-testid="select-tag-category">
              <SelectValue placeholder="Select category" />
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
          <label className="text-sm font-medium">Emoji (optional)</label>
          <Input
            value={emoji}
            onChange={e => {
              setEmoji(e.target.value);
              setData({ ...data, emoji: e.target.value });
            }}
            placeholder="e.g. 🍕"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => {
          setData({ ...data, color: getRandomGradient() });
          onSave();
        }} disabled={!data.name || !data.category} data-testid="button-save-tag">
          Add Tag
        </Button>
      </DialogFooter>
    </>
  );
}
