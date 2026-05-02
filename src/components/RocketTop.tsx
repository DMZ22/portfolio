import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { Rocket } from 'lucide-react'
import { playWhoosh } from '../lib/sounds'

export default function RocketTop() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  const [launching, setLaunching] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > 400))

  const fire = () => {
    setLaunching(true)
    playWhoosh(true)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setLaunching(false), 1400)
    }, 400)
  }

  return (
    <motion.button
      onClick={fire}
      aria-label="Back to top"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 20,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      className="fixed bottom-16 right-5 z-40 group flex flex-col items-center"
    >
      <motion.div
        animate={launching ? { y: [0, -6, -800], rotate: [0, -8, 0] } : { y: 0 }}
        transition={launching ? { duration: 1.4, ease: [0.6, 0, 0.3, 1] } : { duration: 0.3 }}
        className="relative flex h-12 w-12 items-center justify-center border border-neo-red bg-neo-red text-ink-950 shadow-[0_0_20px_-4px_#ff2447] group-hover:scale-110 transition-transform"
      >
        <Rocket size={18} />
      </motion.div>
      {launching && (
        <motion.div
          initial={{ height: 0, opacity: 1 }}
          animate={{ height: 120, opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute top-12 w-1.5 bg-gradient-to-b from-neo-red via-orange-400 to-transparent"
        />
      )}
      <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-bone/50 group-hover:text-neo-red transition-colors">
        top
      </span>
    </motion.button>
  )
}
