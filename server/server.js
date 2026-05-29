import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { testConnection, dbGet } from './config/database.js'

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
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://kevinsyonin.mingzhitechgroup.site',
    'https://mingzhitechgroup.site',
    'https://api.mingzhitechgroup.site',
    // Allow vercel preview deployments
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
    const projects = await dbGet('SELECT COUNT(*) as count FROM projects', [])
    const experiences = await dbGet('SELECT COUNT(*) as count FROM experiences', [])
    const certifications = await dbGet('SELECT COUNT(*) as count FROM certifications', [])
    const messages = await dbGet('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = false', [])
    const skills = await dbGet('SELECT COUNT(*) as count FROM skills', [])

    res.json({
      projects: parseInt(projects?.count || 0),
      experiences: parseInt(experiences?.count || 0),
      certifications: parseInt(certifications?.count || 0),
      unreadMessages: parseInt(messages?.count || 0),
      skills: parseInt(skills?.count || 0)
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

// Export app for Vercel Serverless
export default app;

// Only start the server if we're not running in Vercel
if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL === 'true') {
  testConnection().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📁 API endpoints available at http://localhost:${PORT}/api`)
      console.log(`💾 Database: PostgreSQL (Supabase)`)
    })
  })
}
