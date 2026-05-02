import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import SplitText from './SplitText'
import Scribble from './Scribble'

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate(v) { node.textContent = Math.floor(v).toString() + suffix },
    })
    return () => controls.stop()
  }, [inView, to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

const facts = [
  { k: 'Backend', v: 'Django, FastAPI, Node' },
  { k: 'ML / AI', v: 'XGBoost, PyTorch, LSTM, CNN' },
  { k: 'Frontend', v: 'React, Next.js, Tailwind' },
  { k: 'Data', v: 'SQL, Pandas, Streamlit' },
  { k: 'Ops', v: 'Docker, Azure, Vercel, Render' },
  { k: 'Design', v: 'Figma, motion, UX polish' },
]

export default function About() {
  return (
    <section id="about" className="relative py-28 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-12 md:col-span-4"
          >
            <div className="sticky top-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red">
                § 01 — About
              </p>
              <h2 className="mt-4 font-display text-5xl md:text-6xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
                <SplitText as="span">The short</SplitText>{' '}
                <span className="relative inline-block">
                  <SplitText as="span" className="font-serif italic text-neo-red lowercase" delay={0.15}>
                    version.
                  </SplitText>
                  <Scribble
                    variant="underline"
                    className="-bottom-3 left-0 w-full h-4"
                    delay={0.9}
                  />
                </span>
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="col-span-12 md:col-span-8"
          >
            <p className="font-serif text-3xl md:text-4xl italic leading-tight text-bone/90">
              CS undergrad at Shri Vaishnav Vidyapeeth, Indore (AI & ML track).
              Python developer intern. Code across the stack — backend, AI/ML,
              full-stack web — and side projects in production most nights,
              just to see if it can be done.
            </p>

            <p className="mt-8 max-w-2xl text-bone/70 leading-relaxed">
              Trained on CDC health records, Bitcoin candles, chart screenshots
              and 70k customer churn rows. Equally happy in Django, FastAPI,
              React or a Streamlit notebook. Generalist by practice, picky
              about craft, allergic to <span className="text-bone">"it works on my machine"</span>.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-6 border-t border-white/10 pt-6">
              {facts.map((f) => (
                <div
                  key={f.k}
                  className="group flex items-baseline justify-between gap-4 border-b border-white/10 py-3 text-sm transition-colors hover:border-neo-red/60"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50 group-hover:text-neo-red">
                    {f.k}
                  </span>
                  <span className="text-bone text-right">{f.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 border border-white/10"
        >
          {[
            { n: 10, s: '+', l: 'Projects shipped' },
            { n: 6, s: '+', l: 'Domains crossed' },
            { n: 70, s: 'k', l: 'Rows trained on' },
            { n: 4, s: 'y', l: 'Years coding' },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`relative p-6 md:p-8 ${i !== 3 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''} ${i < 2 ? 'border-b border-white/10 md:border-b-0' : ''}`}
            >
              <div className="absolute top-2 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/30">
                0{i + 1}
              </div>
              <div className="font-display text-5xl md:text-6xl font-medium text-bone">
                <Counter to={s.n} />
                <span className="text-neo-red">{s.s}</span>
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/60">
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
