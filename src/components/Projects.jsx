import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Calendar, Image as ImageIcon } from 'lucide-react'
import { useApiData } from '../hooks/useApiData'
import { formatMonthYear } from '../lib/dates'
import { mediaUrl } from '../lib/media'
import SectionHeader from './ui/SectionHeader'

const techLabel = (tech) => (typeof tech === 'string' ? tech : tech.technology)

const projectPeriod = (project) =>
  `${formatMonthYear(project.start_date)} - ${project.is_ongoing ? 'Present' : formatMonthYear(project.end_date)}`

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const projects = useApiData('/projects', [])
  const [selected, setSelected] = useState(null)
  const [mediaIndex, setMediaIndex] = useState(0)

  const openModal = (project) => {
    setSelected(project)
    setMediaIndex(0)
  }

  const closeModal = () => setSelected(null)

  const coverImage = (project) =>
    project.image ? mediaUrl(project.image)
    : project.media?.length > 0 ? mediaUrl(project.media[0].media_url)
    : null

  return (
    <section id="projects" className="relative py-16 md:py-28" ref={ref}>
      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="My"
          accent="Projects"
          description="Innovative solutions in robotics, IoT, and software development"
          inView={isInView}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, index) => {
            const cover = coverImage(project)
            return (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <div
                  className="card card-hover overflow-hidden h-full flex flex-col cursor-pointer"
                  onClick={() => openModal(project)}
                >
                  {/* Cover */}
                  <div className="h-48 flex items-center justify-center overflow-hidden relative bg-gradient-to-br from-lotus-50 to-cream-100 dark:from-lotus-400/10 dark:to-night-850">
                    {cover ? (
                      <img loading="lazy" src={cover} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-4xl opacity-40">💻</div>
                    )}
                    {project.media?.length > 1 && (
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-night-900/60 backdrop-blur text-white px-2 py-1 rounded-lg text-xs">
                        <ImageIcon size={12} />
                        {project.media.length}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    {project.start_date && (
                      <div className="flex items-center gap-1.5 text-xs mb-2 text-slate-400 dark:text-slate-500">
                        <Calendar size={12} />
                        {projectPeriod(project)}
                      </div>
                    )}

                    <h3 className="font-display text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm mb-4 flex-1 line-clamp-3 text-slate-500 dark:text-slate-400">
                      {project.short_description || project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(project.technologies || []).slice(0, 3).map((tech, i) => (
                        <span key={i} className="chip">{techLabel(tech)}</span>
                      ))}
                      {(project.technologies || []).length > 3 && (
                        <span className="chip">+{project.technologies.length - 3}</span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live demo"
                          className="text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-300 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Source code"
                          className="text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-300 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={18} />
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

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-night-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-night-800 shadow-lift"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-cream-200 dark:border-white/[0.06]">
                <h3 className="font-display text-xl font-semibold">{selected.title}</h3>
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="p-2 rounded-full text-slate-400 hover:bg-cream-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-68px)]">
                {/* Gallery */}
                {selected.media?.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-video bg-night-900 flex items-center justify-center">
                      <img
                        loading="lazy"
                        src={mediaUrl(selected.media[mediaIndex].media_url)}
                        alt={selected.media[mediaIndex].caption || selected.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {selected.media.length > 1 && (
                      <>
                        <button
                          onClick={() => setMediaIndex((i) => Math.max(0, i - 1))}
                          disabled={mediaIndex === 0}
                          aria-label="Previous image"
                          className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-night-900/50 text-white transition-opacity ${
                            mediaIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-night-900/70'
                          }`}
                        >
                          <ChevronLeft size={22} />
                        </button>
                        <button
                          onClick={() => setMediaIndex((i) => Math.min(selected.media.length - 1, i + 1))}
                          disabled={mediaIndex === selected.media.length - 1}
                          aria-label="Next image"
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-night-900/50 text-white transition-opacity ${
                            mediaIndex === selected.media.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-night-900/70'
                          }`}
                        >
                          <ChevronRight size={22} />
                        </button>

                        <div className="flex gap-2 p-3 overflow-x-auto bg-cream-100 dark:bg-night-850">
                          {selected.media.map((media, index) => (
                            <button
                              key={index}
                              onClick={() => setMediaIndex(index)}
                              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                                mediaIndex === index
                                  ? 'border-lotus-500 ring-2 ring-lotus-300/50'
                                  : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img
                                loading="lazy"
                                src={mediaUrl(media.media_url)}
                                alt={media.caption || `Media ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : selected.image ? (
                  <div className="aspect-video bg-night-900 flex items-center justify-center">
                    <img
                      loading="lazy"
                      src={mediaUrl(selected.image)}
                      alt={selected.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : null}

                {/* Info */}
                <div className="p-6">
                  {selected.start_date && (
                    <p className="text-sm mb-3 text-slate-400 dark:text-slate-500">{projectPeriod(selected)}</p>
                  )}

                  <p className="mb-6 whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selected.description}
                  </p>

                  {selected.technologies?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-3 text-slate-500 dark:text-slate-400">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selected.technologies.map((tech, index) => (
                          <span key={index} className="chip">{techLabel(tech)}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {selected.demo_url && (
                      <a href={selected.demo_url} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 text-sm">
                        <ExternalLink size={16} />
                        View Project
                      </a>
                    )}
                    {selected.github_url && (
                      <a href={selected.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2.5 text-sm">
                        <Github size={16} />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
