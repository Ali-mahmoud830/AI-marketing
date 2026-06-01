import { Client } from 'pg';

// In production, this should come from process.env.DATABASE_URL
const connectionString = 'postgresql://postgres.yyfvvfhcmtfgiycdwyzv:162004Kimokimo0100@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

export async function query(text: string, params?: any[]) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    await client.end();
  }
}
