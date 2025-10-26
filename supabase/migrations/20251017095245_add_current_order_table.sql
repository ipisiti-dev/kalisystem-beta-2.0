/*
  # Add Current Order Table

  ## Changes
  Creates a `current_order` table to store the active order being built by the user.

  ## New Table
  - `current_order`
    - `id` (text, primary key) - Order identifier (auto-generated)
    - `items` (jsonb) - Array of order items with quantities
    - `order_type` (text) - Order type (Delivery/Pickup)
    - `payment_method` (text, optional) - Payment method
    - `manager` (text, optional) - Manager username
    - `store` (text, optional) - Store tag
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS with public access policy for all operations
*/

-- Create current_order table
CREATE TABLE IF NOT EXISTS current_order (
  id text PRIMARY KEY DEFAULT 'active',
  items jsonb DEFAULT '[]'::jsonb,
  order_type text DEFAULT 'Delivery',
  payment_method text,
  manager text,
  store text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for updated_at
CREATE TRIGGER update_current_order_updated_at BEFORE UPDATE ON current_order
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE current_order ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow all operations on current_order"
  ON current_order FOR ALL
  USING (true)
  WITH CHECK (true);
