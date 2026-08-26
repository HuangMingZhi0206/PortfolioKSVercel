import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { NAV_LINKS } from '../constants'
import { LotusMark } from './decor/Lotus'

/**
 * Floating "dynamic island" navigation.
 * A translucent pill fixed to the top-center of the viewport that
 * gently compacts once the page is scrolled.
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('#home')
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track which section is on screen so the island can highlight it
  useEffect(() => {
    const sections = NAV_LINKS
      .map((link) => document.querySelector(link.href))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-3">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto w-full max-w-3xl"
      >
        <motion.div
          animate={{
            marginTop: isScrolled ? 10 : 20,
            paddingTop: isScrolled ? 8 : 12,
            paddingBottom: isScrolled ? 8 : 12,
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`glass rounded-full px-4 sm:px-5 flex items-center justify-between gap-2 transition-shadow duration-300 ${
            isScrolled ? 'shadow-island' : 'shadow-soft'
          }`}
        >
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 text-lotus-700 dark:text-lotus-200 shrink-0"
            aria-label="Back to top"
          >
            <LotusMark size={24} />
            <span className="font-display font-semibold text-lg tracking-tight">
              Kevin
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-lotus-700 dark:text-lotus-100'
                      : 'text-slate-500 dark:text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-200'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-lotus-100/80 dark:bg-lotus-400/15"
                    />
                  )}
                  <span className="relative">{link.name}</span>
                </a>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-gold hover:bg-cream-200/70 dark:hover:bg-white/5 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a
              href="#contact"
              className="hidden lg:inline-flex px-4 py-1.5 rounded-full text-sm font-medium text-white dark:text-night-900 bg-lotus-600 hover:bg-lotus-700 dark:bg-lotus-400 dark:hover:bg-lotus-300 transition-colors"
            >
              Hire Me
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-cream-200/70 dark:hover:bg-white/5 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile menu — a second detached island */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-3xl shadow-island mt-2 p-3 md:hidden"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                    activeSection === link.href
                      ? 'bg-lotus-100/80 dark:bg-lotus-400/15 text-lotus-700 dark:text-lotus-100'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-cream-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="block mt-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-center text-white dark:text-night-900 bg-lotus-600 dark:bg-lotus-400"
              >
                Hire Me
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  )
}

export default Navbar
