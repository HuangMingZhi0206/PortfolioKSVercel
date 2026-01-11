import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, FolderOpen, ExternalLink, Github, Star, Upload, Image, Calendar } from 'lucide-react'

const ProjectManager = () => {
  const [projects, setProjects] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    demo_url: '',
    github_url: '',
    category: '',
    featured: false,
    is_ongoing: false,
    start_month: '',
    start_year: '',
    end_month: '',
    end_year: '',
    technologies: [],
    skills: []
  })
  const [mediaFiles, setMediaFiles] = useState([])
  const [existingMedia, setExistingMedia] = useState([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const API_URL = 'http://localhost:5000/api'
  const token = localStorage.getItem('admin_token')

  const categories = ['Web', 'Mobile', 'IoT', 'Robotics', 'AI/ML', 'Desktop', 'Game', 'Other']

  const months = [
    { value: '', label: 'Month' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

  const currentYear = new Date().getFullYear()
  const years = [{ value: '', label: 'Year' }, ...Array.from({ length: 30 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i)
  }))]

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
    setLoading(false)
  }

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/skills`)
      const data = await response.json()
      setAllSkills(data)
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchSkills()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const url = editingId 
      ? `${API_URL}/projects/${editingId}`
      : `${API_URL}/projects`
    
    const method = editingId ? 'PUT' : 'POST'

    // Build date strings
    const start_date = formData.start_month && formData.start_year 
      ? `${formData.start_year}-${formData.start_month}` 
      : null
    const end_date = formData.is_ongoing 
      ? null 
      : (formData.end_month && formData.end_year ? `${formData.end_year}-${formData.end_month}` : null)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          start_date,
          end_date,
          technologies: formData.skills, // Use skills as technologies
          skills: formData.skills
        })
      })

      if (response.ok) {
        const result = await response.json()
        const projectId = editingId || result.id

        // Upload media files if any
        if (mediaFiles.length > 0) {
          for (const file of mediaFiles) {
            await handleMediaUpload(projectId, file)
          }
        }

        setMessage({ type: 'success', text: `Project ${editingId ? 'updated' : 'added'} successfully!` })
        fetchProjects()
        closeModal()
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to save' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' })
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Project deleted successfully!' })
        fetchProjects()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' })
    }
  }

  const handleImageUpload = async (projectId, file) => {
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/upload-image?type=projects`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Image uploaded!' })
        fetchProjects()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' })
    }
  }

  const handleMediaUpload = async (projectId, file) => {
    const formDataUpload = new FormData()
    formDataUpload.append('media', file)

    try {
      await fetch(`${API_URL}/projects/${projectId}/upload-media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      })
    } catch (error) {
      console.error('Failed to upload media:', error)
    }
  }

  const handleDeleteMedia = async (projectId, mediaId) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/media/${mediaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Failed to delete media:', error)
    }
  }

  const openModal = (project = null) => {
    if (project) {
      // Parse dates
      let start_month = '', start_year = '', end_month = '', end_year = ''
      if (project.start_date) {
        const [y, m] = project.start_date.split('-')
        start_year = y
        start_month = m
      }
      if (project.end_date) {
        const [y, m] = project.end_date.split('-')
        end_year = y
        end_month = m
      }

      setEditingId(project.id)
      setExistingMedia(project.media || [])
      setFormData({
        title: project.title || '',
        description: project.description || '',
        short_description: project.short_description || '',
        demo_url: project.demo_url || '',
        github_url: project.github_url || '',
        category: project.category || '',
        featured: project.featured || false,
        is_ongoing: project.is_ongoing || false,
        start_month,
        start_year,
        end_month,
        end_year,
        technologies: project.technologies?.length > 0 ? project.technologies : [],
        skills: project.technologies?.length > 0 ? project.technologies : []
      })
    } else {
      setEditingId(null)
      setExistingMedia([])
      setFormData({
        title: '',
        description: '',
        short_description: '',
        demo_url: '',
        github_url: '',
        category: '',
        featured: false,
        is_ongoing: false,
        start_month: '',
        start_year: '',
        end_month: '',
        end_year: '',
        technologies: [],
        skills: []
      })
    }
    setMediaFiles([])
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setMediaFiles([])
    setExistingMedia([])
  }

  const addSkill = (skillName) => {
    if (skillName && !formData.skills.includes(skillName)) {
      setFormData({ ...formData, skills: [...formData.skills, skillName] })
    }
  }

  const removeSkill = (skillName) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillName) })
  }

  const handleMediaFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setMediaFiles([...mediaFiles, ...files])
  }

  const removeMediaFile = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index))
  }

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Projects</h3>
          <p className="text-gray-500 text-sm">Showcase your best work</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
        >
          <Plus size={20} />
          Add Project
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No projects added yet. Click "Add Project" to get started.
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800/50 border rounded-xl overflow-hidden ${
                project.is_active ? 'border-gray-700' : 'border-red-500/30 opacity-60'
              }`}
            >
              {/* Project Image */}
              <div className="relative h-40 bg-gray-700">
                {project.media && project.media.length > 0 ? (
                  <img
                    src={`http://localhost:5000${project.media[0].media_url}`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : project.image ? (
                  <img
                    src={`http://localhost:5000${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="text-gray-600" size={48} />
                  </div>
                )}
                {/* Media Count Badge */}
                {project.media && project.media.length > 1 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-lg flex items-center gap-1">
                    <Image size={12} />
                    {project.media.length}
                  </div>
                )}
                <label className="absolute bottom-2 right-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(project.id, e.target.files[0])}
                    className="hidden"
                  />
                  <div className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors">
                    <Upload size={16} />
                  </div>
                </label>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-semibold">{project.title}</h4>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                    {project.category || 'Other'}
                  </span>
                </div>

                {/* Date Range */}
                {project.start_date && (
                  <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(project.start_date)} - {project.is_ongoing ? 'Present' : formatDate(project.end_date)}
                  </p>
                )}

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {project.short_description || project.description}
                </p>
                
                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex gap-2">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal(project)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal - LinkedIn Style */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h3 className="text-xl font-semibold text-white">
                  {editingId ? 'Edit Project' : 'Add Project'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Project Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Project name *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g., IoT Smart Home System"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 2000) })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                    placeholder="Describe what this project is about, your role, and key achievements..."
                  />
                  <p className="text-right text-xs text-gray-500 mt-1">{formData.description.length}/2,000</p>
                </div>

                {/* Skills Section */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Skills</label>
                  <p className="text-xs text-gray-500 mb-3">We recommend adding your top 5 used in this project. They'll also appear in your Skills section.</p>
                  
                  {/* Selected Skills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Skill Dropdown */}
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        addSkill(e.target.value)
                        e.target.value = ''
                      }}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                    >
                      <option value="">+ Add skill</option>
                      {allSkills
                        .filter(s => !formData.skills.includes(s.name))
                        .map(skill => (
                          <option key={skill.id} value={skill.name}>{skill.name}</option>
                        ))
                      }
                    </select>
                    <Plus size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Media Section */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Media</label>
                  <p className="text-xs text-gray-500 mb-3">Add media like images, documents, sites or presentations.</p>
                  
                  {/* Existing Media (when editing) */}
                  {existingMedia.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-2">Existing media:</p>
                      <div className="flex flex-wrap gap-2">
                        {existingMedia.map((media) => (
                          <div key={media.id} className="relative group">
                            <div className="w-20 h-20 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                              <img 
                                src={`http://localhost:5000${media.media_url}`} 
                                alt={media.caption || ''} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleDeleteMedia(editingId, media.id)
                                setExistingMedia(existingMedia.filter(m => m.id !== media.id))
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Media Files to upload */}
                  {mediaFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {mediaFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="w-20 h-20 bg-gray-800 border border-indigo-500/50 rounded-lg flex items-center justify-center overflow-hidden">
                            {file.type.startsWith('image/') ? (
                              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Image size={24} className="text-gray-500" />
                            )}
                          </div>
                          <div className="absolute top-0 left-0 bg-indigo-500 text-white text-[8px] px-1 rounded-br">NEW</div>
                          <button
                            type="button"
                            onClick={() => removeMediaFile(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-indigo-400 hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                      multiple
                      onChange={handleMediaFileSelect}
                      className="hidden"
                    />
                    <Plus size={16} />
                    Add media
                  </label>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Project URL</label>
                    <input
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Additional Details */}
                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Additional details</h4>
                  
                  {/* Currently working */}
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={formData.is_ongoing}
                      onChange={(e) => setFormData({ ...formData, is_ongoing: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">I am currently working on this project</span>
                  </label>

                  {/* Start Date */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Start date</label>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={formData.start_month}
                        onChange={(e) => setFormData({ ...formData, start_month: e.target.value })}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      >
                        {months.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                      <select
                        value={formData.start_year}
                        onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      >
                        {years.map(y => (
                          <option key={y.value} value={y.value}>{y.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* End Date */}
                  {!formData.is_ongoing && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-400 mb-2">End date</label>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={formData.end_month}
                          onChange={(e) => setFormData({ ...formData, end_month: e.target.value })}
                          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        >
                          {months.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                        <select
                          value={formData.end_year}
                          onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        >
                          {years.map(y => (
                            <option key={y.value} value={y.value}>{y.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Featured */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-gray-300">⭐ Featured Project</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save size={18} />
                        Save
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectManager
