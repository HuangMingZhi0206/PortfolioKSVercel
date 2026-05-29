// Config uses environment variable if available, otherwise defaults to localhost
// For Vercel production, API is served from the same domain under /api

export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000')

export const API_URL = `${API_BASE_URL}/api`

// For images, since we migrated to Cloudinary, the image paths in DB are now absolute URLs
// or we can just keep MEDIA_BASE_URL empty. Cloudinary returns full https URLs.
// But some old data might still use /uploads/... So we keep it pointing to same domain or backend
export const MEDIA_BASE_URL = import.meta.env.MODE === 'production' ? '' : API_BASE_URL
