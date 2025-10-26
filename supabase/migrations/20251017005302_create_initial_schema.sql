-- Initial Schema for Order Management System
--
-- 1. New Tables
--    items: Product/item catalog with all product details
--    categories: Category definitions with emojis and tags
--    suppliers: Supplier information with defaults
--    tags: Tag definitions for filtering
--    manager_tags: Manager user definitions
--    pending_orders: Active and completed orders
--    current_order: Temporary current order state
--    settings: Application settings
--
-- 2. Security
--    Enable RLS on all tables
--    Add policies for public access

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  khmer_name text,
  category text NOT NULL,
  supplier text NOT NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  unit_tag text,
  unit_price decimal(10,2),
  variant_tags jsonb,
  last_ordered timestamptz,
  order_count integer DEFAULT 0,
  last_held timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on items"
  ON items FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on items"
  ON items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on items"
  ON items FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on items"
  ON items FOR DELETE
  USING (true);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  emoji text NOT NULL,
  store_tag text,
  main_category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on categories"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on categories"
  ON categories FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on categories"
  ON categories FOR DELETE
  USING (true);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  contact text,
  telegram_id text,
  payment_method text,
  order_type text,
  categories jsonb DEFAULT '[]'::jsonb,
  default_payment_method text NOT NULL DEFAULT 'COD',
  default_order_type text NOT NULL DEFAULT 'Delivery',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on suppliers"
  ON suppliers FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on suppliers"
  ON suppliers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on suppliers"
  ON suppliers FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on suppliers"
  ON suppliers FOR DELETE
  USING (true);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on tags"
  ON tags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on tags"
  ON tags FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on tags"
  ON tags FOR DELETE
  USING (true);

-- Manager tags table
CREATE TABLE IF NOT EXISTS manager_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE manager_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on manager_tags"
  ON manager_tags FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on manager_tags"
  ON manager_tags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on manager_tags"
  ON manager_tags FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on manager_tags"
  ON manager_tags FOR DELETE
  USING (true);

-- Pending orders table
CREATE TABLE IF NOT EXISTS pending_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  store_tag text,
  order_type text,
  payment_method text,
  contact_person text,
  notes text,
  invoice_url text,
  amount decimal(10,2),
  is_received boolean DEFAULT false,
  is_paid boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on pending_orders"
  ON pending_orders FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on pending_orders"
  ON pending_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on pending_orders"
  ON pending_orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on pending_orders"
  ON pending_orders FOR DELETE
  USING (true);

-- Current order table (single row for current order state)
CREATE TABLE IF NOT EXISTS current_order (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  items jsonb DEFAULT '[]'::jsonb,
  order_type text DEFAULT 'Delivery',
  payment_method text,
  manager text,
  store text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE current_order ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on current_order"
  ON current_order FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on current_order"
  ON current_order FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on current_order"
  ON current_order FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on current_order"
  ON current_order FOR DELETE
  USING (true);

-- Settings table (single row for app settings)
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  default_supplier text,
  order_template text,
  pos_mode boolean DEFAULT true,
  autosave boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on settings"
  ON settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on settings"
  ON settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on settings"
  ON settings FOR DELETE
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_items_supplier ON items(supplier);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_pending_orders_status ON pending_orders(status);
CREATE INDEX IF NOT EXISTS idx_pending_orders_store_tag ON pending_orders(store_tag);
CREATE INDEX IF NOT EXISTS idx_pending_orders_supplier ON pending_orders(supplier);