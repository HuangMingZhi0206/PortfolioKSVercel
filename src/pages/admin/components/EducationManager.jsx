import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, GraduationCap, Calendar, Upload } from 'lucide-react'
import { API_URL, API_BASE_URL } from '../../../config/api'

const EducationManager = () => {
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    gpa: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const token = localStorage.getItem('admin_token')

  const fetchEducation = async () => {
    try {
      const response = await fetch(`${API_URL}/education/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setEducation(data)
    } catch (error) {
      console.error('Failed to fetch education:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEducation()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const url = editingId 
      ? `${API_URL}/education/${editingId}`
      : `${API_URL}/education`
    
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
        setMessage({ type: 'success', text: `Education ${editingId ? 'updated' : 'added'} successfully!` })
        fetchEducation()
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
    if (!confirm('Are you sure you want to delete this education?')) return

    try {
      const response = await fetch(`${API_URL}/education/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Education deleted successfully!' })
        fetchEducation()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' })
    }
  }

  const handleLogoUpload = async (eduId, file) => {
    const formData = new FormData()
    formData.append('logo', file)

    try {
      const response = await fetch(`${API_URL}/education/${eduId}/upload-logo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Logo uploaded!' })
        fetchEducation()
      } else {
        setMessage({ type: 'error', text: 'Failed to upload logo' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload logo' })
    }
  }

  const openModal = (edu = null) => {
    if (edu) {
      setEditingId(edu.id)
      setFormData({
        institution: edu.institution || '',
        degree: edu.degree || '',
        field_of_study: edu.field_of_study || '',
        start_date: edu.start_date?.split('T')[0] || '',
        end_date: edu.end_date?.split('T')[0] || '',
        is_current: edu.is_current || false,
        description: edu.description || '',
        gpa: edu.gpa || ''
      })
    } else {
      setEditingId(null)
      setFormData({
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        gpa: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Present'
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
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
          <h3 className="text-lg font-semibold text-white">Education</h3>
          <p className="text-gray-500 text-sm">Manage your educational background</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
        >
          <Plus size={20} />
          Add Education
        </motion.button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {education.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No education added yet. Click "Add Education" to get started.
          </div>
        ) : (
          education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800/50 border rounded-xl p-6 ${
                edu.is_active ? 'border-gray-700' : 'border-red-500/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Logo */}
                  <div className="relative w-14 h-14 flex-shrink-0">
                    {edu.logo ? (
                      <img
                        src={`${API_BASE_URL}${edu.logo}`}
                        alt={edu.institution}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-500/20 rounded-xl flex items-center justify-center">
                        <GraduationCap className="text-indigo-400" size={24} />
                      </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(edu.id, e.target.files[0])}
                        className="hidden"
                      />
                      <div className="p-1 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors">
                        <Upload size={12} />
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{edu.institution}</h4>
                    <p className="text-indigo-400">{edu.degree}</p>
                    <p className="text-gray-400 text-sm">{edu.field_of_study}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                      </span>
                      {edu.gpa && (
                        <span>GPA: {edu.gpa}</span>
                      )}
                    </div>
                    {edu.description && (
                      <p className="mt-2 text-gray-400 text-sm line-clamp-2">{edu.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(edu)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
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
                  {editingId ? 'Edit Education' : 'Add Education'}
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
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Institution *</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Ex: President University"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Degree *</label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Ex: Bachelor's Degree"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Field of Study</label>
                    <input
                      type="text"
                      value={formData.field_of_study}
                      onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Ex: Computer Science"
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
                  <span className="text-gray-300">I am currently studying here</span>
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
                  <label className="block text-sm text-gray-400 mb-2">GPA (Optional)</label>
                  <input
                    type="text"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Ex: 3.85"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                    rows={4}
                    placeholder="Describe your education, activities, achievements..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save size={20} />
                        {editingId ? 'Update' : 'Add'} Education
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EducationManager
