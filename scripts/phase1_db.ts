import { Client } from 'pg';

const connectionString = 'postgresql://postgres.yyfvvfhcmtfgiycdwyzv:162004Kimokimo0100@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

const sql = `
-- Create users table for RBAC
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Sales' CHECK (role IN ('SuperAdmin', 'Sales', 'CRM')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert a default SuperAdmin
INSERT INTO users (email, role) 
VALUES ('admin@nexusai.com', 'SuperAdmin')
ON CONFLICT (email) DO NOTHING;

-- Create global_settings table
CREATE TABLE IF NOT EXISTS global_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meta_api_key TEXT,
    midjourney_api_key TEXT,
    luma_api_key TEXT,
    elevenlabs_api_key TEXT,
    llm_api_key TEXT,
    target_cpl_vip NUMERIC(12, 2) NOT NULL DEFAULT 150.00,
    target_cpl_standard NUMERIC(12, 2) NOT NULL DEFAULT 50.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default settings row if table is empty
INSERT INTO global_settings (target_cpl_vip, target_cpl_standard)
SELECT 150.00, 50.00
WHERE NOT EXISTS (SELECT 1 FROM global_settings);
`;

async function runMigration() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database, executing Phase 1 schema migration...');
    await client.query(sql);
    console.log('Phase 1 Database migration executed successfully.');
  } catch (err) {
    console.error('Error executing schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
