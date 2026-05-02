import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Award, BookOpen, GraduationCap, ExternalLink } from 'lucide-react'
import SplitText from './SplitText'

type Cert = {
  id: string
  title: string
  institution: string
  platform: string
  year: string
  score: number
  outOf: number
  topics: string[]
  accent: string
  url: string
}

const certs: Cert[] = [
  {
    id: 'python',
    title: 'Joy of Computing using Python',
    institution: 'IIT Ropar',
    platform: 'NPTEL',
    year: '2024',
    score: 56,
    outOf: 100,
    topics: ['Python fundamentals', 'Practical problem solving', 'Algorithms'],
    accent: 'from-neo-red to-orange-500',
    url: 'https://drive.google.com/file/d/1zxBKuMrJqMAku_4PSr6oGvZPUmgLfX0r/view?usp=drive_link',
  },
  {
    id: 'ai-eco',
    title: 'Artificial Intelligence for Economics',
    institution: 'IIT Kharagpur',
    platform: 'NPTEL',
    year: '2024',
    score: 52,
    outOf: 100,
    topics: ['Machine learning', 'Economic modeling', 'Mathematical foundations'],
    accent: 'from-neo-blue to-cyan-400',
    url: 'https://drive.google.com/file/d/14i4uSRnd4NAp1utfIshiEZnG4ND4k6KN/view?usp=drive_link',
  },
  {
    id: 'soft-skills',
    title: 'Developing Soft Skills and Personality',
    institution: 'IIT Kanpur',
    platform: 'NPTEL',
    year: '2024',
    score: 64,
    outOf: 100,
    topics: ['Communication', 'Teamwork', 'Behavioral skills'],
    accent: 'from-emerald-400 to-teal-500',
    url: 'https://drive.google.com/file/d/12TXChLaTq2KAjvDIaCjurcz2VKXi3omj/view?usp=drive_link',
  },
]

function ScoreBar({ value, max }: { value: number; max: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const c = animate(0, value, {
      duration: 1.2,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate(v) { node.textContent = Math.floor(v).toString() },
    })
    return () => c.stop()
  }, [inView, value])

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-display text-4xl md:text-5xl font-medium text-bone tabular-nums">
          <span ref={ref}>0</span>
          <span className="text-bone/40">/{max}</span>
        </span>
      </div>
      <div className="relative h-[3px] w-full bg-white/10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-neo-red origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: value / max }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
    </div>
  )
}

export default function Certifications() {
  return (
    <section id="certifications" className="relative border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-12 gap-6 items-end mb-12">
          <div className="col-span-12 md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red flex items-center gap-3">
              <span className="h-[2px] w-8 bg-neo-red" /> § 02.5 — Certifications
            </p>
            <h2 className="mt-3 font-display text-5xl md:text-7xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
              <SplitText as="span">Certified</SplitText>{' '}
              <SplitText as="span" delay={0.15} className="font-serif italic lowercase text-neo-red">
                by the IITs.
              </SplitText>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:text-right">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">
              3 × NPTEL · 2024
            </p>
            <p className="mt-2 font-serif italic text-lg text-bone/80 max-w-xs md:ml-auto">
              "Paper trail, ratified by the people who write the textbooks."
            </p>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-3 border border-white/10">
          {certs.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden bg-ink-950/80 p-6 md:p-8 ${
                i !== certs.length - 1 ? 'md:border-r border-white/10 border-b md:border-b-0' : ''
              } ${i === certs.length - 2 ? 'border-b md:border-b-0' : ''}`}
            >
              {/* Ornamental corner marks */}
              <div className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t border-l border-bone/30" />
              <div className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-bone/30" />
              <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-bone/30" />
              <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-bone/30" />

              {/* accent glow on hover */}
              <motion.div
                className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${c.accent} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`}
              />

              {/* platform row */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
                  <Award size={12} className="text-neo-red" />
                  <span>{c.platform}</span>
                  <span className="text-bone/30">·</span>
                  <span>{c.year}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red">
                  cert · 0{i + 1}
                </span>
              </div>

              {/* Course title */}
              <h3 className="font-display text-xl md:text-2xl font-semibold uppercase tracking-tight text-bone leading-tight">
                {c.title}
              </h3>

              {/* Institution */}
              <div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">
                <GraduationCap size={12} className="text-neo-red" />
                — {c.institution}
              </div>

              {/* divider */}
              <div className="my-6 h-px bg-white/10" />

              {/* Topics */}
              <div className="mb-6">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/40 mb-2">
                  covered
                </div>
                <ul className="space-y-1 text-sm text-bone/80">
                  {c.topics.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-neo-red shrink-0">›</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Score */}
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/40 mb-2">
                  score
                </div>
                <ScoreBar value={c.score} max={c.outOf} />
              </div>

              {/* Bottom signature row */}
              <div className="mt-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-bone/40">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={10} />
                  swayam · nptel
                </span>
                <span className="text-bone/50">verified</span>
              </div>

              {/* View certificate */}
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 group/btn relative block border border-white/15 bg-ink-950/60 px-4 py-3 transition-colors hover:border-neo-red hover:bg-neo-red hover:text-ink-950"
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-bone group-hover/btn:text-ink-950 transition-colors">
                  <span>View certificate</span>
                  <ExternalLink size={12} className="transition-transform group-hover/btn:rotate-45" />
                </div>
              </a>
            </motion.article>
          ))}
        </div>

        {/* Summary footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
          <span>— all three issued through <span className="text-bone">SWAYAM / NPTEL 2024</span></span>
          <a
            href="https://nptel.ac.in"
            target="_blank"
            rel="noreferrer"
            className="text-neo-red hover:underline underline-offset-4"
          >
            nptel.ac.in ↗
          </a>
        </div>
      </div>
    </section>
  )
}
