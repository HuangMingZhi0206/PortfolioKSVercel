import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder based on route or query
    let folder = req.query.type || 'portfolio/general'
    
    // Auto-detect folder from URL path
    if (req.originalUrl.includes('/experiences/') && req.originalUrl.includes('/upload-logo')) {
      folder = 'portfolio/companies'
    } else if (req.originalUrl.includes('/experiences/') && req.originalUrl.includes('/upload-media')) {
      folder = 'portfolio/experiences'
    } else if (req.originalUrl.includes('/certifications/')) {
      folder = 'portfolio/certifications'
    } else if (req.originalUrl.includes('/projects/')) {
      folder = 'portfolio/projects'
    } else if (req.originalUrl.includes('/education/')) {
      folder = 'portfolio/education'
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'pdf'],
      // Add a unique suffix
      public_id: Date.now() + '-' + Math.round(Math.random() * 1E9) + (file.mimetype === 'application/pdf' ? '.pdf' : ''),
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image'
    }
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
