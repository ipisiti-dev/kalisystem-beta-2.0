// Centralized types for forms and entities

export interface SupplierFormData {
  name: string;
  contact: string;
  imageUrl?: string;
  type?: string;
  defaultPaymentMethod: string;
  defaultOrderType: string;
}

export interface ItemFormData {
  name: string;
  category: string;
  supplier: string;
  unitTag?: string;
  variantTags?: any[];
}

export interface CategoryFormData {
  name: string;
  parentCategory?: string;
  emoji?: string;
}
