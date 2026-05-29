import express from 'express'
import { dbAll, dbRun } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Get all education (public)
router.get('/', async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT * FROM education WHERE is_active = true ORDER BY is_current DESC, start_date DESC
    `, [])
    res.json(rows)
  } catch (error) {
    console.error('Get education error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get all education including inactive (admin)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM education ORDER BY is_current DESC, start_date DESC', [])
    res.json(rows)
  } catch (error) {
    console.error('Get all education error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add education (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { institution, degree, field_of_study, start_date, end_date, is_current, description, gpa } = req.body

    const result = await dbRun(
      `INSERT INTO education (institution, degree, field_of_study, start_date, end_date, is_current, description, gpa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [institution, degree, field_of_study, start_date, end_date || null, is_current ? 1 : 0, description, gpa]
    )

    res.json({ message: 'Education added successfully', id: result.lastInsertRowid })
  } catch (error) {
    console.error('Add education error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update education (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { institution, degree, field_of_study, start_date, end_date, is_current, description, gpa, is_active } = req.body

    await dbRun(
      `UPDATE education SET institution = ?, degree = ?, field_of_study = ?, start_date = ?, 
       end_date = ?, is_current = ?, description = ?, gpa = ?, is_active = ? WHERE id = ?`,
      [institution, degree, field_of_study, start_date, end_date || null, is_current ? 1 : 0, description, gpa, is_active !== false ? 1 : 0, id]
    )

    res.json({ message: 'Education updated successfully' })
  } catch (error) {
    console.error('Update education error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Upload institution logo
router.post('/:id/upload-logo', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const logoUrl = req.file.path
    await dbRun('UPDATE education SET logo = ? WHERE id = ?', [logoUrl, id])

    res.json({ message: 'Logo uploaded successfully', logoUrl })
  } catch (error) {
    console.error('Upload logo error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete education (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await dbRun('DELETE FROM education WHERE id = ?', [id])
    res.json({ message: 'Education deleted successfully' })
  } catch (error) {
    console.error('Delete education error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
