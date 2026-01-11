import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Ensure all subdirectories exist
const subdirs = ['general', 'companies', 'experiences', 'certifications', 'projects', 'education']
subdirs.forEach(dir => {
  const subPath = path.join(uploadDir, dir)
  if (!fs.existsSync(subPath)) {
    fs.mkdirSync(subPath, { recursive: true })
  }
})

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine folder based on route or query
    let type = req.query.type || 'general'
    
    // Auto-detect folder from URL path
    if (req.originalUrl.includes('/experiences/') && req.originalUrl.includes('/upload-logo')) {
      type = 'companies'
    } else if (req.originalUrl.includes('/experiences/') && req.originalUrl.includes('/upload-media')) {
      type = 'experiences'
    } else if (req.originalUrl.includes('/certifications/')) {
      type = 'certifications'
    } else if (req.originalUrl.includes('/projects/')) {
      type = 'projects'
    } else if (req.originalUrl.includes('/education/')) {
      type = 'education'
    }
    
    const typeDir = path.join(uploadDir, type)
    
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true })
    }
    
    cb(null, typeDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and PDF are allowed.'), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
})
