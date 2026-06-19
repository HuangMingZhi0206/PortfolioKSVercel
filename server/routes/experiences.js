import express from 'express'
import { dbAll, dbRun } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Get all experiences (public)
router.get('/', async (req, res) => {
  try {
    const experiences = await dbAll(`
      SELECT * FROM experiences WHERE is_active = true ORDER BY is_current DESC, start_date DESC
    `, [])

    // Get highlights, media, and skills for each experience
    for (let exp of experiences) {
      const highlights = await dbAll(
        'SELECT * FROM experience_highlights WHERE experience_id = ? ORDER BY order_index',
        [exp.id]
      )
      exp.highlights = highlights.map(h => h.highlight)

      const media = await dbAll(
        'SELECT * FROM experience_media WHERE experience_id = ? ORDER BY created_at',
        [exp.id]
      )
      exp.media = media

      const skills = await dbAll(`
        SELECT s.* FROM skills s
        JOIN experience_skills es ON s.id = es.skill_id
        WHERE es.experience_id = ?
      `, [exp.id])
      exp.skills = skills
    }

    res.json(experiences)
  } catch (error) {
    console.error('Get experiences error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get all experiences including inactive (admin)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const experiences = await dbAll('SELECT * FROM experiences ORDER BY is_current DESC, start_date DESC', [])

    for (let exp of experiences) {
      const highlights = await dbAll(
        'SELECT * FROM experience_highlights WHERE experience_id = ? ORDER BY order_index',
        [exp.id]
      )
      exp.highlights = highlights.map(h => h.highlight)

      const media = await dbAll(
        'SELECT * FROM experience_media WHERE experience_id = ? ORDER BY created_at',
        [exp.id]
      )
      exp.media = media

      const skills = await dbAll(`
        SELECT s.* FROM skills s
        JOIN experience_skills es ON s.id = es.skill_id
        WHERE es.experience_id = ?
      `, [exp.id])
      exp.skills = skills
    }

    res.json(experiences)
  } catch (error) {
    console.error('Get all experiences error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add experience (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { company, position, employment_type, location, start_date, end_date, is_current, description, highlights, experience_type } = req.body

    const result = await dbRun(
      `INSERT INTO experiences (company, position, employment_type, location, start_date, end_date, is_current, description, experience_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [company, position, employment_type || 'Full-time', location, start_date, end_date || null, is_current ? 1 : 0, description, experience_type || 'Work']
    )

    // Add highlights
    if (highlights && highlights.length > 0) {
      for (let i = 0; i < highlights.length; i++) {
        await dbRun(
          'INSERT INTO experience_highlights (experience_id, highlight, order_index) VALUES (?, ?, ?)',
          [result.lastInsertRowid, highlights[i], i]
        )
      }
    }

    res.json({ message: 'Experience added successfully', id: result.lastInsertRowid })
  } catch (error) {
    console.error('Add experience error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update experience (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { company, position, employment_type, location, start_date, end_date, is_current, description, highlights, is_active, experience_type } = req.body

    await dbRun(
      `UPDATE experiences SET company = ?, position = ?, employment_type = ?, location = ?, start_date = ?, end_date = ?, 
       is_current = ?, description = ?, is_active = ?, experience_type = ? WHERE id = ?`,
      [company, position, employment_type || 'Full-time', location, start_date, end_date || null, is_current ? 1 : 0, description, is_active !== false ? 1 : 0, experience_type || 'Work', id]
    )

    // Update highlights
    await dbRun('DELETE FROM experience_highlights WHERE experience_id = ?', [id])
    if (highlights && highlights.length > 0) {
      for (let i = 0; i < highlights.length; i++) {
        await dbRun(
          'INSERT INTO experience_highlights (experience_id, highlight, order_index) VALUES (?, ?, ?)',
          [id, highlights[i], i]
        )
      }
    }

    res.json({ message: 'Experience updated successfully' })
  } catch (error) {
    console.error('Update experience error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Upload company logo
router.post('/:id/upload-logo', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const logoUrl = req.file.path
    await dbRun('UPDATE experiences SET company_logo = ? WHERE id = ?', [logoUrl, id])

    res.json({ message: 'Logo uploaded successfully', logoUrl })
  } catch (error) {
    console.error('Upload logo error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Upload media (documents, projects, etc.)
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
      'INSERT INTO experience_media (experience_id, title, description, file_path, file_type) VALUES (?, ?, ?, ?, ?)',
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
    await dbRun('DELETE FROM experience_media WHERE id = ?', [mediaId])
    res.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Delete media error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add skill to experience
router.post('/:id/skills', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { skill_id } = req.body

    await dbRun(
      'INSERT OR IGNORE INTO experience_skills (experience_id, skill_id) VALUES (?, ?)',
      [id, skill_id]
    )

    res.json({ message: 'Skill added to experience' })
  } catch (error) {
    console.error('Add skill error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Remove skill from experience
router.delete('/:id/skills/:skillId', authenticateToken, async (req, res) => {
  try {
    const { id, skillId } = req.params
    await dbRun(
      'DELETE FROM experience_skills WHERE experience_id = ? AND skill_id = ?',
      [id, skillId]
    )
    res.json({ message: 'Skill removed from experience' })
  } catch (error) {
    console.error('Remove skill error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete experience (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await dbRun('DELETE FROM experiences WHERE id = ?', [id])
    res.json({ message: 'Experience deleted successfully' })
  } catch (error) {
    console.error('Delete experience error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
