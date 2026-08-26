import { MEDIA_BASE_URL } from '../config/api'

/**
 * Resolves a media path from the database to a usable URL.
 * Cloudinary rows store absolute https URLs; legacy rows store /uploads/... paths.
 */
export const mediaUrl = (path) => {
  if (!path) return ''
  return path.startsWith('http') ? path : `${MEDIA_BASE_URL}${path}`
}
