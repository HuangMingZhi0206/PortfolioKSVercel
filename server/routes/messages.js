import express from 'express'
import { dbAll, dbRun, dbGet } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all messages (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM contact_messages ORDER BY created_at DESC', [])
    res.json(rows)
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Submit contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    await dbRun(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    )

    res.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Submit message error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Mark message as read (admin only)
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await dbRun('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id])
    res.json({ message: 'Message marked as read' })
  } catch (error) {
    console.error('Mark read error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete message (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await dbRun('DELETE FROM contact_messages WHERE id = ?', [id])
    res.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get unread count (admin only)
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const row = await dbGet('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0', [])
    res.json({ count: row.count })
  } catch (error) {
    console.error('Get unread count error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
