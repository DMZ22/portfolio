import { motion } from 'framer-motion'
import { skills } from '../data/projects'

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="col-span-12 md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neo-red">
              § 03 — Toolkit
            </p>
            <h2 className="mt-3 font-display text-5xl md:text-7xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
              The <span className="font-serif italic text-neo-red">stack.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 md:pt-12">
            <p className="font-serif text-xl md:text-2xl italic text-bone/80 leading-snug">
              Opinionated about what works, curious about what's new. Boring where
              it helps, novel where it matters.
            </p>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-3 border border-white/10">
          {Object.entries(skills).map(([group, items], gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: gi * 0.05 }}
              className={`p-6 md:p-8 border-white/10 ${
                (gi + 1) % 3 !== 0 ? 'md:border-r' : ''
              } ${gi < Object.keys(skills).length - 1 ? 'border-b md:border-b' : ''}`}
            >
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/80">
                  — {group}
                </h3>
                <span className="font-mono text-[11px] text-neo-red">
                  0{gi + 1}
                </span>
              </div>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: gi * 0.05 + i * 0.04 }}
                    className="group flex items-center justify-between border-b border-white/5 pb-1.5 cursor-default"
                  >
                    <span className="font-display text-lg text-bone/90 group-hover:text-bone">
                      {item}
                    </span>
                    <span className="font-mono text-[11px] text-bone/30 group-hover:text-neo-red transition-colors">
                      →
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
