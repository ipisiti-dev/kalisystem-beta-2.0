import { supabase } from './supabase';
import type {
  Item,
  Category,
  Supplier,
  Tag,
  PendingOrder,
  AppSettings,
} from '@/types';

export interface DatabaseSync {
  syncItems: (items: Item[]) => Promise<void>;
  syncCategories: (categories: Category[]) => Promise<void>;
  syncSuppliers: (suppliers: Supplier[]) => Promise<void>;
  syncTags: (tags: Tag[]) => Promise<void>;
  syncPendingOrders: (orders: PendingOrder[]) => Promise<void>;
  syncSettings: (settings: AppSettings) => Promise<void>;
  loadFromDatabase: () => Promise<{
    items: Item[];
    categories: Category[];
    suppliers: Supplier[];
    tags: Tag[];
    pendingOrders: PendingOrder[];
    settings: AppSettings | null;
  }>;
}

const parseSupabaseDate = (dateString: string | null): Date | undefined => {
  if (!dateString) return undefined;
  return new Date(dateString);
};

export const createDatabaseSync = (): DatabaseSync => {
  return {
    syncItems: async (items: Item[]) => {
      try {
        for (const item of items) {
          const { error } = await supabase
            .from('items')
            .upsert({
              id: item.id,
              name: item.name,
              khmer_name: item.khmerName,
              category: item.category,
              supplier: item.supplier,
              tags: item.tags,
              unit_tag: item.unitTag,
              unit_price: item.unitPrice,
              variant_tags: item.variantTags,
              last_ordered: item.lastOrdered,
              order_count: item.orderCount || 0,
              last_held: item.lastHeld,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (error) console.error('Error syncing item:', error);
        }
      } catch (error) {
        console.error('Failed to sync items:', error);
      }
    },

    syncCategories: async (categories: Category[]) => {
      try {
        for (const category of categories) {
          const { error } = await supabase
            .from('categories')
            .upsert({
              id: category.id,
              name: category.name,
              emoji: category.emoji,
              store_tag: category.storeTag,
              main_category: category.mainCategory,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (error) console.error('Error syncing category:', error);
        }
      } catch (error) {
        console.error('Failed to sync categories:', error);
      }
    },

    syncSuppliers: async (suppliers: Supplier[]) => {
      try {
        for (const supplier of suppliers) {
          const { error } = await supabase
            .from('suppliers')
            .upsert({
              id: supplier.id,
              name: supplier.name,
              contact: supplier.contact,
              telegram_id: supplier.telegramId,
              payment_method: supplier.paymentMethod,
              order_type: supplier.orderType,
              categories: supplier.categories || [],
              default_payment_method: supplier.defaultPaymentMethod,
              default_order_type: supplier.defaultOrderType,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (error) console.error('Error syncing supplier:', error);
        }
      } catch (error) {
        console.error('Failed to sync suppliers:', error);
      }
    },

    syncTags: async (tags: Tag[]) => {
      try {
        for (const tag of tags) {
          const { error } = await supabase
            .from('tags')
            .upsert({
              id: tag.id,
              name: tag.name,
              color: tag.color,
              category: tag.category,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (error) console.error('Error syncing tag:', error);
        }
      } catch (error) {
        console.error('Failed to sync tags:', error);
      }
    },


    syncPendingOrders: async (orders: PendingOrder[]) => {
      try {
        for (const order of orders) {
          const { error } = await supabase
            .from('pending_orders')
            .upsert({
              id: order.id,
              supplier: order.supplier,
              items: order.items,
              status: order.status,
              store_tag: order.storeTag,
              order_type: order.orderType,
              payment_method: order.paymentMethod,
              contact_person: order.contactPerson,
              notes: order.notes,
              invoice_url: order.invoiceUrl,
              amount: order.amount,
              is_received: order.isReceived || false,
              is_paid: order.isPaid || false,
              completed_at: order.completedAt?.toISOString() || null,
              created_at: order.createdAt.toISOString(),
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (error) console.error('Error syncing pending order:', error);
        }
      } catch (error) {
        console.error('Failed to sync pending orders:', error);
      }
    },

    syncSettings: async (settings: AppSettings) => {
      try {
        const { data: existing, error: fetchError } = await supabase
          .from('settings')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching settings:', fetchError);
          return;
        }

        if (existing) {
          const { error } = await supabase
            .from('settings')
            .update({
              default_supplier: settings.defaultSupplier,
              order_template: settings.orderTemplate,
              pos_mode: settings.posMode,
              autosave: settings.autosave,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (error) console.error('Error updating settings:', error);
        } else {
          const { error } = await supabase
            .from('settings')
            .insert({
              default_supplier: settings.defaultSupplier,
              order_template: settings.orderTemplate,
              pos_mode: settings.posMode,
              autosave: settings.autosave,
              updated_at: new Date().toISOString(),
            });

          if (error) console.error('Error inserting settings:', error);
        }
      } catch (error) {
        console.error('Failed to sync settings:', error);
      }
    },

    loadFromDatabase: async () => {
      try {
        const [
          itemsResult,
          categoriesResult,
          suppliersResult,
          tagsResult,
          ordersResult,
          settingsResult,
        ] = await Promise.all([
          supabase.from('items').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('suppliers').select('*'),
          supabase.from('tags').select('*'),
          supabase.from('pending_orders').select('*'),
          supabase.from('settings').select('*').limit(1).maybeSingle(),
        ]);

        const items: Item[] = (itemsResult.data || []).map(row => ({
          id: row.id,
          name: row.name,
          khmerName: row.khmer_name,
          category: row.category,
          supplier: row.supplier,
          tags: row.tags || [],
          unitTag: row.unit_tag,
          unitPrice: row.unit_price,
          variantTags: row.variant_tags,
          lastOrdered: row.last_ordered,
          orderCount: row.order_count || 0,
          lastHeld: row.last_held,
        }));

        const categories: Category[] = (categoriesResult.data || []).map(row => ({
          id: row.id,
          name: row.name,
          emoji: row.emoji,
          storeTag: row.store_tag,
          mainCategory: row.main_category,
        }));

        const suppliers: Supplier[] = (suppliersResult.data || []).map(row => ({
          id: row.id,
          name: row.name,
          contact: row.contact,
          telegramId: row.telegram_id,
          paymentMethod: row.payment_method,
          orderType: row.order_type,
          categories: row.categories || [],
          defaultPaymentMethod: row.default_payment_method,
          defaultOrderType: row.default_order_type,
        }));

        const tags: Tag[] = (tagsResult.data || []).map(row => ({
          id: row.id,
          name: row.name,
          color: row.color,
          category: row.category,
        }));

        const pendingOrders: PendingOrder[] = (ordersResult.data || []).map(row => ({
          id: row.id,
          supplier: row.supplier,
          items: row.items || [],
          status: row.status,
          storeTag: row.store_tag,
          orderType: row.order_type,
          paymentMethod: row.payment_method,
          contactPerson: row.contact_person,
          notes: row.notes,
          invoiceUrl: row.invoice_url,
          amount: row.amount,
          isReceived: row.is_received || false,
          isPaid: row.is_paid || false,
          completedAt: parseSupabaseDate(row.completed_at),
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        }));

        const settings: AppSettings | null = settingsResult.data
          ? {
              defaultSupplier: settingsResult.data.default_supplier,
              orderTemplate: settingsResult.data.order_template,
              posMode: settingsResult.data.pos_mode,
              autosave: settingsResult.data.autosave,
            }
          : null;

        return {
          items,
          categories,
          suppliers,
          tags,
          pendingOrders,
          settings,
        };
      } catch (error) {
        console.error('Failed to load from database:', error);
        return {
          items: [],
          categories: [],
          suppliers: [],
          tags: [],
          pendingOrders: [],
          settings: null,
        };
      }
    },
  };
};

export const dbSync = createDatabaseSync();
