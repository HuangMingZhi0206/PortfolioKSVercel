import { dbExec, dbRun, dbGet } from './database.js'

const initTables = () => {
  // Admin Users Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // About Me Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS about_me (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      subtitle TEXT,
      description TEXT,
      profile_image TEXT,
      resume_url TEXT,
      phone TEXT,
      email TEXT,
      location TEXT,
      linkedin_url TEXT,
      github_url TEXT,
      instagram_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Skills Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency INTEGER DEFAULT 80,
      icon TEXT,
      color TEXT,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Experience Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      employment_type TEXT DEFAULT 'Full-time',
      location TEXT,
      start_date DATE NOT NULL,
      end_date DATE,
      is_current INTEGER DEFAULT 0,
      description TEXT,
      company_logo TEXT,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Experience Highlights Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS experience_highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      experience_id INTEGER NOT NULL,
      highlight TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
    )
  `)

  // Experience Media Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS experience_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      experience_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      file_path TEXT NOT NULL,
      file_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
    )
  `)

  // Experience Skills Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS experience_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      experience_id INTEGER NOT NULL,
      skill_id INTEGER NOT NULL,
      FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
      UNIQUE (experience_id, skill_id)
    )
  `)

  // Projects Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      short_description TEXT,
      image TEXT,
      demo_url TEXT,
      github_url TEXT,
      category TEXT,
      featured INTEGER DEFAULT 0,
      start_date DATE,
      end_date DATE,
      is_ongoing INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Project Technologies Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS project_technologies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      technology TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `)

  // Project Media Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS project_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      media_url TEXT NOT NULL,
      media_type TEXT,
      caption TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `)

  // Certifications Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      issue_date DATE,
      expiry_date DATE,
      credential_id TEXT,
      credential_url TEXT,
      image TEXT,
      description TEXT,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Certification Media Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS certification_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      certification_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      file_path TEXT NOT NULL,
      file_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE
    )
  `)

  // Certification Skills Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS certification_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      certification_id INTEGER NOT NULL,
      skill_id INTEGER NOT NULL,
      FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
      UNIQUE (certification_id, skill_id)
    )
  `)

  // Education Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution TEXT NOT NULL,
      degree TEXT NOT NULL,
      field_of_study TEXT,
      start_date DATE,
      end_date DATE,
      is_current INTEGER DEFAULT 0,
      description TEXT,
      logo TEXT,
      gpa TEXT,
      order_index INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Contact Messages Table
  dbExec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Insert default admin user if not exists (password: Admin@123)
  const existingAdmin = dbGet('SELECT id FROM admin_users WHERE email = ?', ['admin@kevinsyonin.com'])
  if (!existingAdmin) {
    dbRun(
      'INSERT INTO admin_users (email, password, name) VALUES (?, ?, ?)',
      ['admin@kevinsyonin.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kevin Syonin']
    )
  }

  // Insert default about me if not exists
  const existingAbout = dbGet('SELECT id FROM about_me WHERE id = 1', [])
  if (!existingAbout) {
    dbRun(
      'INSERT INTO about_me (id, title, subtitle, description, email, phone, linkedin_url, github_url, instagram_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        1,
        'Kevin Syonin',
        'Product Development Engineer | Robotics & IoT Innovator',
        'Passionate technology professional dedicated to developing innovative solutions that bridge hardware and software. Building real-world projects in robotics, IoT systems, and intelligent automation.',
        'kevinsyonin.266@gmail.com',
        '0895332606621',
        'https://www.linkedin.com/in/kevin-syonin',
        'https://github.com/HuangMingZhi0206',
        'https://www.instagram.com/kevinsyonin/'
      ]
    )
  }

  console.log('✅ Database tables initialized successfully')
}

export { initTables }
