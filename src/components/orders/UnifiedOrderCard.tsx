import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuantityInput } from '@/components/QuantityInput';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Trash2,
  Tag as TagIcon,
  Plus,
  Package,
  CheckCircle,
  DollarSign,
  FileText,
  MessageSquare,
  Share2,
  CheckCheck
} from 'lucide-react';
import {
  PendingOrder,
  PendingOrderStatus,
  PaymentMethod,
  OrderType,
  StoreTag,
  PAYMENT_METHODS,
  ORDER_TYPES,
  STORE_TAGS
} from '@/types';

interface UnifiedOrderCardProps {
  order: PendingOrder;
  status: PendingOrderStatus;
  onUpdateOrder: (orderId: string, updates: Partial<PendingOrder>) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddItem: (orderId: string) => void;
  onSetAmount: (orderId: string) => void;
  onAttachInvoice: (orderId: string) => void;
  onOrderMessage: (orderId: string) => void;
  onShare?: (order: PendingOrder) => void;
  showExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export function UnifiedOrderCard({
  order,
  status,
  onUpdateOrder,
  onDeleteOrder,
  onAddItem,
  onSetAmount,
  onAttachInvoice,
  onOrderMessage,
  onShare,
  showExpanded = true,
  onToggleExpanded
}: UnifiedOrderCardProps) {
  const [tagsPopoverOpen, setTagsPopoverOpen] = useState(false);
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);

  const canEdit = status !== 'completed';
  const canEditOrderDetails = status !== 'completed' && !order.isReceived;

  const getStatusIcon = (status: PendingOrderStatus) => {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCheck className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: PendingOrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'completed':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
    }
  };

  const handleQuantityChange = (idx: number, qty: number) => {
    const updatedItems = [...order.items];
    updatedItems[idx] = { ...updatedItems[idx], quantity: qty };
    onUpdateOrder(order.id, { items: updatedItems });
  };

  const handleRemoveItem = (idx: number) => {
    const updatedItems = order.items.filter((_, i) => i !== idx);
    onUpdateOrder(order.id, { items: updatedItems });
    setEditingQuantityId(null);
  };

  return (
    <Card className="p-4 bg-card border-border" data-testid={`order-card-${order.id}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-semibold text-lg">{order.supplier}</h3>
            {order.paymentMethod && (
              <span className="text-sm">
                {order.paymentMethod === 'COD' ? '💰' : order.paymentMethod === 'Aba' ? '💳' : order.paymentMethod === 'TrueMoney' ? '🧧' : '💸'}
              </span>
            )}
            {order.orderType && (
              <span className="text-sm">
                {order.orderType === 'Delivery' ? '🚚' : '📦'}
              </span>
            )}
            {order.storeTag && (
              <span className="text-sm">📌 {order.storeTag.toUpperCase()}</span>
            )}
            <Badge className={`gap-1 ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              {status}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteOrder(order.id)}
            data-testid={`button-delete-${order.id}`}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>

        {showExpanded && (
          <>
            <div className="space-y-2">
              {order.items.map((orderItem, idx) => {
                const itemId = `${order.id}-${idx}`;
                const isEditingQuantity = editingQuantityId === itemId;

                return (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{orderItem.item.name}</p>
                    </div>
                    {canEditOrderDetails && isEditingQuantity ? (
                      <>
                        <QuantityInput
                          value={orderItem.quantity}
                          onChange={(qty) => handleQuantityChange(idx, qty)}
                          data-testid={`quantity-${order.id}-${idx}`}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveItem(idx)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {canEditOrderDetails ? (
                          <Button variant="ghost" onClick={() => setEditingQuantityId(itemId)}>
                            x{orderItem.quantity}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">x{orderItem.quantity}</span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {canEditOrderDetails && (
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-1"
                onClick={() => onAddItem(order.id)}
              >
                <Plus className="w-3 h-3" />
                Add Item
              </Button>
            )}

            {canEditOrderDetails && (
              <Popover open={tagsPopoverOpen} onOpenChange={setTagsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <TagIcon className="w-3 h-3" />
                    Edit Tags
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select
                        value={order.paymentMethod || ''}
                        onValueChange={(value) => onUpdateOrder(order.id, { paymentMethod: value as PaymentMethod })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method === 'COD' ? '💰' : method === 'Aba' ? '💳' : method === 'TrueMoney' ? '🧧' : '💸'} {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Order Type</Label>
                      <Select
                        value={order.orderType || ''}
                        onValueChange={(value) => onUpdateOrder(order.id, { orderType: value as OrderType })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select order type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type === 'Delivery' ? '🚚' : '📦'} {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Store</Label>
                      <Select
                        value={order.storeTag || ''}
                        onValueChange={(value) => onUpdateOrder(order.id, { storeTag: value as StoreTag })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                        <SelectContent>
                          {STORE_TAGS.map((store) => (
                            <SelectItem key={store} value={store}>
                              📌 {store.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <div className="flex flex-wrap gap-2">
              {order.isReceived && (
                <Badge variant="outline" className="gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Received
                </Badge>
              )}
              {order.amount && (
                <Badge variant="outline" className="gap-1 text-blue-600">
                  <DollarSign className="w-3 h-3" />
                  {order.amount}
                </Badge>
              )}
              {order.isPaid && order.paymentMethod && (
                <Badge variant="outline" className="gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Paid by {order.paymentMethod}
                </Badge>
              )}
              {order.invoiceUrl && (
                <Badge variant="outline" className="gap-1 text-purple-600">
                  <FileText className="w-3 h-3" />
                  Invoice
                </Badge>
              )}
            </div>
          </>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateOrder(order.id, { status: 'processing' })}
              className="gap-1"
              data-testid={`button-mark-sent-${order.id}`}
            >
              <Package className="w-3 h-3" />
              Mark as sent
            </Button>
          )}

          {status === 'processing' && !order.isReceived && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateOrder(order.id, { isReceived: true })}
              className="gap-1"
              data-testid={`button-received-${order.id}`}
            >
              <CheckCircle className="w-3 h-3" />
              Mark as received
            </Button>
          )}

          {status === 'processing' && order.isReceived && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateOrder(order.id, { status: 'completed' })}
              className="gap-1"
              data-testid={`button-complete-${order.id}`}
            >
              <CheckCheck className="w-3 h-3" />
              Mark as Completed
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onSetAmount(order.id)}
            className="gap-1"
            data-testid={`button-set-amount-${order.id}`}
          >
            <DollarSign className="w-3 h-3" />
            Set amount
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onAttachInvoice(order.id)}
            className="gap-1"
            data-testid={`button-invoice-${order.id}`}
          >
            <FileText className="w-3 h-3" />
            Attach invoice
          </Button>

          {status !== 'completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOrderMessage(order.id)}
              className="gap-1"
              data-testid={`button-order-message-${order.id}`}
            >
              <MessageSquare className="w-3 h-3" />
              Order Message
            </Button>
          )}

          {status === 'completed' && onShare && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onShare(order)}
              data-testid={`button-share-${order.id}`}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
