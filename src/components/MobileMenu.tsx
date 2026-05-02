import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Menu, X, Github, Linkedin, Mail, Download } from 'lucide-react'
import { playClick } from '../lib/sounds'

const items = [
  { id: 'home',           n: '00', label: 'Home' },
  { id: 'about',          n: '01', label: 'About' },
  { id: 'experience',     n: '02', label: 'Résumé' },
  { id: 'certifications', n: '03', label: 'Certs' },
  { id: 'projects',       n: '04', label: 'Work' },
  { id: 'quant',          n: '05', label: 'Quant' },
  { id: 'galaxy',         n: '06', label: 'Orbit' },
  { id: 'skills',         n: '07', label: 'Stack' },
  { id: 'terminal',       n: '08', label: 'Shell' },
  { id: 'vault',          n: '09', label: 'Vault' },
  { id: 'contact',        n: '10', label: 'Contact' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        onClick={() => { setOpen(true); playClick() }}
        aria-label="Open menu"
        className="md:hidden flex h-9 w-9 items-center justify-center border border-white/15 text-bone/80 hover:border-neo-red hover:text-neo-red transition-colors"
      >
        <Menu size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] md:hidden"
          >
            <div className="absolute inset-0 bg-ink-950/90 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative flex h-full flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red">Menu</span>
                <button
                  onClick={() => { setOpen(false); playClick() }}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center border border-white/15 text-bone hover:border-neo-red hover:text-neo-red"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6">
                <ul className="space-y-0">
                  {items.map((it, i) => (
                    <motion.li
                      key={it.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.03 }}
                    >
                      <a
                        href={`#${it.id}`}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline justify-between border-b border-white/10 py-4 transition-colors hover:border-neo-red"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-xs text-neo-red">{it.n}</span>
                          <span className="font-display text-2xl uppercase tracking-tight text-bone group-hover:text-neo-red transition-colors">
                            {it.label}
                          </span>
                        </div>
                        <span className="font-mono text-lg text-bone/40 group-hover:text-neo-red group-hover:translate-x-1 transition-all">→</span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-white/10 px-6 py-5 space-y-3">
                <a
                  href="/DevCV3.2.pdf"
                  download
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-neo-red px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-ink-950"
                >
                  <Download size={14} />
                  Download Résumé
                </a>
                <div className="flex gap-2">
                  <a
                    href="mailto:devashishmoghe@gmail.com"
                    onClick={() => setOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 border border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-bone hover:border-neo-red hover:text-neo-red"
                  >
                    <Mail size={12} /> Email
                  </a>
                  <a
                    href="https://github.com/DMZ22"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 border border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-bone hover:border-neo-red hover:text-neo-red"
                  >
                    <Github size={12} /> GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/devashish-moghe-b5b959341/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 border border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-bone hover:border-neo-red hover:text-neo-red"
                  >
                    <Linkedin size={12} /> In
                  </a>
                </div>
                <div className="pt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-bone/40 text-center">
                  — Devashish / 2026 —
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
