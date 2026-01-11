-- Create Database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About Me Table
CREATE TABLE IF NOT EXISTS about_me (
  id INT PRIMARY KEY AUTO_INCREMENT,
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  proficiency INT DEFAULT 80,
  icon VARCHAR(50),
  color VARCHAR(20),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experiences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  company_logo VARCHAR(255),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Experience Highlights Table
CREATE TABLE IF NOT EXISTS experience_highlights (
  id INT PRIMARY KEY AUTO_INCREMENT,
  experience_id INT NOT NULL,
  highlight TEXT NOT NULL,
  order_index INT DEFAULT 0,
  FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  image VARCHAR(255),
  demo_url VARCHAR(255),
  github_url VARCHAR(255),
  category VARCHAR(50),
  featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project Technologies Table
CREATE TABLE IF NOT EXISTS project_technologies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  technology VARCHAR(50) NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(255),
  credential_url VARCHAR(255),
  image VARCHAR(255),
  description TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Education Table
CREATE TABLE IF NOT EXISTS education (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  logo VARCHAR(255),
  gpa VARCHAR(10),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: Admin@123)
INSERT INTO admin_users (email, password, name) VALUES 
('admin@kevinsyonin.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kevin Syonin')
ON DUPLICATE KEY UPDATE email = email;

-- Insert default about me
INSERT INTO about_me (id, title, subtitle, description, email, phone, linkedin_url, github_url, instagram_url) VALUES 
(1, 'Kevin Syonin', 'Product Development Engineer | Robotics & IoT Innovator', 
'Passionate technology professional dedicated to developing innovative solutions that bridge hardware and software. Building real-world projects in robotics, IoT systems, and intelligent automation.',
'kevinsyonin.266@gmail.com', '0895332606621', 
'https://www.linkedin.com/in/kevin-syonin', 
'https://github.com/HuangMingZhi0206',
'https://www.instagram.com/kevinsyonin/')
ON DUPLICATE KEY UPDATE id = id;
