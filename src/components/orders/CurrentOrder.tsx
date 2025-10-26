import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PAYMENT_METHODS, ORDER_TYPES, STORE_TAGS, OrderItem, PaymentMethod, OrderType, StoreTag } from '@/types';
import { QuantityInput } from '@/components/QuantityInput';
import { Trash2, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface CurrentOrderProps {
  currentOrder: OrderItem[];
  currentOrderMetadata: {
    orderType: OrderType;
    manager?: string;
    store?: string;
    paymentMethod?: PaymentMethod;
  };
  updateOrderItem: (itemId: string, quantity: number, storeTag?: string) => void;
  removeFromOrder: (itemId: string, storeTag?: string) => void;
  updateOrderMetadata: (metadata: { orderType?: OrderType; manager?: string; store?: string; paymentMethod?: PaymentMethod }) => void;
}

export function CurrentOrder({
  currentOrder,
  currentOrderMetadata,
  updateOrderItem,
  removeFromOrder,
  updateOrderMetadata,
}: CurrentOrderProps) {
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  
  const groupBySupplier = () => {
    const groups: Record<string, typeof currentOrder> = {};
    
    currentOrder.forEach(orderItem => {
      const supplier = orderItem.item.supplier || 'Unknown';
      if (!groups[supplier]) {
        groups[supplier] = [];
      }
      groups[supplier].push(orderItem);
    });

    return groups;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid gap-4 mb-4">
          <Select
            value={currentOrderMetadata.orderType}
            onValueChange={(value: OrderType) => updateOrderMetadata({ orderType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select order type" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentOrderMetadata.paymentMethod}
            onValueChange={(value: PaymentMethod) => updateOrderMetadata({ paymentMethod: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map(method => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentOrderMetadata.store}
            onValueChange={(store: StoreTag) => updateOrderMetadata({ store })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {STORE_TAGS.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        {Object.entries(groupBySupplier()).map(([supplier, items]) => (
          <Card key={supplier} className="p-4">
            <h3 className="font-semibold mb-4">{supplier}</h3>
            <div className="space-y-4">
              {items.map(({ item, quantity, storeTag }) => (
                <div key={`${item.id}-${storeTag}`} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {storeTag && (
                      <div className="text-sm text-muted-foreground">[{storeTag}]</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <QuantityInput
                      value={quantity}
                      onChange={(value) => updateOrderItem(item.id, value, storeTag)}
                    />
                    {showTagsPanel && (
                      <Select
                        value={storeTag}
                        onValueChange={(value: StoreTag) => {
                          removeFromOrder(item.id, storeTag);
                          updateOrderItem(item.id, quantity, value);
                        }}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                        <SelectContent>
                          {STORE_TAGS.map(tag => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromOrder(item.id, storeTag)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {currentOrder.length > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowTagsPanel(!showTagsPanel)}
        >
          <Tag className="w-4 h-4 mr-2" />
          {showTagsPanel ? (
            <>Hide Tags <ChevronUp className="w-4 h-4 ml-2" /></>
          ) : (
            <>Show Tags <ChevronDown className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      )}
    </div>
  );
}