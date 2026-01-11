import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool, testConnection } from './config/database.js'

// Import routes
import authRoutes from './routes/auth.js'
import aboutRoutes from './routes/about.js'
import skillsRoutes from './routes/skills.js'
import experiencesRoutes from './routes/experiences.js'
import projectsRoutes from './routes/projects.js'
import certificationsRoutes from './routes/certifications.js'
import educationRoutes from './routes/education.js'
import messagesRoutes from './routes/messages.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/about', aboutRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/experiences', experiencesRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/certifications', certificationsRoutes)
app.use('/api/education', educationRoutes)
app.use('/api/messages', messagesRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Dashboard stats (admin)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT COUNT(*) as count FROM projects')
    const [experiences] = await pool.query('SELECT COUNT(*) as count FROM experiences')
    const [certifications] = await pool.query('SELECT COUNT(*) as count FROM certifications')
    const [messages] = await pool.query('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = FALSE')
    const [skills] = await pool.query('SELECT COUNT(*) as count FROM skills')

    res.json({
      projects: projects[0].count,
      experiences: experiences[0].count,
      certifications: certifications[0].count,
      unreadMessages: messages[0].count,
      skills: skills[0].count
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
const startServer = async () => {
  await testConnection()
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📁 API endpoints available at http://localhost:${PORT}/api`)
  })
}

startServer()
