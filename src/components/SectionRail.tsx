import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const sections = [
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

export default function SectionRail() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <aside
      className="pointer-events-none fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
      aria-label="Section index"
    >
      <ul className="flex flex-col gap-4 pointer-events-auto">
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <li key={s.id}>
              <a href={`#${s.id}`} className="group flex items-center gap-3 justify-end">
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.25em] transition-all ${
                    isActive
                      ? 'text-bone opacity-100 translate-x-0'
                      : 'text-bone/70 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                >
                  <span className="text-neo-red mr-2">{s.n}</span>
                  {s.label}
                </span>
                <span className="relative flex items-center justify-end w-12 h-[2px]">
                  <motion.span
                    className="absolute right-0 h-[2px] bg-bone/30"
                    animate={{ width: isActive ? 48 : 20 }}
                    transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                  <motion.span
                    className="absolute right-0 h-[2px] bg-neo-red"
                    animate={{ width: isActive ? 48 : 0 }}
                    transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
