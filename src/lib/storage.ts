import { Item, Category, Supplier, Store, Tag, AppSettings, CompletedOrder, PendingOrder, OrderItem, CurrentOrderMetadata } from '@/types';
import { setItem as kvSetItem, removeItem as kvRemoveItem } from '@/lib/kvStorage';

export type StorageData = {
  items?: Item[];
  categories?: Category[];
  suppliers?: Supplier[];
  stores?: Store[];
  tags?: Tag[];
  settings?: AppSettings;
  completedOrders?: CompletedOrder[];
  pendingOrders?: PendingOrder[];
};

const STORAGE_KEYS = {
  ITEMS: 'tagcreator_items',
  CATEGORIES: 'tagcreator_categories',
  SUPPLIERS: 'tagcreator_suppliers',
  STORES: 'tagcreator_stores',
  TAGS: 'tagcreator_tags',
  SETTINGS: 'tagcreator_settings',
  COMPLETED_ORDERS: 'tagcreator_completed_orders',
  PENDING_ORDERS: 'tagcreator_pending_orders',
  CURRENT_ORDER: 'tagcreator_current_order',
  CURRENT_ORDER_METADATA: 'tagcreator_current_order_metadata',
};

const API_TYPE_MAP: Record<string, string> = {
  [STORAGE_KEYS.ITEMS]: 'items',
  [STORAGE_KEYS.CATEGORIES]: 'categories',
  [STORAGE_KEYS.SUPPLIERS]: 'suppliers',
  [STORAGE_KEYS.STORES]: 'stores',
  [STORAGE_KEYS.TAGS]: 'tags',
  [STORAGE_KEYS.SETTINGS]: 'settings',
  [STORAGE_KEYS.COMPLETED_ORDERS]: 'completedOrders',
  [STORAGE_KEYS.PENDING_ORDERS]: 'pendingOrders',
  [STORAGE_KEYS.CURRENT_ORDER]: 'currentOrder',
  [STORAGE_KEYS.CURRENT_ORDER_METADATA]: 'currentOrderMetadata',
};

// API endpoint - use proxy in development, same host in production
const API_URL = import.meta.env.PROD 
  ? `${window.location.protocol}//${window.location.host}`
  : '';

class StorageManager {
  private cache: Map<string, any> = new Map();
  private apiAvailable: boolean | null = null;
  private pendingSaves: Map<string, NodeJS.Timeout> = new Map();

  // Check if API is available
  private async checkApi(): Promise<boolean> {
    if (this.apiAvailable !== null) return this.apiAvailable;
    
    try {
      const response = await fetch(`${API_URL}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(1000) 
      });
      this.apiAvailable = response.ok;
    } catch {
      this.apiAvailable = false;
    }
    
    console.log(`📦 Storage mode: ${this.apiAvailable ? 'API + localStorage' : 'localStorage only'}`);
    return this.apiAvailable;
  }

  // Sync to API
  private async syncToApi(key: string, value: any): Promise<void> {
    const apiType = API_TYPE_MAP[key];
    if (!apiType) return;

    const isAvailable = await this.checkApi();
    if (!isAvailable) return;

    // Clear existing pending save
    const existing = this.pendingSaves.get(key);
    if (existing) clearTimeout(existing);

    // Debounce saves
    const timeout = setTimeout(async () => {
      try {
        await fetch(`${API_URL}/api/data/${apiType}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        });
        this.pendingSaves.delete(key);
      } catch (error) {
        console.error(`Failed to sync ${apiType} to API:`, error);
      }
    }, 500);

    this.pendingSaves.set(key, timeout);
  }

  // Generic get/set with cache
  private get<T>(key: string, defaultValue: T): T {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    try {
      const data = localStorage.getItem(key);
      const parsed = data ? JSON.parse(data) : defaultValue;
      this.cache.set(key, parsed);

      // Attempt to sync read from remote in background (no await)
      // This warms the Supabase-backed storage for other clients.
      (async () => {
        try {
          // ensure remote has an up-to-date value
          await kvSetItem(key, parsed as any);
        } catch {
          // ignore
        }
      })();

      return parsed;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    this.cache.set(key, value);
    localStorage.setItem(key, JSON.stringify(value));
    // write-through to Supabase-backed kv storage (fire-and-forget)
    (async () => {
      try {
        await kvSetItem(key, value as any);
      } catch (e) {
        // ignore
      }
    })();
    // Sync to API in background
    this.syncToApi(key, value);
  }

  // Items
  getItems(): Item[] {
    return this.get<Item[]>(STORAGE_KEYS.ITEMS, []);
  }

  setItems(items: Item[]): void {
    this.set(STORAGE_KEYS.ITEMS, items);
  }

  // Categories
  getCategories(): Category[] {
    return this.get<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  }

  setCategories(categories: Category[]): void {
    this.set(STORAGE_KEYS.CATEGORIES, categories);
  }

  // Suppliers
  getSuppliers(): Supplier[] {
    return this.get<Supplier[]>(STORAGE_KEYS.SUPPLIERS, []);
  }

  setSuppliers(suppliers: Supplier[]): void {
    this.set(STORAGE_KEYS.SUPPLIERS, suppliers);
  }

  // Stores
  getStores(): Store[] {
    return this.get<Store[]>(STORAGE_KEYS.STORES, []);
  }

  setStores(stores: Store[]): void {
    this.set(STORAGE_KEYS.STORES, stores);
  }

  // Tags
  getTags(): Tag[] {
    return this.get<Tag[]>(STORAGE_KEYS.TAGS, []);
  }

  setTags(tags: Tag[]): void {
    this.set(STORAGE_KEYS.TAGS, tags);
  }

  // Settings
  getSettings(): AppSettings {
    return this.get<AppSettings>(STORAGE_KEYS.SETTINGS, { posMode: true });
  }

  setSettings(settings: AppSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // Completed Orders
  getCompletedOrders(): CompletedOrder[] {
    return this.get<CompletedOrder[]>(STORAGE_KEYS.COMPLETED_ORDERS, []);
  }

  setCompletedOrders(orders: CompletedOrder[]): void {
    this.set(STORAGE_KEYS.COMPLETED_ORDERS, orders);
  }

  // Pending Orders
  getPendingOrders(): PendingOrder[] {
    return this.get<PendingOrder[]>(STORAGE_KEYS.PENDING_ORDERS, []);
  }

  setPendingOrders(orders: PendingOrder[]): void {
    this.set(STORAGE_KEYS.PENDING_ORDERS, orders);
  }


  // Current Order
  getCurrentOrder(): OrderItem[] {
    return this.get<OrderItem[]>(STORAGE_KEYS.CURRENT_ORDER, []);
  }

  setCurrentOrder(order: OrderItem[]): void {
    this.set(STORAGE_KEYS.CURRENT_ORDER, order);
  }

  // Current Order Metadata
  getCurrentOrderMetadata(): CurrentOrderMetadata {
    return this.get<CurrentOrderMetadata>(STORAGE_KEYS.CURRENT_ORDER_METADATA, { orderType: 'Delivery' });
  }

  setCurrentOrderMetadata(metadata: CurrentOrderMetadata): void {
    this.set(STORAGE_KEYS.CURRENT_ORDER_METADATA, metadata);
  }

  public exportData() {
    return {
      items: this.getItems(),
      categories: this.getCategories(),
      suppliers: this.getSuppliers(),
      stores: this.getStores(),
      tags: this.getTags(),
      settings: this.getSettings(),
      completedOrders: this.getCompletedOrders(),
      pendingOrders: this.getPendingOrders(),
      currentOrder: this.getCurrentOrder(),
      currentOrderMetadata: this.getCurrentOrderMetadata(),
    };
  }

  // Import all data
  importData(data: StorageData): void {
    if (data.items) this.setItems(data.items);
    if (data.categories) this.setCategories(data.categories);
    if (data.suppliers) this.setSuppliers(data.suppliers);
    if (data.stores) this.setStores(data.stores);
    if (data.tags) this.setTags(data.tags);
    if (data.settings) this.setSettings(data.settings);
    if (data.completedOrders) this.setCompletedOrders(data.completedOrders);
    if (data.pendingOrders) this.setPendingOrders(data.pendingOrders);
    this.cache.clear(); // Clear cache to force refresh
  }

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      try { localStorage.removeItem(key); } catch {}
      // also remove remote entries (async)
      (async () => { try { await kvRemoveItem(key); } catch {} })();
    });
    this.cache.clear();
  }
}

export const storage = new StorageManager();
