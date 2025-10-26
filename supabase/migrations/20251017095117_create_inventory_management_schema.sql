/*
  # Inventory Management System Schema

  ## Overview
  This migration creates a complete inventory management system for tracking items, categories, suppliers, tags, and orders across multiple stores.

  ## Tables Created

  ### 1. Categories
  - `id` (text, primary key) - Unique category identifier
  - `name` (text) - Category display name
  - `emoji` (text) - Category emoji icon
  - `store_tag` (text, optional) - Associated store tag
  - `main_category` (text, optional) - Main category classification (Food/Beverage/Household)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. Suppliers
  - `id` (text, primary key) - Unique supplier identifier
  - `name` (text) - Supplier name
  - `contact` (text, optional) - Contact information
  - `telegram_id` (text, optional) - Telegram contact ID
  - `payment_method` (text, optional) - Preferred payment method
  - `order_type` (text, optional) - Preferred order type (Delivery/Pickup)
  - `categories` (text[], optional) - Array of associated category IDs
  - `default_payment_method` (text) - Default payment method
  - `default_order_type` (text) - Default order type
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. Tags
  - `id` (text, primary key) - Unique tag identifier
  - `name` (text) - Tag display name
  - `color` (text) - Tag color (hex format)
  - `category` (text, optional) - Associated category
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. Manager Tags
  - `id` (text, primary key) - Unique manager identifier
  - `username` (text) - Manager username
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. Items
  - `id` (text, primary key) - Unique item identifier
  - `name` (text) - Item name
  - `khmer_name` (text, optional) - Khmer language name
  - `category` (text) - Category reference
  - `supplier` (text) - Supplier reference
  - `tags` (text[]) - Array of tag IDs
  - `unit_tag` (text, optional) - Unit of measurement
  - `unit_price` (numeric, optional) - Price per unit
  - `variant_tags` (jsonb, optional) - Variant information (quantity/supplier/brand/khmer_name)
  - `last_ordered` (timestamptz, optional) - Last order timestamp
  - `order_count` (integer) - Total number of times ordered
  - `last_held` (timestamptz, optional) - Last time item was held
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 6. Orders
  - `id` (text, primary key) - Unique order identifier
  - `items` (jsonb) - Array of order items with quantities
  - `supplier` (text, optional) - Supplier for this order
  - `created_at` (timestamptz) - Order creation timestamp
  - `completed_at` (timestamptz, optional) - Order completion timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 7. Completed Orders
  - `id` (text, primary key) - Unique order identifier
  - `items` (jsonb) - Array of completed order items
  - `store_tags` (text[]) - Array of store tags
  - `completed_at` (timestamptz) - Completion timestamp
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 8. Pending Orders
  - `id` (text, primary key) - Unique order identifier
  - `supplier` (text) - Supplier for this order
  - `items` (jsonb) - Array of order items
  - `status` (text) - Order status (pending/processing/completed)
  - `store_tag` (text, optional) - Associated store tag
  - `order_type` (text, optional) - Delivery or Pickup
  - `payment_method` (text, optional) - Payment method used
  - `contact_person` (text, optional) - Contact person name
  - `notes` (text, optional) - Order notes
  - `invoice_url` (text, optional) - Invoice document URL
  - `amount` (numeric, optional) - Total order amount
  - `is_received` (boolean) - Whether order has been received
  - `is_paid` (boolean) - Whether order has been paid
  - `created_at` (timestamptz) - Order creation timestamp
  - `completed_at` (timestamptz, optional) - Order completion timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 9. Current Order Metadata
  - `id` (text, primary key) - Single record with 'current' as ID
  - `order_type` (text) - Current order type
  - `payment_method` (text, optional) - Current payment method
  - `manager` (text, optional) - Current manager
  - `store` (text, optional) - Current store tag
  - `updated_at` (timestamptz) - Last update timestamp

  ### 10. Settings
  - `id` (text, primary key) - Single record with 'app' as ID
  - `default_supplier` (text, optional) - Default supplier ID
  - `order_template` (text, optional) - Order template configuration
  - `pos_mode` (boolean) - POS mode enabled/disabled
  - `autosave` (boolean) - Autosave enabled/disabled
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - All tables have Row Level Security (RLS) enabled
  - Public access policies for authenticated users to perform all operations
  - In production, you should restrict these policies based on user roles

  ## Important Notes
  1. This schema uses `text` for IDs to match your existing data structure
  2. JSONB is used for complex nested data (items in orders, variant tags)
  3. Arrays are used for simple lists (tags, store_tags, categories)
  4. Timestamps are automatically managed via triggers
  5. Default values ensure data consistency
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  emoji text DEFAULT '📦',
  store_tag text,
  main_category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id text PRIMARY KEY,
  name text NOT NULL,
  contact text,
  telegram_id text,
  payment_method text,
  order_type text,
  categories text[],
  default_payment_method text DEFAULT 'cash',
  default_order_type text DEFAULT 'pickup',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id text PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create manager_tags table
CREATE TABLE IF NOT EXISTS manager_tags (
  id text PRIMARY KEY,
  username text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id text PRIMARY KEY,
  name text NOT NULL,
  khmer_name text,
  category text NOT NULL,
  supplier text NOT NULL,
  tags text[] DEFAULT '{}',
  unit_tag text,
  unit_price numeric,
  variant_tags jsonb,
  last_ordered timestamptz,
  order_count integer DEFAULT 0,
  last_held timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  items jsonb NOT NULL,
  supplier text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Create completed_orders table
CREATE TABLE IF NOT EXISTS completed_orders (
  id text PRIMARY KEY,
  items jsonb NOT NULL,
  store_tags text[] DEFAULT '{}',
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pending_orders table
CREATE TABLE IF NOT EXISTS pending_orders (
  id text PRIMARY KEY,
  supplier text NOT NULL,
  items jsonb NOT NULL,
  status text DEFAULT 'pending',
  store_tag text,
  order_type text,
  payment_method text,
  contact_person text,
  notes text,
  invoice_url text,
  amount numeric,
  is_received boolean DEFAULT false,
  is_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Create current_order_metadata table
CREATE TABLE IF NOT EXISTS current_order_metadata (
  id text PRIMARY KEY DEFAULT 'current',
  order_type text NOT NULL,
  payment_method text,
  manager text,
  store text,
  updated_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id text PRIMARY KEY DEFAULT 'app',
  default_supplier text,
  order_template text,
  pos_mode boolean DEFAULT false,
  autosave boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manager_tags_updated_at BEFORE UPDATE ON manager_tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_completed_orders_updated_at BEFORE UPDATE ON completed_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pending_orders_updated_at BEFORE UPDATE ON pending_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_current_order_metadata_updated_at BEFORE UPDATE ON current_order_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_order_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (modify these in production based on your auth needs)
CREATE POLICY "Allow all operations on categories"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on suppliers"
  ON suppliers FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on tags"
  ON tags FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on manager_tags"
  ON manager_tags FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on items"
  ON items FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on orders"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on completed_orders"
  ON completed_orders FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on pending_orders"
  ON pending_orders FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on current_order_metadata"
  ON current_order_metadata FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on settings"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_supplier ON items(supplier);
CREATE INDEX IF NOT EXISTS idx_items_tags ON items USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_pending_orders_supplier ON pending_orders(supplier);
CREATE INDEX IF NOT EXISTS idx_pending_orders_status ON pending_orders(status);
CREATE INDEX IF NOT EXISTS idx_pending_orders_store_tag ON pending_orders(store_tag);
