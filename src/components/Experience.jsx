import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Briefcase, FileText, Image as ImageIcon, Diamond } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ImageLightbox from './ImageLightbox'

import { API_URL, MEDIA_BASE_URL } from '../config/api'

const Experience = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [expandedExp, setExpandedExp] = useState({})
  const [experiences, setExperiences] = useState([])
  const { isDark } = useTheme()

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (media, index = 0) => {
    const images = media.filter(m => m.file_type?.includes('image'))
    if (images.length > 0) {
      setLightboxImages(images)
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  }

  const defaultExperiences = [
    {
      company: 'President University Catholic Society (PUCatSo)',
      position: 'Multimedia',
      employment_type: 'Part-time',
      start_date: '2024-11-01',
      end_date: null,
      is_current: true,
      location: 'North Cikarang, West Java, Indonesia',
      description: 'Become a Multimedia Member at Pucatso (President University Catholic Society) in 2024-2025.',
      skills: [{ id: 1, name: 'Communication and Public Speaking' }],
      media: []
    }
  ]

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`${API_URL}/experiences`)
        const data = await response.json()
        if (data && data.length > 0) {
          setExperiences(data)
        } else {
          setExperiences(defaultExperiences)
        }
      } catch (error) {
        console.error('Failed to fetch experiences:', error)
        setExperiences(defaultExperiences)
      }
    }
    fetchExperiences()
  }, [])

  // Group experiences by company
  const groupedExperiences = experiences.reduce((acc, exp) => {
    const company = exp.company
    if (!acc[company]) {
      acc[company] = {
        company: exp.company,
        company_logo: exp.company_logo,
        location: exp.location,
        positions: []
      }
    }
    acc[company].positions.push(exp)
    return acc
  }, {})

  // Sort positions by date (newest first) and calculate total duration
  Object.values(groupedExperiences).forEach(group => {
    group.positions.sort((a, b) => new Date(b.start_date) - new Date(a.start_date))

    // Calculate total duration
    const allDates = group.positions.flatMap(p => [
      new Date(p.start_date),
      p.end_date ? new Date(p.end_date) : new Date()
    ])
    const minDate = new Date(Math.min(...allDates))
    const maxDate = new Date(Math.max(...allDates))

    const months = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years > 0 && remainingMonths > 0) {
      group.totalDuration = `${years} yr ${remainingMonths} mos`
    } else if (years > 0) {
      group.totalDuration = `${years} yr${years > 1 ? 's' : ''}`
    } else {
      group.totalDuration = `${months} mos`
    }
  })

  const formatPeriod = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate)
    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    let endStr = 'Present'
    let endDate2 = new Date()
    if (!isCurrent && endDate) {
      endDate2 = new Date(endDate)
      endStr = endDate2.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }

    // Calculate duration
    const months = (endDate2.getFullYear() - start.getFullYear()) * 12 + (endDate2.getMonth() - start.getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    let duration = ''
    if (years > 0 && remainingMonths > 0) {
      duration = `${years} yr ${remainingMonths} mos`
    } else if (years > 0) {
      duration = `${years} yr${years > 1 ? 's' : ''}`
    } else {
      duration = `${months} mos`
    }

    return `${startStr} - ${endStr} · ${duration}`
  }

  const toggleExpand = (companyIndex, posIndex) => {
    const key = `${companyIndex}-${posIndex}`
    setExpandedExp(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const colors = ['#6366f1', '#8b5cf6', '#34a853', '#f59e0b', '#ef4444', '#10b981']

  return (
    <section id="experience" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            My professional journey in technology and leadership
          </p>
        </motion.div>

        {/* Experience Cards - Grouped by Company */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {Object.values(groupedExperiences).map((group, groupIndex) => {
            const color = colors[groupIndex % colors.length]
            return (
              <motion.div
                key={group.company}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + groupIndex * 0.1 }}
                className={`rounded-2xl overflow-hidden transition-all ${isDark
                    ? 'bg-white/5 border border-white/10 hover:bg-white/[0.07]'
                    : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl'
                  }`}
              >
                {/* Company Header */}
                <div className="p-5 pb-0">
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      {group.company_logo ? (
                        <img
                          src={group.company_logo.startsWith('http') ? group.company_logo : `${MEDIA_BASE_URL}${group.company_logo}`}
                          alt={group.company}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Briefcase size={24} style={{ color }} />
                      )}
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {group.company}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {group.totalDuration}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {group.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Positions Timeline */}
                <div className="relative mt-5 ml-5">
                  {group.positions.map((exp, posIndex) => {
                    const isExpanded = expandedExp[`${groupIndex}-${posIndex}`]
                    const imageMedia = exp.media?.filter(m => m.file_type?.includes('image')) || []
                    const isLast = posIndex === group.positions.length - 1

                    return (
                      <div
                        key={exp.id || posIndex}
                        className="relative pb-5 pl-8"
                      >
                        {/* Timeline Line - connects dots, not through them */}
                        {!isLast && (
                          <div
                            className="absolute w-0.5 bg-gray-400/40"
                            style={{
                              left: '5px',
                              top: '20px',
                              bottom: '0'
                            }}
                          />
                        )}

                        {/* Timeline Dot - solid filled circle */}
                        <div
                          className="absolute top-1.5 left-0 w-3 h-3 rounded-full"
                          style={{ backgroundColor: isDark ? '#9ca3af' : '#6b7280' }}
                        />

                        {/* Position Content */}
                        <div>
                          {/* Position Title */}
                          <h4 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {exp.position}
                          </h4>

                          {/* Employment Type */}
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {exp.employment_type || 'Full-time'}
                          </p>

                          {/* Date Range */}
                          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
                          </p>

                          {/* Description */}
                          {exp.description && (
                            <div className="mt-3">
                              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {isExpanded || exp.description.length <= 150
                                  ? exp.description
                                  : `${exp.description.substring(0, 150)}...`}
                                {exp.description.length > 150 && (
                                  <button
                                    onClick={() => toggleExpand(groupIndex, posIndex)}
                                    className="ml-1 text-gray-400 hover:text-gray-300 font-medium"
                                  >
                                    {isExpanded ? 'see less' : 'see more'}
                                  </button>
                                )}
                              </p>
                            </div>
                          )}

                          {/* Skills */}
                          {exp.skills && exp.skills.length > 0 && (
                            <div className="mt-3 flex items-start gap-2">
                              <Diamond size={14} className={`mt-0.5 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} style={{ fill: isDark ? '#6b7280' : '#9ca3af' }} />
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {exp.skills.map(s => s.name).join(' and ')}
                              </p>
                            </div>
                          )}

                          {/* Media Thumbnails */}
                          {imageMedia.length > 0 && (
                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                              {imageMedia.map((m, mIndex) => (
                                <button
                                  key={m.id}
                                  onClick={() => openLightbox(exp.media, mIndex)}
                                  className="shrink-0 w-[120px] h-[80px] rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer group"
                                >
                                  <img
                                    src={`${MEDIA_BASE_URL}${m.file_path}`}
                                    alt={m.title || 'Media'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Non-image Media Links */}
                          {exp.media && exp.media.filter(m => !m.file_type?.includes('image')).length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {exp.media.filter(m => !m.file_type?.includes('image')).map((m) => (
                                <a
                                  key={m.id}
                                  href={`${MEDIA_BASE_URL}${m.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${isDark
                                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                    }`}
                                >
                                  <FileText size={12} />
                                  {m.title?.length > 20 ? m.title.substring(0, 20) + '...' : m.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
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

export default Experience
