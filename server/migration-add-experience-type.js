import pg from 'pg';
const { Client } = pg;

async function migrate() {
  const connectionString = 'postgresql://postgres.tdzyduamddvbspwyvryy:passangelkevin0206@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres';
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
