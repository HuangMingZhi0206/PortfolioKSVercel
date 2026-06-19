import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Building2, Calendar, MapPin, Upload, FileText, Image } from 'lucide-react'
import { API_URL, API_BASE_URL } from '../../../config/api'

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [selectedExp, setSelectedExp] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    employment_type: 'Full-time',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    experience_type: 'Work',
    highlights: ['']
  })
  const [mediaForm, setMediaForm] = useState({
    title: '',
    description: '',
    file: null
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const token = localStorage.getItem('admin_token')

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${API_URL}/experiences/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setExperiences(data)
    } catch (error) {
      console.error('Failed to fetch experiences:', error)
    }
    setLoading(false)
  }

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/skills`)
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    }
  }

  useEffect(() => {
    fetchExperiences()
    fetchSkills()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const url = editingId 
      ? `${API_URL}/experiences/${editingId}`
      : `${API_URL}/experiences`
    
    const method = editingId ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          highlights: formData.highlights.filter(h => h.trim() !== '')
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: `Experience ${editingId ? 'updated' : 'added'} successfully!` })
        fetchExperiences()
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
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const response = await fetch(`${API_URL}/experiences/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Experience deleted successfully!' })
        fetchExperiences()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' })
    }
  }

  const handleLogoUpload = async (expId, file) => {
    const formData = new FormData()
    formData.append('logo', file)

    try {
      const response = await fetch(`${API_URL}/experiences/${expId}/upload-logo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Company logo uploaded!' })
        fetchExperiences()
      } else {
        setMessage({ type: 'error', text: 'Failed to upload logo' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload logo' })
    }
  }

  const handleMediaUpload = async (e) => {
    e.preventDefault()
    if (!mediaForm.file || !selectedExp) return

    const formDataObj = new FormData()
    formDataObj.append('media', mediaForm.file)
    formDataObj.append('title', mediaForm.title || mediaForm.file.name)
    formDataObj.append('description', mediaForm.description || '')

    try {
      const response = await fetch(`${API_URL}/experiences/${selectedExp.id}/upload-media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Media uploaded successfully!' })
        setShowMediaModal(false)
        setMediaForm({ title: '', description: '', file: null })
        fetchExperiences()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload media' })
    }
  }

  const handleDeleteMedia = async (expId, mediaId) => {
    if (!confirm('Delete this media?')) return

    try {
      const response = await fetch(`${API_URL}/experiences/${expId}/media/${mediaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Media deleted!' })
        fetchExperiences()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete media' })
    }
  }

  const handleAddSkill = async (expId, skillId) => {
    try {
      const response = await fetch(`${API_URL}/experiences/${expId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skill_id: skillId })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Skill linked!' })
        fetchExperiences()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add skill' })
    }
  }

  const handleRemoveSkill = async (expId, skillId) => {
    try {
      const response = await fetch(`${API_URL}/experiences/${expId}/skills/${skillId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchExperiences()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove skill' })
    }
  }

  const openModal = (experience = null) => {
    if (experience) {
      setEditingId(experience.id)
      setFormData({
        company: experience.company || '',
        position: experience.position || '',
        employment_type: experience.employment_type || 'Full-time',
        location: experience.location || '',
        start_date: experience.start_date?.split('T')[0] || '',
        end_date: experience.end_date?.split('T')[0] || '',
        is_current: experience.is_current || false,
        description: experience.description || '',
        experience_type: experience.experience_type || 'Work',
        highlights: experience.highlights?.length > 0 ? experience.highlights : ['']
      })
    } else {
      setEditingId(null)
      setFormData({
        company: '',
        position: '',
        employment_type: 'Full-time',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        experience_type: 'Work',
        highlights: ['']
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const openMediaModal = (exp) => {
    setSelectedExp(exp)
    setMediaForm({ title: '', description: '', file: null })
    setShowMediaModal(true)
  }

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] })
  }

  const updateHighlight = (index, value) => {
    const newHighlights = [...formData.highlights]
    newHighlights[index] = value
    setFormData({ ...formData, highlights: newHighlights })
  }

  const removeHighlight = (index) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index)
    setFormData({ ...formData, highlights: newHighlights.length > 0 ? newHighlights : [''] })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Present'
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) return <Image size={16} className="text-green-400" />
    if (fileType?.includes('pdf')) return <FileText size={16} className="text-red-400" />
    return <FileText size={16} className="text-blue-400" />
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
          <h3 className="text-lg font-semibold text-white">Work Experience</h3>
          <p className="text-gray-500 text-sm">Manage experience with skills & media</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
        >
          <Plus size={20} />
          Add Experience
        </motion.button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No experiences added yet. Click "Add Experience" to get started.
          </div>
        ) : (
          experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800/50 border rounded-xl p-6 ${
                exp.is_active ? 'border-gray-700' : 'border-red-500/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Company Logo */}
                  <div className="relative w-14 h-14 flex-shrink-0">
                    {exp.company_logo ? (
                      <img
                        src={`${API_BASE_URL}${exp.company_logo}`}
                        alt={exp.company}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Building2 className="text-purple-400" size={24} />
                      </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(exp.id, e.target.files[0])}
                        className="hidden"
                      />
                      <div className="p-1 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors">
                        <Upload size={12} />
                      </div>
                    </label>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold">{exp.position}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        exp.experience_type === 'Organization' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {exp.experience_type || 'Work'}
                      </span>
                    </div>
                    <p className="text-indigo-400">{exp.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {exp.location}
                        </span>
                      )}
                    </div>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {exp.highlights.slice(0, 2).map((h, i) => (
                          <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                            <span className="text-indigo-400">•</span>
                            {h}
                          </li>
                        ))}
                        {exp.highlights.length > 2 && (
                          <li className="text-gray-500 text-sm">+{exp.highlights.length - 2} more</li>
                        )}
                      </ul>
                    )}

                    {/* Skills Section */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400 font-medium">Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(exp.skills || []).map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-lg"
                          >
                            {skill.name}
                            <button
                              onClick={() => handleRemoveSkill(exp.id, skill.id)}
                              className="hover:text-red-400"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddSkill(exp.id, parseInt(e.target.value))
                              e.target.value = ''
                            }
                          }}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">+ Add skill</option>
                          {skills
                            .filter(s => !(exp.skills || []).some(es => es.id === s.id))
                            .map(skill => (
                              <option key={skill.id} value={skill.id}>{skill.name}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    {/* Media Section */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400 font-medium">Media & Documents</span>
                        <button
                          onClick={() => openMediaModal(exp)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Plus size={14} />
                          Add media
                        </button>
                      </div>
                      
                      {/* Media Grid with Preview */}
                      {(exp.media || []).length === 0 ? (
                        <span className="text-xs text-gray-500">No media attached</span>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {(exp.media || []).map((media) => (
                            <div
                              key={media.id}
                              className="relative group bg-gray-700/50 rounded-xl overflow-hidden"
                            >
                              {/* Preview */}
                              {media.file_type?.includes('image') ? (
                                <a
                                  href={`${API_BASE_URL}${media.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block aspect-video"
                                >
                                  <img
                                    src={`${API_BASE_URL}${media.file_path}`}
                                    alt={media.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </a>
                              ) : (
                                <a
                                  href={`${API_BASE_URL}${media.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center aspect-video bg-gray-800"
                                >
                                  <FileText size={32} className="text-gray-500" />
                                </a>
                              )}
                              
                              {/* Title & Delete */}
                              <div className="p-2">
                                <p className="text-xs text-gray-300 truncate" title={media.title}>
                                  {media.title}
                                </p>
                              </div>
                              
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteMedia(exp.id, media.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(exp)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
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
                  {editingId ? 'Edit Experience' : 'Add Experience'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Position/Title *</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Ex: Retail Sales Manager"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Company/Organization *</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Ex: Microsoft"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Employment Type</label>
                    <select
                      value={formData.employment_type}
                      onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Experience Type</label>
                    <select
                      value={formData.experience_type}
                      onChange={(e) => setFormData({ ...formData, experience_type: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Work">Work Experience</option>
                      <option value="Organization">Organization Experience</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Ex: London, United Kingdom"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_current}
                    onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: '' })}
                    className="w-5 h-5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300">I am currently working in this role</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      disabled={formData.is_current}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                    placeholder="List your major duties and successes, highlighting specific projects"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">Key Highlights</label>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      + Add Highlight
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => updateHighlight(index, e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                          placeholder="Describe an achievement or responsibility..."
                        />
                        {formData.highlights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHighlight(index)}
                            className="p-2 text-gray-400 hover:text-red-400"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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
                        {editingId ? 'Update' : 'Save'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Upload Modal */}
      <AnimatePresence>
        {showMediaModal && selectedExp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMediaModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h3 className="text-xl font-semibold text-white">Add Media</h3>
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleMediaUpload} className="p-6 space-y-4">
                <p className="text-sm text-gray-400">
                  Add images, documents, or presentations for <span className="text-white">{selectedExp.position}</span> at <span className="text-indigo-400">{selectedExp.company}</span>
                </p>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title *</label>
                  <input
                    type="text"
                    value={mediaForm.title}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Project Screenshot.png"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={mediaForm.description}
                    onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                    placeholder="Brief description of this media..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">File *</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) => setMediaForm({ ...mediaForm, file: e.target.files[0] })}
                      className="hidden"
                    />
                    {mediaForm.file ? (
                      <div className="text-center">
                        <FileText size={32} className="mx-auto text-indigo-400 mb-2" />
                        <p className="text-sm text-white">{mediaForm.file.name}</p>
                        <p className="text-xs text-gray-500">{(mediaForm.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={32} className="mx-auto text-gray-500 mb-2" />
                        <p className="text-sm text-gray-400">Click to upload</p>
                        <p className="text-xs text-gray-500">Images, PDF, Documents</p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMediaModal(false)}
                    className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={!mediaForm.file}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload size={18} />
                    Upload
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

export default ExperienceManager
