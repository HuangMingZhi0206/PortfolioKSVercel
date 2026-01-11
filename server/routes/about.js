import express from 'express'
import { pool } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Get about me (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM about_me WHERE id = 1')
    res.json(rows[0] || {})
  } catch (error) {
    console.error('Get about error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update about me (protected)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      title, subtitle, description, phone, email,
      location, linkedin_url, github_url, instagram_url, resume_url
    } = req.body

    await pool.query(`
      INSERT INTO about_me (id, title, subtitle, description, phone, email, location, linkedin_url, github_url, instagram_url, resume_url)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      subtitle = VALUES(subtitle),
      description = VALUES(description),
      phone = VALUES(phone),
      email = VALUES(email),
      location = VALUES(location),
      linkedin_url = VALUES(linkedin_url),
      github_url = VALUES(github_url),
      instagram_url = VALUES(instagram_url),
      resume_url = VALUES(resume_url)
    `, [title, subtitle, description, phone, email, location, linkedin_url, github_url, instagram_url, resume_url])

    res.json({ message: 'About updated successfully' })
  } catch (error) {
    console.error('Update about error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Upload profile image
router.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const imageUrl = `/uploads/profile/${req.file.filename}`
    await pool.query('UPDATE about_me SET profile_image = ? WHERE id = 1', [imageUrl])

    res.json({ message: 'Image uploaded successfully', imageUrl })
  } catch (error) {
    console.error('Upload image error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
