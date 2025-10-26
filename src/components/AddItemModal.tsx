import { useState, useMemo } from 'react';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Item } from '@/types';

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: string;
  items: Item[];
  onAddItem: (item: Item) => void;
  onUpdateItemSupplier?: (itemId: string, newSupplier: string) => void;
  onCreateNewItem?: (name: string) => void;
}

export function AddItemModal({ open, onOpenChange, supplier, items, onAddItem, onUpdateItemSupplier, onCreateNewItem }: AddItemModalProps) {
  const [newItemName, setNewItemName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const filteredItems = useMemo(() => {
    if (showAllItems) {
      return items;
    }
    return supplier
      ? items.filter(item => item.supplier === supplier)
      : items;
  }, [items, supplier, showAllItems]);

  const handleCreateNew = () => {
    if (!newItemName.trim()) {
      toast.error('Item name cannot be empty');
      return;
    }

    if (onCreateNewItem) {
      onCreateNewItem(newItemName.trim());
      setNewItemName('');
      setShowNewInput(false);
      onOpenChange(false);
      toast.success(`Created item: ${newItemName.trim()}`);
    }
  };

  const handleItemSelect = (item: Item) => {
    if (showAllItems && item.supplier !== supplier && onUpdateItemSupplier) {
      onUpdateItemSupplier(item.id, supplier);
      toast.success(`Updated ${item.name} supplier to ${supplier}`);
    }
    onAddItem(item);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-popover text-popover-foreground rounded-lg shadow-lg w-[300px] p-0 z-50">
        <Command>
          <div className="p-3 pb-0 space-y-2">
            <CommandInput placeholder="Search items..." />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-all-items"
                checked={showAllItems}
                onCheckedChange={(checked) => setShowAllItems(checked === true)}
              />
              <Label
                htmlFor="show-all-items"
                className="text-sm font-normal cursor-pointer"
              >
                Show all items
              </Label>
            </div>
          </div>
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => handleItemSelect(item)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 opacity-0'
                    )}
                  />
                  <div className="flex flex-col flex-1">
                    <span>{item.name}</span>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      {item.unitTag && <span>{item.unitTag}</span>}
                      {showAllItems && item.supplier !== supplier && (
                        <span className="text-amber-600">({item.supplier})</span>
                      )}
                    </div>
                  </div>
                  <Plus className="w-4 h-4 ml-2 shrink-0" />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          {onCreateNewItem && (
            <div className="border-t p-2">
              {showNewInput ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="New item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateNew();
                      } else if (e.key === 'Escape') {
                        setShowNewInput(false);
                        setNewItemName('');
                      }
                    }}
                    className="flex-1"
                    autoFocus
                  />
                  <Button onClick={handleCreateNew} size="sm">
                    Add
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setShowNewInput(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create new item
                </Button>
              )}
            </div>
          )}
        </Command>
      </div>
    </div>
  );
}
