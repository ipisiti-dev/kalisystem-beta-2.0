-- Create app_kv key/value table for Supabase-backed local storage
-- Generated: 2025-10-17

CREATE TABLE IF NOT EXISTS public.app_kv (
  key text PRIMARY KEY,
  value jsonb,
  user_id text NULL,
  updated_at timestamptz DEFAULT now()
);

-- Index for user-specific lookups
CREATE INDEX IF NOT EXISTS idx_app_kv_user_id ON public.app_kv (user_id);

-- Optional: row-level security can be configured by project as needed
