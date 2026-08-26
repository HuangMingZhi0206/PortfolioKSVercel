import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase and Cloudinary Credentials
const connectionString = process.env.DATABASE_URL;
const pgClient = new pg.Client({ connectionString });

cloudinary.config({
  cloud_name: 'dyhxqmx0j',
  api_key: '275987237517367',
  api_secret: 'T9c1wLauAw7aFZDwR3PAzWilUmU'
});

async function uploadToCloudinary(localPath, folderName) {
  try {
    // localPath is like "/uploads/projects/123.jpg"
    // We want to map it to "portfolio/server/uploads/projects/123.jpg"
    const relativePath = localPath.startsWith('/') ? localPath.substring(1) : localPath;
    const fullPath = path.join(__dirname, relativePath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`Uploading ${localPath}...`);
      const result = await cloudinary.uploader.upload(fullPath, {
        folder: `portfolio/${folderName}`
      });
      return result.secure_url;
    } else {
      console.log(`File not found: ${fullPath}`);
      return null;
    }
  } catch (error) {
    console.error(`Error uploading ${localPath}:`, error.message);
    return null;
  }
}

async function migrateImages() {
  await pgClient.connect();
  console.log('Connected to Database. Starting image migration...');

  try {
    // 1. About Me
    const about = await pgClient.query('SELECT id, profile_image, resume_url FROM about_me WHERE id = 1');
    if (about.rows.length > 0) {
      let row = about.rows[0];
      if (row.profile_image && row.profile_image.startsWith('/uploads')) {
        const newUrl = await uploadToCloudinary(row.profile_image, 'general');
        if (newUrl) await pgClient.query('UPDATE about_me SET profile_image = $1 WHERE id = $2', [newUrl, row.id]);
      }
      if (row.resume_url && row.resume_url.startsWith('/uploads')) {
        const newUrl = await uploadToCloudinary(row.resume_url, 'general');
        if (newUrl) await pgClient.query('UPDATE about_me SET resume_url = $1 WHERE id = $2', [newUrl, row.id]);
      }
    }

    // 2. Projects
    const projects = await pgClient.query("SELECT id, image FROM projects WHERE image LIKE '/uploads%'");
    for (const p of projects.rows) {
      const newUrl = await uploadToCloudinary(p.image, 'projects');
      if (newUrl) await pgClient.query('UPDATE projects SET image = $1 WHERE id = $2', [newUrl, p.id]);
    }

    const projectMedia = await pgClient.query("SELECT id, media_url FROM project_media WHERE media_url LIKE '/uploads%'");
    for (const m of projectMedia.rows) {
      const newUrl = await uploadToCloudinary(m.media_url, 'projects');
      if (newUrl) await pgClient.query('UPDATE project_media SET media_url = $1 WHERE id = $2', [newUrl, m.id]);
    }

    // 3. Experiences
    const experiences = await pgClient.query("SELECT id, company_logo FROM experiences WHERE company_logo LIKE '/uploads%'");
    for (const e of experiences.rows) {
      const newUrl = await uploadToCloudinary(e.company_logo, 'companies');
      if (newUrl) await pgClient.query('UPDATE experiences SET company_logo = $1 WHERE id = $2', [newUrl, e.id]);
    }

    const expMedia = await pgClient.query("SELECT id, file_path FROM experience_media WHERE file_path LIKE '/uploads%'");
    for (const m of expMedia.rows) {
      const newUrl = await uploadToCloudinary(m.file_path, 'experiences');
      if (newUrl) await pgClient.query('UPDATE experience_media SET file_path = $1 WHERE id = $2', [newUrl, m.id]);
    }

    // 4. Certifications
    const certs = await pgClient.query("SELECT id, image FROM certifications WHERE image LIKE '/uploads%'");
    for (const c of certs.rows) {
      const newUrl = await uploadToCloudinary(c.image, 'certifications');
      if (newUrl) await pgClient.query('UPDATE certifications SET image = $1 WHERE id = $2', [newUrl, c.id]);
    }

    const certMedia = await pgClient.query("SELECT id, file_path FROM certification_media WHERE file_path LIKE '/uploads%'");
    for (const m of certMedia.rows) {
      const newUrl = await uploadToCloudinary(m.file_path, 'certifications');
      if (newUrl) await pgClient.query('UPDATE certification_media SET file_path = $1 WHERE id = $2', [newUrl, m.id]);
    }

    // 5. Education
    const educations = await pgClient.query("SELECT id, logo FROM education WHERE logo LIKE '/uploads%'");
    for (const e of educations.rows) {
      const newUrl = await uploadToCloudinary(e.logo, 'education');
      if (newUrl) await pgClient.query('UPDATE education SET logo = $1 WHERE id = $2', [newUrl, e.id]);
    }

    console.log('Image migration completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pgClient.end();
  }
}

migrateImages();

