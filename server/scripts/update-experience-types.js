import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function updateExperienceTypes() {
  // Using the hardcoded connection string from test-db.js for reliability
  const connectionString = process.env.DATABASE_URL;
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log(`Connected to Supabase PostgreSQL`);

    // 1. Set EVERYTHING to Organization first
    const res1 = await client.query(`UPDATE experiences SET experience_type = 'Organization'`);
    console.log(`Updated ${res1.rowCount} rows to Organization.`);

    // 2. Set Digikids and Al-Izhar to Work
    const res2 = await client.query(`
      UPDATE experiences 
      SET experience_type = 'Work' 
      WHERE company ILIKE '%Digikids%' 
         OR company ILIKE '%Al-Izhar%'
    `);
    console.log(`Updated ${res2.rowCount} rows back to Work (Digikids & Al-Izhar).`);

    // 3. Verify
    const verify = await client.query(`SELECT company, position, experience_type FROM experiences`);
    console.log('\nCurrent Database Status:');
    verify.rows.forEach(r => {
      console.log(`- [${r.experience_type}] ${r.company} (${r.position})`);
    });

    await client.end();
  } catch (err) {
    console.error(`Failed to update types:`, err);
  }
}

updateExperienceTypes();

