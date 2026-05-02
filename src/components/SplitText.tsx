import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

export default function SplitText({
  children,
  className = '',
  delay = 0,
  stagger = 0.04,
  y = 48,
  as: Tag = 'span',
}: {
  children: string
  className?: string
  delay?: number
  stagger?: number
  y?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const words = children.split(' ')
  return (
    <Tag ref={ref as never} className={`inline-block ${className}`} aria-label={children}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-baseline pb-[0.08em] pr-[0.22em]">
          <motion.span
            initial={{ y, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : undefined}
            transition={{
              duration: 0.7,
              delay: delay + wi * stagger,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function SplitChars({
  children,
  className = '',
  delay = 0,
  stagger = 0.025,
}: {
  children: string
  className?: string
  delay?: number
  stagger?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  return (
    <span ref={ref} className={className} aria-label={children}>
      {children.split('').map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            initial={{ y: '100%' }}
            animate={inView ? { y: '0%' } : undefined}
            transition={{ duration: 0.6, delay: delay + i * stagger, ease: [0.2, 0.8, 0.2, 1] }}
            className="inline-block"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
