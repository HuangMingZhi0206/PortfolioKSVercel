import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Tilt from 'react-parallax-tilt'
import { useTheme } from '../context/ThemeContext'
import {
  Code, Cpu, Wifi, Globe, Shield, Server, Database, Terminal,
  Bot, Cog, MessageSquare, Languages, Network, HardDrive, Wrench,
  Lightbulb, Zap, Radio, Settings, Layers, BrainCircuit, Palette,
  FileCode, Microscope, Router, Cloud, Lock
} from 'lucide-react'

import { API_URL } from '../config/api'

// Icon mapping for skills
const skillIconMap = {
  'Python': { icon: Code, color: '#3776ab' },
  'C++': { icon: Terminal, color: '#00599c' },
  'JavaScript': { icon: FileCode, color: '#f7df1e' },
  'Internet of Things (IoT)': { icon: Wifi, color: '#00b4d8' },
  'ESP32': { icon: Cpu, color: '#e7352c' },
  'Arduino': { icon: Cpu, color: '#00979d' },
  'Raspberry Pi': { icon: Cpu, color: '#c51a4a' },
  'MQTT': { icon: Radio, color: '#660066' },
  'Network Engineering': { icon: Router, color: '#0066cc' },
  'Robotics': { icon: Bot, color: '#ff6b35' },
  'Waste Management': { icon: Lightbulb, color: '#22c55e' },
  'Back-End Development': { icon: Server, color: '#6366f1' },
  'Embedded Systems': { icon: Microscope, color: '#f59e0b' },
  'Communication': { icon: MessageSquare, color: '#8b5cf6' },
  'Graphic Design': { icon: Palette, color: '#ec4899' },
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
  return skillIconMap[skillName] || { icon: Cog, color: '#6b7280' }
}

// Marquee row component for infinite scrolling
const MarqueeRow = ({ items, direction = 'left', speed = 30, isDark }) => {
  // Duplicate items enough times to fill the screen and create seamless loop
  const duplicated = [...items, ...items, ...items, ...items]

  return (
    <div className="overflow-hidden relative group">
      {/* Fade edges */}
      <div className={`absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-r from-[#0a0a1a] to-transparent' : 'bg-gradient-to-r from-gray-50 to-transparent'}`} />
      <div className={`absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-l from-[#0a0a1a] to-transparent' : 'bg-gradient-to-l from-gray-50 to-transparent'}`} />

      <div
        className="flex gap-4 py-3 group-hover:[animation-play-state:paused]"
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
              className={`flex items-center gap-3 px-5 py-3 rounded-xl shrink-0 cursor-default transition-all duration-300 hover:scale-105 ${isDark
                  ? 'bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/20'
                  : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                }`}
              style={{
                '--glow-color': tech.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px ${tech.color}30`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${tech.color}18` }}
              >
                <IconComponent size={20} style={{ color: tech.color }} strokeWidth={1.8} />
              </div>
              <span className={`text-sm font-medium whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {tech.name}
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

  const defaultSkillCategories = [
    {
      title: 'Programming Languages',
      skills: [
        { name: 'Python', level: 90, color: '#3776ab' },
        { name: 'C++', level: 85, color: '#00599C' },
        { name: 'JavaScript', level: 80, color: '#f7df1e' },
      ]
    },
    {
      title: 'Hardware & Embedded',
      skills: [
        { name: 'ESP32', level: 95, color: '#e7352c' },
        { name: 'Arduino', level: 90, color: '#00979D' },
        { name: 'Raspberry Pi', level: 85, color: '#C51A4A' },
      ]
    },
    {
      title: 'IoT & Platforms',
      skills: [
        { name: 'MQTT', level: 88, color: '#660066' },
        { name: 'IoT Dashboard', level: 85, color: '#6366f1' },
        { name: 'Network Mgmt', level: 82, color: '#8b5cf6' },
      ]
    },
  ]

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

  // Group skills by category
  const skillCategories = skills.length > 0
    ? Object.entries(skills.reduce((acc, skill) => {
      const cat = skill.category || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push({ name: skill.name, level: skill.proficiency, color: skill.color || '#6366f1' })
      return acc
    }, {})).map(([title, skillList]) => ({ title, skills: skillList }))
    : defaultSkillCategories

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
      { name: 'Python', icon: Code, color: '#3776ab' },
      { name: 'C++', icon: Terminal, color: '#00599C' },
      { name: 'JavaScript', icon: FileCode, color: '#f7df1e' },
      { name: 'ESP32', icon: Cpu, color: '#e7352c' },
      { name: 'Arduino', icon: Cpu, color: '#00979D' },
      { name: 'Raspberry Pi', icon: Cpu, color: '#C51A4A' },
      { name: 'MQTT', icon: Radio, color: '#660066' },
      { name: 'Robotics', icon: Bot, color: '#ff6b35' },
      { name: 'IoT', icon: Wifi, color: '#00b4d8' },
      { name: 'Networking', icon: Globe, color: '#0ea5e9' },
      { name: 'Network Security', icon: Shield, color: '#22c55e' },
      { name: 'Back-End', icon: Server, color: '#6366f1' },
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
          className="mb-16 space-y-4"
        >
          <MarqueeRow items={row1} direction="left" speed={35} isDark={isDark} />
          <MarqueeRow items={row2} direction="right" speed={40} isDark={isDark} />
        </motion.div>

        {/* Skill Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + catIndex * 0.1 }}
            >
              <Tilt
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                glareEnable={true}
                glareMaxOpacity={0.1}
                glareColor="#6366f1"
                className="h-full"
              >
                <div className={`rounded-3xl p-6 h-full card-hover transition-colors ${isDark ? 'glass' : 'bg-white shadow-xl border border-gray-100'
                  }`}>
                  <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.title}</h3>
                  <div className="space-y-6">
                    {category.skills.map((skill, skillIndex) => {
                      const { icon: SkillIcon, color } = getSkillIcon(skill.name)
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.4, delay: 0.5 + catIndex * 0.1 + skillIndex * 0.1 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <SkillIcon size={16} style={{ color }} />
                              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{skill.name}</span>
                            </div>
                            <span className="text-indigo-500">{skill.level}%</span>
                          </div>
                          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={isInView ? { width: `${skill.level}%` } : {}}
                              transition={{ duration: 1, delay: 0.6 + catIndex * 0.1 + skillIndex * 0.1 }}
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${color}, ${color}80)`,
                                boxShadow: `0 0 10px ${color}50`
                              }}
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        {/* Certifications Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
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
