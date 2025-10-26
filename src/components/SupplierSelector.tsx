import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, Edit } from 'lucide-react';
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
import { toast } from 'sonner';
import { useLongPress } from '@/hooks/use-long-press';

import { Supplier } from '@/types';

interface SupplierSelectorProps {
  value: string;
  suppliers: Supplier[];
  onSelect: (supplier: string) => void;
  onCreateNew: (name: string) => void;
  onEditSupplier?: (supplier: Supplier) => void;
}

export function SupplierSelector({ value, suppliers, onSelect, onCreateNew, onEditSupplier }: SupplierSelectorProps) {
  const [open, setOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);

  const handleCreateNew = () => {
    if (!newSupplierName.trim()) {
      toast.error('Supplier name cannot be empty');
      return;
    }
    
    onCreateNew(newSupplierName.trim());
    setNewSupplierName('');
    setShowNewInput(false);
    setOpen(false);
    toast.success(`Created supplier: ${newSupplierName.trim()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-semibold"
        >
          {value.toUpperCase()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search suppliers..." />
          <CommandList>
            <CommandEmpty>No supplier found.</CommandEmpty>
            <CommandGroup>
              {suppliers.map((supplier) => {
                const longPressProps = onEditSupplier ? useLongPress({
                  onLongPress: () => {
                    onEditSupplier(supplier);
                    setOpen(false);
                  }
                }) : {};

                return (
                  <CommandItem
                    key={supplier.id}
                    value={supplier.name}
                    onSelect={() => {
                      onSelect(supplier.name);
                      setOpen(false);
                    }}
                    onContextMenu={(e) => {
                      if (onEditSupplier) {
                        e.preventDefault();
                        onEditSupplier(supplier);
                        setOpen(false);
                      }
                    }}
                    {...longPressProps}
                    className="relative group"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === supplier.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {supplier.name.toUpperCase()}
                    {onEditSupplier && (
                      <Edit className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          
          <div className="border-t p-2">
            {showNewInput ? (
              <div className="flex gap-2">
                <Input
                  placeholder="New supplier name"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateNew();
                    } else if (e.key === 'Escape') {
                      setShowNewInput(false);
                      setNewSupplierName('');
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
                Create new supplier
              </Button>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
