import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Typewriter({
  words,
  className = '',
  typeSpeed = 55,
  deleteSpeed = 30,
  pause = 1400,
}: {
  words: string[]
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  pause?: number
}) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [del, setDel] = useState(false)

  useEffect(() => {
    const word = words[idx % words.length]
    const speed = del ? deleteSpeed : typeSpeed
    const t = setTimeout(() => {
      if (!del) {
        const next = word.slice(0, text.length + 1)
        setText(next)
        if (next.length === word.length) setTimeout(() => setDel(true), pause)
      } else {
        const next = word.slice(0, Math.max(0, text.length - 1))
        setText(next)
        if (next.length === 0) {
          setDel(false)
          setIdx((i) => i + 1)
        }
      }
    }, speed)
    return () => clearTimeout(t)
  }, [text, del, idx, words, typeSpeed, deleteSpeed, pause])

  return (
    <span className={className}>
      {text}
      <motion.span
        aria-hidden
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="ml-0.5 inline-block w-[2px] h-[0.9em] align-middle bg-neo-red"
      />
    </span>
  )
}
