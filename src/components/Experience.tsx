import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Award, Sparkles, ExternalLink } from 'lucide-react'
import SplitText from './SplitText'

type Item = {
  kind: 'work' | 'edu' | 'cert' | 'highlight'
  period: string
  title: string
  where: string
  bullets?: string[]
  url?: string
}

const items: Item[] = [
  {
    kind: 'work',
    period: 'Jan 2026 — Apr 2026',
    title: 'Python Developer Intern',
    where: 'AlphaWizz',
    bullets: [
      'Python backend services powering internal data workflows, API integrations and automation pipelines.',
      'FastAPI / Django modules with clean interfaces, unit tests and production-ready error handling.',
      'Code reviews, deployment processes and documentation with senior engineers.',
    ],
  },
  {
    kind: 'edu',
    period: '2022 — 2026',
    title: 'B.Tech — Computer Science (AI & ML)',
    where: 'Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore',
    bullets: ['CGPA · 7.16'],
  },
  {
    kind: 'edu',
    period: '2022',
    title: 'HSC (12th)',
    where: 'Santaji Mahavidyalaya, Nagpur',
    bullets: ['69.33%'],
  },
  {
    kind: 'edu',
    period: '2020',
    title: 'SSC (10th)',
    where: 'R.S. Mundle School, Nagpur',
    bullets: ['82.6%'],
  },
  {
    kind: 'cert',
    period: '2024',
    title: '3× NPTEL Certifications',
    where: 'IIT Ropar / Kharagpur / Kanpur',
    bullets: ['Python, AI for Economics, Soft Skills — details in § 03 Certifications.'],
  },
  {
    kind: 'highlight',
    period: '—',
    title: 'Finance Veda',
    where: 'Finalist',
  },
  {
    kind: 'highlight',
    period: '—',
    title: 'Odoo Hackathon',
    where: 'Participant',
  },
]

const icons = {
  work: Briefcase,
  edu: GraduationCap,
  cert: Award,
  highlight: Sparkles,
}

const labels: Record<Item['kind'], string> = {
  work: 'experience',
  edu: 'education',
  cert: 'certification',
  highlight: 'highlight',
}

export default function Experience() {
  return (
    <section id="experience" className="relative border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="col-span-12 md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red flex items-center gap-3">
              <span className="h-[2px] w-8 bg-neo-red" /> § 02 — Résumé
            </p>
            <h2 className="mt-3 font-display text-5xl md:text-7xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
              <SplitText as="span">The paper</SplitText>{' '}
              <SplitText as="span" delay={0.18} className="font-serif italic lowercase text-neo-red">
                trail.
              </SplitText>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 md:pt-14">
            <p className="font-serif italic text-xl md:text-2xl text-bone/85 leading-snug max-w-xl">
              Experience, education and a few small wins — written out like a
              proper résumé, just in case the code doesn't do the talking.
            </p>
            <a
              href="/DevCV3.33.pdf"
              download
              className="mt-6 inline-flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-bone hover:border-neo-red hover:text-neo-red transition-colors"
            >
              ↓ Download PDF
            </a>
          </div>
        </div>

        <div className="relative">
          {/* timeline rail */}
          <div className="absolute left-[18px] md:left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-neo-red via-white/20 to-transparent" />

          <ol className="space-y-3">
            {items.map((it, i) => {
              const Icon = icons[it.kind]
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="group relative pl-12 md:pl-16"
                >
                  <div className="absolute left-0 top-2 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center border border-white/15 bg-ink-950 text-bone/70 group-hover:border-neo-red group-hover:text-neo-red group-hover:bg-neo-red/10 transition-colors">
                    <Icon size={14} />
                  </div>

                  <div className="border border-white/10 bg-ink-950/60 backdrop-blur-sm p-5 md:p-6 transition-colors group-hover:border-white/25">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neo-red">
                        {labels[it.kind]}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">
                        {it.period}
                      </div>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-medium text-bone leading-tight">
                      {it.title}
                    </h3>
                    <div className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-bone/60">
                      — {it.where}
                    </div>
                    {it.bullets && (
                      <ul className="mt-3 space-y-1.5 text-sm text-bone/75 leading-relaxed">
                        {it.bullets.map((b, bi) => (
                          <li key={bi} className="flex gap-2">
                            <span className="text-neo-red shrink-0">›</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {it.url && (
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-neo-red hover:text-neo-red-2 hover:underline underline-offset-4"
                      >
                        <ExternalLink size={11} />
                        View credential
                      </a>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
