import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { playClick, playTick } from '../lib/sounds'

type Kind = 'in' | 'out' | 'ok' | 'err' | 'accent'
type Line = { kind: Kind; text: string }

const PROMPT = 'dev@moghe:~$'

const BOOT: Line[] = [
  { kind: 'out', text: `${PROMPT} ./portfolio --boot` },
  { kind: 'out', text: 'mounting /skills ............ OK' },
  { kind: 'out', text: 'mounting /projects .......... OK' },
  { kind: 'out', text: 'importing caffeine .......... OK' },
  { kind: 'ok', text: 'handshake complete — type `help` to explore.' },
]

const NEOFETCH = [
  '      ▄▄▄▄▄▄▄▄        dev@moghe',
  '    ▄█▀▀    ▀▀█▄      ─────────────────────────',
  '   ██   ▄██▄   ██     os        portfolio v3.4',
  '   ██   ▀██▀   ██     role      backend · ai/ml · full-stack',
  '   ██          ██     lang      python · typescript · sql',
  '    ▀█▄▄    ▄▄█▀      ml        pytorch · xgboost · lstm',
  '      ▀▀▀▀▀▀▀▀        cloud     azure · vercel · render',
  '                      editor    vs code · dark, obviously',
  '   ★ ★ ★ ★            uptime    4+ years of shipping',
]

const commands: Record<string, string | string[]> = {
  help: [
    'available commands:',
    '  whoami      — profile',
    '  neofetch    — system card',
    '  skills      — tech stack',
    '  projects    — featured work',
    '  certs       — certifications',
    '  contact     — reach out',
    '  resume      — open the CV (pdf)',
    '  email       — open email client',
    '  socials     — github / linkedin',
    '  uptime      — since coding',
    '  ls          — look around',
    '  clear       — wipe terminal',
    'hint: try `sudo hire-me`.',
  ],
  whoami: [
    'Devashish Moghe · developer',
    'cs undergrad (AI & ML, 2022–2026) · python dev intern @ AlphaWizz',
    'backend · full-stack · ai/ml · fintech',
    'india / remote',
  ],
  neofetch: NEOFETCH,
  skills: [
    'python · typescript · sql',
    'django · fastapi · react · next.js',
    'pytorch · xgboost · lightgbm · lstm · cnn · opencv',
    'postgres · redis · docker · azure · vercel',
    'gemini · openai · streamlit',
  ],
  projects: [
    '01  finsentry           — AML anomaly detection · explainable alerts',
    '02  mediscan-ai         — clinical ai · 70k CDC records',
    '03  stock-trader-pro    — django · 230+ symbols',
    '04  visionquant         — chart-vision trading',
    '05  quest-ai            — gamified habits (PWA)',
    '06  stock-predictor-pro — 90+ assets · live signals',
    '07  customer-churn      — SQL → ML → API → UI',
    '08  phantom             — django + tmdb booking',
    '09  novelnest           — book discovery + AI stories',
    '10  smart-money-tracker — fastapi + numpy insights',
    'full detail cards in § 02 — projects. each has a PDF report.',
  ],
  certs: [
    'NPTEL 2024   joy of computing (IIT Ropar)',
    'NPTEL 2024   AI for economics (IIT Kharagpur)',
    'NPTEL 2024   soft skills (IIT Kanpur)',
    'ORACLE 2025  OCI generative AI professional — valid to 2027',
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
  ls: [
    'projects/   skills/   certs/   resume.pdf   .secrets',
  ],
  '.secrets': ['nice try. `sudo hire-me` is the only backdoor.'],
  'cat .secrets': ['nice try. `sudo hire-me` is the only backdoor.'],
  'cat resume.pdf': ['binary file. use `resume` to open it like a civilised being.'],
  uptime: '~ 4 years. ship counter increases daily.',
  email: 'opening email client...',
  resume: 'opening DevCV3.4.pdf ...',
  'sudo hire-me': [
    '[sudo] password for recruiter: ********',
    'access granted.',
    'drafting email to devashishmoghe@gmail.com ...',
  ],
}

const actions: Record<string, () => void> = {
  resume: () => window.open('/DevCV3.4.pdf', '_blank'),
  email: () => { window.location.href = 'mailto:devashishmoghe@gmail.com' },
  'sudo hire-me': () => { window.location.href = 'mailto:devashishmoghe@gmail.com?subject=You%27re%20hired' },
}

const okCommands = new Set(['sudo hire-me'])

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([])
  const [booted, setBooted] = useState(false)
  const [input, setInput] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // staggered boot sequence, fired once when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || booted) return
      setBooted(true)
      BOOT.forEach((l, i) => {
        setTimeout(() => setLines((prev) => [...prev, l]), 260 * i + 200)
      })
      io.disconnect()
    }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [booted])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  // ghost autocomplete hint
  const base = input.trim().toLowerCase()
  const match = base ? Object.keys(commands).find((k) => k.startsWith(base) && k !== base) : undefined
  const ghost = match ? match.slice(base.length) : ''

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    const next: Line[] = [...lines, { kind: 'in', text: `${PROMPT} ${raw}` }]

    if (!cmd) { setLines(next); return }
    if (cmd === 'clear' || cmd === 'cls') { setLines([]); return }

    const out = commands[cmd]
    if (out === undefined) {
      const near = Object.keys(commands).find((k) => k.startsWith(cmd.slice(0, 2)))
      next.push({ kind: 'err', text: `command not found: ${cmd}` })
      next.push({ kind: 'out', text: near ? `did you mean \`${near}\`? or try \`help\`.` : 'try `help`.' })
    } else {
      const kind: Kind = okCommands.has(cmd) ? 'ok' : 'out'
      if (Array.isArray(out)) for (const line of out) next.push({ kind, text: line })
      else next.push({ kind, text: out })
    }
    if (actions[cmd]) { try { actions[cmd]() } catch { /* popup blocked — output already shown */ } }
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
    } else if (e.key === 'Tab' || (e.key === 'ArrowRight' && ghost && (e.target as HTMLInputElement).selectionStart === input.length)) {
      if (match) { e.preventDefault(); setInput(match); playTick() }
      else if (e.key === 'Tab') e.preventDefault()
    }
  }

  const color = (k: Kind) =>
    k === 'in' ? 'text-bone'
    : k === 'ok' ? 'text-emerald-400'
    : k === 'err' ? 'text-neo-red'
    : k === 'accent' ? 'text-neo-yellow'
    : 'text-bone/80'

  return (
    <section id="terminal" ref={sectionRef} className="relative border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neo-red">
              § 04.5 — Terminal
            </p>
            <h2 className="mt-3 font-display text-5xl md:text-6xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
              Talk to the <span className="font-serif italic text-neo-red">shell.</span>
            </h2>
            <p className="mt-5 max-w-sm text-bone/85 text-sm leading-relaxed">
              Old-school interface for those who prefer keys to buttons. Try{' '}
              <code className="font-mono text-neo-red">neofetch</code>,{' '}
              <code className="font-mono text-neo-red">projects</code>,{' '}
              <code className="font-mono text-neo-red">sudo hire-me</code>.
            </p>
            <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/65 space-y-1">
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
            className="col-span-12 md:col-span-8 relative overflow-hidden rounded-md border border-white/15 bg-[#050508] shadow-[0_0_60px_rgba(255,36,71,0.07),0_25px_60px_rgba(0,0,0,0.6)] font-mono text-sm"
          >
            {/* header bar */}
            <div className="relative flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-neo-red/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/65">
                dev@moghe — portfolio.sh
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-bone/70">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                zsh
              </div>
            </div>

            {/* body */}
            <div ref={bodyRef} className="h-[380px] overflow-y-auto p-5 space-y-1 leading-relaxed">
              {lines.map((l, i) => (
                <div key={i} className={`${color(l.kind)} whitespace-pre-wrap`}>
                  {l.text}
                </div>
              ))}
              {/* input row */}
              <div className="flex items-center gap-2 text-bone">
                <span className="text-neo-red shrink-0">{PROMPT}</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKey}
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="terminal input"
                    className="w-full bg-transparent outline-none caret-transparent"
                    placeholder="type `help`"
                  />
                  {/* ghost autocomplete + block cursor */}
                  <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre">
                    <span className="invisible">{input}</span>
                    <span className="text-bone/30">{input ? ghost : ''}</span>
                    <span className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[2px] bg-neo-red/80 animate-blink" />
                  </div>
                </div>
              </div>
            </div>

            {/* CRT scanlines + vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)' }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
