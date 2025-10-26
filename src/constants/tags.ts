// Centralized tag/option arrays for supplier, payment, order type, units, etc.

export const PAYMENT_TAGS = [
  { value: 'COD', label: '💰 COD' },
  { value: 'Aba', label: '💳 Aba' },
  { value: 'TrueMoney', label: '🧧 TrueMoney' },
  { value: 'CreditLine', label: '💸 CreditLine' },
];

export const ORDER_TYPE_TAGS = [
  { value: 'Delivery', label: '🚚 Delivery' },
  { value: 'Pickup', label: '📦 Pickup' },
];

export const UNIT_TAGS = [
  'kg', 'pc', 'can', 'L', 'bt', 'pk', 'jar', 'bag', 'small', 'big'
];
