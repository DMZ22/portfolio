import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Search, ArrowRight, Command } from 'lucide-react'
import { projects } from '../data/projects'
import { playClick, playTick } from '../lib/sounds'

type Item = {
  id: string
  title: string
  hint: string
  kind: 'section' | 'project' | 'link' | 'action'
  go: () => void
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform)

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  const items: Item[] = useMemo(() => {
    const go = (id: string) => () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
    const open_ = (url: string) => () => {
      window.open(url, '_blank', 'noopener')
      setOpen(false)
    }
    const sections: Item[] = [
      { id: 'home', title: 'Go to Home', hint: '§ 00 — Top', kind: 'section', go: go('home') },
      { id: 'about', title: 'Go to About', hint: '§ 01 — Who I am', kind: 'section', go: go('about') },
      { id: 'experience', title: 'Go to Résumé', hint: '§ 02 — Experience & education', kind: 'section', go: go('experience') },
      { id: 'certifications', title: 'Go to Certifications', hint: '§ 02.5 — NPTEL × 3', kind: 'section', go: go('certifications') },
      { id: 'projects', title: 'Go to Work', hint: '§ 03 — Selected projects', kind: 'section', go: go('projects') },
      { id: 'quant', title: 'Go to Quant Zone', hint: '§ 03.5 — Candles', kind: 'section', go: go('quant') },
      { id: 'galaxy', title: 'Go to Skills Galaxy', hint: '§ 04 — 3D orbit', kind: 'section', go: go('galaxy') },
      { id: 'skills', title: 'Go to Stack', hint: '§ 04 — Toolkit', kind: 'section', go: go('skills') },
      { id: 'terminal', title: 'Go to Terminal', hint: '§ 05 — Shell', kind: 'section', go: go('terminal') },
      { id: 'vault', title: 'Go to Vault', hint: '§ 05.5 — Badges', kind: 'section', go: go('vault') },
      { id: 'contact', title: 'Go to Contact', hint: '§ 06 — Reach out', kind: 'section', go: go('contact') },
    ]
    const p: Item[] = projects.map((p) => ({
      id: p.slug,
      title: p.title,
      hint: `${p.category} · ${p.year}`,
      kind: 'project',
      go: open_(p.live || p.github || '#'),
    }))
    const links: Item[] = [
      { id: 'resume', title: 'Download Résumé', hint: 'DevCV3.2.pdf', kind: 'action', go: () => { const a = document.createElement('a'); a.href = '/DevCV3.2.pdf'; a.download = 'DevashishMoghe_CV.pdf'; a.click(); setOpen(false) } },
      { id: 'email', title: 'Send email', hint: 'devashishmoghe@gmail.com', kind: 'link', go: () => { window.location.href = 'mailto:devashishmoghe@gmail.com'; setOpen(false) } },
      { id: 'gh', title: 'Open GitHub', hint: '@DMZ22', kind: 'link', go: open_('https://github.com/DMZ22') },
      { id: 'li', title: 'Open LinkedIn', hint: '/devashish-moghe', kind: 'link', go: open_('https://www.linkedin.com/in/devashish-moghe-b5b959341/') },
      { id: 'copy-email', title: 'Copy email to clipboard', hint: 'devashishmoghe@gmail.com', kind: 'action', go: () => { navigator.clipboard?.writeText('devashishmoghe@gmail.com').catch(() => {}); flash('Email copied to clipboard'); setOpen(false) } },
    ]
    return [...sections, ...p, ...links]
  }, [])

  const results = useMemo(() => {
    if (!q.trim()) return items
    const needle = q.toLowerCase()
    return items.filter((it) =>
      it.title.toLowerCase().includes(needle) || it.hint.toLowerCase().includes(needle),
    )
  }, [items, q])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = isMac ? e.metaKey : e.ctrlKey
      if ((mod && e.key.toLowerCase() === 'k') || (!open && e.key === '/')) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
        e.preventDefault()
        setOpen((o) => !o)
        playClick()
      } else if (e.key === 'Escape') {
        if (open) {
          e.preventDefault()
          setOpen(false)
        }
      } else if (open) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setI((v) => Math.min(v + 1, results.length - 1))
          playTick()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setI((v) => Math.max(v - 1, 0))
          playTick()
        } else if (e.key === 'Enter') {
          e.preventDefault()
          results[i]?.go()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, i, isMac])

  useEffect(() => {
    setI(0)
  }, [q])

  return (
    <>
      {/* Floating hint */}
      <button
        onClick={() => { setOpen(true); playClick() }}
        className="fixed bottom-5 left-5 z-40 group hidden md:flex items-center gap-2 border border-white/15 bg-ink-950/80 backdrop-blur px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/70 hover:border-neo-red hover:text-neo-red transition-colors"
        aria-label="Open command palette"
      >
        <Search size={12} />
        Search
        <kbd className="ml-2 border border-white/15 px-1.5 py-0.5 text-[9px] font-medium">
          {isMac ? '⌘' : 'CTRL'} K
        </kbd>
      </button>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 border border-neo-red bg-ink-950 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-bone shadow-[0_0_24px_-6px_#ff2447]"
            role="status"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neo-red animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-start justify-center pt-[14vh] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="absolute inset-0 bg-ink-950/70 backdrop-blur"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.96, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: -10 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative w-full max-w-xl border border-white/15 bg-ink-900 shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <Command size={14} className="text-neo-red" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search sections, projects, links…"
                  className="flex-1 bg-transparent outline-none font-display text-bone placeholder:text-bone/30"
                />
                <kbd className="border border-white/15 px-1.5 py-0.5 font-mono text-[9px] uppercase text-bone/50">
                  ESC
                </kbd>
              </div>

              <ul className="max-h-[48vh] overflow-y-auto py-2">
                {results.length === 0 && (
                  <li className="px-4 py-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-bone/40">
                    no matches
                  </li>
                )}
                {results.map((it, idx) => (
                  <li key={it.id}>
                    <button
                      onClick={it.go}
                      onMouseEnter={() => setI(idx)}
                      className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left transition-colors ${
                        i === idx ? 'bg-neo-red text-ink-950' : 'text-bone/90 hover:bg-white/5'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-display text-sm truncate">{it.title}</div>
                        <div
                          className={`font-mono text-[10px] uppercase tracking-[0.2em] truncate ${
                            i === idx ? 'text-ink-950/70' : 'text-bone/40'
                          }`}
                        >
                          {it.kind} · {it.hint}
                        </div>
                      </div>
                      <ArrowRight size={14} className="shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.25em] text-bone/40">
                <span>
                  <kbd className="border border-white/15 px-1">↑</kbd>{' '}
                  <kbd className="border border-white/15 px-1">↓</kbd> navigate
                </span>
                <span>
                  <kbd className="border border-white/15 px-1">⏎</kbd> select
                </span>
                <span>{results.length} results</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
