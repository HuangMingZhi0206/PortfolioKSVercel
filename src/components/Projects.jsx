import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Tilt from 'react-parallax-tilt'
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Calendar, Image } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

import { API_URL, MEDIA_BASE_URL } from '../config/api'

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const { isDark } = useTheme()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`)
        const data = await response.json()
        if (data && data.length > 0) {
          setProjects(data)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }
    fetchProjects()
  }, [])

  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b']

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }

  const openProjectModal = (project) => {
    setSelectedProject(project)
    setCurrentMediaIndex(0)
  }

  const closeModal = () => {
    setSelectedProject(null)
    setCurrentMediaIndex(0)
  }

  const nextMedia = () => {
    if (selectedProject?.media && currentMediaIndex < selectedProject.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1)
    }
  }

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1)
    }
  }

  return (
    <section id="projects" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Innovative solutions in robotics, IoT, and software development
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const color = colors[index % colors.length]
            return (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Tilt
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  glareEnable={true}
                  glareMaxOpacity={0.1}
                  glareColor={color}
                  className="h-full"
                >
                  <div
                    className={`rounded-3xl overflow-hidden card-hover h-full flex flex-col cursor-pointer transition-colors ${isDark ? 'glass' : 'bg-white shadow-xl border border-gray-100'
                      }`}
                    onClick={() => openProjectModal(project)}
                  >
                    {/* Project Image/Media Preview */}
                    <div
                      className="h-48 flex items-center justify-center overflow-hidden relative"
                      style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)` }}
                    >
                      {project.image ? (
                        <img
                          src={project.image.startsWith('http') ? project.image : `${MEDIA_BASE_URL}${project.image}`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : project.media && project.media.length > 0 ? (
                        <img
                          src={project.media[0].media_url.startsWith('http') ? project.media[0].media_url : `${MEDIA_BASE_URL}${project.media[0].media_url}`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl opacity-50">💻</div>
                      )}

                      {/* Media Count Badge */}
                      {project.media && project.media.length > 1 && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-lg text-xs">
                          <Image size={12} />
                          {project.media.length}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Date Range */}
                      {project.start_date && (
                        <div className={`flex items-center gap-1 text-xs mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Calendar size={12} />
                          {formatDate(project.start_date)} - {project.is_ongoing ? 'Present' : formatDate(project.end_date)}
                        </div>
                      )}

                      <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                      <p className={`text-sm mb-4 flex-1 line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {project.short_description || project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(project.technologies || []).slice(0, 3).map((tech, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                            {typeof tech === 'string' ? tech : tech.technology}
                          </span>
                        ))}
                        {(project.technologies || []).length > 3 && (
                          <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}>
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex gap-3">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'}`}
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
                            className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedProject.title}</h3>
                <button
                  onClick={closeModal}
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
                {/* Media Gallery */}
                {selectedProject.media && selectedProject.media.length > 0 ? (
                  <div className="relative">
                    {/* Main Image */}
                    <div className="aspect-video bg-black flex items-center justify-center">
                      <img
                        src={selectedProject.media[currentMediaIndex].media_url.startsWith('http')
                          ? selectedProject.media[currentMediaIndex].media_url
                          : `${MEDIA_BASE_URL}${selectedProject.media[currentMediaIndex].media_url}`}
                        alt={selectedProject.media[currentMediaIndex].caption || selectedProject.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {/* Navigation Arrows */}
                    {selectedProject.media.length > 1 && (
                      <>
                        <button
                          onClick={prevMedia}
                          disabled={currentMediaIndex === 0}
                          className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white transition-opacity ${currentMediaIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'
                            }`}
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextMedia}
                          disabled={currentMediaIndex === selectedProject.media.length - 1}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white transition-opacity ${currentMediaIndex === selectedProject.media.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'
                            }`}
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Thumbnails */}
                    {selectedProject.media.length > 1 && (
                      <div className={`flex gap-2 p-3 overflow-x-auto ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        {selectedProject.media.map((media, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentMediaIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentMediaIndex === index
                                ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                                : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                          >
                            <img
                              src={media.media_url.startsWith('http') ? media.media_url : `${MEDIA_BASE_URL}${media.media_url}`}
                              alt={media.caption || `Media ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : selectedProject.image ? (
                  <div className="aspect-video bg-black flex items-center justify-center">
                    <img
                      src={selectedProject.image.startsWith('http') ? selectedProject.image : `${MEDIA_BASE_URL}${selectedProject.image}`}
                      alt={selectedProject.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : null}

                {/* Project Info */}
                <div className="p-6">
                  {/* Date */}
                  {selectedProject.start_date && (
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatDate(selectedProject.start_date)} - {selectedProject.is_ongoing ? 'Present' : formatDate(selectedProject.end_date)}
                    </p>
                  )}

                  {/* Description */}
                  <p className={`mb-6 whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedProject.description}
                  </p>

                  {/* Skills/Technologies */}
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                    <div className="mb-6">
                      <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1.5 text-sm rounded-full ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                              }`}
                          >
                            {typeof tech === 'string' ? tech : tech.technology}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-4">
                    {selectedProject.demo_url && (
                      <a
                        href={selectedProject.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white text-sm hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink size={16} />
                        View Project
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
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
