import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SplashLoader() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return true
    try { return sessionStorage.getItem('splashed') !== '1' } catch { return true }
  })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!visible) return
    const duration = 1800
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1)
      setCount(Math.floor(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const close = setTimeout(() => {
      try { sessionStorage.setItem('splashed', '1') } catch {}
      setVisible(false)
    }, duration + 200)
    const skip = (e: KeyboardEvent | MouseEvent) => {
      if ('key' in e && e.key !== 'Escape' && e.key !== 'Enter' && e.key !== ' ') return
      try { sessionStorage.setItem('splashed', '1') } catch {}
      setVisible(false)
    }
    window.addEventListener('keydown', skip)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(close)
      window.removeEventListener('keydown', skip)
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-ink-950 overflow-hidden"
        >
          {/* diagonal red stripe */}
          <motion.div
            className="absolute -left-20 top-0 h-full w-40 bg-neo-red"
            initial={{ skewX: -20, x: -200, opacity: 0.8 }}
            animate={{ x: '150vw' }}
            transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1], delay: 0.2 }}
          />

          {/* top meta bar */}
          <div className="flex items-center justify-between px-6 py-5 font-mono text-[10px] uppercase tracking-[0.3em]">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-bone/70"
            >
              <span className="text-neo-red">●</span> Loading portfolio
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-bone/50 tabular-nums"
            >
              {count.toString().padStart(3, '0')}%
            </motion.span>
          </div>

          {/* center */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red mb-5"
            >
              § 00 — Enter
            </motion.p>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
                className="font-display text-6xl sm:text-7xl md:text-9xl font-medium uppercase tracking-tightest text-bone leading-[0.9]"
              >
                Devashish
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-4 font-serif italic text-bone/60 text-lg"
            >
              — developer, shipping.
            </motion.p>
          </div>

          {/* bottom bar: loading progress */}
          <div className="px-6 pb-4">
            <div className="h-[2px] w-full bg-bone/10 overflow-hidden">
              <motion.div
                className="h-full bg-neo-red origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.8, ease: [0.7, 0, 0.2, 1] }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
              <span>INIT · FETCH · RENDER</span>
              <span>PRESS ENTER TO SKIP</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
