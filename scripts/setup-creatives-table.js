const { Client } = require('pg');

const connectionString = 'postgresql://postgres.yyfvvfhcmtfgiycdwyzv:162004Kimokimo0100@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

async function setupDB() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS creatives (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        brand_name TEXT NOT NULL,
        industry TEXT NOT NULL,
        ad_copy TEXT NOT NULL,
        midjourney_prompt TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("Table 'creatives' created successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    await client.end();
  }
}

setupDB();
