import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap, MapPin, Award, Target, Check } from 'lucide-react'
import { useApiData } from '../hooks/useApiData'
import SectionHeader from './ui/SectionHeader'

const STATS = [
  { label: 'Projects', value: '15+', icon: Target },
  { label: 'Awards', value: '5+', icon: Award },
  { label: 'Years Experience', value: '3+', icon: GraduationCap },
]

const DEFAULT_HIGHLIGHTS = [
  'Advanced Robotics & Mobile Robotics Engineering',
  'IoT & Embedded Systems (ESP32, MQTT, Arduino)',
  'Network Engineering & Security (BCNE Certified)',
  'Full-Stack Development (Python, Back-End)',
  'Competitive Robotics Excellence - Top 3 National',
]

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const about = useApiData('/about')

  const highlights = about?.highlights
    ? about.highlights.split('\n').filter((h) => h.trim())
    : DEFAULT_HIGHLIGHTS

  const cardMotion = (delay) => ({
    initial: { opacity: 0, y: 32 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.55, delay },
  })

  return (
    <section id="about" className="relative py-16 md:py-28" ref={ref}>
      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="About"
          accent="Me"
          description={about?.subtitle || 'Product Development Engineer | Robotics & IoT Innovator | Tech Entrepreneur'}
          inView={isInView}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Story */}
          <motion.div {...cardMotion(0.1)} className="lg:col-span-2 card card-hover p-8">
            <h3 className="font-display text-2xl font-semibold mb-4">Who I Am</h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300 mb-5">
              {about?.description ||
                `I'm a passionate technology professional dedicated to developing innovative
                solutions that bridge hardware and software. Currently pursuing my degree in
                Information Technology and Multimedia at President University,
                while actively building real-world projects in robotics, IoT systems, and intelligent automation.`}
            </p>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              I&apos;m driven by a passion for creating transformative technology solutions that solve
              real-world problems — from intelligent robotics systems and IoT ecosystems to
              scalable network infrastructure.
            </p>
          </motion.div>

          {/* Location */}
          <motion.div
            {...cardMotion(0.2)}
            className="card card-hover p-8 flex flex-col items-center justify-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-lotus-50 dark:bg-lotus-400/10 flex items-center justify-center mb-4">
              <MapPin className="text-lotus-600 dark:text-lotus-300" size={26} />
            </div>
            <h4 className="font-display text-xl font-semibold mb-1.5">Location</h4>
            <p className="text-slate-600 dark:text-slate-300">{about?.location || 'Central Jakarta, Jakarta'}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Indonesia</p>
          </motion.div>

          {/* Stats */}
          {STATS.map((stat, index) => (
            <motion.div key={stat.label} {...cardMotion(0.3 + index * 0.1)} className="card card-hover p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-lotus-50 dark:bg-lotus-400/10 flex items-center justify-center mb-4">
                <stat.icon className="text-lotus-600 dark:text-lotus-300" size={22} />
              </div>
              <div className="font-display text-4xl font-semibold gradient-text mb-1.5">{stat.value}</div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}

          {/* Highlights */}
          <motion.div {...cardMotion(0.5)} className="lg:col-span-3 card card-hover p-8">
            <h3 className="font-display text-2xl font-semibold mb-6 text-center">Expertise & Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-cream-100 dark:bg-white/[0.04] hover:bg-lotus-50 dark:hover:bg-lotus-400/10 transition-colors"
                >
                  <Check size={16} className="text-lotus-600 dark:text-lotus-300 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
