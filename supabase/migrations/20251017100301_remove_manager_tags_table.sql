/*
  # Remove Manager Tags Table

  ## Changes
  Removes the manager_tags table and all associated objects (policies, triggers, indexes).

  ## What is being removed
  - manager_tags table
  - RLS policies for manager_tags
  - Triggers for manager_tags
*/

-- Drop policies
DROP POLICY IF EXISTS "Allow all operations on manager_tags" ON manager_tags;

-- Drop triggers
DROP TRIGGER IF EXISTS update_manager_tags_updated_at ON manager_tags;

-- Drop table
DROP TABLE IF EXISTS manager_tags;
