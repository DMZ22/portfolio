import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useMemo, useState } from 'react'
import { projects, skills as skillsMap } from '../data/projects'

type Item = { kind: 'project' | 'skill' | 'meta'; label: string; meta?: string }

export default function TickerStrip() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  const feed: Item[] = useMemo(() => {
    const p: Item[] = projects.map((pr) => ({
      kind: 'project',
      label: pr.title.toUpperCase(),
      meta: pr.category,
    }))
    const allSkills = Array.from(new Set(Object.values(skillsMap).flat()))
    const s: Item[] = allSkills.map((sk) => ({ kind: 'skill', label: sk.toUpperCase() }))
    const m: Item[] = [
      { kind: 'meta', label: 'DEVELOPER · AI/ML · BACKEND' },
      { kind: 'meta', label: 'B.TECH CSE — AI & ML' },
      { kind: 'meta', label: 'INDIA · REMOTE' },
      { kind: 'meta', label: 'GITHUB.COM/DMZ22' },
      { kind: 'meta', label: 'devashishmoghe@gmail.com' },
    ]
    // interleave in readable clusters
    return [
      { kind: 'meta', label: '▸ LATEST WORK' },
      ...p,
      { kind: 'meta', label: '▸ STACK' },
      ...s,
      { kind: 'meta', label: '▸ CONTACT' },
      ...m,
    ]
  }, [])

  // double for seamless marquee
  const row = [...feed, ...feed]

  return (
    <motion.section
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? 'bg-ink-950/90' : 'bg-ink-950/70'
      }`}
      aria-label="Live feed"
    >
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-ink-950 via-ink-950/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-ink-950 via-ink-950/80 to-transparent" />

      {/* LIVE badge pinned left */}
      <div className="absolute inset-y-0 left-0 z-20 flex items-center gap-2.5 bg-neo-red px-4 sm:px-5 font-mono text-[11px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-ink-950">
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-ink-950 opacity-60" />
          <span className="relative h-full w-full rounded-full bg-ink-950" />
        </span>
        Live
      </div>

      {/* signal pinned right */}
      <div className="absolute inset-y-0 right-0 z-20 hidden sm:flex items-center gap-3 border-l border-white/10 bg-ink-950/90 px-5 font-mono text-[11px] uppercase tracking-[0.3em] text-bone/85">
        <span className="text-neo-red">v1.0</span>
        <span className="text-bone/60">·</span>
        <span>2026</span>
      </div>

      {/* scrolling feed */}
      <div className="relative overflow-hidden py-3 pl-20 sm:pl-24 pr-6 sm:pr-40">
        <div
          className="flex whitespace-nowrap animate-marquee will-change-transform"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {row.map((it, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-5 font-mono text-[12px] sm:text-[13px] uppercase tracking-[0.22em]"
            >
              {it.kind === 'project' && (
                <>
                  <span className="text-neo-red shrink-0">◆</span>
                  <span className="text-bone font-semibold">{it.label}</span>
                  {it.meta && (
                    <span className="text-bone/45 font-normal">
                      / {it.meta}
                    </span>
                  )}
                </>
              )}
              {it.kind === 'skill' && (
                <>
                  <span className="text-neo-red shrink-0">+</span>
                  <span className="text-bone/85">{it.label}</span>
                </>
              )}
              {it.kind === 'meta' && (
                <span className="text-neo-red font-semibold">{it.label}</span>
              )}
              <span className="ml-4 inline-block h-3 w-px bg-white/15" />
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
