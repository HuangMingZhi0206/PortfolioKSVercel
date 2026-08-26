import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Briefcase, FileText, Building2, Users, Sparkles } from 'lucide-react'
import { useApiData } from '../hooks/useApiData'
import { formatPeriod, totalDuration } from '../lib/dates'
import { mediaUrl } from '../lib/media'
import SectionHeader from './ui/SectionHeader'
import ImageLightbox from './ImageLightbox'

const DEFAULT_EXPERIENCES = [
  {
    company: 'President University Catholic Society (PUCatSo)',
    position: 'Multimedia',
    employment_type: 'Part-time',
    start_date: '2024-11-01',
    end_date: null,
    is_current: true,
    location: 'North Cikarang, West Java, Indonesia',
    description: 'Become a Multimedia Member at Pucatso (President University Catholic Society) in 2024-2025.',
    experience_type: 'Organization',
    skills: [{ id: 1, name: 'Communication and Public Speaking' }],
    media: [],
  },
]

const TABS = [
  { key: 'Work', icon: Briefcase },
  { key: 'Organization', icon: Users },
]

const Experience = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const experiences = useApiData('/experiences', DEFAULT_EXPERIENCES)
  const [activeTab, setActiveTab] = useState('Work')
  const [expanded, setExpanded] = useState({})
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })

  const openLightbox = (media, index = 0) => {
    const images = media.filter((m) => m.file_type?.includes('image'))
    if (images.length > 0) setLightbox({ open: true, images, index })
  }

  // Group the active tab's experiences by company
  const grouped = experiences
    .filter((exp) => (exp.experience_type || 'Work') === activeTab)
    .reduce((acc, exp) => {
      acc[exp.company] ??= {
        company: exp.company,
        company_logo: exp.company_logo,
        location: exp.location,
        positions: [],
      }
      acc[exp.company].positions.push(exp)
      return acc
    }, {})

  const groups = Object.values(grouped).map((group) => ({
    ...group,
    positions: [...group.positions].sort((a, b) => new Date(b.start_date) - new Date(a.start_date)),
    duration: totalDuration(group.positions),
  }))

  const toggleExpand = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <section id="experience" className="relative py-16 md:py-28" ref={ref}>
      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="My"
          accent="Experience"
          description="My professional journey and organizational involvement"
          inView={isInView}
        />

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-12"
        >
          <div className="glass inline-flex p-1.5 rounded-full shadow-soft">
            {TABS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === key
                    ? 'bg-lotus-600 text-white dark:bg-lotus-400 dark:text-night-900 shadow-soft'
                    : 'text-slate-500 dark:text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-200'
                }`}
              >
                <Icon size={17} />
                {key}
              </button>
            ))}
          </div>
        </motion.div>

        {groups.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No {activeTab.toLowerCase()} experiences to display yet.
            </p>
          </div>
        ) : (
          <div className="columns-1 lg:columns-2 gap-5">
            {groups.map((group, groupIndex) => (
              <motion.div
                key={group.company}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + groupIndex * 0.1 }}
                className="break-inside-avoid mb-5 card card-hover overflow-hidden"
              >
                {/* Company header */}
                <div className="p-6 pb-0 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-lotus-50 dark:bg-lotus-400/10 flex items-center justify-center overflow-hidden shrink-0">
                    {group.company_logo ? (
                      <img
                        loading="lazy"
                        src={mediaUrl(group.company_logo)}
                        alt={group.company}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 size={22} className="text-lotus-600 dark:text-lotus-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold leading-snug">{group.company}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{group.duration}</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">{group.location}</p>
                  </div>
                </div>

                {/* Positions timeline */}
                <div className="relative mt-5 ml-6 mr-6 mb-1">
                  {group.positions.map((exp, posIndex) => {
                    const key = `${groupIndex}-${posIndex}`
                    const isExpanded = expanded[key]
                    const images = exp.media?.filter((m) => m.file_type?.includes('image')) || []
                    const files = exp.media?.filter((m) => !m.file_type?.includes('image')) || []
                    const isLast = posIndex === group.positions.length - 1

                    return (
                      <div key={exp.id || posIndex} className="relative pb-6 pl-7">
                        {!isLast && (
                          <div className="absolute w-px bg-cream-300 dark:bg-white/10" style={{ left: 5, top: 20, bottom: 0 }} />
                        )}
                        <div className="absolute top-1.5 left-0 w-[11px] h-[11px] rounded-full bg-lotus-400 dark:bg-lotus-300 ring-4 ring-lotus-100 dark:ring-lotus-400/10" />

                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{exp.employment_type || 'Full-time'}</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                          {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
                        </p>

                        {exp.description && (
                          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {isExpanded || exp.description.length <= 150
                              ? exp.description
                              : `${exp.description.substring(0, 150)}…`}
                            {exp.description.length > 150 && (
                              <button
                                onClick={() => toggleExpand(key)}
                                className="ml-1 text-lotus-600 dark:text-lotus-300 hover:underline font-medium"
                              >
                                {isExpanded ? 'see less' : 'see more'}
                              </button>
                            )}
                          </p>
                        )}

                        {exp.skills?.length > 0 && (
                          <div className="mt-2.5 flex items-start gap-2">
                            <Sparkles size={14} className="mt-0.5 shrink-0 text-gold" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {exp.skills.map((s) => s.name).join(' · ')}
                            </p>
                          </div>
                        )}

                        {images.length > 0 && (
                          <div className="mt-3.5 flex gap-2 overflow-x-auto pb-1">
                            {images.map((m, mIndex) => (
                              <button
                                key={m.id}
                                onClick={() => openLightbox(exp.media, mIndex)}
                                className="shrink-0 w-[120px] h-[80px] rounded-xl overflow-hidden border border-cream-300 dark:border-white/10 hover:border-lotus-400 transition-colors cursor-pointer group"
                              >
                                <img
                                  loading="lazy"
                                  src={mediaUrl(m.file_path)}
                                  alt={m.title || 'Media'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </button>
                            ))}
                          </div>
                        )}

                        {files.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {files.map((m) => (
                              <a
                                key={m.id}
                                href={mediaUrl(m.file_path)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chip hover:border-lotus-300 transition-colors"
                              >
                                <FileText size={12} />
                                {m.title?.length > 20 ? `${m.title.substring(0, 20)}…` : m.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ImageLightbox
        images={lightbox.images}
        initialIndex={lightbox.index}
        isOpen={lightbox.open}
        onClose={() => setLightbox((prev) => ({ ...prev, open: false }))}
      />
    </section>
  )
}

export default Experience
