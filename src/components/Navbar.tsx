import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState, useEffect } from 'react'
import SoundToggle from './SoundToggle'
import { BrandMark } from './BrandMark'
import MobileMenu from './MobileMenu'

const items = [
  { id: 'home', n: '00', label: 'Home' },
  { id: 'about', n: '01', label: 'About' },
  { id: 'experience', n: '02', label: 'Résumé' },
  { id: 'projects', n: '03', label: 'Work' },
  { id: 'skills', n: '04', label: 'Stack' },
  { id: 'contact', n: '05', label: 'Contact' },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  const [stuck, setStuck] = useState(false)
  const [time, setTime] = useState('')
  useMotionValueEvent(scrollY, 'change', (y) => setStuck(y > 40))

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const hh = d.getUTCHours().toString().padStart(2, '0')
      const mm = d.getUTCMinutes().toString().padStart(2, '0')
      const ss = d.getUTCSeconds().toString().padStart(2, '0')
      setTime(`${hh}:${mm}:${ss} UTC`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        stuck ? 'bg-ink-950/90 backdrop-blur border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#home" className="group flex items-center">
          <BrandMark size={30} />
        </a>

        <ul className="hidden lg:flex items-center gap-1 text-xs font-mono uppercase tracking-[0.2em]">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className="group flex items-center gap-1.5 px-3 py-2 text-bone/70 transition-colors hover:text-bone"
              >
                <span className="text-neo-red/70 group-hover:text-neo-red transition-colors">{it.n}</span>
                <span>{it.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="flex items-center gap-1.5 text-bone/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-neo-red animate-pulse" />
            {time}
          </span>
          <SoundToggle />
          <a
            href="/DevCV3.2.pdf"
            download
            className="group relative border border-neo-red bg-neo-red px-3 py-2 text-ink-950 font-semibold transition-all hover:-translate-y-0.5"
          >
            ↓ Résumé
          </a>
        </div>

        {/* Mobile menu trigger */}
        <MobileMenu />
      </div>
    </motion.header>
  )
}
