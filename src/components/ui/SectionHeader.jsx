import { motion } from 'framer-motion'
import { LotusMark } from '../decor/Lotus'

/**
 * Shared section header: eyebrow label, serif title with an accented word,
 * a lotus divider, and an optional description.
 */
const SectionHeader = ({ title, accent, description, inView = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6 }}
    className="text-center mb-10 md:mb-16"
  >
    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
      {title} <span className="gradient-text">{accent}</span>
    </h2>

    <div className="flex items-center justify-center gap-3 mt-4 text-lotus-500 dark:text-lotus-300">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-lotus-300 dark:to-lotus-400/50" />
      <LotusMark size={20} />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-lotus-300 dark:to-lotus-400/50" />
    </div>

    {description && (
      <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-4 px-2 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    )}
  </motion.div>
)

export default SectionHeader
