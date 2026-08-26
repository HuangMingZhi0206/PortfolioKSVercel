import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Instagram, ChevronDown, FileDown, Eye, ArrowRight } from 'lucide-react'
import { useApiData } from '../hooks/useApiData'
import { SITE } from '../constants'
import { Lotus } from './decor/Lotus'

const profileImg = '/profile.png'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
})

const Hero = () => {
  const about = useApiData('/about')

  const socialLinks = [
    { icon: Github, href: about?.github_url || 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: about?.linkedin_url || 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: about?.instagram_url || 'https://instagram.com', label: 'Instagram' },
    { icon: Mail, href: `mailto:${about?.email || SITE.email}`, label: 'Email' },
  ]

  const [firstName, ...restName] = (about?.title || SITE.name).split(' ')
  const cvUrl = about?.resume_url || SITE.cvPath

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.p {...fadeUp(0.1)} className="text-lotus-600 dark:text-lotus-300 font-medium mb-3">
              Hello, I&apos;m
            </motion.p>

            <motion.h1
              {...fadeUp(0.2)}
              className="font-display text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tight mb-4"
            >
              {firstName} <span className="gradient-text">{restName.join(' ')}</span>
            </motion.h1>

            <motion.p {...fadeUp(0.3)} className="text-xl md:text-2xl text-lotus-600 dark:text-lotus-300 mb-5">
              {about?.subtitle || 'Product Development Engineer'}
            </motion.p>

            <motion.p
              {...fadeUp(0.4)}
              className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              {about?.description ||
                'Passionate technology professional dedicated to developing innovative solutions that bridge hardware and software. Building real-world projects in robotics, IoT systems, and intelligent automation.'}
            </motion.p>

            {/* Socials */}
            <motion.div {...fadeUp(0.5)} className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-full card flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-300 hover:-translate-y-0.5 transition-all"
                >
                  <Icon size={20} />
                </a>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              {...fadeUp(0.6)}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              <a href="#contact" className="btn-primary">
                Get In Touch
                <ArrowRight size={18} />
              </a>
              <a href="#projects" className="btn-secondary">
                View Projects
              </a>
            </motion.div>

            <motion.div
              {...fadeUp(0.7)}
              className="flex items-center justify-center lg:justify-start gap-5 mt-6 text-sm"
            >
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-300 transition-colors"
              >
                <Eye size={16} />
                View CV
              </a>
              <span className="w-1 h-1 rounded-full bg-cream-400 dark:bg-slate-600" />
              <a
                href={cvUrl}
                download="Kevin_Syonin_CV.pdf"
                className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-300 transition-colors"
              >
                <FileDown size={16} />
                Download CV
              </a>
            </motion.div>
          </div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center shrink-0"
          >
            {/* Lotus blooming behind the portrait */}
            <div className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 w-64 md:w-96">
              <div className="animate-drift">
                <Lotus className="w-full h-auto" opacity={0.55} />
              </div>
            </div>

            {/* Soft halo */}
            <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-lotus-200/50 dark:bg-lotus-500/10 blur-2xl" />

            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute -inset-3 rounded-full border border-lotus-200 dark:border-lotus-400/20" />
              <div className="absolute -inset-1.5 rounded-full border-2 border-cream-300 dark:border-white/10" />
              <img
                src={profileImg}
                alt={SITE.name}
                className="relative w-full h-full object-cover rounded-full shadow-lift"
              />

              {/* Achievement badge */}
              <motion.div
                style={{ x: '-50%' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 left-1/2 glass rounded-full px-4 py-2 text-xs md:text-sm whitespace-nowrap shadow-island"
              >
                🏆 <span className="font-medium">Silver Medal WICE 2025</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.a
          href="#about"
          style={{ x: '-50%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.2, duration: 2.4, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 hidden sm:flex flex-col items-center text-slate-400 dark:text-slate-500 hover:text-lotus-500 transition-colors"
        >
          <span className="text-xs tracking-widest uppercase mb-1.5">Scroll</span>
          <ChevronDown size={20} />
        </motion.a>
      </div>
    </section>
  )
}

export default Hero
