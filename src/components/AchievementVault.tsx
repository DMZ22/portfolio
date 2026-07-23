import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Trophy, Cpu, Flame, Target, Database, Star, Zap, Brain } from 'lucide-react'
import { playTick } from '../lib/sounds'

type Ach = {
  id: string
  icon: typeof Trophy
  title: string
  desc: string
  accent: string
}

const all: Ach[] = [
  { id: 'ship', icon: Trophy, title: 'Built & Shipped', desc: '10+ side projects live on the internet.', accent: 'from-neo-red to-orange-500' },
  { id: 'ml', icon: Brain, title: 'Model Builder', desc: 'Trained 15+ ML models — ensembles, LSTMs, CNNs.', accent: 'from-cyan-400 to-blue-500' },
  { id: 'quant', icon: Target, title: 'Chart Reader', desc: '230+ trading symbols live in Stock Trader Pro.', accent: 'from-emerald-400 to-teal-500' },
  { id: 'night', icon: Flame, title: 'Night Shipper', desc: 'Side projects into production most nights.', accent: 'from-amber-400 to-neo-red' },
  { id: 'data', icon: Database, title: 'Data Plumber', desc: 'Trained on 70k+ CDC records for MediScan AI.', accent: 'from-fuchsia-500 to-neo-red' },
  { id: 'full', icon: Cpu, title: 'Full-Stack Reach', desc: 'From ML model to REST API to polished UI.', accent: 'from-neo-blue to-cyan-400' },
  { id: 'cert', icon: Star, title: 'NPTEL × 3', desc: 'IIT Ropar, IIT Kanpur, IIT Kharagpur — 2024.', accent: 'from-yellow-400 to-amber-500' },
  { id: 'intern', icon: Zap, title: 'Python Intern', desc: 'Currently at AlphaWizz — backend services.', accent: 'from-neo-red via-pink-500 to-purple-500' },
]

export default function AchievementVault() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!inView) return
    let cancel = false
    all.forEach((a, i) => {
      setTimeout(() => {
        if (cancel) return
        setUnlocked((prev) => { const n = new Set(prev); n.add(a.id); return n })
        playTick()
      }, 300 + i * 220)
    })
    return () => { cancel = true }
  }, [inView])

  const count = unlocked.size

  return (
    <section id="vault" ref={ref} className="relative border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-12 gap-6 items-end mb-12">
          <div className="col-span-12 md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neo-red">
              § 05.5 — Achievement Vault
            </p>
            <h2 className="mt-3 font-display text-5xl md:text-7xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
              Badges, <span className="font-serif italic text-neo-red">earned live.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:text-right font-mono text-xs uppercase tracking-[0.25em]">
            <div className="text-bone/70">
              unlocked{' '}
              <span className="text-bone font-bold tabular-nums">
                {String(count).padStart(2, '0')}
              </span>{' '}
              / {all.length}
            </div>
            <div className="mt-2 relative h-[2px] w-full md:w-60 md:ml-auto bg-white/10 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-neo-red origin-left"
                animate={{ scaleX: count / all.length }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-white/10">
          {all.map((a, i) => {
            const isOn = unlocked.has(a.id)
            return (
              <div
                key={a.id}
                className={`group relative overflow-hidden p-5 md:p-6 border-white/10 ${(i + 1) % 4 !== 0 ? 'md:border-r' : ''} ${i < all.length - 4 ? 'border-b' : ''} ${i < all.length - 2 && i >= all.length - 4 ? 'border-b md:border-b-0' : ''}`}
              >
                <AnimatePresence>
                  {isOn && (
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className={`absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${a.accent} opacity-30 blur-2xl`}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0.3 }}
                  animate={isOn ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className={`relative mb-4 flex h-12 w-12 items-center justify-center border ${
                    isOn ? 'border-neo-red bg-neo-red text-ink-950' : 'border-white/15 text-bone/60'
                  } transition-colors`}
                >
                  <a.icon size={20} />
                  {!isOn && (
                    <div className="absolute inset-0 flex items-center justify-center text-bone/30 text-xs">
                      ?
                    </div>
                  )}
                </motion.div>

                <div
                  className={`font-display text-base md:text-lg font-semibold uppercase tracking-tight transition-colors ${
                    isOn ? 'text-bone' : 'text-bone/30'
                  }`}
                >
                  {isOn ? a.title : '— locked —'}
                </div>
                <div className={`mt-2 font-mono text-[11px] uppercase tracking-[0.22em] leading-relaxed transition-colors ${
                  isOn ? 'text-bone/80' : 'text-bone/20'
                }`}>
                  {isOn ? a.desc : 'scroll to reveal'}
                </div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/30">
                  #{String(i + 1).padStart(3, '0')}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
