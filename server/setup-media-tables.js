import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'portfolio_db'
})

async function setup() {
  try {
    // Create certification_media table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certification_media (
        id INT PRIMARY KEY AUTO_INCREMENT,
        certification_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(255) NOT NULL,
        file_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE
      )
    `)
    
    // Create certification_skills table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certification_skills (
        id INT PRIMARY KEY AUTO_INCREMENT,
        certification_id INT NOT NULL,
        skill_id INT NOT NULL,
        FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cert_skill (certification_id, skill_id)
      )
    `)
    
    console.log('Tables created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

setup()
