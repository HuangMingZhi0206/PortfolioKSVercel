import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// For Vercel Serverless, we use connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

const testConnection = async () => {
  try {
    const client = await pool.connect()
    client.query('SELECT 1')
    client.release()
    console.log('✅ PostgreSQL Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  }
}

// Wrapper for `dbRun` (INSERT/UPDATE/DELETE)
const dbRun = async (sql, params = []) => {
  try {
    // Postgres uses $1, $2 instead of ?
    // So we need to convert MySQL/SQLite ? to $1, $2
    let i = 1;
    const pgSql = sql.replace(/\?/g, () => `$${i++}`);
    
    // Auto-append RETURNING id if it's an INSERT to simulate SQLite lastInsertRowid
    let finalSql = pgSql;
    if (sql.trim().toUpperCase().startsWith('INSERT') && !sql.toUpperCase().includes('RETURNING')) {
      finalSql += ' RETURNING id';
    }

    const res = await pool.query(finalSql, params);
    
    if (res.rows && res.rows.length > 0 && res.rows[0].id) {
      return { lastInsertRowid: res.rows[0].id };
    }
    return { lastInsertRowid: 0 };
  } catch (error) {
    console.error('SQL Error (dbRun):', error)
    throw error
  }
}

// Wrapper for `dbGet` (SELECT 1 row)
const dbGet = async (sql, params = []) => {
  try {
    let i = 1;
    const pgSql = sql.replace(/\?/g, () => `$${i++}`);
    const res = await pool.query(pgSql, params)
    return res.rows.length > 0 ? res.rows[0] : null
  } catch (error) {
    console.error('SQL Error (dbGet):', error)
    throw error
  }
}

// Wrapper for `dbAll` (SELECT multiple rows)
const dbAll = async (sql, params = []) => {
  try {
    let i = 1;
    const pgSql = sql.replace(/\?/g, () => `$${i++}`);
    const res = await pool.query(pgSql, params)
    return res.rows
  } catch (error) {
    console.error('SQL Error (dbAll):', error)
    throw error
  }
}

// Wrapper for `dbExec` (Raw queries)
const dbExec = async (sql) => {
  try {
    await pool.query(sql)
  } catch (error) {
    console.error('SQL Error (dbExec):', error)
    throw error
  }
}

export { pool, testConnection, dbRun, dbGet, dbAll, dbExec }
