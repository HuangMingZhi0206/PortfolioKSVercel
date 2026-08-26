import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log(`Successfully connected to Supabase`);
    await client.query(`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS experience_type VARCHAR(50) DEFAULT 'Work'`);
    console.log(`Column experience_type added successfully.`);
    await client.end();
  } catch (err) {
    console.error(`Failed:`, err);
  }
}

migrate();

