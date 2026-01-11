import { motion } from 'framer-motion'
import { Heart, ArrowUp } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Footer = () => {
  const { isDark } = useTheme()
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <footer className={`relative py-12 overflow-hidden transition-colors ${
      isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'
    }`}>
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <motion.a
              href="#home"
              whileHover={{ scale: 1.05 }}
              className={`inline-block text-3xl font-bold mb-4 ${isDark ? 'gradient-text' : 'text-indigo-600'}`}
            >
              KS
            </motion.a>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Product Development Engineer | Robotics & IoT Innovator | Tech Entrepreneur
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isDark ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</h4>
            <div className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>kevinsyonin.266@gmail.com</p>
              <p>Central Jakarta, Indonesia</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t pt-8 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © {currentYear} Kevin Syonin.
            </p>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Back to Top
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'glass' : 'bg-white shadow-md border border-gray-100'
              }`}>
                <ArrowUp size={16} />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
