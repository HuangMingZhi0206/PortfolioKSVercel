import express from 'express'
import { dbAll, dbRun, dbGet } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await dbAll(`
      SELECT * FROM projects WHERE is_active = true ORDER BY order_index, created_at DESC
    `, [])

    // Get technologies and media for each project
    for (let project of projects) {
      const techs = await dbAll(
        'SELECT technology FROM project_technologies WHERE project_id = ?',
        [project.id]
      )
      project.technologies = techs.map(t => t.technology)

      const media = await dbAll(
        'SELECT * FROM project_media WHERE project_id = ? ORDER BY order_index',
        [project.id]
      )
      project.media = media
    }

    res.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get all projects including inactive (admin)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const projects = await dbAll('SELECT * FROM projects ORDER BY order_index, created_at DESC', [])

    for (let project of projects) {
      const techs = await dbAll(
        'SELECT technology FROM project_technologies WHERE project_id = ?',
        [project.id]
      )
      project.technologies = techs.map(t => t.technology)

      const media = await dbAll(
        'SELECT * FROM project_media WHERE project_id = ? ORDER BY order_index',
        [project.id]
      )
      project.media = media
    }

    res.json(projects)
  } catch (error) {
    console.error('Get all projects error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add project (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, short_description, demo_url, github_url, category, featured, technologies, start_date, end_date, is_ongoing } = req.body

    const result = await dbRun(
      `INSERT INTO projects (title, description, short_description, demo_url, github_url, category, featured, start_date, end_date, is_ongoing, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [title, description, short_description, demo_url, github_url, category, featured ? 1 : 0, start_date, end_date, is_ongoing ? 1 : 0]
    )

    // Add technologies
    if (technologies && technologies.length > 0) {
      for (const tech of technologies) {
        await dbRun(
          'INSERT INTO project_technologies (project_id, technology) VALUES (?, ?)',
          [result.lastInsertRowid, tech]
        )
      }
    }

    res.json({ message: 'Project added successfully', id: result.lastInsertRowid })
  } catch (error) {
    console.error('Add project error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update project (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, short_description, demo_url, github_url, category, featured, technologies, is_active, start_date, end_date, is_ongoing } = req.body

    await dbRun(
      `UPDATE projects SET title = ?, description = ?, short_description = ?, demo_url = ?, 
       github_url = ?, category = ?, featured = ?, is_active = ?, start_date = ?, end_date = ?, is_ongoing = ? WHERE id = ?`,
      [title, description, short_description, demo_url, github_url, category, featured ? 1 : 0, is_active !== false ? 1 : 0, start_date, end_date, is_ongoing ? 1 : 0, id]
    )

    // Update technologies
    await dbRun('DELETE FROM project_technologies WHERE project_id = ?', [id])
    if (technologies && technologies.length > 0) {
      for (const tech of technologies) {
        await dbRun(
          'INSERT INTO project_technologies (project_id, technology) VALUES (?, ?)',
          [id, tech]
        )
      }
    }

    res.json({ message: 'Project updated successfully' })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Upload project image
router.post('/:id/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const imageUrl = req.file.path
    await dbRun('UPDATE projects SET image = ? WHERE id = ?', [imageUrl, id])

    res.json({ message: 'Image uploaded successfully', imageUrl })
  } catch (error) {
    console.error('Upload image error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Upload project media (multiple)
router.post('/:id/upload-media', authenticateToken, upload.single('media'), async (req, res) => {
  try {
    const { id } = req.params
    const { caption } = req.body
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const mediaUrl = req.file.path
    const mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'file'

    // Get current max order_index
    const maxOrder = await dbGet(
      'SELECT MAX(order_index) as maxOrder FROM project_media WHERE project_id = ?',
      [id]
    )
    const orderIndex = (maxOrder?.maxOrder || 0) + 1

    const result = await dbRun(
      'INSERT INTO project_media (project_id, media_url, media_type, caption, order_index) VALUES (?, ?, ?, ?, ?)',
      [id, mediaUrl, mediaType, caption || null, orderIndex]
    )

    res.json({ message: 'Media uploaded successfully', mediaUrl, id: result.lastInsertRowid })
  } catch (error) {
    console.error('Upload media error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete project media
router.delete('/:id/media/:mediaId', authenticateToken, async (req, res) => {
  try {
    const { mediaId } = req.params
    await dbRun('DELETE FROM project_media WHERE id = ?', [mediaId])
    res.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Delete media error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete project (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await dbRun('DELETE FROM projects WHERE id = ?', [id])
    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
