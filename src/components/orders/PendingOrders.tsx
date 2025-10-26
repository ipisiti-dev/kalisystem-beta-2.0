import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, FileText, Link as LinkIcon, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PendingOrder, PendingOrderStatus } from '@/types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface PendingOrdersProps {
  orders: PendingOrder[];
  onStatusChange: (orderId: string, newStatus: PendingOrderStatus) => void;
  onMarkAsReceived: (orderId: string) => void;
  onMarkAsPaid: (orderId: string, amount?: number) => void;
  onUpdateInvoice: (orderId: string, invoiceUrl: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

export function PendingOrders({
  orders,
  onStatusChange,
  onMarkAsReceived,
  onMarkAsPaid,
  onUpdateInvoice,
  onDeleteOrder
}: PendingOrdersProps) {
  const [amountDialogOpen, setAmountDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [amountInput, setAmountInput] = useState('');
  const [invoiceUrlInput, setInvoiceUrlInput] = useState('');

  const handleAmountSubmit = () => {
    const amount = parseFloat(amountInput);
    if (isNaN(amount)) {
      toast.error('Please enter a valid amount');
      return;
    }
    onMarkAsPaid(selectedOrderId, amount);
    setAmountDialogOpen(false);
    setAmountInput('');
  };

  const handleInvoiceSubmit = () => {
    if (!invoiceUrlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    onUpdateInvoice(selectedOrderId, invoiceUrlInput);
    setInvoiceDialogOpen(false);
    setInvoiceUrlInput('');
  };

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <Card key={order.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">{order.supplier}</div>
            <OrderStatusBadge status={order.status} />
          </div>
          
          <div className="space-y-2 mb-4">
            {order.items.map(({ item, quantity }) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>x{quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {order.status !== 'completed' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setAmountDialogOpen(true);
                  }}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Amount
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setInvoiceDialogOpen(true);
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Invoice
                </Button>
                
                {order.status === 'processing' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange(order.id, 'completed')}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                )}
                
                {order.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange(order.id, 'processing')}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Process
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>
      ))}

      <Dialog open={amountDialogOpen} onOpenChange={setAmountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Amount</DialogTitle>
            <DialogDescription>
              Enter the payment amount for this order
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amountInput}
                onChange={e => setAmountInput(e.target.value)}
                placeholder="Enter amount..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAmountSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Invoice URL</DialogTitle>
            <DialogDescription>
              Enter the URL for the invoice
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={invoiceUrlInput}
                onChange={e => setInvoiceUrlInput(e.target.value)}
                placeholder="Enter URL..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInvoiceSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}