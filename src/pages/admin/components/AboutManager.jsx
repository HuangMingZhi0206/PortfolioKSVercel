import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Upload, User, Mail, Phone, MapPin, Linkedin, Github, Instagram, FileText } from 'lucide-react'
import { API_URL, API_BASE_URL } from '../../../config/api'

const AboutManager = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    phone: '',
    email: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    instagram_url: '',
    resume_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [profileImage, setProfileImage] = useState(null)

  const token = localStorage.getItem('admin_token')

  const fetchAbout = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/about`)
      const data = await response.json()
      if (data) {
        setFormData(data)
        setProfileImage(data.profile_image)
      }
    } catch (error) {
      console.error('Failed to fetch about:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAbout()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`${API_URL}/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    }
    setSaving(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_URL}/about/upload-image?type=profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      
      if (response.ok) {
        setProfileImage(data.imageUrl)
        setMessage({ type: 'success', text: 'Profile image uploaded!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload image' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' })
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const response = await fetch(`${API_URL}/about/upload-resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      
      if (response.ok) {
        setFormData(prev => ({ ...prev, resume_url: data.resumeUrl }))
        setMessage({ type: 'success', text: 'Resume uploaded successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload resume' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload resume' })
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Profile Image Section */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User size={20} />
          Profile Image
        </h3>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-gray-700 overflow-hidden">
              {profileImage ? (
                <img 
                  src={`${API_BASE_URL}${profileImage}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <User size={48} />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/30 transition-colors">
                <Upload size={18} />
                Upload New Photo
              </div>
            </label>
            <p className="text-gray-500 text-sm mt-2">
              Recommended: 400x400px, JPG or PNG
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name / Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="Kevin Syonin"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Subtitle / Role</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="Product Development Engineer"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-2">Description / Bio</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="Tell about yourself..."
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="Email"
              />
            </div>
            
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="Phone"
              />
            </div>
            
            <div className="relative md:col-span-2">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="Location"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
          
          <div className="space-y-4">
            <div className="relative">
              <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="LinkedIn URL"
              />
            </div>
            
            <div className="relative">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="url"
                name="github_url"
                value={formData.github_url || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="GitHub URL"
              />
            </div>
            
            <div className="relative">
              <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="Instagram URL"
              />
            </div>
            
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                name="resume_url"
                value={formData.resume_url || ''}
                readOnly
                className="w-full pl-12 pr-32 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="Resume/CV URL"
              />
              <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}

export default AboutManager
