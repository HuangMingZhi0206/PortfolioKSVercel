import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

import { API_URL, MEDIA_BASE_URL } from '../config/api'

const Education = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isDark } = useTheme()
  const [education, setEducation] = useState([])

  const defaultEducation = [
    {
      institution: 'President University',
      degree: 'Bachelor of Informatic Engineer',
      field_of_study: 'Artificial Intelligence',
      start_date: '2024-08-01',
      end_date: null,
      is_current: true,
      description: 'Currently pursuing a degree in Information Technology with focus on Artificial Intelligence and Multimedia.'
    },
    {
      institution: 'SMK Yadika 12',
      degree: 'Vocational High School',
      field_of_study: 'Computer And Network Engineer',
      start_date: '2021-01-01',
      end_date: '2024-06-30',
      is_current: false,
      description: 'Computer Systems Networking and Telecommunications program with focus on network engineering and technical skills.'
    }
  ]

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch(`${API_URL}/education`)
        const data = await response.json()
        if (data && data.length > 0) {
          setEducation(data)
        } else {
          setEducation(defaultEducation)
        }
      } catch (error) {
        console.error('Failed to fetch education:', error)
        setEducation(defaultEducation)
      }
    }
    fetchEducation()
  }, [])

  const formatPeriod = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate)
    const startYear = start.getFullYear()

    if (isCurrent) return `${startYear} - Present`
    if (!endDate) return `${startYear}`

    const end = new Date(endDate)
    return `${startYear} - ${end.getFullYear()}`
  }

  const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <section id="education" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className="gradient-text">Education</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            My academic journey and qualifications
          </p>
        </motion.div>

        {/* Education Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div
            className={`absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
            style={{ transform: 'translateX(-50%)' }}
          />

          {/* Education Cards */}
          <div className="flex flex-col gap-12">
            {education.map((edu, index) => {
              const color = colors[index % colors.length]
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={edu.id || index}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                  className={`relative flex flex-col md:flex-row items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Timeline Dot */}
                  <div
                    className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 z-10 border-4"
                    style={{
                      backgroundColor: isDark ? '#0f0f23' : '#fff',
                      borderColor: color,
                      boxShadow: `0 0 0 4px ${isDark ? '#0f0f23' : '#fff'}`
                    }}
                  />

                  {/* Card */}
                  <div className={`ml-16 md:ml-0 w-full md:w-[calc(50%-40px)] ${isLeft ? 'md:pr-0 md:mr-auto' : 'md:pl-0 md:ml-auto'}`}>
                    <div className={`rounded-2xl p-6 transition-all hover:scale-[1.02] ${isDark
                        ? 'bg-white/5 border border-white/10 hover:bg-white/[0.08]'
                        : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl'
                      }`}>
                      {/* Header with Icon */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          {edu.logo ? (
                            <img
                              src={edu.logo.startsWith('http') ? edu.logo : `${MEDIA_BASE_URL}${edu.logo}`}
                              alt={edu.institution}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <GraduationCap size={28} style={{ color }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {edu.institution}
                          </h3>
                          <p style={{ color }} className="font-medium">
                            {edu.degree}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {edu.field_of_study}
                          </p>
                        </div>
                      </div>

                      {/* Period */}
                      <div className={`flex items-center gap-2 mb-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Calendar size={14} />
                        <span>{formatPeriod(edu.start_date, edu.end_date, edu.is_current)}</span>
                        {edu.is_current && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {edu.description && (
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {edu.description}
                        </p>
                      )}

                      {/* GPA if available */}
                      {edu.gpa && (
                        <div className={`mt-3 flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Award size={14} />
                          <span>GPA: {edu.gpa}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
