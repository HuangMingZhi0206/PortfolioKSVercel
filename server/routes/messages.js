import express from 'express'
import { dbAll, dbRun, dbGet } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'
import nodemailer from 'nodemailer'
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

    // Send email notification if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider here
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send notification to yourself
        replyTo: email, // So you can directly reply to the sender
        subject: `New Contact Form Message: ${subject || 'No Subject'}`,
        text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\nMessage:\n${message}`
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    } else {
      console.log('Email notification skipped: EMAIL_USER or EMAIL_PASS not configured in .env');
    }

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
    await dbRun('UPDATE contact_messages SET is_read = true WHERE id = ?', [id])
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
    const row = await dbGet('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = false', [])
    res.json({ count: row.count })
  } catch (error) {
    console.error('Get unread count error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
