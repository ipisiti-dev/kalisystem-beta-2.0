import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { ItemForm } from '@/components/forms/ItemForm';
import { Input } from '@/components/ui/input';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { ItemCard } from '@/components/cards/ItemCard';
import { Item, Category, Supplier } from '@/types';

export function GroupCard({ 
  groupName, 
  groupBy, 
  items, 
  categories, 
  posMode, 
  onQuickAdd,
  allSuppliers,
  addItem
}: { 
  groupName: string; 
  groupBy: 'category' | 'supplier';
  items: Item[]; 
  categories: Category[];
  posMode: boolean; 
  onQuickAdd: (item: Item) => void;
  allSuppliers: Supplier[];
  addItem: (item: Omit<Item, 'id'>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: categories.find(c => c.name === 'Notset')?.name || groupName,
    supplier: allSuppliers[0]?.name || '',
  });

  const categoryEmoji = groupBy === 'category' 
    ? categories.find(c => c.name === groupName)?.emoji || '📁'
    : '';

  const { addItem: addItemToContext } = useApp();

  const handleAddItem = () => {
    if (!newItemData.name.trim()) {
      toast.error('Please enter item name');
      return;
    }
    addItemToContext({
      name: newItemData.name,
      category: newItemData.category,
      supplier: newItemData.supplier,
      tags: [],
    });
    toast.success('Item added successfully');
    setIsNewItemOpen(false);
    setNewItemData({
      name: '',
      category: groupName,
      supplier: allSuppliers[0]?.name || '',
    });
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="bg-card border-border">
          <div className="p-4 flex items-center justify-between">
            <CollapsibleTrigger
              className="flex items-center gap-2 flex-1"
              data-testid={`group-trigger-${groupName}`}
              asChild
            >
              <div className="flex items-center gap-2">
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                <span className="text-xl">{categoryEmoji}</span>
                <h3 className="font-semibold">{groupName}</h3>
                <Badge variant="secondary" className="text-xs">{items.length} items</Badge>
              </div>
            </CollapsibleTrigger>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setIsNewItemOpen(true);
              }}
              data-testid={`button-add-item-${groupName}`}
              style={{
                background: 'linear-gradient(90deg, #ff6ec4 0%, #f7971e 100%)',
                color: 'white',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(255,110,196,0.15)',
                padding: '0.5rem',
                minWidth: '2.5rem',
                minHeight: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-2">
              {items.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  posMode={posMode}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* New Item Dialog */}
      <Dialog open={isNewItemOpen} onOpenChange={setIsNewItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item to {groupName}</DialogTitle>
          </DialogHeader>
          <ItemForm
            data={newItemData}
            setData={setNewItemData}
            onSave={handleAddItem}
            onCancel={() => setIsNewItemOpen(false)}
            categories={categories}
            suppliers={allSuppliers}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
