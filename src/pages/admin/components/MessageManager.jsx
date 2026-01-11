import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, Check, Clock, RefreshCw } from 'lucide-react'

const MessageManager = ({ onRead }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  const API_URL = 'http://localhost:5000/api'
  const token = localStorage.getItem('admin_token')

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleMarkRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/messages/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchMessages()
        if (onRead) onRead()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to mark as read' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Message deleted successfully!' })
        fetchMessages()
        if (onRead) onRead()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${minutes} min ago`
      }
      return `${hours} hours ago`
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return `${days} days ago`
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  const unreadCount = messages.filter(m => !m.is_read).length

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
          <h3 className="text-lg font-semibold text-white">Messages</h3>
          <p className="text-gray-500 text-sm">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Mail size={48} className="mx-auto mb-4 opacity-50" />
            <p>No messages yet</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gray-800/50 border rounded-xl p-5 ${
                msg.is_read ? 'border-gray-700' : 'border-indigo-500/50 bg-indigo-500/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      msg.is_read ? 'bg-gray-700' : 'bg-indigo-500/20'
                    }`}>
                      <span className={`font-semibold ${msg.is_read ? 'text-gray-400' : 'text-indigo-400'}`}>
                        {msg.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium truncate">{msg.name}</h4>
                        {!msg.is_read && (
                          <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm truncate">{msg.email}</p>
                    </div>
                  </div>

                  {/* Subject */}
                  {msg.subject && (
                    <p className="text-indigo-400 text-sm mb-2">{msg.subject}</p>
                  )}

                  {/* Message Content */}
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{msg.message}</p>

                  {/* Time */}
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <Clock size={12} />
                    {formatDate(msg.created_at)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  {!msg.is_read && (
                    <button
                      onClick={() => handleMarkRead(msg.id)}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}
                    className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                    title="Reply"
                  >
                    <Mail size={18} />
                  </a>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default MessageManager
