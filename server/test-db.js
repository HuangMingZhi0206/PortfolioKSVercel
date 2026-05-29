import pg from 'pg';
const { Client } = pg;

async function testConnection() {
  const connectionString = 'postgresql://postgres.tdzyduamddvbspwyvryy:passangelkevin0206@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres';
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
