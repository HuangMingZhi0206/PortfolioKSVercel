import { motion } from 'framer-motion'
import { Lotus } from './decor/Lotus'

/**
 * Calm, minimal page backdrop: a soft cream/navy gradient,
 * two slowly drifting blue orbs, and a faint lotus watermark.
 */
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Base gradient */}
    <div className="absolute inset-0 transition-colors duration-500 bg-gradient-to-b from-cream-50 via-cream-100 to-lotus-50 dark:from-night-900 dark:via-night-850 dark:to-night-900" />

    {/* Drifting orbs */}
    <motion.div
      animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
      transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      className="hidden md:block absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl bg-lotus-200/40 dark:bg-lotus-500/10"
    />
    <motion.div
      animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
      transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      className="hidden md:block absolute bottom-0 -right-32 w-[30rem] h-[30rem] rounded-full blur-3xl bg-gold-light/30 dark:bg-gold/5"
    />

    {/* Faint lotus watermark */}
    <div className="absolute bottom-[-4rem] right-[-3rem] w-[26rem] md:w-[34rem] opacity-[0.07] dark:opacity-[0.05] animate-drift">
      <Lotus className="w-full h-auto" />
    </div>
  </div>
)

export default AnimatedBackground
