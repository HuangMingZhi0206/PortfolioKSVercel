import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Award, Calendar, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react'
import { useApiData } from '../hooks/useApiData'
import { getSkillData } from '../lib/skillIcons'
import { mediaUrl } from '../lib/media'
import SectionHeader from './ui/SectionHeader'
import ImageLightbox from './ImageLightbox'

const DEFAULT_CERTIFICATIONS = [
  {
    title: 'Back End Developer',
    issuer: 'Professional Certification',
    issue_date: '2024-01-01',
    description: 'Certification in back-end development and server-side programming',
    icon: '🔧',
  },
  {
    title: 'Code Kickstart Python Programming',
    issuer: 'Samsung Innovation Campus - Batch 7 Stage 1',
    issue_date: '2024-01-01',
    description: 'Advanced Python programming and IoT training from Samsung Innovation Campus',
    icon: '🐍',
  },
  {
    title: 'Brocade Certified Network Engineer (BCNE)',
    issuer: 'Brocade',
    issue_date: '2023-01-01',
    description: 'Network engineering certification covering enterprise networking solutions',
    icon: '🌐',
  },
]

const AWARDS = [
  {
    title: 'Silver Medal - WICE 2025',
    event: 'World Invention Competition & Exhibition',
    description: 'Automated Waste Management System with Real-Time IoT Monitoring',
    year: '2025',
  },
  {
    title: 'National Robotics Competition Winner',
    event: 'National Robotics Championship',
    description: 'Top 3 National Rankings in Competitive Robotics',
    year: '2024',
  },
  {
    title: 'Top 26 Regional Excellence Award',
    event: 'West Java Vocational Excellence',
    description: 'Regional recognition for vocational excellence',
    year: '2023',
  },
]

const FALLBACK_ICONS = ['🔧', '🐍', '🌐', '🎨', '🏆', '🖥️']

const Certifications = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const certifications = useApiData('/certifications', DEFAULT_CERTIFICATIONS)
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })

  const openLightbox = (media, index = 0) => {
    const images = media.filter((m) => m.file_type?.includes('image'))
    if (images.length > 0) setLightbox({ open: true, images, index })
  }

  return (
    <section id="certifications" className="relative py-16 md:py-28" ref={ref}>
      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Awards &"
          accent="Recognition"
          description="Achievements that highlight my journey in technology"
          inView={isInView}
        />

        {/* Awards */}
        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {AWARDS.map((award, index) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + index * 0.1 }}
              className="card card-hover p-8 text-center relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
              <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-light to-gold mb-4">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-1.5">{award.title}</h3>
              <p className="text-lotus-600 dark:text-lotus-300 text-sm mb-3">{award.event}</p>
              <p className="text-sm mb-4 text-slate-500 dark:text-slate-400">{award.description}</p>
              <span className="chip">{award.year}</span>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="text-center mb-12"
        >
          <h3 className="font-display text-3xl font-semibold">
            <span className="gradient-text">Licenses & Certifications</span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert, index) => {
            const certImages = cert.media?.filter((m) => m.file_type?.includes('image')) || []
            const certFiles = cert.media?.filter((m) => !m.file_type?.includes('image')) || []

            return (
              <motion.div
                key={cert.id || index}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.45 + index * 0.08 }}
                className="card card-hover p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-lotus-50 dark:bg-lotus-400/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                    {cert.image ? (
                      <img loading="lazy" src={mediaUrl(cert.image)} alt={cert.title} className="w-full h-full object-cover" />
                    ) : (
                      cert.icon || FALLBACK_ICONS[index % FALLBACK_ICONS.length]
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold mb-0.5 leading-snug">{cert.title}</h4>
                    <p className="text-sm mb-2 text-lotus-600 dark:text-lotus-300">{cert.issuer}</p>
                    <p className="text-sm mb-3 text-slate-500 dark:text-slate-400">{cert.description}</p>

                    {cert.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {cert.skills.slice(0, 4).map((skill) => {
                          const { icon: SkillIcon, color } = getSkillData(skill.name)
                          return (
                            <span key={skill.id} className="chip">
                              <SkillIcon size={12} style={{ color }} />
                              {skill.name.length > 15 ? `${skill.name.substring(0, 15)}…` : skill.name}
                            </span>
                          )
                        })}
                        {cert.skills.length > 4 && <span className="chip">+{cert.skills.length - 4} more</span>}
                      </div>
                    )}

                    {(certImages.length > 0 || certFiles.length > 0) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {certImages.slice(0, 3).map((m, mIndex) => (
                          <button
                            key={m.id}
                            onClick={() => openLightbox(cert.media, mIndex)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden group cursor-pointer ring-1 ring-cream-300 dark:ring-white/10"
                          >
                            <img
                              loading="lazy"
                              src={mediaUrl(m.file_path)}
                              alt={m.title || 'Certificate'}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-night-900/0 group-hover:bg-night-900/30 transition-colors flex items-center justify-center">
                              <ImageIcon size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                        {certImages.length > 3 && (
                          <button
                            onClick={() => openLightbox(cert.media, 3)}
                            className="w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer bg-cream-100 dark:bg-white/5 hover:bg-cream-200 dark:hover:bg-white/10 ring-1 ring-cream-300 dark:ring-white/10 transition-colors"
                          >
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              +{certImages.length - 3}
                            </span>
                          </button>
                        )}
                        {certFiles.map((m) => (
                          <a
                            key={m.id}
                            href={mediaUrl(m.file_path)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-1 bg-cream-100 dark:bg-white/5 hover:bg-cream-200 dark:hover:bg-white/10 ring-1 ring-cream-300 dark:ring-white/10 transition-colors"
                          >
                            <FileText size={16} className="text-slate-500 dark:text-slate-400" />
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {m.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                        <Calendar size={12} />
                        {cert.issue_date ? new Date(cert.issue_date).getFullYear() : 'N/A'}
                      </div>
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View credential"
                          className="text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-300 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
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

export default Certifications
