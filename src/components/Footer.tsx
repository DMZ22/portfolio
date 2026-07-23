import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { BrandSeal } from './BrandMark'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-950/40 backdrop-blur-sm overflow-hidden">
      {/* motto strip */}
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-10 border-b border-white/10 pb-12">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neo-red mb-4">
              — the motto
            </p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="font-serif text-4xl md:text-6xl italic leading-[0.95] text-bone"
            >
              "Keep on keeping<br />
              <span className="text-neo-red">on.</span>"
            </motion.p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/70">
              — Devashish / 2026
            </p>
          </div>
          <div className="text-neo-red">
            <BrandSeal size={160} reverse />
          </div>
        </div>
      </div>

      {/* giant signature wordmark */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-[22vw] md:text-[16vw] font-medium uppercase tracking-tightest leading-[0.82] text-bone"
        >
          Devashish<span className="text-neo-red">.</span>
        </motion.h3>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/70">
          <div>
            © {new Date().getFullYear()} Devashish Moghe · built by hand with React, Tailwind &amp; Three.js
          </div>
          <div className="flex items-center gap-4">
            <span>v1.0.0 / {new Date().getFullYear()}</span>
            <motion.a
              href="#home"
              whileHover={{ y: -3 }}
              className="flex items-center gap-1.5 border border-white/10 px-3 py-1.5 hover:border-neo-red hover:text-neo-red"
            >
              <ArrowUp size={11} /> Top
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  )
}
