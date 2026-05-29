import express from 'express'
import { dbAll, dbRun } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Get all certifications (public)
router.get('/', async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT * FROM certifications WHERE is_active = 1 ORDER BY order_index, issue_date DESC
    `, [])

    // Get media and skills for each certification
    for (let cert of rows) {
      const media = await dbAll(
        'SELECT * FROM certification_media WHERE certification_id = ? ORDER BY created_at',
        [cert.id]
      )
      cert.media = media

      const skills = await dbAll(`
        SELECT s.* FROM skills s
        JOIN certification_skills cs ON s.id = cs.skill_id
        WHERE cs.certification_id = ?
      `, [cert.id])
      cert.skills = skills
    }

    res.json(rows)
  } catch (error) {
    console.error('Get certifications error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get all certifications including inactive (admin)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM certifications ORDER BY order_index, issue_date DESC', [])

    // Get media and skills for each certification
    for (let cert of rows) {
      const media = await dbAll(
        'SELECT * FROM certification_media WHERE certification_id = ? ORDER BY created_at',
        [cert.id]
      )
      cert.media = media

      const skills = await dbAll(`
        SELECT s.* FROM skills s
        JOIN certification_skills cs ON s.id = cs.skill_id
        WHERE cs.certification_id = ?
      `, [cert.id])
      cert.skills = skills
    }

    res.json(rows)
  } catch (error) {
    console.error('Get all certifications error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add certification (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, issuer, issue_date, expiry_date, credential_id, credential_url, description } = req.body

    const result = await dbRun(
      `INSERT INTO certifications (title, issuer, issue_date, expiry_date, credential_id, credential_url, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, issuer, issue_date, expiry_date || null, credential_id, credential_url, description]
    )

    res.json({ message: 'Certification added successfully', id: result.lastInsertRowid })
  } catch (error) {
    console.error('Add certification error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update certification (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, issuer, issue_date, expiry_date, credential_id, credential_url, description, is_active } = req.body

    await dbRun(
      `UPDATE certifications SET title = ?, issuer = ?, issue_date = ?, expiry_date = ?, 
       credential_id = ?, credential_url = ?, description = ?, is_active = ? WHERE id = ?`,
      [title, issuer, issue_date, expiry_date || null, credential_id, credential_url, description, is_active !== false ? 1 : 0, id]
    )

    res.json({ message: 'Certification updated successfully' })
  } catch (error) {
    console.error('Update certification error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Upload certification image (issuer logo)
router.post('/:id/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const imageUrl = req.file.path
    await dbRun('UPDATE certifications SET image = ? WHERE id = ?', [imageUrl, id])

    res.json({ message: 'Image uploaded successfully', imageUrl })
  } catch (error) {
    console.error('Upload image error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Upload media (certificate file, documents, etc.)
router.post('/:id/upload-media', authenticateToken, upload.single('media'), async (req, res) => {
  try {
    const { id } = req.params
    const { title, description } = req.body

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const filePath = req.file.path
    const fileType = req.file.mimetype

    const result = await dbRun(
      'INSERT INTO certification_media (certification_id, title, description, file_path, file_type) VALUES (?, ?, ?, ?, ?)',
      [id, title || req.file.originalname, description || '', filePath, fileType]
    )

    res.json({
      message: 'Media uploaded successfully',
      media: {
        id: result.lastInsertRowid,
        title: title || req.file.originalname,
        description,
        file_path: filePath,
        file_type: fileType
      }
    })
  } catch (error) {
    console.error('Upload media error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete media
router.delete('/:id/media/:mediaId', authenticateToken, async (req, res) => {
  try {
    const { mediaId } = req.params
    await dbRun('DELETE FROM certification_media WHERE id = ?', [mediaId])
    res.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Delete media error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add skill to certification
router.post('/:id/skills', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { skill_id } = req.body

    await dbRun(
      'INSERT OR IGNORE INTO certification_skills (certification_id, skill_id) VALUES (?, ?)',
      [id, skill_id]
    )

    res.json({ message: 'Skill added to certification' })
  } catch (error) {
    console.error('Add skill error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Remove skill from certification
router.delete('/:id/skills/:skillId', authenticateToken, async (req, res) => {
  try {
    const { id, skillId } = req.params
    await dbRun(
      'DELETE FROM certification_skills WHERE certification_id = ? AND skill_id = ?',
      [id, skillId]
    )
    res.json({ message: 'Skill removed from certification' })
  } catch (error) {
    console.error('Remove skill error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete certification (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await dbRun('DELETE FROM certifications WHERE id = ?', [id])
    res.json({ message: 'Certification deleted successfully' })
  } catch (error) {
    console.error('Delete certification error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
