import { motion } from 'framer-motion'
import { Lotus } from './decor/Lotus'

/** Minimal opening screen: a lotus blooming over still water. */
const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream-100 dark:bg-night-900"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="w-36 md:w-44"
    >
      <Lotus className="w-full h-auto" />
    </motion.div>

    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-6 font-display text-xl tracking-wide text-lotus-700 dark:text-lotus-200"
    >
      Kevin Syonin
    </motion.p>

    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 120 }}
      transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
      className="mt-4 h-0.5 rounded-full bg-gradient-to-r from-lotus-300 via-lotus-500 to-gold"
    />
  </motion.div>
)

export default LoadingScreen
