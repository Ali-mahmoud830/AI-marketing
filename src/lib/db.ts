import { Client } from 'pg';

// In production, this should come from process.env.DATABASE_URL
const connectionString = 'postgresql://postgres:162004Kimokimo0100@db.cjtvxdcxpswtbywehrzu.supabase.co:5432/postgres';

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
