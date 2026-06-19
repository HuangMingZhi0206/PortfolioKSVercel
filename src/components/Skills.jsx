import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import {
  Code, Cpu, Wifi, Globe, Shield, Server, Terminal,
  Bot, Cog, MessageSquare, Languages, Network, HardDrive, Wrench,
  Lightbulb, Zap, Radio, Settings, BrainCircuit, Palette,
  FileCode, Microscope, Router, Users, Flag, Rocket,
  MonitorSmartphone, ClipboardList
} from 'lucide-react'

import { API_URL } from '../config/api'

// Icon mapping with appropriate Lucide icons for each skill
const skillIconMap = {
  'Python': { icon: Code, color: '#3776AB' },
  'C++': { icon: Terminal, color: '#00599C' },
  'JavaScript': { icon: FileCode, color: '#F7DF1E' },
  'Arduino': { icon: Cpu, color: '#00979D' },
  'Raspberry Pi': { icon: Cpu, color: '#C51A4A' },
  'ESP32': { icon: Cpu, color: '#E7352C' },
  'MQTT': { icon: Radio, color: '#660066' },
  'Internet of Things (IoT)': { icon: Wifi, color: '#41BDF5' },
  'Network Engineering': { icon: Router, color: '#1BA0D7' },
  'Robotics': { icon: Bot, color: '#FF6B35' },
  'Mobile Robotics': { icon: Bot, color: '#F97316' },
  'Robot Programming': { icon: BrainCircuit, color: '#06B6D4' },
  'Back-End Development': { icon: Server, color: '#339933' },
  'Embedded Systems': { icon: Microscope, color: '#F59E0B' },
  'Network Security': { icon: Shield, color: '#22C55E' },
  'Network Administration': { icon: Network, color: '#3B82F6' },
  'System Administration': { icon: MonitorSmartphone, color: '#FCC624' },
  'Graphic Design': { icon: Palette, color: '#EC4899' },
  'Communication': { icon: MessageSquare, color: '#8B5CF6' },
  'Leadership': { icon: Rocket, color: '#EAB308' },
  'Project Management': { icon: ClipboardList, color: '#14B8A6' },
  'Bahasa Indonesia': { icon: Flag, color: '#EF4444' },
  'English': { icon: Languages, color: '#3B82F6' },
  'Waste Management': { icon: Lightbulb, color: '#22C55E' },
  'Engineering': { icon: Wrench, color: '#78716C' },
  'Networking': { icon: Globe, color: '#0EA5E9' },
  'Information Technology Infrastructure': { icon: HardDrive, color: '#64748B' },
}

const getSkillIcon = (skillName) => {
  return skillIconMap[skillName] || { icon: Cog, color: '#6b7280' }
}

// Marquee row component for infinite scrolling
const MarqueeRow = ({ items, direction = 'left', speed = 30, isDark }) => {
  const duplicated = [...items, ...items, ...items, ...items]

  return (
    <div className="overflow-hidden relative group w-full">

      <div
        className="flex gap-5 py-3 group-hover:[animation-play-state:paused]"
        style={{
          animation: `${direction === 'left' ? 'marqueeLeft' : 'marqueeRight'} ${speed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {duplicated.map((tech, index) => {
          const IconComponent = tech.icon
          return (
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
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${tech.color}18` }}
              >
                <IconComponent size={24} style={{ color: tech.color }} strokeWidth={1.8} />
              </div>
              <span className={`text-xs font-medium text-center whitespace-nowrap uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {tech.name.length > 16 ? tech.name.substring(0, 14) + '...' : tech.name}
              </span>
            </div>
          )
        })}
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
      const iconData = getSkillIcon(s.name)
      return {
        name: s.name,
        icon: iconData.icon,
        color: iconData.color || s.color || '#6366f1',
      }
    })
    : [
      { name: 'Python', icon: Code, color: '#3776AB' },
      { name: 'C++', icon: Terminal, color: '#00599C' },
      { name: 'JavaScript', icon: FileCode, color: '#F7DF1E' },
      { name: 'ESP32', icon: Cpu, color: '#E7352C' },
      { name: 'Arduino', icon: Cpu, color: '#00979D' },
      { name: 'Raspberry Pi', icon: Cpu, color: '#C51A4A' },
      { name: 'MQTT', icon: Radio, color: '#660066' },
      { name: 'Robotics', icon: Bot, color: '#FF6B35' },
      { name: 'IoT', icon: Wifi, color: '#41BDF5' },
      { name: 'Networking', icon: Globe, color: '#0EA5E9' },
      { name: 'Back-End', icon: Server, color: '#339933' },
      { name: 'Leadership', icon: Rocket, color: '#EAB308' },
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

      {/* Section Header - contained */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Scrolling Tech Icons Marquee - FULL WIDTH */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-5 w-full"
      >
        <MarqueeRow items={row1} direction="left" speed={35} isDark={isDark} />
        <MarqueeRow items={row2} direction="right" speed={40} isDark={isDark} />
      </motion.div>

      {/* Certifications Preview - contained */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
