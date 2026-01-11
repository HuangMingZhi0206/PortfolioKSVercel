import express from 'express'
import { pool } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills WHERE is_active = TRUE ORDER BY category, order_index')
    res.json(rows)
  } catch (error) {
    console.error('Get skills error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get all skills including inactive (admin)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY category, order_index')
    res.json(rows)
  } catch (error) {
    console.error('Get all skills error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add skill (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, category, proficiency, icon, color, order_index } = req.body

    const [result] = await pool.query(
      'INSERT INTO skills (name, category, proficiency, icon, color, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, TRUE)',
      [name, category, proficiency || 80, icon, color, order_index || 0]
    )

    res.json({ message: 'Skill added successfully', id: result.insertId })
  } catch (error) {
    console.error('Add skill error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update skill (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, proficiency, icon, color, order_index, is_active } = req.body

    await pool.query(
      'UPDATE skills SET name = ?, category = ?, proficiency = ?, icon = ?, color = ?, order_index = ?, is_active = ? WHERE id = ?',
      [name, category, proficiency, icon, color, order_index, is_active, id]
    )

    res.json({ message: 'Skill updated successfully' })
  } catch (error) {
    console.error('Update skill error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete skill (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM skills WHERE id = ?', [id])
    res.json({ message: 'Skill deleted successfully' })
  } catch (error) {
    console.error('Delete skill error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
