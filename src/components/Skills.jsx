import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { Cog } from 'lucide-react'

import { API_URL } from '../config/api'

// Real tech logo URLs from CDN (devicon + simpleicons)
const skillLogoMap = {
  'Python': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', color: '#3776AB' },
  'C++': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg', color: '#00599C' },
  'JavaScript': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', color: '#F7DF1E' },
  'Arduino': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/arduino/arduino-original.svg', color: '#00979D' },
  'Raspberry Pi': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/raspberrypi/raspberrypi-original.svg', color: '#C51A4A' },
  'ESP32': { logo: 'https://cdn.simpleicons.org/espressif/E7352C', color: '#E7352C' },
  'MQTT': { logo: 'https://cdn.simpleicons.org/mqtt/660066', color: '#660066' },
  'Internet of Things (IoT)': { logo: 'https://cdn.simpleicons.org/homeassistant/41BDF5', color: '#41BDF5' },
  'Network Engineering': { logo: 'https://cdn.simpleicons.org/cisco/1BA0D7', color: '#1BA0D7' },
  'Robotics': { logo: 'https://cdn.simpleicons.org/ros/22314E', color: '#22314E' },
  'Mobile Robotics': { logo: 'https://cdn.simpleicons.org/ros/22314E', color: '#22314E' },
  'Robot Programming': { logo: 'https://cdn.simpleicons.org/ros/22314E', color: '#06B6D4' },
  'Back-End Development': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', color: '#339933' },
  'Embedded Systems': { logo: 'https://cdn.simpleicons.org/stmicroelectronics/03234B', color: '#F59E0B' },
  'Network Security': { logo: 'https://cdn.simpleicons.org/letsencrypt/003A70', color: '#003A70' },
  'Network Administration': { logo: 'https://cdn.simpleicons.org/cisco/1BA0D7', color: '#3B82F6' },
  'System Administration': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', color: '#FCC624' },
  'Graphic Design': { logo: 'https://cdn.simpleicons.org/canva/00C4CC', color: '#00C4CC' },
  'Communication': { logo: null, color: '#8B5CF6' },
  'Leadership': { logo: null, color: '#EAB308' },
  'Project Management': { logo: null, color: '#14B8A6' },
  'Bahasa Indonesia': { logo: null, color: '#EF4444' },
  'Waste Management': { logo: null, color: '#22C55E' },
  'Engineering': { logo: null, color: '#78716C' },
  'Networking': { logo: 'https://cdn.simpleicons.org/cisco/1BA0D7', color: '#0EA5E9' },
  'Information Technology Infrastructure': { logo: 'https://cdn.simpleicons.org/serverfault/E7282D', color: '#64748B' },
}

const getSkillLogo = (skillName) => {
  return skillLogoMap[skillName] || { logo: null, color: '#6b7280' }
}

// Marquee row component for infinite scrolling
const MarqueeRow = ({ items, direction = 'left', speed = 30, isDark }) => {
  const duplicated = [...items, ...items, ...items, ...items]

  return (
    <div className="overflow-hidden relative group">
      {/* Fade edges */}
      <div className={`absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-r from-[#0a0a1a] to-transparent' : 'bg-gradient-to-r from-gray-50 to-transparent'}`} />
      <div className={`absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-l from-[#0a0a1a] to-transparent' : 'bg-gradient-to-l from-gray-50 to-transparent'}`} />

      <div
        className="flex gap-5 py-3 group-hover:[animation-play-state:paused]"
        style={{
          animation: `${direction === 'left' ? 'marqueeLeft' : 'marqueeRight'} ${speed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {duplicated.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className={`flex flex-col items-center gap-2 px-4 py-4 rounded-2xl shrink-0 cursor-default transition-all duration-300 hover:scale-110 min-w-[90px] ${isDark
                ? 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.1] hover:border-white/20'
                : 'bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300'
              }`}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 25px ${tech.color}30`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              {tech.logo ? (
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="w-9 h-9 object-contain"
                  loading="lazy"
                />
              ) : (
                <Cog size={28} style={{ color: tech.color }} strokeWidth={1.5} />
              )}
            </div>
            <span className={`text-xs font-medium text-center whitespace-nowrap uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {tech.name.length > 14 ? tech.name.substring(0, 12) + '...' : tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { isDark } = useTheme()
  const [skills, setSkills] = useState([])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${API_URL}/skills`)
        const data = await response.json()
        if (data && data.length > 0) {
          setSkills(data)
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error)
      }
    }
    fetchSkills()
  }, [])

  // Build all tech icons from skills for marquee
  const allTechIcons = skills.length > 0
    ? skills.map(s => {
      const logoData = getSkillLogo(s.name)
      return {
        name: s.name,
        logo: logoData.logo,
        color: logoData.color || s.color || '#6366f1',
      }
    })
    : [
      { name: 'Python', logo: skillLogoMap['Python'].logo, color: '#3776AB' },
      { name: 'C++', logo: skillLogoMap['C++'].logo, color: '#00599C' },
      { name: 'JavaScript', logo: skillLogoMap['JavaScript'].logo, color: '#F7DF1E' },
      { name: 'ESP32', logo: skillLogoMap['ESP32'].logo, color: '#E7352C' },
      { name: 'Arduino', logo: skillLogoMap['Arduino'].logo, color: '#00979D' },
      { name: 'Raspberry Pi', logo: skillLogoMap['Raspberry Pi'].logo, color: '#C51A4A' },
      { name: 'MQTT', logo: skillLogoMap['MQTT'].logo, color: '#660066' },
      { name: 'Robotics', logo: skillLogoMap['Robotics'].logo, color: '#FF6B35' },
      { name: 'IoT', logo: skillLogoMap['Internet of Things (IoT)'].logo, color: '#41BDF5' },
      { name: 'Networking', logo: skillLogoMap['Networking'].logo, color: '#0EA5E9' },
      { name: 'Node.js', logo: skillLogoMap['Back-End Development'].logo, color: '#339933' },
      { name: 'Linux', logo: skillLogoMap['System Administration'].logo, color: '#FCC624' },
    ]

  // Split icons into two rows
  const mid = Math.ceil(allTechIcons.length / 2)
  const row1 = allTechIcons.slice(0, mid)
  const row2 = allTechIcons.slice(mid)

  return (
    <section id="skills" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      {/* Marquee CSS Keyframes */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        {/* Scrolling Tech Icons Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-5"
        >
          <MarqueeRow items={row1} direction="left" speed={35} isDark={isDark} />
          <MarqueeRow items={row2} direction="right" speed={40} isDark={isDark} />
        </motion.div>

        {/* Certifications Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className={`inline-flex items-center gap-4 rounded-full px-8 py-4 flex-wrap justify-center ${isDark ? 'glass' : 'bg-white shadow-lg border border-gray-100'
            }`}>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Certifications:</span>
            <span className="text-indigo-500 font-medium">BCNE</span>
            <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>•</span>
            <span className="text-purple-500 font-medium">Back End Developer</span>
            <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>•</span>
            <span className="text-indigo-500 font-medium">Samsung Innovation Campus</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
