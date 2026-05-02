import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { playHorn } from '../lib/sounds'

const seq = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export default function Konami() {
  const [idx, setIdx] = useState(0)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const want = seq[idx]
      if (key === want) {
        const next = idx + 1
        if (next === seq.length) {
          setOn(true)
          setIdx(0)
          playHorn()
          document.documentElement.classList.add('konami')
          setTimeout(() => {
            setOn(false)
            document.documentElement.classList.remove('konami')
          }, 6000)
        } else {
          setIdx(next)
        }
      } else {
        setIdx(key === seq[0] ? 1 : 0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx])

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] border-2 border-neo-red bg-ink-950 px-6 py-4 shadow-2xl"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red mb-1">
            ▲ ▲ ▼ ▼ ◀ ▶ ◀ ▶ B A — Konami unlocked
          </div>
          <div className="font-display text-2xl uppercase tracking-tight text-bone">
            Secret mode · <span className="text-neo-red">+30 XP</span>
          </div>
          <div className="mt-1 font-serif italic text-sm text-bone/70">
            thanks for looking under the hood ✦
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
