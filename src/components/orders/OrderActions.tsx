import { Share2, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { OrderItem, PaymentMethod } from '@/types';

interface OrderActionsProps {
  currentOrder: OrderItem[];
  currentOrderMetadata: {
    orderType: 'Delivery' | 'Pickup';
    manager?: string;
    store?: string;
    paymentMethod?: PaymentMethod;
  };
  onCompleteOrder: () => void;
  onSendOrder: () => void;
  onHoldOrder: () => void;
}

export function OrderActions({
  currentOrder,
  currentOrderMetadata,
  onCompleteOrder,
  onSendOrder,
  onHoldOrder
}: OrderActionsProps) {
  const generateOrderText = () => {
    if (currentOrder.length === 0) return '';

    const orderId = getOrderId();
    const orderTypeEmoji = currentOrderMetadata.orderType === 'Delivery' ? '🚚' : '📦';
    const orderTypeText = currentOrderMetadata.orderType === 'Delivery' ? 'Delivery order' : 'Pickup order';

    const paymentEmojis: Record<PaymentMethod, string> = {
      'COD': '💰',
      'Aba': '💳',
      'TrueMoney': '🧧',
      'CreditLine': '💸',
    };

    let header = `#️⃣ ${orderId}\n${orderTypeEmoji} ${orderTypeText}`;
    
    if (currentOrderMetadata.manager) {
      header += `\n👤 ${currentOrderMetadata.manager}`;
    }
    
    if (currentOrderMetadata.store) {
      header += `\n📌 ${currentOrderMetadata.store}`;
    }
    
    if (currentOrderMetadata.paymentMethod) {
      const emoji = paymentEmojis[currentOrderMetadata.paymentMethod];
      header += `\n💲 ${emoji} ${currentOrderMetadata.paymentMethod}`;
    }

    const orderLines = currentOrder.map(
      ({ item, quantity, storeTag }) => 
        `🔹 ${item.name} x${quantity}${storeTag ? ` [${storeTag}]` : ''}`
    );

    return `${header}\n\n${orderLines.join('\n')}`;
  };

  const handleCopy = () => {
    const text = generateOrderText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Order copied to clipboard!');
  };

  const handleShare = async () => {
    const text = generateOrderText();
    if (!text) return;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.error('Share failed:', err);
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const getOrderId = () => {
    const supplierGroups = groupBySupplier();
    const firstSupplier = Object.keys(supplierGroups)[0] || 'Unknown';
    const storeName = currentOrderMetadata.store || 'Store';
    const orderNumber = String(Date.now()).slice(-3);
    return `${firstSupplier}_${storeName}_${orderNumber}`;
  };

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
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={currentOrder.length === 0}
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        disabled={currentOrder.length === 0}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onCompleteOrder}
        disabled={currentOrder.length === 0}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Complete
      </Button>
    </div>
  );
}