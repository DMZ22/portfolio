import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Github, ArrowUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { projects, type Project } from '../data/projects'
import Spotlight from './Spotlight'
import SplitText from './SplitText'
import { playHorn, playClick, playTick } from '../lib/sounds'

const categories = ['All', 'AI/ML', 'FinTech', 'Full-Stack', 'Data Science'] as const
type Cat = (typeof categories)[number]

function ProjectRow({ p, i }: { p: Project; i: number }) {
  const [hover, setHover] = useState(false)
  const primaryHref = p.live || p.github

  return (
    <motion.div
      onMouseEnter={() => { setHover(true); playTick() }}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: i * 0.05 }}
      className="group relative block border-b border-white/10 py-8 md:py-10 transition-colors"
    >
      {primaryHref && (
        <a
          href={primaryHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => playHorn()}
          aria-label={`Open ${p.title}`}
          className="absolute inset-0 z-10"
        />
      )}
      {/* red sweep */}
      <motion.div
        className="absolute inset-0 origin-left bg-gradient-to-r from-neo-red/20 via-neo-red/5 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hover ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ zIndex: 0 }}
      />

      <div className="relative grid grid-cols-12 gap-4 items-start">
        <div className="col-span-2 md:col-span-1 font-mono text-xs md:text-sm text-bone/40 pt-2">
          {String(i + 1).padStart(2, '0')}
        </div>

        <div className="col-span-10 md:col-span-5">
          <div className="flex items-center gap-3">
            <motion.h3
              className="font-display text-3xl md:text-5xl font-medium uppercase tracking-tight text-bone"
              animate={{ x: hover ? 8 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {p.title}
            </motion.h3>
            {p.featured && (
              <span className="inline-block h-2 w-2 bg-neo-red" />
            )}
          </div>
          <p className="mt-2 font-serif italic text-lg md:text-xl text-bone/70">
            {p.tagline}
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 md:pl-4">
          <p className="text-sm text-bone/70 leading-relaxed line-clamp-3 md:line-clamp-4">
            {p.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50">
            {p.tech.slice(0, 5).map((t) => (
              <span key={t}>/ {t}</span>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-2 flex md:flex-col md:items-end md:text-right gap-4">
          <div className="flex-1 md:flex-none">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neo-red">
              {p.category}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50 mt-1">
              {p.year}
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 text-bone/70 group-hover:text-neo-red"
            animate={{ x: hover ? 6 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {p.github && !p.live && <Github size={18} />}
            <ArrowUpRight size={22} className="transition-transform group-hover:rotate-45" />
          </motion.div>
        </div>
      </div>

      {/* secondary links */}
      {(p.github && p.live) && (
        <div className="relative z-20 mt-4 flex gap-4 pl-2 md:pl-[8.33%] font-mono text-[10px] uppercase tracking-[0.25em]">
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="text-bone/60 hover:text-bone inline-flex items-center gap-1.5"
          >
            <Github size={12} /> Source
          </a>
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              className="text-neo-red hover:text-neo-red-2 inline-flex items-center gap-1.5"
            >
              Live deploy ↗
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default function Projects() {
  const [cat, setCat] = useState<Cat>('All')
  const filtered = cat === 'All' ? projects : projects.filter((p) => p.category === cat)

  // mouse-follow "VIEW →" label
  const listRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(-9999)
  const my = useMotionValue(-9999)
  const smx = useSpring(mx, { stiffness: 500, damping: 32 })
  const smy = useSpring(my, { stiffness: 500, damping: 32 })
  const [hovering, setHovering] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    const el = listRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  return (
    <section id="projects" className="relative py-28 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red">
              § 02 — Selected Work
            </p>
            <h2 className="mt-3 font-display text-5xl md:text-7xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
              <SplitText as="span">Things I built</SplitText>
              <br />
              <SplitText as="span" className="font-serif italic text-neo-red lowercase" delay={0.18}>
                that ship.
              </SplitText>
            </h2>
          </div>
          <div className="flex flex-wrap gap-1 border border-white/10 p-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setCat(c); playClick() }}
                className={`relative font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-2 transition-colors ${
                  cat === c ? 'text-ink-950' : 'text-bone/60 hover:text-bone'
                }`}
              >
                {cat === c && (
                  <motion.span
                    layoutId="catPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 bg-neo-red"
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <Spotlight className="border-t border-white/10" color="rgba(255, 170, 80, 0.18)" size={560}>
          <div
            ref={listRef}
            onMouseMove={onMove}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => { setHovering(false); mx.set(-9999); my.set(-9999) }}
            className="relative"
          >
            {filtered.map((p, i) => (
              <ProjectRow key={p.slug} p={p} i={i} />
            ))}
            <motion.div
              className="pointer-events-none absolute z-30 font-display font-bold uppercase tracking-tight text-ink-950 bg-neo-red px-4 py-2 text-sm origin-center"
              style={{
                x: smx,
                y: smy,
                translateX: '-50%',
                translateY: '-50%',
              }}
              animate={{ scale: hovering ? 1 : 0, opacity: hovering ? 1 : 0 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              View <span className="ml-1">→</span>
            </motion.div>
          </div>
        </Spotlight>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/60">
          <span>— end of list —</span>
          <a
            href="https://github.com/DMZ22"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-bone hover:text-neo-red"
          >
            <Github size={14} /> Full archive on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  )
}
