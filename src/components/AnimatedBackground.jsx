import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { Cpu, Code2, Database, Wifi, Binary, CircuitBoard, Server, Terminal, Cog } from 'lucide-react'

// Pre-generate random values outside of component to avoid React Compiler warnings
const generateRandomValues = () => ({
  binaryDurations: [12, 15, 18, 11, 14, 17, 13, 16],
  binaryTexts: [
    ['1', '0', '1', '1', '0', '0', '1', '0', '1', '0', '1', '1', '0', '0', '1'],
    ['0', '1', '0', '0', '1', '1', '0', '1', '0', '1', '0', '0', '1', '1', '0'],
    ['1', '1', '0', '1', '0', '0', '1', '1', '0', '1', '0', '1', '0', '0', '1'],
    ['0', '0', '1', '0', '1', '1', '0', '0', '1', '0', '1', '0', '1', '1', '0'],
    ['1', '0', '0', '1', '1', '0', '1', '0', '0', '1', '1', '0', '1', '0', '0'],
    ['0', '1', '1', '0', '0', '1', '0', '1', '1', '0', '0', '1', '0', '1', '1'],
    ['1', '1', '1', '0', '0', '0', '1', '1', '1', '0', '0', '0', '1', '1', '1'],
    ['0', '0', '0', '1', '1', '1', '0', '0', '0', '1', '1', '1', '0', '0', '0'],
  ],
  floatingDots: [
    { left: 15, top: 25, duration: 5, delay: 1 },
    { left: 85, top: 15, duration: 6, delay: 2 },
    { left: 45, top: 75, duration: 4.5, delay: 0.5 },
    { left: 75, top: 35, duration: 7, delay: 3 },
    { left: 25, top: 85, duration: 5.5, delay: 1.5 },
    { left: 55, top: 45, duration: 6.5, delay: 2.5 },
    { left: 35, top: 55, duration: 4, delay: 0 },
    { left: 65, top: 65, duration: 8, delay: 4 },
    { left: 5, top: 45, duration: 5, delay: 1 },
    { left: 95, top: 55, duration: 6, delay: 2 },
    { left: 20, top: 10, duration: 4.5, delay: 0.5 },
    { left: 80, top: 90, duration: 7, delay: 3 },
    { left: 50, top: 20, duration: 5.5, delay: 1.5 },
    { left: 10, top: 70, duration: 6.5, delay: 2.5 },
    { left: 90, top: 30, duration: 4, delay: 0 },
    { left: 40, top: 60, duration: 8, delay: 4 },
    { left: 60, top: 40, duration: 5, delay: 1 },
    { left: 30, top: 80, duration: 6, delay: 2 },
    { left: 70, top: 20, duration: 4.5, delay: 0.5 },
    { left: 50, top: 50, duration: 7, delay: 3 },
  ],
})

const RANDOM_VALUES = generateRandomValues()

const AnimatedBackground = () => {
  const { isDark } = useTheme()
  
  // Use pre-generated values
  const randomValues = RANDOM_VALUES
  
  // Floating IT-themed particles
  const particles = [
    { Icon: Cpu, x: '10%', y: '20%', size: 20, duration: 8, delay: 0 },
    { Icon: Code2, x: '85%', y: '15%', size: 24, duration: 10, delay: 1 },
    { Icon: Database, x: '75%', y: '70%', size: 18, duration: 7, delay: 2 },
    { Icon: Wifi, x: '20%', y: '80%', size: 22, duration: 9, delay: 0.5 },
    { Icon: Binary, x: '50%', y: '10%', size: 16, duration: 11, delay: 1.5 },
    { Icon: CircuitBoard, x: '90%', y: '45%', size: 20, duration: 8, delay: 3 },
    { Icon: Server, x: '5%', y: '55%', size: 18, duration: 10, delay: 2.5 },
    { Icon: Terminal, x: '40%', y: '85%', size: 20, duration: 9, delay: 1 },
    { Icon: Cog, x: '60%', y: '35%', size: 16, duration: 12, delay: 0.8 },
  ]

  // Grid lines for tech feel
  const gridLines = Array.from({ length: 10 }, (_, i) => i)

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Background */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`} />

      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-indigo-500/10' : 'bg-indigo-300/30'
        }`}
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-purple-500/10' : 'bg-purple-300/30'
        }`}
      />
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl ${
          isDark ? 'bg-cyan-500/5' : 'bg-cyan-300/20'
        }`}
      />

      {/* Grid Pattern */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.05]'}`}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path 
                d="M 60 0 L 0 0 0 60" 
                fill="none" 
                stroke={isDark ? '#6366f1' : '#4f46e5'} 
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Horizontal Scan Lines */}
      {gridLines.map((_, i) => (
        <motion.div
          key={`h-line-${i}`}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ 
            x: ['100%', '-100%'],
            opacity: [0, 0.3, 0]
          }}
          transition={{ 
            duration: 15 + i * 2,
            repeat: Infinity,
            delay: i * 3,
            ease: "linear"
          }}
          style={{ top: `${10 + i * 10}%` }}
          className={`absolute left-0 w-full h-px ${
            isDark ? 'bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent' : 'bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent'
          }`}
        />
      ))}

      {/* Floating IT Icons */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            rotate: [0, 360],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          style={{
            left: particle.x,
            top: particle.y,
          }}
          className="absolute"
        >
          <particle.Icon 
            size={particle.size} 
            className={isDark ? 'text-indigo-400/30' : 'text-indigo-500/40'}
          />
        </motion.div>
      ))}

      {/* Binary Rain Effect */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`binary-${i}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: ['0vh', '100vh'],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: randomValues.binaryDurations[i],
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
          style={{ left: `${5 + i * 12}%` }}
          className={`absolute text-xs font-mono ${
            isDark ? 'text-green-500/20' : 'text-green-600/30'
          }`}
        >
          {randomValues.binaryTexts[i].map((bit, j) => (
            <div key={j}>{bit}</div>
          ))}
        </motion.div>
      ))}

      {/* Circuit Lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDark ? 0.05 : 0.08 }}>
        <motion.path
          d="M 0 200 Q 200 150, 400 200 T 800 200 T 1200 200"
          stroke={isDark ? '#6366f1' : '#4f46e5'}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 0 400 Q 300 350, 600 400 T 1200 400"
          stroke={isDark ? '#8b5cf6' : '#7c3aed'}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
        />
        <motion.path
          d="M 0 600 Q 400 550, 800 600 T 1600 600"
          stroke={isDark ? '#06b6d4' : '#0891b2'}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 4 }}
        />
      </svg>

      {/* Floating Dots/Nodes */}
      {randomValues.floatingDots.map((dot, i) => (
        <motion.div
          key={`dot-${i}`}
          initial={{ scale: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
          }}
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
          }}
          className={`absolute w-2 h-2 rounded-full ${
            isDark ? 'bg-indigo-400' : 'bg-indigo-500'
          }`}
        />
      ))}
    </div>
  )
}

export default AnimatedBackground
