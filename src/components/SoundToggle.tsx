import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { initSound, isSoundEnabled, setSoundEnabled, playClick } from '../lib/sounds'

export default function SoundToggle() {
  const [on, setOn] = useState(true)
  useEffect(() => {
    initSound()
    setOn(isSoundEnabled())
  }, [])
  const toggle = () => {
    const next = !on
    setSoundEnabled(next)
    setOn(next)
    if (next) playClick()
  }
  return (
    <button
      onClick={toggle}
      aria-label={on ? 'Mute sound effects' : 'Enable sound effects'}
      className="group relative flex h-9 w-9 items-center justify-center border border-white/15 text-bone/70 transition-colors hover:border-neo-red hover:text-neo-red"
    >
      {on ? <Volume2 size={14} /> : <VolumeX size={14} />}
      <span className="pointer-events-none absolute -bottom-5 right-0 font-mono text-[8px] uppercase tracking-[0.25em] text-bone/40 opacity-0 transition-opacity group-hover:opacity-100">
        {on ? 'sfx on' : 'sfx off'}
      </span>
      {on && (
        <span className="pointer-events-none absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-neo-red animate-pulse" />
      )}
    </button>
  )
}
