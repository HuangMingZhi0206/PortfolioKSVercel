import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Tilt from 'react-parallax-tilt'
import { GraduationCap, MapPin, Award, Target } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const API_URL = 'http://localhost:5000/api'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isDark } = useTheme()
  const [aboutData, setAboutData] = useState(null)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch(`${API_URL}/about`)
        const data = await response.json()
        if (data) setAboutData(data)
      } catch (error) {
        console.error('Failed to fetch about:', error)
      }
    }
    fetchAbout()
  }, [])

  const stats = [
    { label: 'Projects', value: '15+', icon: Target },
    { label: 'Awards', value: '5+', icon: Award },
    { label: 'Years Experience', value: '3+', icon: GraduationCap },
  ]

  const defaultHighlights = [
    'Advanced Robotics & Mobile Robotics Engineering',
    'IoT & Embedded Systems (ESP32, MQTT, Arduino)',
    'Network Engineering & Security (BCNE Certified)',
    'Full-Stack Development (Python, Back-End)',
    'Competitive Robotics Excellence - Top 3 National',
  ]

  const highlights = aboutData?.highlights ? aboutData.highlights.split('\n').filter(h => h.trim()) : defaultHighlights

  return (
    <section id="about" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            About <span className="gradient-text">Me</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {aboutData?.subtitle || 'Product Development Engineer | Robotics & IoT Innovator | Tech Entrepreneur'}
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main About Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Tilt
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              glareEnable={true}
              glareMaxOpacity={0.1}
              glareColor="#6366f1"
              glarePosition="all"
              className="h-full"
            >
              <div className={`rounded-3xl p-8 h-full card-hover transition-colors ${
                isDark ? 'glass' : 'bg-white shadow-xl border border-gray-100'
              }`}>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Who I Am</h3>
                <p className={`leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {aboutData?.description || `I'm a passionate technology professional dedicated to developing innovative 
                  solutions that bridge hardware and software. Currently pursuing my degree in 
                  Information Technology and Multimedia at President University, 
                  while actively building real-world projects in robotics, IoT systems, and intelligent automation.`}
                </p>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  I'm driven by a passion for creating transformative technology solutions that solve 
                  real-world problems. Whether designing intelligent robotics systems, building IoT 
                  ecosystems, or developing scalable network infrastructure, I bring dedication, 
                  innovation, and technical excellence to every project.
                </p>
              </div>
            </Tilt>
          </motion.div>

          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareEnable={true}
              glareMaxOpacity={0.1}
              glareColor="#8b5cf6"
              glarePosition="all"
              className="h-full"
            >
              <div className={`rounded-3xl p-8 h-full card-hover flex flex-col items-center justify-center text-center transition-colors ${
                isDark ? 'glass' : 'bg-white shadow-xl border border-gray-100'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                  <MapPin className="text-white" size={28} />
                </div>
                <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Location</h4>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{aboutData?.location || 'Central Jakarta, Jakarta'}</p>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Indonesia</p>
              </div>
            </Tilt>
          </motion.div>

          {/* Stats Cards */}
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Tilt
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                glareEnable={true}
                glareMaxOpacity={0.1}
                glareColor="#6366f1"
                glarePosition="all"
                className="h-full"
              >
                <div className={`rounded-3xl p-6 h-full card-hover text-center transition-colors ${
                  isDark ? 'glass' : 'bg-white shadow-xl border border-gray-100'
                }`}>
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                    <stat.icon className="text-indigo-500" size={24} />
                  </div>
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
                </div>
              </Tilt>
            </motion.div>
          ))}

          {/* Expertise Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-3"
          >
            <Tilt
              tiltMaxAngleX={3}
              tiltMaxAngleY={3}
              glareEnable={true}
              glareMaxOpacity={0.05}
              glareColor="#6366f1"
              glarePosition="all"
            >
              <div className={`rounded-3xl p-8 card-hover transition-colors ${
                isDark ? 'glass' : 'bg-white shadow-xl border border-gray-100'
              }`}>
                <h3 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Expertise & Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {highlights.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                        isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-indigo-50 hover:bg-indigo-100'
                      }`}
                    >
                      <div className="text-indigo-500 mt-1">✓</div>
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
