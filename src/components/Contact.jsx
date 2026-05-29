import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Tilt from 'react-parallax-tilt'
import { Mail, Phone, MapPin, Send, Linkedin, Github, Instagram, MessageCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

import { API_URL } from '../config/api'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: false, error: null })
  const [aboutData, setAboutData] = useState(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${API_URL}/about`)
        if (response.ok) {
          const data = await response.json()
          setAboutData(data)
        }
      } catch (error) {
        console.error('Error fetching about data:', error)
      }
    }
    fetchAboutData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus({ loading: true, success: false, error: null })

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus({ loading: false, success: true, error: null })
        setFormData({ name: '', email: '', subject: '', message: '' })
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus({ loading: false, success: false, error: null }), 5000)
      } else {
        const data = await response.json()
        setSubmitStatus({ loading: false, success: false, error: data.message || 'Failed to send message' })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus({ loading: false, success: false, error: 'Network error. Please try again.' })
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: aboutData?.phone || '0895332606621',
      href: `tel:${aboutData?.phone || '+62895332606621'}`,
      color: '#10b981'
    },
    {
      icon: Mail,
      label: 'Email',
      value: aboutData?.email || 'contact@example.com',
      href: `mailto:${aboutData?.email || 'contact@example.com'}`,
      color: '#6366f1'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: aboutData?.location || 'Indonesia',
      href: '#',
      color: '#f59e0b'
    }
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: aboutData?.linkedin_url || 'https://linkedin.com',
      color: '#0077b5'
    },
    {
      icon: Github,
      label: 'GitHub',
      href: aboutData?.github_url || 'https://github.com',
      color: '#ffffff'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: aboutData?.instagram_url || 'https://instagram.com',
      color: '#e4405f'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: aboutData?.phone ? `https://wa.me/${aboutData.phone.replace(/\D/g, '')}` : 'https://wa.me/',
      color: '#25d366'
    }
  ]

  const { isDark } = useTheme()

  return (
    <section id="contact" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Open to collaborations, project partnerships, and opportunities in
            Product Development, Robotics Engineering, IoT Solutions, and Technology Innovation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Let's Connect</h3>

            {/* Contact Cards */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="block"
                >
                  <Tilt
                    tiltMaxAngleX={5}
                    tiltMaxAngleY={5}
                    glareEnable={true}
                    glareMaxOpacity={0.1}
                    glareColor={info.color}
                  >
                    <div className={`rounded-2xl p-4 card-hover flex items-center gap-4 transition-colors ${isDark ? 'glass' : 'bg-white shadow-lg border border-gray-100'
                      }`}>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${info.color}20` }}
                      >
                        <info.icon size={24} style={{ color: info.color }} />
                      </div>
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{info.label}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{info.value}</p>
                      </div>
                    </div>
                  </Tilt>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Follow me on social media</p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'glass text-gray-400 hover:text-white' : 'bg-white shadow-lg border border-gray-100 text-gray-500 hover:text-indigo-600'
                      }`}
                    style={{ '--hover-color': social.color }}
                  >
                    <social.icon size={22} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* CTA Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className={`mt-12 p-6 rounded-2xl transition-colors ${isDark ? 'glass' : 'bg-white shadow-lg border border-gray-100'
                }`}
            >
              <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Let's build the future together!</h4>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Whether you have a project in mind, want to collaborate, or just want to say hi,
                feel free to reach out. I'm always excited to discuss new opportunities and ideas.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Tilt
              tiltMaxAngleX={2}
              tiltMaxAngleY={2}
              glareEnable={true}
              glareMaxOpacity={0.05}
              glareColor="#6366f1"
            >
              <form onSubmit={handleSubmit} className={`rounded-3xl p-8 transition-colors ${isDark ? 'glass' : 'bg-white shadow-xl border border-gray-100'
                }`}>
                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Send a Message</h3>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors ${isDark
                          ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                          : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors ${isDark
                          ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                          : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors ${isDark
                          ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                          : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      placeholder="Project Collaboration"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors resize-none ${isDark
                          ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                          : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      placeholder="Tell me about your project or idea..."
                    />
                  </div>

                  {/* Success/Error Messages */}
                  {submitStatus.success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-center"
                    >
                      ✓ Message sent successfully! I'll get back to you soon.
                    </motion.div>
                  )}
                  {submitStatus.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center"
                    >
                      {submitStatus.error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={submitStatus.loading}
                    whileHover={{ scale: submitStatus.loading ? 1 : 1.02 }}
                    whileTap={{ scale: submitStatus.loading ? 1 : 0.98 }}
                    className={`w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 ${submitStatus.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {submitStatus.loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
