import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Tilt from 'react-parallax-tilt'
import { 
  Award, Calendar, ExternalLink, FileText, Image as ImageIcon,
  Code, Cpu, Wifi, Globe, Shield, Server, Database, Terminal,
  Bot, Cog, MessageSquare, Languages, Network, HardDrive, Wrench,
  Lightbulb, Zap, Radio, Settings, Layers, BrainCircuit
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ImageLightbox from './ImageLightbox'

// Skill icon mapping
const skillIcons = {
  'Python': { icon: Code, color: '#3776ab' },
  'C++': { icon: Terminal, color: '#00599c' },
  'JavaScript': { icon: Code, color: '#f7df1e' },
  'Internet of Things (IoT)': { icon: Wifi, color: '#00b4d8' },
  'ESP32': { icon: Cpu, color: '#e7352c' },
  'Arduino': { icon: Cpu, color: '#00979d' },
  'Raspberry Pi': { icon: Cpu, color: '#c51a4a' },
  'MQTT': { icon: Radio, color: '#660066' },
  'Network Engineering': { icon: Network, color: '#0066cc' },
  'Robotics': { icon: Bot, color: '#ff6b35' },
  'Waste Management': { icon: Lightbulb, color: '#22c55e' },
  'Back-End Development': { icon: Server, color: '#6366f1' },
  'Embedded Systems': { icon: Cpu, color: '#f59e0b' },
  'Communication': { icon: MessageSquare, color: '#8b5cf6' },
  'Graphic Design': { icon: Layers, color: '#ec4899' },
  'Leadership': { icon: Zap, color: '#eab308' },
  'Project Management': { icon: Settings, color: '#14b8a6' },
  'Bahasa Indonesia': { icon: Languages, color: '#ef4444' },
  'Network Security': { icon: Shield, color: '#22c55e' },
  'Network Administration': { icon: Network, color: '#3b82f6' },
  'System Administration': { icon: Server, color: '#8b5cf6' },
  'Mobile Robotics': { icon: Bot, color: '#f97316' },
  'Robot Programming': { icon: BrainCircuit, color: '#06b6d4' },
  'Information Technology Infrastructure': { icon: HardDrive, color: '#64748b' },
  'Engineering': { icon: Wrench, color: '#78716c' },
  'Networking': { icon: Globe, color: '#0ea5e9' },
}

const getSkillIcon = (skillName) => {
  return skillIcons[skillName] || { icon: Cog, color: '#6b7280' }
}

const API_URL = 'http://localhost:5000/api'

const Certifications = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isDark } = useTheme()
  const [certifications, setCertifications] = useState([])
  const [selectedCert, setSelectedCert] = useState(null)
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (media, index = 0) => {
    // Filter only image files
    const images = media.filter(m => m.file_type?.includes('image'))
    if (images.length > 0) {
      setLightboxImages(images)
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  }

  const defaultCertifications = [
    {
      title: 'Back End Developer',
      issuer: 'Professional Certification',
      issue_date: '2024-01-01',
      description: 'Certification in back-end development and server-side programming',
      color: '#6366f1',
      icon: '🔧'
    },
    {
      title: 'Code Kickstart Python Programming',
      issuer: 'Samsung Innovation Campus - Batch 7 Stage 1',
      issue_date: '2024-01-01',
      description: 'Advanced Python programming and IoT training from Samsung Innovation Campus',
      color: '#1428a0',
      icon: '🐍'
    },
    {
      title: 'Brocade Certified Network Engineer (BCNE)',
      issuer: 'Brocade',
      issue_date: '2023-01-01',
      description: 'Network engineering certification covering enterprise networking solutions',
      color: '#e7352c',
      icon: '🌐'
    }
  ]

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await fetch(`${API_URL}/certifications`)
        const data = await response.json()
        if (data && data.length > 0) {
          setCertifications(data)
        } else {
          setCertifications(defaultCertifications)
        }
      } catch (error) {
        console.error('Failed to fetch certifications:', error)
        setCertifications(defaultCertifications)
      }
    }
    fetchCertifications()
  }, [])

  const colors = ['#6366f1', '#1428a0', '#e7352c', '#8b5cf6', '#10b981', '#f59e0b']
  const icons = ['🔧', '🐍', '🌐', '🎨', '🏆', '🖥️']

  const awards = [
    {
      title: 'Silver Medal - WICE 2025',
      event: 'World Invention Competition & Exhibition',
      description: 'Automated Waste Management System with Real-Time IoT Monitoring',
      year: '2025'
    },
    {
      title: 'National Robotics Competition Winner',
      event: 'National Robotics Championship',
      description: 'Top 3 National Rankings in Competitive Robotics',
      year: '2024'
    },
    {
      title: 'Top 26 Regional Excellence Award',
      event: 'West Java Vocational Excellence',
      description: 'Regional recognition for vocational excellence',
      year: '2023'
    }
  ]

  return (
    <section id="certifications" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Awards Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Awards & <span className="gradient-text">Recognition</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Achievements that highlight my journey in technology
          </p>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            >
              <Tilt
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                glareEnable={true}
                glareMaxOpacity={0.2}
                glareColor="#fbbf24"
                className="h-full"
              >
                <div className={`relative rounded-3xl p-8 h-full card-hover text-center overflow-hidden transition-colors ${
                  isDark ? 'glass' : 'bg-white shadow-xl border border-gray-100'
                }`}>
                  {/* Glow Effect */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
                  
                  {/* Trophy Icon */}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
                    <Award className="text-white" size={32} />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{award.title}</h3>
                  <p className="text-indigo-500 text-sm mb-3">{award.event}</p>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{award.description}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {award.year}
                  </span>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className="gradient-text">Licenses & Certifications</span>
          </h3>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id || index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Tilt
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                glareEnable={true}
                glareMaxOpacity={0.1}
                glareColor={colors[index % colors.length]}
                className="h-full"
              >
                <div className={`rounded-3xl p-6 h-full card-hover transition-colors ${
                  isDark ? 'glass' : 'bg-white shadow-xl border border-gray-100'
                }`}>
                  <div className="flex items-start gap-4">
                    {/* Icon/Image */}
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden"
                      style={{ backgroundColor: `${colors[index % colors.length]}20` }}
                    >
                      {cert.image ? (
                        <img src={cert.image.startsWith('http') ? cert.image : `http://localhost:5000${cert.image}`} alt={cert.title} className="w-full h-full object-cover" />
                      ) : (
                        icons[index % icons.length]
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h4 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{cert.title}</h4>
                      <p className="text-sm mb-2" style={{ color: colors[index % colors.length] }}>{cert.issuer}</p>
                      <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{cert.description}</p>
                      
                      {/* Skills */}
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {cert.skills.slice(0, 4).map((skill) => {
                            const { icon: SkillIcon, color } = getSkillIcon(skill.name)
                            return (
                              <motion.span 
                                key={skill.id}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg cursor-default transition-all ${
                                  isDark 
                                    ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                }`}
                                style={{ 
                                  boxShadow: isDark ? `0 0 10px ${color}20` : 'none'
                                }}
                              >
                                <SkillIcon size={12} style={{ color }} />
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                  {skill.name.length > 15 ? skill.name.substring(0, 15) + '...' : skill.name}
                                </span>
                              </motion.span>
                            )
                          })}
                          {cert.skills.length > 4 && (
                            <span className={`inline-flex items-center text-xs px-2 py-1 rounded-lg ${
                              isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
                            }`}>
                              +{cert.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Media Preview Images */}
                      {cert.media && cert.media.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2">
                            {cert.media.filter(m => m.file_type?.includes('image')).slice(0, 3).map((m, mIndex) => (
                              <motion.button
                                key={m.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openLightbox(cert.media, mIndex)}
                                className={`relative w-16 h-16 rounded-xl overflow-hidden group cursor-pointer ${
                                  isDark ? 'ring-1 ring-white/10' : 'ring-1 ring-gray-200'
                                }`}
                              >
                                <img 
                                  src={`http://localhost:5000${m.file_path}`}
                                  alt={m.title || 'Certificate'}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                  <ImageIcon size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </motion.button>
                            ))}
                            {cert.media.filter(m => m.file_type?.includes('image')).length > 3 && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openLightbox(cert.media, 3)}
                                className={`w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                                  isDark 
                                    ? 'bg-white/5 hover:bg-white/10 ring-1 ring-white/10' 
                                    : 'bg-gray-100 hover:bg-gray-200 ring-1 ring-gray-200'
                                }`}
                              >
                                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  +{cert.media.filter(m => m.file_type?.includes('image')).length - 3}
                                </span>
                              </motion.button>
                            )}
                            {/* Non-image files as buttons */}
                            {cert.media.filter(m => !m.file_type?.includes('image')).map((m) => (
                              <a
                                key={m.id}
                                href={`http://localhost:5000${m.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                                  isDark 
                                    ? 'bg-white/5 hover:bg-white/10 ring-1 ring-white/10' 
                                    : 'bg-gray-100 hover:bg-gray-200 ring-1 ring-gray-200'
                                }`}
                              >
                                <FileText size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {m.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Calendar size={12} />
                          {cert.issue_date ? new Date(cert.issue_date).getFullYear() : 'N/A'}
                        </div>
                        {cert.credential_url && (
                          <a 
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-indigo-600'}`}
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  )
}

export default Certifications
