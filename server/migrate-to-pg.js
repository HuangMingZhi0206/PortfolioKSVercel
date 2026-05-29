import pg from 'pg';
import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const connectionString = 'postgresql://postgres.tdzyduamddvbspwyvryy:passangelkevin0206@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres';
  const pgClient = new Client({ connectionString });
  
  try {
    await pgClient.connect();
    console.log('Connected to PostgreSQL');

    // 1. Create Tables
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS about_me (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        description TEXT,
        profile_image VARCHAR(255),
        resume_url VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255),
        location VARCHAR(255),
        linkedin_url VARCHAR(255),
        github_url VARCHAR(255),
        instagram_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        proficiency INTEGER DEFAULT 80,
        icon VARCHAR(50),
        color VARCHAR(20),
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        employment_type VARCHAR(50) DEFAULT 'Full-time',
        location VARCHAR(255),
        start_date DATE NOT NULL,
        end_date DATE,
        is_current BOOLEAN DEFAULT FALSE,
        description TEXT,
        company_logo VARCHAR(255),
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS experience_highlights (
        id SERIAL PRIMARY KEY,
        experience_id INTEGER REFERENCES experiences(id) ON DELETE CASCADE,
        highlight TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS experience_media (
        id SERIAL PRIMARY KEY,
        experience_id INTEGER REFERENCES experiences(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(255) NOT NULL,
        file_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS experience_skills (
        id SERIAL PRIMARY KEY,
        experience_id INTEGER REFERENCES experiences(id) ON DELETE CASCADE,
        skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
        UNIQUE(experience_id, skill_id)
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        image VARCHAR(255),
        demo_url VARCHAR(255),
        github_url VARCHAR(255),
        category VARCHAR(50),
        featured BOOLEAN DEFAULT FALSE,
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        start_date VARCHAR(10),
        end_date VARCHAR(10),
        is_ongoing BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS project_media (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        media_url VARCHAR(500) NOT NULL,
        media_type VARCHAR(50) DEFAULT 'image',
        caption VARCHAR(255),
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS project_technologies (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        technology VARCHAR(50) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        issue_date DATE,
        expiry_date DATE,
        credential_id VARCHAR(255),
        credential_url VARCHAR(255),
        image VARCHAR(255),
        description TEXT,
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS certification_media (
        id SERIAL PRIMARY KEY,
        certification_id INTEGER REFERENCES certifications(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(255) NOT NULL,
        file_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS certification_skills (
        id SERIAL PRIMARY KEY,
        certification_id INTEGER REFERENCES certifications(id) ON DELETE CASCADE,
        skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
        UNIQUE(certification_id, skill_id)
      );

      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        field_of_study VARCHAR(255),
        start_date DATE,
        end_date DATE,
        is_current BOOLEAN DEFAULT FALSE,
        description TEXT,
        logo VARCHAR(255),
        gpa VARCHAR(10),
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created in PostgreSQL.');

    // 2. Load SQLite Database
    const dbPath = path.join(__dirname, 'data', 'portfolio.db');
    if (!fs.existsSync(dbPath)) {
      console.log('No local portfolio.db found, skipping data migration.');
      process.exit(0);
    }
    
    const fileBuffer = fs.readFileSync(dbPath);
    const SQL = await initSqlJs();
    const sqliteDb = new SQL.Database(fileBuffer);
    
    const tables = [
      'about_me', 'admin_users', 'skills', 'experiences', 'experience_highlights',
      'experience_media', 'experience_skills', 'projects', 'project_media',
      'project_technologies', 'certifications', 'certification_media',
      'certification_skills', 'education', 'contact_messages'
    ];

    for (const table of tables) {
      const stmt = sqliteDb.prepare(`SELECT * FROM ${table}`);
      const rows = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        rows.push(row);
      }
      stmt.free();

      if (rows.length > 0) {
        console.log(`Migrating ${rows.length} rows to ${table}...`);
        
        // Disable foreign key constraints temporarily? Not easy in PG. 
        // We delete all existing data to prevent ID conflicts
        await pgClient.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);

        for (const row of rows) {
          const columns = Object.keys(row);
          const values = Object.values(row).map(v => v === '' ? null : v); // SQLite empty strings might be nulls in PG
          
          // Postgres uses $1, $2 for parameterized queries
          const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
          
          // Note: boolean fields in SQLite are 0 or 1. Postgres expects true/false. 
          // node-postgres will automatically cast 0/1 to false/true if column is boolean, 
          // but we should explicitly convert known boolean columns.
          const booleanCols = ['is_active', 'is_current', 'featured', 'is_ongoing', 'is_read'];
          columns.forEach((col, idx) => {
            if (booleanCols.includes(col)) {
              values[idx] = values[idx] === 1 || values[idx] === true;
            }
          });
          
          const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
          try {
            await pgClient.query(query, values);
          } catch (insertErr) {
            console.error(`Error inserting into ${table}:`, insertErr.message);
            console.error('Row:', row);
          }
        }
        
        // Reset primary key sequence to max id
        try {
          await pgClient.query(`SELECT setval('${table}_id_seq', COALESCE((SELECT MAX(id)+1 FROM ${table}), 1), false)`);
        } catch(e) {
            // ignore
        }
      }
    }

    console.log('Migration completed successfully!');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pgClient.end();
  }
}

migrate();
