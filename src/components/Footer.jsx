import { ArrowUp } from 'lucide-react'
import { NAV_LINKS, SITE } from '../constants'
import { LotusMark } from './decor/Lotus'

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 mt-8">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lotus-300 dark:via-lotus-400/40 to-transparent" />

      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 mb-3 text-lotus-700 dark:text-lotus-200"
            >
              <LotusMark size={28} />
              <span className="font-display text-2xl font-semibold">{SITE.name}</span>
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {SITE.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-300 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <p>{SITE.email}</p>
              <p>{SITE.location}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-cream-300 dark:border-white/10 pt-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {currentYear} {SITE.name}
            </p>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-300 transition-colors group"
            >
              Back to Top
              <span className="w-8 h-8 rounded-full card flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
                <ArrowUp size={15} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
