import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Award, Calendar, ExternalLink, Upload, FileText, Image } from 'lucide-react'

const CertificationManager = () => {
  const [certifications, setCertifications] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [selectedCert, setSelectedCert] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    description: ''
  })
  const [mediaForm, setMediaForm] = useState({
    title: '',
    description: '',
    file: null
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const API_URL = 'http://localhost:5000/api'
  const token = localStorage.getItem('admin_token')

  const fetchCertifications = async () => {
    try {
      const response = await fetch(`${API_URL}/certifications/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setCertifications(data)
    } catch (error) {
      console.error('Failed to fetch certifications:', error)
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
    fetchCertifications()
    fetchSkills()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const url = editingId 
      ? `${API_URL}/certifications/${editingId}`
      : `${API_URL}/certifications`
    
    const method = editingId ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: `Certification ${editingId ? 'updated' : 'added'} successfully!` })
        fetchCertifications()
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
    if (!confirm('Are you sure you want to delete this certification?')) return

    try {
      const response = await fetch(`${API_URL}/certifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Certification deleted successfully!' })
        fetchCertifications()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' })
    }
  }

  const handleImageUpload = async (certId, file) => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_URL}/certifications/${certId}/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Logo uploaded!' })
        fetchCertifications()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' })
    }
  }

  const handleMediaUpload = async (e) => {
    e.preventDefault()
    if (!mediaForm.file || !selectedCert) return

    const formDataObj = new FormData()
    formDataObj.append('media', mediaForm.file)
    formDataObj.append('title', mediaForm.title || mediaForm.file.name)
    formDataObj.append('description', mediaForm.description || '')

    try {
      const response = await fetch(`${API_URL}/certifications/${selectedCert.id}/upload-media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Media uploaded successfully!' })
        setShowMediaModal(false)
        setMediaForm({ title: '', description: '', file: null })
        fetchCertifications()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload media' })
    }
  }

  const handleDeleteMedia = async (certId, mediaId) => {
    if (!confirm('Delete this media?')) return

    try {
      const response = await fetch(`${API_URL}/certifications/${certId}/media/${mediaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Media deleted!' })
        fetchCertifications()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete media' })
    }
  }

  const handleAddSkill = async (certId, skillId) => {
    try {
      const response = await fetch(`${API_URL}/certifications/${certId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skill_id: skillId })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Skill linked!' })
        fetchCertifications()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add skill' })
    }
  }

  const handleRemoveSkill = async (certId, skillId) => {
    try {
      const response = await fetch(`${API_URL}/certifications/${certId}/skills/${skillId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchCertifications()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove skill' })
    }
  }

  const openModal = (cert = null) => {
    if (cert) {
      setEditingId(cert.id)
      setFormData({
        title: cert.title || '',
        issuer: cert.issuer || '',
        issue_date: cert.issue_date?.split('T')[0] || '',
        expiry_date: cert.expiry_date?.split('T')[0] || '',
        credential_id: cert.credential_id || '',
        credential_url: cert.credential_url || '',
        description: cert.description || ''
      })
    } else {
      setEditingId(null)
      setFormData({
        title: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        credential_id: '',
        credential_url: '',
        description: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const openMediaModal = (cert) => {
    setSelectedCert(cert)
    setMediaForm({ title: '', description: '', file: null })
    setShowMediaModal(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
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
          <h3 className="text-lg font-semibold text-white">Certifications</h3>
          <p className="text-gray-500 text-sm">Manage certifications with media & linked skills</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
        >
          <Plus size={20} />
          Add Certification
        </motion.button>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No certifications added yet. Click "Add Certification" to get started.
          </div>
        ) : (
          certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800/50 border rounded-xl p-5 ${
                cert.is_active ? 'border-gray-700' : 'border-red-500/30 opacity-60'
              }`}
            >
              <div className="flex gap-4">
                {/* Logo */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  {cert.image ? (
                    <img
                      src={`http://localhost:5000${cert.image}`}
                      alt={cert.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Award className="text-amber-400" size={28} />
                    </div>
                  )}
                  <label className="absolute -bottom-1 -right-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(cert.id, e.target.files[0])}
                      className="hidden"
                    />
                    <div className="p-1 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors">
                      <Upload size={12} />
                    </div>
                  </label>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-semibold">{cert.title}</h4>
                      <p className="text-indigo-400 text-sm">{cert.issuer}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        <span>
                          {formatDate(cert.issue_date)}
                          {cert.expiry_date && ` - ${formatDate(cert.expiry_date)}`}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-1">
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button
                        onClick={() => openModal(cert)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400 font-medium">Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(cert.skills || []).map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-lg"
                        >
                          {skill.name}
                          <button
                            onClick={() => handleRemoveSkill(cert.id, skill.id)}
                            className="hover:text-red-400"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddSkill(cert.id, parseInt(e.target.value))
                            e.target.value = ''
                          }
                        }}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">+ Add skill</option>
                        {skills
                          .filter(s => !(cert.skills || []).some(cs => cs.id === s.id))
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
                        onClick={() => openMediaModal(cert)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Add media
                      </button>
                    </div>
                    
                    {/* Media Grid with Preview */}
                    {(cert.media || []).length === 0 ? (
                      <span className="text-xs text-gray-500">No media attached</span>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {(cert.media || []).map((media) => (
                          <div
                            key={media.id}
                            className="relative group bg-gray-700/50 rounded-xl overflow-hidden"
                          >
                            {/* Preview */}
                            {media.file_type?.includes('image') ? (
                              <a
                                href={`http://localhost:5000${media.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block aspect-video"
                              >
                                <img
                                  src={`http://localhost:5000${media.file_path}`}
                                  alt={media.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </a>
                            ) : (
                              <a
                                href={`http://localhost:5000${media.file_path}`}
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
                              onClick={() => handleDeleteMedia(cert.id, media.id)}
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
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
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
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h3 className="text-xl font-semibold text-white">
                  {editingId ? 'Edit Certification' : 'Add Certification'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Certification Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Ex: Microsoft Certified Network Associate Security"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Issuing Organization *</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Ex: Microsoft"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Issue Date</label>
                    <input
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Expiration Date</label>
                    <input
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Credential ID</label>
                  <input
                    type="text"
                    value={formData.credential_id}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Credential URL</label>
                  <input
                    type="url"
                    value={formData.credential_url}
                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

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
        {showMediaModal && selectedCert && (
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
                  Add certificate images, documents, or presentations for <span className="text-white">{selectedCert.title}</span>
                </p>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title *</label>
                  <input
                    type="text"
                    value={mediaForm.title}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Certificate.pdf"
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

export default CertificationManager
