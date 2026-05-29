import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Instagram, ChevronDown, Code2, Cpu, Database, Wifi, Terminal, Layers, Cog, Binary, CircuitBoard, Rocket, Monitor, FileDown, Eye } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

import { API_URL } from '../config/api'

// Use public folder for large image
const profileImg = '/profile.png'

const Hero = () => {
  const { isDark } = useTheme()
  const [aboutData, setAboutData] = useState(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${API_URL}/about`)
        if (response.ok) {
          const data = await response.json()
          setAboutData(data)
        }
      } catch (error) {
        console.error('Error fetching about data:', error)
      }
    }
    fetchAboutData()
  }, [])

  const socialLinks = [
    { icon: Github, href: aboutData?.github_url || 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: aboutData?.linkedin_url || 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: aboutData?.instagram_url || 'https://instagram.com', label: 'Instagram' },
    { icon: Mail, href: `mailto:${aboutData?.email || 'contact@example.com'}`, label: 'Email' },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background (3D removed for performance) */}
      <div className="absolute inset-0 z-0 bg-transparent">
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 z-10 ${isDark
          ? 'bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]'
          : 'bg-gradient-to-b from-white/70 via-white/30 to-white/90'
        }`} />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-indigo-500 text-lg mb-4"
            >
              Hello, I'm
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              {aboutData?.title ? (
                <>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{aboutData.title.split(' ')[0]} </span>
                  <span className="gradient-text">{aboutData.title.split(' ').slice(1).join(' ')}</span>
                </>
              ) : (
                <>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>Kevin </span>
                  <span className="gradient-text">Syonin</span>
                </>
              )}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-xl md:text-2xl mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <span className="text-indigo-500">{aboutData?.subtitle || 'Product Development Engineer'}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`text-lg max-w-xl mb-8 mx-auto lg:mx-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {aboutData?.description || 'Passionate technology professional dedicated to developing innovative solutions that bridge hardware and software. Building real-world projects in robotics, IoT systems, and intelligent automation.'}
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center lg:justify-start gap-4 mb-8"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isDark
                      ? 'glass text-gray-400 hover:text-indigo-400 hover:border-indigo-400/50'
                      : 'bg-white shadow-lg border border-gray-100 text-gray-500 hover:text-indigo-600'
                    }`}
                >
                  <social.icon size={22} />
                </motion.a>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/25"
              >
                Get In Touch
              </motion.a>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-xl font-medium transition-colors ${isDark
                    ? 'glass text-white hover:border-indigo-400/50'
                    : 'bg-white shadow-lg border border-gray-100 text-gray-700 hover:text-indigo-600'
                  }`}
              >
                View Projects
              </motion.a>
            </motion.div>

            {/* CV Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-4"
            >
              <motion.a
                href={aboutData?.resume_url || "/cv/Kevin_Syonin_CV.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${isDark
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                  }`}
              >
                <Eye size={18} />
                View CV
              </motion.a>
              <motion.a
                href={aboutData?.resume_url || "/cv/Kevin_Syonin_CV.pdf"}
                download="Kevin_Syonin_CV.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${isDark
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                    : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                  }`}
              >
                <FileDown size={18} />
                Download CV
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Profile Image - Creative Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex items-center justify-center"
          >
            {/* Large "K" Letter Background */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute text-[280px] md:text-[350px] font-black text-transparent select-none pointer-events-none"
              style={{
                WebkitTextStroke: '3px rgba(99, 102, 241, 0.3)',
                transform: 'translateX(30px)',
              }}
            >
              K
            </motion.div>

            {/* Animated Arc/Ring behind profile */}
            <motion.svg
              className="absolute w-80 h-80 md:w-[420px] md:h-[420px]"
              viewBox="0 0 200 200"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#arcGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="200 100"
                opacity="0.8"
              />
            </motion.svg>

            {/* Secondary rotating ring */}
            <motion.svg
              className="absolute w-72 h-72 md:w-96 md:h-96"
              viewBox="0 0 200 200"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="rgba(139, 92, 246, 0.2)"
                strokeWidth="1"
                strokeDasharray="10 10"
              />
            </motion.svg>

            {/* Profile Container - Organic Shape */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 z-10">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-2xl opacity-40 animate-pulse" />

              {/* Profile Image with creative border */}
              <div
                className="relative w-full h-full overflow-hidden shadow-2xl"
                style={{
                  borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                  border: '4px solid rgba(99, 102, 241, 0.5)',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                }}
              >
                <img
                  src={profileImg}
                  alt="Kevin Syonin"
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                  }}
                />
              </div>

              {/* Floating IT Icons around profile */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
              >
                <Code2 className="text-white" size={24} />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-2 -left-4 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30"
              >
                <Cpu className="text-white" size={20} />
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/4 -left-10 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30"
              >
                <Wifi className="text-white" size={18} />
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute top-0 left-1/4 w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30"
              >
                <Terminal className="text-white" size={16} />
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute top-1/3 -right-8 w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30"
              >
                <Database className="text-white" size={16} />
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0], rotate: 360 }}
                transition={{
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                }}
                className="absolute bottom-1/4 -right-6 w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/30"
              >
                <Cog className="text-white" size={16} />
              </motion.div>

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute -bottom-4 left-1/4 w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30"
              >
                <Layers className="text-white" size={14} />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-8 right-0 glass px-4 py-2 rounded-full text-sm shadow-xl border border-yellow-500/30"
              >
                <span className="text-yellow-400">🏆</span>
                <span className="text-white ml-1">Silver Medal WICE 2025</span>
              </motion.div>
            </div>

            {/* Floating IT decoration icons */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-5 right-16 w-6 h-6 text-indigo-400"
            >
              <Binary size={24} />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-24 left-8 w-5 h-5 text-purple-400"
            >
              <CircuitBoard size={20} />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute top-1/3 right-2 w-5 h-5 text-green-400"
            >
              <Rocket size={20} />
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: 0.3 }}
              className="absolute bottom-16 right-12 w-5 h-5 text-cyan-400"
            >
              <Monitor size={20} />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-400"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <ChevronDown size={24} />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
