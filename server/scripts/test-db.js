import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log(`Successfully connected to Supabase`);
    const res = await client.query('SELECT NOW()');
    console.log(res.rows);
    await client.end();
  } catch (err) {
    console.error(`Failed to connect to Supabase:`, err);
  }
}

testConnection();

