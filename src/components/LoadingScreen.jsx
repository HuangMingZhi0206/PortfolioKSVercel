import { motion } from 'framer-motion'
import { Code2, Cpu, Database, Terminal, Wifi, Binary } from 'lucide-react'

const LoadingScreen = () => {
  // Floating IT icons data
  const floatingIcons = [
    { Icon: Code2, delay: 0, x: -120, y: -80 },
    { Icon: Cpu, delay: 0.2, x: 120, y: -60 },
    { Icon: Database, delay: 0.4, x: -100, y: 80 },
    { Icon: Terminal, delay: 0.6, x: 110, y: 70 },
    { Icon: Wifi, delay: 0.8, x: 0, y: -120 },
    { Icon: Binary, delay: 1, x: 0, y: 120 },
  ]

  // Binary rain columns
  const binaryColumns = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + i * 12}%`,
    delay: i * 0.3,
    duration: 2 + Math.random() * 2,
  }))

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] overflow-hidden"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Binary Rain Effect - hidden on mobile */}
      <div className="hidden md:block">
        {binaryColumns.map((col) => (
          <motion.div
            key={col.id}
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: '100vh', opacity: [0, 0.5, 0] }}
            transition={{
              duration: col.duration,
              repeat: Infinity,
              delay: col.delay,
              ease: "linear",
            }}
            className="absolute text-xs font-mono text-green-500/30"
            style={{ left: col.left }}
          >
            {['1', '0', '1', '1', '0', '0', '1', '0'].map((bit, i) => (
              <div key={i}>{bit}</div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Glowing Orbs - hidden on mobile */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="hidden md:block absolute w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="hidden md:block absolute w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-x-20 translate-y-10"
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Floating IT Icons - hidden on mobile */}
        <div className="hidden md:block">
          {floatingIcons.map(({ Icon, delay, x, y }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0.6],
                scale: [0, 1, 1],
                x: x,
                y: y,
              }}
              transition={{
                duration: 1,
                delay: delay,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                <Icon size={24} className="text-indigo-400/60" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Center Logo Container */}
        <div className="relative flex items-center justify-center">
          {/* Outer Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute"
          >
            <svg width="200" height="200" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="ringGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
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
                stroke="url(#ringGradient1)"
                strokeWidth="2"
                strokeDasharray="30 20"
                opacity="0.6"
              />
            </svg>
          </motion.div>

          {/* Middle Rotating Ring (opposite direction) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute"
          >
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="1"
                strokeDasharray="15 10"
                opacity="0.4"
              />
            </svg>
          </motion.div>

          {/* Inner Pulsing Ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute w-28 h-28 border-2 border-indigo-500/50 rounded-full"
          />

          {/* Animated KS Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.3 
            }}
            className="relative"
          >
            {/* Glow Effect */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 blur-lg md:blur-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 md:opacity-50"
              style={{ transform: 'scale(1.5)' }}
            />
            
            {/* Main Text */}
            <div className="relative text-7xl font-black">
              <span className="gradient-text">K</span>
              <span className="text-white">S</span>
            </div>
          </motion.div>

          {/* Orbiting Dots */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute w-36 h-36"
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50"
            />
          </motion.div>
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-44 h-44"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"
            />
          </motion.div>
        </div>

        {/* Loading Text with Typing Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-24 flex flex-col items-center"
        >
          <div className="flex items-center gap-2 text-gray-400 text-sm tracking-[0.3em] font-light">
            <span>INITIALIZING</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              _
            </motion.span>
          </div>
          
          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '200px' }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            className="mt-4 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          />
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 text-indigo-500/20 font-mono text-xs">
        {'<html>'}
      </div>
      <div className="absolute top-8 right-8 text-purple-500/20 font-mono text-xs">
        {'<body>'}
      </div>
      <div className="absolute bottom-8 left-8 text-indigo-500/20 font-mono text-xs">
        {'</body>'}
      </div>
      <div className="absolute bottom-8 right-8 text-purple-500/20 font-mono text-xs">
        {'</html>'}
      </div>
    </motion.div>
  )
}

export default LoadingScreen
