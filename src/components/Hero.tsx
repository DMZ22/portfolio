import { motion, useScroll, useTransform } from 'framer-motion'
import { Suspense, lazy, useRef } from 'react'
import { ArrowUpRight, Github, Linkedin, Download } from 'lucide-react'
import Magnetic from './Magnetic'
import Scribble from './Scribble'
import Typewriter from './Typewriter'

const R3FHeroBG = lazy(() => import('./R3FHeroBG'))

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-24 pb-10 overflow-hidden"
    >
      {/* 3D particle layer */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-90">
        <Suspense fallback={null}>
          <R3FHeroBG />
        </Suspense>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-white/10 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
          <div><span className="text-neo-red">001</span> — Portfolio</div>
          <div><span className="text-neo-red">EST</span> — 2026</div>
          <div><span className="text-neo-red">LOC</span> — India / Remote</div>
          <div className="text-right"><span className="text-neo-red">REV</span> — v1.0.0</div>
        </div>
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-12"
      >
        <div className="grid grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-8"
          >
            <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-bone/60">
              <span className="h-[2px] w-8 bg-neo-red" />
              India — B.Tech CSE (AI & ML)
            </p>

            <h1 className="font-display font-medium uppercase tracking-tightest leading-[0.85] text-bone">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                className="block text-6xl sm:text-7xl md:text-8xl lg:text-[10rem]"
              >
                Devashish
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                className="block text-6xl sm:text-7xl md:text-8xl lg:text-[10rem]"
              >
                <span className="text-neo-red">Moghe</span>
                <span className="inline-block font-serif italic text-bone text-3xl md:text-5xl lg:text-6xl ml-4 -translate-y-6">
                  — builds things.
                </span>
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-8 max-w-xl"
            >
              <p className="font-mono text-sm md:text-base text-bone/80 mb-5">
                <span className="text-neo-red mr-2">{'>'}</span>
                role:{' '}
                <Typewriter
                  className="text-bone"
                  words={[
                    'Software Engineer',
                    'Backend Developer',
                    'AI / ML Engineer',
                    'Full-Stack Developer',
                    'CS Student',
                  ]}
                />
              </p>
              <p className="text-lg md:text-xl text-bone/85 leading-snug">
                I build{' '}
                <span className="relative inline-block">
                  <span className="underline-red">end-to-end</span>
                  <Scribble
                    variant="underline"
                    className="-bottom-2 left-0 w-full h-3"
                    delay={1.4}
                  />
                </span>{' '}
                software — trained models, REST APIs, dashboards, web platforms.
                Currently interning as a Python developer, studying AI / ML,
                and spending most nights shipping side projects that live in
                production.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-3 bg-neo-red px-6 py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-ink-950 transition-transform hover:-translate-y-0.5"
                >
                  See the work
                  <ArrowUpRight
                    size={18}
                    className="transition-transform group-hover:rotate-45"
                  />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-3 border border-white/20 bg-ink-950/60 backdrop-blur px-6 py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:border-neo-red hover:text-neo-red"
                >
                  Contact
                  <span className="text-xs font-mono normal-case tracking-normal opacity-70">
                    ↓ 05
                  </span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="/DevCV3.33.pdf"
                  download
                  className="group inline-flex items-center gap-3 border border-white/20 bg-ink-950/60 backdrop-blur px-6 py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:border-neo-red hover:text-neo-red"
                >
                  <Download size={16} />
                  Resume
                </a>
              </Magnetic>
              <div className="flex items-center gap-1 border border-white/10 bg-ink-950/60 backdrop-blur p-1">
                <a
                  href="https://github.com/DMZ22"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 text-bone/70 transition-colors hover:text-bone hover:bg-white/5"
                  aria-label="GitHub"
                >
                  <Github size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/in/devashish-moghe-b5b959341/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 text-bone/70 transition-colors hover:text-bone hover:bg-white/5"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="col-span-12 md:col-span-4 md:border-l md:border-white/10 md:pl-6 flex flex-col justify-between gap-8"
          >
            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
                Currently shipping
              </p>
              <p className="mt-3 font-serif text-2xl italic leading-snug text-bone">
                "A trading engine that reads chart images like a human — built,
                shipped, live."
              </p>
              <a
                href="#projects"
                className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-neo-red hover:underline"
              >
                → Stock Trader Pro
              </a>
              <Scribble
                variant="arrow"
                className="-left-16 top-0 w-14 h-20 hidden md:block"
                delay={1.6}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <div className="font-display text-3xl font-semibold text-bone">
                  10<span className="text-neo-red">+</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50 mt-1">
                  shipped
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold text-bone">
                  6<span className="text-neo-red">+</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50 mt-1">
                  domains
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold text-bone">
                  4<span className="text-neo-red">y</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50 mt-1">
                  coding
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
          <span>Scroll ↓</span>
          <span className="hidden sm:block">BACKEND · WEB · AI/ML · FINTECH · DATA</span>
          <span>2026 — ∞</span>
        </div>
      </div>
    </section>
  )
}
