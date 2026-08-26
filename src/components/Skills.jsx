import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Wifi } from 'lucide-react'
import { useApiData } from '../hooks/useApiData'
import { getSkillData } from '../lib/skillIcons'
import SectionHeader from './ui/SectionHeader'

// Skill icon with CDN logo + Lucide fallback
const SkillIcon = ({ logo, FallbackIcon, color, size = 24 }) => {
  const [imgError, setImgError] = useState(false)

  if (logo && !imgError) {
    return (
      <img
        src={logo}
        alt=""
        className="object-contain"
        style={{ width: size, height: size }}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    )
  }
  return <FallbackIcon size={size} style={{ color }} strokeWidth={1.8} />
}

// Infinite marquee row (pauses on hover)
const MarqueeRow = ({ items, direction = 'left', speed = 35 }) => {
  const duplicated = [...items, ...items, ...items, ...items]

  return (
    <div className="overflow-hidden relative group w-full">
      <div
        className="flex gap-4 py-3 group-hover:[animation-play-state:paused]"
        style={{
          animation: `${direction === 'left' ? 'marqueeLeft' : 'marqueeRight'} ${speed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {duplicated.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex flex-col items-center gap-2 px-4 py-4 rounded-2xl shrink-0 min-w-[92px] cursor-default card transition-transform duration-300 hover:scale-105"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${tech.color}14` }}
            >
              <SkillIcon logo={tech.logo} FallbackIcon={tech.icon} color={tech.color} size={24} />
            </div>
            <span className="text-[11px] font-medium text-center whitespace-nowrap uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {tech.name.length > 16 ? `${tech.name.substring(0, 14)}…` : tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DEFAULT_SKILLS = [
  'Python', 'C++', 'JavaScript', 'ESP32', 'Arduino', 'Raspberry Pi',
  'MQTT', 'Robotics', 'Networking', 'Back-End Development', 'Leadership',
].map((name) => ({ name, ...getSkillData(name) }))
DEFAULT_SKILLS.splice(8, 0, { name: 'IoT', icon: Wifi, logo: null, color: '#2E86C1' })

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const skills = useApiData('/skills', [])

  const techIcons = skills.length > 0
    ? skills.map((s) => {
        const data = getSkillData(s.name)
        return { name: s.name, ...data, color: data.color || s.color || '#2E6BAA' }
      })
    : DEFAULT_SKILLS

  const mid = Math.ceil(techIcons.length / 2)

  return (
    <section id="skills" className="relative py-16 md:py-28 overflow-hidden" ref={ref}>
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

      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Technical"
          accent="Skills"
          description="Technologies and tools I use to bring ideas to life"
          inView={isInView}
        />
      </div>

      {/* Full-width marquee */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4 w-full"
      >
        <MarqueeRow items={techIcons.slice(0, mid)} direction="left" speed={35} />
        <MarqueeRow items={techIcons.slice(mid)} direction="right" speed={40} />
      </motion.div>

      {/* Certification strip */}
      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <div className="glass inline-flex items-center gap-x-4 gap-y-2 rounded-full px-8 py-4 flex-wrap justify-center shadow-soft">
            <span className="text-slate-500 dark:text-slate-400">Certifications:</span>
            <span className="text-lotus-600 dark:text-lotus-300 font-medium">BCNE</span>
            <span className="text-cream-400 dark:text-slate-600">•</span>
            <span className="text-lotus-600 dark:text-lotus-300 font-medium">Back End Developer</span>
            <span className="text-cream-400 dark:text-slate-600">•</span>
            <span className="text-lotus-600 dark:text-lotus-300 font-medium">Samsung Innovation Campus</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
