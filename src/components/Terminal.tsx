import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { playClick, playTick } from '../lib/sounds'

type Line = { kind: 'in' | 'out'; text: string }

const WELCOME: Line[] = [
  { kind: 'out', text: 'devashish@moghe:~$ portfolio --boot' },
  { kind: 'out', text: "loading modules ... OK" },
  { kind: 'out', text: "handshake complete — type `help` to explore." },
]

const commands: Record<string, string | string[]> = {
  help: [
    'available commands:',
    '  whoami      — profile',
    '  skills      — tech stack',
    '  projects    — featured work',
    '  contact     — reach out',
    '  resume      — open resume',
    '  email       — open email client',
    '  socials     — github / linkedin',
    '  uptime      — since coding',
    '  clear       — wipe terminal',
  ],
  whoami: [
    'Devashish Moghe · developer',
    'cs undergrad (AI & ML) · python dev intern @ AlphaWizz',
    'backend · full-stack · ai/ml · fintech',
    'india / remote',
  ],
  skills: [
    'python · typescript · sql',
    'django · fastapi · react · next.js',
    'pytorch · xgboost · lightgbm · lstm · cnn · opencv',
    'postgres · redis · docker · azure · vercel',
    'gemini · openai · streamlit',
  ],
  projects: [
    '01  stock-trader-pro    — django · 230+ symbols',
    '02  mediscan-ai         — clinical ai · 70k CDC',
    '03  visionquant         — chart-vision trading',
    '04  quest-ai            — gamified habits (PWA)',
    '05  customer-churn      — SQL → ML → API → UI',
    '06  phantom             — django + tmdb',
    '07  stock-price-dash    — lstm signals',
    '08  smart-money-tracker — fastapi + numpy insights',
  ],
  contact: [
    'email       devashishmoghe@gmail.com',
    'github      github.com/DMZ22',
    'linkedin    /in/devashish-moghe',
  ],
  socials: [
    'github.com/DMZ22',
    'linkedin.com/in/devashish-moghe-b5b959341',
  ],
  uptime: '~ 4 years. ship counter increases daily.',
  email: 'opening email client...',
}

const actions: Record<string, () => void> = {
  resume: () => window.open('/DevCV3.2.pdf', '_blank'),
  email: () => { window.location.href = 'mailto:devashishmoghe@gmail.com' },
  socials: () => {/* shown as text */},
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(WELCOME)
  const [input, setInput] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [lines])

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    const next: Line[] = [...lines, { kind: 'in', text: `devashish@moghe:~$ ${raw}` }]

    if (!cmd) {
      setLines(next)
      return
    }
    if (cmd === 'clear' || cmd === 'cls') {
      setLines([])
      return
    }
    const out = commands[cmd]
    if (out === undefined) {
      next.push({ kind: 'out', text: `command not found: ${cmd}. try \`help\`.` })
    } else if (Array.isArray(out)) {
      for (const line of out) next.push({ kind: 'out', text: line })
    } else {
      next.push({ kind: 'out', text: out })
    }
    if (actions[cmd]) {
      try { actions[cmd]() } catch {}
    }
    setLines(next)
    setHist((h) => [...h, raw])
    setHIdx(-1)
    playClick()
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (hist.length === 0) return
      const idx = hIdx < 0 ? hist.length - 1 : Math.max(0, hIdx - 1)
      setHIdx(idx); setInput(hist[idx])
      playTick()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hist.length === 0 || hIdx < 0) return
      const idx = hIdx + 1
      if (idx >= hist.length) { setHIdx(-1); setInput('') }
      else { setHIdx(idx); setInput(hist[idx]) }
      playTick()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const base = input.trim().toLowerCase()
      const match = Object.keys(commands).find((k) => k.startsWith(base))
      if (match) setInput(match)
    }
  }

  return (
    <section id="terminal" className="relative border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red">
              § 04.5 — Terminal
            </p>
            <h2 className="mt-3 font-display text-5xl md:text-6xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
              Talk to the <span className="font-serif italic text-neo-red">shell.</span>
            </h2>
            <p className="mt-5 max-w-sm text-bone/70 text-sm leading-relaxed">
              Old-school interface for those who prefer keys to buttons. Try{' '}
              <code className="font-mono text-neo-red">help</code>,{' '}
              <code className="font-mono text-neo-red">projects</code>,{' '}
              <code className="font-mono text-neo-red">resume</code>.
            </p>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50 space-y-1">
              <div>↑ / ↓ &nbsp;→ history</div>
              <div>Tab &nbsp; &nbsp; &nbsp;→ autocomplete</div>
              <div>clear &nbsp; &nbsp;→ wipe</div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            onClick={() => inputRef.current?.focus()}
            className="col-span-12 md:col-span-8 relative overflow-hidden border border-white/15 bg-ink-950/90 shadow-2xl font-mono text-sm"
          >
            {/* header bar */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-neo-red" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
                devashish@moghe — portfolio.sh
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
                bash
              </div>
            </div>

            {/* body */}
            <div className="h-[360px] overflow-y-auto p-5 space-y-1 leading-relaxed">
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={l.kind === 'in' ? 'text-bone' : 'text-bone/70 whitespace-pre-wrap'}
                >
                  {l.text}
                </div>
              ))}
              {/* input row */}
              <div className="flex items-center gap-2 text-bone">
                <span className="text-neo-red">devashish@moghe:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  spellCheck={false}
                  autoComplete="off"
                  className="flex-1 bg-transparent outline-none caret-neo-red"
                  placeholder="type `help`"
                />
              </div>
              <div ref={endRef} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
