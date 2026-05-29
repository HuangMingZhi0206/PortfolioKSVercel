import express from 'express'
import { dbGet, dbRun } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Get about me (public)
router.get('/', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM about_me WHERE id = 1', [])
    res.json(row || {})
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

    const existing = await dbGet('SELECT id FROM about_me WHERE id = 1', [])

    if (existing) {
      await dbRun(
        `UPDATE about_me SET 
        title = ?, subtitle = ?, description = ?, phone = ?, email = ?,
        location = ?, linkedin_url = ?, github_url = ?, instagram_url = ?, resume_url = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = 1`,
        [title, subtitle, description, phone, email, location, linkedin_url, github_url, instagram_url, resume_url]
      )
    } else {
      await dbRun(
        `INSERT INTO about_me (id, title, subtitle, description, phone, email, location, linkedin_url, github_url, instagram_url, resume_url)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, subtitle, description, phone, email, location, linkedin_url, github_url, instagram_url, resume_url]
      )
    }

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

    const imageUrl = req.file.path
    await dbRun('UPDATE about_me SET profile_image = ? WHERE id = 1', [imageUrl])

    res.json({ message: 'Image uploaded successfully', imageUrl })
  } catch (error) {
    console.error('Upload image error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Upload resume PDF
router.post('/upload-resume', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const resumeUrl = req.file.path
    await dbRun('UPDATE about_me SET resume_url = ? WHERE id = 1', [resumeUrl])

    res.json({ message: 'Resume uploaded successfully', resumeUrl })
  } catch (error) {
    console.error('Upload resume error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
