import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'

const socials = [
  { icon: Mail, label: 'Email', handle: 'devashishmoghe@gmail.com', href: 'mailto:devashishmoghe@gmail.com' },
  { icon: Github, label: 'GitHub', handle: '@DMZ22', href: 'https://github.com/DMZ22' },
  { icon: Linkedin, label: 'LinkedIn', handle: '/devashish-moghe', href: 'https://www.linkedin.com/in/devashish-moghe-b5b959341/' },
]

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 border-t border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neo-red">
              § 05 — Contact
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="mt-3 font-display text-6xl md:text-8xl font-medium uppercase tracking-tightest leading-[0.85] text-bone"
            >
              Get in <br />
              <span className="font-serif italic text-neo-red">touch —</span>
            </motion.h2>
            <p className="mt-6 max-w-md text-bone/85 leading-relaxed">
              Email or LinkedIn for direct messages, GitHub for the code. Always
              happy to talk shop — backend, ML, or anything that lives between
              those two.
            </p>

            <motion.a
              href="mailto:devashishmoghe@gmail.com"
              whileHover={{ x: 6 }}
              className="mt-10 group inline-flex items-center gap-3 border-b-2 border-neo-red pb-2 font-display text-2xl md:text-3xl font-medium text-bone"
            >
              devashishmoghe@gmail.com
              <ArrowUpRight
                size={24}
                className="transition-transform group-hover:rotate-45 text-neo-red"
              />
            </motion.a>
          </div>

          <div className="col-span-12 md:col-span-7 md:border-l md:border-white/10 md:pl-10">
            <ul>
              {socials.map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group relative flex items-center justify-between py-6 md:py-8 border-b border-white/10"
                  >
                    <motion.div
                      className="absolute inset-0 bg-neo-red origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="relative flex items-center gap-5">
                      <span className="font-mono text-xs text-bone/60 group-hover:text-ink-950">
                        0{i + 1}
                      </span>
                      <s.icon size={20} className="text-bone group-hover:text-ink-950" />
                      <div>
                        <div className="font-display text-2xl md:text-3xl text-bone group-hover:text-ink-950 transition-colors">
                          {s.label}
                        </div>
                        <div className="font-mono text-xs text-bone/70 group-hover:text-ink-950/70 mt-1">
                          {s.handle}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={24}
                      className="relative text-bone/60 group-hover:text-ink-950 transition-all group-hover:rotate-45"
                    />
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-2 gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/80">
              <div>
                <div className="text-neo-red mb-1">Currently</div>
                <div className="text-bone">B.Tech CSE — AI / ML</div>
              </div>
              <div>
                <div className="text-neo-red mb-1">Location</div>
                <div className="text-bone">India · Remote</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
